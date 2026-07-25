import { Injectable } from '@nestjs/common'
import { UserRole } from '@wlinks-pulse/contracts'

export interface CurrentUser {
  id: string
  email: string
  name: string
  roles: UserRole[]
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
  async getCurrentUser(userId: string): Promise<CurrentUser> {
    // Mock implementation - será substituído por busca real no banco
    return {
      id: userId,
      email: 'operador@wlinks.com.br',
      name: 'Operador Teste',
      roles: [UserRole.OPERATOR],
      scopes: {
        branchIds: ['branch-1', 'branch-2'],
        walletIds: ['wallet-1'],
        teamId: 'team-1',
        maxApprovalAmount: 5000_00, // R$ 5.000,00 em centavos
      },
    }
  }

  async getUserScopes(userId: string): Promise<UserScopes> {
    const user = await this.getCurrentUser(userId)
    return user.scopes
  }

  hasRole(user: CurrentUser, role: UserRole): boolean {
    return user.roles.includes(role)
  }

  hasAnyRole(user: CurrentUser, roles: UserRole[]): boolean {
    return roles.some((role) => user.roles.includes(role))
  }

  canAccessBranch(user: CurrentUser, branchId: string): boolean {
    // Admin e Director têm acesso a todas as filiais
    if (this.hasAnyRole(user, [UserRole.ADMIN, UserRole.DIRECTOR])) {
      return true
    }
    return user.scopes.branchIds.includes(branchId)
  }

  canAccessWallet(user: CurrentUser, walletId: string): boolean {
    // Admin e Director têm acesso a todas as carteiras
    if (this.hasAnyRole(user, [UserRole.ADMIN, UserRole.DIRECTOR])) {
      return true
    }
    return user.scopes.walletIds.includes(walletId)
  }
}
