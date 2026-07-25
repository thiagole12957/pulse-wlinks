import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'
import { AuthService } from '../auth.service'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    })
  }

  async validate(email: string, password: string) {
    const result = await this.authService.validateCredentials(email, password)

    if (!result.valid) {
      throw new UnauthorizedException(result.error ?? 'Credenciais inválidas')
    }

    return result.user
  }
}
