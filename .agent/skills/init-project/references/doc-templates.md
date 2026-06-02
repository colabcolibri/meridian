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

1. Aprovar docs na ordem de dependência: fundação → princípios → arquitetura → detalhe.
2. Montar backlog em `docs/epics/`, `docs/versions/` e `docs/sprints/`.
3. Criar US só após `05_architecture` approved e epic/version nas pastas.
4. Regenerar board após mudanças em US.
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

## `11_decisions.md` + `docs/decisions/` (primeira entrada)

Criar stub `11_decisions.md` (regras) e pasta `docs/decisions/`.
No primeiro dia, criar `docs/decisions/YYYY-MM-DD.json`:

```json
{
  "date": "YYYY-MM-DD",
  "entries": [
    {
      "time": "HH:MM",
      "title": "Projeto iniciado com Meridian",
      "affected_document": "docs/",
      "what_changed": "Estrutura Meridian criada.",
      "why_changed": "Início do projeto com governança documental.",
      "impact": "Todos os docs de fase em draft.",
      "responsible": "[manager]"
    }
  ]
}
```

## `docs/kanban/board.json`

```json
[]
```
