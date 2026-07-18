#!/usr/bin/env python3
"""SQLite access layer for Meridian 2.0 delivery artifacts."""

from __future__ import annotations

import json
import sqlite3
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

REPO_ROOT = Path(__file__).resolve().parents[2]
MIGRATIONS_DIR = REPO_ROOT / ".agent" / "migrations"
DB_FILENAME = "meridian.db"
MERIDIAN_DIR = ".meridian"


def resolve_db_path(package_root: str | Path) -> Path:
    return Path(package_root).resolve() / MERIDIAN_DIR / DB_FILENAME


def resolve_migrations_dir() -> Path:
    return MIGRATIONS_DIR


def connect(package_root: str | Path) -> sqlite3.Connection:
    db_path = resolve_db_path(package_root)
    db_path.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    conn.execute("PRAGMA journal_mode = WAL")
    return conn


def db_exists(package_root: str | Path) -> bool:
    return resolve_db_path(package_root).is_file()


def list_tables(conn: sqlite3.Connection) -> list[str]:
    rows = conn.execute(
        "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
    ).fetchall()
    return [row["name"] for row in rows]


def applied_migrations(conn: sqlite3.Connection) -> set[str]:
    if "schema_migrations" not in list_tables(conn):
        return set()
    rows = conn.execute("SELECT name FROM schema_migrations").fetchall()
    return {row["name"] for row in rows}


def apply_migrations(package_root: str | Path) -> list[str]:
    migrations_dir = resolve_migrations_dir()
    if not migrations_dir.is_dir():
        raise FileNotFoundError(f"Migrations directory not found: {migrations_dir}")

    conn = connect(package_root)
    applied: list[str] = []
    try:
        already = applied_migrations(conn)
        for sql_file in sorted(migrations_dir.glob("*.sql")):
            name = sql_file.name
            if name in already:
                continue
            sql = sql_file.read_text(encoding="utf-8")
            conn.executescript(sql)
            conn.execute(
                "INSERT INTO schema_migrations (name) VALUES (?)",
                (name,),
            )
            applied.append(name)
        conn.commit()
    finally:
        conn.close()
    return applied


def bootstrap(package_root: str | Path) -> str:
    if not is_meridian_package(package_root):
        raise ValueError(
            f"Not a Meridian product folder (missing docs/ fingerprint): {package_root}"
        )
    applied = apply_migrations(package_root)
    if applied:
        return f"Applied migrations: {', '.join(applied)}"
    return "Database already up to date"


def is_meridian_package(package_root: str | Path) -> bool:
    docs = Path(package_root).resolve() / "docs"
    if not docs.is_dir():
        return False
    if (docs / "00_scope.md").exists():
        return True
    return any(docs.glob("us/US-*.md"))


def _now() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")


def upsert_version(
    conn: sqlite3.Connection,
    frontmatter: dict[str, str],
    body: str,
    sections: dict[str, str | None],
) -> None:
    conn.execute(
        """
        INSERT INTO versions (
          id, title, status, outcome, objective, done_criteria,
          included, explicitly_out, go_live, body_markdown, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          title=excluded.title, status=excluded.status, outcome=excluded.outcome,
          objective=excluded.objective, done_criteria=excluded.done_criteria,
          included=excluded.included, explicitly_out=excluded.explicitly_out,
          go_live=excluded.go_live, body_markdown=excluded.body_markdown,
          updated_at=excluded.updated_at
        """,
        (
            frontmatter.get("id"),
            frontmatter.get("title", ""),
            frontmatter.get("status", "planned"),
            frontmatter.get("outcome"),
            sections.get("objective"),
            sections.get("done_criteria"),
            sections.get("included"),
            sections.get("explicitly_out"),
            sections.get("go_live"),
            body,
            _now(),
        ),
    )


def upsert_epic(
    conn: sqlite3.Connection,
    frontmatter: dict[str, str],
    body: str,
    sections: dict[str, str | None],
) -> None:
    conn.execute(
        """
        INSERT INTO epics (
          id, title, status, outcome, profiles, versions,
          capability, expected_outcome, out_of_scope, notes, body_markdown, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          title=excluded.title, status=excluded.status, outcome=excluded.outcome,
          profiles=excluded.profiles, versions=excluded.versions,
          capability=excluded.capability, expected_outcome=excluded.expected_outcome,
          out_of_scope=excluded.out_of_scope, notes=excluded.notes,
          body_markdown=excluded.body_markdown, updated_at=excluded.updated_at
        """,
        (
            frontmatter.get("id"),
            frontmatter.get("title", ""),
            frontmatter.get("status", "active"),
            frontmatter.get("outcome"),
            frontmatter.get("profiles"),
            frontmatter.get("versions"),
            sections.get("capability"),
            sections.get("expected_outcome"),
            sections.get("out_of_scope"),
            sections.get("notes"),
            body,
            _now(),
        ),
    )


def upsert_sprint(
    conn: sqlite3.Connection,
    frontmatter: dict[str, str],
    body: str,
    sections: dict[str, str | None],
    stories: list[str],
) -> None:
    conn.execute(
        """
        INSERT INTO sprints (
          id, version_id, title, status, goal, done_when, stories_json,
          goal_body, scope_table, out_of_scope, retrospective, body_markdown, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          version_id=excluded.version_id, title=excluded.title, status=excluded.status,
          goal=excluded.goal, done_when=excluded.done_when, stories_json=excluded.stories_json,
          goal_body=excluded.goal_body, scope_table=excluded.scope_table,
          out_of_scope=excluded.out_of_scope, retrospective=excluded.retrospective,
          body_markdown=excluded.body_markdown, updated_at=excluded.updated_at
        """,
        (
            frontmatter.get("id"),
            frontmatter.get("version"),
            frontmatter.get("title", ""),
            frontmatter.get("status", "planned"),
            frontmatter.get("goal"),
            frontmatter.get("done_when"),
            json.dumps(stories),
            sections.get("goal_body"),
            sections.get("scope_table"),
            sections.get("out_of_scope"),
            sections.get("retrospective"),
            body,
            _now(),
        ),
    )
    conn.execute("DELETE FROM sprint_stories WHERE sprint_id = ?", (frontmatter.get("id"),))
    for index, story_id in enumerate(stories):
        conn.execute(
            "INSERT OR REPLACE INTO sprint_stories (sprint_id, story_id, position) VALUES (?, ?, ?)",
            (frontmatter.get("id"), story_id, index),
        )


def upsert_user_story(
    conn: sqlite3.Connection,
    frontmatter: dict[str, str],
    body: str,
    sections: dict[str, str | None],
    depends_on: list[str],
) -> None:
    ready_val = 1 if frontmatter.get("ready", "").lower() == "true" else 0
    conn.execute(
        """
        INSERT INTO user_stories (
          id, title, epic_id, version_id, status, moscow, depends_on_json, ready,
          done_when, tests, tests_status, preamble,
          intent_acceptance, intent_why, intent_where,
          plan_approach, plan_architecture_refs, plan_api_db, plan_security,
          plan_decisions, plan_planned,
          record_files, record_backend, record_frontend, record_scripts, record_executed,
          boundaries_out_of_scope, boundaries_notes, body_markdown, updated_at
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
        )
        ON CONFLICT(id) DO UPDATE SET
          title=excluded.title, epic_id=excluded.epic_id, version_id=excluded.version_id,
          status=excluded.status, moscow=excluded.moscow, depends_on_json=excluded.depends_on_json,
          ready=excluded.ready, done_when=excluded.done_when, tests=excluded.tests,
          tests_status=excluded.tests_status, preamble=excluded.preamble,
          intent_acceptance=excluded.intent_acceptance, intent_why=excluded.intent_why,
          intent_where=excluded.intent_where, plan_approach=excluded.plan_approach,
          plan_architecture_refs=excluded.plan_architecture_refs, plan_api_db=excluded.plan_api_db,
          plan_security=excluded.plan_security, plan_decisions=excluded.plan_decisions,
          plan_planned=excluded.plan_planned, record_files=excluded.record_files,
          record_backend=excluded.record_backend, record_frontend=excluded.record_frontend,
          record_scripts=excluded.record_scripts, record_executed=excluded.record_executed,
          boundaries_out_of_scope=excluded.boundaries_out_of_scope,
          boundaries_notes=excluded.boundaries_notes, body_markdown=excluded.body_markdown,
          updated_at=excluded.updated_at
        """,
        (
            frontmatter.get("id"),
            frontmatter.get("title", ""),
            frontmatter.get("epic"),
            frontmatter.get("version"),
            frontmatter.get("status", "❌"),
            frontmatter.get("moscow", "Must"),
            json.dumps(depends_on),
            ready_val,
            frontmatter.get("done_when", ""),
            frontmatter.get("tests", "required"),
            frontmatter.get("tests_status", "pending"),
            None,
            sections.get("intent_acceptance"),
            sections.get("intent_why"),
            sections.get("intent_where"),
            sections.get("plan_approach"),
            sections.get("plan_architecture_refs"),
            sections.get("plan_api_db"),
            sections.get("plan_security"),
            sections.get("plan_decisions"),
            sections.get("plan_planned"),
            sections.get("record_files"),
            sections.get("record_backend"),
            sections.get("record_frontend"),
            sections.get("record_scripts"),
            sections.get("record_executed"),
            sections.get("boundaries_out_of_scope"),
            sections.get("boundaries_notes"),
            body,
            _now(),
        ),
    )


def import_decisions(conn: sqlite3.Connection, docs: Path) -> int:
    decisions_dir = docs / "decisions"
    count = 0
    if not decisions_dir.is_dir():
        return 0
    for path in sorted(decisions_dir.glob("*.json")):
        payload = json.loads(path.read_text(encoding="utf-8"))
        entries = payload.get("entries", [])
        date = payload.get("date", path.stem)
        for index, entry in enumerate(entries):
            conn.execute(
                """
                INSERT INTO decisions (decision_date, entry_index, title, payload_json)
                VALUES (?, ?, ?, ?)
                ON CONFLICT(decision_date, entry_index) DO UPDATE SET
                  title=excluded.title, payload_json=excluded.payload_json
                """,
                (date, index, entry.get("title"), json.dumps(entry, ensure_ascii=False)),
            )
            count += 1
    return count


def import_board_snapshot(conn: sqlite3.Connection, docs: Path, source: str = "import") -> int:
    board_path = docs / "kanban" / "board.json"
    if not board_path.exists():
        return 0
    payload = board_path.read_text(encoding="utf-8")
    board = json.loads(payload)
    card_count = len(board) if isinstance(board, list) else 0
    conn.execute(
        """
        INSERT INTO board_snapshots (source, card_count, payload_json)
        VALUES (?, ?, ?)
        """,
        (source, card_count, payload),
    )
    return card_count


def export_board_entries(package_root: str | Path) -> list[dict[str, Any]]:
    conn = connect(package_root)
    try:
        rows = conn.execute(
            """
            SELECT id, title, epic_id AS epic, version_id AS version, status, moscow,
                   depends_on_json, done_when, tests, tests_status, ready
            FROM user_stories ORDER BY id
            """
        ).fetchall()
        entries: list[dict[str, Any]] = []
        for row in rows:
            depends = json.loads(row["depends_on_json"] or "[]")
            entries.append(
                {
                    "id": row["id"],
                    "title": row["title"],
                    "epic": row["epic"],
                    "version": row["version"],
                    "status": row["status"],
                    "moscow": row["moscow"],
                    "depends_on": depends,
                    "done_when": row["done_when"],
                    "tests": row["tests"],
                    "tests_status": row["tests_status"],
                    "ready": bool(row["ready"]),
                }
            )
        return entries
    finally:
        conn.close()


def write_board_json(package_root: str | Path) -> int:
    docs = Path(package_root).resolve() / "docs"
    entries = export_board_entries(package_root)
    board_path = docs / "kanban" / "board.json"
    board_path.parent.mkdir(parents=True, exist_ok=True)
    board_path.write_text(json.dumps(entries, indent=2) + "\n", encoding="utf-8")
    conn = connect(package_root)
    try:
        import_board_snapshot(conn, docs, source="generate")
        conn.commit()
    finally:
        conn.close()
    return len(entries)


def load_delivery_markdown_files(package_root: str | Path) -> dict[str, list[tuple[str, str]]]:
    """Return virtual paths and full markdown for validator DB mode."""
    conn = connect(package_root)
    result: dict[str, list[tuple[str, str]]] = {
        "versions": [],
        "epics": [],
        "sprints": [],
        "user_stories": [],
    }
    try:
        for row in conn.execute("SELECT id, body_markdown FROM versions ORDER BY id"):
            text = row["body_markdown"] or ""
            result["versions"].append((f"{row['id']}.md", text))
        for row in conn.execute("SELECT id, body_markdown FROM epics ORDER BY id"):
            text = row["body_markdown"] or ""
            result["epics"].append((f"{row['id']}.md", text))
        for row in conn.execute("SELECT id, body_markdown FROM sprints ORDER BY id"):
            text = row["body_markdown"] or ""
            result["sprints"].append((f"{row['id']}.md", text))
        for row in conn.execute("SELECT id, body_markdown FROM user_stories ORDER BY id"):
            text = row["body_markdown"] or ""
            result["user_stories"].append((f"{row['id']}.md", text))
    finally:
        conn.close()
    return result


def export_delivery_json(package_root: str | Path) -> dict[str, Any]:
    files = load_delivery_markdown_files(package_root)
    return {
        "packageRoot": str(Path(package_root).resolve()),
        "userStories": [{"file": name, "raw": raw} for name, raw in files["user_stories"]],
        "epics": [{"file": name, "raw": raw} for name, raw in files["epics"]],
        "versions": [{"file": name, "raw": raw} for name, raw in files["versions"]],
        "sprints": [{"file": name, "raw": raw} for name, raw in files["sprints"]],
    }


def next_user_story_id(package_root: str | Path) -> str:
    conn = connect(package_root)
    try:
        row = conn.execute(
            "SELECT id FROM user_stories ORDER BY id DESC LIMIT 1"
        ).fetchone()
        if not row:
            return "US-0001"
        num = int(str(row["id"]).split("-")[1])
        return f"US-{num + 1:04d}"
    finally:
        conn.close()


def delivery_counts(package_root: str | Path) -> dict[str, int]:
    conn = connect(package_root)
    try:
        return {
            "versions": conn.execute("SELECT COUNT(*) FROM versions").fetchone()[0],
            "epics": conn.execute("SELECT COUNT(*) FROM epics").fetchone()[0],
            "sprints": conn.execute("SELECT COUNT(*) FROM sprints").fetchone()[0],
            "user_stories": conn.execute("SELECT COUNT(*) FROM user_stories").fetchone()[0],
            "decisions": conn.execute("SELECT COUNT(*) FROM decisions").fetchone()[0],
        }
    finally:
        conn.close()


def main() -> int:
    import argparse

    parser = argparse.ArgumentParser(description="Meridian SQLite utilities")
    sub = parser.add_subparsers(dest="command", required=True)

    sub.add_parser("list-tables", help="List tables").add_argument(
        "package_root", nargs="?", default="app-desktop"
    )
    migrate_p = sub.add_parser("migrate", help="Apply pending migrations")
    migrate_p.add_argument("package_root", nargs="?", default="app-desktop")

    args = parser.parse_args()
    root = getattr(args, "package_root", "app-desktop")

    if args.command == "list-tables":
        conn = connect(root)
        try:
            for name in list_tables(conn):
                print(name)
        finally:
            conn.close()
        return 0

    if args.command == "migrate":
        print(bootstrap(root))
        return 0

    return 1


if __name__ == "__main__":
    raise SystemExit(main())
