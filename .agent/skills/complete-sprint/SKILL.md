---
name: complete-sprint
description: Closes a Meridian sprint after sprint review — fills Retrospective, sets status complete, logs decisions. Use with /complete-sprint vX-SY.
allowed-tools: Read, Glob, Grep, Bash, Edit, Write
---

# Complete sprint (Meridian)

> **v11:** sprint lives in SQLite — update via `meridian_db_export.py --write-form` or equivalent upsert.

## Selective reading

| File | When to read |
| ------- | ---------- |
| `../create-sprint/references/sprint-template.md` | **Mandatory** — close rules + Retrospective |
| Target sprint | `meridian_db_cli.py show vX-SY --full` |
| Listed US ids | `meridian_db_cli.py show US-XXXX` for each story in sprint |
| `../update-decisions-log/SKILL.md` | When logging decisions from retrospective |

## Preconditions

| Check | Requirement |
| ----------- | --------- |
| Sprint row | exists in SQLite |
| Sprint review | Manager confirmed increment (human gate) |
| Retrospective | Must be filled before `status: complete` |

## CLI (v11)

```bash
python3 .agent/scripts/meridian_db_cli.py show vX-SY --full
python3 .agent/scripts/meridian_db_cli.py show US-XXXX          # each story in sprint scope
python3 .agent/scripts/meridian_db_export.py . --entity sprints --id vX-SY --write-form < form.json
python3 .agent/scripts/validate_meridian.py . --sqlite-only
```

## Procedure

1. Read sprint template + `show vX-SY --full`.
2. For each US in sprint scope, read `status` from SQLite.
3. Summarize delivery vs sprint `goal` and `done_when`.
4. Fill `## Retrospective` in body markdown.
5. Set `status: complete` via upsert.
6. If retrospective warrants → `update-decisions-log` (**read skill + run `date`**).
7. `validate_meridian.py . --sqlite-only` when available.

## Output

```txt
Sprint completed:
Id: vX-SY
Status: complete
SQLite saved: yes | no
US delivered: N ✅ / N 🔶 / N ❌
Retrospective filled: yes | no
Decisions logged: yes | no
Deferred US:
Next: /plan-sprint | /create-us
```
