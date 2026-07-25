# Segurança

## Identidade
- OIDC Authorization Code + PKCE;
- MFA no provedor;
- sessão curta e refresh rotativo;
- logout e revogação;
- usuários não são criados automaticamente sem regra aprovada.

## Autorização
- RBAC: ADMIN, DIRECTOR, MANAGER, SUPERVISOR, OPERATOR, FINANCE, PICKUP, AUDITOR;
- ABAC por filial, carteira, equipe e limites;
- checagem no backend e, quando útil, RLS no PostgreSQL.

## Dados
- TLS;
- criptografia de backup;
- PII mascarada;
- retenção definida;
- exportação controlada;
- secrets em secret manager.

## Auditoria
Eventos críticos append-only com ator, ação, recurso, escopo, resultado, timestamp, IP, user-agent e correlation ID.

## Integrações
- contas técnicas separadas;
- mínimo privilégio;
- HMAC e replay protection;
- timeout e rate limit;
- rotação de chaves;
- lista de campos permitidos.
