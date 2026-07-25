import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'

interface JwtPayload {
  sub: string
  email: string
  name: string
  realm_access?: {
    roles: string[]
  }
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService) {
    const nodeEnv = configService.get<string>('NODE_ENV', 'development')
    const issuerUrl = configService.get<string>('OIDC_ISSUER_URL')

    // Em desenvolvimento, usar configuração mock
    if (nodeEnv === 'development' || nodeEnv === 'test' || !issuerUrl) {
      super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: 'development-secret-key-not-for-production',
        ignoreExpiration: true,
      })
    } else {
      // Em produção, usar JWKS do Keycloak
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { passportJwtSecret } = require('jwks-rsa')
      const audience = configService.get<string>('OIDC_API_AUDIENCE')

      super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKeyProvider: passportJwtSecret({
          cache: true,
          rateLimit: true,
          jwksRequestsPerMinute: 5,
          jwksUri: `${issuerUrl}/protocol/openid-connect/certs`,
        }),
        issuer: issuerUrl,
        audience: audience,
        algorithms: ['RS256'],
      })
    }
  }

  validate(payload: JwtPayload) {
    return {
      id: payload.sub ?? 'mock-user-id',
      email: payload.email ?? 'operador@wlinks.com.br',
      name: payload.name ?? 'Operador Teste',
      roles: payload.realm_access?.roles ?? ['OPERATOR'],
    }
  }
}
