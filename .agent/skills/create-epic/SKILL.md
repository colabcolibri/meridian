---
name: create-epic
description: Creates a Meridian epic in SQLite after architecture is approved. Use when defining a new product capability block before user stories.
allowed-tools: Read, Glob, Grep, Bash, Edit, Write
---

# Create epic (Meridian)

> **v11:** save to `.meridian/meridian.db` — read `.agent/references/templates/sqlite-delivery-operations.md` before Write. Do **not** create `docs/epics/*.md` when the DB exists.

## Selective reading

| File | When to read |
| ------- | ---------- |
| `.agent/references/templates/sqlite-delivery-operations.md` | **Mandatory** — upsert path |
| `.agent/references/templates/writing-guide.md` | **Mandatory** — epic prose + golden example |
| `.agent/references/scrum-meridian-map.md` | Epic lifecycle (new epic vs reopen) |
| `references/epic-template.md` | **Mandatory** — body shape before Write |
| `docs/03_user_types.md` | Validate `profiles` |

## Preconditions

| Doc | Required status |
| --- | -------------- |
| `05_architecture.md` | `approved` |
| `00_scope.md` | in scope |
| `03_user_types.md` | `approved` |

Epic = **product capability**, not a folder in `src/`.

## Writing rules (mandatory)

| Section | Rule |
| ------- | ---- |
| **Capability** | ≥ 2 paragraphs: (1) user problem today (2) product behavior after epic |
| **Expected outcome** | 1 paragraph — observable “done” for manager/user |
| **Out of scope** | Bullets with **why** each item is excluded |
| **outcome** (frontmatter) | One sentence summary — body expands, not repeats |

Forbidden: feature bullet list without problem narrative; module names as capability.

## CLI (v11)

```bash
python3 .agent/scripts/meridian_db_cli.py list epics
python3 .agent/scripts/meridian_db_cli.py list versions
python3 .agent/scripts/meridian_db_cli.py create-epic --title "..." --versions "[vX]"
python3 .agent/scripts/meridian_db_export.py . --entity epics --id EPIC-XX --write-form < form.json
```

## Procedure

1. Read `sqlite-delivery-operations.md` + `writing-guide.md` + `epic-template.md`.
2. Next ID = max `EPIC-XX` + 1 (`meridian_db_cli.py list epics`).
3. Compose epic markdown per template.
4. Validate `profiles` vs `03_user_types.md`; `versions` vs existing SQLite versions.
5. Upsert via `meridian_db_cli.py create-epic --title "..." --versions "[vX]"` or `meridian_db_export.py . --entity epics --id EPIC-XX --write-form`.
6. `update-decisions-log` if boundaries change.

## Output

```txt
Epic created:
Id: EPIC-XX
Outcome:
Versions:
Profiles:
Narrative complete: yes | no
Open questions:
Next: /create-us for slices
```
