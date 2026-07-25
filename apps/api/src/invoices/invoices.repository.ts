import { Injectable } from '@nestjs/common'
import { PrismaService } from '../common/prisma/prisma.service'
import { Prisma, InvoiceStatus, SyncStatus } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'

export interface InvoiceFilters {
  customerId?: string
  contractId?: string
  walletId?: string
  status?: InvoiceStatus
  overdueDays?: number
  minAmount?: number
}

@Injectable()
export class InvoicesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(filters: InvoiceFilters, pagination: { page: number; limit: number }) {
    const where: Prisma.InvoiceWhereInput = {}

    if (filters.customerId) where.customerId = filters.customerId
    if (filters.contractId) where.contractId = filters.contractId
    if (filters.walletId) where.walletId = filters.walletId
    if (filters.status) where.status = filters.status

    if (filters.overdueDays) {
      const overdueDate = new Date()
      overdueDate.setDate(overdueDate.getDate() - filters.overdueDays)
      where.dueAt = { lt: overdueDate }
      where.status = InvoiceStatus.OPEN
    }

    if (filters.minAmount) {
      where.openAmount = { gte: new Decimal(filters.minAmount) }
    }

    const [data, total] = await Promise.all([
      this.prisma.invoice.findMany({
        where,
        skip: (pagination.page - 1) * pagination.limit,
        take: pagination.limit,
        include: {
          customer: { select: { id: true, legalName: true } },
          contract: { select: { id: true, externalId: true } },
          _count: { select: { payments: true } },
        },
        orderBy: { dueAt: 'asc' },
      }),
      this.prisma.invoice.count({ where }),
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
    return this.prisma.invoice.findUnique({
      where: { id },
      include: {
        customer: true,
        contract: true,
        wallet: true,
        payments: { orderBy: { paidAt: 'desc' } },
        events: { orderBy: { occurredAt: 'desc' } },
      },
    })
  }

  async findByExternalId(externalId: string) {
    return this.prisma.invoice.findUnique({
      where: { externalId },
    })
  }

  async upsertFromIxc(data: {
    externalId: string
    customerId: string
    contractId?: string
    walletId?: string
    status: InvoiceStatus
    dueAt: Date
    originalAmount: Decimal
    openAmount: Decimal
    paidAmount?: Decimal
    paidAt?: Date
    checksum?: string
  }) {
    return this.prisma.invoice.upsert({
      where: { externalId: data.externalId },
      create: {
        ...data,
        syncStatus: SyncStatus.SYNCED,
        syncedAt: new Date(),
      },
      update: {
        status: data.status,
        openAmount: data.openAmount,
        paidAmount: data.paidAmount,
        paidAt: data.paidAt,
        checksum: data.checksum,
        syncStatus: SyncStatus.SYNCED,
        syncedAt: new Date(),
      },
    })
  }

  async getOverdueInvoices(minDays: number, minAmount: number) {
    const overdueDate = new Date()
    overdueDate.setDate(overdueDate.getDate() - minDays)

    return this.prisma.invoice.findMany({
      where: {
        status: InvoiceStatus.OPEN,
        dueAt: { lt: overdueDate },
        openAmount: { gte: new Decimal(minAmount) },
      },
      include: {
        customer: true,
        contract: {
          include: { branch: true },
        },
      },
      orderBy: [{ openAmount: 'desc' }, { dueAt: 'asc' }],
    })
  }

  async addEvent(invoiceId: string, type: string, payload?: Record<string, unknown>) {
    return this.prisma.invoiceEvent.create({
      data: {
        invoiceId,
        type,
        occurredAt: new Date(),
        payload: (payload ?? Prisma.JsonNull) as Prisma.InputJsonValue,
      },
    })
  }

  async getTotalOverdue(customerId: string) {
    const result = await this.prisma.invoice.aggregate({
      where: {
        customerId,
        status: InvoiceStatus.OPEN,
        dueAt: { lt: new Date() },
      },
      _sum: { openAmount: true },
      _count: true,
    })

    return {
      totalAmount: result._sum.openAmount ?? new Decimal(0),
      count: result._count,
    }
  }
}
