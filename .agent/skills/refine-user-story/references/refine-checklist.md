# Refine checklist — US ready for implementation

Use after `/create-us`, before any product code. Mark `ready: true` only when **every** required row passes.

Read `writing-guide.md` for tone: Approach bullets must **explain**, not telegraph.

---

## Required sections

| # | Check | Pass when |
| - | ----- | --------- |
| 1 | Intent / `### Why` | 2+ sentences; explains slice, before/after; not epic paste |
| 2 | Intent / `### Where` | 2+ sentences; release position, deps, unblocks; US ids ok |
| 3 | Plan / `### Approach` | **required** — minimum 2 explanatory bullets; no placeholders |
| 4 | Plan / Architecture refs | Real path — `docs/05_architecture.md` **or** `docs/architecture/*.md` — § **exact heading** |
| 5 | Plan / API / DB impact | `_n/a_` with short phrase **or** named endpoint/table/migration |
| 6 | Intent / Acceptance | Each item observable; not vague intent |
| 7 | Plan / Planned | Numbered manual steps and/or exact commands; no “add when known” |
| 8 | `done_when` | One measurable sentence in frontmatter |
| 9 | Epic link | `epic: EPIC-XX` in frontmatter only — body explains slice in own words |
| 10 | INVEST | Independent enough (`depends_on` justified), Small (one session), Testable (Planned + Acceptance) |
| 11 | DRY | Approach names existing module/hook to reuse **or** justifies new shared module with path (see `code-quality-at-us-time.md`) |
| 12 | SRP | One slice; Approach bullets don't mix unrelated layers; **Out of scope** lists creep risks |
| 13 | Related decisions | `_n/a_` **or** `YYYY-MM-DD — title` when Approach touches scope, architecture, security, or acceptance; run `prepend-decision` first if not logged yet |
| 14 | Sprint scope | US listed in `sprint_stories` for a sprint with `status: planned` or `active` on the same `version` — use `/plan-sprint` before setting `ready: true` |

See `.agent/references/scrum-meridian-map.md` for bugs/spikes (no extra artifact types).

---

## Approach — good vs bad

| Bad | Good |
| --- | ---- |
| `- KanbanView.tsx` | `- Update KanbanView to filter stories before column split so v0 cards never render when v1 is selected.` |
| `- see architecture` | `- Reuse monitor filter context so Deliverables (US-0025) shares version state without a second source of truth.` |
| `- implement filter` | `- Add VersionFilterBar above columns; persist selection in MonitorVersionFilterContext when switching tabs.` |

---

## Placeholder patterns (fail until replaced)

- `_(fill in` / `_(pending)_` / `§ [section name` / `path/to/…`
- `add when implementation scope is known`
- `verify acceptance criteria end-to-end` without numbered steps
- Approach bullets under 6 words with no verb

---

## Frontmatter

```yaml
ready: false   # /create-us — narrative draft (`ready` flag in SQLite; not a draft file)
ready: true    # /refine-us — implement allowed (CLI rejects without sprint scope)
```

**Forbidden:** `.meridian/drafts/`, `us-*-refine.md` — persist with `update-us` (stdin) only.

---

## What refine does **not** do

- Does not fill `## Record` (that's `/complete-us`)
- Does not mark acceptance `[x]` or `status: ✅`
- Does not write product code
