import { Module } from '@nestjs/common'
import { InvoicesController } from './invoices.controller'
import { InvoicesService } from './invoices.service'
import { InvoicesRepository } from './invoices.repository'
import { IntegrationsModule } from '../integrations/integrations.module'

@Module({
  imports: [IntegrationsModule],
  controllers: [InvoicesController],
  providers: [InvoicesService, InvoicesRepository],
  exports: [InvoicesService],
})
export class InvoicesModule {}
