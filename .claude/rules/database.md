---
paths:
  - "prisma/**"
  - "apps/api/src/**/repositories/**"
---
# Regras de dados

- IDs internos usam UUID/UUIDv7 quando suportado; IDs externos ficam em colunas próprias.
- Campos monetários usam Decimal(14,2) ou centavos BIGINT conforme decisão registrada.
- Tabelas sincronizadas possuem `external_id`, `source_system`, `source_updated_at`, `synced_at`, `checksum` e `sync_status` quando aplicável.
- Não apagar histórico financeiro recebido; usar status, eventos e snapshots.
- Auditoria e score snapshots são append-only.
- Criar índices para filtros reais: filial, carteira, operador, status, vencimento, atraso e cliente.
- Evitar N+1; revisar query plan de listagens principais.
- Migrações de produção devem ser compatíveis com estratégia expand/contract quando houver tráfego.
