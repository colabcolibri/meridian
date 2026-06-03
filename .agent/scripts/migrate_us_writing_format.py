#!/usr/bin/env python3
"""Upgrade US Context to Why / Where / Approach narrative format."""

from __future__ import annotations

import re
import sys
from pathlib import Path

_SCRIPT_DIR = Path(__file__).resolve().parent
if str(_SCRIPT_DIR) not in sys.path:
    sys.path.insert(0, str(_SCRIPT_DIR))

from meridian_section_contracts import (  # noqa: E402
    US_CONTEXT_H3,
    extract_section_body,
)

CANONICAL = list(US_CONTEXT_H3)


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
    return fm, text[: end + 4], body


def extract_h3(section: str | None, heading: str) -> str:
    if not section:
        return ""
    match = re.search(
        rf"^### {re.escape(heading)}\s*$([\s\S]*?)(?=^### |\Z)",
        section,
        re.MULTILINE,
    )
    return match.group(1).strip() if match else ""


def extract_user_story_line(body: str) -> tuple[str, str, str]:
    want = re.search(r"\*\*I want\*\* (.+?),", body)
    so_that = re.search(r"\*\*so that\*\* (.+?)\.", body)
    role = re.search(r"\*\*As\*\* (.+?),", body)
    return (
        role.group(1).strip() if role else "the user",
        want.group(1).strip() if want else "",
        so_that.group(1).strip() if so_that else "",
    )


def extract_bullets(text: str, limit: int = 5) -> list[str]:
    bullets: list[str] = []
    for line in text.splitlines():
        stripped = line.strip()
        if stripped.startswith("- "):
            item = re.sub(r"^\[[ x]\]\s*", "", stripped[2:].strip())
            if item and not item.startswith("_("):
                bullets.append(item)
        if len(bullets) >= limit:
            break
    return bullets


def parse_depends_on(fm: dict[str, str], raw_fm: str) -> list[str]:
    deps: list[str] = []
    in_depends = False
    for line in raw_fm.splitlines():
        if line.strip() == "depends_on:":
            in_depends = True
            continue
        if in_depends:
            if line.startswith("  - "):
                deps.append(line.replace("  - ", "", 1).strip())
                continue
            if line.strip() and not line.startswith(" "):
                in_depends = False
    if deps:
        return deps
    raw = fm.get("depends_on", "[]")
    if raw.startswith("[") and raw.endswith("]"):
        inner = raw[1:-1].strip()
        if not inner:
            return []
        return [part.strip() for part in inner.split(",")]
    return [raw] if raw and raw != "[]" else []


def build_why(fm: dict[str, str], body: str, acceptance: str | None) -> str:
    _, want, so_that = extract_user_story_line(body)
    title = fm.get("title", "this capability")
    done = fm.get("done_when", "").strip('"')
    first = extract_bullets(acceptance or "", 1)
    first_phrase = first[0] if first else done or title

    if fm.get("status") == "✅":
        return (
            f"This story delivered **{title}**: {first_phrase}. "
            f"It existed so that {so_that or want or 'the acceptance criteria could be met'}. "
            f"The record of what shipped lives under `## Technical implementation`."
        )

    return (
        f"This story adds **{title}** — {want or first_phrase}. "
        f"When done, {so_that or done or 'the acceptance criteria below will be observable'}. "
        f"It is intentionally one slice; it does not deliver the whole epic alone."
    )


def build_where(fm: dict[str, str], body: str, raw_fm: str) -> str:
    version = fm.get("version", "?")
    epic = fm.get("epic", "?")
    deps = parse_depends_on(fm, raw_fm)
    out = extract_section_body(body, "Out of scope for this story") or ""
    out_hint = extract_bullets(out, 1)

    parts = [f"Release **{version}** (`{epic}` in frontmatter — not duplicated here)."]
    if deps:
        parts.append(
            f"Depends on {' and '.join(deps)} — read those US files for what must already work."
        )
    else:
        parts.append("No `depends_on` — can start when architecture gate is satisfied.")
    if out_hint:
        hint = out_hint[0].rstrip(".")
        parts.append(f"Stops before: {hint}.")
    else:
        parts.append("Scope boundaries are listed under Out of scope for this story.")
    return " ".join(parts)


def build_approach(fm: dict[str, str], body: str, old_context: str | None) -> str:
    acceptance = extract_section_body(body, "Acceptance") or ""
    old_hints = extract_h3(old_context, "Implementation hints (preliminary)")
    old_approach = extract_h3(old_context, "Approach")
    tech = extract_section_body(body, "Technical implementation") or ""

    bullets: list[str] = []
    if old_approach:
        bullets.extend(extract_bullets(old_approach, 4))
    if old_hints:
        for hint in extract_bullets(old_hints, 4):
            if hint not in bullets:
                bullets.append(hint)

    for path_match in re.findall(r"`([^`]+)`", tech):
        if "/" in path_match and not any(path_match in b for b in bullets):
            bullets.append(
                f"Touch `{path_match}` as part of delivering this slice — keep changes aligned with acceptance."
            )

    for item in extract_bullets(acceptance, 3):
        if len(item) > 20 and not any(item[:30] in b for b in bullets):
            bullets.append(f"Deliver acceptance item: {item}")

    if not bullets:
        bullets.append(
            f"Implement `{fm.get('title', 'this story')}` in the area implied by acceptance — "
            f"refine file paths on `/refine-us` if still unclear."
        )

    lines: list[str] = []
    for bullet in bullets[:4]:
        if not bullet.endswith("."):
            bullet = bullet + "."
        if not bullet.startswith("- "):
            lines.append(f"- {bullet}")
        else:
            lines.append(bullet)
    return "\n".join(lines)


def build_context_section(fm: dict[str, str], body: str, old_context: str | None, raw_fm: str) -> str:
    acceptance = extract_section_body(body, "Acceptance")
    arch = extract_h3(old_context, "Architecture refs") or "\n".join(
        f"- {line}" for line in [
            "docs/05_architecture.md — § (fill exact heading on /refine-us)",
        ]
    )
    api = extract_h3(old_context, "API / DB impact") or "- _n/a_"
    sec = extract_h3(old_context, "Security notes") or "- _n/a_"
    dec = extract_h3(old_context, "Related decisions") or "- _n/a_"

    return "\n".join(
        [
            "## Context & constraints",
            "",
            "### Why",
            build_why(fm, body, acceptance),
            "",
            "### Where",
            build_where(fm, body, raw_fm),
            "",
            "### Approach",
            build_approach(fm, body, old_context),
            "",
            "### Architecture refs",
            arch,
            "",
            "### API / DB impact",
            api,
            "",
            "### Security notes",
            sec,
            "",
            "### Related decisions",
            dec,
            "",
        ]
    )


def replace_context_section(body: str, new_context: str) -> str:
    pattern = re.compile(r"^## Context & constraints\s*$", re.MULTILINE)
    match = pattern.search(body)
    if not match:
        acceptance = re.compile(r"^## Acceptance\s*$", re.MULTILINE)
        acc = acceptance.search(body)
        if acc:
            end = acc.end()
            rest = body[end:]
            next_h = re.search(r"^## ", rest, re.MULTILINE)
            insert_at = end + next_h.start() if next_h else len(body)
            return body[:insert_at].rstrip() + "\n\n" + new_context + "\n" + body[insert_at:].lstrip("\n")
        return new_context + "\n\n" + body

    start = match.start()
    rest = body[match.end() :]
    next_h = re.search(r"^## ", rest, re.MULTILINE)
    end = match.end() + next_h.start() if next_h else len(body)
    return body[:start] + new_context + body[end:].lstrip("\n")


def needs_upgrade(body: str) -> bool:
    context = extract_section_body(body, "Context & constraints")
    if not context:
        return True
    h3 = re.findall(r"^### (.+)$", context, re.MULTILINE)
    has_why = any(x in h3 for x in ("Why", "Why this story"))
    has_where = any(x in h3 for x in ("Where", "Where it fits"))
    return not (has_why and has_where)


def migrate_file(path: Path, force: bool = False) -> bool:
    text = path.read_text(encoding="utf-8")
    fm, raw_fm, body = parse_frontmatter(text)
    if not fm.get("id") or (not force and not needs_upgrade(body)):
        return False

    old_context = extract_section_body(body, "Context & constraints")
    new_context = build_context_section(fm, body, old_context, raw_fm)
    body = replace_context_section(body, new_context)
    path.write_text(raw_fm + "\n" + body.lstrip("\n"), encoding="utf-8")
    return True


def main() -> int:
    force = "--force" in sys.argv
    if force:
        sys.argv = [a for a in sys.argv if a != "--force"]
    root = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else Path.cwd()
    us_dir = root / "docs" / "us"
    if not us_dir.is_dir():
        print(f"Missing {us_dir}")
        return 1

    count = 0
    for path in sorted(us_dir.glob("US-*.md")):
        if migrate_file(path, force=force):
            count += 1
            print(f"upgraded {path.name}")

    print(f"Upgraded {count} user stories to Why/Where/Approach format.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
