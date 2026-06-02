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


AGENT_KIT_PATHS = [
    "ARCHITECTURE.md",
    "MERIDIAN.md",
    "rules/MERIDIAN.md",
    "skills/doc.md",
    "skills/meridian-routing/SKILL.md",
    "skills/init-project/SKILL.md",
    "scripts/validate_meridian.py",
]

REQUIRED_AGENTS = [
    "process-manager.md",
    "scope-architect.md",
    "documentation-strategist.md",
    "security-steward.md",
    "architecture-guardian.md",
    "sprint-planner.md",
    "board-keeper.md",
]


def validate_cursor_adapter(repo_root: Path, warnings: list[str]) -> None:
    cursor = repo_root / ".cursor"
    if not cursor.is_dir():
        warnings.append("Missing .cursor/ — run .agent/scripts/sync_cursor_kit.sh for Cursor IDE.")
        return
    for sub in ("rules", "skills", "agents", "commands"):
        if not (cursor / sub).is_dir():
            warnings.append(f"Missing .cursor/{sub}/ — run sync_cursor_kit.sh")
    rule = cursor / "rules" / "meridian.mdc"
    if rule.exists() and "alwaysApply: true" not in rule.read_text(encoding="utf-8"):
        warnings.append(".cursor/rules/meridian.mdc should set alwaysApply: true")


def validate_agent_kit(repo_root: Path, errors: list[str], warnings: list[str]) -> None:
    agent_dir = repo_root / ".agent"
    if not agent_dir.is_dir():
        return
    for rel in AGENT_KIT_PATHS:
        if not (agent_dir / rel).exists():
            warnings.append(f"Missing .agent/{rel} in kit.")
    rules = agent_dir / "rules" / "MERIDIAN.md"
    if rules.exists() and "trigger: always_on" not in rules.read_text(encoding="utf-8"):
        warnings.append(".agent/rules/MERIDIAN.md missing trigger: always_on")
    agents_dir = agent_dir / "agents"
    if agents_dir.is_dir():
        for name in REQUIRED_AGENTS:
            if not (agents_dir / name).exists():
                warnings.append(f"Missing .agent/agents/{name}")


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
    root = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else Path.cwd()
    docs = root / "docs"
    errors: list[str] = []
    warnings: list[str] = []

    kit_root: Path | None = None
    if (root / "meridian.md").exists():
        kit_root = root
    elif (root.parent / "meridian.md").exists():
        kit_root = root.parent
    if kit_root is None:
        warnings.append("Missing meridian.md at project or parent root.")
    else:
        if not (kit_root / "README.md").exists():
            warnings.append("Missing README.md at kit repository root.")
        validate_agent_kit(kit_root, errors, warnings)
        validate_cursor_adapter(kit_root, warnings)

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
    epics_dir = docs / "epics"
    versions_dir = docs / "versions"
    sprints_dir = docs / "sprints"
    board_path = docs / "kanban" / "board.json"
    story_ids: set[str] = set()
    epic_ids: set[str] = set()
    version_ids: set[str] = set()

    if versions_dir.exists():
        for version_path in sorted(versions_dir.glob("v*.md")):
            if not re.match(r"v\d+\.md$", version_path.name):
                errors.append(f"Invalid version filename: {version_path.name}")
                continue
            frontmatter = read_frontmatter(version_path)
            version_id = frontmatter.get("id")
            if not version_id:
                errors.append(f"Missing id in {version_path.name}")
                continue
            if version_id in version_ids:
                errors.append(f"Duplicate version id: {version_id}")
            version_ids.add(version_id)
            if version_path.stem != version_id:
                errors.append(
                    f"{version_path.name}: id {version_id} não confere com o nome do arquivo"
                )
            if not re.match(r"^v\d+$", str(version_id)):
                errors.append(f"{version_path.name}: id deve usar formato vX")
            if not frontmatter.get("outcome"):
                errors.append(f"Missing outcome in {version_path.name}")
            if not frontmatter.get("title"):
                errors.append(f"Missing title in {version_path.name}")
    else:
        errors.append("Missing docs/versions/ directory.")

    if sprints_dir.exists():
        for sprint_path in sorted(sprints_dir.glob("v*-S*.md")):
            if not re.match(r"v\d+-S\d+\.md$", sprint_path.name):
                errors.append(f"Invalid sprint filename: {sprint_path.name}")
                continue
            frontmatter = read_frontmatter(sprint_path)
            sprint_id = frontmatter.get("id")
            version_ref = frontmatter.get("version")
            if not sprint_id:
                errors.append(f"Missing id in {sprint_path.name}")
                continue
            if sprint_path.stem != sprint_id:
                errors.append(
                    f"{sprint_path.name}: id {sprint_id} não confere com o nome do arquivo"
                )
            if version_ref and version_ids and version_ref not in version_ids:
                errors.append(
                    f"{sprint_path.name}: version {version_ref} não existe em docs/versions/"
                )

    if epics_dir.exists():
        for epic_path in sorted(epics_dir.glob("EPIC-*.md")):
            if not re.match(r"EPIC-\d+\.md$", epic_path.name):
                errors.append(f"Invalid epic filename: {epic_path.name}")
                continue
            frontmatter = read_frontmatter(epic_path)
            epic_id = frontmatter.get("id")
            if not epic_id:
                errors.append(f"Missing id in {epic_path.name}")
                continue
            if epic_id in epic_ids:
                errors.append(f"Duplicate epic id: {epic_id}")
            epic_ids.add(epic_id)
            if epic_path.stem != epic_id:
                errors.append(
                    f"{epic_path.name}: id {epic_id} não confere com o nome do arquivo"
                )
            if "status" not in frontmatter:
                errors.append(f"Missing status in {epic_path.name}")
            if not frontmatter.get("outcome"):
                errors.append(f"Missing outcome in {epic_path.name}")
            if not frontmatter.get("title"):
                errors.append(f"Missing title in {epic_path.name}")
            epic_versions = frontmatter.get("versions") or []
            if isinstance(epic_versions, list):
                for version_ref in epic_versions:
                    if version_ids and version_ref not in version_ids:
                        errors.append(
                            f"{epic_path.name}: versions referencia {version_ref} inexistente"
                        )
    else:
        errors.append("Missing docs/epics/ directory.")

    if us_dir.exists():
        for story in sorted(us_dir.glob("US-*.md")):
            match = re.match(r"US-\d{4}\.md$", story.name)
            if not match:
                errors.append(f"Invalid story filename: {story.name} (use US-XXXX com 4 dígitos)")
                continue
            frontmatter = read_frontmatter(story)
            story_id = frontmatter.get("id")
            status = frontmatter.get("status")
            epic_ref = frontmatter.get("epic")
            version_ref = frontmatter.get("version")
            if story_id:
                if story_id in story_ids:
                    errors.append(f"Duplicate story id: {story_id}")
                story_ids.add(story_id)
                if story.stem != story_id:
                    errors.append(
                        f"{story.name}: id {story_id} não confere com o nome do arquivo"
                    )
                if not re.match(r"^US-\d{4}$", story_id):
                    errors.append(f"{story.name}: id deve usar formato US-XXXX (4 dígitos)")
            else:
                errors.append(f"Missing id in {story}")
            if epic_ref and epic_ids and epic_ref not in epic_ids:
                errors.append(
                    f"{story.name}: epic {epic_ref} não existe em docs/epics/"
                )
            if version_ref and version_ids and version_ref not in version_ids:
                errors.append(
                    f"{story.name}: version {version_ref} não existe em docs/versions/"
                )
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
