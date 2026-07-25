import { Injectable } from '@nestjs/common'
import { PrismaService } from '../common/prisma/prisma.service'
import { Prisma } from '@prisma/client'

export interface CreateAuditEventDto {
  actorUserId?: string
  action: string
  resourceType: string
  resourceId?: string
  branchScope?: string
  walletScope?: string
  result: 'SUCCESS' | 'FAILURE' | 'DENIED'
  correlationId?: string
  ipMasked?: string
  userAgent?: string
  metadata?: Record<string, unknown>
}

export interface AuditQueryOptions {
  actorUserId?: string
  resourceType?: string
  resourceId?: string
  action?: string
  result?: string
  startDate?: Date
  endDate?: Date
  limit?: number
  offset?: number
}

@Injectable()
export class AuditRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateAuditEventDto) {
    return this.prisma.auditEvent.create({
      data: {
        actorUserId: data.actorUserId,
        action: data.action,
        resourceType: data.resourceType,
        resourceId: data.resourceId,
        branchScope: data.branchScope,
        walletScope: data.walletScope,
        result: data.result,
        correlationId: data.correlationId,
        ipMasked: data.ipMasked,
        userAgent: data.userAgent,
        metadata: (data.metadata ?? {}) as Prisma.InputJsonValue,
        occurredAt: new Date(),
      },
    })
  }

  async findById(id: string) {
    return this.prisma.auditEvent.findUnique({
      where: { id },
    })
  }

  async query(options: AuditQueryOptions) {
    const where: Record<string, unknown> = {}

    if (options.actorUserId) {
      where.actorUserId = options.actorUserId
    }

    if (options.resourceType) {
      where.resourceType = options.resourceType
    }

    if (options.resourceId) {
      where.resourceId = options.resourceId
    }

    if (options.action) {
      where.action = options.action
    }

    if (options.result) {
      where.result = options.result
    }

    if (options.startDate || options.endDate) {
      where.occurredAt = {}
      if (options.startDate) {
        (where.occurredAt as Record<string, Date>).gte = options.startDate
      }
      if (options.endDate) {
        (where.occurredAt as Record<string, Date>).lte = options.endDate
      }
    }

    const [events, total] = await Promise.all([
      this.prisma.auditEvent.findMany({
        where,
        orderBy: { occurredAt: 'desc' },
        take: options.limit ?? 50,
        skip: options.offset ?? 0,
      }),
      this.prisma.auditEvent.count({ where }),
    ])

    return { events, total }
  }

  async findByResource(resourceType: string, resourceId: string, limit = 50) {
    return this.prisma.auditEvent.findMany({
      where: { resourceType, resourceId },
      orderBy: { occurredAt: 'desc' },
      take: limit,
    })
  }

  async findByCorrelationId(correlationId: string) {
    return this.prisma.auditEvent.findMany({
      where: { correlationId },
      orderBy: { occurredAt: 'asc' },
    })
  }

  async countByActionAndPeriod(
    action: string,
    startDate: Date,
    endDate: Date
  ) {
    return this.prisma.auditEvent.count({
      where: {
        action,
        occurredAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    })
  }

  async getActivitySummary(startDate: Date, endDate: Date) {
    const result = await this.prisma.auditEvent.groupBy({
      by: ['action', 'result'],
      where: {
        occurredAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      _count: true,
    })

    return result.map((r) => ({
      action: r.action,
      result: r.result,
      count: r._count,
    }))
  }
}
