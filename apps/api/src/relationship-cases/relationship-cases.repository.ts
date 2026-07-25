import { Injectable } from '@nestjs/common'
import { PrismaService } from '../common/prisma/prisma.service'
import { Prisma, CaseStatus } from '@prisma/client'

export interface CaseFilters {
  status?: CaseStatus
  assignedUserId?: string
  customerId?: string
  branchId?: string
  walletId?: string
  priorityMin?: number
}

@Injectable()
export class RelationshipCasesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(filters: CaseFilters, pagination: { page: number; limit: number }) {
    const where: Prisma.RelationshipCaseWhereInput = {}

    if (filters.status) where.status = filters.status
    if (filters.assignedUserId) where.assignedUserId = filters.assignedUserId
    if (filters.customerId) where.customerId = filters.customerId
    if (filters.priorityMin) where.priorityScore = { gte: filters.priorityMin }

    if (filters.branchId) {
      where.contract = { branchId: filters.branchId }
    }

    const [data, total] = await Promise.all([
      this.prisma.relationshipCase.findMany({
        where,
        skip: (pagination.page - 1) * pagination.limit,
        take: pagination.limit,
        include: {
          customer: { select: { id: true, legalName: true, documentMasked: true } },
          contract: {
            select: {
              id: true,
              externalId: true,
              status: true,
              internetStatus: true,
              branch: { select: { id: true, name: true } },
            },
          },
          invoices: {
            include: { invoice: true },
          },
          _count: {
            select: { contacts: true, promises: true, tasks: true },
          },
        },
        orderBy: [{ priorityScore: 'desc' }, { openedAt: 'asc' }],
      }),
      this.prisma.relationshipCase.count({ where }),
    ])

    return {
      data,
      meta: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit),
      },
    }
  }

  async findById(id: string) {
    return this.prisma.relationshipCase.findUnique({
      where: { id },
      include: {
        customer: {
          include: {
            contacts: true,
            financialProfile: true,
          },
        },
        contract: {
          include: {
            branch: true,
            plan: true,
            accessAccounts: true,
          },
        },
        invoices: {
          include: { invoice: true },
        },
        contacts: { orderBy: { contactedAt: 'desc' } },
        promises: { orderBy: { createdAt: 'desc' } },
        tasks: { orderBy: { dueAt: 'asc' } },
        notes: { orderBy: { createdAt: 'desc' } },
        insights: { orderBy: { createdAt: 'desc' }, take: 1 },
        pickupAssessments: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
    })
  }

  async create(data: {
    customerId: string
    contractId?: string
    priorityScore?: number
    invoiceIds?: string[]
  }) {
    return this.prisma.relationshipCase.create({
      data: {
        customerId: data.customerId,
        contractId: data.contractId,
        priorityScore: data.priorityScore ?? 0,
        status: CaseStatus.NEW,
        invoices: data.invoiceIds
          ? {
              create: data.invoiceIds.map((invoiceId) => ({
                invoiceId,
              })),
            }
          : undefined,
      },
      include: {
        customer: true,
        invoices: { include: { invoice: true } },
      },
    })
  }

  async updateStatus(id: string, status: CaseStatus, userId?: string) {
    const updateData: Prisma.RelationshipCaseUpdateInput = {
      status,
      lastActivityAt: new Date(),
      version: { increment: 1 },
    }

    if (status === CaseStatus.ASSIGNED && userId) {
      updateData.assignedUserId = userId
    }

    if (status === CaseStatus.REGULARIZED) {
      updateData.regularizedAt = new Date()
    }

    if (status === CaseStatus.CLOSED) {
      updateData.closedAt = new Date()
    }

    return this.prisma.relationshipCase.update({
      where: { id },
      data: updateData,
    })
  }

  async assign(id: string, userId: string, teamId?: string) {
    return this.prisma.relationshipCase.update({
      where: { id },
      data: {
        assignedUserId: userId,
        assignedTeamId: teamId,
        status: CaseStatus.ASSIGNED,
        lastActivityAt: new Date(),
      },
    })
  }

  async findExistingCase(customerId: string, contractId?: string) {
    return this.prisma.relationshipCase.findFirst({
      where: {
        customerId,
        contractId,
        status: {
          notIn: [CaseStatus.CLOSED, CaseStatus.REGULARIZED],
        },
      },
    })
  }

  async getQueueStats(branchId?: string) {
    const where: Prisma.RelationshipCaseWhereInput = branchId
      ? { contract: { branchId } }
      : {}

    const stats = await this.prisma.relationshipCase.groupBy({
      by: ['status'],
      where,
      _count: true,
    })

    return stats.reduce(
      (acc, stat) => {
        acc[stat.status] = stat._count
        return acc
      },
      {} as Record<CaseStatus, number>
    )
  }
}
