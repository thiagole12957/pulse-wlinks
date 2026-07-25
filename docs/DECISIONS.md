# Registro de decisões

Use o formato:

## ADR-XXX - Título
- Data:
- Status: proposta | aceita | substituída
- Contexto:
- Decisão:
- Consequências:
- Alternativas:

## ADR-001 - Monólito modular
- Status: aceita
- Decisão: iniciar com web, API e worker no mesmo monorepo, com módulos de domínio claros.
- Consequência: menor complexidade operacional e possibilidade de extração futura.

## ADR-002 - Score determinístico
- Status: aceita
- Decisão: score local, versionado e explicável; IA apenas interpreta.

## ADR-003 - Cópia operacional do IXC
- Status: aceita
- Decisão: PostgreSQL mantém cópia para performance e histórico, IXC continua origem oficial.
