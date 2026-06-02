---
name: generate-board-json
description: Generates docs/kanban/board.json from Meridian user story frontmatter. Use after creating or changing user stories.
---

# Skill — Gerar Board JSON

Use esta skill quando precisar atualizar `docs/kanban/board.json`.

## Fonte de verdade

A fonte de verdade são os arquivos:

```txt
docs/us/US-XXX.md
```

`board.json` é derivado.
Não edite o board como fonte primária.

## Campos

Extraia do frontmatter:

- `id`
- `title`
- `epic`
- `version`
- `status`
- `moscow`
- `depends_on`
- `done_when`

## Estrutura

```json
[
  {
    "id": "US-001",
    "title": "Título curto",
    "epic": "EPIC-01",
    "version": "v1",
    "status": "❌",
    "moscow": "Must",
    "depends_on": [],
    "done_when": "Condição objetiva."
  }
]
```

## Validações

Antes de gravar:

- IDs são únicos.
- IDs seguem `US-XXX`.
- Epics existem em `04_epics.md`.
- Versões existem em `06_versions.md`.
- Dependências existem.
- `🔶` tem `Falta:` no aceite da US.
- `done_when` não está vazio.
- `board.json` contém todos os US válidos.
- `board.json` não contém IDs sem arquivo correspondente.

## Ordenação

Ordene por ID crescente.

## Procedimento

1. Ler todos os arquivos `docs/us/US-*.md`.
2. Extrair frontmatter.
3. Validar campos obrigatórios.
4. Validar dependências.
5. Montar array JSON.
6. Ordenar por ID.
7. Escrever `docs/kanban/board.json`.
8. Reportar divergências.

## Formato de resposta

```txt
Stories read:
Stories exported:
Invalid stories:
Board path:
Warnings:
```

## Exportações

CSV, planilhas ou outros formatos são exportações derivadas e futuras.
Não mantenha CSV em paralelo como fonte de verdade.
