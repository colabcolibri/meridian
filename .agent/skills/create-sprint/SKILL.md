---
name: create-sprint
description: Creates a Meridian sprint file in docs/sprints linked to a version. Use when planning execution slices within a release.
allowed-tools: Read, Glob, Grep, Bash, Edit, Write
---

# Create sprint (Meridian)

## Selective reading

| File | When to read |
| ------- | ---------- |
| `references/sprint-template.md` | When drafting `docs/sprints/vX-SY.md` |
| `docs/versions/vX.md` | Parent version must exist |
| `docs/sprints/` | Existing sprints for version |

## Preconditions

- File `docs/versions/{version}.md` exists (`version: v1` in sprint).
- Referenced version is `planned` or `active`.
- `05_architecture.md` `approved` before creating new US.

## Procedure

1. List sprints for version in `docs/sprints/vX-S*.md` → next SY = highest + 1.
2. Fill template with `stories: [US-XXXX, …]` (existing or planned US).
3. Save `docs/sprints/vX-SY.md`.
4. New US → `/create-us` after gates; then `/sync-board`.

## Output

```txt
Sprint created:
File: docs/sprints/vX-SY.md
Version:
Stories:
sprint file saved: yes | no
```
