import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { IpValidationService } from '../services/ip-validation.service'
import { IS_PUBLIC_KEY } from '../decorators/public.decorator'
import { UserRole } from '@prisma/client'

@Injectable()
export class IpWhitelistGuard implements CanActivate {
  constructor(
    private readonly ipValidationService: IpValidationService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (isPublic) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    const user = request.user

    if (!user) {
      return true // Deixar o JwtAuthGuard lidar com isso
    }

    const clientIp = this.getClientIp(request)
    const result = await this.ipValidationService.validateIp(user.role as UserRole, clientIp)

    if (!result.allowed) {
      throw new ForbiddenException(result.reason ?? 'Acesso negado por restrição de IP')
    }

    return true
  }

  private getClientIp(request: any): string {
    // Verificar headers de proxy reverso
    const forwardedFor = request.headers['x-forwarded-for']
    if (forwardedFor) {
      // X-Forwarded-For pode conter múltiplos IPs, pegar o primeiro (cliente original)
      const ips = forwardedFor.split(',').map((ip: string) => ip.trim())
      return ips[0]
    }

    const realIp = request.headers['x-real-ip']
    if (realIp) {
      return realIp
    }

    // Fallback para IP direto
    return request.ip || request.connection?.remoteAddress || '127.0.0.1'
  }
}
