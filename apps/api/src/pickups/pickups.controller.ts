import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger'
import { PickupsService } from './pickups.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@ApiTags('Recolhimento')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('pickups')
export class PickupsController {
  constructor(private readonly pickupsService: PickupsService) {}

  // Assessments
  @Get('assessments/:id')
  @ApiOperation({ summary: 'Obtém uma avaliação de recolhimento pelo ID' })
  @ApiParam({ name: 'id', description: 'ID da avaliação' })
  async getAssessmentById(@Param('id') id: string) {
    return this.pickupsService.getAssessmentById(id)
  }

  @Get('assessments/case/:caseId')
  @ApiOperation({ summary: 'Obtém avaliações de um caso' })
  @ApiParam({ name: 'caseId', description: 'ID do caso' })
  async getAssessmentsByCaseId(@Param('caseId') caseId: string) {
    return this.pickupsService.getAssessmentsByCaseId(caseId)
  }

  @Post('assessments/case/:caseId')
  @ApiOperation({ summary: 'Cria uma nova avaliação de recolhimento' })
  @ApiParam({ name: 'caseId', description: 'ID do caso' })
  async createAssessment(@Param('caseId') caseId: string, @Request() req: any) {
    return this.pickupsService.createAssessment(caseId, req.user.sub)
  }

  // Requests
  @Get('requests/pending')
  @ApiOperation({ summary: 'Lista solicitações pendentes de aprovação' })
  async getPendingApproval() {
    return this.pickupsService.getPendingApproval()
  }

  @Get('requests/:id')
  @ApiOperation({ summary: 'Obtém uma solicitação de recolhimento pelo ID' })
  @ApiParam({ name: 'id', description: 'ID da solicitação' })
  async getRequestById(@Param('id') id: string) {
    return this.pickupsService.getRequestById(id)
  }

  @Post('requests/assessment/:assessmentId')
  @ApiOperation({ summary: 'Cria solicitação de recolhimento a partir de avaliação' })
  @ApiParam({ name: 'assessmentId', description: 'ID da avaliação' })
  async createRequest(
    @Param('assessmentId') assessmentId: string,
    @Request() req: any
  ) {
    return this.pickupsService.createRequest(assessmentId, req.user.sub)
  }

  @Patch('requests/:id/approve')
  @ApiOperation({ summary: 'Aprova uma solicitação de recolhimento' })
  @ApiParam({ name: 'id', description: 'ID da solicitação' })
  async approve(@Param('id') id: string, @Request() req: any) {
    return this.pickupsService.approve(id, req.user.sub)
  }

  @Patch('requests/:id/reject')
  @ApiOperation({ summary: 'Rejeita uma solicitação de recolhimento' })
  @ApiParam({ name: 'id', description: 'ID da solicitação' })
  @ApiBody({ schema: { properties: { reason: { type: 'string' } } } })
  async reject(
    @Param('id') id: string,
    @Body() body: { reason: string },
    @Request() req: any
  ) {
    return this.pickupsService.reject(id, req.user.sub, body.reason)
  }

  @Patch('requests/:id/open-gc')
  @ApiOperation({ summary: 'Marca solicitação como aberta no GC' })
  @ApiParam({ name: 'id', description: 'ID da solicitação' })
  @ApiBody({ schema: { properties: { gcExternalId: { type: 'string' } } } })
  async openInGc(@Param('id') id: string, @Body() body: { gcExternalId: string }) {
    return this.pickupsService.openInGc(id, body.gcExternalId)
  }

  @Patch('requests/:id/complete')
  @ApiOperation({ summary: 'Marca recolhimento como concluído' })
  @ApiParam({ name: 'id', description: 'ID da solicitação' })
  async complete(@Param('id') id: string) {
    return this.pickupsService.complete(id)
  }

  @Patch('requests/:id/cancel')
  @ApiOperation({ summary: 'Cancela uma solicitação de recolhimento' })
  @ApiParam({ name: 'id', description: 'ID da solicitação' })
  async cancel(@Param('id') id: string) {
    return this.pickupsService.cancel(id)
  }

  @Get('stats/summary')
  @ApiOperation({ summary: 'Obtém resumo por status' })
  async getStatusSummary() {
    return this.pickupsService.getStatusSummary()
  }
}
