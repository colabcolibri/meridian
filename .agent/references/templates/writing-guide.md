# Writing guide — delivery artifacts for AI

> Read this **before** writing epics, versions, or user stories. Templates define structure; this guide defines **quality of prose**. Acceptance stays checklist; everything else should explain enough that a reader (human or AI) understands **what**, **where in the product**, and **how** without opening five other files.
>
> **v11:** delivery artifacts are stored in `.meridian/meridian.db`. Golden examples use SQLite terminology — apply the same prose rules to `meridian_db_export.py --write-form` upserts.

---

## Principles

1. **Explain, don't reference-by-default** — `epic: EPIC-XX` in frontmatter is enough. Do not paste epic text into US. Instead, explain this slice in its own words.
2. **Prose first where it matters** — Epic Capability, US **Why / Where**, version Objective: write in full sentences.
3. **Bullets with substance** — each bullet can be one or two sentences. Forbidden: telegraphic stubs (`src/foo.ts`, `see epic`, `TBD`).
4. **Observable acceptance** — checklist items must be verifiable; narrative sections must not repeat acceptance verbatim.
5. **Create vs refine** — `/create-us` writes the story (clarity). `/refine-us` deepens Plan and tests before code.
6. **INVEST (qualitative)** — at review/refine: Independent (`depends_on` minimal), Negotiable (Why allows tradeoffs), Valuable (`so that`), Estimable (concrete Approach), Small (one session), Testable (observable Acceptance). No story points — see `scrum-meridian-map.md`.
7. **Gherkin optional** — use Given/When/Then only when a flow is ambiguous; default remains observable checklist bullets.
8. **Code quality at US time** — at create/refine/implement read `code-quality-at-us-time.md` and `04_principles.md` (DRY, SRP). One US = one concern; Approach names reuse before new modules.
9. **Architecture folder** — optional `docs/architecture/` for detail; `05_architecture.md` stays overview + index + gate. See `architecture-folder-guide.md`.

---

## Epic — golden example (excerpt)

```md
## Capability

Today the Process Manager opens the repo and cannot see delivery state without running CLI exports or opening the VS Code board. This epic adds a monitor in the extension: Deliverables and Board read from `.meridian/meridian.db` via `meridian_db_export.py --format planning`, with status derived from `user_stories` rows — never from hand-edited JSON on disk.

The manager filters by version and epic, sees ❌/🔶/✅ in one place, and uses that view in planning sessions. No manual column maintenance, no orphan IDs.

## Expected outcome

In a single planning session the manager answers “what is still open in v1?” from the extension alone. The epic is `complete` when Must US for the targeted versions are ✅ and nobody edits kanban data outside SQLite upserts.

## Out of scope for this epic

- Creating or editing US from the app (later epic).
- Defining new epics from the UI (stays in docs + `/create-epic`).
```

**Anti-pattern:** one sentence under Capability listing tabs and folder paths with no user problem.

---

## User story — golden example (create)

```md
**As** Process Manager,
**I want** to filter the board by product version,
**so that** I only see user stories for the release I am planning.

## Intent

### Acceptance

- [ ] Version filter above kanban columns (All + each distinct `version` from US).
- [ ] Each card shows a `vX` badge at the top, visible without expanding details.
- [ ] Filter combines with existing epic filter without resetting the other.

### Why

v1 and v0 US mix on the same board today, which makes sprint review noisy. This story adds version filtering only — it does not change how stories are loaded from SQLite or how the board export is built. When done, the manager selects v1 and the columns show only v1 cards.

### Where

Part of v1 / EPIC-04. Depends on US-0022 (kanban reads `user_stories` from `meridian.db`). Unblocks US-0025 (deliverables using the same version focus). No write path — read-only monitor change.

## Plan

### Architecture refs

- `docs/05_architecture.md` — § Monitor and project loader

### API / DB impact

- _n/a_ — client-side filter over in-memory project data.

### Security notes

- _n/a_

### Related decisions

- _n/a_

### Planned

- [ ] **manual** — numbered steps + expected result
```

**Anti-pattern:** Intent that only lists epic boundaries from SQLite (`EPIC-04`) and repeats acceptance bullets under Approach.

---

## User story — refine (same story, deeper)

Refine **expands** optional Approach and makes Architecture refs and Planned tests executable:

```md
## Plan

### Approach

- Implement `MonitorVersionFilterContext` in `src/features/monitor/` holding `selectedVersionId` and `setSelectedVersionId`; wrap `MonitorDashboard` so Board and Deliverables mount under the same provider (avoids diverging filters in US-0025).
- In `version-filter.ts`, add `listDistinctVersions(stories)` and `resolveDefaultVersion(versions, stories)` preferring `status: active` on version doc, else latest version id that has at least one US.
- Update `KanbanView.tsx`: filter `stories` before column grouping; add `VersionFilterBar` above columns; show `story.version` badge on card header.

### Architecture refs

- `docs/05_architecture.md` — § Monitor (KanbanView, derived board)

### Planned

- [ ] **manual** — 1. Load project with v0 and v1 US. 2. Open Board, select v1 in filter. 3. Confirm v0 cards disappear from all columns. 4. Switch to Deliverables tab — same v1 still selected.
- [ ] **build** — `cd app-visual-studio && pnpm build` exits 0 (or product package per `01_tech_stack`).
```

---

## Version — golden example (excerpt)

```md
## Objective

v11 adds real writes from the editor: VS Code extension scaffold, SQLite upserts via `meridian_db_export.py --write-form`, and validate on save. The manager uses the extension board for visibility; the Future VSCode User can run Meridian workflows without leaving the IDE.

## Done criteria

v11 is `complete` when the extension loads in Extension Development Host, at least one workflow upserts a user story into `meridian.db` correctly, and the board refreshes from SQLite without manual merge.
```

---

## Quick checklist before Save

| Artifact | Ask yourself |
| -------- | ------------ |
| Epic | Would a new PM understand the user problem and “done” without reading US rows in SQLite? |
| Version | Is the release theme clear in prose, not only a bullet list of US ids? |
| US create | Can someone explain this slice in one minute using only Why + Where? |
| US refine | Could an AI implement without guessing file names or test steps? (optional ### Approach helps) |
