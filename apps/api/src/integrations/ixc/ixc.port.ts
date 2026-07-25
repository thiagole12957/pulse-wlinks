export interface IxcCustomer {
  id: string
  razao: string
  fantasia?: string
  cnpj_cpf: string
  cidade?: string
  bairro?: string
  endereco?: string
  data_cadastro: string
  ativo: string
}

export interface IxcContract {
  id: string
  id_cliente: string
  id_filial: string
  status: string
  status_internet: string
  data_ativacao?: string
  data_cancelamento?: string
}

export interface IxcInvoice {
  id: string
  id_cliente: string
  id_contrato?: string
  data_vencimento: string
  valor: string
  valor_aberto: string
  status: string
  data_pagamento?: string
}

export interface IxcPayment {
  id: string
  id_areceber: string
  valor: string
  data_pagamento: string
  forma_pagamento?: string
}

export interface IxcPort {
  getCustomers(params: { updatedAfter?: Date; limit?: number; offset?: number }): Promise<{
    data: IxcCustomer[]
    total: number
  }>

  getCustomerById(id: string): Promise<IxcCustomer | null>

  getContracts(params: { customerId?: string; updatedAfter?: Date }): Promise<{
    data: IxcContract[]
    total: number
  }>

  getInvoices(params: {
    customerId?: string
    contractId?: string
    status?: string
    dueDateFrom?: Date
    dueDateTo?: Date
  }): Promise<{
    data: IxcInvoice[]
    total: number
  }>

  getPayments(params: { invoiceId?: string; paidAfter?: Date }): Promise<{
    data: IxcPayment[]
    total: number
  }>

  generateSecondCopy(invoiceId: string): Promise<{ pixCode?: string; boletoUrl?: string }>
}
