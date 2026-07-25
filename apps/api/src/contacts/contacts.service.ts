import { Injectable, NotFoundException } from '@nestjs/common'
import { ContactsRepository, CreateContactAttemptDto } from './contacts.repository'
import { LoggerService } from '../common/logger/logger.service'
import { PrismaService } from '../common/prisma/prisma.service'
import { ContactOutcome } from '@prisma/client'

@Injectable()
export class ContactsService {
  constructor(
    private readonly repository: ContactsRepository,
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService
  ) {}

  async getById(id: string) {
    const contact = await this.repository.findById(id)
    if (!contact) {
      throw new NotFoundException(`Contato ${id} não encontrado`)
    }
    return contact
  }

  async getByCaseId(caseId: string) {
    return this.repository.findByCaseId(caseId)
  }

  async getByCustomerId(customerId: string) {
    return this.repository.findByCustomerId(customerId)
  }

  async getContactStatsByCaseId(caseId: string) {
    return this.repository.getContactStatsByCaseId(caseId)
  }

  async create(data: CreateContactAttemptDto) {
    // Validate case exists
    const caseExists = await this.prisma.relationshipCase.findUnique({
      where: { id: data.caseId },
    })

    if (!caseExists) {
      throw new NotFoundException(`Caso ${data.caseId} não encontrado`)
    }

    this.logger.log(
      `Registrando contato para caso ${data.caseId}: ${data.channel} - ${data.outcome}`,
      'ContactsService'
    )

    const contact = await this.repository.create(data)

    // Update case based on outcome
    const newCaseStatus = this.determineNewCaseStatus(data.outcome)
    const updateData: Record<string, unknown> = {
      lastActivityAt: new Date(),
    }

    if (newCaseStatus) {
      updateData.status = newCaseStatus
    }

    // Set first contact date if not set
    if (!caseExists.firstContactAt) {
      updateData.firstContactAt = new Date()
    }

    await this.prisma.relationshipCase.update({
      where: { id: data.caseId },
      data: updateData,
    })

    return contact
  }

  private determineNewCaseStatus(outcome: ContactOutcome): string | null {
    switch (outcome) {
      case 'NO_ANSWER':
        return null // Keep current status
      case 'ANSWERED':
        return 'CUSTOMER_REPLIED'
      case 'CUSTOMER_WILL_PAY':
        return 'WAITING_PAYMENT'
      case 'PAYMENT_ALREADY_MADE':
        return 'WAITING_PAYMENT'
      case 'REQUESTED_NEGOTIATION':
        return 'NEGOTIATING'
      case 'TECHNICAL_PROBLEM':
        return 'IN_ANALYSIS'
      case 'WANTS_CANCEL':
        return 'IN_ANALYSIS'
      case 'MOVED_ADDRESS':
        return 'IN_ANALYSIS'
      case 'DOES_NOT_RECOGNIZE':
        return 'IN_ANALYSIS'
      case 'WRONG_CONTACT':
        return 'NO_CONTACT'
      default:
        return null
    }
  }

  async getMyRecentContacts(userId: string, limit = 50) {
    return this.repository.findByActorUserId(userId, limit)
  }
}
