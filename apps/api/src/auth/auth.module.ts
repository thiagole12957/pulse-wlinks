import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { ThrottlerModule } from '@nestjs/throttler'

// Controller
import { AuthController } from './auth.controller'

// Service
import { AuthService } from './auth.service'

// Services
import {
  PasswordService,
  TokenService,
  SessionService,
  IpValidationService,
  TimeAccessService,
} from './services'

// Strategies
import { JwtStrategy } from './strategies/jwt.strategy'
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy'
import { LocalStrategy } from './strategies/local.strategy'

// Guards
import {
  JwtAuthGuard,
  LocalAuthGuard,
  JwtRefreshGuard,
  RolesGuard,
  IpWhitelistGuard,
  TimeAccessGuard,
} from './guards'

import { AUTH_CONSTANTS } from './constants/auth.constants'

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>(
          'JWT_SECRET',
          'development-secret-key-not-for-production',
        ),
        signOptions: {
          expiresIn: configService.get<string>(
            'JWT_ACCESS_EXPIRATION',
            AUTH_CONSTANTS.ACCESS_TOKEN_EXPIRATION,
          ),
        },
      }),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: AUTH_CONSTANTS.GLOBAL_RATE_LIMIT_TTL,
        limit: AUTH_CONSTANTS.GLOBAL_RATE_LIMIT,
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    // Main service
    AuthService,

    // Supporting services
    PasswordService,
    TokenService,
    SessionService,
    IpValidationService,
    TimeAccessService,

    // Strategies
    JwtStrategy,
    JwtRefreshStrategy,
    LocalStrategy,

    // Guards
    JwtAuthGuard,
    LocalAuthGuard,
    JwtRefreshGuard,
    RolesGuard,
    IpWhitelistGuard,
    TimeAccessGuard,
  ],
  exports: [
    AuthService,
    PasswordService,
    TokenService,
    SessionService,
    IpValidationService,
    TimeAccessService,
    JwtAuthGuard,
    RolesGuard,
    IpWhitelistGuard,
    TimeAccessGuard,
  ],
})
export class AuthModule {}
