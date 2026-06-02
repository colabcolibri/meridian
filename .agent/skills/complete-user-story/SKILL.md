---
name: complete-user-story
description: Fecha uma Meridian user story após implementação — preenche Implementação técnica, aceite, status e board. Use when marking US done, completing US-XXXX, or after implementing a user story.
allowed-tools: Read, Glob, Grep, Bash, Edit, Write
---

# Complete user story (Meridian)

## Selective reading

| Arquivo | Quando ler |
| ------- | ---------- |
| `references/implementation-template.md` | Ao preencher `## Implementação técnica` |
| `../create-user-story/references/us-template.md` | Estrutura completa da US |

## Quando acionar

- Implementação de código (ou docs de produto) terminou para uma US.
- Manager pede marcar US como `✅`.
- Workflow `/complete-us` ou fechamento explícito pós-implementação.

**Não** use na criação da US — use `create-user-story`.

## Pré-condições (hard gate)

| Verificação | Exigência |
| ----------- | --------- |
| US existe | `docs/us/US-XXXX.md` |
| Dependências | Todo `depends_on` com status `✅` |
| Evidência | Build/lint/test aplicável passou |
| Aceite | Critérios comprovados (marcar `[x]`) |

Se algo falhar → **não** marcar `✅`; use `🔶` com `Falta:` no aceite.

## Procedimento

1. Ler `docs/us/US-XXXX.md` e identificar escopo (aceite + `done_when`).
2. Inspecionar o que foi entregue: `git diff`, arquivos alterados, output de testes.
3. Substituir `## Implementação técnica` pelo **registro real** (ver `references/implementation-template.md`):
   - paths relativos ao repo (não só nomes soltos);
   - resumo por camada (Backend, Frontend, Scripts, Docs);
   - remover placeholders `_(preencher...)_` e planos antecipados que não refletem o código.
4. Em `## Testes`:
   - marcar `[x]` em **todos** os itens de **Planejado**;
   - preencher **Executado** com comando/verificação + resultado (data opcional);
   - atualizar frontmatter `tests_status: done` (quando `tests: required`).
5. Marcar aceite `[x]` com evidência objetiva.
6. Atualizar frontmatter `status: ✅` (ou `🔶` se parcial + `Falta:`). Só marcar `✅` se `tests: none` **ou** `tests_status: done`.
7. Invocar `generate-board-json`.
8. Se mudança relevante cross-cutting → `update-decisions-log` (decisões locais da US ficam em Implementação técnica).

## Validações antes de marcar `✅`

- `## Implementação técnica` preenchida — não placeholder, não só plano.
- Seção `### Arquivos` lista paths reais tocados (ou `_n/a_` com justificativa explícita).
- Todo item de aceite verificável está `[x]` ou há `Falta:` com status `🔶`.
- `depends_on` satisfeitas.
- Se `tests: required`: `tests_status: done`, **Planejado** todo `[x]`, **Executado** preenchido.

## Saída

```txt
US completed:
File:
Status:
Implementation summary: (1 linha)
Files touched: (contagem)
Tests run:
Board updated:
Decisions logged: yes | no
Open items:
```
