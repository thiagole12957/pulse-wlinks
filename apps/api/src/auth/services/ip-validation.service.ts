import { Injectable } from '@nestjs/common'
import { Netmask } from 'netmask'
import { PrismaService } from '../../common/prisma/prisma.service'
import { RedisService } from '../../common/redis/redis.service'
import { AUTH_CONSTANTS } from '../constants/auth.constants'
import { UserRole } from '@prisma/client'

export interface IpValidationResult {
  allowed: boolean
  reason?: string
}

@Injectable()
export class IpValidationService {
  private readonly cachePrefix = 'role_ip_whitelist:'

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async validateIp(role: UserRole, clientIp: string): Promise<IpValidationResult> {
    // Buscar configuração do role (com cache)
    const roleConfig = await this.getRoleConfig(role)

    // Se bypass está ativo, permitir qualquer IP
    if (roleConfig?.bypassIpWhitelist) {
      return { allowed: true }
    }

    // Buscar whitelist do role
    const whitelist = await this.getIpWhitelist(role)

    // Se não há whitelist configurada, permitir (whitelist vazia = sem restrição)
    if (whitelist.length === 0) {
      return { allowed: true }
    }

    // Verificar se o IP está na whitelist
    const normalizedIp = this.normalizeIp(clientIp)

    for (const entry of whitelist) {
      if (this.ipMatchesCidr(normalizedIp, entry)) {
        return { allowed: true }
      }
    }

    return {
      allowed: false,
      reason: 'IP não autorizado para este perfil de acesso',
    }
  }

  private async getRoleConfig(role: UserRole) {
    const cacheKey = `role_config:${role}`

    // Tentar buscar do cache
    const cached = await this.redis.get(cacheKey)
    if (cached) {
      return JSON.parse(cached)
    }

    // Buscar do banco
    const config = await this.prisma.roleConfig.findUnique({
      where: { role },
    })

    if (config) {
      await this.redis.setex(
        cacheKey,
        AUTH_CONSTANTS.ROLE_CONFIG_CACHE_TTL,
        JSON.stringify(config),
      )
    }

    return config
  }

  private async getIpWhitelist(role: UserRole): Promise<string[]> {
    const cacheKey = `${this.cachePrefix}${role}`

    // Tentar buscar do cache
    const cached = await this.redis.get(cacheKey)
    if (cached) {
      return JSON.parse(cached)
    }

    // Buscar do banco
    const roleConfig = await this.prisma.roleConfig.findUnique({
      where: { role },
      include: { ipWhitelist: true },
    })

    const whitelist = roleConfig?.ipWhitelist.map((entry) => entry.ipOrCidr) ?? []

    await this.redis.setex(
      cacheKey,
      AUTH_CONSTANTS.ROLE_CONFIG_CACHE_TTL,
      JSON.stringify(whitelist),
    )

    return whitelist
  }

  private normalizeIp(ip: string): string {
    // Remove prefixo IPv6 de IPv4 mapeado (::ffff:)
    if (ip.startsWith('::ffff:')) {
      return ip.substring(7)
    }
    return ip
  }

  private ipMatchesCidr(ip: string, cidrOrIp: string): boolean {
    try {
      // Se não tem barra, é um IP único
      if (!cidrOrIp.includes('/')) {
        return ip === cidrOrIp
      }

      // É um CIDR, usar netmask para verificar
      const block = new Netmask(cidrOrIp)
      return block.contains(ip)
    } catch {
      // Se houver erro no parsing, comparar como string
      return ip === cidrOrIp
    }
  }

  async invalidateCache(role: UserRole): Promise<void> {
    await Promise.all([
      this.redis.del(`role_config:${role}`),
      this.redis.del(`${this.cachePrefix}${role}`),
    ])
  }

  async invalidateAllCache(): Promise<void> {
    const roles = Object.values(UserRole)
    await Promise.all(roles.map((role) => this.invalidateCache(role)))
  }
}
