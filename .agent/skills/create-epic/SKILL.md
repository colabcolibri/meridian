---
name: create-epic
description: Creates a Meridian epic file in docs/epics after architecture is approved. Use when defining a new product capability block before user stories.
allowed-tools: Read, Glob, Grep, Bash, Edit, Write
---

# Create epic (Meridian)

## Selective reading

| Arquivo | Quando ler |
| ------- | ---------- |
| `references/epic-template.md` | Ao redigir `docs/epics/EPIC-XX.md` |
| `docs/03_user_types.md` | Validar perfis em `profiles` |
| `docs/epics/` | Arquivos existentes (IDs, duplicação) |
| `docs/versions/` | Validar `versions:` no frontmatter |

## Pré-condições

| Doc | Status exigido |
| --- | -------------- |
| `05_architecture.md` | `approved` |
| `00_scope.md` | `approved` ou explícito no escopo |
| `03_user_types.md` | `approved` (perfis do epic devem existir aqui) |

Épicos são **capacidade de produto**, não módulos técnicos (`src/…`).

## O que um epic contém (conceito)

| Campo | Onde | Papel |
| ----- | ---- | ----- |
| `id`, `title`, `status`, `versions`, `profiles` | frontmatter | Metadados para app e validação |
| `outcome` | frontmatter | Done do epic no nível **produto** (não implementação) |
| Capacidade | corpo | O que o usuário passa a conseguir |
| Fora deste epic | corpo | Limites — evita escopo creep |

User stories **referenciam** o epic (`epic: EPIC-XX` no frontmatter da US). A US **não** repete descrição, outcome nem escopo do epic.

## Procedimento

1. Listar `docs/epics/EPIC-*.md` → próximo ID = maior número + 1 (IDs permanentes).
2. Preencher `references/epic-template.md`.
3. Validar cada item de `profiles` contra `03_user_types.md`.
4. Validar cada item de `versions` contra arquivos em `docs/versions/`.
5. Salvar `docs/epics/EPIC-XX.md` (nome do arquivo = `id`).
6. Se mudança relevante → `update-decisions-log`.

## Validações antes de salvar

- `outcome` mensurável no nível produto
- `versions` referenciam releases em `docs/versions/` (quando informado)
- Não duplicar capacidade já coberta por outro epic
- Nome do arquivo = `id` (`EPIC-07.md` → `id: EPIC-07`)

## Validação opcional

```bash
python .agent/scripts/validate_meridian.py <project-root>
```

## Saída

```txt
Epic created:
File: docs/epics/EPIC-XX.md
Outcome:
Versions:
Profiles:
epic file saved: yes | no
Open questions:
```
