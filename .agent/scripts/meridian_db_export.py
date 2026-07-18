#!/usr/bin/env python3
"""JSON export of delivery artifacts for IDE monitor."""

from __future__ import annotations

import json
import sys
from pathlib import Path

_SCRIPT_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(_SCRIPT_DIR))

from meridian_db import db_exists, export_delivery_json, export_planning_json  # noqa: E402


def main() -> int:
    import argparse

    parser = argparse.ArgumentParser(description="Export delivery data as JSON")
    parser.add_argument("package_root", nargs="?", default=".")
    parser.add_argument("--probe", action="store_true", help="Exit 0 if DB exists")
    parser.add_argument(
        "--format",
        choices=["raw", "planning"],
        default="raw",
        help="raw=markdown bodies; planning=structured for extension",
    )
    args = parser.parse_args()
    root = Path(args.package_root).resolve()

    if args.probe:
        return 0 if db_exists(root) else 1

    if not db_exists(root):
        print(json.dumps({"error": "meridian.db not found"}))
        return 1

    if args.format == "planning":
        print(json.dumps(export_planning_json(root), ensure_ascii=False))
    else:
        print(json.dumps(export_delivery_json(root), ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
