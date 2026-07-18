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

_SCRIPT_DIR = Path(__file__).resolve().parent
_LIB_DIR = _SCRIPT_DIR / "lib"
if str(_LIB_DIR) not in sys.path:
    sys.path.insert(0, str(_LIB_DIR))

from meridian_section_contracts import (  # noqa: E402
    extract_section_body,
    validate_epic_structure,
    validate_us_structure,
    validate_version_structure,
)
from meridian_db import db_exists  # noqa: E402


PHASE_DOCS = [
    "00_scope.md",
    "01_tech_stack.md",
    "02_security.md",
    "03_user_types.md",
    "04_principles.md",
    "05_architecture.md",
    "06_database.md",
    "07_api_contracts.md",
    "08_environments.md",
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
    "scrum-master.md",
    "product-owner.md",
    "technical-writer.md",
    "security-champion.md",
    "technical-architect.md",
    "design-system-owner.md",
    "sprint-planner.md",
    "backlog-refiner.md",
    "developer.md",
]

DEPRECATED_AGENT_FILES = [
    "process-manager.md",
    "board-keeper.md",
    "scope-architect.md",
    "documentation-strategist.md",
    "architecture-guardian.md",
    "security-steward.md",
]

DEPRECATED_AGENT_SLUGS = [name.removesuffix(".md") for name in DEPRECATED_AGENT_FILES]

# Paths under .agent/ that may mention old slugs (historical plans only)
DEPRECATED_SLUG_SCAN_SKIP_PREFIXES = (
    "references/plans/",
)

H2_SCAN_REL_PREFIXES = (
    "agents/",
    "workflows/",
    "skills/",
    "rules/",
    "references/",
)

H2_SCAN_EXTRA_PATHS = (
    "app-visual-studio/README.md",
    "app-visual-studio/src/help-webview-html.ts",
    "app-visual-studio/src/command-catalog.ts",
)

H2_LEGACY_LINE_MARKERS = (
    "deprecated",
    "legacy",
    "alias",
    "substitui",
    "evitar (v1)",
    "replaced-by",
    "h1",
    "h2",
    "→",
    "until h2",
    "até h2",
)


def _line_mentions_deprecated_slug(line: str, slug: str) -> bool:
    if slug not in line:
        return False
    if any(marker in line.lower() for marker in H2_LEGACY_LINE_MARKERS):
        return False
    return True


def validate_deprecated_agents_removed(
    kit_root: Path,
    errors: list[str],
) -> None:
    """Ensure legacy agent files and operational slug refs are gone (H2/H3)."""
    agent_dir = kit_root / ".agent"
    if not agent_dir.is_dir():
        return

    deprecated_present = [
        name
        for name in DEPRECATED_AGENT_FILES
        if (agent_dir / "agents" / name).exists()
    ]
    if deprecated_present:
        errors.append(
            "Deprecated agent files still present: "
            + ", ".join(deprecated_present)
            + " — delete; v11 roster only"
        )

    violations: list[str] = []

    def scan_file(path: Path, rel: str) -> None:
        if any(rel.startswith(prefix) for prefix in DEPRECATED_SLUG_SCAN_SKIP_PREFIXES):
            return
        try:
            lines = path.read_text(encoding="utf-8").splitlines()
        except OSError:
            return
        for line_no, line in enumerate(lines, start=1):
            for slug in DEPRECATED_AGENT_SLUGS:
                if _line_mentions_deprecated_slug(line, slug):
                    violations.append(f"{rel}:{line_no}: legacy slug `{slug}`")
                    break

    for prefix in H2_SCAN_REL_PREFIXES:
        base = agent_dir / prefix.rstrip("/")
        if not base.is_dir():
            continue
        for path in sorted(base.rglob("*.md")):
            rel = path.relative_to(agent_dir).as_posix()
            scan_file(path, rel)

    for extra in H2_SCAN_EXTRA_PATHS:
        path = kit_root / extra
        if path.is_file():
            scan_file(path, extra)

    if violations:
        sample = "; ".join(violations[:8])
        suffix = f" (+{len(violations) - 8} more)" if len(violations) > 8 else ""
        errors.append(
            f"Legacy agent slug in operational docs ({len(violations)}): "
            f"{sample}{suffix}"
        )


KIT_MD_LEGACY_ALLOWLIST_SUFFIXES = (
    "references/templates/sqlite-delivery-operations.md",
    "references/templates/board-schema.md",
    "references/plans/kit-improvement-plan.md",
    "references/plans/markdown-audit-v11.md",
    "references/plans/agent-roster-and-workflow-v11.md",
    "MERIDIAN_V2_CUTOVER.md",
    "references/scrum-meridian-map.md",
    "references/start-here.md",
    *{f"agents/{name}" for name in DEPRECATED_AGENT_FILES},
)

KIT_MD_LINE_ALLOW_MARKERS = (
    "never",
    "do not",
    "don't",
    "não",
    "legacy",
    "v1-old",
    "removed",
    "superseded",
    "**no**",
    "not ",
    "proib",
    "anti-pattern",
    "evitar",
    "avoid",
    "→",
    "substitui",
    "sem ",
    "without ",
    "_(removido",
    "branch ",
)

KIT_MD_P0_PATTERNS: list[tuple[re.Pattern[str], str]] = [
    (re.compile(r"validate_meridian\.py\s+app-desktop"), "validate app-desktop"),
    (re.compile(r"/sync-board"), "sync-board command"),
    (re.compile(r"generate-board-json"), "generate-board-json skill"),
    (re.compile(r"must match filename"), "must match filename"),
    (
        re.compile(
            r"(?i)(write|create|edit|open|glob).{0,80}docs/(us|epics|versions|sprints)/"
        ),
        "docs delivery folder as write path",
    ),
]

KIT_MD_APP_DESKTOP_BAD = re.compile(r"app-desktop")


def _kit_md_path_allowed(rel_posix: str) -> bool:
    rel = rel_posix.replace("\\", "/")
    if rel.startswith("references/plans/"):
        return True
    for allowed in KIT_MD_LEGACY_ALLOWLIST_SUFFIXES:
        if rel == allowed or rel.endswith("/" + allowed):
            return True
    return False


def _kit_md_line_allowed(line: str) -> bool:
    # Strip inline markdown so "Do **not**" matches "do not"
    plain = re.sub(r"\*+|`+", "", line).lower()
    return any(marker in plain for marker in KIT_MD_LINE_ALLOW_MARKERS)


def validate_kit_markdown_v11(
    kit_root: Path,
    errors: list[str],
    warnings: list[str],
    *,
    strict: bool,
) -> None:
    """G6 — flag v1 delivery paths and dead commands in kit markdown."""
    agent_dir = kit_root / ".agent"
    if not agent_dir.is_dir():
        return

    violations: list[str] = []

    def scan_file(path: Path, rel: str) -> None:
        if _kit_md_path_allowed(rel):
            return
        try:
            lines = path.read_text(encoding="utf-8").splitlines()
        except OSError:
            return
        for line_no, line in enumerate(lines, start=1):
            if _kit_md_line_allowed(line):
                continue
            for pattern, label in KIT_MD_P0_PATTERNS:
                if pattern.search(line):
                    violations.append(f"{rel}:{line_no}: {label}")
                    break
            else:
                if KIT_MD_APP_DESKTOP_BAD.search(line) and not _kit_md_line_allowed(line):
                    violations.append(f"{rel}:{line_no}: app-desktop as active product")

    scan_roots = [
        agent_dir / "references",
        agent_dir / "agents",
        agent_dir / "workflows",
        agent_dir / "skills",
        agent_dir / "rules",
    ]
    for base in scan_roots:
        if not base.is_dir():
            continue
        for path in sorted(base.rglob("*.md")):
            rel = path.relative_to(agent_dir).as_posix()
            scan_file(path, rel)

    docs_dir = kit_root / "docs"
    if docs_dir.is_dir():
        for path in sorted(docs_dir.rglob("*.md")):
            rel = path.relative_to(kit_root).as_posix()
            scan_file(path, rel)

    if violations:
        sample = "; ".join(violations[:8])
        suffix = f" (+{len(violations) - 8} more)" if len(violations) > 8 else ""
        msg = f"Kit markdown v11 ({len(violations)}): {sample}{suffix}"
        if strict:
            errors.append(msg)
        else:
            warnings.append(msg)


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


def validate_codex_adapter(repo_root: Path, warnings: list[str]) -> None:
    skills = repo_root / ".agents" / "skills"
    codex = repo_root / ".codex"
    if not skills.is_dir():
        warnings.append("Missing .agents/skills/ — run .agent/scripts/sync_cursor_kit.sh for Codex.")
        return
    if not codex.is_dir():
        warnings.append("Missing .codex/ — run sync_cursor_kit.sh for Codex subagents.")
        return
    agents_dir = codex / "agents"
    if not agents_dir.is_dir():
        warnings.append("Missing .codex/agents/ — run sync_cursor_kit.sh")


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


CONTEXT_PLACEHOLDER_MARKERS = (
    "_(fill in",
    "_(pending)_",
    "§ [section name",
    "§ …",
    "path/to/…",
    "add when implementation scope is known",
)

TESTS_GENERIC_MARKERS = (
    "add when implementation scope is known",
    "verify acceptance criteria end-to-end",
)


def read_markdown_body(path: Path) -> str:
    text = path.read_text(encoding="utf-8")
    if not text.startswith("---\n"):
        return text
    end = text.find("\n---", 4)
    if end == -1:
        return text
    return text[end + 4 :].lstrip("\n")


def is_mostly_placeholder(section: str, markers: tuple[str, ...] = CONTEXT_PLACEHOLDER_MARKERS) -> bool:
    lowered = section.lower()
    substantive = [
        line.strip()
        for line in section.splitlines()
        if line.strip()
        and not line.strip().startswith("#")
        and not line.strip().startswith(">")
        and line.strip() not in ("- _n/a_", "_n/a_")
    ]
    if not substantive:
        return True
    hits = sum(1 for marker in markers if marker.lower() in lowered)
    return hits >= max(1, len(substantive) // 2)


def validate_us_semantics(
    story_name: str,
    status: str | None,
    frontmatter: dict[str, str],
    story_text: str,
    errors: list[str],
    warnings: list[str],
    legacy_missing_context: list[str],
) -> None:
    if status == "✅":
        record = extract_section_body(story_text, "Record")
        if record and is_mostly_placeholder(record):
            warnings.append(
                f"{story_name}: status ✅ but ## Record looks like a placeholder."
            )
        return

    if status == "🧊":
        return

    if status not in ("❌", "🔶"):
        return

    ready = frontmatter.get("ready", "").lower()
    has_ready_field = "ready" in frontmatter
    plan = extract_section_body(story_text, "Plan")

    if plan is None:
        if has_ready_field:
            warnings.append(
                f"{story_name}: missing ## Plan — run /refine-us before implement."
            )
        else:
            legacy_missing_context.append(story_name)
    elif is_mostly_placeholder(plan):
        warnings.append(
            f"{story_name}: ## Plan not filled — run /refine-us before implement."
        )

    if has_ready_field and ready != "true":
        errors.append(
            f"{story_name}: ready is not true — run /refine-us before /implement-us."
        )

    planned_match = re.search(
        r"^### Planned\s*$([\s\S]*?)(?=^### |\Z)",
        story_text,
        re.MULTILINE,
    )
    planned = planned_match.group(1).strip() if planned_match else None
    if planned:
        lowered = planned.lower()
        if "add when" in lowered or (
            "verify acceptance criteria end-to-end" in lowered
            and not re.search(r"^\d+\.", planned, re.MULTILINE)
        ):
            warnings.append(
                f"{story_name}: Tests/Planned still generic — run /refine-us with concrete steps."
            )


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
    argv = sys.argv[1:]
    json_output = False
    h2_ready = False
    strict_kit_md = False
    if "--json" in argv:
        json_output = True
        argv = [arg for arg in argv if arg != "--json"]
    if "--h2-ready" in argv:
        h2_ready = True
        argv = [arg for arg in argv if arg != "--h2-ready"]
    if "--strict-kit-md" in argv:
        strict_kit_md = True
        argv = [arg for arg in argv if arg != "--strict-kit-md"]

    root = Path(argv[0]).resolve() if argv else Path.cwd()
    docs = root / "docs"
    sqlite_delivery = db_exists(root)
    errors: list[str] = []
    warnings: list[str] = []

    kit_root: Path | None = None
    if (root / ".agent" / "MERIDIAN.md").exists():
        kit_root = root
    elif (root.parent / ".agent" / "MERIDIAN.md").exists():
        kit_root = root.parent
    if kit_root is not None:
        if not (kit_root / "README.md").exists():
            warnings.append("Missing README.md at kit repository root.")
        validate_agent_kit(kit_root, errors, warnings)
        validate_deprecated_agents_removed(kit_root, errors)
        validate_kit_markdown_v11(kit_root, errors, warnings, strict=strict_kit_md)
        validate_cursor_adapter(kit_root, warnings)
        validate_codex_adapter(kit_root, warnings)

    architecture_approved = False
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

        architecture_path = docs / "05_architecture.md"
        if architecture_path.exists():
            architecture_approved = read_frontmatter(architecture_path).get("status") == "approved"

    us_dir = docs / "us"
    epics_dir = docs / "epics"
    versions_dir = docs / "versions"
    sprints_dir = docs / "sprints"
    decisions_dir = docs / "decisions"
    board_path = docs / "kanban" / "board.json"
    story_ids: set[str] = set()
    epic_ids: set[str] = set()
    version_ids: set[str] = set()

    if versions_dir.exists():
        for version_path in sorted(versions_dir.glob("v*.md")):
            if not re.match(r"v\d+(\.\d+)*\.md$", version_path.name):
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
                    f"{version_path.name}: id {version_id} does not match filename"
                )
            if not re.match(r"^v\d+(\.\d+)*$", str(version_id)):
                errors.append(f"{version_path.name}: id must use vX or vX.Y format")
            if not frontmatter.get("outcome"):
                errors.append(f"Missing outcome in {version_path.name}")
            if not frontmatter.get("title"):
                errors.append(f"Missing title in {version_path.name}")
            validate_version_structure(
                version_path.name,
                read_markdown_body(version_path),
                errors,
                warnings,
            )
    else:
        if not sqlite_delivery:
            errors.append("Missing docs/versions/ directory.")

    if sprints_dir.exists():
        for sprint_path in sorted(sprints_dir.glob("v*-S*.md")):
            if not re.match(r"v\d+(\.\d+)*-S\d+\.md$", sprint_path.name):
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
                    f"{sprint_path.name}: id {sprint_id} does not match filename"
                )
            if version_ref and version_ids and version_ref not in version_ids:
                errors.append(
                    f"{sprint_path.name}: version {version_ref} does not exist in docs/versions/"
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
                    f"{epic_path.name}: id {epic_id} does not match filename"
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
                            f"{epic_path.name}: versions references unknown {version_ref}"
                        )
            validate_epic_structure(
                epic_path.name,
                read_markdown_body(epic_path),
                errors,
                warnings,
            )
    else:
        if not sqlite_delivery:
            errors.append("Missing docs/epics/ directory.")

    if decisions_dir.is_dir():
        for decision_path in sorted(decisions_dir.glob("*.json")):
            if not re.match(r"\d{4}-\d{2}-\d{2}\.json$", decision_path.name):
                errors.append(f"Invalid decision filename: {decision_path.name}")
                continue
            try:
                payload = json.loads(decision_path.read_text(encoding="utf-8"))
            except json.JSONDecodeError as exc:
                errors.append(f"Invalid JSON in {decision_path.name}: {exc}")
                continue
            if not isinstance(payload, dict):
                errors.append(f"{decision_path.name}: root must be an object")
                continue
            date = payload.get("date")
            if not date:
                errors.append(f"Missing date in {decision_path.name}")
            elif date != decision_path.stem:
                errors.append(
                    f"{decision_path.name}: date {date} does not match filename"
                )
            elif not re.match(r"^\d{4}-\d{2}-\d{2}$", str(date)):
                errors.append(f"{decision_path.name}: date must use YYYY-MM-DD format")
            entries = payload.get("entries")
            if not isinstance(entries, list):
                errors.append(f"{decision_path.name}: entries must be an array")
                continue
            if not entries:
                warnings.append(f"{decision_path.name}: no entries in entries array")
            for index, entry in enumerate(entries):
                if not isinstance(entry, dict):
                    errors.append(f"{decision_path.name}: entries[{index}] must be an object")
                    continue
                time = entry.get("time")
                title = entry.get("title")
                if not time or not re.match(r"^\d{2}:\d{2}$", str(time)):
                    errors.append(
                        f"{decision_path.name}: entries[{index}].time must be HH:MM"
                    )
                if not title:
                    errors.append(
                        f"{decision_path.name}: entries[{index}].title is required"
                    )
                for field in (
                    "affected_document",
                    "what_changed",
                    "why_changed",
                    "impact",
                    "responsible",
                ):
                    if field not in entry:
                        errors.append(
                            f"{decision_path.name}: entries[{index}] missing {field}"
                        )
    else:
        errors.append("Missing docs/decisions/ directory.")

    if us_dir.exists():
        legacy_missing_context: list[str] = []
        for story in sorted(us_dir.glob("US-*.md")):
            match = re.match(r"US-\d{4}\.md$", story.name)
            if not match:
                errors.append(f"Invalid story filename: {story.name} (use US-XXXX with 4 digits)")
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
                        f"{story.name}: id {story_id} does not match filename"
                    )
                if not re.match(r"^US-\d{4}$", story_id):
                    errors.append(f"{story.name}: id must use US-XXXX format (4 digits)")
            else:
                errors.append(f"Missing id in {story}")
            if epic_ref and epic_ids and epic_ref not in epic_ids:
                errors.append(
                    f"{story.name}: epic {epic_ref} does not exist in docs/epics/"
                )
            if version_ref and version_ids and version_ref not in version_ids:
                errors.append(
                    f"{story.name}: version {version_ref} does not exist in docs/versions/"
                )
            story_text = story.read_text(encoding="utf-8")
            validate_us_structure(
                story.name,
                read_markdown_body(story),
                frontmatter,
                errors,
                warnings,
            )
            if status == "🔶" and "Missing:" not in story_text:
                errors.append(f"{story.name} is 🔶 but has no 'Missing:' in acceptance.")

            tests = frontmatter.get("tests")
            tests_status = frontmatter.get("tests_status")
            if tests not in (None, "required", "none"):
                errors.append(f"{story.name}: tests must be required or none.")
            if tests_status not in (None, "pending", "done", "n/a"):
                errors.append(f"{story.name}: tests_status must be pending, done or n/a.")
            effective_tests = tests if tests is not None else "required"
            effective_status = tests_status
            if effective_status is None:
                effective_status = "n/a" if effective_tests == "none" else "pending"
            if effective_tests == "none" and effective_status != "n/a":
                errors.append(f"{story.name}: tests none requires tests_status n/a.")
            if effective_tests == "required" and effective_status == "n/a":
                errors.append(f"{story.name}: tests required cannot use tests_status n/a.")
            if status == "✅" and effective_tests == "required" and effective_status == "pending":
                errors.append(
                    f"{story.name}: status ✅ requires tests_status done when tests required."
                )
            if effective_tests == "required" and "### Planned" not in story_text:
                errors.append(f"{story.name}: tests required needs ### Planned section.")

            validate_us_semantics(
                story.name,
                status,
                frontmatter,
                story_text,
                errors,
                warnings,
                legacy_missing_context,
            )

        if legacy_missing_context:
            sample = ", ".join(legacy_missing_context[:5])
            suffix = "…" if len(legacy_missing_context) > 5 else ""
            warnings.append(
                f"{len(legacy_missing_context)} open US without ## Plan "
                f"(legacy) — run /refine-us before implement: {sample}{suffix}"
            )

        if story_ids and not architecture_approved:
            errors.append(
                "User stories exist but 05_architecture.md is not approved (delivery gate)."
            )

    if board_path.exists():
        if sqlite_delivery:
            pass  # v11: board.json ignored when meridian.db exists
        else:
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
    elif story_ids and not sqlite_delivery:
        errors.append("Missing docs/kanban/board.json.")

    if json_output:
        payload = {
            "ok": len(errors) == 0,
            "project": str(root),
            "errors": errors,
            "warnings": warnings,
            "error_count": len(errors),
            "warning_count": len(warnings),
        }
        print(json.dumps(payload, indent=2, ensure_ascii=False))
        return 1 if errors else 0

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
