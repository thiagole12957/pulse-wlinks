import { z } from 'zod'

export const healthCheckSchema = z.object({
  status: z.enum(['ok', 'degraded', 'error']),
  timestamp: z.string().datetime(),
  version: z.string(),
  checks: z.record(
    z.object({
      status: z.enum(['ok', 'error']),
      message: z.string().optional(),
      latencyMs: z.number().optional(),
    })
  ),
})

export type HealthCheck = z.infer<typeof healthCheckSchema>
