#!/usr/bin/env python3
"""Backfill ## Context & constraints and related sections on legacy user stories."""

from __future__ import annotations

import re
import sys
from pathlib import Path

_SCRIPT_DIR = Path(__file__).resolve().parent
if str(_SCRIPT_DIR) not in sys.path:
    sys.path.insert(0, str(_SCRIPT_DIR))

from meridian_section_contracts import extract_section_body  # noqa: E402

EPIC_ARCH_REFS: dict[str, list[str]] = {
    "EPIC-01": [
        "docs/05_architecture.md — Monorepo layout and app-desktop shell",
        "docs/01_tech_stack.md — Vite, React, TypeScript, Tailwind",
    ],
    "EPIC-02": [
        "docs/05_architecture.md — Project folder access and docs/ layout",
        "docs/04_principles.md — Docs-first and local-first operation",
    ],
    "EPIC-03": [
        "docs/05_architecture.md — Phase documents and governance flow",
        "docs/11_decisions.md — Decision log structure",
    ],
    "EPIC-04": [
        "docs/05_architecture.md — Monitor, kanban and project loader",
        "docs/epics/EPIC-04.md — Kanban and user story boundaries",
    ],
    "EPIC-05": [
        "docs/05_architecture.md — Editor integration and disk writes",
        "docs/02_security.md — Local file access and agent boundaries",
    ],
    "EPIC-06": [
        "docs/05_architecture.md — CLI and script invocation from app",
        "docs/08_environments.md — Local development commands",
    ],
    "EPIC-07": [
        "docs/05_architecture.md — Tauri shell and sidecar layout",
        "docs/01_tech_stack.md — Native wrapper decision",
    ],
    "EPIC-08": [
        "docs/05_architecture.md — Packaging and distribution",
        "docs/08_environments.md — Release environments",
    ],
    "EPIC-09": [
        "docs/05_architecture.md — AI workflow integration",
        "docs/02_security.md — Agent safety and secrets handling",
    ],
    "EPIC-10": [
        "docs/00_scope.md — Shared workspace vision boundaries",
        "docs/02_security.md — Threat model for multi-user scenarios",
    ],
}

SECURITY_EPICS = {"EPIC-05", "EPIC-09", "EPIC-10"}
DOC_EPICS = {"EPIC-03", "EPIC-07", "EPIC-10"}
TESTS_GENERIC_MARKERS = (
    "add when implementation scope is known",
    "verify acceptance criteria end-to-end",
)


def parse_frontmatter(text: str) -> tuple[dict[str, str], str, str]:
    if not text.startswith("---\n"):
        return {}, "", text
    end = text.find("\n---", 4)
    if end == -1:
        return {}, "", text
    fm: dict[str, str] = {}
    for line in text[4:end].splitlines():
        if ":" not in line:
            continue
        key, value = line.split(":", 1)
        fm[key.strip()] = value.strip()
    body = text[end + 4 :].lstrip("\n")
    raw_fm = text[: end + 4]
    return fm, raw_fm, body


def serialize_frontmatter(fm: dict[str, str], raw_fm: str) -> str:
    lines = raw_fm.rstrip("\n").splitlines()
    if "ready" in fm:
        lines = [line for line in lines if not line.startswith("ready:")]
        insert_at = len(lines)
        for index, line in enumerate(lines):
            if line.startswith("tests_status:"):
                insert_at = index + 1
                break
        lines.insert(insert_at, f"ready: {fm['ready']}")
    return "\n".join(lines) + "\n"


def list_h2(body: str) -> list[str]:
    return re.findall(r"^## (.+)$", body, re.MULTILINE)


def extract_bullets(section: str | None, limit: int = 4) -> list[str]:
    if not section:
        return []
    bullets: list[str] = []
    for line in section.splitlines():
        stripped = line.strip()
        if stripped.startswith("- "):
            text = stripped[2:].strip()
            text = re.sub(r"^\[[ x]\]\s*", "", text)
            if text and not text.startswith("_("):
                bullets.append(text)
        if len(bullets) >= limit:
            break
    return bullets


def extract_file_paths(body: str) -> list[str]:
    tech = extract_section_body(body, "Technical implementation")
    if not tech:
        return []
    files_section = re.search(
        r"^### Files\s*$([\s\S]*?)(?=^### |\Z)", tech, re.MULTILINE
    )
    chunk = files_section.group(1) if files_section else tech
    paths: list[str] = []
    for line in chunk.splitlines():
        match = re.search(r"`([^`]+)`", line)
        if match and "/" in match.group(1):
            paths.append(match.group(1))
    return paths[:6]


def infer_api_db_impact(epic: str, acceptance: str | None) -> str:
    lowered = (acceptance or "").lower()
    if epic in DOC_EPICS or any(
        token in lowered
        for token in ("docs/", "05_architecture", "decision", "markdown", "template")
    ):
        return "- Documentation-only — no API or database changes."
    if "api" in lowered or "endpoint" in lowered:
        return "- Review `docs/07_api_contracts.md` before implementation."
    if "database" in lowered or "migration" in lowered or "supabase" in lowered:
        return "- Review `docs/06_database.md` and add migration if schema changes."
    return "- _n/a_ — no API or database impact expected."


def infer_security_notes(epic: str, acceptance: str | None) -> str:
    if epic in SECURITY_EPICS:
        return "- Follow `docs/02_security.md` — local file access, secrets, and agent write boundaries."
    lowered = (acceptance or "").lower()
    if any(token in lowered for token in ("auth", "secret", "security", "write")):
        return "- Cross-check `docs/02_security.md` for file writes and secrets."
    return "- _n/a_"


def build_context_section(
    fm: dict[str, str],
    body: str,
    epic_id: str,
    epic_path: Path | None,
) -> str:
    acceptance = extract_section_body(body, "Acceptance")
    arch_refs = EPIC_ARCH_REFS.get(
        epic_id,
        ["docs/05_architecture.md — Relevant app boundaries for this story"],
    )
    if epic_path and epic_path.exists():
        arch_refs = arch_refs + [f"docs/epics/{epic_id}.md — Epic scope and out-of-scope"]

    file_paths = extract_file_paths(body)
    acceptance_bullets = extract_bullets(acceptance, limit=3)

    hints: list[str] = []
    if file_paths:
        hints.append(f"- Primary files: {', '.join(f'`{p}`' for p in file_paths[:3])}.")
    elif fm.get("status") == "✅":
        hints.append("- Delivered scope recorded under `## Technical implementation`.")
    else:
        hints.append(f"- Scope: {fm.get('title', 'see acceptance')} under `{fm.get('version', 'v?')}`.")
    for bullet in acceptance_bullets[:2]:
        hints.append(f"- {bullet}")

    lines = [
        "## Context & constraints",
        "",
        "### Architecture refs",
    ]
    lines.extend(f"- {ref}" for ref in arch_refs[:3])
    lines.extend(
        [
            "",
            "### API / DB impact",
            infer_api_db_impact(epic_id, acceptance),
            "",
            "### Security notes",
            infer_security_notes(epic_id, acceptance),
            "",
            "### Related decisions",
            "- _n/a_ — log in `docs/decisions/` if scope or acceptance changes.",
            "",
            "### Implementation hints (preliminary)",
            *hints,
            "",
        ]
    )
    return "\n".join(lines)


def insert_after_heading(body: str, heading: str, insertion: str) -> str:
    pattern = re.compile(rf"^## {re.escape(heading)}\s*$", re.MULTILINE)
    match = pattern.search(body)
    if not match:
        return insertion + "\n\n" + body
    start = match.end()
    rest = body[start:]
    next_heading = re.search(r"^## ", rest, re.MULTILINE)
    end = start + next_heading.start() if next_heading else len(body)
    return body[:end].rstrip() + "\n\n" + insertion.rstrip() + "\n\n" + body[end:].lstrip("\n")


def append_section(body: str, heading: str, content: str) -> str:
    if heading in list_h2(body):
        return body
    return body.rstrip() + f"\n\n## {heading}\n\n{content.strip()}\n"


def fix_generic_tests(body: str, fm: dict[str, str]) -> str:
    planned_match = re.search(
        r"^(## Tests\s*\n[\s\S]*?^### Planned\s*$)([\s\S]*?)(?=^### |\Z)",
        body,
        re.MULTILINE,
    )
    if not planned_match:
        return body
    planned = planned_match.group(2)
    lowered = planned.lower()
    if not any(marker in lowered for marker in TESTS_GENERIC_MARKERS):
        return body

    acceptance = extract_section_body(body, "Acceptance") or ""
    bullets = extract_bullets(acceptance, limit=4)
    version = fm.get("version", "")
    story_id = fm.get("id", "")

    new_items: list[str] = []
    for index, bullet in enumerate(bullets[:3], start=1):
        new_items.append(f"- [ ] **manual** — {index}. {bullet}")
    if not new_items:
        new_items = [
            f"- [ ] **manual** — 1. Walk through acceptance for {story_id}.",
            f"- [ ] **manual** — 2. Run `python3 .agent/scripts/validate_meridian.py app-desktop`.",
        ]
    if fm.get("status") != "✅" and version in ("v0", "v1"):
        new_items.append("- [ ] **build** — `cd app-desktop && pnpm build` exits 0.")

    replacement = planned_match.group(1) + "\n".join(new_items) + "\n\n"
    return body[: planned_match.start()] + replacement + body[planned_match.end() :]


def migrate_story(path: Path, epics_dir: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    fm, raw_fm, body = parse_frontmatter(text)
    if not fm.get("id"):
        return False

    changed = False
    epic_id = fm.get("epic", "")
    epic_path = epics_dir / f"{epic_id}.md" if epic_id else None

    if "Context & constraints" not in list_h2(body):
        context = build_context_section(fm, body, epic_id, epic_path)
        body = insert_after_heading(body, "Acceptance", context)
        changed = True

    if fm.get("status") == "✅":
        if "Out of scope for this story" not in list_h2(body):
            body = append_section(
                body,
                "Out of scope for this story",
                f"- Boundaries defined in `docs/epics/{epic_id}.md` and parent version `{fm.get('version', '')}`.",
            )
            changed = True
        if "Notes" not in list_h2(body):
            body = append_section(
                body,
                "Notes",
                f"- Completed story — delivery record in `## Technical implementation`. Version: `{fm.get('version', '')}`.",
            )
            changed = True
    else:
        fixed = fix_generic_tests(body, fm)
        if fixed != body:
            body = fixed
            changed = True
        if fm.get("status") == "❌" and fm.get("ready") != "true":
            fm["ready"] = "true"
            changed = True

    if not changed:
        return False

    if "ready" in fm:
        raw_fm = serialize_frontmatter(fm, raw_fm)
    path.write_text(raw_fm + "\n" + body.lstrip("\n"), encoding="utf-8")
    return True


def main() -> int:
    root = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else Path.cwd()
    us_dir = root / "docs" / "us"
    epics_dir = root / "docs" / "epics"
    if not us_dir.is_dir():
        print(f"Missing {us_dir}")
        return 1

    updated = 0
    for path in sorted(us_dir.glob("US-*.md")):
        if migrate_story(path, epics_dir):
            updated += 1
            print(f"updated {path.name}")

    print(f"Migrated {updated} user stories.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
