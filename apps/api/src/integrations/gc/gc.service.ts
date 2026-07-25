import { Injectable, Inject } from '@nestjs/common'
import type { GcPort } from './gc.port'

@Injectable()
export class GcService {
  constructor(@Inject('GC_ADAPTER') private readonly adapter: GcPort) {}

  createPickupProcess(params: Parameters<GcPort['createPickupProcess']>[0]) {
    return this.adapter.createPickupProcess(params)
  }

  getPickupStatus(processId: string) {
    return this.adapter.getPickupStatus(processId)
  }

  cancelPickup(processId: string, reason: string) {
    return this.adapter.cancelPickup(processId, reason)
  }

  listPickupsByCustomer(customerId: string) {
    return this.adapter.listPickupsByCustomer(customerId)
  }
}
