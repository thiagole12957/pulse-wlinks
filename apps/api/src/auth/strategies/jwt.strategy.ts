import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from '../../common/prisma/prisma.service'
import { SessionService } from '../services/session.service'
import { UserStatus } from '@prisma/client'

interface JwtPayload {
  sub: string
  email: string
  name: string
  role: string
  sessionId: string
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly sessionService: SessionService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>(
        'JWT_SECRET',
        'development-secret-key-not-for-production',
      ),
      ignoreExpiration: false,
    })
  }

  async validate(payload: JwtPayload) {
    // Verificar se o usuário ainda existe e está ativo
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        mustChangePassword: true,
        teamId: true,
      },
    })

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado')
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('Usuário inativo ou bloqueado')
    }

    // Verificar se a sessão ainda é válida
    if (payload.sessionId) {
      const sessionValid = await this.sessionService.isSessionValid(payload.sessionId)
      if (!sessionValid) {
        throw new UnauthorizedException('Sessão expirada ou revogada')
      }
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      mustChangePassword: user.mustChangePassword,
      sessionId: payload.sessionId,
      teamId: user.teamId,
    }
  }
}
