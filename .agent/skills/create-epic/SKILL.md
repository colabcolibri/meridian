---
name: create-epic
description: Creates a Meridian epic file in docs/epics after architecture is approved. Use when defining a new product capability block before user stories.
allowed-tools: Read, Glob, Grep, Bash, Edit, Write
---

# Create epic (Meridian)

## Selective reading

| File | When to read |
| ------- | ---------- |
| `.agent/references/templates/INDEX.md` | Before any epic create — confirm agent protocol |
| `.agent/references/templates/section-contracts.md` | Fixed `##` for epic — do not rename or omit |
| `references/epic-template.md` | **Mandatory** before drafting `docs/epics/EPIC-XX.md` — read full template, then Write |
| `docs/03_user_types.md` | Validate profiles in `profiles` |
| `docs/epics/` | Existing files (IDs, duplication) |
| `docs/versions/` | Validate `versions:` in frontmatter |

## Preconditions

| Doc | Required status |
| --- | -------------- |
| `05_architecture.md` | `approved` |
| `00_scope.md` | `approved` or explicit in scope |
| `03_user_types.md` | `approved` (epic profiles must exist here) |

Epics are **product capability**, not technical modules (`src/…`).

## What an epic contains (concept)

| Field | Where | Role |
| ----- | ---- | ----- |
| `id`, `title`, `status`, `versions`, `profiles` | frontmatter | Metadata for app and validation |
| `outcome` | frontmatter | Epic done at **product** level (not implementation) |
| Capability | body | What the user can now do |
| Out of scope for this epic | body | Boundaries — prevents scope creep |

User stories **reference** the epic (`epic: EPIC-XX` in US frontmatter). The US **does not** repeat description, outcome or epic scope.

## Procedure

1. Read `.agent/references/templates/INDEX.md` and **full** `references/epic-template.md`.
2. List `docs/epics/EPIC-*.md` → next ID = highest number + 1 (permanent IDs).
3. Fill template — copy structure from epic-template, do not invent sections.
3. Validate each `profiles` item against `03_user_types.md`.
4. Validate each `versions` item against files in `docs/versions/`.
5. Save `docs/epics/EPIC-XX.md` (filename = `id`).
6. If relevant change → `update-decisions-log`.

## Validations before saving

- Product-level measurable `outcome`
- **Structure:** `Capability`, `Expected outcome`, `Out of scope for this epic` (see `section-contracts.md`)
- `versions` reference releases in `docs/versions/` (when provided)
- Do not duplicate capability already covered by another epic
- Filename = `id` (`EPIC-07.md` → `id: EPIC-07`)

## Optional validation

```bash
python .agent/scripts/validate_meridian.py <project-root>
```

## Output

```txt
Epic created:
File: docs/epics/EPIC-XX.md
Outcome:
Versions:
Profiles:
epic file saved: yes | no
Open questions:
```
