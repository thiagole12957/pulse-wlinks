# Integrações

## IXC

Leitura:
- clientes e contatos;
- contratos e planos;
- filial e carteira;
- títulos e pagamentos;
- status do contrato/internet;
- login, sessão, última conexão e consumo;
- OS técnica impeditiva.

Escrita, somente por API confirmada:
- segunda via/Pix;
- desbloqueio autorizado;
- observação/atendimento;
- negociação;
- outras ações documentadas.

Criar `IxcPort` e implementações `IxcMockAdapter` e `IxcHttpAdapter`.

## OmnieTalk
- localizar/criar contato;
- abrir atendimento;
- enviar mensagem;
- iniciar ligação;
- enviar e-mail;
- receber eventos/status;
- vincular protocolo ao caso.

## GC
- criar processo de recolhimento após aprovação;
- consultar status;
- receber conclusão/cancelamento.

## OpenAI
Entrada mínima:
- identificador interno;
- perfil financeiro consolidado;
- score e fatores;
- fatura/caso atual;
- conexão e contatos recentes;
- políticas autorizadas.

Saída estruturada:
- resumo;
- risco;
- fatores principais;
- próxima ação sugerida;
- abordagem sugerida;
- alertas;
- confiança/limitações.

## E-mail
Usar provedor por adaptador. Em desenvolvimento, Mailpit. Produção deve usar domínio autenticado e registrar eventos de entrega quando disponíveis.
