# Roadmap de implementação

## Fase 0 - Fundação
- monorepo, CI, Docker e ambientes;
- autenticação mock/OIDC preparada;
- Prisma inicial;
- health checks;
- observabilidade;
- adaptadores mock.

## Fase 1 - Dados IXC
- carga mock;
- sincronização de cliente, contrato, fatura e pagamento;
- idempotência e reconciliação;
- estado de sincronização.

## Fase 2 - Fila manual
- regras configuráveis;
- caso de relacionamento;
- filtros, distribuição e transições;
- escopo por filial/carteira.

## Fase 3 - Cliente 360 e fatura
- visão completa;
- histórico e timeline;
- status de conexão;
- atualização sob demanda.

## Fase 4 - Perfil e score
- agregações financeiras;
- WLinks Score;
- snapshots, explicação e testes.

## Fase 5 - Relacionamento
- contato, promessa, tarefa e acordo;
- OmnieTalk mock e depois real;
- e-mail e ligação.

## Fase 6 - IA
- prompt versionado;
- redaction;
- saída estruturada;
- cache e invalidação;
- custo e feedback.

## Fase 7 - Recolhimento
- triagem;
- aprovação;
- integração GC;
- acompanhamento.

## Fase 8 - Hardening
- testes E2E;
- carga/performance;
- segurança;
- backup/restore;
- runbooks e rollout.
