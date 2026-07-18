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
2. Build backlog via slash commands (`/create-epic`, `/create-version`, `/plan-sprint`, `/create-us`) — delivery lives in `.meridian/meridian.db`, not `docs/us/`.
3. Create US only after `05_architecture` approved and epic/version exist in SQLite.
4. Artifact templates for agents: `.agent/references/templates/INDEX.md` (do not copy into `docs/templates/` — removed in v11).
5. Board refreshes automatically when `meridian.db` changes (extension + `record_board_snapshot` audit).
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

## `09_design_system.md` (UI products only)

When the product has UI surfaces (see `init-project` skill step 5), create from `.agent/skills/init-project/references/09-design-system-stub.md`. Mark `status: draft`. Run `/design-pass bootstrap` after `01_tech_stack.md` is filled.

Skip entirely for CLI-only or headless backends.

## `11_decisions.md` + first decision (SQLite)

Create stub `11_decisions.md` (rules). After `meridian_delivery.py bootstrap`, prepend the first entry:

```bash
python3 .agent/scripts/meridian_delivery.py prepend-decision \
  --date "$(date +"%Y-%m-%d")" \
  --time "$(date +"%H:%M")" \
  --title "Project started with Meridian" \
  --affected-document "docs/" \
  --what-changed "Meridian structure created." \
  --why-changed "Project start with document governance." \
  --impact "All phase docs in draft." \
  --responsible "[manager]"
```

Do **not** create `docs/decisions/`, `docs/kanban/`, or delivery markdown folders when SQLite delivery is active.

## `docs/inventory/as-is.md` (Mode B only)

Transitional capability map for existing codebases. Read `.agent/references/templates/as-is-inventory-template.md` before Write. Archive after `05_architecture` is approved.
