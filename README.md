# WLinks Pulse

Plataforma interna de relacionamento financeiro, recuperação de receita e acompanhamento do cliente WLinks.

## Objetivo

Centralizar a operação manual de relacionamento com clientes inadimplentes, integrando:

- IXC Provedor: clientes, contratos, planos, títulos, pagamentos, status da internet e login;
- OmnieTalk: WhatsApp, ligações, e-mail e histórico de atendimento;
- GC: triagem e abertura de processos de recolhimento;
- OpenAI: insights, resumo e orientação ao operador;
- PostgreSQL: cópia operacional, histórico financeiro, score, tarefas e auditoria;
- Redis + BullMQ: sincronizações, filas, retries, cache e tarefas agendadas.

## Princípios

1. O IXC é a fonte oficial de clientes, contratos e financeiro.
2. O Pulse mantém uma cópia operacional para desempenho e histórico.
3. Alterações no IXC são feitas somente por API oficial.
4. O score é determinístico, versionado e auditável.
5. A IA interpreta dados resumidos; não inventa score nem toma decisões irreversíveis.
6. Toda ação relevante gera auditoria.
7. A entrada padrão na fila manual ocorre no 7º dia de atraso, mas é configurável.
8. Cliente offline não gera recolhimento automático sem triagem.

## Como iniciar no Claude Code

1. Extraia o projeto.
2. Abra a pasta raiz no terminal.
3. Execute `claude`.
4. Peça: `Leia CLAUDE.md e docs/00-PROMPT-MESTRE.md. Comece pela Fase 0 sem pular etapas.`
5. Confirme o plano gerado e deixe o Claude criar os arquivos executáveis do monorepo.

O Claude Code carrega o arquivo `CLAUDE.md` no início das sessões. As regras especializadas estão em `.claude/rules/`.

## Estrutura proposta

```text
wlinks-pulse/
├── CLAUDE.md
├── .claude/
│   ├── rules/
│   ├── commands/
│   └── agents/
├── apps/
│   ├── api/
│   ├── web/
│   └── worker/
├── packages/
│   ├── contracts/
│   ├── config/
│   ├── ui/
│   └── observability/
├── prisma/
├── docs/
├── infrastructure/
├── tests/
└── scripts/
```

## Primeiro marco funcional

O primeiro marco deve permitir:

- autenticar operador;
- sincronizar cliente, contrato e título de um ambiente mock;
- listar a fila manual por filial e carteira;
- abrir Cliente 360;
- visualizar fatura e perfil financeiro;
- calcular WLinks Score;
- gerar ou reutilizar insight de IA;
- registrar contato, promessa e tarefa;
- produzir auditoria.

## Estado deste pacote

Este pacote é um blueprint técnico completo. O Claude deverá transformar o blueprint em código executável, instalar versões estáveis atuais, gerar o lockfile e implementar fase a fase.
