import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { TimeAccessService } from '../services/time-access.service'
import { IS_PUBLIC_KEY } from '../decorators/public.decorator'
import { UserRole } from '@prisma/client'

@Injectable()
export class TimeAccessGuard implements CanActivate {
  constructor(
    private readonly timeAccessService: TimeAccessService,
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

    const result = await this.timeAccessService.validateAccess(user.id, user.role as UserRole)

    if (!result.allowed) {
      let message = result.reason ?? 'Acesso negado por restrição de horário'
      if (result.allowedRange) {
        message += `. Horário permitido: ${result.allowedRange}`
      }
      throw new ForbiddenException(message)
    }

    return true
  }
}
