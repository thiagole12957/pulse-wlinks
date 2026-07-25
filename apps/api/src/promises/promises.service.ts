import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { PromisesRepository, CreatePromiseDto } from './promises.repository'
import { LoggerService } from '../common/logger/logger.service'
import { PromiseStatus, InvoiceStatus } from '@prisma/client'
import { PrismaService } from '../common/prisma/prisma.service'

@Injectable()
export class PromisesService {
  constructor(
    private readonly repository: PromisesRepository,
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService
  ) {}

  async getById(id: string) {
    const promise = await this.repository.findById(id)
    if (!promise) {
      throw new NotFoundException(`Promessa ${id} não encontrada`)
    }
    return promise
  }

  async getByCaseId(caseId: string) {
    return this.repository.findByCaseId(caseId)
  }

  async getActiveByCustomerId(customerId: string) {
    return this.repository.findActiveByCustomerId(customerId)
  }

  async create(data: CreatePromiseDto) {
    // Validate case exists
    const caseExists = await this.prisma.relationshipCase.findUnique({
      where: { id: data.caseId },
    })

    if (!caseExists) {
      throw new NotFoundException(`Caso ${data.caseId} não encontrado`)
    }

    // Validate invoices if provided
    if (data.invoiceIds && data.invoiceIds.length > 0) {
      const invoices = await this.prisma.invoice.findMany({
        where: { id: { in: data.invoiceIds } },
      })

      if (invoices.length !== data.invoiceIds.length) {
        throw new BadRequestException('Uma ou mais faturas não encontradas')
      }

      // Check if all invoices are open
      const closedInvoices = invoices.filter((i) => i.status !== InvoiceStatus.OPEN)
      if (closedInvoices.length > 0) {
        throw new BadRequestException('Algumas faturas não estão em aberto')
      }
    }

    // Validate amount
    if (data.amount <= 0) {
      throw new BadRequestException('O valor da promessa deve ser positivo')
    }

    // Validate promisedAt is in the future
    if (data.promisedAt <= new Date()) {
      throw new BadRequestException('A data da promessa deve ser futura')
    }

    this.logger.log(
      `Criando promessa de pagamento para caso ${data.caseId} com valor ${data.amount}`,
      'PromisesService'
    )

    const promise = await this.repository.create(data)

    // Update case status
    await this.prisma.relationshipCase.update({
      where: { id: data.caseId },
      data: {
        status: 'PROMISE_ACTIVE',
        lastActivityAt: new Date(),
      },
    })

    return promise
  }

  async markAsFulfilled(id: string) {
    const promise = await this.getById(id)

    if (promise.status !== PromiseStatus.ACTIVE) {
      throw new BadRequestException('Apenas promessas ativas podem ser marcadas como cumpridas')
    }

    this.logger.log(`Marcando promessa ${id} como cumprida`, 'PromisesService')

    const updated = await this.repository.updateStatus(
      id,
      PromiseStatus.FULFILLED,
      new Date()
    )

    // Update case status
    await this.prisma.relationshipCase.update({
      where: { id: promise.caseId },
      data: {
        status: 'WAITING_PAYMENT',
        lastActivityAt: new Date(),
      },
    })

    return updated
  }

  async markAsBroken(id: string) {
    const promise = await this.getById(id)

    if (promise.status !== PromiseStatus.ACTIVE) {
      throw new BadRequestException('Apenas promessas ativas podem ser marcadas como quebradas')
    }

    this.logger.log(`Marcando promessa ${id} como quebrada`, 'PromisesService')

    const updated = await this.repository.updateStatus(id, PromiseStatus.BROKEN)

    // Update case status
    await this.prisma.relationshipCase.update({
      where: { id: promise.caseId },
      data: {
        status: 'PROMISE_BROKEN',
        lastActivityAt: new Date(),
      },
    })

    return updated
  }

  async cancel(id: string) {
    const promise = await this.getById(id)

    if (promise.status !== PromiseStatus.ACTIVE) {
      throw new BadRequestException('Apenas promessas ativas podem ser canceladas')
    }

    this.logger.log(`Cancelando promessa ${id}`, 'PromisesService')

    return this.repository.updateStatus(id, PromiseStatus.CANCELED)
  }

  async checkExpiredPromises() {
    const expiredPromises = await this.repository.findExpiredActive()

    this.logger.log(
      `Verificando ${expiredPromises.length} promessas expiradas`,
      'PromisesService'
    )

    const results = []
    for (const promise of expiredPromises) {
      // Check if any linked invoices were paid
      const paidInvoices = promise.invoices.filter(
        (pi) => pi.invoice.status === InvoiceStatus.PAID
      )

      if (paidInvoices.length === promise.invoices.length && promise.invoices.length > 0) {
        // All invoices paid - mark as fulfilled
        await this.repository.updateStatus(promise.id, PromiseStatus.FULFILLED, new Date())
        results.push({ id: promise.id, newStatus: PromiseStatus.FULFILLED })
      } else if (paidInvoices.length > 0) {
        // Some invoices paid - mark as partially fulfilled
        await this.repository.updateStatus(
          promise.id,
          PromiseStatus.PARTIALLY_FULFILLED,
          new Date()
        )
        results.push({ id: promise.id, newStatus: PromiseStatus.PARTIALLY_FULFILLED })
      } else {
        // No invoices paid - mark as broken
        await this.repository.updateStatus(promise.id, PromiseStatus.BROKEN)
        results.push({ id: promise.id, newStatus: PromiseStatus.BROKEN })

        // Update case status
        await this.prisma.relationshipCase.update({
          where: { id: promise.caseId },
          data: {
            status: 'PROMISE_BROKEN',
            lastActivityAt: new Date(),
          },
        })
      }
    }

    return results
  }
}
