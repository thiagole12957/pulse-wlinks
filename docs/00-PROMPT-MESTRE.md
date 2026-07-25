# Prompt mestre para o Claude

Você é o arquiteto e desenvolvedor principal do **WLinks Pulse**, uma plataforma interna da WLinks para relacionamento financeiro e recuperação de clientes.

## Resultado esperado

Construir um monorepo seguro, testável e observável que permita:

1. sincronizar clientes, contratos, planos, títulos e pagamentos do IXC;
2. sincronizar estado da internet, login online/offline, última conexão e consumo;
3. aplicar regras configuráveis de entrada na fila manual, começando no 7º dia de atraso;
4. distribuir casos por filial, carteira, equipe e operador;
5. apresentar Cliente 360 e detalhe da fatura;
6. calcular WLinks Score e métricas de pagamento sem IA;
7. gerar insights por IA usando somente perfil resumido e reaproveitar resultado salvo;
8. iniciar contato via OmnieTalk por WhatsApp, ligação e e-mail;
9. registrar contatos, promessas, acordos, tarefas e resultados;
10. criar triagem de recolhimento e integrar com GC após aprovação;
11. manter auditoria completa e controle de acesso por filial/carteira.

## Restrições críticas

- Nunca escrever diretamente no banco do IXC.
- Nunca inventar endpoints das integrações.
- Não usar a OpenAI para calcular score.
- Não enviar CPF completo, endereço completo ou credenciais para IA.
- Não permitir que a IA execute ação irreversível.
- Não abrir recolhimento somente porque o login está offline.
- Não acoplar regras de negócio ao Superset.
- Não iniciar com microsserviços.

## Arquitetura

Monorepo pnpm:

- `apps/web`: React + TypeScript + Vite;
- `apps/api`: NestJS REST + OpenAPI;
- `apps/worker`: jobs BullMQ;
- `packages/contracts`: DTOs e schemas compartilhados;
- `packages/ui`: componentes compartilhados;
- `prisma`: schema e migrações;
- PostgreSQL para domínio e cópia operacional;
- Redis para cache, locks e filas;
- Keycloak/OIDC para identidade.

## Ordem de execução

Siga `docs/08-ROADMAP.md`. Na Fase 0:

1. inicialize o monorepo e fixe versões estáveis atuais;
2. configure TypeScript strict, lint, formatter, testes e CI;
3. suba PostgreSQL, Redis, Keycloak, MinIO e Mailpit em Docker;
4. implemente health/readiness;
5. crie os módulos vazios e contratos principais;
6. gere a primeira migração do Prisma;
7. crie mocks das integrações externas;
8. documente como rodar localmente.

## Critério de qualidade

Cada entrega deve ser pequena, executável e testada. Antes de codificar, apresente o plano. Depois, execute validações e atualize `docs/PROGRESS.md`.
