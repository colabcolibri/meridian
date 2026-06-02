# Start here

Concepts and `docs/` layout — same content as the **Start here** tab in the [desktop monitor](../../app-desktop/).  
For actions and slash commands, see **[usage-guide.md](./usage-guide.md)**.

**Related:** [usage-guide.md](./usage-guide.md) · [MERIDIAN.md](../MERIDIAN.md) · [README.md](../../README.md)

---

## Guide for people new to Meridian

Meridian is a way to organize software projects using Markdown files in the `docs/` folder. You write what you will build, approve it, and only then ask for code — manually or with AI agents in your IDE.

It is not Jira, it is not Notion, and it does not require a login. The source of truth is the files in your repository. The optional [desktop monitor](../../app-desktop/) only reads that folder and shows progress visually.

**Next:** read [usage-guide.md](./usage-guide.md), then run `/init-meridian` or `/status` in your IDE.

## Core principles

| Principle | Summary |
| --------- | ------- |
| **Documentation before code** | Scope, architecture, and Acceptance criteria come first. Code implements documentation, not the other way around. |
| **You approve, agents execute** | AI can write and review, but scope changes, `approved` status, and ✅ only happen with your validation. |
| **Done = evidence** | Compiling is not enough. ✅ requires Acceptance and tests in the files. Use `/complete-us` after reviewing. 🔶 requires explicit `Missing:`. |
| **Derived board** | `board.json` comes from the US files. Edit `docs/us/*.md`, not the JSON, as the status source of truth. |

## What is inside `docs/`

Every Meridian project has a `docs/` folder at the repository root. Content splits between **phase documents** at the root of `docs/` and **delivery folders**:

| Path | Label | Description |
| ---- | ----- | ----------- |
| `docs/*.md` | 10 phase documents | Files 00–08 and 11: foundation (00–03), principles (04), architecture (05), detail (06–08). Delivery lives in `epics/`, `versions/`, `sprints/`, `us/`. |
| `docs/epics/EPIC-XX.md` | Epics | One file per epic, YAML frontmatter. Example: `EPIC-02.md` describes a product capability. |
| `docs/versions/vX.md` | Versions | One file per release (v0, v1, v2…). Goal, outcome, scope, go-live checklist. |
| `docs/sprints/vX-SY.md` | Sprints | Time slices within a version. Planned US in frontmatter `stories`. |
| `docs/us/US-XXXX.md` | User stories | One file per task. Only after `05_architecture` is approved and epic/version exist. |
| `docs/decisions/YYYY-MM-DD.json` | Decision log | One JSON file per day. `entries` array (newest first). |
| `docs/kanban/board.json` | Kanban (generated) | Status summary from all US. **Never edit by hand** — built from `docs/us/`. |

### Dependencies between phase docs

`00`–`03` in sequence; `04_principles` before `05_architecture`; `06`–`08` after `05` (`06` before `07`). Decision log in `docs/decisions/` from day one. Epics, versions, and US only after `05_architecture` is **approved**.

## Journey phases

### Phase 0 — Foundation

**Understand the project.** Sequential: one document unlocks the next.

- `11_decisions.md` — log rules (stub)
- `docs/decisions/YYYY-MM-DD.json` — structured log by day
- `00_scope.md` — problem, scope, in/out
- `01_tech_stack.md` — languages, frameworks, tools
- `02_security.md` — threats, sensitive data, rules
- `03_user_types.md` — who uses the product

### Phase 1 — Principles

**Code and quality rules** — conventions before designing modules and boundaries.

- `04_principles.md`

### Phase 2 — Architecture

**How the system is divided** — apps, modules, integrations, boundaries.

- `05_architecture.md`

### Phase 3 — Technical details

**Database, APIs, environments.**

- `06_database.md` · `07_api_contracts.md` · `08_environments.md`

### Phase 4 — Delivery backlog

**Only after architecture:** releases, capabilities, executable tasks.

- `docs/epics/EPIC-XX.md` — product capability (outcome)
- `docs/versions/vX.md` — release goal and scope
- `docs/sprints/vX-SY.md` — time slices within the version

Usual creation order: epic → version → sprint → US. US gate: `05_architecture` approved + epic/version exist in folders.

### Execution

Implement user stories; status in frontmatter; kanban derives progress.

- `docs/us/US-0001.md` …
- `docs/kanban/board.json` (generated)

## Epics, versions, and user stories

### Epic — the large product block

An epic groups a whole product capability. Example: **EPIC-02** “Initial setup monitor” covers opening a folder, reading phase documents, and showing progress.

- File: `docs/epics/EPIC-XX.md` — frontmatter: `id`, `title`, `status`, `versions`, `profiles`, `outcome`; body: **Capability**, **Expected outcome**, **Out of scope for this epic**.
- Epic status: `active` · `complete` · `paused` (not the same as phase doc `draft`/`review`/`approved`).
- US reference epic by ID only (`epic: EPIC-02`) — never copy epic text into the US.

### Version — the release (v0, v1, v2…)

A version is a go-live package. File: `docs/versions/vX.md`. Sprints in `docs/sprints/`.

- US reference `version: v1` only.
- Epics reference `versions: [v0, v1]`.
- Plan with `/create-version`; sprints with `/plan-sprint`.

### User story — the executable task

Format: **As** [persona], **I want** [action], **so that** [benefit].

- File: `docs/us/US-XXXX.md` — Acceptance, **Technical implementation**, **Tests** (Planned / Executed) when `tests: required`.
- `depends_on`, `done_when`, `moscow` (Must / Should / Could / Won't).
- ✅ and **Technical implementation** via `/complete-us` after you review — not only in chat.

### How to read an epic (fields)

| Field | Meaning |
| ----- | ------- |
| `id` | Permanent ID (EPIC-02) |
| `title` | Short capability name |
| `status` | `active` · `complete` · `paused` |
| `versions` | Releases where the epic ships |
| `profiles` | User types from `03_user_types.md` |
| `outcome` | Product-level done for the epic |
| **Capability** | Body: what the user can do |
| **Out of scope for this epic** | Body: explicit boundaries |

### How to read a version (fields)

| Field | Meaning |
| ----- | ------- |
| `id` | `v0`, `v1`, `v2`… |
| `status` | `planned` · `active` · `complete` |
| `outcome` | Release-level done |
| **Objective** / **Explicitly out** | Body: in scope vs later |

### How to read a user story (fields)

| Field | Meaning |
| ----- | ------- |
| `status` | ✅ done · 🔶 partial (`Missing:`) · ❌ pending · 🧊 frozen |
| `tests` / `tests_status` | `required` + `pending`/`done`/`n/a` — board may show 🧪 |
| `epic` / `version` | Reference by ID only |

## Status reference

### Phase documents

| Status | Meaning |
| ------ | ------- |
| `draft` | Still being written |
| `review` | Ready for human review |
| `approved` | Unlocks dependents |

### User stories (board)

| | Label | Meaning |
| --- | ----- | ------- |
| ❌ | Pending | Not started or not finished |
| 🔶 | In progress | Partial — `Missing:` required in Acceptance |
| ✅ | Done | Acceptance and tests evidenced in files |
| 🧪 | Waiting for tests | `tests: required` + `tests_status: pending` |
| 🧊 | Frozen | Intentionally paused |

Regenerate board after US changes: `/sync-board` or skill `generate-board-json`.

## Optional desktop monitor — tabs

If you run `app-desktop`, tabs map to these Markdown guides and live data:

| Tab | Markdown / purpose |
| --- | ------------------ |
| **Start here** | [start-here.md](./start-here.md) (this file) |
| **Usage guide** | [usage-guide.md](./usage-guide.md) (actions and commands) |
| **Setup** | Phase docs 00–11 and approval progress |
| **Decisions** | `docs/decisions/*.json` |
| **Deliverables** | Epics, versions, coverage |
| **Board** | US kanban, filters |

## Next step

Understood folders, phases, and status? Open **[usage-guide.md](./usage-guide.md)** for `/init-meridian`, `/create-us`, `/complete-us`, and the daily paths.

Optionally run the [desktop monitor](../../app-desktop/), click **Open docs folder**, and select your project's `docs/` (e.g. `app-desktop/docs` in this repo) to see Setup, Deliverables, and Board with real data.
