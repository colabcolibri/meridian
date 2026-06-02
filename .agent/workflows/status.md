---
description: Report current Meridian project health, blockers and next actions.
---

# /status

## Goal

Give the human manager a concise view of the project.

## Agent

Use `process-manager`.

## Procedure

1. Read `.agent/MERIDIAN.md` or `meridian.md`.
2. Read `docs/README.md`.
3. Read frontmatter of phase docs.
4. Read `docs/kanban/board.json`.
5. Check blocked documents.
6. Check invalid user stories.
7. Run `.agent/scripts/validate_meridian.py` if available.
8. Report next actions.

## Output

```txt
Current phase:
Approved docs:
Blocked docs:
Stories:
Invalid items:
Next action:
```
