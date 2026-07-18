#!/usr/bin/env python3
"""Generate docs/kanban/board.json from SQLite user stories (US-0110)."""

from __future__ import annotations

import sys
from pathlib import Path

_SCRIPT_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(_SCRIPT_DIR))

from meridian_db import bootstrap, db_exists, write_board_json  # noqa: E402


def main() -> int:
    import argparse

    parser = argparse.ArgumentParser(description="Generate board.json from SQLite")
    parser.add_argument("package_root", nargs="?", default=".")
    args = parser.parse_args()
    root = Path(args.package_root).resolve()

    if not db_exists(root):
        print("ERROR: meridian.db not found — run bootstrap_meridian_db.py first.", file=sys.stderr)
        return 1

    bootstrap(root)
    count = write_board_json(root)
    print(f"Wrote {count} stories to docs/kanban/board.json")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
