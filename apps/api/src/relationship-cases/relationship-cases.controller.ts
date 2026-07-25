import { Controller, Get, Post, Param, Query, Body, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiResponse, ApiBody } from '@nestjs/swagger'
import { RelationshipCasesService } from './relationship-cases.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CaseStatus } from '@prisma/client'

class TransitionDto {
  status!: CaseStatus
}

class AssignDto {
  userId!: string
  teamId?: string
}

@ApiTags('Relationship Cases')
@Controller('relationship-cases')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RelationshipCasesController {
  constructor(private readonly casesService: RelationshipCasesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar casos de relacionamento (Fila)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, enum: CaseStatus })
  @ApiQuery({ name: 'assignedUserId', required: false, type: String })
  @ApiQuery({ name: 'customerId', required: false, type: String })
  @ApiQuery({ name: 'branchId', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Lista paginada de casos' })
  async findMany(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('status') status?: CaseStatus,
    @Query('assignedUserId') assignedUserId?: string,
    @Query('customerId') customerId?: string,
    @Query('branchId') branchId?: string
  ) {
    return this.casesService.findMany(
      { status, assignedUserId, customerId, branchId },
      { page: Number(page), limit: Math.min(Number(limit), 100) }
    )
  }

  @Get('stats')
  @ApiOperation({ summary: 'Estatísticas da fila' })
  @ApiQuery({ name: 'branchId', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Contagem por status' })
  async getStats(@Query('branchId') branchId?: string) {
    return this.casesService.getQueueStats(branchId)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar caso por ID' })
  @ApiResponse({ status: 200, description: 'Detalhes do caso' })
  @ApiResponse({ status: 404, description: 'Caso não encontrado' })
  async findById(@Param('id') id: string) {
    return this.casesService.findById(id)
  }

  @Post(':id/transition')
  @ApiOperation({ summary: 'Transicionar status do caso' })
  @ApiBody({ type: TransitionDto })
  @ApiResponse({ status: 200, description: 'Status atualizado' })
  @ApiResponse({ status: 400, description: 'Transição inválida' })
  async transition(@Param('id') id: string, @Body() body: TransitionDto) {
    // TODO: Obter userId do token
    return this.casesService.transition(id, body.status, 'mock-user-id')
  }

  @Post(':id/assign')
  @ApiOperation({ summary: 'Atribuir caso a operador' })
  @ApiBody({ type: AssignDto })
  @ApiResponse({ status: 200, description: 'Caso atribuído' })
  async assign(@Param('id') id: string, @Body() body: AssignDto) {
    return this.casesService.assign(id, body.userId, body.teamId)
  }

  @Post('evaluate')
  @ApiOperation({ summary: 'Avaliar elegibilidade e criar casos' })
  @ApiResponse({ status: 200, description: 'Resultado da avaliação' })
  async evaluate() {
    return this.casesService.evaluateAndCreateCases()
  }
}
