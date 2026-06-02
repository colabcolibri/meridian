---
name: create-user-story
description: Creates a valid Meridian user story after epics and versions are approved. Use when adding work to docs/us and keeping acceptance criteria concrete.
allowed-tools: Read, Glob, Grep, Bash, Edit, Write
---

# Create user story (Meridian)

## Selective reading

| Arquivo | Quando ler |
| ------- | ---------- |
| `references/us-template.md` | Ao redigir o arquivo `docs/us/US-XXXX.md` |

## Pré-condições (hard gate)

| Doc | Status exigido |
| --- | -------------- |
| `05_architecture.md` | `approved` |
| epic/version nas pastas | existem |
| Epic citado | arquivo `docs/epics/EPIC-XX.md` existe |
| Versão citada | arquivo `docs/versions/vX.md` existe |
| Perfil em `03_user_types.md` | existe |

A US **referencia** o epic pelo campo `epic: EPIC-XX`. Não copie descrição, `outcome` nem escopo do epic para dentro da US — a fonte canônica do epic é `docs/epics/`.

Se o epic não existir → use skill `create-epic` antes de salvar a US.

Se falhar → **não** salvar US válida; reportar bloqueio e menor doc necessário.

## Fase 0 — clarificação

Pedido vago → perguntas de produto:

1. Quem usa?
2. Qual ação?
3. Qual benefício?
4. Como saber que terminou (`done_when`)?

## Procedimento

1. Listar `docs/us/US-*.md` → próximo ID = maior número + 1, formatado como `US-XXXX` (4 dígitos, zero à esquerda).
2. Preencher template de `references/us-template.md`.
3. Validar `done_when` mensurável; `🔶` exige `Falta:` no aceite.
4. Salvar `docs/us/US-XXXX.md`.
5. Invocar `generate-board-json` ou regenerar `board.json`.
6. Se mudança relevante → `update-decisions-log`.

**Fechamento:** após implementação, usar skill `complete-user-story` (workflow `/complete-us`) — não marcar `✅` nesta skill.

## Validações antes de salvar

- ID novo, formato `US-XXXX` (4 dígitos); nome do arquivo = `{id}.md`
- Dependências existem e estão `✅` antes de marcar dependente como `✅`
- Fora de escopo preenchido se houver risco de ambiguidade

## Saída

```txt
US created:
File:
Epic:
Version:
Depends on:
Board updated:
Open questions:
```
