<p align="center">
  <img src="assets/screenshots/meridian-header.jpg" alt="Meridian — Scrum-inspired workflow protocol for AI agents" width="100%" />
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-PolyForm%20Noncommercial-blue" alt="PolyForm Noncommercial 1.0.0" /></a>
  <a href=".github/workflows/ci.yml"><img src="https://img.shields.io/badge/CI-GitHub%20Actions-2088FF?logo=githubactions&logoColor=white" alt="CI" /></a>
  <img src="https://img.shields.io/badge/status-experimental-orange" alt="Experimental" />
</p>

<p align="center">
  <strong>AI agents that build what you actually specified.</strong><br />
  Spec in Git. Agent reads the spec. Done means done in files — not in chat.
</p>

> **Very early experiment** — personal project; APIs and rules will change. [Live demo](https://colabcolibri.github.io/meridian/) · [Protocol](.agent/MERIDIAN.md)

# Meridian

**Set the meridian before you write code.**

## The problem

AI agents in the IDE produce code fast — but without a written spec they hallucinate scope, repeat decisions already made, and "done" means whatever the model said five messages ago. A week later you cannot answer:

- What are we building, and what is explicitly out of scope?
- Which user story is next, and what counts as finished?
- Why did we make that architectural call last Tuesday?

Chat does not persist. Files do.

## What Meridian is

Meridian is a **Scrum-inspired workflow protocol** that keeps AI agents accountable to a written spec — not to chat history.

You manage the project through Markdown files in `docs/`. Agents read those same files, propose and implement work, and record evidence of completion. You approve direction; agents execute. The loop is:

```
document → plan → refine → implement → close → commit
```

Every step produces a file. Every file is Git history.

## How it works

| Step | What you do | What the agent does |
| ---- | ----------- | ------------------- |
| **Document** | Approve phase docs (`00_scope` → `05_architecture`) | Drafts, asks questions, fills gaps |
| **Plan** | Approve epics, versions, sprint | Creates artifacts from your answers |
| **Refine** | Review story intent | Deepens Approach, sets `ready: true` |
| **Implement** | Reference the US file | Reads spec, writes code |
| **Close** | Review diff, run tests | Fills `## Record`, marks `status: ✅` |
| **Commit** | `git commit` | Suggests message — does not commit unless asked |

**Rule:** no product code without `ready: true`. No `✅` without evidence in the Record. You hold both gates.

## Two things in every Meridian project

| | Role |
| - | ---- |
| **`docs/`** | The spec — scope, architecture, epics, versions, user stories, decision log. If it is not here, it is not managed. |
| **`.agent/`** | The workflow kit — agents, skills, slash commands, rules. Copy into your repo. |

## What is in this repository

| Piece | Required? | What it does |
| ----- | --------- | ------------ |
| [`.agent/`](.agent/) | **Yes** | Portable workflow kit — agents, skills, commands. Copy into every project. |
| `docs/` (in *your* project) | **Yes** | Living spec — [dogfooding example](app-desktop/docs/) here. |
| [`app-desktop/`](app-desktop/) | No | Read-only monitor — shows Setup, Board, Deliverables from `docs/`. |
| `.cursor/` · `.claude/` | Local only | IDE adapters generated from `.agent/` ([details](.agent/IDE_ADAPTERS.md)). Not committed. |

## Quick start

```bash
git clone https://github.com/colabcolibri/meridian.git
cd meridian

# Cursor or Claude Code — generate local adapters (not committed):
chmod +x .agent/scripts/sync_cursor_kit.sh
./.agent/scripts/sync_cursor_kit.sh

# Optional — monitor locally:
cd app-desktop && pnpm install && pnpm dev
```

Then run `/init-meridian` in your IDE to create `docs/` for your project.

## Adopt Meridian in your project

```bash
cp -R path/to/meridian/.agent ./your-project/
```

1. Commit `.agent/`.
2. Run `/init-meridian` — agent creates `docs/` (new project or existing codebase migration).
3. Run the sync script if using Cursor or Claude Code.
4. Optional: open `app-desktop` or the [live demo](https://colabcolibri.github.io/meridian/) to monitor `docs/`.

## IDE support

The portable kit lives in `.agent/`. No lock-in.

| IDE / tool | How |
| ---------- | --- |
| **Antigravity, ag-kit** | Point at `.agent/` — works natively. |
| **Cursor** | `sync_cursor_kit.sh` → `.cursor/` (gitignored). |
| **Claude Code** | Same script → `.claude/` (gitignored). |

Details: [`.agent/IDE_ADAPTERS.md`](.agent/IDE_ADAPTERS.md)

## Agents and commands

Seven agents handle specialized work: `process-manager`, `scope-architect`, `documentation-strategist`, `security-steward`, `architecture-guardian`, `sprint-planner`, `board-keeper`.

Common commands: `/init-meridian`, `/status`, `/create-epic`, `/create-version`, `/plan-sprint`, `/create-us`, `/review-us`, `/refine-us`, `/complete-us`, `/sync-board`, `/architecture`, `/security-pass`, `/daily-with-ai`.

Full reference: [usage guide](.agent/references/usage-guide.md).

## Validate

```bash
python3 .agent/scripts/validate_meridian.py app-desktop
python3 .agent/scripts/validate_meridian.py app-desktop --json
```

## Monitor

**Live demo:** [https://colabcolibri.github.io/meridian/](https://colabcolibri.github.io/meridian/)

**Locally:** `pnpm dev` in `app-desktop/`, open http://localhost:5173, click **Open docs folder**.

The monitor reads `docs/` — it does not replace `.agent/` or your IDE.

## Protocol authority

When agents conflict, resolution order:

1. Your instruction
2. [`.agent/MERIDIAN.md`](.agent/MERIDIAN.md)
3. [`.agent/rules/MERIDIAN.md`](.agent/rules/MERIDIAN.md)
4. Workflows → agents → skills

## Contributing · license

[`CONTRIBUTING.md`](CONTRIBUTING.md) · [`SECURITY.md`](SECURITY.md) · [PolyForm Noncommercial 1.0.0](LICENSE)
