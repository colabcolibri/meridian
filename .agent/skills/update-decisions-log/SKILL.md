---
name: update-decisions-log
description: Appends relevant project decisions to docs/11_decisions.md. Use when scope, stack, security, architecture, versions or acceptance criteria change.
---

# Skill — Atualizar Log de Decisões

Use esta skill sempre que uma mudança relevante acontecer.

## Quando registrar decisão

Registre em `docs/11_decisions.md` quando houver mudança em:

- escopo;
- stack;
- segurança;
- tipos de usuário;
- epics;
- versões;
- arquitetura;
- banco de dados;
- contratos de API;
- ambientes;
- critérios de aceite;
- política de agentes;
- governança do projeto.

## Formato

```md
## YYYY-MM-DD — Título objetivo

**Documento afetado:** arquivo
**O que mudou:** descrição objetiva
**Por que mudou:** contexto e motivação
**Impacto em outros docs:** lista de docs afetados
**Responsável:** pessoa ou papel
```

## Regras

- O log é append-only.
- Não edite entradas antigas.
- Se um documento `approved` mudar, registre decisão e volte o documento para `review`.
- Seja objetivo, mas não omita motivação.
- Decisões de segurança devem mencionar impacto e mitigação.

## Campos de qualidade

Uma boa decisão:

- diz exatamente o que mudou;
- explica por que mudou agora;
- aponta documentos afetados;
- identifica impacto em fluxo, segurança ou arquitetura;
- deixa claro quem assumiu a responsabilidade.

Uma decisão ruim:

- diz apenas "ajustado";
- não explica motivação;
- mistura várias decisões independentes;
- altera documento aprovado sem registrar impacto.

## Formato de resposta

```txt
Decision logged:
Affected document:
Docs moved to review:
Follow-up:
```

## Arquivamento

Quando `11_decisions.md` passar de aproximadamente 200 linhas:

1. mova entradas antigas para `11_decisions_YYYY.md`;
2. mantenha o arquivo atual com entradas recentes;
3. registre o arquivamento como nova decisão.
