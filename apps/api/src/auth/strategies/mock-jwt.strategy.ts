import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-jwt'

@Injectable()
export class MockJwtStrategy extends PassportStrategy(Strategy, 'mock-jwt') {
  constructor() {
    super({
      jwtFromRequest: () => 'mock-token',
      secretOrKey: 'mock-secret',
    })
  }

  validate() {
    return {
      id: 'mock-user-id',
      email: 'operador@wlinks.com.br',
      name: 'Operador Teste',
      roles: ['OPERATOR'],
    }
  }
}
