import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportModule } from '@nestjs/passport'
import { JwtStrategy } from './strategies/jwt.strategy'
import { MockJwtStrategy } from './strategies/mock-jwt.strategy'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: 'JWT_STRATEGY',
      useFactory: (configService: ConfigService) => {
        const nodeEnv = configService.get<string>('NODE_ENV', 'development')
        if (nodeEnv === 'development' || nodeEnv === 'test') {
          return new MockJwtStrategy()
        }
        return new JwtStrategy(configService)
      },
      inject: [ConfigService],
    },
    JwtStrategy,
    MockJwtStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
