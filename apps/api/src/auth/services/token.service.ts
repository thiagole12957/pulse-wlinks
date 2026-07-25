import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { createHash, randomBytes } from 'crypto'
import { AUTH_CONSTANTS } from '../constants/auth.constants'

export interface AccessTokenPayload {
  sub: string
  email: string
  name: string
  role: string
  sessionId: string
}

export interface RefreshTokenPayload {
  sub: string
  tokenId: string
  sessionId: string
}

export interface TokenPair {
  accessToken: string
  refreshToken: string
  accessTokenExpiresAt: Date
  refreshTokenExpiresAt: Date
}

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateTokenPair(
    userId: string,
    email: string,
    name: string,
    role: string,
    sessionId: string,
  ): Promise<TokenPair> {
    const tokenId = randomBytes(32).toString('hex')
    const now = new Date()

    const accessTokenExpiration = this.configService.get<string>(
      'JWT_ACCESS_EXPIRATION',
      AUTH_CONSTANTS.ACCESS_TOKEN_EXPIRATION,
    )
    const refreshTokenExpiration = this.configService.get<string>(
      'JWT_REFRESH_EXPIRATION',
      AUTH_CONSTANTS.REFRESH_TOKEN_EXPIRATION,
    )

    const accessTokenPayload: AccessTokenPayload = {
      sub: userId,
      email,
      name,
      role,
      sessionId,
    }

    const refreshTokenPayload: RefreshTokenPayload = {
      sub: userId,
      tokenId,
      sessionId,
    }

    const accessToken = await this.jwtService.signAsync(accessTokenPayload, {
      expiresIn: accessTokenExpiration,
    })

    const refreshToken = await this.jwtService.signAsync(refreshTokenPayload, {
      expiresIn: refreshTokenExpiration,
    })

    const accessTokenExpiresAt = this.calculateExpiration(accessTokenExpiration, now)
    const refreshTokenExpiresAt = this.calculateExpiration(refreshTokenExpiration, now)

    return {
      accessToken,
      refreshToken,
      accessTokenExpiresAt,
      refreshTokenExpiresAt,
    }
  }

  async verifyAccessToken(token: string): Promise<AccessTokenPayload | null> {
    try {
      return await this.jwtService.verifyAsync<AccessTokenPayload>(token)
    } catch {
      return null
    }
  }

  async verifyRefreshToken(token: string): Promise<RefreshTokenPayload | null> {
    try {
      return await this.jwtService.verifyAsync<RefreshTokenPayload>(token)
    } catch {
      return null
    }
  }

  hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex')
  }

  generateRandomToken(): string {
    return randomBytes(32).toString('hex')
  }

  private calculateExpiration(expiration: string, from: Date): Date {
    const match = expiration.match(/^(\d+)([smhd])$/)
    if (!match) {
      // Default to 15 minutes if invalid format
      return new Date(from.getTime() + 15 * 60 * 1000)
    }

    const value = parseInt(match[1], 10)
    const unit = match[2]

    let ms: number
    switch (unit) {
      case 's':
        ms = value * 1000
        break
      case 'm':
        ms = value * 60 * 1000
        break
      case 'h':
        ms = value * 60 * 60 * 1000
        break
      case 'd':
        ms = value * 24 * 60 * 60 * 1000
        break
      default:
        ms = 15 * 60 * 1000
    }

    return new Date(from.getTime() + ms)
  }
}
