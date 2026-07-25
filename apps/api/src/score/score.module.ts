import { Module } from '@nestjs/common'
import { ScoreService } from './score.service'
import { ScoreRepository } from './score.repository'
import { ScoreController } from './score.controller'
import { FinancialProfileModule } from '../financial-profile/financial-profile.module'

@Module({
  imports: [FinancialProfileModule],
  controllers: [ScoreController],
  providers: [ScoreService, ScoreRepository],
  exports: [ScoreService],
})
export class ScoreModule {}
