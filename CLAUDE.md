# WLinks Pulse - instruções permanentes

## Missão
Construir uma plataforma interna segura de relacionamento financeiro e recuperação de clientes WLinks. Leia primeiro `docs/00-PROMPT-MESTRE.md`, depois os documentos citados pela fase atual.

## Modo de trabalho obrigatório
- Não implemente o sistema inteiro de uma vez.
- Trabalhe por fases e histórias verticais pequenas.
- Antes de alterar código, apresente um plano curto com arquivos afetados.
- Ao terminar cada história, execute lint, testes, typecheck e build aplicáveis.
- Não marque tarefa como concluída se os testes não passarem.
- Nunca invente endpoint, campo ou regra do IXC, OmnieTalk ou GC. Use adaptadores e mocks até receber documentação confirmada.
- Nunca coloque segredo, token ou credencial no repositório.
- Atualize `docs/DECISIONS.md` ao tomar decisão arquitetural relevante.
- Atualize `docs/PROGRESS.md` ao concluir uma história.

## Stack alvo
- Monorepo com pnpm workspaces.
- Web: React, TypeScript, Vite, TanStack Router/Query, React Hook Form, Zod, Tailwind e componentes acessíveis.
- API: NestJS, TypeScript strict, REST, OpenAPI, Prisma.
- Worker: NestJS standalone ou processo Node dedicado com BullMQ.
- Banco: PostgreSQL.
- Cache e filas: Redis + BullMQ.
- Autenticação: OIDC, preferencialmente Keycloak, com MFA no provedor.
- Testes: unitários, integração e E2E.
- Observabilidade: logs estruturados, métricas e tracing.

## Arquitetura
- Monólito modular, não microsserviços no MVP.
- Apps separados: `web`, `api`, `worker`.
- Domínios não importam infraestrutura diretamente.
- Integrações externas ficam atrás de interfaces/ports.
- O IXC é origem oficial; PostgreSQL é cópia operacional e banco do domínio Pulse.
- Escritas no IXC somente pela API oficial.
- Toda integração deve ter timeout, retry controlado, idempotência e circuit breaker quando aplicável.

## Segurança
- Negar acesso por padrão.
- RBAC + escopo por filial e carteira.
- Validar autorização no backend para cada recurso.
- Mascarar CPF e dados sensíveis na UI e logs.
- Nunca armazenar access token em localStorage.
- Usar cookies seguros ou BFF conforme arquitetura aprovada.
- Registrar auditoria append-only para ações críticas.
- Não enviar CPF completo, endereço completo, tokens ou documentos à IA.
- Não permitir que IA conceda desconto, desbloqueie, renegocie, cancele ou aprove recolhimento.

## Regras de domínio essenciais
- Entrada manual padrão: fatura aberta com 7 dias ou mais de atraso.
- A regra é configurável por filial, carteira, valor, segmento e contrato.
- Promessa válida pode suspender a fila conforme configuração.
- Offline isoladamente não autoriza recolhimento.
- Recolhimento exige triagem e, por padrão, aprovação de supervisor.
- Score é calculado localmente, versionado e explicável.
- Insight de IA usa resumo consolidado e cache por versão do perfil/prompt.

## Padrões de código
- TypeScript strict, sem `any` salvo justificativa documentada.
- Nomes de código em inglês; textos de interface em pt-BR.
- Dinheiro em centavos usando inteiro ou Decimal; nunca float.
- Datas persistidas em UTC; exibir em America/Sao_Paulo.
- DTOs validados; nunca confiar no frontend.
- Erros externos não devem vazar detalhes internos.
- Use transações para operações que alterem múltiplas entidades.
- Jobs devem ser idempotentes.

## Definition of Done
- Critérios de aceite atendidos.
- Testes cobrindo caminho feliz e falhas principais.
- Migração revisada.
- Endpoint documentado no OpenAPI.
- Auditoria implementada quando aplicável.
- Logs sem PII desnecessária.
- Documentação e progresso atualizados.
