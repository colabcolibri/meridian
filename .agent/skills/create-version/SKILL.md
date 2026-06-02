---
name: create-version
description: Creates a Meridian release file in docs/versions. Use when defining a new product version before user stories.
allowed-tools: Read, Glob, Grep, Bash, Edit, Write
---

# Create version (Meridian)

## Selective reading

| File | When to read |
| ------- | ---------- |
| `.agent/references/templates/INDEX.md` | Before any version create |
| `.agent/references/templates/section-contracts.md` | Fixed `##` for version — do not rename or omit |
| `references/version-template.md` | **Mandatory** before drafting `docs/versions/vX.md` |
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

1. Read `.agent/references/templates/INDEX.md` and **full** `references/version-template.md`.
2. List `docs/versions/v*.md` → next ID = highest number + 1 (`v3`, `v4`…).
3. Fill template — copy structure from version-template, do not invent sections.
3. Save `docs/versions/vX.md` (filename = `id`).
4. If relevant change → `update-decisions-log`.
5. Validate: `python .agent/scripts/validate_meridian.py <project-root>`.

## Validations

- Product-level measurable `outcome`
- **Structure:** `Objective`, `Done criteria`, `Included in this version`, `Explicitly out`, `Go-live checklist` (see `section-contracts.md`)
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
