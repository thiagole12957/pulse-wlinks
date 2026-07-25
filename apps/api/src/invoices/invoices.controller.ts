import { Controller, Get, Post, Param, Query, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiResponse } from '@nestjs/swagger'
import { InvoicesService } from './invoices.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { InvoiceStatus } from '@prisma/client'

@ApiTags('Invoices')
@Controller('invoices')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar faturas' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'customerId', required: false, type: String })
  @ApiQuery({ name: 'contractId', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, enum: InvoiceStatus })
  @ApiQuery({ name: 'overdueDays', required: false, type: Number })
  @ApiQuery({ name: 'minAmount', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Lista paginada de faturas' })
  async findMany(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('customerId') customerId?: string,
    @Query('contractId') contractId?: string,
    @Query('status') status?: InvoiceStatus,
    @Query('overdueDays') overdueDays?: number,
    @Query('minAmount') minAmount?: number
  ) {
    return this.invoicesService.findMany(
      {
        customerId,
        contractId,
        status,
        overdueDays: overdueDays ? Number(overdueDays) : undefined,
        minAmount: minAmount ? Number(minAmount) : undefined,
      },
      { page: Number(page), limit: Math.min(Number(limit), 100) }
    )
  }

  @Get('overdue')
  @ApiOperation({ summary: 'Listar faturas em atraso' })
  @ApiQuery({ name: 'minDays', required: false, type: Number, description: 'Mínimo de dias em atraso (padrão: 7)' })
  @ApiQuery({ name: 'minAmount', required: false, type: Number, description: 'Valor mínimo (padrão: 0)' })
  @ApiResponse({ status: 200, description: 'Faturas em atraso' })
  async getOverdue(
    @Query('minDays') minDays?: number,
    @Query('minAmount') minAmount?: number
  ) {
    return this.invoicesService.getOverdueInvoices(
      minDays ? Number(minDays) : 7,
      minAmount ? Number(minAmount) : 0
    )
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar fatura por ID' })
  @ApiResponse({ status: 200, description: 'Detalhes da fatura' })
  @ApiResponse({ status: 404, description: 'Fatura não encontrada' })
  async findById(@Param('id') id: string) {
    return this.invoicesService.findById(id)
  }

  @Post(':id/send-payment-link')
  @ApiOperation({ summary: 'Enviar link de pagamento (2ª via/Pix)' })
  @ApiResponse({ status: 200, description: 'Link gerado' })
  @ApiResponse({ status: 404, description: 'Fatura não encontrada' })
  async sendPaymentLink(@Param('id') id: string) {
    return this.invoicesService.sendPaymentLink(id)
  }

  @Post('sync')
  @ApiOperation({ summary: 'Sincronizar faturas do IXC' })
  @ApiResponse({ status: 200, description: 'Resultado da sincronização' })
  async sync(@Query('customerId') customerId?: string) {
    return this.invoicesService.syncFromIxc(customerId)
  }
}
