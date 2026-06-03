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

**Docs-first** (documentation-driven) development: the spec lives in Git next to the code. User stories and acceptance criteria follow familiar agile ideas; Meridian is not Scrum-in-a-box and not Jira — it is a **file protocol** for one repo, one truth, AI included.

**You** stay manager: agents propose and implement; you approve documents, scope, and ✅ with evidence.

**Guides:** [Start here](.agent/references/start-here.md) (concepts) · [Usage guide](.agent/references/usage-guide.md) (commands and daily flow).

## Two pieces in every Meridian project

| Piece | Role |
| ----- | ---- |
| **`docs/`** | What is true about the product — if it is not here, it is not part of the process. |
| **`.agent/`** | How AI sessions run — slash workflows, agents, skills, rules (copy this kit into your repo). |

Code implements `docs/`. Agents follow `.agent/`. Chat is where work happens; **files are what persist.**

## What is in this repository

| Piece | Required? | What it does |
| ----- | --------- | ------------ |
| [`.agent/`](.agent/) + [protocol](.agent/MERIDIAN.md) | **Yes** | Defines the Meridian flow: agents, workflows (`/status`, `/complete-us`, …), skills, and always-on rules. **Copy into every Meridian project.** |
| `docs/` (in *your* project) | **Yes** | Project documentation the agents read and update — not shipped inside this kit repo except as a [dogfooding example](app-desktop/docs/). |
| `.cursor/` | Cursor only | Local mirror of `.agent/` ([adapter](.agent/CURSOR_ADAPTER.md)). Symlinks, not committed. |
| [`app-desktop/`](app-desktop/) | **No** | Optional **visual tracker** (browser): read a `docs/` folder and see setup, deliverables, decisions, and kanban. Does not replace `.agent/` or your IDE. |

## IDE support

Meridian is **not tied to Cursor**. The kit lives in `.agent/` (Antigravity / ag-kit convention). Any IDE that reads `.agent/` can use it as-is.

| IDE / tool | How you use Meridian |
| ---------- | ------------------- |
| **Antigravity, ag-kit, others** | Point the IDE at `.agent/` — workflows, agents, and skills work natively. |
| **Cursor** | Cursor does not index `.agent/` by default. Run `./.agent/scripts/sync_cursor_kit.sh` to build a **local** `.cursor/` folder (rules, skills, agents, slash commands). Still edit the kit in `.agent/`; regenerate symlinks after clone or kit changes. |

```txt
.agent/          ← source of truth (commit this)
.cursor/         ← Cursor adapter only (gitignored, symlinks → .agent/)
```

Details: [`.agent/CURSOR_ADAPTER.md`](.agent/CURSOR_ADAPTER.md)

## How it works

1. **Document** — Phase docs (`00_scope` … `05_architecture`, security, stack, …) and `docs/decisions/` for why things changed.
2. **Plan** — Epics, versions, sprints, and user stories after architecture is approved enough to commit.
3. **Refine** — `/refine-us` deepens Approach and sets `ready: true` before any product code.
4. **Execute** — Work from a US file; record evidence; `/complete-us` when it is really done.

**Rule of thumb:** if it is not in `docs/`, it is not part of the managed process — chat does not count.

No login. No cloud. Git holds the history. Agents follow `.agent/`; the monitor, if you use it, only **reads** `docs/`.

## What it is not

- Not a PM SaaS, not a wiki you forget to update, not vibe-coding without a spec.
- Not “the agent said done” — done is in `docs/us/` with acceptance and implementation recorded.
- Not the monitor running the project — the IDE + `.agent/` + `docs/` do; the app only displays files.

## Quick start

```bash
git clone https://github.com/colabcolibri/meridian.git
cd meridian

# Cursor only — mirror .agent/ into .cursor/ (local, not committed):
chmod +x .agent/scripts/sync_cursor_kit.sh
./.agent/scripts/sync_cursor_kit.sh

# Optional — monitor locally:
cd app-desktop && pnpm install && pnpm dev
```

If your IDE already supports `.agent/`, skip the sync script and open the repo there.

**New to Meridian?** [Start here](.agent/references/start-here.md) → [Usage guide](.agent/references/usage-guide.md) → `/init-meridian` or `/status`.

### Monitor

**Live demo:** [https://colabcolibri.github.io/meridian/](https://colabcolibri.github.io/meridian/) — read-only monitor with this repo’s `app-desktop/docs/` preloaded (no folder picker).

**Run locally:** `pnpm dev` in `app-desktop/`, open http://localhost:5173, click **Open docs folder**, and select a Meridian `docs/` directory (e.g. `app-desktop/docs/`).

**Same build as Pages:** `pnpm dev:demo`, or `VITE_BASE_PATH=/meridian/ pnpm build:demo && VITE_BASE_PATH=/meridian/ pnpm preview`.

The **real Meridian loop runs in your IDE** through `.agent/` — workflows, agents, and slash commands. The monitor is a **read-only window** on the Markdown and JSON you commit in `docs/`. Same guides as the first two tabs also exist as Markdown: [start-here.md](.agent/references/start-here.md) · [usage-guide.md](.agent/references/usage-guide.md).

| Tab | What you see |
| --- | ------------ |
| Start here | Concepts, `docs/` map, phases |
| Usage guide | Daily paths and slash commands |
| Setup | Phase docs 00–11 and gates |
| Decisions | `docs/decisions/*.json` by day |
| Deliverables | Versions, sprints, epics, coverage |
| Board | Kanban from US frontmatter |
| Story detail | One US — Intent, Plan, Record, Boundaries (sheet from Board or Deliverables) |

Deploy to GitHub Pages runs on push to `main` when `app-desktop/` changes ([deploy-demo.yml](.github/workflows/deploy-demo.yml)).

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
2. **Antigravity / `.agent`-native IDE** — workflows and agents under `.agent/` drive the process.
3. **Cursor** — run `./.agent/scripts/sync_cursor_kit.sh` for slash commands in `.cursor/`; still edit the kit in `.agent/`. Do not commit `.cursor/`.
4. **Monitor (optional)** — use the [live demo](https://colabcolibri.github.io/meridian/) or run `app-desktop` locally.

## Agents and commands

| Where | Agents | Commands |
| ----- | ------ | -------- |
| `.agent/` (all IDEs) | `process-manager`, `scope-architect`, `documentation-strategist`, `security-steward`, `architecture-guardian`, `sprint-planner`, `board-keeper` | Workflows in `.agent/workflows/` — see [usage guide](.agent/references/usage-guide.md) |
| `.cursor/` (Cursor) | Same personas (symlinked) | Slash commands: `/init-meridian`, `/status`, `/create-us`, `/refine-us`, `/complete-us`, `/sync-board`, `/daily-with-ai`, … |

Full map: [`.agent/ARCHITECTURE.md`](.agent/ARCHITECTURE.md).

## Protocol authority

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

## Contributing · license

[`CONTRIBUTING.md`](CONTRIBUTING.md) · [`SECURITY.md`](SECURITY.md) · [PolyForm Noncommercial 1.0.0](LICENSE)
