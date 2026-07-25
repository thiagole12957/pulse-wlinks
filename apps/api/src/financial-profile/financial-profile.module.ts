import { Module } from '@nestjs/common'
import { FinancialProfileService } from './financial-profile.service'
import { FinancialProfileRepository } from './financial-profile.repository'

@Module({
  providers: [FinancialProfileService, FinancialProfileRepository],
  exports: [FinancialProfileService],
})
export class FinancialProfileModule {}
