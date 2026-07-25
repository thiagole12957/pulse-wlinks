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
import { PromisesService } from './promises.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

class CreatePromiseBodyDto {
  caseId!: string
  amount!: number
  promisedAt!: string
  notes?: string
  invoiceIds?: string[]
}

@ApiTags('Promessas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('promises')
export class PromisesController {
  constructor(private readonly promisesService: PromisesService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Obtém uma promessa pelo ID' })
  @ApiParam({ name: 'id', description: 'ID da promessa' })
  async getById(@Param('id') id: string) {
    return this.promisesService.getById(id)
  }

  @Get('case/:caseId')
  @ApiOperation({ summary: 'Obtém promessas de um caso' })
  @ApiParam({ name: 'caseId', description: 'ID do caso' })
  async getByCaseId(@Param('caseId') caseId: string) {
    return this.promisesService.getByCaseId(caseId)
  }

  @Get('customer/:customerId/active')
  @ApiOperation({ summary: 'Obtém promessas ativas de um cliente' })
  @ApiParam({ name: 'customerId', description: 'ID do cliente' })
  async getActiveByCustomerId(@Param('customerId') customerId: string) {
    return this.promisesService.getActiveByCustomerId(customerId)
  }

  @Post()
  @ApiOperation({ summary: 'Cria uma nova promessa de pagamento' })
  @ApiBody({ type: CreatePromiseBodyDto })
  async create(@Body() body: CreatePromiseBodyDto, @Request() req: any) {
    return this.promisesService.create({
      caseId: body.caseId,
      createdById: req.user.sub,
      amount: body.amount,
      promisedAt: new Date(body.promisedAt),
      notes: body.notes,
      invoiceIds: body.invoiceIds,
    })
  }

  @Patch(':id/fulfill')
  @ApiOperation({ summary: 'Marca a promessa como cumprida' })
  @ApiParam({ name: 'id', description: 'ID da promessa' })
  async markAsFulfilled(@Param('id') id: string) {
    return this.promisesService.markAsFulfilled(id)
  }

  @Patch(':id/break')
  @ApiOperation({ summary: 'Marca a promessa como quebrada' })
  @ApiParam({ name: 'id', description: 'ID da promessa' })
  async markAsBroken(@Param('id') id: string) {
    return this.promisesService.markAsBroken(id)
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancela a promessa' })
  @ApiParam({ name: 'id', description: 'ID da promessa' })
  async cancel(@Param('id') id: string) {
    return this.promisesService.cancel(id)
  }
}
