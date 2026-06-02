# Templates de documentos Meridian

Frontmatter obrigatório em todo doc de fase:

```yaml
---
title: Nome do documento
status: draft
version: 1.0
updated: YYYY-MM-DD
depends_on: []
blocks: []
---
```

## `docs/README.md` (porta humana)

```markdown
# Nome do projeto

Breve descrição.

## Documentos de fase

| Doc | Status | Descrição |
| --- | ------ | --------- |
| 00_scope | draft | Escopo |
| ... | ... | ... |

## Como trabalhar

1. Aprovar docs na ordem de dependência.
2. Criar US só após epics e versões approved.
3. Regenerar board após mudanças em US.
```

## `00_scope.md` (rascunho inicial)

Seções mínimas:

- Problema
- Usuários
- Dentro do escopo
- Fora do escopo
- Premissas
- Restrições
- Riscos conhecidos
- Perguntas em aberto

## `11_decisions.md` (primeira entrada)

```markdown
## YYYY-MM-DD — Projeto iniciado com Meridian

**Documento afetado:** docs/
**O que mudou:** Estrutura Meridian criada.
**Por que mudou:** Início do projeto com governança documental.
**Impacto em outros docs:** Todos os docs de fase em draft.
**Responsável:** [manager]
```

## `docs/kanban/board.json`

```json
[]
```
