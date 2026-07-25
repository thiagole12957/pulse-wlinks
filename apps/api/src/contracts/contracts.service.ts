import { Injectable, NotFoundException } from '@nestjs/common'
import { ContractsRepository, ContractFilters } from './contracts.repository'
import { IxcService } from '../integrations/ixc/ixc.service'
import { LoggerService } from '../common/logger/logger.service'
import { ContractStatus, InternetStatus } from '@prisma/client'
import * as crypto from 'crypto'

@Injectable()
export class ContractsService {
  constructor(
    private readonly repository: ContractsRepository,
    private readonly ixcService: IxcService,
    private readonly logger: LoggerService
  ) {}

  async findMany(filters: ContractFilters, pagination: { page: number; limit: number }) {
    return this.repository.findMany(filters, pagination)
  }

  async findById(id: string) {
    const contract = await this.repository.findById(id)
    if (!contract) {
      throw new NotFoundException(`Contrato ${id} não encontrado`)
    }
    return contract
  }

  async syncFromIxc(customerId?: string) {
    this.logger.log('Iniciando sincronização de contratos do IXC', 'ContractsService')

    const result = await this.ixcService.getContracts({ customerId })

    let synced = 0
    let failed = 0

    for (const ixcContract of result.data) {
      try {
        const checksum = this.generateChecksum(ixcContract)

        // Buscar cliente pelo externalId
        const customer = await this.findCustomerByExternalId(ixcContract.id_cliente)
        if (!customer) {
          this.logger.warn(
            `Cliente ${ixcContract.id_cliente} não encontrado para contrato ${ixcContract.id}`,
            'ContractsService'
          )
          failed++
          continue
        }

        await this.repository.upsertFromIxc({
          externalId: ixcContract.id,
          customerId: customer.id,
          branchId: undefined, // Será vinculado quando a filial for sincronizada
          status: this.mapContractStatus(ixcContract.status),
          internetStatus: this.mapInternetStatus(ixcContract.status_internet),
          checksum,
        })

        synced++
      } catch (error) {
        this.logger.error(
          `Erro ao sincronizar contrato ${ixcContract.id}: ${error}`,
          undefined,
          'ContractsService'
        )
        failed++
      }
    }

    return { synced, failed, total: result.total }
  }

  async getBlockedWithOnlineAccess() {
    return this.repository.getBlockedWithOnlineAccess()
  }

  private async findCustomerByExternalId(_externalId: string): Promise<{ id: string } | null> {
    // TODO: Será implementado corretamente com CustomersRepository
    // por enquanto retorna null
    return null
  }

  private mapContractStatus(status: string): ContractStatus {
    const map: Record<string, ContractStatus> = {
      A: ContractStatus.ACTIVE,
      I: ContractStatus.INACTIVE,
      P: ContractStatus.PRE_CONTRACT,
      N: ContractStatus.NEGATIVE,
      D: ContractStatus.WITHDRAWN,
    }
    return map[status] ?? ContractStatus.UNKNOWN
  }

  private mapInternetStatus(status: string): InternetStatus {
    const map: Record<string, InternetStatus> = {
      A: InternetStatus.ACTIVE,
      D: InternetStatus.DISABLED,
      CA: InternetStatus.AUTO_BLOCKED,
      CM: InternetStatus.MANUAL_BLOCKED,
      AA: InternetStatus.WAITING_SIGNATURE,
    }
    return map[status] ?? InternetStatus.UNKNOWN
  }

  private generateChecksum(data: object): string {
    return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex').slice(0, 16)
  }
}
