---
paths:
  - "apps/api/**/*.ts"
  - "apps/worker/**/*.ts"
---
# Regras de backend

- Organize cada domínio em `application`, `domain`, `infrastructure` e `presentation` quando isso melhorar a clareza; evite cerimônia vazia.
- Controllers apenas validam entrada, chamam use cases e mapeiam resposta.
- Repositórios Prisma implementam interfaces do domínio.
- Use guards para autenticação, função e escopo por filial/carteira.
- Todo endpoint de mutação aceita ou gera chave de idempotência quando houver risco de repetição externa.
- Integrações externas retornam erros tipados e não propagam payload bruto ao cliente.
- Use outbox para eventos importantes que precisam disparar jobs após commit.
- Não execute chamadas externas dentro de transação longa de banco.
