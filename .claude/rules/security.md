# Regras de segurança

- Trate toda rota como privada, exceto health checks estritamente necessários.
- O token deve ser validado por issuer, audience, assinatura, expiração e nonce/estado conforme fluxo.
- Segredos só por variáveis de ambiente ou secret manager.
- Webhooks exigem assinatura HMAC, timestamp, proteção contra replay e idempotência.
- Rate limit por usuário, IP e integração nos pontos sensíveis.
- Exporte dados apenas com permissão explícita e gere auditoria.
- PII em logs deve ser mascarada. Nunca registrar token, senha, boleto completo ou documento completo.
- Dependências e imagens devem ser verificadas no CI.
- Toda consulta por ID deve confirmar escopo da filial/carteira do usuário.
