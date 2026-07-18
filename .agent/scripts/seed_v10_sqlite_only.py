#!/usr/bin/env python3
"""Seed v10 planning artifacts into SQLite (EPIC-15, v10, sprints, US-0115–0124)."""

from __future__ import annotations

import json
import sys
from pathlib import Path

_SCRIPT_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(_SCRIPT_DIR))

from meridian_db import (  # noqa: E402
    bootstrap,
    connect,
    upsert_epic,
    upsert_sprint,
    upsert_user_story,
    upsert_version,
    write_board_json,
)
from meridian_markdown_parse import (  # noqa: E402
    extract_epic_sections,
    extract_sprint_sections,
    extract_us_sections,
    extract_version_sections,
    parse_depends_on,
)

ROOT = Path(__file__).resolve().parents[2]


def _fm_block(data: dict[str, str]) -> str:
    lines = ["---"]
    for key, value in data.items():
        lines.append(f"{key}: {value}")
    lines.append("---")
    return "\n".join(lines)


def _full_doc(fm: dict[str, str], body: str) -> str:
    return f"{_fm_block(fm)}\n\n{body}"


EPIC_15_FM = {
    "id": "EPIC-15",
    "title": "SQLite-only delivery + progressive summaries",
    "status": "active",
    "versions": "[v10]",
    "profiles": "[Process Manager, Future VSCode User]",
    "outcome": "Delivery artifacts live only in SQLite; agents read summaries first; legacy .md purged after verified migration.",
}

EPIC_15_BODY = """# EPIC-15 — SQLite-only delivery + progressive summaries

## Capability

Meridian v9 introduced SQLite alongside legacy Markdown delivery files. That dual mode creates drift: agents and humans cannot tell which source is canonical, validators accept either path, and every planning session loads hundreds of `.md` files into context even when only a one-line status check was needed.

This epic completes the cutover: **delivery artifacts exist only in `.meridian/meridian.db`**. Phase documents (`00`–`11`, discovery, architecture detail) stay Markdown. Each epic, version, sprint, and user story gains a **summary** field — a dense paragraph written at close (or backfilled at migration) so AI workflows read summaries first and fetch full `body_markdown` only when refining or implementing.

## Expected outcome

A Process Manager runs `verify_md_sqlite_parity.py .` and gets a green report, runs `purge_delivery_md.py . --require-verify`, and `docs/us/`, `docs/epics/`, `docs/versions/`, `docs/sprints/`, and `docs/decisions/` no longer contain delivery files. `/create-us` never writes `.md`. `/complete-us` stores a summary. Agents query with `meridian_db_cli list|show|search` before opening full bodies.

## Out of scope for this epic

- Replacing phase docs with database rows — gates stay Markdown.
- Cloud sync or multi-user SQLite replication (v8 vision).
- Automatic summary generation by LLM at runtime without manager review on close.

## Notes

- Builds on EPIC-14 schema and migration scripts from v9.
- VS Code extension must read SQLite export after kit CLI lands (US-0121).
"""

V10_FM = {
    "id": "v10",
    "title": "SQLite-only delivery + summary pipeline",
    "status": "planned",
    "outcome": "No delivery .md on disk; summaries enable progressive disclosure for agents; verified migration and purge on dogfood.",
}

V10_BODY = """# v10 — SQLite-only delivery + summary pipeline

## Objective

v10 finishes what v9 started: SQLite becomes the **only** store for epics, versions, sprints, user stories, and decision log entries. The kit gains query CLI (`list`, `show`, `search`), migration verification, and a safe purge command. Every closed artifact exposes a **summary** so agents list summaries first and load full bodies on demand — reducing token waste and wrong-file reads.

## Done criteria

v10 is `complete` when: (1) `summary` columns exist and backfill ran on dogfood; (2) `verify_md_sqlite_parity.py .` reports zero mismatches; (3) `purge_delivery_md.py . --require-verify` removed delivery `.md` and `validate_meridian.py .` still passes; (4) kit create/refine/complete never writes delivery `.md`; (5) protocol docs describe SQLite-only workflow and CLI commands; (6) extension reads delivery from SQLite export.

## Included in this version

- EPIC-15 — SQLite-only delivery + progressive summaries.
- US-0115 — Summary columns schema migration.
- US-0116 — meridian_db_cli query commands (list, show, search, counts).
- US-0117 — verify_md_sqlite_parity.py migration verification.
- US-0118 — Summary backfill and complete-us summary generation.
- US-0119 — Kit skills SQLite-only write path (no delivery .md).
- US-0120 — Validator --sqlite-only mode rejects delivery .md files.
- US-0121 — VS Code extension reads delivery from SQLite.
- US-0122 — Protocol documentation for SQLite-only + CLI reference.
- US-0123 — purge_delivery_md.py with dry-run and --require-verify.
- US-0124 — Dogfood cutover: verify, purge, validate end-to-end.

## Explicitly out

- Removing phase doc Markdown (`00`–`11`).
- LLM auto-summary without manager-approved close record.
- PostgreSQL or hosted database.

## Go-live checklist

### Product

- [ ] Parity report green on dogfood (US-0117).
- [ ] Delivery `.md` purged; DB-only create/refine/complete (US-0119, US-0123, US-0124).

### Quality

- [ ] `validate_meridian.py .` passes post-purge (US-0120, US-0124).
- [ ] Extension board loads from SQLite (US-0121).

### Documentation

- [ ] `06_database.md` and `05_architecture.md` updated (US-0122).
- [ ] Skills/workflows reference CLI commands (US-0122).

## Sprints

- `v10-S1` — Schema + query CLI (US-0115, US-0116)
- `v10-S2` — Verify migration + summaries (US-0117, US-0118)
- `v10-S3` — Kit protocol + validator + extension (US-0119, US-0120, US-0121)
- `v10-S4` — Docs, purge, dogfood cutover (US-0122, US-0123, US-0124)
"""

SPRINTS = [
    {
        "fm": {
            "id": "v10-S1",
            "version": "v10",
            "title": "Schema and query CLI",
            "status": "planned",
            "goal": "Add summary columns and meridian_db_cli commands so agents can inspect SQLite without raw SQL.",
            "done_when": "US-0115 and US-0116 are ✅; manager can list and show stories via CLI.",
            "stories": "[US-0115, US-0116]",
        },
        "body": """# v10-S1 — Schema and query CLI

## Goal

Establish the database shape for summaries and give agents a documented CLI to discover what exists in SQLite before loading full bodies.

## Scope

| US      | Status | MoSCoW | Depends on | Epic    | Description |
| ------- | ------ | ------ | ---------- | ------- | ----------- |
| US-0115 | ❌     | Must   | —          | EPIC-15 | Summary columns schema migration |
| US-0116 | ❌     | Must   | —          | EPIC-15 | meridian_db_cli list/show/search |

## Out of scope for this sprint

- Purging legacy `.md` files (v10-S4).
- Extension changes (v10-S3).

## Retrospective

_(fill at sprint close)_
""",
        "stories": ["US-0115", "US-0116"],
    },
    {
        "fm": {
            "id": "v10-S2",
            "version": "v10",
            "title": "Verify migration and summaries",
            "status": "planned",
            "goal": "Prove Markdown and SQLite match; backfill summaries for progressive disclosure.",
            "done_when": "US-0117 and US-0118 are ✅; parity report exits 0 on dogfood.",
            "stories": "[US-0117, US-0118]",
        },
        "body": """# v10-S2 — Verify migration and summaries

## Goal

Before deleting any `.md`, produce an auditable parity report and populate summary fields so agents can work summary-first immediately after cutover.

## Scope

| US      | Status | MoSCoW | Depends on | Epic    | Description |
| ------- | ------ | ------ | ---------- | ------- | ----------- |
| US-0117 | ❌     | Must   | —          | EPIC-15 | verify_md_sqlite_parity.py |
| US-0118 | ❌     | Must   | US-0115    | EPIC-15 | Summary backfill + complete-us |

## Out of scope for this sprint

- Purge command (v10-S4).
- SQLite-only validator flag (v10-S3).

## Retrospective

_(fill at sprint close)_
""",
        "stories": ["US-0117", "US-0118"],
    },
    {
        "fm": {
            "id": "v10-S3",
            "version": "v10",
            "title": "Kit protocol, validator, extension",
            "status": "planned",
            "goal": "Kit writes only to SQLite; validator rejects delivery .md; extension reads DB.",
            "done_when": "US-0119, US-0120, US-0121 are ✅.",
            "stories": "[US-0119, US-0120, US-0121]",
        },
        "body": """# v10-S3 — Kit protocol, validator, extension

## Goal

Remove dual-write paths so new work cannot recreate delivery Markdown on disk; enforce SQLite-only in CI; extension displays DB-backed board.

## Scope

| US      | Status | MoSCoW | Depends on | Epic    | Description |
| ------- | ------ | ------ | ---------- | ------- | ----------- |
| US-0119 | ❌     | Must   | US-0115    | EPIC-15 | Kit skills SQLite-only writes |
| US-0120 | ❌     | Must   | US-0119    | EPIC-15 | Validator --sqlite-only |
| US-0121 | ❌     | Must   | US-0116    | EPIC-15 | Extension SQLite read path |

## Out of scope for this sprint

- Purge and final cutover (v10-S4).

## Retrospective

_(fill at sprint close)_
""",
        "stories": ["US-0119", "US-0120", "US-0121"],
    },
    {
        "fm": {
            "id": "v10-S4",
            "version": "v10",
            "title": "Docs, purge, dogfood cutover",
            "status": "planned",
            "goal": "Update protocol docs, purge delivery .md after verify, validate dogfood end-to-end.",
            "done_when": "US-0122, US-0123, US-0124 are ✅; no delivery .md remain on dogfood.",
            "stories": "[US-0122, US-0123, US-0124]",
        },
        "body": """# v10-S4 — Docs, purge, dogfood cutover

## Goal

Document the SQLite-only workflow for humans and agents, safely remove legacy delivery files, and prove the dogfood repo runs entirely on the database.

## Scope

| US      | Status | MoSCoW | Depends on        | Epic    | Description |
| ------- | ------ | ------ | ----------------- | ------- | ----------- |
| US-0122 | ❌     | Must   | —                 | EPIC-15 | Protocol documentation update |
| US-0123 | ❌     | Must   | US-0117, US-0120  | EPIC-15 | purge_delivery_md.py |
| US-0124 | ❌     | Must   | US-0123, US-0121  | EPIC-15 | Dogfood verify + purge + validate |

## Out of scope for this sprint

- Phase doc rewrites beyond storage boundary sections.

## Retrospective

_(fill at sprint close)_
""",
        "stories": ["US-0122", "US-0123", "US-0124"],
    },
]


def us_doc(
    us_id: str,
    title: str,
    epic: str,
    version: str,
    depends_on: list[str],
    done_when: str,
    acceptance: str,
    why: str,
    where: str,
    approach: str,
    arch_refs: str,
    api_db: str,
    security: str,
    decisions: str,
    planned: str,
    out_of_scope: str,
    ready: bool = True,
) -> tuple[dict[str, str], str]:
    dep = json.dumps(depends_on) if depends_on else "[]"
    fm = {
        "id": us_id,
        "title": title,
        "epic": epic,
        "version": version,
        "status": "❌",
        "moscow": "Must",
        "depends_on": dep,
        "ready": "true" if ready else "false",
        "done_when": done_when,
        "tests": "required",
        "tests_status": "pending",
    }
    body = f"""# {us_id} — {title}

**As** Process Manager,
**I want** {title.lower()},
**so that** Meridian delivery runs SQLite-only with summary-first agent workflows.

## Intent

### Acceptance

{acceptance}

### Why

{why}

### Where

{where}

## Plan

### Approach

{approach}

### Architecture refs

{arch_refs}

### API / DB impact

{api_db}

### Security notes

{security}

### Related decisions

{decisions}

### Planned

{planned}

## Record

### Files

_(fill on close)_

### Backend

_n/a_

### Frontend

_n/a_

### Scripts / Docs

_(fill on close)_

### Executed

_(pending until close)_

## Boundaries

### Out of scope for this story

{out_of_scope}

### Notes

- Created and refined via seed_v10_sqlite_only.py for v10 planning.
"""
    return fm, body


USER_STORIES = [
    us_doc(
        "US-0115",
        "Summary columns schema migration",
        "EPIC-15",
        "v10",
        [],
        "Migration 20260718110000 adds summary TEXT to delivery tables; bootstrap applies idempotently.",
        """- [ ] New migration file `20260718110000_summary_columns.sql` adds nullable `summary` column to `user_stories`, `epics`, `versions`, `sprints`.
- [ ] `bootstrap_meridian_db.py .` applies migration on fresh and existing DB without data loss.
- [ ] `sqlite3 .meridian/meridian.db "PRAGMA table_info(user_stories)"` shows `summary` column.""",
        """Today agents must load full `body_markdown` (often 2–5 KB per US) to learn status or scope. A summary column enables progressive disclosure: list summaries in one query, fetch full body only when implementing. This US adds the schema only — no backfill or CLI yet.""",
        """v10 / EPIC-15, sprint v10-S1. No dependencies. Blocks US-0118 (backfill) and US-0119 (complete-us summary write).""",
        """- Add `.agent/migrations/20260718110000_summary_columns.sql` with `ALTER TABLE ... ADD COLUMN summary TEXT` for the four delivery tables; follow existing timestamp naming convention.
- Extend `meridian_db.py` `upsert_*` functions to read/write `summary` when present so later US do not need another schema pass.
- Document column in `docs/06_database.md` § Delivery tables (US-0122 may expand prose).""",
        """- `docs/06_database.md` — § Delivery tables
- `docs/05_architecture.md` — § Layers""",
        """- SQLite migration alters `user_stories`, `epics`, `versions`, `sprints`.""",
        """- _n/a_ — local schema only.""",
        """- `docs/decisions/2026-07-18.json` — v10 SQLite-only direction.""",
        """- [ ] **automated** — `python3 .agent/scripts/bootstrap_meridian_db.py .` exits 0 twice (idempotent).
- [ ] **manual** — `sqlite3 .meridian/meridian.db "SELECT summary FROM user_stories LIMIT 1"` runs without error (column exists).""",
        """- Backfilling summary text (US-0118).
- CLI commands (US-0116).""",
    ),
    us_doc(
        "US-0116",
        "meridian_db_cli query commands for agents",
        "EPIC-15",
        "v10",
        [],
        "meridian_db_cli supports list, show, search, counts for delivery entities without raw SQL.",
        """- [ ] `python3 .agent/scripts/meridian_db_cli.py counts .` prints table row counts.
- [ ] `python3 .agent/scripts/meridian_db_cli.py list user_stories --status ❌` lists matching ids and titles.
- [ ] `python3 .agent/scripts/meridian_db_cli.py show US-0115` prints summary (if set) and optional `--full` for body sections.
- [ ] `python3 .agent/scripts/meridian_db_cli.py search "sqlite" --entity user_stories` finds title/summary matches.""",
        """Agents today use ad-hoc `sqlite3` one-liners or glob `docs/us/*.md`, which is error-prone and bypasses package-root resolution. A documented CLI gives stable commands for discovery, aligned with kit skills.""",
        """v10-S1 with US-0115. Unblocks US-0121 (extension can reuse export patterns) and documents agent workflow in US-0122.""",
        """- Extend `meridian_db_cli.py` with subcommands `counts`, `list`, `show`, `search`; reuse `connect()` and parameterized queries — no string concatenation of user input in SQL.
- `show` defaults to summary + frontmatter fields; `--full` dumps structured sections from column fields or `body_markdown`.
- `list` supports filters: `--status`, `--epic`, `--version`, `--ready`.
- Print usage hints on stderr when DB missing (bootstrap command).""",
        """- `docs/05_architecture.md` — § VS Code extension (`Data loading`)
- `docs/06_database.md` — § Access patterns""",
        """- Read-only queries against `.meridian/meridian.db`.""",
        """- _n/a_ — local file reads only.""",
        """- _n/a_""",
        """- [ ] **automated** — `python3 .agent/scripts/meridian_db_cli.py counts .` exits 0 and prints `user_stories: N`.
- [ ] **manual** — `python3 .agent/scripts/meridian_db_cli.py show US-0105 --full` prints Intent sections.""",
        """- Writing or updating rows (create-us/set-ready stay separate).
- Web API — CLI only.""",
    ),
    us_doc(
        "US-0117",
        "verify_md_sqlite_parity.py migration verification",
        "EPIC-15",
        "v10",
        [],
        "Parity script compares delivery .md files to SQLite rows and exits non-zero on any mismatch.",
        """- [ ] `python3 .agent/scripts/verify_md_sqlite_parity.py .` exits 0 when all delivery .md match DB (113 US, 14 epics, 15 versions, 40 sprints on dogfood).
- [ ] Script reports missing-in-DB, missing-on-disk, and field mismatches (id, title, status, ready).
- [ ] `--json` flag emits machine-readable report for CI.""",
        """Before purging `.md` files we need proof that SQLite contains the same delivery data. Manual spot checks are insufficient for 180+ artifacts. This script is the gate for `purge_delivery_md.py --require-verify`.""",
        """v10-S2. Independent of US-0115. Blocks US-0123 and US-0124. Run after every `migrate_md_to_sqlite.py` until purge.""",
        """- Create `verify_md_sqlite_parity.py` that parses each `docs/us/US-*.md` frontmatter and compares to `user_stories` row; repeat for epics, versions, sprints.
- Compare normalized fields: id, title, status, epic/version refs, ready flag; optional body hash for US.
- Exit code 1 with grouped report; `--json` for CI artifact.
- Document in Planned: run before purge.""",
        """- `docs/06_database.md` — § Migration and verification""",
        """- Reads SQLite + docs delivery folders.""",
        """- _n/a_""",
        """- _n/a_""",
        """- [ ] **automated** — `python3 .agent/scripts/verify_md_sqlite_parity.py .` exits 0 on current dogfood.
- [ ] **automated** — Introduce deliberate mismatch in test fixture; script exits 1.""",
        """- Purging files (US-0123).
- Phase doc comparison.""",
    ),
    us_doc(
        "US-0118",
        "Summary backfill and complete-us summary generation",
        "EPIC-15",
        "v10",
        ["US-0115"],
        "Backfill script populates summary for migrated rows; complete-us skill writes summary on close.",
        """- [ ] `python3 .agent/scripts/backfill_summaries.py .` sets `summary` for all rows missing it (derived from title + done_when + first acceptance line).
- [ ] `complete-user-story` skill instructs agent to write 4–8 sentence summary into DB on `/complete-us`.
- [ ] `meridian_db_cli show US-XXXX` displays summary without `--full`.""",
        """Progressive disclosure only works if summaries exist. Migrated history needs one-time backfill; new work needs summary at close. Without this, US-0115 columns stay null and agents still load full bodies.""",
        """v10-S2 after US-0115. Feeds US-0122 documentation and agent workflow (summary first, full on demand).""",
        """- Add `backfill_summaries.py` using deterministic template from existing columns (not LLM) for migration safety.
- Extend `upsert_user_story` / complete path to accept `summary` field.
- Update `.agent/skills/complete-user-story/SKILL.md` with summary generation rules and example paragraph.
- Optional: `meridian_db_cli set-summary US-XXXX --file summary.txt` for manual edits.""",
        """- `docs/06_database.md` — § Summary field
- `docs/05_architecture.md` — § Layers""",
        """- Updates `summary` column on delivery tables.""",
        """- _n/a_""",
        """- _n/a_""",
        """- [ ] **automated** — `python3 .agent/scripts/backfill_summaries.py .` then `sqlite3 .meridian/meridian.db "SELECT COUNT(*) FROM user_stories WHERE summary IS NULL"` returns 0.
- [ ] **manual** — Complete a test US via workflow; `show` displays new summary.""",
        """- LLM-generated summaries without manager review at close.
- Epic/version summary quality tuning beyond template backfill.""",
    ),
    us_doc(
        "US-0119",
        "Kit skills SQLite-only write path",
        "EPIC-15",
        "v10",
        ["US-0115"],
        "create/refine/complete/sync skills persist only to SQLite; no Write on docs/us or sibling delivery folders.",
        """- [ ] `/create-us` skill text mandates `meridian_db_cli create-us` when DB exists; forbids `docs/us/US-*.md` Write.
- [ ] `/refine-us` updates DB via new `meridian_db_cli update-us` or documented upsert path.
- [ ] `/sync-board` runs `generate_board.py` only; no markdown delivery writes.
- [ ] Creating US via CLI does not create `.md` file on disk.""",
        """Dual-write caused drift in v9: DB and disk could disagree. SQLite-only writes make `.meridian/meridian.db` canonical and let purge remove legacy files safely.""",
        """v10-S3 after US-0115. Blocks US-0120. Required before US-0123 purge.""",
        """- Add `meridian_db_cli update-us` accepting markdown file or stdin for refine workflow.
- Update skills: `create-user-story`, `refine-user-story`, `complete-user-story`, `generate-board-json`, workflows `/create-us`, `/refine-us`, `/complete-us`, `/sync-board`.
- Update `create-epic`, `create-version`, `create-sprint` skills to upsert DB when present (epic/version/sprint CLI or shared upsert helper).""",
        """- `docs/05_architecture.md` — § Layers
- `.agent/MERIDIAN.md` — delivery persistence""",
        """- All kit writes target SQLite tables.""",
        """- _n/a_""",
        """- `docs/decisions/2026-07-18.json` — SQLite-only direction.""",
        """- [ ] **manual** — `meridian_db_cli create-us --title "SQLite only test" ...`; confirm no new file in `docs/us/`.
- [ ] **automated** — `validate_meridian.py .` passes after create.""",
        """- Purge command (US-0123).
- Validator --sqlite-only (US-0120).""",
    ),
    us_doc(
        "US-0120",
        "Validator --sqlite-only rejects delivery markdown files",
        "EPIC-15",
        "v10",
        ["US-0119"],
        "validate_meridian.py --sqlite-only errors when docs/us, epics, versions, sprints, or decisions/*.json exist.",
        """- [ ] `python3 .agent/scripts/validate_meridian.py . --sqlite-only` exits 0 only when delivery .md/json absent.
- [ ] With `docs/us/US-0001.md` present, `--sqlite-only` exits non-zero with clear error.
- [ ] CI runs `--sqlite-only` after dogfood cutover (US-0124).""",
        """After purge, accidental recreation of delivery `.md` must fail CI — otherwise the repo silently regresses to dual mode.""",
        """v10-S3 after US-0119. Enables safe enforcement post US-0123.""",
        """- Add `--sqlite-only` flag to `validate_meridian.py` checking glob counts under delivery paths; allow `docs/kanban/board.json` as derived artifact.
- Wire `.github/workflows/ci.yml` to use flag after cutover (or always with warning phase).
- Document flag in CONTRIBUTING and `06_database.md`.""",
        """- `docs/06_database.md` — § Validation modes""",
        """- Validator filesystem checks only.""",
        """- _n/a_""",
        """- _n/a_""",
        """- [ ] **automated** — With delivery md present: exit 1. After purge on fixture: exit 0.""",
        """- Removing phase docs.
- board.json prohibition (derived file stays).""",
    ),
    us_doc(
        "US-0121",
        "VS Code extension reads delivery from SQLite",
        "EPIC-15",
        "v10",
        ["US-0116"],
        "Extension board and deliverables load from meridian_db export when meridian.db exists.",
        """- [ ] Board tab shows stories from SQLite when `.meridian/meridian.db` exists (no `docs/us/*.md` required).
- [ ] `pnpm test` in app-visual-studio passes.
- [ ] Fallback to markdown only when DB missing (client projects mid-migration).""",
        """Extension still reads `docs/us/*.md` after app-desktop removal. SQLite-only cutover breaks the board unless the extension uses the same export as the kit CLI.""",
        """v10-S3 after US-0116. Required for US-0124 dogfood validation with purged .md.""",
        """- Add `load-from-sqlite.ts` calling `python3 .agent/scripts/meridian_db_export.py` or reading JSON export subprocess from extension validate pattern.
- Update `load-stories.ts` and deliverables loaders to prefer DB path when `db_exists(packageRoot)`.
- Reuse kanban column rules; map DB status/ready fields to existing types.""",
        """- `docs/05_architecture.md` — § VS Code extension (`Data loading`)""",
        """- Extension spawns Python export; no native sqlite binding in VSIX.""",
        """- _n/a_ — local subprocess, same as validate.""",
        """- _n/a_""",
        """- [ ] **automated** — `cd app-visual-studio && pnpm test` exits 0.
- [ ] **manual** — F5 with dogfood root; Board shows US count matching `meridian_db_cli counts`.""",
        """- Extension write path for US (stays kit CLI / v5).
- Summary UI panel (future; CLI show suffices for v10).""",
    ),
    us_doc(
        "US-0122",
        "Protocol documentation for SQLite-only workflow",
        "EPIC-15",
        "v10",
        [],
        "06_database, 05_architecture, MERIDIAN.md, skills, and agents-help document SQLite-only + CLI + summary pipeline.",
        """- [ ] `docs/06_database.md` describes summary column, CLI commands, verify and purge scripts.
- [ ] `docs/05_architecture.md` states delivery artifacts are SQLite-only after v10.
- [ ] `.agent/MERIDIAN.md` and `start-here.md` reference `meridian_db_cli` examples.
- [ ] `agents-help.md` lists verify/purge commands in planning group.""",
        """Without updated protocol docs, agents will keep reading and writing `.md` delivery files despite implementation. Documentation is the enforcement layer for AI workflows.""",
        """v10-S4; can start in parallel with S3. Complements US-0124 cutover.""",
        """- Rewrite storage boundary sections in `06_database.md` and `05_architecture.md` (approved status).
- Add § Agent workflow: `counts` → `list` → `show` (summary) → `show --full` when implementing.
- Update kit skills cross-links; remove app-desktop references if any remain.
- Add decision log entry for SQLite-only policy.""",
        """- `docs/06_database.md` — full file
- `docs/05_architecture.md` — § Layers, § Removed browser monitor""",
        """- _n/a_ — documentation only.""",
        """- _n/a_""",
        """- `docs/decisions/2026-07-18.json` — extend or new entry.""",
        """- [ ] **manual** — Grep `docs/us/` in `.agent/` skills; only historical or forbidden references remain.
- [ ] **manual** — New contributor can follow `06_database.md` to query DB without asking.""",
        """- Implementing scripts (other US).
- Phase doc content rewrites beyond storage sections.""",
    ),
    us_doc(
        "US-0123",
        "purge_delivery_md.py safe removal of delivery markdown",
        "EPIC-15",
        "v10",
        ["US-0117", "US-0120"],
        "purge script deletes delivery .md/json only after verify passes; supports --dry-run.",
        """- [ ] `python3 .agent/scripts/purge_delivery_md.py . --dry-run` lists files that would be deleted without deleting.
- [ ] `python3 .agent/scripts/purge_delivery_md.py . --require-verify` runs verify first; aborts on failure.
- [ ] Removes `docs/us/*.md`, `docs/epics/*.md`, `docs/versions/*.md`, `docs/sprints/*.md`, `docs/decisions/*.json` only — never phase docs or board.json.""",
        """Manager needs a single safe command to finish cutover after verification. Manual `rm` is error-prone and might delete phase docs.""",
        """v10-S4 after US-0117 and US-0120. Blocks US-0124.""",
        """- Implement `purge_delivery_md.py` with explicit allowlist of globs; `--dry-run` and `--require-verify` flags calling `verify_md_sqlite_parity.py`.
- Log deleted paths to stdout; exit 2 if verify fails.
- Document recovery: re-run `migrate_md_to_sqlite.py` from `meridian-v1-old` branch if needed.""",
        """- `docs/06_database.md` — § Purge cutover""",
        """- Filesystem delete under docs delivery folders.""",
        """- _n/a_ — irreversible without git; dry-run mitigates.""",
        """- _n/a_""",
        """- [ ] **automated** — `--dry-run` on dogfood lists 180+ files, deletes none.
- [ ] **manual** — On copy of repo after verify green: purge + `validate_meridian.py . --sqlite-only` passes.""",
        """- Auto-purge without verify flag.
- Deleting `docs/kanban/board.json` or phase docs.""",
    ),
    us_doc(
        "US-0124",
        "Dogfood cutover verify purge validate end-to-end",
        "EPIC-15",
        "v10",
        ["US-0123", "US-0121", "US-0122"],
        "Dogfood repo runs verify, purge, validate --sqlite-only, extension test, and generate_board on SQLite only.",
        """- [ ] `verify_md_sqlite_parity.py .` exits 0 immediately before purge.
- [ ] After `purge_delivery_md.py . --require-verify`, no `docs/us/*.md` remain.
- [ ] `validate_meridian.py . --sqlite-only` and `generate_board.py .` exit 0.
- [ ] `cd app-visual-studio && pnpm test` exits 0.""",
        """This US is the manager sign-off for v10 on the meridian dogfood repo: prove the full pipeline works once `.md` delivery files are gone.""",
        """v10-S4 capstone. Depends on purge, extension, and docs US. Marks v10 ready for `status: complete` when all v10 US are ✅.""",
        """- Execute runbook in `MERIDIAN_V2_CUTOVER.md` appendix for v10: verify → backfill summaries → purge → validate → test → decision log.
- Update CI to `--sqlite-only`.
- Mark v10 go-live checklist items in version doc (DB row).""",
        """- `docs/05_architecture.md` — § Repository context
- `MERIDIAN_V2_CUTOVER.md`""",
        """- Operational cutover on dogfood package root `.`.""",
        """- _n/a_""",
        """- New decision log entry for v10 cutover completion.""",
        """- [ ] **automated** — Full command sequence in Record executed on dogfood.
- [ ] **manual** — Manager confirms Board in extension matches `meridian_db_cli list user_stories`.""",
        """- Implementing individual scripts (covered by prior US).
- Client project cutover (dogfood only).""",
    ),
]


def main() -> int:
    bootstrap(ROOT)
    conn = connect(ROOT)
    try:
        v10_full = _full_doc(V10_FM, V10_BODY)
        upsert_version(conn, V10_FM, v10_full, extract_version_sections(V10_BODY))

        epic_full = _full_doc(EPIC_15_FM, EPIC_15_BODY)
        upsert_epic(conn, EPIC_15_FM, epic_full, extract_epic_sections(EPIC_15_BODY))

        for fm, body in USER_STORIES:
            full = _full_doc(fm, body)
            depends = parse_depends_on(fm.get("depends_on", "[]"))
            upsert_user_story(conn, fm, full, extract_us_sections(body), depends)

        for sprint in SPRINTS:
            fm = sprint["fm"]
            body = sprint["body"]
            full = _full_doc(fm, body)
            upsert_sprint(
                conn,
                fm,
                full,
                extract_sprint_sections(body),
                sprint["stories"],
            )

        conn.commit()
    finally:
        conn.close()

    write_board_json(ROOT)
    print("Seeded EPIC-15, v10, 4 sprints, US-0115–US-0124 into SQLite.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
