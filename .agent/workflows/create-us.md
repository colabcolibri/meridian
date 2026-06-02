---
description: Create a Meridian user story after checking epics, versions and dependencies.
---

# /create-us

## Goal

Create one valid user story in `docs/us/`.

## Agent

Use `board-keeper` with `create-user-story` and `generate-board-json`.

## Procedure

1. Confirm `04_epics.md` and `06_versions.md` are approved.
2. Select valid epic and version.
3. Determine next permanent US ID.
4. Create `docs/us/US-XXX.md`.
5. Keep status `❌` unless implementation evidence exists.
6. Regenerate `docs/kanban/board.json`.

## Output

```txt
Created:
Epic:
Version:
Dependencies:
Board updated:
```
