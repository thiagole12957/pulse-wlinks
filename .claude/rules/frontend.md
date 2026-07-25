---
paths:
  - "apps/web/**/*.{ts,tsx}"
---
# Regras de frontend

- Componentes de página orquestram; componentes de domínio apresentam.
- Dados remotos são geridos pelo TanStack Query.
- Formulários usam React Hook Form e Zod.
- Não reproduzir regras de autorização apenas no frontend; UI oculta ações, backend decide.
- Toda tabela grande usa paginação server-side e filtros serializáveis na URL.
- Mostrar data/hora da última sincronização e estado de dado desatualizado.
- Estados obrigatórios: carregando, vazio, erro, sem permissão e sucesso.
- Acessibilidade: teclado, foco visível, labels e contraste.
- Moeda: `pt-BR`, BRL; datas na zona America/Sao_Paulo.
