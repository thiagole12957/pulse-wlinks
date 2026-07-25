import { z } from 'zod'
import { UserRole } from '../enums'

export const userScopeSchema = z.object({
  branchIds: z.array(z.string().uuid()),
  walletIds: z.array(z.string().uuid()),
  teamId: z.string().uuid().nullable(),
  maxApprovalAmount: z.number().nullable(),
})

export const currentUserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string(),
  roles: z.array(z.nativeEnum(UserRole)),
  scopes: userScopeSchema,
})

export type CurrentUser = z.infer<typeof currentUserSchema>
export type UserScope = z.infer<typeof userScopeSchema>
