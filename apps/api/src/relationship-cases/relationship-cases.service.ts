import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { RelationshipCasesRepository, CaseFilters } from './relationship-cases.repository'
import { EligibilityService } from './eligibility.service'
import { LoggerService } from '../common/logger/logger.service'
import { CaseStatus } from '@prisma/client'

const VALID_TRANSITIONS: Record<CaseStatus, CaseStatus[]> = {
  [CaseStatus.NEW]: [CaseStatus.ASSIGNED],
  [CaseStatus.ASSIGNED]: [CaseStatus.IN_ANALYSIS, CaseStatus.CONTACTING],
  [CaseStatus.IN_ANALYSIS]: [CaseStatus.CONTACTING, CaseStatus.NO_CONTACT],
  [CaseStatus.CONTACTING]: [
    CaseStatus.CUSTOMER_REPLIED,
    CaseStatus.NO_CONTACT,
    CaseStatus.WAITING_PAYMENT,
  ],
  [CaseStatus.CUSTOMER_REPLIED]: [
    CaseStatus.WAITING_PAYMENT,
    CaseStatus.PROMISE_ACTIVE,
    CaseStatus.NEGOTIATING,
  ],
  [CaseStatus.WAITING_PAYMENT]: [CaseStatus.REGULARIZED, CaseStatus.PROMISE_BROKEN],
  [CaseStatus.PROMISE_ACTIVE]: [
    CaseStatus.REGULARIZED,
    CaseStatus.PROMISE_BROKEN,
    CaseStatus.WAITING_PAYMENT,
  ],
  [CaseStatus.NEGOTIATING]: [CaseStatus.PROMISE_ACTIVE, CaseStatus.NO_CONTACT],
  [CaseStatus.PROMISE_BROKEN]: [CaseStatus.CONTACTING, CaseStatus.NO_CONTACT, CaseStatus.PICKUP_CANDIDATE],
  [CaseStatus.NO_CONTACT]: [CaseStatus.CONTACTING, CaseStatus.PICKUP_CANDIDATE],
  [CaseStatus.PICKUP_CANDIDATE]: [CaseStatus.PICKUP_PENDING_APPROVAL, CaseStatus.CONTACTING],
  [CaseStatus.PICKUP_PENDING_APPROVAL]: [CaseStatus.PICKUP_OPENED, CaseStatus.CONTACTING],
  [CaseStatus.PICKUP_OPENED]: [CaseStatus.REGULARIZED, CaseStatus.CLOSED],
  [CaseStatus.REGULARIZED]: [CaseStatus.CLOSED],
  [CaseStatus.CLOSED]: [],
}

@Injectable()
export class RelationshipCasesService {
  constructor(
    private readonly repository: RelationshipCasesRepository,
    private readonly eligibilityService: EligibilityService,
    private readonly logger: LoggerService
  ) {}

  async findMany(filters: CaseFilters, pagination: { page: number; limit: number }) {
    return this.repository.findMany(filters, pagination)
  }

  async findById(id: string) {
    const caseData = await this.repository.findById(id)
    if (!caseData) {
      throw new NotFoundException(`Caso ${id} não encontrado`)
    }
    return caseData
  }

  async transition(id: string, newStatus: CaseStatus, userId: string) {
    const caseData = await this.findById(id)

    const validNextStatuses = VALID_TRANSITIONS[caseData.status]
    if (!validNextStatuses?.includes(newStatus)) {
      throw new BadRequestException(
        `Transição inválida: ${caseData.status} -> ${newStatus}`
      )
    }

    return this.repository.updateStatus(id, newStatus, userId)
  }

  async assign(id: string, userId: string, teamId?: string) {
    const caseData = await this.findById(id)

    if (caseData.status !== CaseStatus.NEW && caseData.status !== CaseStatus.ASSIGNED) {
      throw new BadRequestException(
        `Caso não pode ser atribuído no status ${caseData.status}`
      )
    }

    return this.repository.assign(id, userId, teamId)
  }

  async evaluateAndCreateCases() {
    this.logger.log('Avaliando elegibilidade e criando casos', 'RelationshipCasesService')

    const eligibleInvoices = await this.eligibilityService.evaluateEligibility()

    // Agrupar por cliente
    const byCustomer = eligibleInvoices.reduce(
      (acc, invoice) => {
        if (!acc[invoice.customerId]) {
          acc[invoice.customerId] = []
        }
        acc[invoice.customerId].push(invoice)
        return acc
      },
      {} as Record<string, typeof eligibleInvoices>
    )

    let created = 0
    let skipped = 0

    for (const [customerId, invoices] of Object.entries(byCustomer)) {
      // Verificar se já existe caso aberto
      const existingCase = await this.repository.findExistingCase(
        customerId,
        invoices[0]?.contractId ?? undefined
      )

      if (existingCase) {
        skipped++
        continue
      }

      // Calcular score de prioridade
      const totalAmount = invoices.reduce((sum, inv) => sum + Number(inv.openAmount), 0)
      const maxDaysOverdue = Math.max(...invoices.map((inv) => inv.daysOverdue))

      const priorityScore = this.eligibilityService.calculatePriorityScore({
        daysOverdue: maxDaysOverdue,
        totalAmount,
        invoiceCount: invoices.length,
        isBlocked: false, // Será verificado com dados do contrato
        isOnline: false,
        hasBrokenPromise: false,
        noContactAttempts: true,
      })

      await this.repository.create({
        customerId,
        contractId: invoices[0]?.contractId ?? undefined,
        priorityScore,
        invoiceIds: invoices.map((inv) => inv.id),
      })

      created++
    }

    this.logger.log(
      `Avaliação concluída: ${created} casos criados, ${skipped} ignorados`,
      'RelationshipCasesService'
    )

    return { created, skipped, evaluated: eligibleInvoices.length }
  }

  async getQueueStats(branchId?: string) {
    return this.repository.getQueueStats(branchId)
  }
}
