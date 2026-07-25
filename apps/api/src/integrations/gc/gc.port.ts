export interface GcPickupProcess {
  id: string
  status: 'pending' | 'in_progress' | 'completed' | 'canceled'
  customerId: string
  contractId: string
  address: string
  scheduledAt?: string
  completedAt?: string
  notes?: string
}

export interface GcPort {
  createPickupProcess(params: {
    customerId: string
    contractId: string
    address: string
    reason: string
    requestedById: string
    equipmentList?: string[]
  }): Promise<GcPickupProcess>

  getPickupStatus(processId: string): Promise<GcPickupProcess | null>

  cancelPickup(processId: string, reason: string): Promise<GcPickupProcess>

  listPickupsByCustomer(customerId: string): Promise<GcPickupProcess[]>
}
