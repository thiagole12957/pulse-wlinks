import { Injectable, NotFoundException } from '@nestjs/common'
import { InvoicesRepository, InvoiceFilters } from './invoices.repository'
import { IxcService } from '../integrations/ixc/ixc.service'
import { LoggerService } from '../common/logger/logger.service'
import { InvoiceStatus } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'
import * as crypto from 'crypto'

@Injectable()
export class InvoicesService {
  constructor(
    private readonly repository: InvoicesRepository,
    private readonly ixcService: IxcService,
    private readonly logger: LoggerService
  ) {}

  async findMany(filters: InvoiceFilters, pagination: { page: number; limit: number }) {
    return this.repository.findMany(filters, pagination)
  }

  async findById(id: string) {
    const invoice = await this.repository.findById(id)
    if (!invoice) {
      throw new NotFoundException(`Fatura ${id} não encontrada`)
    }
    return invoice
  }

  async syncFromIxc(customerId?: string) {
    this.logger.log('Iniciando sincronização de faturas do IXC', 'InvoicesService')

    const result = await this.ixcService.getInvoices({ customerId })

    let synced = 0
    let failed = 0

    for (const ixcInvoice of result.data) {
      try {
        const checksum = this.generateChecksum(ixcInvoice)

        await this.repository.upsertFromIxc({
          externalId: ixcInvoice.id,
          customerId: ixcInvoice.id_cliente, // Será resolvido para UUID
          contractId: ixcInvoice.id_contrato,
          status: this.mapInvoiceStatus(ixcInvoice.status),
          dueAt: new Date(ixcInvoice.data_vencimento),
          originalAmount: new Decimal(ixcInvoice.valor),
          openAmount: new Decimal(ixcInvoice.valor_aberto),
          paidAt: ixcInvoice.data_pagamento ? new Date(ixcInvoice.data_pagamento) : undefined,
          checksum,
        })

        synced++
      } catch (error) {
        this.logger.error(
          `Erro ao sincronizar fatura ${ixcInvoice.id}: ${error}`,
          undefined,
          'InvoicesService'
        )
        failed++
      }
    }

    return { synced, failed, total: result.total }
  }

  async getOverdueInvoices(minDays = 7, minAmount = 0) {
    return this.repository.getOverdueInvoices(minDays, minAmount)
  }

  async sendPaymentLink(id: string) {
    const invoice = await this.findById(id)

    const result = await this.ixcService.generateSecondCopy(invoice.externalId)

    await this.repository.addEvent(id, 'PAYMENT_LINK_SENT', {
      pixCode: result.pixCode ? '[REDACTED]' : null,
      boletoUrl: result.boletoUrl ? '[REDACTED]' : null,
    })

    return result
  }

  async getCustomerOverdueTotal(customerId: string) {
    return this.repository.getTotalOverdue(customerId)
  }

  private mapInvoiceStatus(status: string): InvoiceStatus {
    const map: Record<string, InvoiceStatus> = {
      A: InvoiceStatus.OPEN,
      R: InvoiceStatus.PAID,
      P: InvoiceStatus.PARTIALLY_PAID,
      C: InvoiceStatus.CANCELED,
      N: InvoiceStatus.RENEGOTIATED,
    }
    return map[status] ?? InvoiceStatus.UNKNOWN
  }

  private generateChecksum(data: object): string {
    return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex').slice(0, 16)
  }
}
