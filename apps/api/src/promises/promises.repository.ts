import { Injectable } from '@nestjs/common'
import { PrismaService } from '../common/prisma/prisma.service'
import { PromiseStatus } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'

export interface CreatePromiseDto {
  caseId: string
  createdById: string
  amount: number
  promisedAt: Date
  notes?: string
  invoiceIds?: string[]
}

@Injectable()
export class PromisesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    return this.prisma.paymentPromise.findUnique({
      where: { id },
      include: {
        invoices: {
          include: { invoice: true },
        },
        case: {
          include: { customer: true },
        },
      },
    })
  }

  async findByCaseId(caseId: string) {
    return this.prisma.paymentPromise.findMany({
      where: { caseId },
      include: {
        invoices: {
          include: { invoice: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findActiveByCustomerId(customerId: string) {
    return this.prisma.paymentPromise.findMany({
      where: {
        status: PromiseStatus.ACTIVE,
        case: { customerId },
      },
      include: {
        case: true,
        invoices: {
          include: { invoice: true },
        },
      },
      orderBy: { promisedAt: 'asc' },
    })
  }

  async findExpiredActive() {
    const now = new Date()
    return this.prisma.paymentPromise.findMany({
      where: {
        status: PromiseStatus.ACTIVE,
        promisedAt: { lt: now },
      },
      include: {
        case: {
          include: { customer: true },
        },
        invoices: {
          include: { invoice: true },
        },
      },
    })
  }

  async create(data: CreatePromiseDto) {
    return this.prisma.$transaction(async (tx) => {
      const promise = await tx.paymentPromise.create({
        data: {
          caseId: data.caseId,
          createdById: data.createdById,
          amount: new Decimal(data.amount),
          promisedAt: data.promisedAt,
          notes: data.notes,
          status: PromiseStatus.ACTIVE,
        },
      })

      if (data.invoiceIds && data.invoiceIds.length > 0) {
        await tx.promiseInvoice.createMany({
          data: data.invoiceIds.map((invoiceId) => ({
            promiseId: promise.id,
            invoiceId,
          })),
        })
      }

      return tx.paymentPromise.findUnique({
        where: { id: promise.id },
        include: {
          invoices: {
            include: { invoice: true },
          },
        },
      })
    })
  }

  async updateStatus(id: string, status: PromiseStatus, fulfilledAt?: Date) {
    return this.prisma.paymentPromise.update({
      where: { id },
      data: {
        status,
        fulfilledAt,
      },
    })
  }

  async countByStatus(status: PromiseStatus) {
    return this.prisma.paymentPromise.count({
      where: { status },
    })
  }

  async countFulfilledByCustomerId(customerId: string) {
    return this.prisma.paymentPromise.count({
      where: {
        status: PromiseStatus.FULFILLED,
        case: { customerId },
      },
    })
  }

  async countBrokenByCustomerId(customerId: string) {
    return this.prisma.paymentPromise.count({
      where: {
        status: PromiseStatus.BROKEN,
        case: { customerId },
      },
    })
  }
}
