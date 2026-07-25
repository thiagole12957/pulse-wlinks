# Arquitetura

## Contexto

```text
IXC API/Read Model ---> Sync Workers ---> PostgreSQL <--- API ---> Web
                              |               |          |
                              v               v          v
                            Redis          Outbox     OmnieTalk
                              |                          GC
                              v                          OpenAI
                         BullMQ workers
```

## Componentes

### Web
- fila de relacionamento;
- Cliente 360;
- detalhe de fatura;
- contatos, promessas, tarefas e recolhimento;
- administração de regras e acesso.

### API
- autenticação/autorização;
- casos e workflows;
- score e perfil financeiro;
- integração síncrona sob demanda;
- OpenAPI;
- auditoria.

### Worker
- carga inicial e incremental do IXC;
- reconciliação;
- atualização do perfil e score;
- envio de e-mail;
- webhooks;
- geração de insight;
- reprocessamento e dead-letter.

## Estratégia de integração

- Pull incremental por `updated_at`/paginação quando a API permitir.
- Reconciliação periódica por janela de tempo.
- Consulta sob demanda para dados voláteis, especialmente sessão online.
- Webhook quando disponível, sempre idempotente.
- Circuit breaker para falhas persistentes.

## Consistência

- Financeiro local é cópia operacional, não razão contábil.
- Exibir `source_updated_at` e `synced_at`.
- Antes de ação financeira, confirmar estado atual no IXC.
- Pagamento ou acordo invalida insight e recalcula perfil.
