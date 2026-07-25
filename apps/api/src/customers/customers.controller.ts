import { Controller, Get, Post, Param, Query, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiResponse } from '@nestjs/swagger'
import { CustomersService } from './customers.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { SyncStatus } from '@prisma/client'

@ApiTags('Customers')
@Controller('customers')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  @ApiOperation({ summary: 'Listar clientes' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'syncStatus', required: false, enum: SyncStatus })
  @ApiQuery({ name: 'city', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Lista paginada de clientes' })
  async findMany(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('search') search?: string,
    @Query('syncStatus') syncStatus?: SyncStatus,
    @Query('city') city?: string
  ) {
    return this.customersService.findMany(
      { search, syncStatus, city },
      { page: Number(page), limit: Math.min(Number(limit), 100) }
    )
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar cliente por ID' })
  @ApiResponse({ status: 200, description: 'Detalhes do cliente' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  async findById(@Param('id') id: string) {
    return this.customersService.findById(id)
  }

  @Get(':id/overview')
  @ApiOperation({ summary: 'Visão geral do cliente (Cliente 360)' })
  @ApiResponse({ status: 200, description: 'Visão completa do cliente' })
  async getOverview(@Param('id') id: string) {
    return this.customersService.findById(id)
  }

  @Post(':id/refresh')
  @ApiOperation({ summary: 'Atualizar dados do cliente do IXC' })
  @ApiResponse({ status: 200, description: 'Cliente atualizado' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  async refresh(@Param('id') id: string) {
    return this.customersService.refreshCustomer(id)
  }

  @Post('sync')
  @ApiOperation({ summary: 'Sincronizar clientes do IXC' })
  @ApiResponse({ status: 200, description: 'Resultado da sincronização' })
  async sync() {
    return this.customersService.syncFromIxc()
  }
}
