---
name: generate-board-json
description: Generates docs/kanban/board.json from Meridian user story frontmatter. Use after creating or changing user stories.
allowed-tools: Read, Glob, Grep, Bash, Edit, Write
---

# Generate board JSON

## Selective reading

| Arquivo | Quando ler |
| ------- | ---------- |
| `references/board-schema.md` | Validação de campos e divergências |

## Fonte de verdade

```txt
docs/us/US-XXXX.md  →  derivado  →  docs/kanban/board.json
```

Nunca editar o board como fonte primária.

## Procedimento

1. Glob `docs/us/US-*.md`
2. Extrair frontmatter: `id`, `title`, `epic`, `version`, `status`, `moscow`, `depends_on`, `done_when`
3. Validar contra `references/board-schema.md` e `04_epics` / `06_versions`
4. Ordenar por ID crescente
5. Escrever `docs/kanban/board.json`
6. Reportar US inválidas sem incluí-las

## Validação opcional

```bash
python .agent/scripts/validate_meridian.py <project-root>
```

## Saída

```txt
Stories read:
Stories exported:
Invalid stories:
Board path:
Warnings:
```
