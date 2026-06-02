---
name: create-user-story
description: Creates a valid Meridian user story after epics and versions are approved. Use when adding work to docs/us and keeping acceptance criteria concrete.
allowed-tools: Read, Glob, Grep, Bash, Edit, Write
---

# Create user story (Meridian)

## Selective reading

| Arquivo | Quando ler |
| ------- | ---------- |
| `references/us-template.md` | Ao redigir o arquivo `docs/us/US-XXX.md` |

## Pré-condições (hard gate)

| Doc | Status exigido |
| --- | -------------- |
| `04_epics.md` | `approved` |
| `06_versions.md` | `approved` |
| Epic citado | existe |
| Versão citada | existe |
| Perfil em `03_user_types.md` | existe |

Se falhar → **não** salvar US válida; reportar bloqueio e menor doc necessário.

## Fase 0 — clarificação

Pedido vago → perguntas de produto:

1. Quem usa?
2. Qual ação?
3. Qual benefício?
4. Como saber que terminou (`done_when`)?

## Procedimento

1. Listar `docs/us/US-*.md` → próximo ID = max + 1 (não reutilizar IDs removidos).
2. Preencher template de `references/us-template.md`.
3. Validar `done_when` mensurável; `🔶` exige `Falta:` no aceite.
4. Salvar `docs/us/US-XXX.md`.
5. Invocar `generate-board-json` ou regenerar `board.json`.
6. Se mudança relevante → `update-decisions-log`.

## Validações antes de salvar

- ID novo, formato `US-XXX`
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
