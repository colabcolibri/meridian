---
description: Initialize a project using the Meridian protocol and minimum governance.
---

# /init-meridian

## Goal

Create the minimum Meridian structure for a project before implementation begins.

## Agent

Use `process-manager` with `init-project` and `update-decisions-log`.

## Procedure

1. Read `.agent/MERIDIAN.md` when available; otherwise read `meridian.md`.
2. Check whether `docs/` exists.
3. If missing, create base docs, `docs/us/`, `docs/sprints/` and `docs/kanban/board.json`.
4. Create `11_decisions.md`.
5. Register "Project initialized with Meridian".
6. Create `00_scope.md` as `draft`.
7. Stop before code.

## Output

```txt
Created:
Pending:
Blocked:
Next human decision:
```
