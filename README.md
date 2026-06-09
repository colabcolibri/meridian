<p align="center">
  <img src="assets/screenshots/meridian-header.jpg" alt="Meridian — AI agent harness experiment" width="100%" />
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-PolyForm%20Noncommercial-blue" alt="PolyForm Noncommercial 1.0.0" /></a>
  <a href=".github/workflows/ci.yml"><img src="https://img.shields.io/badge/CI-GitHub%20Actions-2088FF?logo=githubactions&logoColor=white" alt="CI" /></a>
  <img src="https://img.shields.io/badge/status-experiment-orange" alt="Experiment" />
</p>

<p align="center">
  <strong>I'm testing a repo-native harness for AI coding agents —<br />
  guides and sensors in Git, persistent task specs, and a Scrum-shaped loop I manage.</strong>
</p>

> Very early personal experiment. Rules, structure, and APIs will change.  
> [Live demo](https://colabcolibri.github.io/meridian/) · [Full protocol](.agent/MERIDIAN.md)

# Meridian

## The hypothesis

AI agents in the IDE ship code fast — but without a written spec, scope drifts in chat, decisions get lost, and "done" means whatever the model said five messages ago.

**I'm testing another approach:** a thin harness layer on top of Cursor or Claude Code — `docs/` for versions, sprints, and task specs, `.agent/` for guides and workflows, validators as sensors. I plan the project and work solo with the agent, but I also want to see if it can run longer autonomous stretches on the open backlog without breaking the flow. Chat does not persist. Files do.

## What I'm learning

- Once versions, sprints, and open US are in `docs/`, can the agent run long continuous sessions on the backlog — refine, implement, close — without drifting or skipping harness gates?
- Does managing Scrum in files (commands, skills, structured artifacts) cost fewer credits than re-explaining context and priorities in chat every session?
- Does the harness — guides, sensors, `ready` / `Record` gates, phase docs — actually ship functional, organized, secure, **documented** software, not just fast code?

Still open questions. This repository is my lab.

## The loop I'm testing

```
document → plan → refine → implement → close → commit
```

| Step | In one line |
| ---- | ----------- |
| **Document** | Scope, stack, security, architecture in `docs/00`–`11` — I approve, agent drafts |
| **Plan** | Epics, versions, sprint, and user stories in `docs/` |
| **Refine** | Story gets a concrete Approach and `ready: true` before any product code |
| **Implement** | Agent reads the US and codes against acceptance criteria |
| **Close** | Agent fills `## Record` with evidence; I review and set `status: ✅` |
| **Commit** | One commit per closed story — code and docs together in Git |

**Two rules of the experiment:** no product code without `ready: true`. No ✅ without a filled `## Record`.

## Three folders, three roles

| Folder | Role |
| ------ | ---- |
| **`docs/`** (in *your* project) | Memory + task specs — the product spec and what counts as done |
| **`.agent/`** (copied from the kit) | Guides — rules, agents, skills, slash-command workflows |
| **`app-desktop/`** · **`app-visual-studio/`** | Observability — read `docs/`; optional monitors, not the harness itself |

Scrum-inspired, adapted for a **single human directing AI agents** — no story points, velocity, or mandatory Feature layer. [Scrum ↔ Meridian map](.agent/references/scrum-meridian-map.md)

## Try it now

```bash
git clone https://github.com/colabcolibri/meridian.git
cd meridian

# Cursor or Claude Code — generate local adapters (not committed):
chmod +x .agent/scripts/sync_cursor_kit.sh
./.agent/scripts/sync_cursor_kit.sh
```

1. In your IDE: `/init-meridian` — creates `docs/` for your project (greenfield or existing codebase).
2. **`/agents-help`** — agent groups, slash command groups, numbered steps (`.agent/references/agents-help.md`).
3. Optional: [browser demo](https://colabcolibri.github.io/meridian/) or `cd app-desktop && pnpm install && pnpm dev`.
4. Anytime: `/status` — blockers, current state, suggested next step.

**Use in another repo:** copy `.agent/` only, run `/init-meridian`, sync the kit if you use Cursor/Claude.

Or download a **kit release** (`.agent` only, no app-desktop):

```bash
tar -xzf meridian-kit-1.0.0.tar.gz && cd meridian-kit-1.0.0
./install.sh /path/to/my-project
```

Build the tarball from this repo: `KIT_VERSION=1.0.0 ./.agent/scripts/package-kit.sh`

## What's in this repository

| Piece | Required? | Role in the experiment |
| ----- | --------- | ---------------------- |
| [`.agent/`](.agent/) | Yes (in your project) | Portable harness kit — guides, skills, validation |
| `docs/` | Yes (in your project) | Living spec — [example here](app-desktop/docs/) |
| [`app-desktop/`](app-desktop/) | No | Browser observability (demo + local) |
| [`app-visual-studio/`](app-visual-studio/) | No | VS Code/Cursor extension — board and planning in the editor |

## Where the experiment stands

| Version | What | Status |
| ------- | ---- | ------ |
| Monitor v0–v3 | Read `docs/` in the browser | Shipped |
| **v4** | VS Code bridge — board, versions, sprints, epics | In progress |
| v5+ | Write commands, wizards | Planned |

Details in [`app-desktop/docs/versions/`](app-desktop/docs/versions/).

## Reference (not the home page)

- [Protocol for agents](.agent/MERIDIAN.md)
- [Usage guide and commands](.agent/references/usage-guide.md)
- [Agents & commands help — groups and steps](.agent/references/agents-help.md)
- [Scrum ↔ Meridian map](.agent/references/scrum-meridian-map.md)
- [Validate a project](.agent/scripts/validate_meridian.py): `python3 .agent/scripts/validate_meridian.py <project-folder>`
- [IDE adapters](.agent/IDE_ADAPTERS.md) — Antigravity native; Cursor/Claude via sync script

## Contributing · license

[`CONTRIBUTING.md`](CONTRIBUTING.md) · [`SECURITY.md`](SECURITY.md) · [PolyForm Noncommercial 1.0.0](LICENSE)

Feedback and issues welcome — this is an open lab, not a finished product.
