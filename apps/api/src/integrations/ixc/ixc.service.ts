import { Injectable, Inject } from '@nestjs/common'
import type { IxcPort } from './ixc.port'

@Injectable()
export class IxcService {
  constructor(@Inject('IXC_ADAPTER') private readonly adapter: IxcPort) {}

  getCustomers(params: Parameters<IxcPort['getCustomers']>[0]) {
    return this.adapter.getCustomers(params)
  }

  getCustomerById(id: string) {
    return this.adapter.getCustomerById(id)
  }

  getContracts(params: Parameters<IxcPort['getContracts']>[0]) {
    return this.adapter.getContracts(params)
  }

  getInvoices(params: Parameters<IxcPort['getInvoices']>[0]) {
    return this.adapter.getInvoices(params)
  }

  getPayments(params: Parameters<IxcPort['getPayments']>[0]) {
    return this.adapter.getPayments(params)
  }

  generateSecondCopy(invoiceId: string) {
    return this.adapter.generateSecondCopy(invoiceId)
  }
}
