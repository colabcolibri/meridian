---
name: create-version
description: Creates a Meridian release in SQLite. Use when defining a new product version before user stories.
allowed-tools: Read, Glob, Grep, Bash, Edit, Write
---

# Create version (Meridian)

> **v11:** save to `.meridian/meridian.db` — read `sqlite-delivery-operations.md` before Write. Do **not** create `docs/versions/*.md` when the DB exists.

## Selective reading

| File | When to read |
| ------- | ---------- |
| `.agent/references/templates/sqlite-delivery-operations.md` | **Mandatory** |
| `.agent/references/templates/writing-guide.md` | Release prose example |
| `references/version-template.md` | **Mandatory** before Write |
| `docs/00_scope.md` | IDs and scope |

## Preconditions

| Doc | Required status |
| --- | -------------- |
| `05_architecture.md` | `approved` |
| `00_scope.md`, `03_user_types.md` | aligned with release |

## Delivery commands

```bash
python3 .agent/scripts/meridian_delivery.py list versions
python3 .agent/scripts/meridian_delivery.py create-version --id vX --title "..."
python3 .agent/scripts/meridian_db_export.py . --entity versions --id vX --write-form < form.json
python3 .agent/scripts/validate_meridian.py . --sqlite-only
```

## Procedure

1. Read `sqlite-delivery-operations.md` + `writing-guide.md` + `version-template.md`.
2. Next `vX` id (`meridian_delivery.py list versions`).
3. Compose version markdown per template.
4. Upsert via `meridian_delivery.py create-version --id vX --title "..."` or `meridian_db_export.py . --entity versions --id vX --write-form`.
5. `update-decisions-log` if boundaries change.
6. `validate_meridian.py . --sqlite-only`

## Output

```txt
Version created:
Id: vX
Outcome:
Narrative complete: yes | no
Next: /plan-sprint → /create-us
```
