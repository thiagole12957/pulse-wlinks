# Modelo de dados

## Núcleo sincronizado
- Customer
- CustomerContact
- Branch
- CollectionWallet
- Contract
- Plan
- AccessAccount
- Invoice
- Payment
- InvoiceEvent

## Núcleo operacional
- CollectionRule
- RelationshipCase
- CaseInvoice
- CaseAssignment
- ContactAttempt
- PaymentPromise
- PromiseInvoice
- Task
- Note
- PickupAssessment
- PickupRequest

## Inteligência
- FinancialProfile
- ScoreSnapshot
- ScoreFactor
- AiInsight
- AiInsightFeedback
- PromptVersion

## Integrações e segurança
- ExternalReference
- IntegrationJob
- WebhookEvent
- OutboxEvent
- AuditEvent
- UserScope

Consulte `prisma/schema.prisma` para a proposta inicial.
