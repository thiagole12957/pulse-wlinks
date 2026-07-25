import { Injectable } from '@nestjs/common'
import type { GcPort, GcPickupProcess } from './gc.port'
import { LoggerService } from '../../common/logger/logger.service'

@Injectable()
export class GcMockAdapter implements GcPort {
  private processCounter = 8000
  private processes: Map<string, GcPickupProcess> = new Map()

  constructor(private readonly logger: LoggerService) {}

  async createPickupProcess(params: {
    customerId: string
    contractId: string
    address: string
    reason: string
    requestedById: string
    equipmentList?: string[]
  }): Promise<GcPickupProcess> {
    this.logger.debug(`GC Mock: createPickupProcess ${JSON.stringify(params)}`, 'GcMockAdapter')

    this.processCounter++

    const process: GcPickupProcess = {
      id: `gc-${this.processCounter}`,
      status: 'pending',
      customerId: params.customerId,
      contractId: params.contractId,
      address: params.address,
      notes: params.reason,
    }

    this.processes.set(process.id, process)

    return process
  }

  async getPickupStatus(processId: string): Promise<GcPickupProcess | null> {
    this.logger.debug(`GC Mock: getPickupStatus ${processId}`, 'GcMockAdapter')

    return this.processes.get(processId) ?? null
  }

  async cancelPickup(processId: string, reason: string): Promise<GcPickupProcess> {
    this.logger.debug(`GC Mock: cancelPickup ${processId} - ${reason}`, 'GcMockAdapter')

    const process = this.processes.get(processId)
    if (!process) {
      throw new Error(`Processo ${processId} não encontrado`)
    }

    process.status = 'canceled'
    process.notes = `${process.notes ?? ''} | Cancelado: ${reason}`

    return process
  }

  async listPickupsByCustomer(customerId: string): Promise<GcPickupProcess[]> {
    this.logger.debug(`GC Mock: listPickupsByCustomer ${customerId}`, 'GcMockAdapter')

    return Array.from(this.processes.values()).filter((p) => p.customerId === customerId)
  }
}
