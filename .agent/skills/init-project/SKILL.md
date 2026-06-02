---
name: init-project
description: Initializes a project with Meridian docs, decision log, board JSON and minimum governance. Use when starting a new project or repairing a missing Meridian structure.
allowed-tools: Read, Glob, Grep, Bash, Edit, Write
---

# Init project (Meridian)

> Cria estrutura mínima em `docs/` para governança antes de qualquer código de produto.

## Selective reading

| Arquivo | Quando ler |
| ------- | ---------- |
| `references/doc-templates.md` | Ao criar arquivos de fase e primeira decisão |
| `references/gitignore-baseline.md` | Antes de `npm install` ou primeiro commit |

## Quando acionar

- Projeto novo com intenção Meridian
- Existe `meridian.md` ou `.agent/` mas falta `docs/`
- Estrutura incompleta ou corrompida
- Agente tentou implementar sem base documental

## Fase 0 — context check

1. Ler `.agent/MERIDIAN.md` se existir; senão `meridian.md`.
2. Confirmar pasta alvo e autorização do usuário para criar arquivos.
3. Se faltar intenção do projeto → máximo **3 perguntas** (problema, usuário, restrições).

## Procedimento

1. Verificar se `docs/` existe.
2. Se ausente, criar árvore:

```txt
docs/
  README.md
  00_scope.md … 11_decisions.md
  decisions/
  kanban/board.json
  sprints/
  us/
```

3. Aplicar frontmatter de `references/doc-templates.md` em cada doc (`status: draft`, exceto decisão inicial).
4. `11_decisions.md` (stub) + `docs/decisions/YYYY-MM-DD.json` com entrada "Projeto iniciado com Meridian".
5. `00_scope.md`: rascunho com premissas explícitas se necessário.
6. `board.json`: `[]`
7. Validar `.gitignore` com `references/gitignore-baseline.md`.
8. **Não** criar US, app, API, banco ou migrations.

## Checkpoints

| # | Verificação |
| - | ----------- |
| 1 | `docs/`, `decisions/`, `us/`, `sprints/`, `board.json`, `11_decisions`, `00_scope` existem |
| 2 | `.env*` protegidos no `.gitignore` |
| 3 | Nenhum código de produto criado |

## Proibições

| Proibido | Permitido |
| -------- | --------- |
| Marcar fase docs como `approved` sem humano | `draft` + premissas |
| Criar US | Estrutura vazia `us/` |
| Implementar features | Docs + decisão inicial |

## Saída

```txt
Meridian initialized:
Created:
Pending:
Blocked:
Assumptions:
Next human decision:
```
