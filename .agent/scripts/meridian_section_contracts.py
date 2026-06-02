"""Section contracts for Meridian delivery artifacts (US, epic, version).

Canonical definitions mirror `.agent/references/templates/section-contracts.md`
and `app-desktop/src/domain/meridian/section-contracts.ts`.
"""

from __future__ import annotations

import re
from typing import Literal

Severity = Literal["error", "warning"]

US_H2_SECTIONS: tuple[str, ...] = (
    "Acceptance",
    "Context & constraints",
    "Technical implementation",
    "Tests",
    "Out of scope for this story",
    "Notes",
)

US_CONTEXT_H3: tuple[str, ...] = (
    "Why this story",
    "Where it fits",
    "Approach",
    "Architecture refs",
    "API / DB impact",
    "Security notes",
    "Related decisions",
)

US_CONTEXT_H3_LEGACY: tuple[str, ...] = (
    "Architecture refs",
    "API / DB impact",
    "Security notes",
    "Related decisions",
    "Implementation hints (preliminary)",
)

US_TECH_H3: tuple[str, ...] = (
    "Files",
    "Backend",
    "Frontend",
    "Scripts / Docs",
)

US_TESTS_H3: tuple[str, ...] = ("Planned", "Executed")

US_FRONTMATTER_REQUIRED: tuple[str, ...] = (
    "id",
    "title",
    "epic",
    "version",
    "status",
    "moscow",
    "done_when",
    "tests",
    "tests_status",
)

US_FRONTMATTER_STRICT: tuple[str, ...] = (*US_FRONTMATTER_REQUIRED, "ready", "depends_on")

EPIC_H2_SECTIONS: tuple[str, ...] = (
    "Capability",
    "Expected outcome",
    "Out of scope for this epic",
)

EPIC_H2_ALIASES: dict[str, tuple[str, ...]] = {
    "Out of scope for this epic": ("Out of scope for this epic", "Out of this epic"),
}

VERSION_H2_PREFIXES: tuple[tuple[str, tuple[str, ...]], ...] = (
    ("Objective", ("Objective", "Goal")),
    ("Done criteria", ("Done criteria",)),
    ("Included in this version", ("Included in this version",)),
    ("Explicitly out", ("Explicitly out",)),
    ("Go-live checklist", ("Go-live checklist",)),
)


def list_h2_sections(body: str) -> list[str]:
    return re.findall(r"^## (.+)$", body, re.MULTILINE)


def list_h3_in_section(body: str, h2_heading: str) -> list[str]:
    section = extract_section_body(body, h2_heading)
    if section is None:
        return []
    return re.findall(r"^### (.+)$", section, re.MULTILINE)


def extract_section_body(text: str, heading: str) -> str | None:
    pattern = re.compile(rf"^## {re.escape(heading)}\s*$", re.MULTILINE)
    match = pattern.search(text)
    if not match:
        return None
    start = match.end()
    rest = text[start:]
    next_heading = re.search(r"^## ", rest, re.MULTILINE)
    end = start + next_heading.start() if next_heading else len(text)
    return text[start:end].strip()


def missing_sections(required: tuple[str, ...], present: list[str]) -> list[str]:
    present_set = set(present)
    return [name for name in required if name not in present_set]


def validate_us_structure(
    story_name: str,
    body: str,
    frontmatter: dict[str, str],
    errors: list[str],
    warnings: list[str],
) -> None:
    status = frontmatter.get("status")
    strict = "ready" in frontmatter
    h2_present = list_h2_sections(body)

    for field in US_FRONTMATTER_STRICT if strict else US_FRONTMATTER_REQUIRED:
        if field == "depends_on":
            present = field in frontmatter
        else:
            present = field in frontmatter and frontmatter.get(field, "") != ""
        if not present:
            severity: Severity = "error" if strict or field in US_FRONTMATTER_REQUIRED else "warning"
            message = f"{story_name}: missing frontmatter `{field}`."
            if severity == "error":
                errors.append(message)
            else:
                warnings.append(message)

    core_h2 = ("Acceptance", "Tests", "Technical implementation")
    for section in core_h2:
        if section not in h2_present:
            errors.append(f"{story_name}: missing required ## {section} (see us-template.md).")

    if strict:
        for section in US_H2_SECTIONS:
            if section not in h2_present:
                errors.append(f"{story_name}: missing required ## {section} (strict US with `ready`).")

        context_h3 = list_h3_in_section(body, "Context & constraints")
        has_new_context = all(name in context_h3 for name in US_CONTEXT_H3)
        has_legacy_context = all(name in context_h3 for name in US_CONTEXT_H3_LEGACY)

        if has_new_context:
            pass
        elif has_legacy_context:
            warnings.append(
                f"{story_name}: Context uses legacy subsections — run /refine-us to add "
                "Why this story, Where it fits, and Approach."
            )
        else:
            for subsection in US_CONTEXT_H3:
                if subsection not in context_h3:
                    errors.append(
                        f"{story_name}: missing ### {subsection} under ## Context & constraints."
                    )

        for subsection in US_TECH_H3:
            if subsection not in list_h3_in_section(body, "Technical implementation"):
                errors.append(
                    f"{story_name}: missing ### {subsection} under ## Technical implementation."
                )

        for subsection in US_TESTS_H3:
            if subsection not in list_h3_in_section(body, "Tests"):
                errors.append(f"{story_name}: missing ### {subsection} under ## Tests.")
    else:
        if "Context & constraints" not in h2_present:
            warnings.append(
                f"{story_name}: missing ## Context & constraints (legacy — run /refine-us)."
            )
        for section in ("Out of scope for this story", "Notes"):
            if section not in h2_present:
                warnings.append(f"{story_name}: missing ## {section} (recommended by template).")

    if status == "✅" and "Technical implementation" not in h2_present:
        errors.append(
            f"{story_name}: status ✅ requires ## Technical implementation section."
        )


def has_h2_match(present: list[str], canonical: str, aliases: tuple[str, ...] | None = None) -> bool:
    options = aliases or (canonical,)
    for option in options:
        if option in present:
            return True
        if any(heading == option or heading.startswith(f"{option} ") for heading in present):
            return True
    return False


def validate_epic_structure(
    epic_name: str,
    body: str,
    errors: list[str],
    warnings: list[str],
) -> None:
    h2_present = list_h2_sections(body)
    for section in ("Capability", "Expected outcome"):
        if section not in h2_present:
            errors.append(f"{epic_name}: missing required ## {section} (see epic-template.md).")

    if not has_h2_match(
        h2_present,
        "Out of scope for this epic",
        EPIC_H2_ALIASES["Out of scope for this epic"],
    ):
        errors.append(
            f"{epic_name}: missing required ## Out of scope for this epic (see epic-template.md)."
        )

    if "Out of this epic" in h2_present and "Out of scope for this epic" not in h2_present:
        warnings.append(
            f"{epic_name}: use ## Out of scope for this epic (template name) instead of ## Out of this epic."
        )


def validate_version_structure(
    version_name: str,
    body: str,
    errors: list[str],
    warnings: list[str],
) -> None:
    h2_present = list_h2_sections(body)
    for canonical, aliases in VERSION_H2_PREFIXES:
        if not has_h2_match(h2_present, canonical, aliases):
            errors.append(
                f"{version_name}: missing required ## {canonical} (see version-template.md)."
            )
        if canonical == "Objective" and "Goal" in h2_present and "Objective" not in h2_present:
            warnings.append(
                f"{version_name}: prefer ## Objective (template) over ## Goal."
            )
