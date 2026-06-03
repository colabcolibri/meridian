# Usage guide

How to work with Meridian day-to-day. This file covers commands, checks, and the sequence of actions for each situation.

For concepts (what is an epic, how phases work, what `ready` means), read **[start-here.md](./start-here.md)** first.

---

## Where are you right now?

Run `/status` at any point to get blockers, current state, and suggested next action.

| Situation | What to do |
| --------- | ---------- |
| No `docs/` folder yet | [Start a new project](#start-a-new-project) |
| Existing codebase, no `docs/` | [Migrate an existing project](#migrate-an-existing-project) |
| `docs/` exists, phase docs incomplete | [Work through the phase documents](#work-through-the-phase-documents) |
| Architecture approved, no backlog yet | [Build the backlog](#build-the-backlog) |
| Backlog exists, ready to implement | [Implement a user story](#implement-a-user-story) |
| Implementation done, not recorded | [Close a user story](#close-a-user-story) |

---

## Start a new project

Run: **`/init-meridian`**

The agent will ask up to 5 questions about the product — problem, users, scope, technology, and security constraints. Answer what you know; leave gaps for later.

What gets created:
- `docs/` folder tree with all phase document stubs
- `docs/00_scope.md` populated with your answers
- `docs/decisions/YYYY-MM-DD.json` with the initial decision entry
- `docs/kanban/board.json` empty

After this, go to [Work through the phase documents](#work-through-the-phase-documents).

---

## Migrate an existing project

Run: **`/init-meridian`** with your codebase open in the IDE.

The agent reads the codebase first — package files, folder structure, README, any existing docs. Then it asks only what it could not infer.

What gets created: same as a new project, but the phase documents are populated from the code — not blank. Every inference is marked as an assumption for your review.

After this, review `docs/00_scope.md` and `docs/05_architecture.md` — correct anything the agent got wrong, then follow the same path as a new project.

---

## Work through the phase documents

Phase documents must be completed in order. Each one unlocks the next.

```
00_scope → 01_tech_stack → 02_security → 03_user_types
         → 04_principles → 05_architecture (gate)
         → 06_database → 07_api_contracts → 08_environments
```

### Working on a phase document

1. Run `/status` to see which document is next and what is blocking it.
2. Open one document per conversation — do not mix documents.
3. Ask the agent to draft, fill gaps, or review a specific section.
4. Use specialized commands when available:
   - **`/architecture`** — draft or review `05_architecture.md`
   - **`/security-pass`** — draft or review `02_security.md`
5. When a document is ready, **you** set `status: review` in the frontmatter.
6. After your review, **you** set `status: approved`. The agent never sets `approved`.

### The architecture gate

`05_architecture.md` must be `approved` before you can create epics, versions, or user stories. If `/status` shows the backlog is blocked, this is almost always why.

### Decisions

Any significant decision made while working on a document — technology choice, architectural tradeoff, security posture — should be logged:

- Run **`/update-decisions-log`** or ask the agent to prepend an entry to `docs/decisions/YYYY-MM-DD.json`.
- Never edit existing entries.

---

## Build the backlog

**Gate:** `docs/05_architecture.md` must be `approved`.

### Sequence

Create in this order — each one is required before the next:

1. **Epic** — a product capability: `/create-epic`
2. **Version** — a release that groups epics: `/create-version`
3. **Sprint** *(optional but recommended)* — a time-boxed unit within a version: `/plan-sprint`
4. **User story** — an executable task: `/create-us`

### Create a user story

Run: **`/create-us`**

The agent will ask what user, what action, and what slice. It creates the file with Intent (Why + Where) filled and Plan drafted. The story is saved with `ready: false` — it is not ready to implement yet.

After creating, run **`/review-us US-XXXX`** to get a quality audit of the story before refining it.

### Refine a user story

Run: **`/refine-us US-XXXX`**

This is the step between creation and implementation. The agent:
- Writes the **Approach** (minimum 2 explanatory bullets — the technical direction)
- Sets exact architecture section references
- Writes concrete test steps under Planned
- Sets `ready: true` when all checks pass

A story without `ready: true` cannot be implemented.

### After backlog changes

Run **`/sync-board`** to regenerate `docs/kanban/board.json` from the US files.

---

## Implement a user story

### Choose the story

Pick a Must story with `ready: true` and no pending `depends_on`. Run `/status` if unsure.

One US per implementation session. Do not mix stories in one conversation.

### Ask the agent to implement

Reference the story file explicitly:

> "Implement `docs/us/US-0017.md` per its Acceptance criteria."

The agent reads the full story — Acceptance, Approach, Architecture refs, Planned tests — before writing code. It will refuse if `ready` is not `true` or if the Plan has placeholders.

### Review the output

- Review the diff in the IDE.
- Run build and tests.
- If partially complete: mark `status: 🔶` with `Missing:` in Acceptance. Do not use `/complete-us` yet.
- If complete with evidence: go to [Close a user story](#close-a-user-story).

---

## Close a user story

Run: **`/complete-us US-XXXX`**

**Before running, confirm:**
- All `depends_on` stories are `✅`
- Acceptance criteria are verifiable with evidence (not just "it works")
- If `tests: required` — tests have been run and passed

**What the agent writes in the story file:**
- `## Record` — real file paths changed, layer summary, executed test output
- Acceptance items checked `[x]`
- Frontmatter: `status: ✅`, `tests_status: done`
- If there was a cross-cutting decision, it prepends `docs/decisions/YYYY-MM-DD.json`

**After closing:**
- Run **`/sync-board`** to regenerate the board
- Verify the story appears in the correct column in the monitor

---

## Daily session loop

For experienced users, **`/daily-with-ai`** runs a guided session: checks status, surfaces the right story, and walks through the appropriate workflow.

If you prefer to drive manually:
1. `/status` — what is blocked, what is next
2. One focused conversation per concern (document, backlog, implement — not mixed)
3. `/sync-board` after any US change

---

## Validate the structure

```bash
python3 .agent/scripts/validate_meridian.py <project-folder>
python3 .agent/scripts/validate_meridian.py <project-folder> --json   # machine-readable
```

Run at the project root. Fix errors before creating US or marking docs `approved`.

---

## Slash command reference

| Command | What it does |
| ------- | ------------ |
| `/init-meridian` | Start or migrate a project — creates `docs/` and governance |
| `/status` | Session start — blockers, current state, next action |
| `/architecture` | Draft or review `05_architecture.md` |
| `/security-pass` | Draft or review `02_security.md` |
| `/create-epic` | New product capability in `docs/epics/` |
| `/create-version` | New release in `docs/versions/` |
| `/plan-sprint` | New sprint in `docs/sprints/` |
| `/create-us` | New user story (gates: architecture approved + epic + version exist) |
| `/review-us US-XXXX` | Quality audit — read-only, no changes, no `ready` |
| `/refine-us US-XXXX` | Deepen Plan and Approach — sets `ready: true` when checklist passes |
| `/complete-us US-XXXX` | Close story — fills Record, marks `✅`, syncs board |
| `/sync-board` | Regenerate `docs/kanban/board.json` from US files |
| `/daily-with-ai` | Full guided session loop |
| `/update-decisions-log` | Prepend a decision entry to `docs/decisions/YYYY-MM-DD.json` |

---

## Things that will not work

- Asking the agent to implement without a `ready: true` story
- Marking `✅` in chat without running `/complete-us` in the files
- Editing `board.json` directly — it is always generated
- Creating US before `05_architecture.md` is `approved`
- Mixing document work, backlog work, and implementation in one conversation
- Setting `approved` on a document you did not read
- Using `status: ✅` without a filled `## Record`
