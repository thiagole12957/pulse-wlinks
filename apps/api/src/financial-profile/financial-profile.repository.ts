import { Injectable } from '@nestjs/common'
import { PrismaService } from '../common/prisma/prisma.service'
import { InvoiceStatus, PromiseStatus } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'

@Injectable()
export class FinancialProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByCustomerId(customerId: string) {
    return this.prisma.financialProfile.findUnique({
      where: { customerId },
    })
  }

  async calculateProfile(customerId: string) {
    const now = new Date()

    // Buscar todas as faturas do cliente
    const invoices = await this.prisma.invoice.findMany({
      where: { customerId },
      include: { payments: true },
    })

    // Buscar promessas
    const promises = await this.prisma.paymentPromise.findMany({
      where: { case: { customerId } },
    })

    // Calcular métricas
    const totalInvoices = invoices.length
    const paidInvoices = invoices.filter((i) => i.status === InvoiceStatus.PAID)
    const overdueInvoices = invoices.filter(
      (i) => i.status === InvoiceStatus.OPEN && i.dueAt < now
    )

    const onTimePayments = paidInvoices.filter((i) => {
      const payment = i.payments[0]
      return payment && payment.paidAt <= i.dueAt
    })

    const onTimePaymentRate =
      paidInvoices.length > 0
        ? new Decimal((onTimePayments.length / paidInvoices.length) * 100)
        : new Decimal(0)

    const delayDays = paidInvoices
      .map((i) => {
        const payment = i.payments[0]
        if (!payment) return 0
        const diff = payment.paidAt.getTime() - i.dueAt.getTime()
        return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)))
      })
      .filter((d) => d > 0)

    const averageDelayDays =
      delayDays.length > 0
        ? new Decimal(delayDays.reduce((a, b) => a + b, 0) / delayDays.length)
        : new Decimal(0)

    const maximumDelayDays = delayDays.length > 0 ? Math.max(...delayDays) : 0

    const lifetimePaidAmount = paidInvoices.reduce(
      (sum, i) => sum.add(i.paidAmount),
      new Decimal(0)
    )

    const currentOverdueAmount = overdueInvoices.reduce(
      (sum, i) => sum.add(i.openAmount),
      new Decimal(0)
    )

    const fulfilledPromises = promises.filter(
      (p) => p.status === PromiseStatus.FULFILLED || p.status === PromiseStatus.PARTIALLY_FULFILLED
    ).length

    const brokenPromises = promises.filter(
      (p) => p.status === PromiseStatus.BROKEN
    ).length

    // Calcular meses de relacionamento
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
    })

    const relationshipMonths = customer
      ? Math.floor(
          (now.getTime() - customer.createdAt.getTime()) / (1000 * 60 * 60 * 24 * 30)
        )
      : 0

    const lastPayment = paidInvoices
      .flatMap((i) => i.payments)
      .sort((a, b) => b.paidAt.getTime() - a.paidAt.getTime())[0]

    return {
      totalInvoices,
      onTimePaymentRate,
      averageDelayDays,
      maximumDelayDays,
      lifetimePaidAmount,
      currentOverdueAmount,
      currentOverdueCount: overdueInvoices.length,
      fulfilledPromises,
      brokenPromises,
      relationshipMonths,
      lastPaymentAt: lastPayment?.paidAt,
    }
  }

  async upsert(
    customerId: string,
    data: {
      totalInvoices: number
      onTimePaymentRate: Decimal
      averageDelayDays: Decimal
      maximumDelayDays: number
      lifetimePaidAmount: Decimal
      currentOverdueAmount: Decimal
      currentOverdueCount: number
      fulfilledPromises: number
      brokenPromises: number
      relationshipMonths: number
      lastPaymentAt?: Date
      currentScore: number
      scoreClassification: string
    }
  ) {
    return this.prisma.financialProfile.upsert({
      where: { customerId },
      create: {
        customerId,
        ...data,
        profileVersion: 1,
        calculatedAt: new Date(),
      },
      update: {
        ...data,
        profileVersion: { increment: 1 },
        calculatedAt: new Date(),
      },
    })
  }
}
