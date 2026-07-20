<p align="center">
  <img src="assets/meridian-readme-header.svg" alt="Meridian — a simple Scrum-based harness for coding with IDEs" width="100%" />
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-PolyForm%20Noncommercial-blue" alt="PolyForm Noncommercial 1.0.0" /></a>
  <a href=".github/workflows/ci.yml"><img src="https://img.shields.io/badge/CI-GitHub%20Actions-2088FF?logo=githubactions&logoColor=white" alt="CI" /></a>
  <img src="https://img.shields.io/badge/status-experiment-orange" alt="Experiment" />
</p>

<p align="center">
  <strong>A simple Scrum-based harness for coding with IDEs.<br />
  You manage; agents ship story by story — delivery state grows in SQLite.</strong>
</p>

## What it is

Meridian keeps the plan next to the code so IDE agents work inside a delivery loop you control — not a long chat that forgets.

| Layer | Where | What you get |
| ----- | ----- | ------------ |
| **Docs** | `docs/` | Scope, architecture, security — approved before backlog work |
| **Delivery** | `.meridian/meridian.db` | Versions, sprints, epics, user stories (state that grows with the project) |
| **Harness** | `.agent/` | Slash workflows, agent roles, skills, validators |
| **Board** (optional) | [VS Code / Cursor extension](app-visual-studio/) | Kanban and planning views inside the IDE |

You type **slash commands** (`/status`, `/create-us`, `/implement-us`). The harness routes the right agent. The extension is for **seeing** the board; chat is for **changing** the plan. [Surfaces →](.agent/references/how-to-use.md)

## Install

**Recommended — Marketplace**

1. Install [Meridian Harness](https://marketplace.visualstudio.com/items?itemName=colabcolibri.meridian-vscode) (publisher **colabcolibri**) in VS Code or Cursor.
2. Open your project → **Meridian: Install Harness**.
3. In chat: **`/init-meridian`** (new project) or **`/document-project`** (existing codebase).
4. **Meridian: Open Board** · anytime **`/status`**.
5. Read [how to use](.agent/references/how-to-use.md) for extension vs chat.

**Clone this repo** only if you are developing Meridian itself (kit + extension). This repository already has Meridian’s own `docs/` as an example project — it does not ship a ready SQLite DB (local `.meridian/meridian.db` is gitignored).

```bash
git clone https://github.com/colabcolibri/meridian.git
cd meridian
./.agent/scripts/sync_cursor_kit.sh
```

Then bootstrap delivery if needed (`/init-meridian` or the kit scripts) and optional `cd app-visual-studio && pnpm install && pnpm install:cursor`.

## How it works

<p align="center">
  <img src="assets/infographic/meridian-agent-infrastructure-4x5-final.png" alt="Meridian infrastructure for AI-assisted delivery" width="720" />
</p>

```txt
document → plan → refine → implement → close → commit
```

| Step | What happens |
| ---- | ------------ |
| **Document** | You approve scope and architecture in `docs/` — agents draft |
| **Plan** | Epics, versions, sprints, and user stories land in SQLite |
| **Refine** | Story is concrete enough to build before any product code |
| **Implement** | Agent codes against acceptance criteria |
| **Close** | Evidence goes on the story; you mark it done |
| **Commit** | One commit per closed story |

**Two rules:** no product code until the story is ready. No “done” without a written record of what shipped.

Scrum-inspired for **one human directing AI agents** — no story points or velocity theater. [Scrum ↔ Meridian](.agent/references/scrum-meridian-map.md)

## Screenshots

<table>
  <tr>
    <td width="50%" valign="top">
      <img src="assets/screenshots/board-kanban.jpg" alt="Meridian kanban board with version and epic filters" width="100%" />
      <p align="center"><sub><strong>Board</strong> — 📋 Backlog / 📌 Todo, status columns, filters</sub></p>
    </td>
    <td width="50%" valign="top">
      <img src="assets/screenshots/versions-roadmap.jpg" alt="Meridian versions roadmap with sprints and epics" width="100%" />
      <p align="center"><sub><strong>Versions</strong> — release roadmap with sprints and epics</sub></p>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <img src="assets/screenshots/sprints-list.jpg" alt="Meridian sprints list filtered by version" width="100%" />
      <p align="center"><sub><strong>Sprints</strong> — time-boxed goals</sub></p>
    </td>
    <td width="50%" valign="top">
      <img src="assets/screenshots/epics-list.jpg" alt="Meridian epics list with user story progress" width="100%" />
      <p align="center"><sub><strong>Epics</strong> — capability blocks and progress</sub></p>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <img src="assets/screenshots/user-story-viewer.jpg" alt="Meridian user story markdown viewer beside the board" width="100%" />
      <p align="center"><sub><strong>User story</strong> — acceptance, plan, approach</sub></p>
    </td>
    <td width="50%" valign="top">
      <img src="assets/screenshots/user-story-editor.jpg" alt="Meridian user story form editor beside the board" width="100%" />
      <p align="center"><sub><strong>Edit story</strong> — form with dependencies</sub></p>
    </td>
  </tr>
</table>

## Why this exists

Agents ship code fast. Without a written plan, scope drifts in chat and “done” means whatever the model said last.

Meridian is a lab for a thinner path: you manage delivery; agents execute story by story; state lives in SQLite and grows with the project — so the next session starts from the board, not from re-explaining everything.

## In this repository

| Piece | Role |
| ----- | ---- |
| [`.agent/`](.agent/) | Portable harness (workflows, agents, skills, Python toolkit) |
| [`docs/`](docs/) | Phase docs for Meridian itself (example project in this repo) |
| [`app-visual-studio/`](app-visual-studio/) | Optional IDE board (Marketplace: **Meridian Harness**) |

**Toolkit (agents / CI / board):** `meridian_delivery.py`, `validate_meridian.py`, `meridian_db_export.py` — details in [`.agent/scripts/README.md`](.agent/scripts/README.md).  
**Status of the experiment:** v11 ships SQLite delivery + IDE board; write wizards still planned. Legacy Markdown cutover: [`MERIDIAN_V2_CUTOVER.md`](MERIDIAN_V2_CUTOVER.md).

## Reference

- [How to use](.agent/references/how-to-use.md) · [Concepts](.agent/references/start-here.md) · [Recipes](.agent/references/usage-guide.md) · [Commands](.agent/references/agents-help.md)
- [Protocol](.agent/MERIDIAN.md) · [AGENTS.md](AGENTS.md) · [Distribution](.agent/DISTRIBUTION.md) · [IDE adapters](.agent/IDE_ADAPTERS.md)
- Validate: `python3 .agent/scripts/validate_meridian.py . --sqlite-only` · Delivery: `python3 .agent/scripts/meridian_delivery.py counts`

## Contributing · license

[`CONTRIBUTING.md`](CONTRIBUTING.md) · [`SECURITY.md`](SECURITY.md) · [PolyForm Noncommercial 1.0.0](LICENSE)

Feedback welcome — open lab, not a finished product.
