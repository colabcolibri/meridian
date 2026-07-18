#!/usr/bin/env python3
"""CLI for kit write operations against Meridian SQLite (US-0111)."""

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
    next_user_story_id,
    upsert_user_story,
    write_board_json,
)
from meridian_markdown_parse import extract_us_sections  # noqa: E402

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


def cmd_create_us(args) -> int:
    root = Path(args.package_root).resolve()
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
    print(story_id)
    return 0


def cmd_set_ready(args) -> int:
    root = Path(args.package_root).resolve()
    conn = connect(root)
    try:
        conn.execute(
            "UPDATE user_stories SET ready = ?, updated_at = datetime('now') WHERE id = ?",
            (1 if args.ready else 0, args.story_id),
        )
        conn.commit()
    finally:
        conn.close()
    write_board_json(root)
    return 0


def cmd_delete_us(args) -> int:
    root = Path(args.package_root).resolve()
    conn = connect(root)
    try:
        conn.execute("DELETE FROM sprint_stories WHERE story_id = ?", (args.story_id,))
        conn.execute("DELETE FROM user_stories WHERE id = ?", (args.story_id,))
        conn.commit()
    finally:
        conn.close()
    write_board_json(root)
    return 0


def main() -> int:
    import argparse

    parser = argparse.ArgumentParser(description="Meridian DB CLI for kit skills")
    parser.add_argument("--package-root", default=".")
    sub = parser.add_subparsers(dest="command", required=True)

    create = sub.add_parser("create-us")
    create.add_argument("--title", required=True)
    create.add_argument("--epic", required=True)
    create.add_argument("--version", required=True)
    create.add_argument("--moscow", default="Must")
    create.add_argument("--done-when", default="TBD")
    create.set_defaults(func=cmd_create_us)

    ready = sub.add_parser("set-ready")
    ready.add_argument("story_id")
    ready.add_argument("--ready", choices=["true", "false"], default="true")
    ready.set_defaults(func=cmd_set_ready)

    delete = sub.add_parser("delete-us")
    delete.add_argument("story_id")
    delete.set_defaults(func=cmd_delete_us)

    args = parser.parse_args()
    if not db_exists(args.package_root) and args.command != "create-us":
        print("ERROR: meridian.db not found", file=sys.stderr)
        return 1
    return args.func(args)


if __name__ == "__main__":
    raise SystemExit(main())
