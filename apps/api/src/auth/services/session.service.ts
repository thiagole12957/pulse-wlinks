import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../common/prisma/prisma.service'
import { AUTH_CONSTANTS } from '../constants/auth.constants'
import { TokenService } from './token.service'

export interface CreateSessionInput {
  userId: string
  ipAddress: string
  userAgent?: string
}

export interface SessionInfo {
  id: string
  ipAddress: string
  userAgent: string | null
  createdAt: Date
  lastActiveAt: Date
  isCurrent: boolean
}

@Injectable()
export class SessionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService,
  ) {}

  async createSession(input: CreateSessionInput): Promise<string> {
    const expiresAt = new Date(Date.now() + AUTH_CONSTANTS.SESSION_EXPIRATION_MS)

    const session = await this.prisma.session.create({
      data: {
        userId: input.userId,
        ipAddress: input.ipAddress,
        userAgent: input.userAgent ?? null,
        expiresAt,
      },
    })

    return session.id
  }

  async createRefreshToken(
    userId: string,
    sessionId: string,
    refreshToken: string,
    expiresAt: Date,
  ): Promise<string> {
    const tokenHash = this.tokenService.hashToken(refreshToken)

    const token = await this.prisma.refreshToken.create({
      data: {
        userId,
        sessionId,
        tokenHash,
        expiresAt,
      },
    })

    return token.id
  }

  async validateRefreshToken(tokenHash: string): Promise<{
    valid: boolean
    userId?: string
    sessionId?: string
    tokenId?: string
  }> {
    const token = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
    })

    if (!token) {
      return { valid: false }
    }

    if (token.revokedAt) {
      return { valid: false }
    }

    if (token.expiresAt < new Date()) {
      return { valid: false }
    }

    return {
      valid: true,
      userId: token.userId,
      sessionId: token.sessionId ?? undefined,
      tokenId: token.id,
    }
  }

  async rotateRefreshToken(
    oldTokenId: string,
    userId: string,
    sessionId: string | null,
    newRefreshToken: string,
    expiresAt: Date,
  ): Promise<string> {
    const newTokenHash = this.tokenService.hashToken(newRefreshToken)

    const [, newToken] = await this.prisma.$transaction([
      this.prisma.refreshToken.update({
        where: { id: oldTokenId },
        data: { revokedAt: new Date() },
      }),
      this.prisma.refreshToken.create({
        data: {
          userId,
          sessionId,
          tokenHash: newTokenHash,
          expiresAt,
          replacedById: oldTokenId,
        },
      }),
    ])

    return newToken.id
  }

  async revokeSession(sessionId: string): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.session.update({
        where: { id: sessionId },
        data: { revokedAt: new Date() },
      }),
      this.prisma.refreshToken.updateMany({
        where: { sessionId, revokedAt: null },
        data: { revokedAt: new Date() },
      }),
    ])
  }

  async revokeAllUserSessions(userId: string, exceptSessionId?: string): Promise<number> {
    const where = exceptSessionId
      ? { userId, revokedAt: null, id: { not: exceptSessionId } }
      : { userId, revokedAt: null }

    const [sessionResult] = await this.prisma.$transaction([
      this.prisma.session.updateMany({
        where,
        data: { revokedAt: new Date() },
      }),
      this.prisma.refreshToken.updateMany({
        where: exceptSessionId
          ? { userId, revokedAt: null, sessionId: { not: exceptSessionId } }
          : { userId, revokedAt: null },
        data: { revokedAt: new Date() },
      }),
    ])

    return sessionResult.count
  }

  async getUserSessions(userId: string, currentSessionId?: string): Promise<SessionInfo[]> {
    const sessions = await this.prisma.session.findMany({
      where: {
        userId,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
      orderBy: { lastActiveAt: 'desc' },
    })

    return sessions.map((session) => ({
      id: session.id,
      ipAddress: session.ipAddress,
      userAgent: session.userAgent,
      createdAt: session.createdAt,
      lastActiveAt: session.lastActiveAt,
      isCurrent: session.id === currentSessionId,
    }))
  }

  async updateSessionActivity(sessionId: string): Promise<void> {
    await this.prisma.session.update({
      where: { id: sessionId },
      data: { lastActiveAt: new Date() },
    })
  }

  async isSessionValid(sessionId: string): Promise<boolean> {
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
    })

    if (!session) return false
    if (session.revokedAt) return false
    if (session.expiresAt < new Date()) return false

    return true
  }

  async cleanupExpiredSessions(): Promise<number> {
    const result = await this.prisma.session.deleteMany({
      where: {
        OR: [{ expiresAt: { lt: new Date() } }, { revokedAt: { not: null } }],
      },
    })

    return result.count
  }

  async cleanupExpiredRefreshTokens(): Promise<number> {
    const result = await this.prisma.refreshToken.deleteMany({
      where: {
        OR: [{ expiresAt: { lt: new Date() } }, { revokedAt: { not: null } }],
      },
    })

    return result.count
  }
}
