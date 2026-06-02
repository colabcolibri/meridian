---
name: init-project
description: Initializes a project with Meridian docs, decision log, board JSON and minimum governance. Use when starting a new project or repairing a missing Meridian structure.
---

# Skill — Iniciar Projeto Meridian

Use esta skill quando o usuário quiser iniciar um projeto usando Meridian.

## Objetivo

Criar a estrutura mínima para que um projeto seja conduzido com documentação,
decisões, user stories e agentes de IA trabalhando com contexto explícito.

## Quando acionar

Use quando:

- o usuário começou um projeto novo;
- existe `meridian.md`, mas não existe `docs/`;
- a estrutura Meridian está incompleta;
- um agente quer implementar algo e não há base documental;
- o projeto precisa ser preparado para agentes trabalharem com governança.

## Entradas esperadas

- Intenção do projeto.
- Nome do projeto, se conhecido.
- Pasta alvo.
- Restrições conhecidas.
- Se o usuário autorizou criar estrutura.

Se faltar informação, faça no máximo 3 perguntas essenciais.
Se a intenção estiver clara, crie rascunhos com premissas explícitas.

## Procedimento

1. Leia `.agent/MERIDIAN.md` quando existir; senão leia `meridian.md`.
2. Verifique se a pasta `docs/` já existe.
3. Se `docs/` não existir, crie:

```txt
docs/
  README.md
  00_scope.md
  01_tech_stack.md
  02_security.md
  03_user_types.md
  04_epics.md
  05_principles.md
  06_versions.md
  07_architecture.md
  08_database.md
  09_api_contracts.md
  10_environments.md
  11_decisions.md
  kanban/board.json
  sprints/
  us/
```

4. Crie `11_decisions.md` como `approved`.
5. Registre a decisão inicial: "Projeto iniciado com Meridian".
6. Crie `00_scope.md` como `draft`.
7. Crie `board.json` como `[]`.
8. Não crie user stories ainda.

## Checkpoints

### Checkpoint 1 — Estrutura

Confirme que existem:

- `docs/`
- `docs/us/`
- `docs/sprints/`
- `docs/kanban/board.json`
- `docs/11_decisions.md`
- `docs/00_scope.md`

### Checkpoint 2 — Segurança mínima

Antes de instalar dependências ou gerar código, confira:

- `.gitignore` existe;
- `.env` e `.env.*` estão protegidos;
- lockfile único será usado;
- builds e dependências locais estão ignorados.

### Checkpoint 3 — Sem execução prematura

Não crie:

- app;
- API;
- banco;
- migrations;
- componentes;
- user stories;

até que a documentação mínima exigida exista.

## Frontmatter mínimo

Todo documento de fase deve começar com:

```yaml
---
title: Nome
status: draft
version: 1.0
updated: YYYY-MM-DD
depends_on: []
blocks: []
---
```

## Regras

- Não escreva código antes de existir escopo mínimo.
- Não marque documentos como `approved` sem confirmação humana ou autorização explícita.
- Não crie US antes de `04_epics.md` e `06_versions.md` estarem `approved`.
- Proteja `.env`, `.env.*`, `node_modules`, builds, logs e caches no `.gitignore`.

## Resultado esperado

Um projeto com estrutura Meridian pronta para planejamento, mas ainda sem execução
de código fora do que foi documentado.

## Formato de resposta

```txt
Meridian initialized:
Created:
Pending:
Blocked:
Assumptions:
Next human decision:
```
