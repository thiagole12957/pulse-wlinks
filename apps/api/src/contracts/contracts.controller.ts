import { Controller, Get, Post, Param, Query, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiResponse } from '@nestjs/swagger'
import { ContractsService } from './contracts.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { ContractStatus, InternetStatus } from '@prisma/client'

@ApiTags('Contracts')
@Controller('contracts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar contratos' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'customerId', required: false, type: String })
  @ApiQuery({ name: 'branchId', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, enum: ContractStatus })
  @ApiQuery({ name: 'internetStatus', required: false, enum: InternetStatus })
  @ApiResponse({ status: 200, description: 'Lista paginada de contratos' })
  async findMany(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('customerId') customerId?: string,
    @Query('branchId') branchId?: string,
    @Query('status') status?: ContractStatus,
    @Query('internetStatus') internetStatus?: InternetStatus
  ) {
    return this.contractsService.findMany(
      { customerId, branchId, status, internetStatus },
      { page: Number(page), limit: Math.min(Number(limit), 100) }
    )
  }

  @Get('blocked-online')
  @ApiOperation({ summary: 'Listar contratos bloqueados mas com acesso online' })
  @ApiResponse({ status: 200, description: 'Contratos com anomalia' })
  async getBlockedWithOnline() {
    return this.contractsService.getBlockedWithOnlineAccess()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar contrato por ID' })
  @ApiResponse({ status: 200, description: 'Detalhes do contrato' })
  @ApiResponse({ status: 404, description: 'Contrato não encontrado' })
  async findById(@Param('id') id: string) {
    return this.contractsService.findById(id)
  }

  @Post('sync')
  @ApiOperation({ summary: 'Sincronizar contratos do IXC' })
  @ApiResponse({ status: 200, description: 'Resultado da sincronização' })
  async sync(@Query('customerId') customerId?: string) {
    return this.contractsService.syncFromIxc(customerId)
  }
}
