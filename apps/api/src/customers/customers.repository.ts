import { Injectable } from '@nestjs/common'
import { PrismaService } from '../common/prisma/prisma.service'
import { Prisma, SyncStatus } from '@prisma/client'

export interface CustomerFilters {
  search?: string
  syncStatus?: SyncStatus
  city?: string
}

export interface PaginationParams {
  page: number
  limit: number
}

@Injectable()
export class CustomersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(filters: CustomerFilters, pagination: PaginationParams) {
    const where: Prisma.CustomerWhereInput = {}

    if (filters.search) {
      where.OR = [
        { legalName: { contains: filters.search, mode: 'insensitive' } },
        { tradeName: { contains: filters.search, mode: 'insensitive' } },
        { externalId: { contains: filters.search } },
      ]
    }

    if (filters.syncStatus) {
      where.syncStatus = filters.syncStatus
    }

    if (filters.city) {
      where.city = { contains: filters.city, mode: 'insensitive' }
    }

    const [data, total] = await Promise.all([
      this.prisma.customer.findMany({
        where,
        skip: (pagination.page - 1) * pagination.limit,
        take: pagination.limit,
        orderBy: { legalName: 'asc' },
        include: {
          _count: {
            select: { contracts: true, invoices: true },
          },
        },
      }),
      this.prisma.customer.count({ where }),
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
    return this.prisma.customer.findUnique({
      where: { id },
      include: {
        contacts: true,
        contracts: {
          include: {
            branch: true,
            plan: true,
          },
        },
        financialProfile: true,
      },
    })
  }

  async findByExternalId(externalId: string) {
    return this.prisma.customer.findUnique({
      where: { externalId },
    })
  }

  async upsertFromIxc(data: {
    externalId: string
    legalName: string
    tradeName?: string
    documentMasked?: string
    city?: string
    district?: string
    addressMasked?: string
    sourceUpdatedAt?: Date
    checksum?: string
  }) {
    return this.prisma.customer.upsert({
      where: { externalId: data.externalId },
      create: {
        ...data,
        syncStatus: SyncStatus.SYNCED,
        syncedAt: new Date(),
      },
      update: {
        ...data,
        syncStatus: SyncStatus.SYNCED,
        syncedAt: new Date(),
      },
    })
  }

  async updateSyncStatus(id: string, status: SyncStatus) {
    return this.prisma.customer.update({
      where: { id },
      data: { syncStatus: status },
    })
  }

  async getStaleCustomers(threshold: Date) {
    return this.prisma.customer.findMany({
      where: {
        OR: [{ syncedAt: { lt: threshold } }, { syncedAt: null }],
      },
      take: 100,
    })
  }
}
