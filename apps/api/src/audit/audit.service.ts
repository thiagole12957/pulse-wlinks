import { Injectable, NotFoundException } from '@nestjs/common'
import { AuditRepository, CreateAuditEventDto, AuditQueryOptions } from './audit.repository'
import { LoggerService } from '../common/logger/logger.service'

// Standard actions
export const AuditActions = {
  // Auth
  LOGIN: 'AUTH.LOGIN',
  LOGOUT: 'AUTH.LOGOUT',
  TOKEN_REFRESH: 'AUTH.TOKEN_REFRESH',

  // Customer
  CUSTOMER_VIEW: 'CUSTOMER.VIEW',
  CUSTOMER_UPDATE: 'CUSTOMER.UPDATE',
  CUSTOMER_CONTACT_DECRYPT: 'CUSTOMER.CONTACT_DECRYPT',

  // Case
  CASE_CREATE: 'CASE.CREATE',
  CASE_ASSIGN: 'CASE.ASSIGN',
  CASE_STATUS_CHANGE: 'CASE.STATUS_CHANGE',
  CASE_CLOSE: 'CASE.CLOSE',

  // Contact
  CONTACT_ATTEMPT: 'CONTACT.ATTEMPT',

  // Promise
  PROMISE_CREATE: 'PROMISE.CREATE',
  PROMISE_FULFILL: 'PROMISE.FULFILL',
  PROMISE_BREAK: 'PROMISE.BREAK',

  // Pickup
  PICKUP_ASSESS: 'PICKUP.ASSESS',
  PICKUP_REQUEST: 'PICKUP.REQUEST',
  PICKUP_APPROVE: 'PICKUP.APPROVE',
  PICKUP_REJECT: 'PICKUP.REJECT',
  PICKUP_COMPLETE: 'PICKUP.COMPLETE',

  // AI
  AI_INSIGHT_REQUEST: 'AI.INSIGHT_REQUEST',
  AI_FEEDBACK: 'AI.FEEDBACK',

  // Data
  DATA_EXPORT: 'DATA.EXPORT',
  DATA_SYNC: 'DATA.SYNC',

  // Admin
  CONFIG_UPDATE: 'CONFIG.UPDATE',
  RULE_CREATE: 'RULE.CREATE',
  RULE_UPDATE: 'RULE.UPDATE',
} as const

@Injectable()
export class AuditService {
  constructor(
    private readonly repository: AuditRepository,
    private readonly logger: LoggerService
  ) {}

  async log(data: CreateAuditEventDto) {
    try {
      const event = await this.repository.create(data)

      // Also log to structured logs for external systems
      this.logger.log(
        JSON.stringify({
          type: 'AUDIT',
          action: data.action,
          resourceType: data.resourceType,
          resourceId: data.resourceId,
          result: data.result,
          actorUserId: this.maskUserId(data.actorUserId),
          correlationId: data.correlationId,
        }),
        'AuditService'
      )

      return event
    } catch (error) {
      // Audit logging should not fail the main operation
      this.logger.error(
        `Falha ao registrar evento de auditoria: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'AuditService'
      )
      return null
    }
  }

  async getById(id: string) {
    const event = await this.repository.findById(id)
    if (!event) {
      throw new NotFoundException(`Evento de auditoria ${id} não encontrado`)
    }
    return event
  }

  async query(options: AuditQueryOptions) {
    return this.repository.query(options)
  }

  async getByResource(resourceType: string, resourceId: string, limit = 50) {
    return this.repository.findByResource(resourceType, resourceId, limit)
  }

  async getByCorrelationId(correlationId: string) {
    return this.repository.findByCorrelationId(correlationId)
  }

  async getActivitySummary(startDate: Date, endDate: Date) {
    return this.repository.getActivitySummary(startDate, endDate)
  }

  // Helper to create common audit events
  async logSuccess(
    action: string,
    resourceType: string,
    resourceId: string,
    actorUserId: string,
    metadata?: Record<string, unknown>
  ) {
    return this.log({
      action,
      resourceType,
      resourceId,
      actorUserId,
      result: 'SUCCESS',
      metadata,
    })
  }

  async logFailure(
    action: string,
    resourceType: string,
    resourceId: string,
    actorUserId: string,
    metadata?: Record<string, unknown>
  ) {
    return this.log({
      action,
      resourceType,
      resourceId,
      actorUserId,
      result: 'FAILURE',
      metadata,
    })
  }

  async logDenied(
    action: string,
    resourceType: string,
    resourceId: string,
    actorUserId: string,
    metadata?: Record<string, unknown>
  ) {
    return this.log({
      action,
      resourceType,
      resourceId,
      actorUserId,
      result: 'DENIED',
      metadata,
    })
  }

  private maskUserId(userId?: string): string {
    if (!userId) return 'SYSTEM'
    if (userId.length <= 8) return userId.substring(0, 2) + '***'
    return userId.substring(0, 4) + '***' + userId.substring(userId.length - 4)
  }
}
