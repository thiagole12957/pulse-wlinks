import { Controller, Get, Post, Param, Query, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger'
import { ScoreService } from './score.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@ApiTags('Score')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('customers/:customerId/score')
export class ScoreController {
  constructor(private readonly scoreService: ScoreService) {}

  @Get()
  @ApiOperation({ summary: 'Obtém o score mais recente do cliente' })
  @ApiParam({ name: 'customerId', description: 'ID do cliente' })
  async getLatestScore(@Param('customerId') customerId: string) {
    const snapshot = await this.scoreService.getLatestScore(customerId)
    const explanations = this.scoreService.getScoreExplanation(snapshot.factors as any)
    return {
      ...snapshot,
      explanations,
    }
  }

  @Get('history')
  @ApiOperation({ summary: 'Obtém o histórico de scores do cliente' })
  @ApiParam({ name: 'customerId', description: 'ID do cliente' })
  @ApiQuery({ name: 'limit', required: false, description: 'Limite de registros' })
  async getScoreHistory(
    @Param('customerId') customerId: string,
    @Query('limit') limit?: number
  ) {
    return this.scoreService.getScoreHistory(customerId, limit || 10)
  }

  @Post('recalculate')
  @ApiOperation({ summary: 'Recalcula o score do cliente' })
  @ApiParam({ name: 'customerId', description: 'ID do cliente' })
  async recalculate(@Param('customerId') customerId: string) {
    const snapshot = await this.scoreService.calculateAndSave(customerId)
    const explanations = this.scoreService.getScoreExplanation(snapshot.factors as any)
    return {
      ...snapshot,
      explanations,
    }
  }
}
