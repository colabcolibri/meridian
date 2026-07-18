#!/usr/bin/env python3
"""Shared Markdown + frontmatter parsing for Meridian kit scripts."""

from __future__ import annotations

import json
import re
from pathlib import Path

from meridian_section_contracts import (  # noqa: E402
    extract_section_body,
    extract_subsection_body,
)

FRONTMATTER_RE = re.compile(r"^---\n(.*?)\n---\n", re.DOTALL)


def parse_frontmatter_dict(text: str) -> dict[str, str]:
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
        data[key.strip()] = value.strip().strip('"')
    return data


def parse_depends_on(value: str | None) -> list[str]:
    if not value or value == "[]":
        return []
    if value.startswith("["):
        inner = value.strip().strip("[]")
        if not inner:
            return []
        try:
            parsed = json.loads(value.replace("'", '"'))
            if isinstance(parsed, list):
                return [str(x).strip() for x in parsed if str(x).strip()]
        except json.JSONDecodeError:
            pass
        return [part.strip() for part in inner.split(",") if part.strip()]
    return [part.strip() for part in value.split(",") if part.strip()]


def format_depends_on(ids: list[str]) -> str:
    cleaned = [item.strip() for item in ids if item and str(item).strip()]
    if not cleaned:
        return "[]"
    return "[" + ", ".join(cleaned) + "]"


def parse_stories_list(value: str | None) -> list[str]:
    return parse_depends_on(value)


def read_markdown_file(path: Path) -> tuple[dict[str, str], str, str]:
    text = path.read_text(encoding="utf-8")
    return read_markdown_text(text)


def read_markdown_text(text: str) -> tuple[dict[str, str], str, str]:
    fm = parse_frontmatter_dict(text)
    match = FRONTMATTER_RE.match(text)
    body = text[match.end() :] if match else text
    return fm, body, text


def extract_us_preamble(body: str) -> str:
    """Text before the first ## section (As / I want / so that + optional H1)."""
    content = body
    if content.lstrip().startswith("---"):
        _, content, _ = read_markdown_text(content)
    match = re.search(r"^## ", content, re.MULTILINE)
    if not match:
        return content.strip()
    return content[: match.start()].strip()


def extract_us_sections(body: str) -> dict[str, str | None]:
    intent = extract_section_body(body, "Intent") or ""
    plan = extract_section_body(body, "Plan") or ""
    record = extract_section_body(body, "Record") or ""
    boundaries = extract_section_body(body, "Boundaries") or ""
    return {
        "intent_acceptance": extract_subsection_body(intent, "Acceptance"),
        "intent_why": extract_subsection_body(intent, "Why"),
        "intent_where": extract_subsection_body(intent, "Where"),
        "plan_approach": extract_subsection_body(plan, "Approach"),
        "plan_architecture_refs": extract_subsection_body(plan, "Architecture refs"),
        "plan_api_db": extract_subsection_body(plan, "API / DB impact"),
        "plan_security": extract_subsection_body(plan, "Security notes"),
        "plan_decisions": extract_subsection_body(plan, "Related decisions"),
        "plan_planned": extract_subsection_body(plan, "Planned"),
        "record_files": extract_subsection_body(record, "Files"),
        "record_backend": extract_subsection_body(record, "Backend"),
        "record_frontend": extract_subsection_body(record, "Frontend"),
        "record_scripts": extract_subsection_body(record, "Scripts / Docs"),
        "record_executed": extract_subsection_body(record, "Executed"),
        "boundaries_out_of_scope": extract_subsection_body(
            boundaries, "Out of scope for this story"
        ),
        "boundaries_notes": extract_subsection_body(boundaries, "Notes"),
    }


def extract_epic_sections(body: str) -> dict[str, str | None]:
    return {
        "capability": extract_section_body(body, "Capability"),
        "expected_outcome": extract_section_body(body, "Expected outcome"),
        "out_of_scope": extract_section_body(body, "Out of scope for this epic"),
        "notes": extract_section_body(body, "Notes"),
    }


def extract_version_sections(body: str) -> dict[str, str | None]:
    return {
        "objective": extract_section_body(body, "Objective")
        or extract_section_body(body, "Goal"),
        "done_criteria": extract_section_body(body, "Done criteria"),
        "included": extract_section_body(body, "Included in this version"),
        "explicitly_out": extract_section_body(body, "Explicitly out"),
        "go_live": extract_section_body(body, "Go-live checklist"),
    }


def extract_sprint_sections(body: str) -> dict[str, str | None]:
    return {
        "goal_body": extract_section_body(body, "Goal"),
        "scope_table": extract_section_body(body, "Scope"),
        "out_of_scope": extract_section_body(body, "Out of scope for this sprint"),
        "retrospective": extract_section_body(body, "Retrospective"),
    }
