#!/usr/bin/env python3
"""Validate basic Meridian project structure.

This script intentionally uses only the Python standard library so it can run in
fresh projects without dependency installation.
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path


PHASE_DOCS = [
    "00_scope.md",
    "01_tech_stack.md",
    "02_security.md",
    "03_user_types.md",
    "04_epics.md",
    "05_principles.md",
    "06_versions.md",
    "07_architecture.md",
    "08_database.md",
    "09_api_contracts.md",
    "10_environments.md",
    "11_decisions.md",
]


def read_frontmatter(path: Path) -> dict[str, str]:
    text = path.read_text(encoding="utf-8")
    if not text.startswith("---\n"):
        return {}
    end = text.find("\n---", 4)
    if end == -1:
        return {}
    data: dict[str, str] = {}
    for line in text[4:end].splitlines():
        if ":" not in line:
            continue
        key, value = line.split(":", 1)
        data[key.strip()] = value.strip()
    return data


def main() -> int:
    root = Path(sys.argv[1]) if len(sys.argv) > 1 else Path.cwd()
    docs = root / "docs"
    errors: list[str] = []
    warnings: list[str] = []

    if not (root / "meridian.md").exists() and not (root.parent / "meridian.md").exists():
        warnings.append("Missing meridian.md at project root.")

    if not docs.exists():
        errors.append("Missing docs/ directory.")
    else:
        for filename in PHASE_DOCS:
            path = docs / filename
            if not path.exists():
                errors.append(f"Missing docs/{filename}.")
                continue
            frontmatter = read_frontmatter(path)
            if "status" not in frontmatter:
                errors.append(f"Missing status frontmatter in docs/{filename}.")

    us_dir = docs / "us"
    board_path = docs / "kanban" / "board.json"
    story_ids: set[str] = set()

    if us_dir.exists():
        for story in sorted(us_dir.glob("US-*.md")):
            match = re.match(r"US-\d{3}\.md$", story.name)
            if not match:
                errors.append(f"Invalid story filename: {story}")
            frontmatter = read_frontmatter(story)
            story_id = frontmatter.get("id")
            status = frontmatter.get("status")
            if story_id:
                if story_id in story_ids:
                    errors.append(f"Duplicate story id: {story_id}")
                story_ids.add(story_id)
            else:
                errors.append(f"Missing id in {story}")
            if status == "🔶" and "Falta:" not in story.read_text(encoding="utf-8"):
                errors.append(f"{story.name} is 🔶 but has no 'Falta:' in acceptance.")

    if board_path.exists():
        try:
            board = json.loads(board_path.read_text(encoding="utf-8"))
            board_ids = {item.get("id") for item in board if isinstance(item, dict)}
            missing = story_ids - board_ids
            extra = board_ids - story_ids
            if missing:
                warnings.append(f"Stories missing from board.json: {sorted(missing)}")
            if extra:
                warnings.append(f"Board items without story file: {sorted(extra)}")
        except json.JSONDecodeError as exc:
            errors.append(f"Invalid board.json: {exc}")
    elif story_ids:
        errors.append("Missing docs/kanban/board.json.")

    for warning in warnings:
        print(f"WARN: {warning}")
    for error in errors:
        print(f"ERROR: {error}")

    if errors:
        print(f"Meridian validation failed with {len(errors)} error(s).")
        return 1
    print("Meridian validation passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
