import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { UserRole } from '@prisma/client'

export interface CurrentUserData {
  id: string
  email: string
  name: string
  role: UserRole
  mustChangePassword: boolean
  sessionId: string
  teamId: string | null
}

export const CurrentUser = createParamDecorator(
  (data: keyof CurrentUserData | undefined, ctx: ExecutionContext): CurrentUserData | any => {
    const request = ctx.switchToHttp().getRequest()
    const user = request.user as CurrentUserData

    if (data) {
      return user?.[data]
    }

    return user
  },
)
