# Usage guide

A practical roadmap for working on the project with AI. Open the section that matches your current situation — same content as the **Usage guide** tab in the [desktop monitor](../../app-desktop/).

Meridian supports you: it shows what is missing, suggests the next step, and records progress in the files. You approve; AI executes within what is documented.

Concepts (folders, phases, status) live in **[start-here.md](./start-here.md)**. This file only covers **actions, commands, and checks** before moving forward.

**Related:** [start-here.md](./start-here.md) · [MERIDIAN.md](../MERIDIAN.md) · workflow [`/daily-with-ai`](../workflows/daily-with-ai.md)

---

## Where am I?

| Situation | Section | Command |
| --------- | ------- | ------- |
| No `docs/` folder yet | [First time](#first-time) | `/init-meridian` |
| Phase docs incomplete or draft | [Document](#document) | `/status` |
| Architecture ok, missing epic/version/US | [Build backlog](#build-backlog) | `/create-us` |
| US created but not reviewed | [Review US](#review-us) | `/review-us` |
| US selected, time to code | [Refine US](#refine-us) then [Implement US](#implement-us) | `/refine-us` |
| Code ready, not recorded in files | [Close US](#close-us) | `/complete-us` |

Shortcut for the full session loop: `/daily-with-ai` (agent workflow: [daily-with-ai.md](../workflows/daily-with-ai.md)).

---

## Daily loop (cheat sheet)

Two axes, three conversations — do not mix document, backlog, and implement in one chat.

### Axis A — Document the system

**Docs:** `00`–`08`, `11` (phase documents)  
**Monitor:** Setup tab  
**Order:** foundation → principles → architecture → technical detail  

### Axis B — Delivery backlog

**Docs:** `docs/epics/`, `docs/versions/`, `docs/sprints/`, `docs/us/`  
**Monitor:** Deliverables · Board  
**Gate:** `05_architecture` approved; US requires epic/version in folders  

### Execute

**Docs:** `us/US-XXXX`, `board.json`  
**Monitor:** Board  
**Gate:** `ready: true` (after `/refine-us`)  
**Closure:** `/complete-us`, `/sync-board`  

---

## First time

*Repository in the IDE, `docs/` created or existing; optional: open `docs/` in the monitor.*

### Open the repository in the IDE

**When:** any work session.

- Open the **project root** (where `.agent/` or `.cursor/` live, and `docs/`).
- Do not open only `docs/` in the IDE — agents and scripts live at the root.

### Create Meridian structure (if `docs/` does not exist)

**When:** new repo or no phase documents (00–08 and 11).

- Run **`/init-meridian`** — creates `docs/`, governance, empty `board.json`.
- AI may ask up to 3 questions; you confirm.
- Review output. Still no product code.

*Tip: if `docs/` already exists, skip to the next step.*

### Open `docs/` in the monitor (optional)

**When:** you want visual progress while working in the IDE.

- **Open docs folder** in the app → select the project's `docs/`.
- **Setup** tab: blocked / draft / approved per phase doc.

### Know where to continue

**When:** after opening the project or resuming after days away.

- Run **`/status`** — blockers, pending docs, suggested next action.
- Optional: `python3 .agent/scripts/validate_meridian.py <project-folder>` at repo root.

---

## Document

*Mature `docs/` (Setup tab or `/status`). Gate for backlog: `05_architecture` **approved**.*

### Choose one doc per conversation

**When:** before backlog or code.

- See which doc is unblocked (`draft` or `review`).
- One file at a time, e.g. `docs/05_architecture.md`.
- Ask for draft, gaps, or review — **no product code** in this step.

### Specialized commands

**When:** target doc identified.

- **`/architecture`** — `05_architecture.md`
- **`/security-pass`** — `02_security.md`
- Scope/stack change → prepend `docs/decisions/YYYY-MM-DD.json` (never delete old entries)

### You approve in frontmatter

**When:** content reviewed. AI does not set `approved` alone.

- `draft` → `review` → `approved` in YAML.
- Confirm the next doc unlocked.
- Backlog gate: **`05_architecture.md`** = `approved`.

---

## Build backlog

*Epics, versions, sprints, US — Deliverables and Board in the monitor.*

### Confirm you can create US

**When:** before `/create-epic` or `/create-us`.

- `05_architecture.md` must be **approved** (`/status`).
- Otherwise return to [Document](#document).

### Create epic, version, and sprint

**When:** architecture approved; planning missing.

- Order: **epic** → **version** → **sprint**
- One command per conversation when possible: `/create-epic`, `/create-version`, `/plan-sprint`

### Create executable user stories

**When:** epic and version exist in `docs/epics/` and `docs/versions/`.

- **`/create-us`** — verifiable Acceptance, `epic` and `version` in frontmatter; `ready: false`; agent reads `us-template.md` first
- **`/refine-us US-XXXX`** — Context, tests and hints; sets `ready: true` when checklist passes
- Check coverage (monitor **Deliverables** / **Board** if you use it)
- After US changes: **`/sync-board`**

---

## Review US

*Auditoria read-only — sem código, sem alterar `ready`.*

### When

**After** `/create-us`, **before** `/refine-us`, or anytime you want a gap report on an existing US.

### Run `/review-us`

- **`/review-us US-XXXX`** — scores `review-checklist.md` + validator; outputs pass/fail table
- Agent reads `TEMPLATE_SOURCES.md` (paths), `writing-guide.md`, `section-contracts.md`, target US
- **Does not** edit the file or set `ready: true` unless you explicitly ask to fix in the same turn
- If gaps → run `/refine-us US-XXXX`

Canonical paths: `.agent/references/templates/TEMPLATE_SOURCES.md`

---

## Refine US

*Between create and implement — no product code.*

### When

**After** `/create-us`, **before** asking the agent to implement.

### Run `/refine-us`

- **`/refine-us US-XXXX`** — deepens **Approach**, architecture § refs, Tests/Planned; sets `ready: true` when checklist passes
- Agent reads `writing-guide.md` + `refine-checklist.md` + target US
- Sets `ready: true` only when every checklist item passes
- Validate: `python3 .agent/scripts/validate_meridian.py <project-folder>` (structure + semantic warnings)
- CI: append `--json` for machine-readable output

### Human templates

Project copy (readable in monitor): `docs/templates/README.md`

---

## Implement US

*Choose US, implement against Acceptance, review diff.*

### Choose the US of the day

**When:** Must US on the board with satisfied `depends_on`.

- Prefer unblocked Must (❌ or 🔶)
- **`/status`** if unsure
- **One US** per implementation cycle

### Ask for implementation anchored in the file

**When:** US selected; focused thread.

- Cite `US-0017` or `docs/us/US-0017.md`
- Agent reads **full** `.agent/references/templates/us-template.md` + target US before code
- **Block** if `ready` is not `true` or Context is placeholder-only → run `/refine-us` first
- Implement per **Acceptance**; do not mark ✅ only in chat

*Example: “Implement docs/us/US-0017.md per Acceptance. Update files, not only this chat.”*

### You review before closing

**When:** agent delivered a diff.

- Review in IDE; run build/test
- Partial → 🔶 + `Missing:` in Acceptance; no `/complete-us` yet
- Ready with evidence → [Close US](#close-us)

---

## Close US

*Record delivery in files — `/complete-us` + board.*

### Check preconditions

**When:** before `/complete-us`; you already reviewed the code.

- All `depends_on` are ✅
- Acceptance verifiable with evidence
- If `tests: required` — tests pass or documented

*Tip: do not force ✅ — use 🔶 + `Missing:` instead.*

### Run `/complete-us`

**When:** gates OK; focused closing conversation.

- **`/complete-us US-XXXX`** (e.g. `/complete-us US-0017`)
- Uses `board-keeper` + skill `complete-user-story`
- Confirm if the agent infers the US from context

### What the agent writes

**When:** during `/complete-us`.

- **`## Technical implementation`** — real paths, layer summary (no placeholders)
- Acceptance `[x]`; **Tests** Planned/Executed if required
- Frontmatter: `status: ✅` (or 🔶 + `Missing:`); `tests_status: done` when appropriate
- Cross-cutting change → prepend `docs/decisions/YYYY-MM-DD.json`

### Update board and verify

**When:** right after `/complete-us`.

- Regenerate board (`generate-board-json`); confirm with **`/sync-board`**
- US in correct column (✅, 🔶, 🧪)
- **Technical implementation** matches what you tested

---

## Slash command reference

| Command | When |
| ------- | ---- |
| `/init-meridian` | New project — create `docs/` and governance |
| `/status` | Session start — blockers and next action |
| `/architecture` | Draft or review `05_architecture.md` |
| `/security-pass` | Draft or review `02_security.md` |
| `/create-epic` | New capability in `docs/epics/` |
| `/create-version` | New release in `docs/versions/` |
| `/plan-sprint` | Time slice in `docs/sprints/` |
| `/create-us` | New US (gates OK) |
| `/review-us` | Audit US quality — report only, no `ready` |
| `/refine-us` | Refine US — Context, tests, `ready: true` |
| `/complete-us` | Close US — implementation, Acceptance, status, board |
| `/sync-board` | Regenerate `docs/kanban/board.json` |
| `/daily-with-ai` | Full session loop (when you know the basics) |

Workflow files: `.agent/workflows/` · Cursor: `.cursor/commands/` after `sync_cursor_kit.sh`

## Anti-patterns

- Code without a US or without `05_architecture` approved
- ✅ in chat without `/complete-us` in files
- Editing `board.json` by hand
- Mixing document + backlog + implement in one conversation
- Manual `status: ✅` without **Technical implementation**
- `approved` on a phase doc you did not read

## Validate structure

```bash
python3 .agent/scripts/validate_meridian.py <project-folder>
python3 .agent/scripts/validate_meridian.py <project-folder> --json   # CI
```

Run at the target repo root. Fix errors before creating US or marking docs `approved`.

## Try it with your project (optional monitor)

Open the **docs** folder from your repository (e.g. `app-desktop/docs` in this kit repo) in the desktop monitor to see real documents, epics, and user stories in the Setup, Deliverables, and Board tabs.

1. Run `cd app-desktop && pnpm dev`
2. Open **http://localhost:5173**
3. Click **Open docs folder** and select your Meridian `docs/` directory

Use Chrome or Edge on localhost if the browser does not offer folder pickers.

## Next step

1. Copy [`.agent/`](../) into your project and run **`/init-meridian`** or **`/status`**.
2. Deep rules: [MERIDIAN.md](../MERIDIAN.md).
