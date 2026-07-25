# Worker

Filas planejadas:
- `ixc-sync-customers`
- `ixc-sync-contracts`
- `ixc-sync-invoices`
- `ixc-sync-payments`
- `ixc-refresh-access-status`
- `financial-profile-recalculate`
- `score-recalculate`
- `ai-insight-generate`
- `email-send`
- `webhook-process`
- `outbox-publish`
- `promise-expire`
- `case-eligibility-evaluate`

Todos os jobs devem ser idempotentes e possuir política de retry e dead-letter.
