---
title: Database
status: approved
version: 3.3
updated: 2026-07-22
depends_on: [03_user_types.md, 05_architecture.md]
blocks: [07_api_contracts.md]
---

# 06 — Database

## Strategy

Meridian **v10+** stores **all delivery artifacts** in SQLite only. **Phase documents** (`00`–`11`, discovery, architecture detail, inventory, templates) remain Markdown — project gates and agent init context.

| Storage | Artifacts |
| ------- | --------- |
| **Markdown** (`docs/`) | `00_scope.md` … `11_decisions.md`, `discovery/`, `architecture/`, `inventory/` |
| **SQLite** (`.meridian/meridian.db`) | epics, versions, sprints, user stories, sprint_stories, story_dependencies, decisions, board_snapshots |

Path: `{packageRoot}/.meridian/meridian.db` (gitignored). Canonical SQL: `.agent/migrations/`. Agent upsert guide: `.agent/references/templates/sqlite-delivery-operations.md`. Section contract (markdown shape): `.agent/references/templates/section-contracts.md`.

## Dual storage — markdown + columns

Every delivery row (epic, version, sprint, user story) uses **two layers**:

| Layer | Column(s) | Purpose |
| ----- | --------- | ------- |
| **Canonical file** | `body_markdown` | Full Meridian markdown — frontmatter `---` + all `##` / `###` sections. Round-trip for display, export, extension click-to-open, validator. |
| **Parsed sections** | one TEXT column per `###` | Denormalized at upsert time by `meridian_markdown_parse.py` — query/search without re-parsing. |
| **Digest** | `summary` | 4–8 sentences after close; agents read before full body. |
| **Frontmatter** | dedicated columns | e.g. `epic_id`, `version_id`, `sprint_id`, `status`, `ready`, `depends_on_json` |

```txt
Agent writes full US markdown — OR patch-record on close
        │
        ├─► update-us  ──► replaces entire body_markdown (must send full doc from show --full)
        │
        └─► patch-record ──► merges ## Record + optional Acceptance + frontmatter (Intent/Plan preserved)
        │
        ▼
meridian_delivery.py … US-XXXX
        │
        ├─► body_markdown          (entire file — source for display)
        ├─► record_files, …        (each ### under ## Record → own column)
        ├─► intent_why, plan_approach, …
        └─► epic_id, sprint_id, status, ready, …
```

**Write rule:** `update-us` requires **complete markdown** (load with `show --full` first). **`patch-record`** is preferred on `/complete-us` — merges Record without wiping Intent/Plan. CLI rejects `status: ✅` with batch-close boilerplate. Never helper `.py` scripts for delivery.

**Read rule:** `show US-XXXX` (summary) → `show US-XXXX --full` (`body_markdown`). Validator and extension use virtual markdown from `body_markdown`, not isolated columns.

**Close rule (`/complete-us`):** `show --full` → `patch-record` with filled `## Record` per `implementation-template.md`; Plan/Approach unchanged unless scope changed deliberately.

## Schema — entity-relationship diagram

Foreign keys enforced (`PRAGMA foreign_keys = ON`). WAL journal mode for concurrent reads.

```mermaid
erDiagram
  versions ||--o{ user_stories : "version_id"
  epics ||--o{ user_stories : "epic_id"
  versions ||--o{ sprints : "version_id"
  sprints ||--o{ user_stories : "sprint_id SET NULL"
  sprints ||--o{ sprint_stories : "sprint_id CASCADE"
  user_stories ||--o{ sprint_stories : "story_id CASCADE"
  user_stories ||--o{ story_dependencies : "story_id CASCADE"
  user_stories ||--o{ story_dependencies : "depends_on_id CASCADE"

  versions {
    text id PK
    text title
    text status
    text outcome
    text objective
    text summary
    text body_markdown
  }

  epics {
    text id PK
    text title
    text status
    text outcome
    text versions
    text summary
    text body_markdown
  }

  user_stories {
    text id PK
    text epic_id FK
    text version_id FK
    text sprint_id FK
    int sprint_position
    text status
    text moscow
    text depends_on_json
    int ready
    text done_when
    text summary
    text intent_acceptance
    text intent_why
    text intent_where
    text plan_approach
    text plan_planned
    text record_files
    text record_backend
    text record_frontend
    text record_scripts
    text record_executed
    text boundaries_out_of_scope
    text body_markdown
  }

  sprints {
    text id PK
    text version_id FK
    text status
    text stories_json
    text summary
    text body_markdown
  }

  sprint_stories {
    text sprint_id PK_FK
    text story_id UK_FK
    int position
  }

  story_dependencies {
    text story_id PK_FK
    text depends_on_id PK_FK
    int position
  }

  decisions {
    int id PK
    text decision_date
    int entry_index
    text title
    text payload_json
  }

  board_snapshots {
    int id PK
    text source
    int card_count
    text payload_json
  }

  schema_migrations {
    int id PK
    text name UK
    text applied_at
  }
```

### Sprint assignment (US-centric)

| Layer | Role |
| ----- | ---- |
| **Canonical** | `user_stories.sprint_id` (+ optional frontmatter `sprint: vX-SY` on upsert) |
| **Order in sprint** | `user_stories.sprint_position` |
| **Derived cache** | `sprint_stories` + `sprints.stories_json` — rebuilt on every US or sprint upsert |

**Rules:**

- At most **one** sprint per US (`UNIQUE` index on `sprint_stories.story_id`).
- US may exist **without** sprint (product backlog) until `/plan-sprint` or `sprint:` is set.
- `ready: true`, `set-ready`, and `/implement-us` require sprint `planned` or `active` on the **same** `version_id` as the US.
- Writing sprint `stories:` still works: `upsert_sprint` sets `sprint_id` on each listed US, then rebuilds the cache.

**Bootstrap / upgrade harness:** `bootstrap_meridian_db.py` applies migrations then `reconcile_sprint_links()` — backfills `sprint_id` from legacy `sprint_stories` or `stories_json`, dedupes duplicate assignments, rebuilds caches.

### Insert order (FK-safe)

```txt
1. versions          (no FK)
2. epics             (no FK; versions field is text JSON list, not FK)
3. user_stories      → epic_id, version_id (sprint_id optional until assigned)
4. sprints           → version_id
5. sprint_stories    → derived cache (rebuilt from user_stories.sprint_id or sprint `stories:` upsert)
6. story_dependencies → story_id, depends_on_id (rebuilt by upsert_user_story; validates US PKs)
7. decisions         (independent)
8. board_snapshots   (audit JSON on upsert — `record_board_snapshot()`)
```

Breaking order causes `FOREIGN KEY constraint failed` — use `meridian_db.py` upsert helpers or `meridian_delivery.py`, not ad-hoc SQL.

## Tables — column contract

Migrations:

| File | Adds |
| ---- | ---- |
| `20260718100000_initial_delivery_schema.sql` | All tables below + indexes |
| `20260718110000_summary_columns.sql` | `summary TEXT` on versions, epics, sprints, user_stories |
| `20260718120000_story_dependencies.sql` | `story_dependencies` junction + backfill from `depends_on_json` |
| `20260722120000_user_story_sprint.sql` | `user_stories.sprint_id`, `sprint_position`; reconcile on bootstrap |
| `20260903115657_user_story_in_progress.sql` | `user_stories.in_progress` (Doing column; not a new `status`) |

### `versions`

| Column | Type | Notes |
| ------ | ---- | ----- |
| `id` | TEXT PK | e.g. `v10`, `v2.05` |
| `title`, `status`, `outcome` | TEXT | frontmatter + narrative |
| `objective`, `done_criteria`, `included`, `explicitly_out`, `go_live` | TEXT | parsed sections |
| `summary` | TEXT | progressive disclosure (v10) |
| `body_markdown` | TEXT | full file round-trip |

### `epics`

| Column | Type | Notes |
| ------ | ---- | ----- |
| `id` | TEXT PK | `EPIC-XX` |
| `title`, `status`, `outcome` | TEXT | frontmatter |
| `profiles`, `versions` | TEXT | YAML-list as string (not FK) |
| `capability`, `expected_outcome`, `out_of_scope`, `notes` | TEXT | parsed `##` sections |
| `summary`, `body_markdown` | TEXT | digest + full file |

### `user_stories`

Frontmatter maps to columns (`epic` → `epic_id`, `version` → `version_id`, `sprint` → `sprint_id`, `depends_on` → `depends_on_json` + `story_dependencies`).

| Column | Type | Notes |
| ------ | ---- | ----- |
| `id` | TEXT PK | `US-XXXX` |
| `title` | TEXT | from frontmatter |
| `epic_id` | TEXT FK → `epics.id` | required |
| `version_id` | TEXT FK → `versions.id` | required |
| `sprint_id` | TEXT FK → `sprints.id` ON DELETE SET NULL | optional at create; required for `ready: true` / implement |
| `sprint_position` | INTEGER | order within sprint; synced with `sprint_stories.position` |
| `status`, `moscow`, `ready`, `in_progress`, `done_when`, `tests`, `tests_status` | | frontmatter / CLI; **`ready`** splits 📋 Backlog vs 📌 Todo; **`in_progress`** is 🔨 Doing when `status` is ❌ or 🔶 |
| `depends_on_json` | TEXT | denormalized JSON array; synced with `story_dependencies` |
| `summary` | TEXT | read first; 4–8 sentences after `/complete-us` |
| `body_markdown` | TEXT | **full US file** — canonical round-trip |
| `created_at`, `updated_at` | TEXT | auto |

#### Section columns — each `###` → one column

Filled on `update-us` by `meridian_markdown_parse.extract_us_sections()`.

| Parent `##` | Markdown `###` | Column |
| ----------- | ---------------- | ------ |
| Intent | Acceptance | `intent_acceptance` |
| Intent | Why | `intent_why` |
| Intent | Where | `intent_where` |
| Plan | Approach | `plan_approach` |
| Plan | Architecture refs | `plan_architecture_refs` |
| Plan | API / DB impact | `plan_api_db` |
| Plan | Security notes | `plan_security` |
| Plan | Related decisions | `plan_decisions` |
| Plan | Planned | `plan_planned` |
| **Record** | **Files** | `record_files` |
| **Record** | **Backend** | `record_backend` |
| **Record** | **Frontend** | `record_frontend` |
| **Record** | **Scripts / Docs** | `record_scripts` |
| **Record** | **Executed** | `record_executed` |
| Boundaries | Out of scope for this story | `boundaries_out_of_scope` |
| Boundaries | Notes | `boundaries_notes` |

On status `✅`, validator rejects placeholder `## Record` in `body_markdown`. Closed US must have real `record_files` and `record_executed` content.

```bash
sqlite3 .meridian/meridian.db "
  SELECT id, substr(record_files,1,80), substr(record_executed,1,80)
  FROM user_stories WHERE id='US-0001';
"
```

Indexes: `idx_user_stories_epic`, `idx_user_stories_version`, `idx_user_stories_sprint`.

### `story_dependencies`

| Column | Type | Notes |
| ------ | ---- | ----- |
| `story_id` | TEXT PK FK → `user_stories.id` | dependent story |
| `depends_on_id` | TEXT PK FK → `user_stories.id` | prerequisite US PK (`US-XXXX`) |
| `position` | INTEGER | order in frontmatter list |

Rebuilt on every `upsert_user_story`. Validates: PK format, target exists, no self-reference, no cycles. `/implement-us` requires each dependency `status: ✅`.

```bash
sqlite3 .meridian/meridian.db "
  SELECT sd.story_id, sd.depends_on_id, us.status
  FROM story_dependencies sd
  JOIN user_stories us ON us.id = sd.depends_on_id
  WHERE sd.story_id = 'US-0128';
"
```

### `sprints`

| Column | Type | Notes |
| ------ | ---- | ----- |
| `id` | TEXT PK | e.g. `v10-S1` |
| `version_id` | TEXT FK → `versions.id` | required |
| `stories_json` | TEXT | JSON array; mirror of US ids with `sprint_id` on this sprint (derived cache) |
| `goal`, `done_when`, `goal_body`, `scope_table`, … | TEXT | |
| `summary`, `body_markdown` | TEXT | |

Index: `idx_sprints_version`.

### `sprint_stories` (derived cache)

| Column | Type | Notes |
| ------ | ---- | ----- |
| `sprint_id` | TEXT FK → `sprints.id` ON DELETE CASCADE | |
| `story_id` | TEXT FK → `user_stories.id` ON DELETE CASCADE | **UNIQUE** — at most one sprint per US |
| `position` | INTEGER | sprint priority order |

Composite PK `(sprint_id, story_id)`. Rebuilt from `user_stories` where `sprint_id` matches. Not every US appears here — only US assigned to a sprint.

```bash
sqlite3 .meridian/meridian.db "
  SELECT id, sprint_id, sprint_position, ready
  FROM user_stories WHERE version_id='v10' ORDER BY sprint_id, sprint_position;
"
```

### `decisions`

| Column | Type | Notes |
| ------ | ---- | ----- |
| `decision_date` | TEXT | `YYYY-MM-DD` |
| `entry_index` | INTEGER | order within day |
| `payload_json` | TEXT | full decision entry JSON |
| UNIQUE | `(decision_date, entry_index)` | |

### `board_snapshots`

Append-only kanban card payloads (`source`: `import` | `upsert`). v11 no longer writes `docs/kanban/board.json`. Column layout in the Board webview is **derived** at read time (`status` + `ready` + tests) — not stored as a column id.

### `schema_migrations`

Applied migration filenames — bootstrap skips already-applied SQL files.

## Dogfood reference counts (v10 cutover)

Illustrative after migration + purge on this repo (local DB, not in git):

| Table | Count |
| ----- | ----- |
| `versions` | 16 |
| `epics` | 15 |
| `sprints` | 44 |
| `user_stories` | 125 |
| `sprint_stories` | 96 |
| `decisions` | 63 |

Verify live: `python3 .agent/scripts/meridian_delivery.py counts .`

Note: US numbering skips `US-0096` (never existed in v1 tree).

## Integrity checks

```bash
# row counts
python3 .agent/scripts/meridian_delivery.py counts .

# FK orphans (should print nothing)
sqlite3 .meridian/meridian.db "
  SELECT 'orphan epic' WHERE EXISTS (
    SELECT 1 FROM user_stories WHERE epic_id NOT IN (SELECT id FROM epics));
  SELECT id, epic_id FROM user_stories WHERE epic_id NOT IN (SELECT id FROM epics);
"

# sprint junction vs stories_json (kit verify script)
python3 .agent/scripts/validate_meridian.py . --sqlite-only
```

## Extension and export

| Consumer | Mechanism | Data |
| -------- | --------- | ---- |
| Board / planning lists | `meridian_db_export.py --format planning` | Structured JSON; each `userStory` includes `sprint` (nullable) |
| Click-to-open artifact | `meridian_db_export.py --entity us --id US-XXXX` | Single `body_markdown` row |
| Structured edit (form) | `meridian_db_export.py --format form` / `--write-form` | JSON fields → build markdown → validate → upsert |
| Board audit | `record_board_snapshot()` on upsert | Optional history in `board_snapshots` |

Extension: **View** = HTML preview; **Edit** = schema-driven form (all entity types); **Advanced** = raw markdown with confirm.

## Summary column (progressive disclosure)

| Table | `summary` purpose |
| ----- | ----------------- |
| `user_stories` | 4–8 sentences after `/complete-us`; agents read before `body_markdown` |
| `epics`, `versions`, `sprints` | One-paragraph digest |

Workflow: `meridian_delivery.py list` → `show ID` (summary) → `show ID --full` only when implementing.

## CLI — discover and write

```bash
python3 .agent/scripts/bootstrap_meridian_db.py .
python3 .agent/scripts/meridian_delivery.py counts .
python3 .agent/scripts/meridian_delivery.py list user_stories --version v10
python3 .agent/scripts/meridian_delivery.py show US-0115
python3 .agent/scripts/meridian_delivery.py show US-0115 --full
python3 .agent/scripts/meridian_delivery.py search "parity"
python3 .agent/scripts/meridian_delivery.py create-us --title "..." --epic EPIC-15 --version v10
python3 .agent/scripts/meridian_delivery.py update-us US-0115 <<'EOF'
---
id: US-0115
...
---
# US body
EOF
python3 .agent/scripts/meridian_delivery.py set-ready US-0115
python3 .agent/scripts/meridian_delivery.py set-summary US-0115 --text "..."
python3 .agent/scripts/meridian_delivery.py prepend-decision \
  --date "$(date +"%Y-%m-%d")" --time "$(date +"%H:%M")" \
  --title "..." --affected-document "docs/05_architecture.md" \
  --what-changed "..." --why-changed "..." --impact "..." --responsible "..."
```

Never `Write` on `docs/us/`, `docs/epics/`, `docs/versions/`, `docs/sprints/`, or `docs/decisions/*.json` when `meridian.db` exists. Use `prepend-decision` for the decision log.

## Migration and cutover

```bash
python3 .agent/scripts/migrate_md_to_sqlite.py .      # legacy import (from meridian-v1-old branch)
python3 .agent/scripts/verify_md_sqlite_parity.py .   # gate — exit 0 required
python3 .agent/scripts/backfill_summaries.py .
python3 .agent/scripts/purge_delivery_md.py . --dry-run
python3 .agent/scripts/purge_delivery_md.py . --require-verify
python3 .agent/scripts/validate_meridian.py . --sqlite-only
```

Fresh clone: `bootstrap` creates empty schema; import data via `migrate_md_to_sqlite` from legacy branch or restore a DB backup.

## Validation modes

| Flag | Behavior |
| ---- | -------- |
| _(default)_ | DB when `meridian.db` exists; phase docs on disk |
| `--md-only` | Legacy markdown delivery folders |
| `--sqlite-only` | Fails if delivery `.md`/`.json` still present |

## Kit modules

| Script | Role |
| ------ | ---- |
| `meridian_db.py` | `connect`, `upsert_*`, `reconcile_sprint_links`, `export_planning_json`, migrations |
| `meridian_delivery.py` | Human/agent query and write CLI |
| `meridian_db_export.py` | JSON for extension (`--format planning`; `--format form`; `--write-form`) |
| `meridian_delivery_form.py` | Build markdown from form fields; validate before upsert |
| `verify_md_sqlite_parity.py` | Pre-purge gate |
| `purge_delivery_md.py` | Remove legacy delivery files |
| `backfill_summaries.py` | Populate `summary` column |

Migrations: `.agent/migrations/YYYYMMDDHHMMSS_*.sql`
