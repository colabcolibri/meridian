<p align="center">
  <img src="assets/meridian-readme-header.svg" alt="Meridian — a Scrum-based harness for coding with AI in the IDE" width="100%" />
</p>

<p align="center">
  <a href="https://marketplace.visualstudio.com/items?itemName=colabcolibri.meridian-vscode"><img src="https://img.shields.io/visual-studio-marketplace/v/colabcolibri.meridian-vscode?label=extension" alt="Marketplace version" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-PolyForm%20Noncommercial-blue" alt="PolyForm Noncommercial 1.0.0" /></a>
  <a href=".github/workflows/ci.yml"><img src="https://img.shields.io/badge/CI-GitHub%20Actions-2088FF?logo=githubactions&logoColor=white" alt="CI" /></a>
</p>

<p align="center">
  <strong>You manage delivery. Sixteen specialist agents ship story by story.<br />
  The plan lives in the repo — not in yesterday's chat.</strong>
</p>

---

## What Meridian is

Meridian is a **repo-native harness for AI-assisted development**. It turns Cursor, VS Code, Claude Code, and Codex into a disciplined delivery loop:

- **Written intent** — scope, architecture, and security in `docs/` *before* backlog work
- **Structured delivery** — versions, sprints, epics, and user stories in `.meridian/meridian.db`
- **Specialist agents** — sixteen stations with call signs (Penelope weaves stories, Hephaestus forges code, Machina dispatches — never cooks)
- **Skills + gates** — procedures in `.agent/skills/`, personas in `.agent/agents/`, validators that block vague “done”

You stay the manager. Agents execute **one user story at a time**, with evidence when a story closes.

---

## Why teams pick it up

| Pain without a harness | What Meridian gives you |
| ---------------------- | ------------------------ |
| Scope drifts every chat session | Phase docs + SQLite backlog survive reloads |
| “Done” means whatever the model said last | `ready: true` before code; `✅` only with Record evidence |
| One generic assistant for everything | **16 agents** — PO, architect, security, data, design, QA, dev, … |
| No visibility into what’s in flight | **Kanban board** in the IDE or **HTML monitor** in the browser |
| Re-explaining the project from zero | Open the board, run `/status`, continue where you left off |

---

## Quick start

1. Install **[Meridian Harness](https://marketplace.visualstudio.com/items?itemName=colabcolibri.meridian-vscode)** (VS Code or Cursor).
2. Open your project → **Meridian: Install Harness**.
3. In chat: **`/init-meridian`** (greenfield) or **`/document-project`** (brownfield).
4. **Meridian: Open Board** · anytime **`/status`** · lost? **`/deus-ex`** or **`@deus-ex`**.

**Kit without extension:** [`.agent/KIT_README.md`](.agent/KIT_README.md) · `./install.sh` from a kit release.

**Developing Meridian itself:** clone → `./.agent/scripts/sync_kit.sh` → `cd app-visual-studio && pnpm install`.

---

## How it works

```txt
document → plan → refine → implement → close → commit
```

| Step | You / agent | Gate |
| ---- | ----------- | ---- |
| **Document** | Approve scope & architecture in `docs/` | `05_architecture` approved |
| **Plan** | Epics, versions, sprints, stories in SQLite | `/us-create`, `/epic-create`, … |
| **Refine** | Story is concrete enough to build | `ready: true` (`/us-review`) |
| **Implement** | Agent codes against acceptance | `/us-implement` only when ready |
| **Close** | Evidence on the story Record | `/us-complete` — no batch boilerplate |
| **Commit** | One commit per closed story (recommended) | Human |

Scrum-inspired for **one human directing AI agents** — no story points or velocity theater.  
[Scrum ↔ Meridian](.agent/references/scrum/scrum-meridian-map.md)

---

## Invoke: skills, agents, and dispatch

Kit **v3** uses **skills** (procedures) and **agents** (personas + gates). Workflows were removed.

```txt
YOU  →  /us-create  or  @story-maker     (skill slash or agent mention)
     →  docs/ + .meridian/meridian.db     (source of truth)
```

| Layer | Example | Role |
| ----- | ------- | ---- |
| **Skill** | `/us-create`, `/data-engineering`, `/project-status` | Full procedure |
| **Agent** | `@story-maker`, `@developer`, `@security-champion` | Persona + gates + skill list |
| **Dispatch** | `/deus-ex` · `@deus-ex` (Machina) | Picks the right station — never cooks |

Full roster and call signs: [agent-personas.md](.agent/references/agents/agent-personas.md) · [agents-help.md](.agent/references/guides/agents-help.md)

<details>
<summary><strong>The sixteen stations (click to expand)</strong></summary>

| Agent | Call sign | Domain |
| ----- | --------- | ------ |
| `deus-ex` | **Machina** | Dispatch — allocates, never cooks |
| `scrum-master` | **Kairos** | Process, init, daily loop |
| `product-owner` | **Clio** | Scope, epics |
| `ux-researcher` | **Iris** | Personas, JTBD |
| `technical-writer` | **Calliope** | Phase docs prose |
| `security-champion` | **Janus** | Threat model, secrets |
| `technical-architect` | **Daedalus** | Modules, boundaries |
| `data-engineer` | **Mnemosyne** | Schema, migrations |
| `design-system-owner` | **Harmonia** | Tokens, UI contract |
| `quality-owner` | **Themis** | Test strategy |
| `devops-engineer` | **Vulcan** | CI/CD, environments |
| `sprint-planner` | **Hesperus** | Versions, sprints |
| `story-maker` | **Penelope** | Create & refine US |
| `story-checker` | **Argus** | Review & complete US |
| `developer` | **Hephaestus** | Implementation |
| `code-investigator` | **Hermes** | Trace code, imports |

</details>

---

## Three ways to see the board

| Mode | Best for |
| ---- | -------- |
| **[Meridian Harness extension](app-visual-studio/)** | Kanban, planning views, dependency graphs, architecture diagrams — inside VS Code / Cursor |
| **Kit HTML monitor** | `python3 .agent/board` — local browser board on loopback (no extension) |
| **CLI** | `meridian_delivery.py show`, `list`, `counts` — scripts and CI |

| | **Extension** | **Kit / CLI only** |
| - | ------------- | ------------------- |
| Skills & agents in chat | ✅ | ✅ |
| `docs/` + `.meridian/meridian.db` | ✅ | ✅ |
| Python toolkit (validate, export, bootstrap) | ✅ | ✅ |
| IDE board & graphs | ✅ | HTML monitor only |

[How extension vs chat works →](.agent/references/guides/how-to-use.md) · [Distribution →](.agent/DISTRIBUTION.md)

---

## Screenshots

<table>
  <tr>
    <td width="50%" valign="top">
      <img src="assets/screenshots/board-kanban.jpg" alt="Meridian kanban board with version and epic filters" width="100%" />
      <p align="center"><sub><strong>Board</strong> — backlog, todo, status columns, filters</sub></p>
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

---

## In this repository

| Piece | Role |
| ----- | ---- |
| [`.agent/`](.agent/) | Portable harness — skills, agents, validators, Python toolkit, HTML board |
| [`docs/`](docs/) | Phase docs for Meridian itself (dogfood example) |
| [`app-visual-studio/`](app-visual-studio/) | VS Code extension — board, graphs, kit installer ([Marketplace](https://marketplace.visualstudio.com/items?itemName=colabcolibri.meridian-vscode)) |

**Toolkit:** `meridian_delivery.py`, `validate_meridian.py`, `meridian_db_export.py` — [scripts README](.agent/scripts/README.md).

---

## Documentation map

| Audience | Start here |
| -------- | ---------- |
| **New human** | [How to use](.agent/references/guides/how-to-use.md) → [Start here](.agent/references/guides/start-here.md) → [Usage guide](.agent/references/guides/usage-guide.md) |
| **Commands & agents** | [Agents & commands help](.agent/references/guides/agents-help.md) |
| **AI agents in the IDE** | [AGENTS.md](AGENTS.md) · [MERIDIAN.md](.agent/MERIDIAN.md) |
| **Upgrade from 2.x** | [kit-v3-migration.md](.agent/references/protocol/kit-v3-migration.md) |
| **Contributing** | [CONTRIBUTING.md](CONTRIBUTING.md) |

---

## Contributing · license

[`CONTRIBUTING.md`](CONTRIBUTING.md) · [`SECURITY.md`](SECURITY.md) · [PolyForm Noncommercial 1.0.0](LICENSE)

Active development — feedback and PRs welcome on the protocol, kit, and extension.
