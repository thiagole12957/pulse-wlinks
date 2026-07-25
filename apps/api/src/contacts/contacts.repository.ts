import { Injectable } from '@nestjs/common'
import { PrismaService } from '../common/prisma/prisma.service'
import { Prisma } from '@prisma/client'
import { ContactChannel, ContactOutcome } from '@prisma/client'

export interface CreateContactAttemptDto {
  caseId: string
  actorUserId: string
  channel: ContactChannel
  outcome: ContactOutcome
  externalThreadId?: string
  summary?: string
  contactedAt?: Date
  metadata?: Record<string, unknown>
}

@Injectable()
export class ContactsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    return this.prisma.contactAttempt.findUnique({
      where: { id },
      include: {
        case: {
          include: { customer: true },
        },
      },
    })
  }

  async findByCaseId(caseId: string) {
    return this.prisma.contactAttempt.findMany({
      where: { caseId },
      orderBy: { contactedAt: 'desc' },
    })
  }

  async findByActorUserId(actorUserId: string, limit = 50) {
    return this.prisma.contactAttempt.findMany({
      where: { actorUserId },
      include: {
        case: {
          include: { customer: true },
        },
      },
      orderBy: { contactedAt: 'desc' },
      take: limit,
    })
  }

  async findByCustomerId(customerId: string) {
    return this.prisma.contactAttempt.findMany({
      where: { case: { customerId } },
      include: { case: true },
      orderBy: { contactedAt: 'desc' },
    })
  }

  async create(data: CreateContactAttemptDto) {
    return this.prisma.contactAttempt.create({
      data: {
        caseId: data.caseId,
        actorUserId: data.actorUserId,
        channel: data.channel,
        outcome: data.outcome,
        externalThreadId: data.externalThreadId,
        summary: data.summary,
        contactedAt: data.contactedAt ?? new Date(),
        metadata: (data.metadata ?? {}) as Prisma.InputJsonValue,
      },
    })
  }

  async countByCaseId(caseId: string) {
    return this.prisma.contactAttempt.count({
      where: { caseId },
    })
  }

  async countByCustomerId(customerId: string) {
    return this.prisma.contactAttempt.count({
      where: { case: { customerId } },
    })
  }

  async countByOutcome(caseId: string, outcome: ContactOutcome) {
    return this.prisma.contactAttempt.count({
      where: { caseId, outcome },
    })
  }

  async getLastContactByCaseId(caseId: string) {
    return this.prisma.contactAttempt.findFirst({
      where: { caseId },
      orderBy: { contactedAt: 'desc' },
    })
  }

  async getContactStatsByCaseId(caseId: string) {
    const attempts = await this.prisma.contactAttempt.findMany({
      where: { caseId },
    })

    const byChannel: Record<ContactChannel, number> = {
      WHATSAPP: 0,
      PHONE: 0,
      EMAIL: 0,
      SMS: 0,
      OTHER: 0,
    }

    const byOutcome: Record<ContactOutcome, number> = {
      NO_ANSWER: 0,
      ANSWERED: 0,
      CUSTOMER_WILL_PAY: 0,
      PAYMENT_ALREADY_MADE: 0,
      REQUESTED_NEGOTIATION: 0,
      TECHNICAL_PROBLEM: 0,
      WANTS_CANCEL: 0,
      MOVED_ADDRESS: 0,
      DOES_NOT_RECOGNIZE: 0,
      WRONG_CONTACT: 0,
      OTHER: 0,
    }

    for (const attempt of attempts) {
      byChannel[attempt.channel]++
      byOutcome[attempt.outcome]++
    }

    return {
      total: attempts.length,
      byChannel,
      byOutcome,
      lastContact: attempts[0] ?? null,
      successfulContacts: attempts.filter((a) => a.outcome === 'ANSWERED').length,
    }
  }
}
