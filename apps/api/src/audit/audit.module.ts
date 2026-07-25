import { Global, Module } from '@nestjs/common'
import { AuditService, AuditActions } from './audit.service'
import { AuditRepository } from './audit.repository'
import { AuditController } from './audit.controller'

@Global()
@Module({
  controllers: [AuditController],
  providers: [AuditService, AuditRepository],
  exports: [AuditService],
})
export class AuditModule {}

export { AuditActions }
