# Operação e observabilidade

## Sinais
- disponibilidade da API;
- latência p50/p95/p99;
- erros por endpoint;
- jobs esperando/ativos/falhos;
- atraso da sincronização por entidade;
- falhas de integração;
- insights e custo de tokens;
- conexões do banco/Redis;
- taxa de login e falha de autorização.

## Runbooks mínimos
- IXC indisponível;
- fila BullMQ acumulada;
- webhook repetindo;
- migração falhou;
- OpenAI indisponível;
- dados divergentes;
- restaurar backup;
- revogar credencial comprometida.

## SLO inicial
Definir após baseline. Não inventar números antes de medir ambiente e carga real.
