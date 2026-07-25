# Score e IA

## WLinks Score

Score de 0 a 100 calculado pelo backend.

Pesos iniciais:
- regularidade: 30;
- dívida atual: 20;
- atrasos históricos: 15;
- promessas: 15;
- relacionamento: 10;
- resposta: 5;
- situação do serviço: 5.

Toda execução guarda versão, fatores e resultado.

## Score de recuperação

Separado do WLinks Score. Estima prioridade operacional, inicialmente por regras. Modelo estatístico somente após dados e validação.

## Perfil financeiro consolidado

Métricas:
- total de faturas;
- percentual em dia;
- atraso médio e máximo;
- total pago;
- valor vencido;
- promessas cumpridas/quebradas;
- última data de pagamento;
- comportamento em 3/6/12/24 meses;
- versão do perfil.

## Cache do insight

Chave lógica:
`customerId + caseId/invoiceId + profileVersion + promptVersion + modelPolicyVersion`.

O insight é invalidado por pagamento, nova fatura, promessa, contato relevante, mudança de contrato/conexão, recolhimento ou recálculo material do score.

## Governança

- armazenar resumo enviado, resposta, modelo, tokens, custo estimado e solicitante;
- permitir feedback útil/incorreto;
- bloquear dados proibidos antes da chamada;
- saída deve ser validada por schema;
- falha de IA nunca impede a operação normal.
