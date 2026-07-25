export const SyncStatus = {
  PENDING: 'PENDING',
  SYNCED: 'SYNCED',
  FAILED: 'FAILED',
  STALE: 'STALE',
} as const
export type SyncStatus = (typeof SyncStatus)[keyof typeof SyncStatus]

export const ContractStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  PRE_CONTRACT: 'PRE_CONTRACT',
  NEGATIVE: 'NEGATIVE',
  WITHDRAWN: 'WITHDRAWN',
  UNKNOWN: 'UNKNOWN',
} as const
export type ContractStatus = (typeof ContractStatus)[keyof typeof ContractStatus]

export const InternetStatus = {
  ACTIVE: 'ACTIVE',
  DISABLED: 'DISABLED',
  AUTO_BLOCKED: 'AUTO_BLOCKED',
  MANUAL_BLOCKED: 'MANUAL_BLOCKED',
  WAITING_SIGNATURE: 'WAITING_SIGNATURE',
  UNKNOWN: 'UNKNOWN',
} as const
export type InternetStatus = (typeof InternetStatus)[keyof typeof InternetStatus]

export const InvoiceStatus = {
  OPEN: 'OPEN',
  PAID: 'PAID',
  PARTIALLY_PAID: 'PARTIALLY_PAID',
  CANCELED: 'CANCELED',
  RENEGOTIATED: 'RENEGOTIATED',
  UNKNOWN: 'UNKNOWN',
} as const
export type InvoiceStatus = (typeof InvoiceStatus)[keyof typeof InvoiceStatus]

export const CaseStatus = {
  NEW: 'NEW',
  ASSIGNED: 'ASSIGNED',
  IN_ANALYSIS: 'IN_ANALYSIS',
  CONTACTING: 'CONTACTING',
  CUSTOMER_REPLIED: 'CUSTOMER_REPLIED',
  WAITING_PAYMENT: 'WAITING_PAYMENT',
  PROMISE_ACTIVE: 'PROMISE_ACTIVE',
  NEGOTIATING: 'NEGOTIATING',
  PROMISE_BROKEN: 'PROMISE_BROKEN',
  NO_CONTACT: 'NO_CONTACT',
  PICKUP_CANDIDATE: 'PICKUP_CANDIDATE',
  PICKUP_PENDING_APPROVAL: 'PICKUP_PENDING_APPROVAL',
  PICKUP_OPENED: 'PICKUP_OPENED',
  REGULARIZED: 'REGULARIZED',
  CLOSED: 'CLOSED',
} as const
export type CaseStatus = (typeof CaseStatus)[keyof typeof CaseStatus]

export const PromiseStatus = {
  ACTIVE: 'ACTIVE',
  FULFILLED: 'FULFILLED',
  PARTIALLY_FULFILLED: 'PARTIALLY_FULFILLED',
  BROKEN: 'BROKEN',
  CANCELED: 'CANCELED',
} as const
export type PromiseStatus = (typeof PromiseStatus)[keyof typeof PromiseStatus]

export const ContactChannel = {
  WHATSAPP: 'WHATSAPP',
  PHONE: 'PHONE',
  EMAIL: 'EMAIL',
  SMS: 'SMS',
  OTHER: 'OTHER',
} as const
export type ContactChannel = (typeof ContactChannel)[keyof typeof ContactChannel]

export const ContactOutcome = {
  NO_ANSWER: 'NO_ANSWER',
  ANSWERED: 'ANSWERED',
  CUSTOMER_WILL_PAY: 'CUSTOMER_WILL_PAY',
  PAYMENT_ALREADY_MADE: 'PAYMENT_ALREADY_MADE',
  REQUESTED_NEGOTIATION: 'REQUESTED_NEGOTIATION',
  TECHNICAL_PROBLEM: 'TECHNICAL_PROBLEM',
  WANTS_CANCEL: 'WANTS_CANCEL',
  MOVED_ADDRESS: 'MOVED_ADDRESS',
  DOES_NOT_RECOGNIZE: 'DOES_NOT_RECOGNIZE',
  WRONG_CONTACT: 'WRONG_CONTACT',
  OTHER: 'OTHER',
} as const
export type ContactOutcome = (typeof ContactOutcome)[keyof typeof ContactOutcome]

export const PickupStatus = {
  DRAFT: 'DRAFT',
  PENDING_APPROVAL: 'PENDING_APPROVAL',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  OPENED_IN_GC: 'OPENED_IN_GC',
  COMPLETED: 'COMPLETED',
  CANCELED: 'CANCELED',
} as const
export type PickupStatus = (typeof PickupStatus)[keyof typeof PickupStatus]

export const UserRole = {
  ADMIN: 'ADMIN',
  DIRECTOR: 'DIRECTOR',
  MANAGER: 'MANAGER',
  SUPERVISOR: 'SUPERVISOR',
  OPERATOR: 'OPERATOR',
  FINANCE: 'FINANCE',
  PICKUP: 'PICKUP',
  AUDITOR: 'AUDITOR',
} as const
export type UserRole = (typeof UserRole)[keyof typeof UserRole]
