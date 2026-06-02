---
name: create-version
description: Creates a Meridian release file in docs/versions and updates the 06_versions index. Use when defining a new product version before user stories.
allowed-tools: Read, Glob, Grep, Bash, Edit, Write
---

# Create version (Meridian)

## Selective reading

| Arquivo | Quando ler |
| ------- | ---------- |
| `references/version-template.md` | Ao redigir `docs/versions/vX.md` |
| `docs/06_versions.md` | Atualizar tabela do índice após nova versão |
| `docs/00_scope.md` | Validar escopo do release |

## Pré-condições

| Doc | Status exigido |
| --- | -------------- |
| `00_scope.md` | `approved` ou explícito no escopo |
| `03_user_types.md` | `approved` |

Versão = **release de produto** (go-live), não sprint nem módulo técnico.

## Procedimento

1. Listar `docs/versions/v*.md` → próximo ID = maior número + 1 (`v3`, `v4`…).
2. Preencher `references/version-template.md`.
3. Salvar `docs/versions/vX.md` (nome do arquivo = `id`).
4. Atualizar tabela em `docs/06_versions.md`.
5. Se mudança relevante → `update-decisions-log`.
6. Validar: `python .agent/scripts/validate_meridian.py <project-root>`.

## Validações

- `outcome` mensurável no nível produto
- `v0` só para fundação técnica
- Sprints da versão → skill `create-sprint` em `docs/sprints/`

## Saída

```txt
Version created:
File: docs/versions/vX.md
Outcome:
06_versions index updated: yes | no
Open questions:
Next: create-sprint ou /plan-sprint
```
