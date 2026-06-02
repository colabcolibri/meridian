---
description: Regenerate docs/kanban/board.json from Meridian user stories.
---

# /sync-board

## Goal

Keep the board JSON consistent with user story frontmatter.

## Agent

Use `board-keeper` with `generate-board-json`.

## Procedure

1. Read all `docs/us/US-*.md`.
2. Validate IDs, epics, versions, dependencies and `done_when`.
3. Check `🔶` acceptance criteria for `Falta:`.
4. Generate `docs/kanban/board.json`.
5. Report any invalid story.

## Output

```txt
Stories read:
Invalid:
Board updated:
Warnings:
```
