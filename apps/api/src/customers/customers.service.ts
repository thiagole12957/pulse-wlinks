import { Injectable, NotFoundException } from '@nestjs/common'
import { CustomersRepository, CustomerFilters, PaginationParams } from './customers.repository'
import { IxcService } from '../integrations/ixc/ixc.service'
import { LoggerService } from '../common/logger/logger.service'
import { SyncStatus } from '@prisma/client'
import * as crypto from 'crypto'

@Injectable()
export class CustomersService {
  constructor(
    private readonly repository: CustomersRepository,
    private readonly ixcService: IxcService,
    private readonly logger: LoggerService
  ) {}

  async findMany(filters: CustomerFilters, pagination: PaginationParams) {
    return this.repository.findMany(filters, pagination)
  }

  async findById(id: string) {
    const customer = await this.repository.findById(id)
    if (!customer) {
      throw new NotFoundException(`Cliente ${id} não encontrado`)
    }
    return customer
  }

  async syncFromIxc(options: { updatedAfter?: Date; limit?: number } = {}) {
    this.logger.log('Iniciando sincronização de clientes do IXC', 'CustomersService')

    const result = await this.ixcService.getCustomers({
      updatedAfter: options.updatedAfter,
      limit: options.limit ?? 100,
    })

    let synced = 0
    let failed = 0

    for (const ixcCustomer of result.data) {
      try {
        const checksum = this.generateChecksum(ixcCustomer)

        await this.repository.upsertFromIxc({
          externalId: ixcCustomer.id,
          legalName: ixcCustomer.razao,
          tradeName: ixcCustomer.fantasia,
          documentMasked: ixcCustomer.cnpj_cpf,
          city: ixcCustomer.cidade,
          district: ixcCustomer.bairro,
          addressMasked: ixcCustomer.endereco,
          sourceUpdatedAt: new Date(ixcCustomer.data_cadastro),
          checksum,
        })

        synced++
      } catch (error) {
        this.logger.error(
          `Erro ao sincronizar cliente ${ixcCustomer.id}: ${error}`,
          undefined,
          'CustomersService'
        )
        failed++
      }
    }

    this.logger.log(
      `Sincronização concluída: ${synced} sucesso, ${failed} falhas`,
      'CustomersService'
    )

    return { synced, failed, total: result.total }
  }

  async refreshCustomer(id: string) {
    const customer = await this.repository.findById(id)
    if (!customer) {
      throw new NotFoundException(`Cliente ${id} não encontrado`)
    }

    const ixcCustomer = await this.ixcService.getCustomerById(customer.externalId)
    if (!ixcCustomer) {
      await this.repository.updateSyncStatus(id, SyncStatus.STALE)
      throw new NotFoundException(`Cliente não encontrado no IXC`)
    }

    const checksum = this.generateChecksum(ixcCustomer)

    return this.repository.upsertFromIxc({
      externalId: ixcCustomer.id,
      legalName: ixcCustomer.razao,
      tradeName: ixcCustomer.fantasia,
      documentMasked: ixcCustomer.cnpj_cpf,
      city: ixcCustomer.cidade,
      district: ixcCustomer.bairro,
      addressMasked: ixcCustomer.endereco,
      sourceUpdatedAt: new Date(ixcCustomer.data_cadastro),
      checksum,
    })
  }

  private generateChecksum(data: object): string {
    return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex').slice(0, 16)
  }
}
