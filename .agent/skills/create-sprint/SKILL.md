---
name: create-sprint
description: Creates a Meridian sprint in SQLite linked to a version. Use when planning execution slices within a release.
allowed-tools: Read, Glob, Grep, Bash, Edit, Write
---

# Create sprint (Meridian)

> **v11:** save to `.meridian/meridian.db` — read `sqlite-delivery-operations.md` before Write.

## Selective reading

| File | When to read |
| ------- | ---------- |
| `.agent/references/templates/sqlite-delivery-operations.md` | **Mandatory** |
| `.agent/references/templates/INDEX.md` | Before any sprint create |
| `references/sprint-template.md` | **Mandatory** before drafting |

## Preconditions

- Parent version exists in SQLite (`meridian_db_cli.py list versions`).
- Referenced version is `planned` or `active`.
- `05_architecture.md` `approved` before creating new US.

## CLI (v11)

```bash
python3 .agent/scripts/meridian_db_cli.py list versions
python3 .agent/scripts/meridian_db_cli.py list sprints --version vX
python3 .agent/scripts/meridian_db_cli.py create-sprint --version vX --title "..." --stories US-0001,US-0002
python3 .agent/scripts/meridian_db_export.py . --entity sprints --id vX-SY --write-form < form.json
```

## Procedure

1. Read `INDEX.md`, `sqlite-delivery-operations.md`, and **full** `sprint-template.md`.
2. List sprints for version (`meridian_db_cli.py list sprints --version vX`) → next SY = highest + 1.
3. Fill template with `stories: [US-XXXX, …]` (existing PKs only).
4. Upsert via `meridian_db_cli.py create-sprint` or `meridian_db_export.py --write-form`.
5. New US for this sprint → `/create-us` after gates (extension refreshes on DB write).

## Output

```txt
Sprint created:
Id: vX-SY
Version:
Stories:
saved: yes | no
```
