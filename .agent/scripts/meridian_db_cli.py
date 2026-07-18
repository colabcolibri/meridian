#!/usr/bin/env python3
"""CLI for Meridian SQLite delivery store — query and write operations (US-0116, US-0119)."""

from __future__ import annotations

import json
import sys
from pathlib import Path

_SCRIPT_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(_SCRIPT_DIR))

from meridian_db import (  # noqa: E402
    bootstrap,
    connect,
    db_exists,
    delivery_counts,
    next_user_story_id,
    record_board_snapshot,
    set_summary,
    upsert_user_story,
)
from meridian_markdown_parse import (  # noqa: E402
    extract_us_sections,
    parse_depends_on,
    read_markdown_file,
    read_markdown_text,
)

US_TEMPLATE_BODY = """# {id} — {title}

**As** Process Manager,
**I want** {title_lower},
**so that** delivery data is tracked in SQLite.

## Intent

### Acceptance

- [ ] Criterion pending refine

### Why

Created via meridian_db_cli.

### Where

Version {version}, epic {epic}.

## Plan

### Architecture refs

- `docs/05_architecture.md` — § Repository context

### API / DB impact

- SQLite `user_stories` row.

### Security notes

- _n/a_

### Related decisions

- _n/a_

### Planned

- [ ] **manual** — refine and implement

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

- TBD on refine.

### Notes

- Created by meridian_db_cli create-us.
"""

ENTITY_TABLE = {
    "user_stories": ("user_stories", "id"),
    "user_story": ("user_stories", "id"),
    "us": ("user_stories", "id"),
    "epics": ("epics", "id"),
    "epic": ("epics", "id"),
    "versions": ("versions", "id"),
    "version": ("versions", "id"),
    "sprints": ("sprints", "id"),
    "sprint": ("sprints", "id"),
}


def _root(args) -> Path:
    return Path(args.package_root).resolve()


def cmd_counts(args) -> int:
    root = _root(args)
    if not db_exists(root):
        print("ERROR: meridian.db not found — run bootstrap_meridian_db.py", file=sys.stderr)
        return 1
    counts = delivery_counts(root)
    for key, value in counts.items():
        print(f"{key}: {value}")
    return 0


def cmd_list(args) -> int:
    root = _root(args)
    table, _ = ENTITY_TABLE.get(args.entity, (None, None))
    if not table:
        print(f"ERROR: unknown entity {args.entity}", file=sys.stderr)
        return 1
    conn = connect(root)
    try:
        query = f"SELECT id, title, status"
        if table == "user_stories":
            query += ", ready, version_id, epic_id"
        elif table == "sprints":
            query += ", version_id"
        query += f" FROM {table} WHERE 1=1"
        params: list[str] = []
        if args.status and table == "user_stories":
            query += " AND status = ?"
            params.append(args.status)
        if args.version:
            col = "version_id" if table in ("user_stories", "sprints") else "id"
            if table == "versions":
                query += " AND id = ?"
            else:
                query += f" AND {col} = ?"
            params.append(args.version)
        if args.epic and table == "user_stories":
            query += " AND epic_id = ?"
            params.append(args.epic)
        if args.ready is not None and table == "user_stories":
            query += " AND ready = ?"
            params.append(1 if args.ready == "true" else 0)
        query += " ORDER BY id"
        for row in conn.execute(query, params):
            if table == "user_stories":
                print(
                    f"{row['id']}\t{row['title']}\t{row['status']}\tready={row['ready']}\t{row['version_id']}\t{row['epic_id']}"
                )
            elif table == "sprints":
                print(f"{row['id']}\t{row['title']}\t{row['status']}\t{row['version_id']}")
            else:
                print(f"{row['id']}\t{row['title']}\t{row['status']}")
    finally:
        conn.close()
    return 0


def cmd_show(args) -> int:
    root = _root(args)
    conn = connect(root)
    try:
        row = conn.execute(
            "SELECT * FROM user_stories WHERE id = ?", (args.story_id,)
        ).fetchone()
        if not row:
            print(f"ERROR: {args.story_id} not found", file=sys.stderr)
            return 1
        if not args.full:
            print(f"id: {row['id']}")
            print(f"title: {row['title']}")
            print(f"status: {row['status']}")
            print(f"epic: {row['epic_id']}")
            print(f"version: {row['version_id']}")
            print(f"ready: {bool(row['ready'])}")
            print(f"done_when: {row['done_when']}")
            if row["summary"]:
                print(f"\n--- summary ---\n{row['summary']}")
            else:
                print("\n(summary not set — run backfill_summaries.py)")
            return 0
        print(row["body_markdown"] or "")
        for label, col in [
            ("intent_acceptance", "intent_acceptance"),
            ("intent_why", "intent_why"),
            ("plan_approach", "plan_approach"),
        ]:
            if row[col]:
                print(f"\n--- {label} ---\n{row[col]}")
    finally:
        conn.close()
    return 0


def cmd_search(args) -> int:
    root = _root(args)
    table, _ = ENTITY_TABLE.get(args.entity, ("user_stories", "id"))
    conn = connect(root)
    needle = f"%{args.query}%"
    try:
        if table == "user_stories":
            rows = conn.execute(
                """
                SELECT id, title, status FROM user_stories
                WHERE title LIKE ? OR summary LIKE ? OR intent_why LIKE ?
                ORDER BY id
                """,
                (needle, needle, needle),
            )
        else:
            rows = conn.execute(
                f"SELECT id, title, status FROM {table} WHERE title LIKE ? OR summary LIKE ? ORDER BY id",
                (needle, needle),
            )
        for row in rows:
            print(f"{row['id']}\t{row['title']}\t{row['status']}")
    finally:
        conn.close()
    return 0


def cmd_create_us(args) -> int:
    root = _root(args)
    bootstrap(root)
    story_id = next_user_story_id(root)
    title = args.title
    body = US_TEMPLATE_BODY.format(
        id=story_id,
        title=title,
        title_lower=title.lower(),
        version=args.version,
        epic=args.epic,
    )
    fm = {
        "id": story_id,
        "title": title,
        "epic": args.epic,
        "version": args.version,
        "status": "❌",
        "moscow": args.moscow,
        "depends_on": "[]",
        "ready": "false",
        "done_when": args.done_when,
        "tests": "required",
        "tests_status": "pending",
    }
    conn = connect(root)
    try:
        upsert_user_story(conn, fm, body, extract_us_sections(body), [])
        conn.commit()
    finally:
        conn.close()
    record_board_snapshot(root)
    print(story_id)
    return 0


def cmd_update_us(args) -> int:
    root = _root(args)
    if args.from_file:
        text = Path(args.from_file).read_text(encoding="utf-8")
    else:
        text = sys.stdin.read()
    if not text.strip():
        print("ERROR: empty input", file=sys.stderr)
        return 1
    fm, body, full = read_markdown_text(text)
    story_id = fm.get("id") or args.story_id
    if story_id != args.story_id:
        print("ERROR: frontmatter id mismatch", file=sys.stderr)
        return 1
    depends = parse_depends_on(fm.get("depends_on"))
    conn = connect(root)
    try:
        upsert_user_story(conn, fm, full, extract_us_sections(body), depends)
        conn.commit()
    except ValueError as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 1
    finally:
        conn.close()
    record_board_snapshot(root)
    print(f"Updated {story_id}")
    return 0


def cmd_set_ready(args) -> int:
    root = _root(args)
    conn = connect(root)
    try:
        conn.execute(
            "UPDATE user_stories SET ready = ?, updated_at = datetime('now') WHERE id = ?",
            (1 if args.ready == "true" else 0, args.story_id),
        )
        conn.commit()
    finally:
        conn.close()
    record_board_snapshot(root)
    return 0


def cmd_set_summary(args) -> int:
    root = _root(args)
    conn = connect(root)
    try:
        ok = set_summary(conn, "user_stories", args.story_id, args.text)
        if not ok:
            print(f"ERROR: {args.story_id} not found", file=sys.stderr)
            return 1
        conn.commit()
    finally:
        conn.close()
    print(f"Summary set for {args.story_id}")
    return 0


def cmd_delete_us(args) -> int:
    root = _root(args)
    conn = connect(root)
    try:
        conn.execute("DELETE FROM sprint_stories WHERE story_id = ?", (args.story_id,))
        conn.execute("DELETE FROM user_stories WHERE id = ?", (args.story_id,))
        conn.commit()
    finally:
        conn.close()
    record_board_snapshot(root)
    return 0


def cmd_implement_gate(args) -> int:
    from meridian_implement_gate import check_implement_gate

    result = check_implement_gate(_root(args), args.story_id)
    if args.json:
        print(json.dumps(result, ensure_ascii=False, indent=2))
    else:
        for check in result["checks"]:
            mark = "PASS" if check["passed"] else "FAIL"
            detail = check.get("detail") or ""
            print(f"{mark}\t{check['name']}\t{detail}")
        if result["ok"]:
            print(f"OK: implement gate passed for {args.story_id}")
        else:
            print(f"BLOCKED: cannot implement {args.story_id}", file=sys.stderr)
    return 0 if result["ok"] else 1


def main() -> int:
    import argparse

    parser = argparse.ArgumentParser(
        description="Meridian DB CLI — see .agent/references/templates/sqlite-delivery-operations.md"
    )
    parser.add_argument("--package-root", default=".")
    sub = parser.add_subparsers(dest="command", required=True)

    counts = sub.add_parser("counts", help="Row counts per delivery table")
    counts.set_defaults(func=cmd_counts)

    list_p = sub.add_parser("list", help="List entities (tab-separated)")
    list_p.add_argument("entity", choices=sorted(set(ENTITY_TABLE.keys())))
    list_p.add_argument("--status")
    list_p.add_argument("--version")
    list_p.add_argument("--epic")
    list_p.add_argument("--ready", choices=["true", "false"])
    list_p.set_defaults(func=cmd_list)

    show = sub.add_parser("show", help="Show US summary or --full body")
    show.add_argument("story_id")
    show.add_argument("--full", action="store_true")
    show.set_defaults(func=cmd_show)

    search = sub.add_parser("search", help="Search title/summary")
    search.add_argument("query")
    search.add_argument("--entity", default="user_stories")
    search.set_defaults(func=cmd_search)

    create = sub.add_parser("create-us")
    create.add_argument("--title", required=True)
    create.add_argument("--epic", required=True)
    create.add_argument("--version", required=True)
    create.add_argument("--moscow", default="Must")
    create.add_argument("--done-when", default="TBD")
    create.set_defaults(func=cmd_create_us)

    update = sub.add_parser("update-us", help="Upsert US from markdown file or stdin")
    update.add_argument("story_id")
    update.add_argument("--from-file")
    update.set_defaults(func=cmd_update_us)

    ready = sub.add_parser("set-ready")
    ready.add_argument("story_id")
    ready.add_argument("--ready", choices=["true", "false"], default="true")
    ready.set_defaults(func=cmd_set_ready)

    summary = sub.add_parser("set-summary")
    summary.add_argument("story_id")
    summary.add_argument("--text", required=True)
    summary.set_defaults(func=cmd_set_summary)

    delete = sub.add_parser("delete-us")
    delete.add_argument("story_id")
    delete.set_defaults(func=cmd_delete_us)

    gate = sub.add_parser("implement-gate", help="Check /implement-us gate for a US")
    gate.add_argument("story_id")
    gate.add_argument("--json", action="store_true")
    gate.set_defaults(func=cmd_implement_gate)

    args = parser.parse_args()
    if args.command != "create-us" and not db_exists(args.package_root):
        print("ERROR: meridian.db not found — run bootstrap_meridian_db.py .", file=sys.stderr)
        return 1
    return args.func(args)


if __name__ == "__main__":
    raise SystemExit(main())
