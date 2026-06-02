<p align="center">
  <img src="assets/logo-mark.svg" alt="Meridian" width="64" height="64" />
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-PolyForm%20Noncommercial-blue" alt="PolyForm Noncommercial 1.0.0" /></a>
  <a href=".github/workflows/ci.yml"><img src="https://img.shields.io/badge/CI-GitHub%20Actions-2088FF?logo=githubactions&logoColor=white" alt="CI" /></a>
  <img src="https://img.shields.io/badge/status-experimental-orange" alt="Experimental" />
</p>

<p align="center">
  <strong>The project documentation is the project</strong><br />
  Track what you decided, what is in progress, and what is actually done — while building with AI agents.
</p>

<!-- GitHub About → Settings → Description: -->
<!-- Experimental docs-first workflow for AI-assisted dev — your repo docs track scope, decisions, and progress. -->

> **Very early experiment** — I am testing flows to **document the project for real**, **keep building with integrity**, and **track what is done vs. what only looked done in chat**. Fine alone or in a small group; shapes and rules will change. [Roadmap](#roadmap) · [Protocol](.agent/MERIDIAN.md)

# Meridian

**Set the meridian before you write code.**

Meridian has two layers that work together:

1. **`docs/`** in your repo — the project documentation (scope, architecture, acceptance, decisions, user stories). If it is not written here, it is not part of the process.
2. **`.agent/`** — the kit that **defines the flow**: which agent runs when, slash workflows, skills, gates, and rules agents must follow. This is not optional; it is how Meridian stays consistent instead of reinventing the process in every chat.

Code implements `docs/`; agents operate through `.agent/`; **you** approve maturity and completion. Visual tracking in the browser is a separate, optional helper (see below).

**Guides (same as the monitor tabs):** [Start here](.agent/references/start-here.md) · [Usage guide](.agent/references/usage-guide.md) — Markdown for the IDE and GitHub.

## Who this is for

- **Solo devs** using AI agents (Cursor, Antigravity, or any IDE that reads `.agent/`) who want a clear path from idea to shipped code — with a paper trail in Git.
- **Founders and PMs** who need to see scope, decisions, and delivery without Jira, Linear, or another SaaS.
- **Tech leads and builders in small teams** sharing one `docs/` tree — same protocol, same source of truth.

You stay **manager of the process**: agents can draft, implement, and sync status, but direction and ✅ belong to you, with evidence in the files.

Not aimed at large org workflow, permissions matrices, or unsupervised agent swarms — at least not in this version.

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

<p align="center">
  <img src="assets/screenshots/monitor-setup.jpg" alt="Meridian Desktop — Setup tab with phase document progress" width="920" />
</p>
<p align="center"><em>Optional monitor — Setup tab (the agent flow itself runs via <code>.agent/</code> in your IDE).</em></p>

## How it works

1. **Document** — Phase docs (`00_scope` … `05_architecture`, security, stack, …) and `docs/decisions/` for why things changed.
2. **Plan** — Epics, versions, sprints, and user stories after architecture is approved enough to commit.
3. **Execute** — Work from a US file; record evidence; `/complete-us` when it is really done.

**Rule of thumb:** if it is not in `docs/`, it is not part of the managed process — chat does not count.

No login. No cloud. Git holds the history. Agents follow `.agent/`; the desktop monitor, if you use it, only **reads** `docs/`.

## What it is / what it is not

| Meridian is | Meridian is not |
| ----------- | --------------- |
| **`docs/`** = what is true about the project | A wiki or Notion bolted on the side |
| **`.agent/`** = how the flow runs (workflows, agents, gates) | Ad-hoc prompts with no shared rules |
| Optional **monitor** to see status in the browser | The monitor replacing agents or `docs/` |
| Process tracked in files (decisions, US, board) | “Done” because the agent said so in chat |
| Solo or small group; early protocol version | Enterprise PM or unsupervised agent swarms |

## Quick start

```bash
git clone https://github.com/colabcolibri/meridian.git
cd meridian

# Cursor only — mirror .agent/ into .cursor/ (local, not committed):
chmod +x .agent/scripts/sync_cursor_kit.sh
./.agent/scripts/sync_cursor_kit.sh

# Optional — desktop monitor:
cd app-desktop && pnpm install && pnpm dev
```

If your IDE already supports `.agent/`, skip the sync script and open the repo there.

**New to Meridian?** [Start here](.agent/references/start-here.md) → [Usage guide](.agent/references/usage-guide.md) → `/init-meridian` or `/status`.

1. Open **http://localhost:5173** (optional monitor)
2. Click **Open docs folder**
3. Select a Meridian `docs/` directory (try `app-desktop/docs/` in this repo)

## Desktop monitor (optional)

The **real Meridian loop runs in your IDE** through `.agent/` (workflows and agents). The desktop app is only a **read-only dashboard** for the same `docs/` files — useful to see what is approved, blocked, or still open, but not required to use the protocol.

<details>
<summary><strong>Start here</strong> — concepts and <code>docs/</code> layout</summary>

![Start here](assets/screenshots/monitor-start-here.jpg)

Explains the Meridian model: phase docs, delivery folders (`epics/`, `versions/`, `sprints/`, `us/`), decision log, and why the board is derived from user stories. Full text: [start-here.md](.agent/references/start-here.md).

</details>

<details>
<summary><strong>Usage guide</strong> — daily flow and slash commands</summary>

![Usage guide](assets/screenshots/monitor-usage-guide.jpg)

Step-by-step paths (first run, document, backlog, implement, close US) with commands such as `/init-meridian`, `/status`, `/create-us`, and `/complete-us`. Full text: [usage-guide.md](.agent/references/usage-guide.md).

</details>

<details>
<summary><strong>Decisions</strong> — <code>docs/decisions/YYYY-MM-DD.json</code></summary>

![Decisions](assets/screenshots/monitor-decisions.jpg)

Daily JSON log: what changed, why, and which documents were affected. New entries go at the top; history is never deleted.

</details>

<details>
<summary><strong>Deliverables</strong> — versions, sprints, epics</summary>

![Deliverables](assets/screenshots/monitor-deliverables.jpg)

Release-level view with user story coverage per epic and sprint lists per version.

</details>

<details>
<summary><strong>Board</strong> — kanban from user story status</summary>

![Board](assets/screenshots/monitor-board.jpg)

Columns driven by story frontmatter (pending, in progress, tests pending, done, frozen). Filter by version and epic.

</details>

<details>
<summary><strong>Story detail</strong> — one user story opened</summary>

![Story detail](assets/screenshots/monitor-story-detail.jpg)

Full US view: narrative, acceptance checkboxes, technical implementation notes, and test evidence.

</details>

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
4. **Monitor (optional)** — run `app-desktop` locally if you want a visual read-only view of `docs/`.

## Agents and commands

| Where | Agents | Commands |
| ----- | ------ | -------- |
| `.agent/` (all IDEs) | `process-manager`, `scope-architect`, `documentation-strategist`, `security-steward`, `architecture-guardian`, `sprint-planner`, `board-keeper` | Workflows in `.agent/workflows/` (e.g. `init-meridian`, `status`, `complete-us`) |
| `.cursor/` (Cursor) | Same personas (symlinked) | Slash commands: `/init-meridian`, `/status`, `/create-us`, `/complete-us`, `/sync-board`, `/daily-with-ai`, … |

Full map: [`.agent/ARCHITECTURE.md`](.agent/ARCHITECTURE.md).

## Roadmap

| Version | Status | Focus |
| ------- | ------ | ----- |
| v0 Foundation | done | `.agent/` kit |
| v1 Folder monitor | done | Read real `docs/` in the browser |
| v2 VS Code bridge | planned | Extension, writes to disk |

More detail: [`app-desktop/docs/README.md`](app-desktop/docs/README.md).

## Protocol authority

1. Your instruction  
2. [`.agent/MERIDIAN.md`](.agent/MERIDIAN.md)  
3. [`.agent/rules/MERIDIAN.md`](.agent/rules/MERIDIAN.md)  
4. Workflows → agents → skills  

## Validate locally

```bash
python3 .agent/scripts/validate_meridian.py app-desktop
cd app-desktop && pnpm lint && pnpm test && pnpm build
```

## Contributing · license

[`CONTRIBUTING.md`](CONTRIBUTING.md) · [`SECURITY.md`](SECURITY.md) · [PolyForm Noncommercial 1.0.0](LICENSE)
