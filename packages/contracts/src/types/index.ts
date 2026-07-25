export type { CurrentUser, UserScope } from '../schemas/auth'
export type { HealthCheck } from '../schemas/health'

export interface ApiResponse<T> {
  data: T
  meta?: Record<string, unknown>
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface ApiError {
  statusCode: number
  message: string
  error?: string
  details?: Record<string, unknown>
}
