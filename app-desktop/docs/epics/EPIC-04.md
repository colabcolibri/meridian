---
id: EPIC-04
title: Kanban e User Stories
status: active
versions: [v1, v2]
profiles: [Manager do Processo, Operador Local, Futuro Usuário VSCode]
outcome: "Manager vê épicos, US por status e board.json derivado — sem editar JSON manualmente."
---

# EPIC-04 — Kanban e User Stories

## Capacidade

Abas **Entregas** e **Quadro**: épicos lidos de `docs/epics/`, user stories de `docs/us/`, kanban derivado de frontmatters, filtro por epic.

## Resultado esperado

Cada US referencia um epic por ID (`epic: EPIC-XX`); o app agrupa US por epic e mostra colunas de status sem duplicar a definição do epic dentro da US.

## Fora deste epic

- Criar/editar US pelo app (EPIC-05 / v2).
- Definir novos épicos (skill `create-epic` + docs/epics/).
