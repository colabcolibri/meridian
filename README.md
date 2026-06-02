<p align="center">
  <img src="assets/logo-mark.svg" alt="Meridian" width="64" height="64" />
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-PolyForm%20Noncommercial-blue" alt="PolyForm Noncommercial 1.0.0" /></a>
  <a href=".github/workflows/ci.yml"><img src="https://img.shields.io/badge/CI-GitHub%20Actions-2088FF?logo=githubactions&logoColor=white" alt="CI" /></a>
  <img src="https://img.shields.io/badge/status-experimental-orange" alt="Experimental" />
</p>

<p align="center">
  <strong>Documentation-driven development for AI-assisted teams</strong><br />
  Docs before code · You stay manager of the process · <code>docs/</code> is the source of truth
</p>

<!-- GitHub About → Settings → Description (copy one line): -->
<!-- Documentation-driven protocol for AI-assisted development — docs before code, you stay manager of the process. -->

> **Experimental** — Active development; not for critical production. [Roadmap](#roadmap) · Protocol: [`.agent/MERIDIAN.md`](.agent/MERIDIAN.md)

# Meridian

**Set the meridian before you write code.**

Meridian is a protocol and toolkit for building software with AI agents (Cursor, Antigravity, and others) **without losing control**. Scope, acceptance criteria, architecture, and decisions live in Markdown under `docs/`. User stories drive implementation; `board.json` is generated from those files — never edited by hand.

This repository contains:

- **[`.agent/`](.agent/)** — agents, skills, workflows, and rules agents read at runtime (copy into any project).
- **[`app-desktop/`](app-desktop/)** — local visual monitor: open a `docs/` folder and see setup progress, deliverables, decisions, and kanban in the browser (Chrome or Edge).

<p align="center">
  <img src="assets/screenshots/monitor-setup.jpg" alt="Meridian Desktop — Setup tab showing phase document progress" width="920" />
</p>
<p align="center"><em>Desktop monitor — Setup tab: phase documents 00–11, dependencies, and approval status.</em></p>

## What it is / what it is not

| It is | It is not |
| ----- | --------- |
| Protocol + `.agent/` kit (agents, skills, workflows) | SaaS, login, or hosted platform |
| `docs/` → versions → user stories → code | Autonomous agents without human review |
| Local app that **reads** your `docs/` folder | Replacement for Jira, Linear, or GitHub Projects |

## Quick start

```bash
git clone https://github.com/colabcolibri/meridian.git
cd meridian

# Cursor (local symlinks — not in Git):
chmod +x .agent/scripts/sync_cursor_kit.sh
./.agent/scripts/sync_cursor_kit.sh

cd app-desktop && pnpm install && pnpm dev
```

Open **http://localhost:5173**, click **Open docs folder**, and select the `docs/` directory of a Meridian project (e.g. `app-desktop/docs/` in this repo for dogfooding).

## Desktop monitor

The monitor does not replace your editor. It reads the same files you edit in Cursor and surfaces governance: what is approved, what is blocked, and where each user story stands.

### Start here

Onboarding for newcomers: what Meridian is, how `docs/` is organized (phase files, epics, versions, sprints, user stories, decision log), and core principles (docs before code, derived board, evidence-based done).

![Start here — concepts and docs/ layout](assets/screenshots/monitor-start-here.jpg)

### Usage guide

Practical workflow with AI: first-time setup (`/init-meridian`), document phases (`/status`, `/architecture`), build backlog (`/create-us`), implement, and close stories (`/complete-us`). Includes a “where am I?” map to the right slash command.

![Usage guide — daily workflow and commands](assets/screenshots/monitor-usage-guide.jpg)

### Setup

Progress across the 10 phase documents (00–08 and 11): `draft` → `review` → `approved`, dependency gates, and which file to work on next (e.g. database after architecture).

![Setup — phase document progress](assets/screenshots/monitor-setup.jpg)

### Decisions

Structured decision log from `docs/decisions/YYYY-MM-DD.json` — newest entries first, with what changed, why, and impact. Agents prepend here when scope or protocol shifts.

![Decisions — daily decision log](assets/screenshots/monitor-decisions.jpg)

### Deliverables

Releases (`v0`, `v1`, `v2…`), sprints, and epics from `docs/versions/`, `docs/sprints/`, and `docs/epics/` — with user story coverage per epic.

![Deliverables — versions, sprints, and epics](assets/screenshots/monitor-deliverables.jpg)

### Board

Kanban derived from user story frontmatter: pending, in progress, awaiting tests, complete, frozen. Filter by version and epic.

![Board — user story kanban](assets/screenshots/monitor-board.jpg)

### Story detail

Drill into a single US: narrative, **Acceptance**, **Technical implementation**, tests (planned / executed), dependencies, and MoSCoW — aligned with the Meridian protocol in the repo.

![Story detail — US-0009 example](assets/screenshots/monitor-story-detail.jpg)

## Install kit in another project

Copy only the agent kit:

```txt
.agent/
```

Cursor: run `./.agent/scripts/sync_cursor_kit.sh` after clone. Commit `.agent/` only (`.cursor/` stays local). See [`.agent/CURSOR_ADAPTER.md`](.agent/CURSOR_ADAPTER.md).

## Agents and commands

| Agent | Use for |
| ----- | ------- |
| `process-manager` | Governance, `/status` |
| `scope-architect` | `00_scope.md` |
| `documentation-strategist` | Phase docs `00–08`, `11` |
| `security-steward` | `02_security.md` |
| `architecture-guardian` | `05_architecture.md` |
| `sprint-planner` | `docs/versions/`, `docs/sprints/` |
| `board-keeper` | User stories, `board.json` |

| Command | Purpose |
| ------- | ------- |
| `/init-meridian` | Create `docs/` structure |
| `/status` | Blockers and next step |
| `/create-us` · `/complete-us` | User stories |
| `/sync-board` | Regenerate `board.json` |
| `/daily-with-ai` | Daily manager + AI routine |

Full map: [`.agent/ARCHITECTURE.md`](.agent/ARCHITECTURE.md).

## Repository layout

| Path | Role |
| ---- | ---- |
| `README.md` | This page (GitHub home) |
| `.agent/` | Canonical kit — **edit here** |
| `.cursor/` | Cursor adapter (symlinks, **gitignored**) |
| `app-desktop/` | Visual monitor (Vite + React) |
| `assets/screenshots/` | Images for this README |

## Roadmap

| Version | Status | Focus |
| ------- | ------ | ----- |
| v0 Foundation | done | `.agent/` kit |
| v1 Folder Monitor | done | Read real `docs/` |
| v2 VS Code bridge | planned | Extension, disk writes |

Details: [`app-desktop/docs/README.md`](app-desktop/docs/README.md).

## Authority

1. User instruction  
2. [`.agent/MERIDIAN.md`](.agent/MERIDIAN.md)  
3. [`.agent/rules/MERIDIAN.md`](.agent/rules/MERIDIAN.md)  
4. Workflows → agents → skills  

## Validate

```bash
python3 .agent/scripts/validate_meridian.py app-desktop
cd app-desktop && pnpm lint && pnpm test && pnpm build
```

## Contributing · license

[`CONTRIBUTING.md`](CONTRIBUTING.md) · [`SECURITY.md`](SECURITY.md) · [PolyForm Noncommercial 1.0.0](LICENSE)
