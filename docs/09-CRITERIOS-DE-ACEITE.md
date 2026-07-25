# Critérios de aceite do MVP

- Operador só vê filiais/carteiras autorizadas.
- Fatura com 7 dias entra na fila conforme regra.
- Cliente com promessa válida é tratado conforme configuração.
- Cliente 360 mostra fonte e horário da sincronização.
- Score pode ser explicado por fatores e versão.
- Reabrir a mesma fatura sem mudança reutiliza insight salvo.
- Mudança financeira relevante invalida insight.
- Sem OpenAI, score e operação continuam funcionando.
- Contato e promessa geram timeline e auditoria.
- Webhook duplicado não duplica evento.
- Offline sem outros critérios não abre recolhimento.
- Supervisor consegue aprovar/reprovar recolhimento.
- Nenhum log contém CPF completo ou token.
