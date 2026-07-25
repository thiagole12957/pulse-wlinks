import { Injectable } from '@nestjs/common'
import { PrismaService } from '../common/prisma/prisma.service'
import { Prisma, ContractStatus, InternetStatus, SyncStatus } from '@prisma/client'

export interface ContractFilters {
  customerId?: string
  branchId?: string
  status?: ContractStatus
  internetStatus?: InternetStatus
}

@Injectable()
export class ContractsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(filters: ContractFilters, pagination: { page: number; limit: number }) {
    const where: Prisma.ContractWhereInput = {}

    if (filters.customerId) where.customerId = filters.customerId
    if (filters.branchId) where.branchId = filters.branchId
    if (filters.status) where.status = filters.status
    if (filters.internetStatus) where.internetStatus = filters.internetStatus

    const [data, total] = await Promise.all([
      this.prisma.contract.findMany({
        where,
        skip: (pagination.page - 1) * pagination.limit,
        take: pagination.limit,
        include: {
          customer: { select: { id: true, legalName: true } },
          branch: { select: { id: true, name: true } },
          plan: { select: { id: true, name: true, monthlyFee: true } },
          _count: { select: { invoices: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.contract.count({ where }),
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
    return this.prisma.contract.findUnique({
      where: { id },
      include: {
        customer: true,
        branch: true,
        plan: true,
        accessAccounts: true,
        invoices: {
          where: { status: 'OPEN' },
          orderBy: { dueAt: 'asc' },
        },
      },
    })
  }

  async findByExternalId(externalId: string) {
    return this.prisma.contract.findUnique({
      where: { externalId },
    })
  }

  async upsertFromIxc(data: {
    externalId: string
    customerId: string
    branchId?: string
    status: ContractStatus
    internetStatus: InternetStatus
    sourceUpdatedAt?: Date
    checksum?: string
  }) {
    return this.prisma.contract.upsert({
      where: { externalId: data.externalId },
      create: {
        ...data,
        syncStatus: SyncStatus.SYNCED,
        syncedAt: new Date(),
      },
      update: {
        status: data.status,
        internetStatus: data.internetStatus,
        sourceUpdatedAt: data.sourceUpdatedAt,
        checksum: data.checksum,
        syncStatus: SyncStatus.SYNCED,
        syncedAt: new Date(),
      },
    })
  }

  async getBlockedWithOnlineAccess() {
    return this.prisma.contract.findMany({
      where: {
        OR: [
          { internetStatus: InternetStatus.AUTO_BLOCKED },
          { internetStatus: InternetStatus.MANUAL_BLOCKED },
        ],
        accessAccounts: {
          some: { online: true },
        },
      },
      include: {
        customer: true,
        accessAccounts: { where: { online: true } },
      },
    })
  }
}
