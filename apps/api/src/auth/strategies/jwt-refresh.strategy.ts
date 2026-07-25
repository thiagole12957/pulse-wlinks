import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import { Request } from 'express'
import { SessionService } from '../services/session.service'
import { TokenService } from '../services/token.service'

interface RefreshTokenPayload {
  sub: string
  tokenId: string
  sessionId: string
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    configService: ConfigService,
    private readonly sessionService: SessionService,
    private readonly tokenService: TokenService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      secretOrKey: configService.get<string>('JWT_SECRET', 'development-secret-key-not-for-production'),
      passReqToCallback: true,
    })
  }

  async validate(req: Request, payload: RefreshTokenPayload) {
    const refreshToken = req.body.refreshToken

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token não fornecido')
    }

    // Verificar se o token existe e não foi revogado
    const tokenHash = this.tokenService.hashToken(refreshToken)
    const tokenValidation = await this.sessionService.validateRefreshToken(tokenHash)

    if (!tokenValidation.valid) {
      throw new UnauthorizedException('Refresh token inválido ou expirado')
    }

    // Verificar se a sessão ainda é válida
    if (tokenValidation.sessionId) {
      const sessionValid = await this.sessionService.isSessionValid(tokenValidation.sessionId)
      if (!sessionValid) {
        throw new UnauthorizedException('Sessão expirada ou revogada')
      }
    }

    return {
      userId: payload.sub,
      tokenId: tokenValidation.tokenId,
      sessionId: tokenValidation.sessionId,
      refreshToken,
    }
  }
}
