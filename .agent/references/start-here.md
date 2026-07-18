# Meridian — concepts

> **Mental model only** — phases, gates, folders. No command lists here.  
> **Start:** [how-to-use.md](./how-to-use.md) · **Do something:** [usage-guide.md](./usage-guide.md) · **Lookup:** [agents-help.md](./agents-help.md)

Meridian is a protocol for building software with AI: **documentation comes before code**. Humans and agents share the same contract in `docs/` and `.meridian/meridian.db`.

---

## The four phases

Each phase unlocks the next — you cannot skip.

### Phase 1 — Project definition

*What is this product, for whom, and what is out of scope?*

| Doc | Role |
| --- | ---- |
| `00_scope.md` | Product boundaries |
| `03_user_types.md` | Who uses it, permissions |

**Gate:** `00_scope.md` **approved** → Phase 2.

### Phase 2 — Structure definition

*How is it built?*

| Doc | Role |
| --- | ---- |
| `01_tech_stack.md` | Languages, frameworks, infra |
| `02_security.md` | Auth, data, threats |
| `04_principles.md` | DRY, layers, DoD — agents read at refine/implement |
| `05_architecture.md` | Boundaries, layers (**backlog gate**) |
| `06_database.md` · `07_api_contracts.md` · `08_environments.md` | Detail |
| `09_design_system.md` | UI products only |

**Gate:** `05_architecture.md` **approved** → Phase 3.

### Phase 3 — Backlog definition

| Artifact | Question it answers |
| -------- | ------------------- |
| **Epic** | What capability? |
| **Version** | What ships in this release? |
| **Sprint** | What do we finish this time box? |
| **User story** | What is the smallest executable slice? |

Stored in **`.meridian/meridian.db`** (v11), not `docs/us/`.

**Gate:** epic + version exist → `/create-us` allowed.

### Phase 4 — Execution

```txt
/create-us → /refine-us → /implement-us → /complete-us → commit (human)
```

**No code without `ready: true`.** No `✅` without `## Record` and evidence.

---

## Folder layout

```txt
docs/
  00_scope.md … 08_environments.md
  09_design_system.md          # UI only
  11_decisions.md
  decisions/                   # YYYY-MM-DD.json append-only
  architecture/                # optional detail, indexed from 05
  inventory/as-is.md           # brownfield transitional — archive after 05 approved
  discovery/                   # optional product brief

.meridian/
  delivery.json                # connector config (commit)
  meridian.db                  # epics, versions, sprints, US (gitignored)
  projects.json                # optional multi-product manifest
```

**Legacy v1:** `/migrate-delivery` once when adopting v11 from Markdown delivery folders.

### Monorepo (several products)

One `.agent/` kit; each product has a folder named exactly **`docs`**. Active product picker in the extension toolbar. See [usage-guide § Multiple projects](./usage-guide.md#multiple-meridian-projects).

---

## Delivery artifact chain

```txt
Epic ─── Version ─── Sprint ─── User Story
│                              └── executable slice (one concern)
└── product capability
```

A US references epic/version by id only — never pastes epic body. Lifecycle: `ready: false` → `ready: true` (refine) → `status: ✅` (close).

Field detail: [artifact-reference.md](./artifact-reference.md).

---

## Document maturity

| Status | Meaning |
| ------ | ------- |
| `draft` | Being written |
| `review` | Ready for your review |
| `approved` | You approved — unlocks dependents |

Agents never set `approved`.

---

## Scrum and Meridian

One manager + AI agents; files as source of truth; no mandatory story points.

| Need | File |
| ---- | ---- |
| Operational map | [scrum-meridian-map.md](./scrum-meridian-map.md) |
| Full Scrum guide (optional) | [scrum-guide-complete.md](./scrum-guide-complete.md) |

---

## What Meridian does not do

- Code without `ready: true` US
- `✅` without Record evidence
- Approve its own phase docs
- Scope or priority decisions for you
- `git commit` unless you ask
- Retroactive ✅ US for all legacy code (brownfield documents as-is instead)

Commit rules: [commit-after-us-close.md](./commit-after-us-close.md).
