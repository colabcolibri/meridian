# Meridian templates — registry for agents

> **Mandatory:** before creating or closing any delivery artifact, the active agent MUST read this index, then read the **full template file** for that artifact **before** calling Write or Edit on the target path.

Templates are mirrored here from skills (`references/`) so every agent uses the same paths. **Do not invent structure** — copy the template and fill placeholders.

---

## Artifact → template → agent → skill

| Artifact | Template (read before Write) | Primary agent | Skill | Workflow |
| -------- | ---------------------------- | ------------- | ----- | -------- |
| Phase docs `00`–`11` | `doc-templates.md` | `documentation-strategist` | `init-project` | `/init-meridian` |
| Epic `docs/epics/EPIC-XX.md` | `epic-template.md` + **`writing-guide.md`** | `documentation-strategist` | `create-epic` | `/create-epic` |
| Version `docs/versions/vX.md` | `version-template.md` + **`writing-guide.md`** | `sprint-planner` | `create-version` | `/create-version` |
| Sprint `docs/sprints/vX-SY.md` | `sprint-template.md` | `sprint-planner` | `create-sprint` | `/plan-sprint` |
| User story (create) | `us-template.md` + **`writing-guide.md`** | `board-keeper` | `create-user-story` | `/create-us` |
| User story (review) | `review-checklist.md` + `us-template.md` + **`writing-guide.md`** + `section-contracts.md` | `board-keeper` | `review-user-story` | `/review-us` |
| User story (refine) | `us-template.md` + `refine-checklist.md` + **`writing-guide.md`** | `board-keeper` | `refine-user-story` | `/refine-us` |
| User story (close) | `implementation-template.md` + `us-template.md` | `board-keeper` | `complete-user-story` | `/complete-us` |
| Decision entry | `decision-template.md` + `decision-schema.md` | any relevant agent | `update-decisions-log` | — |
| Board JSON | `board-schema.md` | `board-keeper` | `generate-board-json` | `/sync-board` |

**Section contracts:** `section-contracts.md` — fixed `##` / `###` for US, epic, version.

**Canonical paths:** `TEMPLATE_SOURCES.md` — where to edit vs read (registry symlinks).

**Writing quality:** `writing-guide.md` — **mandatory** before creating or refining epics, versions, US.

All paths in this folder are relative to `.agent/references/templates/`.

---

## Agent loading protocol

When an agent from the table is activated:

1. Read `.agent/agents/{agent}.md` (persona + prohibitions).
2. Read the skill `SKILL.md` listed in the table.
3. Read the **full template file** from this folder — not only frontmatter examples in `MERIDIAN.md`.
4. Read **`writing-guide.md`** when creating or refining epic, version, or US.
5. Read `section-contracts.md` when editing US, epic, or version structure.
6. Only then create or edit the artifact.

If the request is **implement code** for a US (`process-manager` gate):

1. Read `us-template.md` to know required sections.
2. Read the target `docs/us/US-XXXX.md`.
3. Block if `## Context & constraints` is empty or only placeholders.
4. Read every path listed under **Architecture refs** in that US before writing code.

---

## Lifecycle (which template when)

See `lifecycle.md` in this folder for the full create → refine → implement → close flow.

---

## Anti-patterns (protocol failure)

- Saving `docs/us/US-XXXX.md` without reading `us-template.md` first
- Closing US with `✅` without reading `implementation-template.md` first
- Creating epic/version/sprint from memory or from `MERIDIAN.md` excerpts only
- Partial template (frontmatter only, missing body sections)
