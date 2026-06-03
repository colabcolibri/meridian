<p align="center">
  <img src="assets/screenshots/meridian-header.jpg" alt="Meridian — Documentation-Driven Development Protocol for AI Agents" width="100%" />
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-PolyForm%20Noncommercial-blue" alt="PolyForm Noncommercial 1.0.0" /></a>
  <a href=".github/workflows/ci.yml"><img src="https://img.shields.io/badge/CI-GitHub%20Actions-2088FF?logo=githubactions&logoColor=white" alt="CI" /></a>
  <img src="https://img.shields.io/badge/status-experimental-orange" alt="Experimental" />
</p>

<p align="center">
  <strong>Your repo documents what you are building.</strong><br />
  AI agents read the same files — so “done” means done in Git, not done in chat.
</p>

<!-- GitHub About → Settings → Description: -->
<!-- Docs-first protocol: structure your app in Git, work with AI from user stories and acceptance in files. -->

> **Very early experiment** — personal project; APIs and rules will change. [Live demo](https://colabcolibri.github.io/meridian/) · [Protocol](.agent/MERIDIAN.md)

# Meridian

**Set the meridian before you write code.**

## The problem

With AI in the IDE, code appears quickly — but the **project** often does not: decisions stay in chat, scope drifts, and “it’s done” means the model said so five messages ago. A week later you (or the next session) cannot reliably answer:

- What are we building, and what is explicitly out of scope?
- What did we change last Tuesday, and why?
- Which user story is next, and what counts as finished?

Meridian treats that gap as a **documentation problem**, not a tooling problem.

## What Meridian gives you

One place in your repository — the `docs/` folder — to **structure the application** and **run work with AI** without losing continuity:

| You get | What it means in practice |
| ------- | ------------------------- |
| **Ordered product docs** | Scope, stack, security, principles, architecture (`00`–`08`, `11`) — each step unlocks the next so you do not code on vibes alone. |
| **User stories with acceptance** | Work lives in `docs/us/` with Intent / Plan / Record, checkable criteria, and `ready: true` before code; “done” is recorded in the file (`/complete-us`), not implied by a green checkmark in the chat. |
| **A decision trail** | `docs/decisions/` captures *why* something changed — for you on Monday and for the agent on Tuesday. |
| **Agents on rails** | `.agent/` supplies workflows, skills, and gates so the IDE does not reinvent the process every prompt. |
| **Visible progress (optional)** | The monitor reads `docs/` and shows setup, backlog, board, and story detail — read-only, no second source of truth. |

**Docs-first** development: the spec lives in Git next to the code. Meridian is not Scrum-in-a-box and not Jira — it is a **file protocol** for one repo, one truth, AI included.

**You** stay manager: agents propose and implement; you approve documents, scope, and ✅ with evidence.

**Guides:** [Start here](.agent/references/start-here.md) (concepts) · [Usage guide](.agent/references/usage-guide.md) (commands and daily flow).

## Two pieces in every Meridian project

| Piece | Role |
| ----- | ---- |
| **`docs/`** | What is true about the product — if it is not here, it is not part of the process. |
| **`.agent/`** | How AI sessions run — workflows, agents, skills, rules (copy this kit into your repo). |

Code implements `docs/`. Agents follow `.agent/`. Chat is where work happens; **files are what persist.**

## What is in this repository

| Piece | Required? | What it does |
| ----- | --------- | ------------ |
| [`.agent/`](.agent/) + [protocol](.agent/MERIDIAN.md) | **Yes** | Meridian flow: agents, workflows, skills, rules. **Copy into every Meridian project.** |
| `docs/` (in *your* project) | **Yes** | Project documentation agents read and update — [dogfooding example](app-desktop/docs/) in this repo. |
| `.cursor/` · `.claude/` | Local only | IDE adapters generated from `.agent/` ([details](.agent/IDE_ADAPTERS.md)). Symlinks, not committed. |
| [`app-desktop/`](app-desktop/) | **No** | Optional browser monitor — read-only view of `docs/`. Does not replace `.agent/` or your IDE. |

## IDE support

Meridian is **not tied to one editor**. The portable kit lives in `.agent/` (Antigravity / ag-kit convention).

| IDE / tool | How you use Meridian |
| ---------- | ------------------- |
| **Antigravity, ag-kit, others** | Point the tool at `.agent/` — workflows, agents, and skills work natively. No sync step. |
| **Cursor** | Run `./.agent/scripts/sync_cursor_kit.sh` to build `.cursor/` (rules, skills, agents, slash commands). Edit the kit in `.agent/`; regenerate after clone or kit changes. |
| **Claude Code** | Same script builds `.claude/` (agents + slash commands). Workflows map to Claude slash commands; agents map to subagent definitions. |

```txt
.agent/          ← source of truth (commit this)
.cursor/         ← Cursor adapter (gitignored, symlinks → .agent/)
.claude/         ← Claude Code adapter (gitignored, symlinks → .agent/)
```

Details: [`.agent/IDE_ADAPTERS.md`](.agent/IDE_ADAPTERS.md)

## How it works

1. **Document** — Phase docs (`00_scope` … `05_architecture`, security, stack, …) and `docs/decisions/` for why things changed.
2. **Plan** — Epics, versions, sprints, and user stories after architecture is approved.
3. **Refine** — `/review-us` (optional audit) then `/refine-us` deepens Approach and sets `ready: true` before product code.
4. **Execute** — Work from a US file; record evidence; `/complete-us` when it is really done.
5. **Commit** — You review `git diff` and commit (one US per commit). Agents do not commit unless you ask — see [commit-after-us-close](.agent/references/commit-after-us-close.md).

**Rule of thumb:** if it is not in `docs/`, it is not part of the managed process — chat does not count.

No login. No cloud. Git holds the history. The monitor, if you use it, only **reads** `docs/`.

## What it is not

- Not a PM SaaS or a wiki you forget to update — it is Markdown and JSON in your repo.
- Not “the agent said done” — done is `status: ✅` in `docs/us/` with a filled Record, then your git commit.
- Not the monitor running the project — the IDE + `.agent/` + `docs/` do; the app only displays files.

## Quick start

```bash
git clone https://github.com/colabcolibri/meridian.git
cd meridian

# Cursor or Claude Code — mirror .agent/ into local adapters (not committed):
chmod +x .agent/scripts/sync_cursor_kit.sh
./.agent/scripts/sync_cursor_kit.sh

# Optional — monitor locally:
cd app-desktop && pnpm install && pnpm dev
```

If your IDE already supports `.agent/` natively, skip the sync script.

**New to Meridian?** [Start here](.agent/references/start-here.md) → [Usage guide](.agent/references/usage-guide.md) → `/init-meridian` or `/status`.

### Monitor

**Live demo:** [https://colabcolibri.github.io/meridian/](https://colabcolibri.github.io/meridian/) — read-only monitor with this repo’s `app-desktop/docs/` preloaded.

**Run locally:** `pnpm dev` in `app-desktop/`, open http://localhost:5173, click **Open docs folder**, select a Meridian `docs/` directory (e.g. `app-desktop/docs/`).

The loop itself runs in your IDE via `.agent/`; the monitor is a read-only window on the same files. Tabs: Start here, Usage guide, Setup, Decisions, Deliverables, Board — plus story detail as a sheet from Board or Deliverables. Markdown mirrors: [start-here.md](.agent/references/start-here.md) · [usage-guide.md](.agent/references/usage-guide.md).

Deploy to GitHub Pages on push to `main` when `app-desktop/` changes ([deploy-demo.yml](.github/workflows/deploy-demo.yml)).

## Adopt Meridian in your project

You need **both** in the target repo:

```txt
your-project/
  .agent/          ← required: flows, agents, skills (copy from this kit)
  docs/            ← required: create via /init-meridian or init-project skill
```

```bash
cp -R path/to/meridian/.agent ./your-project/
```

1. Commit `.agent/` and grow `docs/` as the living project record.
2. **Native `.agent/` IDE** — workflows and agents drive the process with no adapter.
3. **Cursor or Claude Code** — run `./.agent/scripts/sync_cursor_kit.sh` after clone; do not commit `.cursor/` or `.claude/`.
4. **Monitor (optional)** — [live demo](https://colabcolibri.github.io/meridian/) or run `app-desktop` locally.

## Agents and commands

Seven agents (`process-manager`, `scope-architect`, `documentation-strategist`, `security-steward`, `architecture-guardian`, `sprint-planner`, `board-keeper`) orchestrate workflows in `.agent/workflows/`.

| Where | Slash commands |
| ----- | -------------- |
| `.agent/workflows/` | Source definitions — all IDEs |
| `.cursor/commands/` | Cursor — after sync |
| `.claude/commands/` | Claude Code — after sync |

Common commands: `/init-meridian`, `/status`, `/create-epic`, `/create-version`, `/plan-sprint`, `/create-us`, `/review-us`, `/refine-us`, `/complete-us`, `/sync-board`, `/architecture`, `/security-pass`, `/daily-with-ai`. Full list: [usage guide](.agent/references/usage-guide.md). Map: [`.agent/ARCHITECTURE.md`](.agent/ARCHITECTURE.md).

## Protocol authority

When agents conflict, resolution order is:

1. Your instruction  
2. [`.agent/MERIDIAN.md`](.agent/MERIDIAN.md)  
3. [`.agent/rules/MERIDIAN.md`](.agent/rules/MERIDIAN.md)  
4. Workflows → agents → skills  

## Validate locally

```bash
python3 .agent/scripts/validate_meridian.py app-desktop
python3 .agent/scripts/validate_meridian.py app-desktop --json   # CI / machine output
cd app-desktop && pnpm lint && pnpm test && pnpm build
```

Run validation before marking docs `approved` or creating user stories.

## Contributing · license

[`CONTRIBUTING.md`](CONTRIBUTING.md) · [`SECURITY.md`](SECURITY.md) · [PolyForm Noncommercial 1.0.0](LICENSE)
