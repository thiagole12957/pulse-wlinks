import { Injectable } from '@nestjs/common'
import type {
  IxcPort,
  IxcCustomer,
  IxcContract,
  IxcInvoice,
  IxcPayment,
} from './ixc.port'
import { LoggerService } from '../../common/logger/logger.service'

@Injectable()
export class IxcMockAdapter implements IxcPort {
  constructor(private readonly logger: LoggerService) {}

  async getCustomers(params: { updatedAfter?: Date; limit?: number; offset?: number }) {
    this.logger.debug(`IXC Mock: getCustomers ${JSON.stringify(params)}`, 'IxcMockAdapter')

    const mockCustomers: IxcCustomer[] = [
      {
        id: '1001',
        razao: 'João Silva',
        fantasia: undefined,
        cnpj_cpf: '***456789**',
        cidade: 'São Paulo',
        bairro: 'Centro',
        endereco: 'Rua ***',
        data_cadastro: '2022-01-15',
        ativo: 'S',
      },
      {
        id: '1002',
        razao: 'Maria Santos',
        fantasia: undefined,
        cnpj_cpf: '***123456**',
        cidade: 'Campinas',
        bairro: 'Jardim',
        endereco: 'Av ***',
        data_cadastro: '2021-06-20',
        ativo: 'S',
      },
      {
        id: '1003',
        razao: 'Empresa ABC Ltda',
        fantasia: 'ABC Tecnologia',
        cnpj_cpf: '**456789****01',
        cidade: 'São Paulo',
        bairro: 'Pinheiros',
        endereco: 'Rua ***',
        data_cadastro: '2020-03-10',
        ativo: 'S',
      },
    ]

    return {
      data: mockCustomers.slice(params.offset ?? 0, (params.offset ?? 0) + (params.limit ?? 100)),
      total: mockCustomers.length,
    }
  }

  async getCustomerById(id: string): Promise<IxcCustomer | null> {
    this.logger.debug(`IXC Mock: getCustomerById ${id}`, 'IxcMockAdapter')

    const result = await this.getCustomers({})
    return result.data.find((c) => c.id === id) ?? null
  }

  async getContracts(params: { customerId?: string; updatedAfter?: Date }) {
    this.logger.debug(`IXC Mock: getContracts ${JSON.stringify(params)}`, 'IxcMockAdapter')

    const mockContracts: IxcContract[] = [
      {
        id: '2001',
        id_cliente: '1001',
        id_filial: '1',
        status: 'A',
        status_internet: 'A',
        data_ativacao: '2022-01-20',
      },
      {
        id: '2002',
        id_cliente: '1002',
        id_filial: '1',
        status: 'A',
        status_internet: 'CA', // Bloqueado automático
        data_ativacao: '2021-06-25',
      },
      {
        id: '2003',
        id_cliente: '1003',
        id_filial: '2',
        status: 'A',
        status_internet: 'A',
        data_ativacao: '2020-03-15',
      },
    ]

    let data = mockContracts
    if (params.customerId) {
      data = data.filter((c) => c.id_cliente === params.customerId)
    }

    return { data, total: data.length }
  }

  async getInvoices(params: {
    customerId?: string
    contractId?: string
    status?: string
    dueDateFrom?: Date
    dueDateTo?: Date
  }) {
    this.logger.debug(`IXC Mock: getInvoices ${JSON.stringify(params)}`, 'IxcMockAdapter')

    const today = new Date()
    const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const fifteenDaysAgo = new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000)

    const mockInvoices: IxcInvoice[] = [
      {
        id: '3001',
        id_cliente: '1001',
        id_contrato: '2001',
        data_vencimento: sevenDaysAgo.toISOString().split('T')[0]!,
        valor: '99.90',
        valor_aberto: '99.90',
        status: 'A', // Aberto
      },
      {
        id: '3002',
        id_cliente: '1002',
        id_contrato: '2002',
        data_vencimento: fifteenDaysAgo.toISOString().split('T')[0]!,
        valor: '149.90',
        valor_aberto: '149.90',
        status: 'A',
      },
      {
        id: '3003',
        id_cliente: '1002',
        id_contrato: '2002',
        data_vencimento: sevenDaysAgo.toISOString().split('T')[0]!,
        valor: '149.90',
        valor_aberto: '149.90',
        status: 'A',
      },
      {
        id: '3004',
        id_cliente: '1003',
        id_contrato: '2003',
        data_vencimento: today.toISOString().split('T')[0]!,
        valor: '299.90',
        valor_aberto: '0.00',
        status: 'R', // Recebido
        data_pagamento: today.toISOString().split('T')[0],
      },
    ]

    let data = mockInvoices
    if (params.customerId) {
      data = data.filter((i) => i.id_cliente === params.customerId)
    }
    if (params.status) {
      data = data.filter((i) => i.status === params.status)
    }

    return { data, total: data.length }
  }

  async getPayments(params: { invoiceId?: string; paidAfter?: Date }) {
    this.logger.debug(`IXC Mock: getPayments ${JSON.stringify(params)}`, 'IxcMockAdapter')

    const mockPayments: IxcPayment[] = [
      {
        id: '4001',
        id_areceber: '3004',
        valor: '299.90',
        data_pagamento: new Date().toISOString().split('T')[0]!,
        forma_pagamento: 'PIX',
      },
    ]

    let data = mockPayments
    if (params.invoiceId) {
      data = data.filter((p) => p.id_areceber === params.invoiceId)
    }

    return { data, total: data.length }
  }

  async generateSecondCopy(invoiceId: string) {
    this.logger.debug(`IXC Mock: generateSecondCopy ${invoiceId}`, 'IxcMockAdapter')

    return {
      pixCode:
        '00020126580014br.gov.bcb.pix0136mock-pix-code-for-testing-purposes-only5204000053039865802BR5913WLINKS PULSE6009SAO PAULO62070503***6304ABCD',
      boletoUrl: `https://mock.ixc.local/boleto/${invoiceId}`,
    }
  }
}
