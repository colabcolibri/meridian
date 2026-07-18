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
2. Build backlog in SQLite (`meridian_delivery.py` / `--write-form` for epics, versions, sprints).
3. Create US only after `05_architecture` approved and epic/version exist (SQLite or legacy folders).
4. Kit templates: `.agent/references/templates/INDEX.md` — do not create `docs/templates/`.
5. Validate delivery: `python3 .agent/scripts/validate_meridian.py . --sqlite-only`
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

## `04_principles.md` (initial draft)

Minimum sections — agents read this at refine and implement:

- **DRY** — where each type of logic lives (domain, features, UI, constants)
- **Single responsibility** — layer table (domain / feature / UI / app)
- **Definition of Done** — team-wide bar for closed US
- **Mandatory conventions** — lint, naming, tooling

Mark `status: draft` until human approves. Blocks `05_architecture.md`.

## `05_architecture.md` (initial draft)

Overview + gate document. Minimum sections:

- Objective
- System context (text or mermaid)
- Component boundaries and layers
- Integration points
- **Architecture detail files** — table indexing `docs/architecture/*.md` when used (see `architecture-folder-guide.md`)

Keep cross-cutting content here; move deep specs to `docs/architecture/` when a section would grow too large.

Optional at init: empty `docs/architecture/README.md` pointing to `architecture-folder-guide.md` in kit.

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

## Delivery database

After `docs/` exists, run `python3 .agent/scripts/bootstrap_meridian_db.py <packageRoot>`. Kanban reads `.meridian/meridian.db` — no `docs/kanban/board.json`.

## `docs/inventory/as-is.md` (Mode B only)

Transitional capability map for existing codebases. Read `.agent/references/templates/as-is-inventory-template.md` before Write. Archive after `05_architecture` is approved.
