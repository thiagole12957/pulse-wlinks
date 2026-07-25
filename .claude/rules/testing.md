# Regras de testes

- Unitários: score, regras de elegibilidade, transições, cache key e normalização.
- Integração: repositórios, transações, outbox, filas e adaptadores mockados.
- E2E: login, fila, Cliente 360, promessa, insight e recolhimento.
- Teste de contrato para IXC, OmnieTalk, GC e OpenAI com fixtures sanitizadas.
- Teste obrigatório de autorização horizontal: usuário de uma filial não lê outra.
- Teste obrigatório de idempotência para webhooks e sincronizações.
- Use relógio injetável; não dependa de `new Date()` diretamente no domínio.
