import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common'
import { PrismaService } from '../common/prisma/prisma.service'
import { AuditService } from '../audit/audit.service'
import { PasswordService } from './services/password.service'
import { TokenService, TokenPair } from './services/token.service'
import { SessionService } from './services/session.service'
import { IpValidationService } from './services/ip-validation.service'
import { TimeAccessService } from './services/time-access.service'
import { AUTH_CONSTANTS } from './constants/auth.constants'
import { UserRole, UserStatus } from '@prisma/client'

export interface ValidateCredentialsResult {
  valid: boolean
  user?: {
    id: string
    email: string
    name: string
    role: UserRole
    status: UserStatus
    mustChangePassword: boolean
  }
  error?: string
}

export interface LoginInput {
  email: string
  password: string
  ipAddress: string
  userAgent?: string
}

export interface LoginResult {
  accessToken: string
  refreshToken: string
  expiresAt: Date
  user: {
    id: string
    email: string
    name: string
    role: string
    mustChangePassword: boolean
  }
}

export interface CurrentUser {
  id: string
  email: string
  name: string
  role: UserRole
  scopes: UserScopes
}

export interface UserScopes {
  branchIds: string[]
  walletIds: string[]
  teamId: string | null
  maxApprovalAmount: number | null
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
    private readonly sessionService: SessionService,
    private readonly ipValidationService: IpValidationService,
    private readonly timeAccessService: TimeAccessService,
    private readonly auditService: AuditService,
  ) {}

  async validateCredentials(email: string, password: string): Promise<ValidateCredentialsResult> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    })

    if (!user) {
      return { valid: false, error: 'Credenciais inválidas' }
    }

    // Verificar se usuário está bloqueado
    if (user.status === UserStatus.LOCKED) {
      if (user.lockedUntil && user.lockedUntil > new Date()) {
        return { valid: false, error: 'Conta temporariamente bloqueada. Tente novamente mais tarde.' }
      }
      // Lockout expirou, desbloquear
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          status: UserStatus.ACTIVE,
          failedLoginAttempts: 0,
          lockedUntil: null,
        },
      })
    }

    if (user.status === UserStatus.INACTIVE) {
      return { valid: false, error: 'Conta inativa. Entre em contato com o administrador.' }
    }

    if (user.status === UserStatus.PENDING_ACTIVATION) {
      return { valid: false, error: 'Conta aguardando ativação.' }
    }

    // Verificar senha
    const passwordValid = await this.passwordService.verify(password, user.passwordHash)

    if (!passwordValid) {
      await this.handleFailedLogin(user.id, user.failedLoginAttempts)
      return { valid: false, error: 'Credenciais inválidas' }
    }

    // Reset contador de falhas
    if (user.failedLoginAttempts > 0) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { failedLoginAttempts: 0 },
      })
    }

    return {
      valid: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
        mustChangePassword: user.mustChangePassword,
      },
    }
  }

  private async handleFailedLogin(userId: string, currentAttempts: number): Promise<void> {
    const newAttempts = currentAttempts + 1

    if (newAttempts >= AUTH_CONSTANTS.MAX_FAILED_ATTEMPTS) {
      // Calcular lockout progressivo
      const lockoutIndex = Math.min(
        Math.floor((newAttempts - AUTH_CONSTANTS.MAX_FAILED_ATTEMPTS) / AUTH_CONSTANTS.MAX_FAILED_ATTEMPTS),
        AUTH_CONSTANTS.LOCKOUT_DURATIONS_MS.length - 1,
      )
      const lockoutDuration = AUTH_CONSTANTS.LOCKOUT_DURATIONS_MS[lockoutIndex]
      const lockedUntil = new Date(Date.now() + lockoutDuration)

      await this.prisma.user.update({
        where: { id: userId },
        data: {
          status: UserStatus.LOCKED,
          failedLoginAttempts: newAttempts,
          lockedUntil,
        },
      })

      await this.auditService.log({
        actorUserId: userId,
        action: 'ACCOUNT_LOCKED',
        resourceType: 'User',
        resourceId: userId,
        result: 'SUCCESS',
        metadata: { attempts: newAttempts, lockedUntil: lockedUntil.toISOString() },
      })
    } else {
      await this.prisma.user.update({
        where: { id: userId },
        data: { failedLoginAttempts: newAttempts },
      })
    }
  }

  async login(input: LoginInput): Promise<LoginResult> {
    const validationResult = await this.validateCredentials(input.email, input.password)

    if (!validationResult.valid || !validationResult.user) {
      throw new UnauthorizedException(validationResult.error ?? 'Credenciais inválidas')
    }

    const user = validationResult.user

    // Validar IP
    const ipResult = await this.ipValidationService.validateIp(user.role, input.ipAddress)
    if (!ipResult.allowed) {
      await this.auditService.log({
        actorUserId: user.id,
        action: 'LOGIN_IP_DENIED',
        resourceType: 'User',
        resourceId: user.id,
        result: 'FAILURE',
        ipMasked: this.maskIp(input.ipAddress),
        metadata: { reason: ipResult.reason },
      })
      throw new UnauthorizedException(ipResult.reason ?? 'Acesso negado por restrição de IP')
    }

    // Validar horário
    const timeResult = await this.timeAccessService.validateAccess(user.id, user.role)
    if (!timeResult.allowed) {
      await this.auditService.log({
        actorUserId: user.id,
        action: 'LOGIN_TIME_DENIED',
        resourceType: 'User',
        resourceId: user.id,
        result: 'FAILURE',
        metadata: {
          reason: timeResult.reason,
          currentTime: timeResult.currentTime,
          allowedRange: timeResult.allowedRange,
        },
      })
      throw new UnauthorizedException(
        timeResult.allowedRange
          ? `${timeResult.reason}. Horário permitido: ${timeResult.allowedRange}`
          : timeResult.reason,
      )
    }

    // Criar sessão
    const sessionId = await this.sessionService.createSession({
      userId: user.id,
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
    })

    // Gerar tokens
    const tokenPair = await this.tokenService.generateTokenPair(
      user.id,
      user.email,
      user.name,
      user.role,
      sessionId,
    )

    // Salvar refresh token
    await this.sessionService.createRefreshToken(
      user.id,
      sessionId,
      tokenPair.refreshToken,
      tokenPair.refreshTokenExpiresAt,
    )

    // Atualizar último login
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        lastLoginAt: new Date(),
        lastLoginIp: input.ipAddress,
      },
    })

    // Audit
    await this.auditService.log({
      actorUserId: user.id,
      action: 'LOGIN',
      resourceType: 'User',
      resourceId: user.id,
      result: 'SUCCESS',
      ipMasked: this.maskIp(input.ipAddress),
    })

    return {
      accessToken: tokenPair.accessToken,
      refreshToken: tokenPair.refreshToken,
      expiresAt: tokenPair.accessTokenExpiresAt,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        mustChangePassword: user.mustChangePassword,
      },
    }
  }

  async refresh(
    userId: string,
    oldTokenId: string,
    sessionId: string | null,
    refreshToken: string,
    ipAddress: string,
  ): Promise<TokenPair> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user || user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('Usuário inativo ou não encontrado')
    }

    // Revalidar IP
    const ipResult = await this.ipValidationService.validateIp(user.role, ipAddress)
    if (!ipResult.allowed) {
      throw new UnauthorizedException(ipResult.reason ?? 'Acesso negado por restrição de IP')
    }

    // Revalidar horário
    const timeResult = await this.timeAccessService.validateAccess(user.id, user.role)
    if (!timeResult.allowed) {
      throw new UnauthorizedException(timeResult.reason ?? 'Acesso negado por restrição de horário')
    }

    // Gerar novos tokens
    const tokenPair = await this.tokenService.generateTokenPair(
      user.id,
      user.email,
      user.name,
      user.role,
      sessionId ?? '',
    )

    // Rotacionar refresh token
    await this.sessionService.rotateRefreshToken(
      oldTokenId,
      user.id,
      sessionId,
      tokenPair.refreshToken,
      tokenPair.refreshTokenExpiresAt,
    )

    // Atualizar atividade da sessão
    if (sessionId) {
      await this.sessionService.updateSessionActivity(sessionId)
    }

    return tokenPair
  }

  async logout(userId: string, sessionId: string): Promise<void> {
    await this.sessionService.revokeSession(sessionId)

    await this.auditService.log({
      actorUserId: userId,
      action: 'LOGOUT',
      resourceType: 'User',
      resourceId: userId,
      result: 'SUCCESS',
    })
  }

  async logoutAllSessions(userId: string, currentSessionId?: string): Promise<number> {
    const count = await this.sessionService.revokeAllUserSessions(userId, currentSessionId)

    await this.auditService.log({
      actorUserId: userId,
      action: 'LOGOUT_ALL',
      resourceType: 'User',
      resourceId: userId,
      result: 'SUCCESS',
      metadata: { revokedSessions: count },
    })

    return count
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
    confirmPassword: string,
  ): Promise<void> {
    if (newPassword !== confirmPassword) {
      throw new BadRequestException('As senhas não conferem')
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado')
    }

    // Validar senha atual
    const passwordValid = await this.passwordService.verify(currentPassword, user.passwordHash)
    if (!passwordValid) {
      throw new BadRequestException('Senha atual incorreta')
    }

    // Validar política de senha
    const validation = this.passwordService.validate(newPassword)
    if (!validation.valid) {
      throw new BadRequestException(validation.errors.join('. '))
    }

    // Hash e salvar nova senha
    const newPasswordHash = await this.passwordService.hash(newPassword)

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash: newPasswordHash,
        passwordChangedAt: new Date(),
        mustChangePassword: false,
      },
    })

    await this.auditService.log({
      actorUserId: userId,
      action: 'PASSWORD_CHANGE',
      resourceType: 'User',
      resourceId: userId,
      result: 'SUCCESS',
    })
  }

  async getCurrentUser(userId: string): Promise<CurrentUser> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        branchAssignments: { select: { branchId: true } },
        walletAssignments: { select: { walletId: true } },
      },
    })

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado')
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      scopes: {
        branchIds: user.branchAssignments.map((a) => a.branchId),
        walletIds: user.walletAssignments.map((a) => a.walletId),
        teamId: user.teamId,
        maxApprovalAmount: user.maxApprovalAmount,
      },
    }
  }

  async getUserScopes(userId: string): Promise<UserScopes> {
    const user = await this.getCurrentUser(userId)
    return user.scopes
  }

  hasRole(user: CurrentUser, role: UserRole): boolean {
    return user.role === role
  }

  hasAnyRole(user: CurrentUser, roles: UserRole[]): boolean {
    return roles.includes(user.role)
  }

  canAccessBranch(user: CurrentUser, branchId: string): boolean {
    if (this.hasAnyRole(user, [UserRole.ADMIN, UserRole.DIRECTOR])) {
      return true
    }
    return user.scopes.branchIds.includes(branchId)
  }

  canAccessWallet(user: CurrentUser, walletId: string): boolean {
    if (this.hasAnyRole(user, [UserRole.ADMIN, UserRole.DIRECTOR])) {
      return true
    }
    return user.scopes.walletIds.includes(walletId)
  }

  private maskIp(ip: string): string {
    const parts = ip.split('.')
    if (parts.length === 4) {
      return `${parts[0]}.${parts[1]}.*.*`
    }
    // IPv6 ou formato desconhecido
    return ip.substring(0, Math.min(ip.length, 10)) + '...'
  }
}
