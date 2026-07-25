import { Injectable } from '@nestjs/common'
import { PrismaService } from '../common/prisma/prisma.service'
import { LoggerService } from '../common/logger/logger.service'
import { InvoiceStatus, CaseStatus, PromiseStatus } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'

export interface EligibilityRule {
  id: string
  name: string
  overdueDays: number
  minimumOpenAmount: number
  activeContractsOnly: boolean
  suspendOnActivePromise: boolean
  branchId?: string
  walletId?: string
}

export interface EligibleInvoice {
  id: string
  customerId: string
  contractId: string | null
  openAmount: Decimal
  dueAt: Date
  daysOverdue: number
}

@Injectable()
export class EligibilityService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService
  ) {}

  async evaluateEligibility(): Promise<EligibleInvoice[]> {
    this.logger.log('Avaliando elegibilidade de faturas', 'EligibilityService')

    // Buscar regras ativas
    const rules = await this.prisma.collectionRule.findMany({
      where: { active: true },
      orderBy: { priority: 'asc' },
    })

    if (rules.length === 0) {
      // Usar regra padrão: 7 dias de atraso
      return this.findEligibleInvoices({
        id: 'default',
        name: 'Regra Padrão',
        overdueDays: 7,
        minimumOpenAmount: 0,
        activeContractsOnly: true,
        suspendOnActivePromise: true,
      })
    }

    const allEligible: EligibleInvoice[] = []

    for (const rule of rules) {
      const eligible = await this.findEligibleInvoices({
        id: rule.id,
        name: rule.name,
        overdueDays: rule.overdueDays,
        minimumOpenAmount: Number(rule.minimumOpenAmount),
        activeContractsOnly: rule.activeContractsOnly,
        suspendOnActivePromise: rule.suspendOnActivePromise,
        branchId: rule.branchId ?? undefined,
        walletId: rule.walletId ?? undefined,
      })

      allEligible.push(...eligible)
    }

    // Remover duplicatas
    const unique = allEligible.filter(
      (invoice, index, self) => index === self.findIndex((i) => i.id === invoice.id)
    )

    this.logger.log(`${unique.length} faturas elegíveis encontradas`, 'EligibilityService')

    return unique
  }

  private async findEligibleInvoices(rule: EligibilityRule): Promise<EligibleInvoice[]> {
    const now = new Date()
    const overdueDate = new Date(now.getTime() - rule.overdueDays * 24 * 60 * 60 * 1000)

    // Buscar faturas em atraso
    const invoices = await this.prisma.invoice.findMany({
      where: {
        status: InvoiceStatus.OPEN,
        dueAt: { lt: overdueDate },
        openAmount: { gte: new Decimal(rule.minimumOpenAmount) },
        ...(rule.walletId && { walletId: rule.walletId }),
        ...(rule.activeContractsOnly && {
          contract: {
            status: 'ACTIVE',
            ...(rule.branchId && { branchId: rule.branchId }),
          },
        }),
      },
      include: {
        customer: {
          include: {
            cases: {
              where: {
                status: { notIn: [CaseStatus.CLOSED, CaseStatus.REGULARIZED] },
              },
            },
          },
        },
        promiseLinks: {
          include: {
            promise: true,
          },
        },
      },
    })

    const eligible: EligibleInvoice[] = []

    for (const invoice of invoices) {
      // Verificar se já existe caso aberto para este cliente
      if (invoice.customer.cases.length > 0) {
        continue
      }

      // Verificar se há promessa ativa
      if (rule.suspendOnActivePromise) {
        const hasActivePromise = invoice.promiseLinks.some(
          (link) => link.promise.status === PromiseStatus.ACTIVE
        )
        if (hasActivePromise) {
          continue
        }
      }

      const daysOverdue = Math.floor(
        (now.getTime() - invoice.dueAt.getTime()) / (1000 * 60 * 60 * 24)
      )

      eligible.push({
        id: invoice.id,
        customerId: invoice.customerId,
        contractId: invoice.contractId,
        openAmount: invoice.openAmount,
        dueAt: invoice.dueAt,
        daysOverdue,
      })
    }

    return eligible
  }

  calculatePriorityScore(factors: {
    daysOverdue: number
    totalAmount: number
    invoiceCount: number
    isBlocked: boolean
    isOnline: boolean
    hasBrokenPromise: boolean
    noContactAttempts: boolean
  }): number {
    let score = 0

    // Dias de atraso (até 30 pontos)
    score += Math.min(factors.daysOverdue, 30)

    // Valor total (até 25 pontos)
    if (factors.totalAmount >= 500) score += 25
    else if (factors.totalAmount >= 200) score += 15
    else if (factors.totalAmount >= 100) score += 10
    else score += 5

    // Quantidade de faturas (até 10 pontos)
    score += Math.min(factors.invoiceCount * 3, 10)

    // Bloqueado mas online (15 pontos - anomalia)
    if (factors.isBlocked && factors.isOnline) score += 15

    // Promessa quebrada (10 pontos)
    if (factors.hasBrokenPromise) score += 10

    // Sem tentativas de contato (10 pontos)
    if (factors.noContactAttempts) score += 10

    return Math.min(score, 100)
  }
}
