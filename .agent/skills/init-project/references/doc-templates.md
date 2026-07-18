# Meridian document templates — index

> **Mandatory before Write on any phase doc:** read this file, then read the **full** `phase-docs/{artifact}.md` template for each file you create or materially edit.

Templates live in `.agent/references/templates/phase-docs/`. **Do not** create `docs/templates/` in product projects.

---

## Global depth bar (all phase docs)

| Rule | Pass when |
| ---- | --------- |
| No empty `##` | Every heading has ≥2 sentences **or** ≥2 substantive bullets |
| Unknowns | `Open questions` / `Gaps` / `Assumptions` — not silent blanks |
| Status | `draft` at init; never `approved` without human |
| Frontmatter | `depends_on` / `blocks` match MERIDIAN dependency order |
| TBD | Allowed only with reason: `TBD — blocked on [question]` |

**Interview:** read `init-interview-guide.md` before first Write when context is thin.

---

## Who creates all docs — flow

```txt
/discover (optional)           → product-brief only
/init-meridian Mode A          → full docs/ tree + populate 00–08, 11 from phase-docs + interview
/init-meridian Mode B          → docs/ tree + bootstrap → then /document-project
/document-project              → inventory + populate phase docs from code (no US/epics)
Human approve                  → 00 → 01 → 02 → 03 → 04 (in order)
/architecture, /security-pass  → deepen 05, 02
/audit-docs                    → gap report + optional draft fixes (any time)
```

| Command | Skill | Creates |
| ------- | ----- | ------- |
| `/init-meridian` | `init-project` | Structure + Mode A content **or** Mode B shell |
| `/document-project` | `document-existing-project` | As-is inventory + phase doc bodies |
| `/audit-docs` | `audit-phase-docs` | Audit report; edits stay `draft` |

---

## Required frontmatter (every phase doc)

```yaml
---
title: Document name
status: draft
version: 1.0
updated: YYYY-MM-DD
depends_on: []
blocks: []
---
```

Use real `depends_on` / `blocks` per `.agent/MERIDIAN.md` dependency order.

---

## Phase doc → template file

| Output path | Read before Write |
| ----------- | ----------------- |
| `docs/README.md` | Section below |
| `docs/00_scope.md` | `phase-docs/00-scope.md` |
| `docs/01_tech_stack.md` | `phase-docs/01-tech-stack.md` |
| `docs/02_security.md` | `phase-docs/02-security.md` |
| `docs/03_user_types.md` | `phase-docs/03-user-types.md` |
| `docs/04_principles.md` | `phase-docs/04-principles.md` |
| `docs/05_architecture.md` | `phase-docs/05-architecture.md` |
| `docs/06_database.md` | `phase-docs/06-database.md` |
| `docs/07_api_contracts.md` | `phase-docs/07-api-contracts.md` |
| `docs/08_environments.md` | `phase-docs/08-environments.md` |
| `docs/09_design_system.md` | `phase-docs/09-design-system.md` (UI products only) |
| `docs/11_decisions.md` | Stub below + `decision-template.md` |

---

## `docs/README.md` (human entry point)

```markdown
# [Project name]

[2–4 sentences: what this product is.]

## Phase documents

| Doc | Status | Description |
| --- | ------ | ----------- |
| 00_scope | draft | Scope and boundaries |
| 01_tech_stack | draft | Stack and tooling |
| … | … | … |

## How to work

1. Approve phase docs in order: foundation → principles → architecture.
2. Backlog in SQLite: `meridian_delivery.py` / chat slash commands (`/create-us`, …).
3. US only after `05_architecture` approved.
4. Kit templates: `.agent/references/templates/INDEX.md` — not `docs/templates/`.
5. Validate: `python3 .agent/scripts/validate_meridian.py . --sqlite-only`
```

---

## `docs/11_decisions.md` + first JSON entry

Create stub `11_decisions.md` (rules pointer) and `docs/decisions/YYYY-MM-DD.json`:

```json
{
  "date": "YYYY-MM-DD",
  "entries": [
    {
      "time": "HH:MM",
      "title": "Project started with Meridian",
      "affected_document": "docs/",
      "what_changed": "Meridian structure created.",
      "why_changed": "Project start with document governance.",
      "impact": "All phase docs in draft.",
      "responsible": "[manager]"
    }
  ]
}
```

---

## Delivery database

After `docs/` exists:

```bash
python3 .agent/scripts/bootstrap_meridian_db.py <packageRoot>
# or: python3 .agent/scripts/meridian_delivery.py bootstrap
```

---

## `docs/inventory/as-is.md` (Mode B / document-project)

Read `as-is-inventory-template.md` — not a phase doc. Archive after `05_architecture` approved.

---

## Related kit files

| File | Purpose |
| ---- | ------- |
| `init-interview-guide.md` | Interview gate + question banks |
| `as-is-inventory-template.md` | Capability inventory |
| `architecture-folder-guide.md` | `docs/architecture/` detail |
| `code-quality-at-us-time.md` | DRY/SRP at US time (reads `04_principles`) |
