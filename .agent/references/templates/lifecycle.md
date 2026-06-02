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
User story create (us-template.md) — status ❌, ready: false
  ↓
/refine-us (refine-checklist.md + section-contracts.md) — ready: true when checklist passes
  ↓
Implement — process-manager gate: ready true + Context filled
  ↓
User story close (implementation-template.md) — status ✅
  ↓
Board sync (board-schema.md)
```

---

## User story — two templates, two moments

| Moment | Template | What changes |
| ------ | -------- | ------------ |
| **Create** (`/create-us`) | `us-template.md` | Full file; `status: ❌`; `ready: false`; Context may start minimal |
| **Refine** (`/refine-us`) | `refine-checklist.md` | Context + tests concrete; `ready: true` when checklist passes |
| **Close** (`/complete-us`) | `implementation-template.md` | Replace `## Technical implementation`; `status: ✅` |

Between create and close, the US file is the **contract for implementation**. Structure is enforced by `section-contracts.md` (Python + monitor). If Context or Tests/Planned are still generic placeholders, the agent must **not** implement — refine the US first.

---

## Epic vs user story

| Layer | Template | Contains |
| ----- | -------- | -------- |
| Epic | `epic-template.md` | Product capability, outcome, boundaries |
| US | `us-template.md` | Executable slice, acceptance, context refs, tests |

US references epic by `epic: EPIC-XX` only — do not paste epic body into US. Fill the gap with **`## Context & constraints`**, not by copying the epic.
