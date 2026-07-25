# Progresso

## Estado
Fases 0-7 implementadas (estrutura backend completa). Projeto executável localmente no Docker Desktop.

## Próxima história
Fase 8: Hardening - testes E2E, carga/performance, segurança, backup/restore, runbooks.

## Concluído

### Fase 7 - Recolhimento e Auditoria (25/07/2026)
- PickupsModule: avaliação de recolhimento (PickupAssessment);
- Regras de triagem: offline, contatos, promessa ativa, ordem técnica;
- PickupRequest: solicitação com aprovação de supervisor;
- Fluxo: criação → aprovação → abertura no GC → conclusão;
- Integração com ContactsModule e PromisesModule;
- AuditModule: eventos de auditoria append-only;
- Ações padronizadas (AUTH.LOGIN, CASE.CREATE, PICKUP.APPROVE, etc.);
- Consulta por recurso, usuário, correlação e período.

### Fase 6 - IA e Insights (25/07/2026)
- AiInsightsModule: geração de insights com OpenAI;
- Cache por versão de perfil + versão de prompt;
- Mock de IA para desenvolvimento (sem API key);
- Feedback de utilidade (útil/não útil);
- Custos e tokens rastreados;
- Redaction de PII no input (nome mascarado).

### Fase 5 - Relacionamento (25/07/2026)
- PromisesModule: promessas de pagamento com vínculo a faturas;
- Estados: ACTIVE, FULFILLED, PARTIALLY_FULFILLED, BROKEN, CANCELED;
- ContactsModule: tentativas de contato com canais (WhatsApp, telefone, email, SMS);
- Outcomes: ANSWERED, NO_ANSWER, CUSTOMER_WILL_PAY, etc.;
- Estatísticas de contato por caso.

### Fase 4 - Perfil Financeiro e Score (25/07/2026)
- FinancialProfileModule: cálculo de métricas agregadas;
- ScoreModule: score 0-100 com classificação (EXCELENTE a CRITICO);
- ScoreSnapshot: histórico de scores com fatores explicativos;
- Componentes: regularidade, atraso, dívida, promessas, relacionamento;
- Explicação textual do score.

### Fase 3 - Cliente 360 e Fatura (25/07/2026)
- CustomersModule: CRUD completo com sincronização IXC;
- ContractsModule: contratos com status e status de internet;
- InvoicesModule: faturas com detecção de atraso;
- Eventos de fatura (InvoiceEvent);
- Mascaramento de CPF/CNPJ.

### Fase 2 - Fila Manual de Relacionamento (25/07/2026)
- RelationshipCasesModule: casos de relacionamento;
- Máquina de estados (NEW → ASSIGNED → ... → CLOSED);
- EligibilityService: regras configuráveis (dias de atraso, valor mínimo);
- Distribuição por filial/carteira;
- Prioridade por score e valor.

### Fase 1 - Dados IXC (25/07/2026)
- CustomersService.syncFromIxc(): sincronização de clientes;
- ContractsService.syncFromIxc(): sincronização de contratos;
- InvoicesService.syncFromIxc(): sincronização de faturas;
- Checksum para detecção de alterações;
- SyncStatus: PENDING, SYNCED, FAILED, STALE;
- Adaptador mock do IXC.

### Fase 0 - Fundação (25/07/2026)
- Monorepo pnpm configurado com workspaces (apps/*, packages/*);
- TypeScript strict em todos os projetos;
- ESLint e Prettier configurados;
- apps/api: NestJS com health checks (/health, /live, /ready);
- apps/api: Prisma com schema de 30+ tabelas;
- apps/api: Autenticação mock para desenvolvimento;
- apps/api: Integrations module com adaptadores mock (IXC, OmnieTalk, GC);
- apps/api: Observabilidade com Pino (logs estruturados, redaction de PII);
- apps/web: React + Vite + TanStack Router/Query;
- apps/web: Tailwind CSS configurado;
- apps/web: Página inicial com status do sistema;
- apps/worker: BullMQ configurado com health check worker;
- packages/contracts: Schemas Zod, enums e tipos compartilhados;
- Docker Compose com PostgreSQL, Redis, Keycloak, MinIO, Mailpit;
- Dockerfiles para API, Web e Worker;
- Variáveis de ambiente configuradas (.env).

### Blueprint (anteriormente)
- visão do produto;
- arquitetura;
- regras de domínio;
- modelo inicial (schema.prisma);
- segurança;
- roadmap;
- instruções do Claude.

## Como executar

```bash
# 1. Instalar dependências
pnpm install

# 2. Iniciar infraestrutura Docker
pnpm infra:up

# 3. Aplicar schema ao banco
cd apps/api && DATABASE_URL="postgresql://pulse:pulse@localhost:5432/wlinks_pulse" npx prisma db push

# 4. Iniciar API (em um terminal)
DATABASE_URL="postgresql://pulse:pulse@localhost:5432/wlinks_pulse" REDIS_URL="redis://localhost:6379" NODE_ENV=development pnpm dev:api

# 5. Iniciar Web (em outro terminal)
pnpm dev:web

# 6. Acessar
# - API: http://localhost:3000/api/health
# - Web: http://localhost:5173
# - Mailpit: http://localhost:8025
# - Keycloak: http://localhost:8080 (admin/admin)
# - MinIO: http://localhost:9001 (pulse/replace_me_local_only)
```
