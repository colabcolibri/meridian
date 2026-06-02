---
name: create-version
description: Creates a Meridian release file in docs/versions. Use when defining a new product version before user stories.
allowed-tools: Read, Glob, Grep, Bash, Edit, Write
---

# Create version (Meridian)

## Selective reading

| File | When to read |
| ------- | ---------- |
| `references/version-template.md` | When drafting `docs/versions/vX.md` |
| `docs/versions/` | Existing files (IDs) |
| `docs/00_scope.md` | Validate release scope |

## Preconditions

| Doc | Required status |
| --- | -------------- |
| `05_architecture.md` | `approved` |
| `00_scope.md` | `approved` or explicit in scope |
| `03_user_types.md` | `approved` |

Version = **product release** (go-live), not sprint or technical module.

## Procedure

1. List `docs/versions/v*.md` → next ID = highest number + 1 (`v3`, `v4`…).
2. Fill `references/version-template.md`.
3. Save `docs/versions/vX.md` (filename = `id`).
4. If relevant change → `update-decisions-log`.
5. Validate: `python .agent/scripts/validate_meridian.py <project-root>`.

## Validations

- Product-level measurable `outcome`
- `v0` only for technical foundation
- Version sprints → skill `create-sprint` in `docs/sprints/`

## Output

```txt
Version created:
File: docs/versions/vX.md
Outcome:
version file saved: yes | no
Open questions:
Next: create-sprint or /plan-sprint
```
