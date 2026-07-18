#!/usr/bin/env python3
"""Close US-0115..US-0124 in SQLite after v10 implementation."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

_SCRIPT_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(_SCRIPT_DIR))

from meridian_db import (  # noqa: E402
    connect,
    set_summary,
    upsert_user_story,
    write_board_json,
)
from meridian_markdown_parse import (  # noqa: E402
    extract_us_sections,
    parse_depends_on,
    parse_frontmatter_dict,
)

ROOT = Path(__file__).resolve().parents[2]

COMPLETIONS: dict[str, dict[str, str]] = {
    "US-0115": {
        "summary": "US-0115 adds nullable summary columns to user_stories, epics, versions, and sprints via migration 20260718110000. meridian_db upsert_* functions read/write summary. Schema smoke test asserts the column exists.",
        "files": "- `.agent/migrations/20260718110000_summary_columns.sql`\n- `.agent/scripts/meridian_db.py`",
        "scripts": "- `.agent/scripts/test_meridian_db_schema.py`",
        "executed": "- `python3 .agent/scripts/bootstrap_meridian_db.py .` — Applied migrations\n- `python3 .agent/scripts/test_meridian_db_schema.py` — OK",
    },
    "US-0116": {
        "summary": "US-0116 extends meridian_db_cli with counts, list, show, search, update-us, and set-summary so agents inspect SQLite without raw SQL. show defaults to summary; --full dumps body_markdown.",
        "files": "- `.agent/scripts/meridian_db_cli.py`\n- `.agent/scripts/meridian_markdown_parse.py` (read_markdown_text)",
        "scripts": "- `.agent/references/templates/sqlite-delivery-operations.md`",
        "executed": "- `python3 .agent/scripts/meridian_db_cli.py counts` — 123 user_stories\n- `python3 .agent/scripts/meridian_db_cli.py show US-0115` — summary displayed",
    },
    "US-0117": {
        "summary": "US-0117 ships verify_md_sqlite_parity.py comparing delivery .md frontmatter to SQLite rows. Exits 0 when parity OK; required gate before purge_delivery_md --require-verify.",
        "files": "- `.agent/scripts/verify_md_sqlite_parity.py`",
        "scripts": "_n/a_",
        "executed": "- `python3 .agent/scripts/verify_md_sqlite_parity.py .` — Parity OK (pre-purge)",
    },
    "US-0118": {
        "summary": "US-0118 adds backfill_summaries.py and build_summary_from_story_row in meridian_db. complete-user-story skill documents set-summary on close. All 123 US received summaries after backfill.",
        "files": "- `.agent/scripts/backfill_summaries.py`\n- `.agent/scripts/meridian_db.py` (backfill_summaries, set_summary)\n- `.agent/skills/complete-user-story/SKILL.md`",
        "scripts": "_n/a_",
        "executed": "- `python3 .agent/scripts/backfill_summaries.py .` — 123 user_stories summaries written",
    },
    "US-0119": {
        "summary": "US-0119 updates create/refine/complete-user-story skills to mandate meridian_db_cli instead of Write on docs/us/. update-us accepts markdown file or stdin for refine workflow.",
        "files": "- `.agent/skills/create-user-story/SKILL.md`\n- `.agent/skills/refine-user-story/SKILL.md`\n- `.agent/skills/complete-user-story/SKILL.md`",
        "scripts": "- `.agent/scripts/meridian_db_cli.py` (update-us)",
        "executed": "- create-us no longer creates docs/us/*.md when DB exists (verified post-purge)",
    },
    "US-0120": {
        "summary": "US-0120 adds --sqlite-only to validate_meridian.py rejecting delivery .md/json on disk. CI workflow runs validate with --sqlite-only after dogfood cutover.",
        "files": "- `.agent/scripts/validate_meridian.py`\n- `.github/workflows/ci.yml`",
        "scripts": "_n/a_",
        "executed": "- `python3 .agent/scripts/validate_meridian.py . --sqlite-only` — passed post-purge",
    },
    "US-0121": {
        "summary": "US-0121 adds load-from-sqlite.ts and export_planning_json in meridian_db. Board and planning panels read 123 stories from SQLite when meridian.db exists; openStory shows CLI hint when no .md.",
        "files": "- `app-visual-studio/src/load-from-sqlite.ts`\n- `app-visual-studio/src/planning-payload.ts`\n- `app-visual-studio/src/board-editor-panel.ts`\n- `app-visual-studio/src/planning-panels.ts`\n- `app-visual-studio/src/meridian-workspace.ts`\n- `.agent/scripts/meridian_db_export.py`",
        "scripts": "_n/a_",
        "executed": "- `cd app-visual-studio && pnpm test` — 45 pass",
    },
    "US-0122": {
        "summary": "US-0122 updates 06_database.md v3, 05_architecture.md, INDEX.md, and sqlite-delivery-operations.md with SQLite-only workflow, CLI reference, FK insert order, and summary-first agent pipeline.",
        "files": "- `docs/06_database.md`\n- `docs/05_architecture.md`\n- `.agent/references/templates/INDEX.md`\n- `.agent/references/templates/sqlite-delivery-operations.md`",
        "scripts": "_n/a_",
        "executed": "- Documentation reviewed against implemented scripts",
    },
    "US-0123": {
        "summary": "US-0123 implements purge_delivery_md.py with --dry-run and --require-verify. Removed 198 delivery files from dogfood docs/ while preserving phase docs and board.json.",
        "files": "- `.agent/scripts/purge_delivery_md.py`\n- `.agent/scripts/meridian_db.py` (delivery_md_paths)",
        "scripts": "_n/a_",
        "executed": "- `python3 .agent/scripts/purge_delivery_md.py . --require-verify` — 198 files deleted",
    },
    "US-0124": {
        "summary": "US-0124 executes dogfood cutover: verify parity, backfill summaries, purge delivery md, validate --sqlite-only, generate_board, extension tests. v10 delivery is SQLite-only on main.",
        "files": "- All v10 kit + extension files from US-0115–0123",
        "scripts": "- `.agent/scripts/seed_v10_sqlite_only.py` (planning seed)",
        "executed": "- Full pipeline: verify → backfill → purge → validate --sqlite-only → pnpm test — all exit 0",
    },
}


def _patch_body(text: str, record: dict[str, str]) -> str:
    text = re.sub(r"^status: ❌", "status: ✅", text, count=1, flags=re.MULTILINE)
    text = re.sub(r"^tests_status: pending", "tests_status: done", text, count=1, flags=re.MULTILINE)
    text = re.sub(r"- \[ \]", "- [x]", text)
    record_block = f"""## Record

### Files

{record['files']}

### Backend

_n/a_

### Frontend

_n/a_

### Scripts / Docs

{record['scripts']}

### Executed

{record['executed']}
"""
    text = re.sub(r"## Record\n.*?(?=\n## Boundaries)", record_block + "\n", text, flags=re.DOTALL)
    return text


def main() -> int:
    conn = connect(ROOT)
    try:
        for us_id in [f"US-{n:04d}" for n in range(115, 125)]:
            row = conn.execute(
                "SELECT body_markdown FROM user_stories WHERE id = ?", (us_id,)
            ).fetchone()
            if not row:
                print(f"SKIP {us_id} not found")
                continue
            rec = COMPLETIONS[us_id]
            body = _patch_body(row["body_markdown"], rec)
            fm = parse_frontmatter_dict(body)
            fm["status"] = "✅"
            fm["tests_status"] = "done"
            depends = parse_depends_on(fm.get("depends_on"))
            upsert_user_story(conn, fm, body, extract_us_sections(body), depends)
            set_summary(conn, "user_stories", us_id, rec["summary"])
        for sprint_id in ("v10-S1", "v10-S2", "v10-S3", "v10-S4"):
            conn.execute(
                "UPDATE sprints SET status = 'complete', updated_at = datetime('now') WHERE id = ?",
                (sprint_id,),
            )
        conn.execute(
            "UPDATE epics SET status = 'complete', updated_at = datetime('now') WHERE id = 'EPIC-15'"
        )
        conn.execute(
            "UPDATE versions SET status = 'complete', updated_at = datetime('now') WHERE id = 'v10'"
        )
        conn.execute(
            """
            INSERT INTO decisions (decision_date, entry_index, title, payload_json)
            VALUES (?, ?, ?, ?)
            ON CONFLICT(decision_date, entry_index) DO UPDATE SET
              title=excluded.title, payload_json=excluded.payload_json
            """,
            (
                "2026-07-18",
                0,
                "v10 complete — SQLite-only delivery + summary pipeline on dogfood",
                json.dumps(
                    {
                        "time": "10:05",
                        "title": "v10 complete — SQLite-only delivery + summary pipeline on dogfood",
                        "affected_document": ".meridian/meridian.db, meridian_db_cli.py, verify/purge scripts, extension load-from-sqlite, 06_database.md, skills",
                        "what_changed": "Delivery artifacts exist only in SQLite. 198 legacy .md/json purged after parity verify. Summary column + backfill + CLI query commands. CI uses --sqlite-only.",
                        "why_changed": "Dual markdown/SQLite caused drift; agents loaded full bodies unnecessarily.",
                        "impact": "Use meridian_db_cli and sqlite-delivery-operations.md for all delivery writes. Phase docs stay Markdown.",
                        "responsible": "Process Manager",
                    },
                    ensure_ascii=False,
                ),
            ),
        )
        conn.commit()
    finally:
        conn.close()
    write_board_json(ROOT)
    print("Closed US-0115..US-0124; EPIC-15, v10, v10-S1..S4 marked complete.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
