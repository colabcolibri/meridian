---
name: complete-user-story
description: Closes a Meridian user story in SQLite after implementation — fills Record, acceptance, status. Use when marking US done or after /implement-us.
allowed-tools: Read, Glob, Grep, Bash, Edit, Write
---

# Complete user story (Meridian)

> **v11:** persist with `update-us --from-file` — never `docs/us/*.md`.

## Selective reading

| File | When to read |
| ------- | ---------- |
| `.agent/references/templates/INDEX.md` | Before closing |
| `.agent/references/templates/section-contracts.md` | Section contract |
| `references/implementation-template.md` | **Mandatory** for `## Record` |
| `.agent/references/commit-after-us-close.md` | Suggested commit only |
| `../create-user-story/references/us-template.md` | Full structure |

## Delivery commands

```bash
python3 .agent/scripts/meridian_delivery.py show US-0115 --full
python3 .agent/scripts/meridian_delivery.py update-us US-0115 --from-file /tmp/us.md
python3 .agent/scripts/meridian_delivery.py set-summary US-0115 --text "4-8 sentence summary"
```

## Preconditions

| Check | Requirement |
| ----------- | --------- |
| US row | exists (`show US-XXXX`) |
| Dependencies | all `depends_on` at `✅` |
| Evidence | tests/build passed |
| Record | real paths, not placeholders |

## Procedure

1. Read templates + `show --full`.
2. Inspect `git diff` / test output.
3. Fill `## Record` per `implementation-template.md`.
4. Mark acceptance `[x]`; `tests_status: done` when required.
5. `update-us --from-file`; `set-summary` when closing.
6. `prepend-decision` only for cross-cutting changes.

## Output

```txt
US completed:
ID: US-XXXX
Status:
Implementation summary:
Files touched:
Decisions logged: yes | no
Suggested commit:
Next (human): commit per commit-after-us-close.md
```
