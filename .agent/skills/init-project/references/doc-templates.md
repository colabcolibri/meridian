# Meridian document templates

Required frontmatter on every phase doc:

```yaml
---
title: Document name
status: draft
version: 1.0
updated: YYYY-MM-DD
depends_on: []
blocks: []
---
```

## `docs/README.md` (human entry point)

```markdown
# Project name

Brief description.

## Phase documents

| Doc | Status | Description |
| --- | ------ | --------- |
| 00_scope | draft | Scope |
| ... | ... | ... |

## How to work

1. Approve docs in dependency order: foundation → principles → architecture → detail.
2. Build backlog in `docs/epics/`, `docs/versions/` and `docs/sprints/`.
3. Create US only after `05_architecture` approved and epic/version in folders.
4. Human templates mirror: `docs/templates/README.md` (symlinks to kit).
5. Regenerate board after US changes.
```

## `00_scope.md` (initial draft)

Minimum sections:

- Problem
- Users
- In scope
- Out of scope
- Assumptions
- Constraints
- Known risks
- Open questions

## `11_decisions.md` + `docs/decisions/` (first entry)

Create stub `11_decisions.md` (rules) and folder `docs/decisions/`.
On first day, create `docs/decisions/YYYY-MM-DD.json`:

```json
{
  "date": "YYYY-MM-DD",
  "entries": [
    {
      "time": "HH:MM",
      "title": "Project started with Meridian",
      "affected_document": "docs/",
      "what_changed": "Meridian structure created.",
      "why_changed": "Project start with document governance.",
      "impact": "All phase docs in draft.",
      "responsible": "[manager]"
    }
  ]
}
```

## `docs/kanban/board.json`

```json
[]
```
