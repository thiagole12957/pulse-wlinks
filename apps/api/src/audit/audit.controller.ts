import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger'
import { AuditService } from './audit.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@ApiTags('Auditoria')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Obtém um evento de auditoria pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do evento' })
  async getById(@Param('id') id: string) {
    return this.auditService.getById(id)
  }

  @Get()
  @ApiOperation({ summary: 'Consulta eventos de auditoria' })
  @ApiQuery({ name: 'actorUserId', required: false })
  @ApiQuery({ name: 'resourceType', required: false })
  @ApiQuery({ name: 'resourceId', required: false })
  @ApiQuery({ name: 'action', required: false })
  @ApiQuery({ name: 'result', required: false })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'offset', required: false })
  async query(
    @Query('actorUserId') actorUserId?: string,
    @Query('resourceType') resourceType?: string,
    @Query('resourceId') resourceId?: string,
    @Query('action') action?: string,
    @Query('result') result?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number
  ) {
    return this.auditService.query({
      actorUserId,
      resourceType,
      resourceId,
      action,
      result,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
    })
  }

  @Get('resource/:resourceType/:resourceId')
  @ApiOperation({ summary: 'Obtém eventos de um recurso específico' })
  @ApiParam({ name: 'resourceType', description: 'Tipo do recurso' })
  @ApiParam({ name: 'resourceId', description: 'ID do recurso' })
  @ApiQuery({ name: 'limit', required: false })
  async getByResource(
    @Param('resourceType') resourceType: string,
    @Param('resourceId') resourceId: string,
    @Query('limit') limit?: number
  ) {
    return this.auditService.getByResource(
      resourceType,
      resourceId,
      limit ? Number(limit) : undefined
    )
  }

  @Get('correlation/:correlationId')
  @ApiOperation({ summary: 'Obtém eventos por correlation ID' })
  @ApiParam({ name: 'correlationId', description: 'Correlation ID' })
  async getByCorrelationId(@Param('correlationId') correlationId: string) {
    return this.auditService.getByCorrelationId(correlationId)
  }

  @Get('stats/activity')
  @ApiOperation({ summary: 'Obtém resumo de atividades' })
  @ApiQuery({ name: 'startDate', description: 'Data inicial (ISO)' })
  @ApiQuery({ name: 'endDate', description: 'Data final (ISO)' })
  async getActivitySummary(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ) {
    return this.auditService.getActivitySummary(
      new Date(startDate),
      new Date(endDate)
    )
  }
}
