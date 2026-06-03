# Meridian artifact lifecycle

Each phase uses a **fixed template**. Agents must not skip phases or merge them in one conversation without explicit manager approval.

```txt
Phase docs (doc-templates.md)
  ↓ 05_architecture approved
Epic (epic-template.md)
  ↓
Version (version-template.md)
  ↓
Sprint (sprint-template.md) — optional but recommended
  ↓
User story create (us-template.md + writing-guide.md) — status ❌, ready: false, Intent filled
  ↓
/review-us (review-checklist.md) — optional audit; report only; never sets ready
  ↓
/refine-us (refine-checklist.md) — deepen Plan; ready: true
  ↓
Implement — process-manager gate: ready true + Plan filled
  ↓
User story close (implementation-template.md) — Record + status ✅
  ↓
Board sync (board-schema.md)
  ↓
Commit (human) — one commit per closed US; see commit-after-us-close.md
```

---

## User story — templates by moment

| Moment | Template | What changes |
| ------ | -------- | ------------ |
| **Create** (`/create-us`) | `us-template.md` + `writing-guide.md` | Intent (Why/Where) + Plan draft; `ready: false` |
| **Review** (`/review-us`) | `review-checklist.md` + `section-contracts.md` | Gap report; **no edits**, **no `ready`** |
| **Refine** (`/refine-us`) | `refine-checklist.md` | Plan concrete; `ready: true` |
| **Close** (`/complete-us`) | `implementation-template.md` | `## Record` filled; `status: ✅` |

Between create and close, the US file is the **contract for implementation**. Structure is enforced by `section-contracts.md` (Python + monitor). If Plan or Planned tests are still generic placeholders, the agent must **not** implement — run `/refine-us` first.

---

## Epic vs user story

| Layer | Template | Contains |
| ----- | -------- | -------- |
| Epic | `epic-template.md` | Product capability, outcome, boundaries |
| US | `us-template.md` | Executable slice — Intent, Plan, Record, Boundaries |

US references epic by `epic: EPIC-XX` only — do not paste epic body. Explain the slice in Intent (Why / Where).
