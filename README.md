<p align="center">
  <img src="assets/logo-mark.svg" alt="Meridian" width="64" height="64" />
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-PolyForm%20Noncommercial-blue" alt="PolyForm Noncommercial 1.0.0" /></a>
  <a href=".github/workflows/ci.yml"><img src="https://img.shields.io/badge/CI-GitHub%20Actions-2088FF?logo=githubactions&logoColor=white" alt="CI" /></a>
  <img src="https://img.shields.io/badge/status-experimental-orange" alt="Experimental" />
</p>

<!-- GitHub About: copy the line below into Settings → Description -->
<!-- Documentation-driven protocol for AI-assisted development — docs before code, you stay manager of the process. -->

> **Experimental** — Active development; not for critical production. [Roadmap](#roadmap) · Protocol: [`.agent/MERIDIAN.md`](.agent/MERIDIAN.md)

# Meridian

**Set the meridian before you write code.**

Documentation-driven development for teams using AI agents: scope, acceptance criteria, and decisions live in `docs/`; a kanban board is derived from user stories; you remain **manager of the process**.

| Deliverable | Path |
| ----------- | ---- |
| Agent protocol | [`.agent/MERIDIAN.md`](.agent/MERIDIAN.md) |
| Copy into other projects | [`.agent/`](.agent/) only |
| Desktop monitor | [`app-desktop/`](app-desktop/) |

## Quick start

```bash
git clone https://github.com/colabcolibri/meridian.git
cd meridian

# Cursor (local symlinks — not in Git):
chmod +x .agent/scripts/sync_cursor_kit.sh
./.agent/scripts/sync_cursor_kit.sh

cd app-desktop && pnpm install && pnpm dev
```

Open `http://localhost:5173` and select a project's `docs/` folder.

## What it is / what it is not

| It is | It is not |
| ----- | --------- |
| Protocol + `.agent/` kit (agents, skills, workflows) | SaaS or closed platform |
| `docs/` → versions → user stories → code | Autonomous agents without review |
| Local app that **reads** `docs/` | Jira / Linear / GitHub Projects replacement |

## Repository layout

| Path | Role |
| ---- | ---- |
| `README.md` | This page — kit monorepo onboarding (GitHub) |
| `.agent/` | Canonical kit — **edit here** |
| `.cursor/` | Cursor adapter (symlinks, **gitignored**) |
| `app-desktop/` | Visual monitor (Vite + React) |
| `app-visual-studio/` | VS Code extension — **planned** (v2) |

## Install kit in another project

```txt
.agent/
```

Cursor users: run `./.agent/scripts/sync_cursor_kit.sh` after clone. Commit only `.agent/`. See [`.agent/CURSOR_ADAPTER.md`](.agent/CURSOR_ADAPTER.md).

## Agents and commands

Slash commands: **Cursor** `.cursor/commands/` · **Antigravity** `.agent/workflows/`

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

Full list: [`.agent/ARCHITECTURE.md`](.agent/ARCHITECTURE.md).

## Roadmap

| Version | Status | Focus |
| ------- | ------ | ----- |
| v0 Foundation | done | `.agent/` kit |
| v1 Folder Monitor | done | Read real `docs/` |
| v2 VS Code bridge | planned | Extension, disk writes |

App details: [`app-desktop/docs/README.md`](app-desktop/docs/README.md).

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
