# Regras de domínio

## Caso de relacionamento

Unidade operacional principal: cliente + contrato + conjunto de faturas elegíveis. Não agrupar contratos diferentes sem explicitar.

## Elegibilidade padrão

Um caso entra na fila quando:

- existe fatura aberta;
- vencimento ocorreu há 7 dias ou mais;
- valor aberto é maior que zero;
- regra da filial/carteira permite;
- não há exceção ativa;
- promessa válida não suspende o caso, salvo configuração contrária.

## Prioridade

Fatores iniciais:
- dias de atraso;
- valor total;
- quantidade de faturas;
- cliente bloqueado e login online;
- promessa quebrada;
- ausência de contato;
- risco de cancelamento;
- perfil empresarial/estratégico.

## Estados do caso

`NEW`, `ASSIGNED`, `IN_ANALYSIS`, `CONTACTING`, `CUSTOMER_REPLIED`, `WAITING_PAYMENT`, `PROMISE_ACTIVE`, `NEGOTIATING`, `PROMISE_BROKEN`, `NO_CONTACT`, `PICKUP_CANDIDATE`, `PICKUP_PENDING_APPROVAL`, `PICKUP_OPENED`, `REGULARIZED`, `CLOSED`.

Transições devem ser validadas por máquina de estados.

## Promessa

- valor, data, canal, operador e faturas vinculadas são obrigatórios;
- vencida sem pagamento torna-se quebrada por job;
- pagamento confirmado pelo IXC pode cumprir total ou parcialmente;
- alteração gera novo evento, não apaga histórico.

## Recolhimento

Offline é sinal, não decisão. Para candidatura:

- contrato bloqueado/inadimplente;
- offline por período configurado;
- sem promessa válida;
- sem OS técnica impeditiva;
- mínimo de tentativas configurado;
- sem resposta ou indicação de abandono/mudança.

Supervisor aprova antes de abrir processo no GC, salvo regra excepcional documentada.
