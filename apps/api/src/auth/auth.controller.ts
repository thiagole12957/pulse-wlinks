import { Controller, Get, UseGuards, Req } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { AuthService } from './auth.service'
import type { Request } from 'express'

interface AuthenticatedRequest extends Request {
  user: {
    id: string
    email: string
    name: string
    roles: string[]
  }
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retorna o usuário autenticado' })
  @ApiResponse({ status: 200, description: 'Usuário atual' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async me(@Req() req: AuthenticatedRequest) {
    return this.authService.getCurrentUser(req.user.id)
  }

  @Get('me/scopes')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retorna os escopos do usuário autenticado' })
  @ApiResponse({ status: 200, description: 'Escopos do usuário' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async scopes(@Req() req: AuthenticatedRequest) {
    return this.authService.getUserScopes(req.user.id)
  }
}
