import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger'
import { Throttle } from '@nestjs/throttler'
import { Request } from 'express'
import { AuthService } from './auth.service'
import { SessionService } from './services/session.service'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { JwtRefreshGuard } from './guards/jwt-refresh.guard'
import { Public } from './decorators/public.decorator'
import { CurrentUser, CurrentUserData } from './decorators/current-user.decorator'
import { LoginDto, LoginResponseDto } from './dto/login.dto'
import { RefreshTokenDto, RefreshResponseDto } from './dto/refresh-token.dto'
import { ChangePasswordDto } from './dto/change-password.dto'
import { AUTH_CONSTANTS } from './constants/auth.constants'

interface RefreshUserData {
  userId: string
  tokenId: string
  sessionId: string
  refreshToken: string
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly sessionService: SessionService,
  ) {}

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: AUTH_CONSTANTS.LOGIN_RATE_LIMIT, ttl: AUTH_CONSTANTS.LOGIN_RATE_LIMIT_TTL } })
  @ApiOperation({ summary: 'Realizar login' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login realizado com sucesso', type: LoginResponseDto })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  @ApiResponse({ status: 429, description: 'Muitas tentativas de login' })
  async login(@Body() dto: LoginDto, @Req() req: Request): Promise<LoginResponseDto> {
    const ipAddress = this.getClientIp(req)
    const userAgent = req.headers['user-agent']

    return this.authService.login({
      email: dto.email,
      password: dto.password,
      ipAddress,
      userAgent,
    })
  }

  @Post('refresh')
  @Public()
  @UseGuards(JwtRefreshGuard)
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: AUTH_CONSTANTS.REFRESH_RATE_LIMIT, ttl: AUTH_CONSTANTS.REFRESH_RATE_LIMIT_TTL } })
  @ApiOperation({ summary: 'Renovar tokens' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({ status: 200, description: 'Tokens renovados', type: RefreshResponseDto })
  @ApiResponse({ status: 401, description: 'Refresh token inválido ou expirado' })
  async refresh(@Req() req: Request): Promise<RefreshResponseDto> {
    const user = req.user as RefreshUserData
    const ipAddress = this.getClientIp(req)

    const tokenPair = await this.authService.refresh(
      user.userId,
      user.tokenId,
      user.sessionId,
      user.refreshToken,
      ipAddress,
    )

    return {
      accessToken: tokenPair.accessToken,
      refreshToken: tokenPair.refreshToken,
      expiresAt: tokenPair.accessTokenExpiresAt,
    }
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Realizar logout' })
  @ApiResponse({ status: 204, description: 'Logout realizado' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async logout(@CurrentUser() user: CurrentUserData): Promise<void> {
    await this.authService.logout(user.id, user.sessionId)
  }

  @Delete('sessions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Encerrar todas as outras sessões' })
  @ApiResponse({ status: 200, description: 'Sessões encerradas' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async logoutAllSessions(@CurrentUser() user: CurrentUserData) {
    const count = await this.authService.logoutAllSessions(user.id, user.sessionId)
    return { message: `${count} sessão(ões) encerrada(s)`, revokedCount: count }
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retorna o usuário autenticado' })
  @ApiResponse({ status: 200, description: 'Usuário atual' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async me(@CurrentUser() user: CurrentUserData) {
    return this.authService.getCurrentUser(user.id)
  }

  @Get('me/scopes')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retorna os escopos do usuário autenticado' })
  @ApiResponse({ status: 200, description: 'Escopos do usuário' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async scopes(@CurrentUser() user: CurrentUserData) {
    return this.authService.getUserScopes(user.id)
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Alterar própria senha' })
  @ApiBody({ type: ChangePasswordDto })
  @ApiResponse({ status: 204, description: 'Senha alterada com sucesso' })
  @ApiResponse({ status: 400, description: 'Senha atual incorreta ou nova senha inválida' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async changePassword(
    @CurrentUser() user: CurrentUserData,
    @Body() dto: ChangePasswordDto,
  ): Promise<void> {
    await this.authService.changePassword(
      user.id,
      dto.currentPassword,
      dto.newPassword,
      dto.confirmPassword,
    )
  }

  @Get('sessions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar sessões ativas' })
  @ApiResponse({ status: 200, description: 'Lista de sessões' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async getSessions(@CurrentUser() user: CurrentUserData) {
    return this.sessionService.getUserSessions(user.id, user.sessionId)
  }

  @Delete('sessions/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Revogar sessão específica' })
  @ApiResponse({ status: 204, description: 'Sessão revogada' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async revokeSession(
    @CurrentUser() user: CurrentUserData,
    @Param('id') sessionId: string,
  ): Promise<void> {
    // Não permitir revogar a própria sessão por este endpoint
    if (sessionId === user.sessionId) {
      await this.authService.logout(user.id, user.sessionId)
    } else {
      await this.sessionService.revokeSession(sessionId)
    }
  }

  private getClientIp(req: Request): string {
    const forwardedFor = req.headers['x-forwarded-for']
    if (forwardedFor) {
      const ips = (Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor)
        .split(',')
        .map((ip) => ip.trim())
      return ips[0]
    }

    const realIp = req.headers['x-real-ip']
    if (realIp) {
      return Array.isArray(realIp) ? realIp[0] : realIp
    }

    return req.ip || req.socket?.remoteAddress || '127.0.0.1'
  }
}
