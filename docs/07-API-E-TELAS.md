# API e telas

## Endpoints iniciais

### Sessão
- `GET /me`
- `GET /me/scopes`

### Fila
- `GET /relationship-cases`
- `GET /relationship-cases/:id`
- `POST /relationship-cases/:id/assign`
- `POST /relationship-cases/:id/transition`

### Cliente 360
- `GET /customers/:id/overview`
- `GET /customers/:id/financial-profile`
- `GET /customers/:id/timeline`
- `POST /customers/:id/refresh-volatile-data`

### Faturas
- `GET /invoices/:id`
- `POST /invoices/:id/refresh`
- `POST /invoices/:id/send-payment-link`

### Score e IA
- `GET /customers/:id/score`
- `POST /relationship-cases/:id/insights`
- `GET /relationship-cases/:id/insights/current`
- `POST /ai-insights/:id/feedback`

### Operação
- `POST /relationship-cases/:id/contact-attempts`
- `POST /relationship-cases/:id/promises`
- `POST /relationship-cases/:id/tasks`
- `POST /relationship-cases/:id/pickup-assessments`
- `POST /pickup-requests/:id/approve`

### Administração
- regras, filiais, carteiras, equipes, escopos e prompt versions.

## Telas

1. Login/SSO.
2. Fila de relacionamento.
3. Cliente 360.
4. Detalhe da fatura com insight.
5. Promessas e tarefas.
6. Triagem de recolhimento.
7. Supervisão e distribuição.
8. Configuração de regras.
9. Auditoria e integrações.
10. Indicadores.
