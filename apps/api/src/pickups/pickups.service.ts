import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'
import { PickupsRepository } from './pickups.repository'
import { ContactsService } from '../contacts/contacts.service'
import { PromisesService } from '../promises/promises.service'
import { LoggerService } from '../common/logger/logger.service'
import { PrismaService } from '../common/prisma/prisma.service'
import { PickupStatus } from '@prisma/client'

@Injectable()
export class PickupsService {
  constructor(
    private readonly repository: PickupsRepository,
    private readonly contactsService: ContactsService,
    private readonly promisesService: PromisesService,
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService
  ) {}

  // Assessments
  async getAssessmentById(id: string) {
    const assessment = await this.repository.findAssessmentById(id)
    if (!assessment) {
      throw new NotFoundException(`Avaliação ${id} não encontrada`)
    }
    return assessment
  }

  async getAssessmentsByCaseId(caseId: string) {
    return this.repository.findAssessmentsByCaseId(caseId)
  }

  async createAssessment(caseId: string, createdById: string) {
    // Get case
    const relationshipCase = await this.prisma.relationshipCase.findUnique({
      where: { id: caseId },
      include: {
        customer: true,
        contract: {
          include: { accessAccounts: true },
        },
      },
    })

    if (!relationshipCase) {
      throw new NotFoundException(`Caso ${caseId} não encontrado`)
    }

    // Gather data for assessment
    const contactStats = await this.contactsService.getContactStatsByCaseId(caseId)
    const activePromises = await this.promisesService.getActiveByCustomerId(
      relationshipCase.customerId
    )

    // Check if equipment is offline
    const offlineAccount = relationshipCase.contract?.accessAccounts?.find(
      (a) => a.online === false
    )
    const offlineSince = offlineAccount?.lastConnectionEndAt ?? undefined

    // Determine recommendation based on rules
    const hasActivePromise = activePromises.length > 0
    const hasBlockingTechnicalOrder = false // Would check technical orders here
    const contactAttempts = contactStats.total

    let recommendation: string
    const rationale: Record<string, unknown> = {
      contactAttempts,
      hasActivePromise,
      hasBlockingTechnicalOrder,
      offlineSince,
      caseStatus: relationshipCase.status,
    }

    // Rules per documentation:
    // - Offline alone doesn't authorize pickup
    // - Pickup requires triage and supervisor approval by default
    if (hasActivePromise) {
      recommendation = 'AGUARDAR'
      rationale.reason = 'Existe promessa de pagamento ativa'
    } else if (hasBlockingTechnicalOrder) {
      recommendation = 'AGUARDAR'
      rationale.reason = 'Existe ordem técnica bloqueante'
    } else if (contactAttempts < 3) {
      recommendation = 'MAIS_CONTATOS'
      rationale.reason = `Apenas ${contactAttempts} tentativas de contato realizadas`
    } else if (!offlineSince) {
      recommendation = 'AVALIAR'
      rationale.reason = 'Cliente não está offline. Avaliar necessidade de recolhimento.'
    } else {
      recommendation = 'APTO_RECOLHIMENTO'
      rationale.reason =
        'Cliente offline, sem promessa ativa, múltiplas tentativas de contato sem sucesso'
    }

    this.logger.log(
      `Criando avaliação de recolhimento para caso ${caseId}: ${recommendation}`,
      'PickupsService'
    )

    return this.repository.createAssessment({
      caseId,
      createdById,
      offlineSince,
      contactAttempts,
      hasActivePromise,
      hasBlockingTechnicalOrder,
      recommendation,
      rationale,
    })
  }

  // Requests
  async getRequestById(id: string) {
    const request = await this.repository.findRequestById(id)
    if (!request) {
      throw new NotFoundException(`Solicitação ${id} não encontrada`)
    }
    return request
  }

  async getPendingApproval() {
    return this.repository.findPendingApproval()
  }

  async createRequest(assessmentId: string, requestedById: string) {
    const assessment = await this.getAssessmentById(assessmentId)

    if (assessment.recommendation !== 'APTO_RECOLHIMENTO') {
      throw new BadRequestException(
        `Avaliação com recomendação "${assessment.recommendation}" não permite criar solicitação de recolhimento`
      )
    }

    if (assessment.request) {
      throw new BadRequestException('Já existe uma solicitação para esta avaliação')
    }

    this.logger.log(
      `Criando solicitação de recolhimento para avaliação ${assessmentId}`,
      'PickupsService'
    )

    const request = await this.repository.createRequest({
      assessmentId,
      requestedById,
    })

    // Update case status
    await this.prisma.relationshipCase.update({
      where: { id: assessment.caseId },
      data: {
        status: 'PICKUP_PENDING_APPROVAL',
        lastActivityAt: new Date(),
      },
    })

    return request
  }

  async approve(requestId: string, approvedById: string) {
    const request = await this.getRequestById(requestId)

    if (request.status !== PickupStatus.PENDING_APPROVAL) {
      throw new BadRequestException('Apenas solicitações pendentes podem ser aprovadas')
    }

    this.logger.log(
      `Aprovando solicitação de recolhimento ${requestId}`,
      'PickupsService'
    )

    const updated = await this.repository.approveRequest(requestId, approvedById)

    // Update case status
    await this.prisma.relationshipCase.update({
      where: { id: request.assessment.caseId },
      data: {
        status: 'PICKUP_OPENED',
        lastActivityAt: new Date(),
      },
    })

    return updated
  }

  async reject(requestId: string, approvedById: string, rejectionReason: string) {
    const request = await this.getRequestById(requestId)

    if (request.status !== PickupStatus.PENDING_APPROVAL) {
      throw new BadRequestException('Apenas solicitações pendentes podem ser rejeitadas')
    }

    this.logger.log(
      `Rejeitando solicitação de recolhimento ${requestId}: ${rejectionReason}`,
      'PickupsService'
    )

    const updated = await this.repository.rejectRequest(
      requestId,
      approvedById,
      rejectionReason
    )

    // Update case status back
    await this.prisma.relationshipCase.update({
      where: { id: request.assessment.caseId },
      data: {
        status: 'PICKUP_CANDIDATE',
        lastActivityAt: new Date(),
      },
    })

    return updated
  }

  async openInGc(requestId: string, gcExternalId: string) {
    const request = await this.getRequestById(requestId)

    if (request.status !== PickupStatus.APPROVED) {
      throw new BadRequestException(
        'Apenas solicitações aprovadas podem ser abertas no GC'
      )
    }

    this.logger.log(
      `Abrindo OS de recolhimento ${requestId} no GC: ${gcExternalId}`,
      'PickupsService'
    )

    return this.repository.markAsOpenedInGc(requestId, gcExternalId)
  }

  async complete(requestId: string) {
    const request = await this.getRequestById(requestId)

    if (request.status !== PickupStatus.OPENED_IN_GC) {
      throw new BadRequestException(
        'Apenas solicitações abertas no GC podem ser concluídas'
      )
    }

    this.logger.log(
      `Concluindo recolhimento ${requestId}`,
      'PickupsService'
    )

    const updated = await this.repository.markAsCompleted(requestId)

    // Update case status
    await this.prisma.relationshipCase.update({
      where: { id: request.assessment.caseId },
      data: {
        status: 'CLOSED',
        closedAt: new Date(),
        lastActivityAt: new Date(),
      },
    })

    return updated
  }

  async cancel(requestId: string) {
    const request = await this.getRequestById(requestId)

    if (
      request.status === PickupStatus.COMPLETED ||
      request.status === PickupStatus.CANCELED
    ) {
      throw new BadRequestException('Solicitação não pode ser cancelada')
    }

    this.logger.log(
      `Cancelando solicitação de recolhimento ${requestId}`,
      'PickupsService'
    )

    return this.repository.cancel(requestId)
  }

  async getStatusSummary() {
    return this.repository.countByStatus()
  }
}
