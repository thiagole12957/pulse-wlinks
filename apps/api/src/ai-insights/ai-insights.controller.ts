import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger'
import { AiInsightsService } from './ai-insights.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

class FeedbackBodyDto {
  useful!: boolean
  comment?: string
}

@ApiTags('AI Insights')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ai-insights')
export class AiInsightsController {
  constructor(private readonly aiInsightsService: AiInsightsService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Obtém um insight pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do insight' })
  async getById(@Param('id') id: string) {
    return this.aiInsightsService.getById(id)
  }

  @Get('case/:caseId')
  @ApiOperation({ summary: 'Obtém insights de um caso' })
  @ApiParam({ name: 'caseId', description: 'ID do caso' })
  async getByCaseId(@Param('caseId') caseId: string) {
    return this.aiInsightsService.getByCaseId(caseId)
  }

  @Post('case/:caseId/generate')
  @ApiOperation({ summary: 'Gera um novo insight para o caso' })
  @ApiParam({ name: 'caseId', description: 'ID do caso' })
  async generate(@Param('caseId') caseId: string, @Request() req: any) {
    return this.aiInsightsService.generateInsight(caseId, req.user.sub)
  }

  @Post(':id/feedback')
  @ApiOperation({ summary: 'Adiciona feedback ao insight' })
  @ApiParam({ name: 'id', description: 'ID do insight' })
  @ApiBody({ type: FeedbackBodyDto })
  async addFeedback(
    @Param('id') id: string,
    @Body() body: FeedbackBodyDto,
    @Request() req: any
  ) {
    return this.aiInsightsService.addFeedback(
      id,
      req.user.sub,
      body.useful,
      body.comment
    )
  }

  @Post('case/:caseId/invalidate')
  @ApiOperation({ summary: 'Invalida todos os insights de um caso' })
  @ApiParam({ name: 'caseId', description: 'ID do caso' })
  @ApiBody({ schema: { properties: { reason: { type: 'string' } } } })
  async invalidate(
    @Param('caseId') caseId: string,
    @Body() body: { reason: string }
  ) {
    return this.aiInsightsService.invalidateByCaseId(caseId, body.reason)
  }

  @Get('stats/cost')
  @ApiOperation({ summary: 'Obtém resumo de custos de IA' })
  @ApiQuery({ name: 'startDate', description: 'Data inicial (ISO)' })
  @ApiQuery({ name: 'endDate', description: 'Data final (ISO)' })
  async getCostSummary(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ) {
    return this.aiInsightsService.getCostSummary(
      new Date(startDate),
      new Date(endDate)
    )
  }
}
