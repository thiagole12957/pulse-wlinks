import { Module } from '@nestjs/common'
import { AiInsightsService } from './ai-insights.service'
import { AiInsightsRepository } from './ai-insights.repository'
import { AiInsightsController } from './ai-insights.controller'
import { FinancialProfileModule } from '../financial-profile/financial-profile.module'

@Module({
  imports: [FinancialProfileModule],
  controllers: [AiInsightsController],
  providers: [AiInsightsService, AiInsightsRepository],
  exports: [AiInsightsService],
})
export class AiInsightsModule {}
