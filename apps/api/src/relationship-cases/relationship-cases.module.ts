import { Module } from '@nestjs/common'
import { RelationshipCasesController } from './relationship-cases.controller'
import { RelationshipCasesService } from './relationship-cases.service'
import { RelationshipCasesRepository } from './relationship-cases.repository'
import { EligibilityService } from './eligibility.service'

@Module({
  controllers: [RelationshipCasesController],
  providers: [RelationshipCasesService, RelationshipCasesRepository, EligibilityService],
  exports: [RelationshipCasesService, EligibilityService],
})
export class RelationshipCasesModule {}
