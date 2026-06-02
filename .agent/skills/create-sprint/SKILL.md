---
name: create-sprint
description: Creates a Meridian sprint file in docs/sprints linked to a version. Use when planning execution slices within a release.
allowed-tools: Read, Glob, Grep, Bash, Edit, Write
---

# Create sprint (Meridian)

## Selective reading

| Arquivo | Quando ler |
| ------- | ---------- |
| `references/sprint-template.md` | Ao redigir `docs/sprints/vX-SY.md` |
| `docs/versions/vX.md` | Versão pai deve existir |
| `docs/sprints/` | Sprints existentes da versão |

## Pré-condições

- Arquivo `docs/versions/{version}.md` existe (`version: v1` no sprint).
- Versão referenciada está `planned` ou `active`.
- `05_architecture.md` `approved` antes de criar US novas.

## Procedimento

1. Listar sprints da versão em `docs/sprints/vX-S*.md` → próximo SY = maior + 1.
2. Preencher template com `stories: [US-XXXX, …]` (US existentes ou planejadas).
3. Salvar `docs/sprints/vX-SY.md`.
4. US novas → `/create-us` após gates; depois `/sync-board`.

## Saída

```txt
Sprint created:
File: docs/sprints/vX-SY.md
Version:
Stories:
sprint file saved: yes | no
```
