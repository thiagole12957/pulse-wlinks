import { Module } from '@nestjs/common'
import { ContractsController } from './contracts.controller'
import { ContractsService } from './contracts.service'
import { ContractsRepository } from './contracts.repository'
import { IntegrationsModule } from '../integrations/integrations.module'

@Module({
  imports: [IntegrationsModule],
  controllers: [ContractsController],
  providers: [ContractsService, ContractsRepository],
  exports: [ContractsService],
})
export class ContractsModule {}
