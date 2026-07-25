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
import { ContactsService } from './contacts.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { ContactChannel, ContactOutcome } from '@prisma/client'

class CreateContactBodyDto {
  caseId!: string
  channel!: ContactChannel
  outcome!: ContactOutcome
  externalThreadId?: string
  summary?: string
  contactedAt?: string
  metadata?: Record<string, unknown>
}

@ApiTags('Contatos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Get('my-recent')
  @ApiOperation({ summary: 'Obtém contatos recentes do usuário autenticado' })
  @ApiQuery({ name: 'limit', required: false, description: 'Limite de registros' })
  async getMyRecentContacts(@Request() req: any, @Query('limit') limit?: number) {
    return this.contactsService.getMyRecentContacts(req.user.sub, limit || 50)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtém um contato pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do contato' })
  async getById(@Param('id') id: string) {
    return this.contactsService.getById(id)
  }

  @Get('case/:caseId')
  @ApiOperation({ summary: 'Obtém contatos de um caso' })
  @ApiParam({ name: 'caseId', description: 'ID do caso' })
  async getByCaseId(@Param('caseId') caseId: string) {
    return this.contactsService.getByCaseId(caseId)
  }

  @Get('case/:caseId/stats')
  @ApiOperation({ summary: 'Obtém estatísticas de contatos de um caso' })
  @ApiParam({ name: 'caseId', description: 'ID do caso' })
  async getStatsByCaseId(@Param('caseId') caseId: string) {
    return this.contactsService.getContactStatsByCaseId(caseId)
  }

  @Get('customer/:customerId')
  @ApiOperation({ summary: 'Obtém contatos de um cliente' })
  @ApiParam({ name: 'customerId', description: 'ID do cliente' })
  async getByCustomerId(@Param('customerId') customerId: string) {
    return this.contactsService.getByCustomerId(customerId)
  }

  @Post()
  @ApiOperation({ summary: 'Registra uma nova tentativa de contato' })
  @ApiBody({ type: CreateContactBodyDto })
  async create(@Body() body: CreateContactBodyDto, @Request() req: any) {
    return this.contactsService.create({
      caseId: body.caseId,
      actorUserId: req.user.sub,
      channel: body.channel,
      outcome: body.outcome,
      externalThreadId: body.externalThreadId,
      summary: body.summary,
      contactedAt: body.contactedAt ? new Date(body.contactedAt) : undefined,
      metadata: body.metadata,
    })
  }
}
