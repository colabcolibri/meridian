<p align="center">
  <img src="assets/meridian-readme-header.svg" alt="Meridian — repo-native harness for AI-assisted delivery" width="100%" />
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-PolyForm%20Noncommercial-blue" alt="PolyForm Noncommercial 1.0.0" /></a>
  <a href=".github/workflows/ci.yml"><img src="https://img.shields.io/badge/CI-GitHub%20Actions-2088FF?logo=githubactions&logoColor=white" alt="CI" /></a>
  <img src="https://img.shields.io/badge/status-experiment-orange" alt="Experiment" />
</p>

<p align="center">
  <strong>Repo-native harness for AI coding agents — phase docs, SQLite backlog,<br />
  slash workflows, and gates so “done” means what you wrote down, not what chat remembered.</strong>
</p>

> Early personal experiment: rules, structure, and APIs will change.  
> Agents and maintainers: [full protocol](.agent/MERIDIAN.md) · humans: [how to use](.agent/references/how-to-use.md)

## What Meridian is

Meridian is a **thin layer on top of Cursor or Claude Code** that keeps delivery state in the repository:

| Layer | Path | Role |
| ----- | ---- | ---- |
| **Phase memory** | `docs/` (`00`–`11`) | Scope, architecture, security — approved before backlog work |
| **Delivery runtime** | `.meridian/meridian.db` + `delivery.json` | Versions, sprints, epics, user stories (DB gitignored; connector config committed) |
| **Agent harness** | `.agent/` (kit) | Rules, agents, skills, slash workflows, validators |
| **IDE board** (optional) | [`app-visual-studio/`](app-visual-studio/) | Kanban and planning views that read SQLite — not the harness itself |

Chat does not persist. **Files do.** You stay the manager; agents draft and execute inside gates (`ready`, `## Record`, `approved`).

**How you drive it:** type **slash workflows** in chat (`/status`, `/create-us`, `/implement-us`) — not agent names. Workflows route to the right persona; override with `@backlog-refiner` when needed. Use the **extension** to see the board and run **Validate Project**; use **chat** to create and change backlog and docs. [Surfaces guide](.agent/references/how-to-use.md)

## Try it now

```bash
git clone https://github.com/colabcolibri/meridian.git
cd meridian

# Cursor or Claude Code — generate local adapters (not committed):
chmod +x .agent/scripts/sync_cursor_kit.sh
./.agent/scripts/sync_cursor_kit.sh
```

1. In your IDE: **`/init-meridian`** — creates `docs/` and bootstraps `.meridian/`.
2. **`/agents-help`** — command map and numbered steps ([`.agent/references/agents-help.md`](.agent/references/agents-help.md)).
3. Optional: install the VS Code extension — `cd app-visual-studio && pnpm install && pnpm install:cursor`.
4. Anytime: **`/status`** — blockers, counts, suggested next step.

**Another repo:** copy `.agent/`, run `/init-meridian`, sync the kit. Brownfield → `/document-project` and `docs/inventory/as-is.md`.  
**Kit-only release:** [`.agent/DISTRIBUTION.md`](.agent/DISTRIBUTION.md) · Marketplace: [Meridian Harness](https://marketplace.visualstudio.com/items?itemName=colabcolibri.meridian-vscode).

## How it works

<p align="center">
  <img src="assets/infographic/meridian-agent-infrastructure-4x5-final.png" alt="Meridian infrastructure for AI-assisted delivery" width="720" />
</p>

```txt
document → plan → refine → implement → close → commit
```

| Step | In one line |
| ---- | ----------- |
| **Document** | Scope, stack, security, architecture in `docs/00`–`11` — you approve, agent drafts |
| **Plan** | Epics, versions, sprint, and user stories in `.meridian/meridian.db` |
| **Refine** | Story gets a concrete Approach and `ready: true` before any product code |
| **Implement** | Agent reads the US and codes against acceptance criteria |
| **Close** | Agent fills `## Record` with evidence; you review and set `status: ✅` |
| **Commit** | One commit per closed story — code and docs together in Git |

**Two rules:** no product code without `ready: true`. No ✅ without a filled `## Record`.

## Extension screenshots

The optional [VS Code / Cursor extension](app-visual-studio/) reads `.meridian/meridian.db` and surfaces the backlog inside the IDE — board, versions, sprints, epics, and user-story detail.

<table>
  <tr>
    <td width="50%" valign="top">
      <img src="assets/screenshots/board-kanban.jpg" alt="Meridian kanban board with version and epic filters" width="100%" />
      <p align="center"><sub><strong>Board</strong> — 📋 Backlog / 📌 Todo (from <code>ready</code>), status columns, version and epic filters</sub></p>
    </td>
    <td width="50%" valign="top">
      <img src="assets/screenshots/versions-roadmap.jpg" alt="Meridian versions roadmap with sprints and epics" width="100%" />
      <p align="center"><sub><strong>Versions</strong> — release roadmap with nested sprints and epics</sub></p>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <img src="assets/screenshots/sprints-list.jpg" alt="Meridian sprints list filtered by version" width="100%" />
      <p align="center"><sub><strong>Sprints</strong> — time-boxed goals and done-when criteria</sub></p>
    </td>
    <td width="50%" valign="top">
      <img src="assets/screenshots/epics-list.jpg" alt="Meridian epics list with user story progress" width="100%" />
      <p align="center"><sub><strong>Epics</strong> — capability blocks and story progress</sub></p>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <img src="assets/screenshots/user-story-viewer.jpg" alt="Meridian user story markdown viewer beside the board" width="100%" />
      <p align="center"><sub><strong>User story</strong> — read acceptance, plan, and approach</sub></p>
    </td>
    <td width="50%" valign="top">
      <img src="assets/screenshots/user-story-editor.jpg" alt="Meridian user story form editor beside the board" width="100%" />
      <p align="center"><sub><strong>Edit story</strong> — structured form with dependencies</sub></p>
    </td>
  </tr>
</table>

## Why this experiment

AI agents in the IDE ship code fast — but without a written spec, scope drifts in chat, decisions get lost, and “done” means whatever the model said five messages ago.

Meridian tests whether **guides, sensors, and structured artifacts** (commands, skills, SQLite backlog, phase docs) let a solo developer — or longer autonomous runs on an open backlog — ship **documented, gated** software without re-explaining context every session.

**Open questions:** Does SQLite-backed delivery reduce drift on long agent sessions? Do file-based Scrum-shaped workflows cost fewer credits than chat-only planning? Do `ready` / `Record` gates actually improve quality, not just speed? This repository is the lab.

Scrum-inspired, adapted for **one human directing AI agents** — no story points, velocity, or mandatory Feature layer. [Scrum ↔ Meridian map](.agent/references/scrum-meridian-map.md)

## Harness layout (`.agent/`)

Slash commands are **workflows** → routed **agents** → **skills** → `docs/` + SQLite. Canonical tree:

```txt
.agent/
├── MERIDIAN.md, rules/          # protocol and P0 gates
├── workflows/                   # what you type: /status, /create-us, …
├── agents/, skills/             # personas and procedures (routed — see agents-help)
├── references/                  # how-to-use, start-here, usage-guide, agents-help
└── scripts/                     # Python toolkit (stdlib) — see below
```

**Agent map (all personas):** [agents-help](.agent/references/agents-help.md) — full table, groups, and step order. Do not duplicate that list here.

### Python toolkit (`scripts/`)

Still required in v11 — not replaced by chat. Agents and CI call the **delivery facade**; the extension calls export + validate.

| Entry | Role |
| ----- | ---- |
| [`meridian_delivery.py`](.agent/scripts/meridian_delivery.py) | **Default CLI** — `counts`, `show`, `create-us`, `update-us`, `prepend-decision`, … (reads `.meridian/delivery.json`) |
| [`validate_meridian.py`](.agent/scripts/validate_meridian.py) | Structure / governance check (`--sqlite-only` for delivery-only projects) |
| [`meridian_db_export.py`](.agent/scripts/meridian_db_export.py) | Planning JSON for the IDE board |
| [`bootstrap_meridian_db.py`](.agent/scripts/bootstrap_meridian_db.py) | Create or upgrade `.meridian/meridian.db` |

Details and maintainer scripts: [`.agent/scripts/README.md`](.agent/scripts/README.md).  
**Deprecated (v11):** `docs/kanban/board.json` and board sync — kanban lives in SQLite `board_snapshots` only.

**Maintainers:** [instruction surfaces](.agent/references/instruction-surfaces.md) · kit tarball: `KIT_VERSION=1.0.0 ./.agent/scripts/package-kit.sh` ([distribution](.agent/DISTRIBUTION.md))

## Distribution (for others)

| Product | How users get it |
| ------- | ---------------- |
| **Meridian Harness** (kit + board) | [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=colabcolibri.meridian-vscode) → **Meridian: Install Harness** in each project |

Publisher: **colabcolibri** · [GitHub](https://github.com/colabcolibri/meridian)

## What's in this repository

| Piece | Required? | Role |
| ----- | --------- | ---- |
| [`.agent/`](.agent/) | Yes (in your project) | Portable harness kit — guides, skills, validation |
| `docs/` | Yes (in your project) | Living spec — [example here](docs/) |
| [`app-visual-studio/`](app-visual-studio/) | No | VS Code/Cursor extension — board reads `.meridian/meridian.db` |

## Where the experiment stands

| Version | What | Status |
| ------- | ---- | ------ |
| **v4** | VS Code extension — board, versions, sprints, epics | Shipped |
| **v9** | SQLite delivery store + kit scripts | Shipped |
| **v10** | Remove browser monitor; dogfood `docs/` at repo root | Shipped |
| **v11** | SQLite-only board; `meridian_delivery.py` facade + `delivery.json` | Shipped |
| v5+ | Write commands, wizards | Planned |

Older protocol notes (v1 Markdown delivery, cutover): [`MERIDIAN_V2_CUTOVER.md`](MERIDIAN_V2_CUTOVER.md) — only if you are upgrading a legacy tree.

## Reference

- [Protocol for agents](.agent/MERIDIAN.md) · [AGENTS.md](AGENTS.md) (IDE layering — workflows vs agents)
- [How to use Meridian](.agent/references/how-to-use.md) — extension vs chat
- [Concepts](.agent/references/start-here.md) · [Recipes](.agent/references/usage-guide.md) · [Command reference](.agent/references/agents-help.md)
- [Scrum ↔ Meridian map](.agent/references/scrum-meridian-map.md)
- [Scripts index](.agent/scripts/README.md) · validate: `python3 .agent/scripts/validate_meridian.py . --sqlite-only` · delivery: `python3 .agent/scripts/meridian_delivery.py counts`
- [IDE adapters](.agent/IDE_ADAPTERS.md) — Antigravity native; Cursor/Claude/Codex via sync script
- Monorepo / multi-product: `.meridian/projects.json` ([usage guide](.agent/references/usage-guide.md))

## Contributing · license

[`CONTRIBUTING.md`](CONTRIBUTING.md) · [`SECURITY.md`](SECURITY.md) · [PolyForm Noncommercial 1.0.0](LICENSE)

Feedback and issues welcome — open lab, not a finished product.
