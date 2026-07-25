import { Injectable, ExecutionContext } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private configService: ConfigService) {
    super()
  }

  canActivate(context: ExecutionContext) {
    const nodeEnv = this.configService.get<string>('NODE_ENV', 'development')

    // Em desenvolvimento/teste, usar mock strategy
    if (nodeEnv === 'development' || nodeEnv === 'test') {
      const request = context.switchToHttp().getRequest()

      // Mock user para desenvolvimento
      request.user = {
        id: 'mock-user-id',
        email: 'operador@wlinks.com.br',
        name: 'Operador Teste',
        roles: ['OPERATOR'],
      }
      return true
    }

    return super.canActivate(context)
  }
}
