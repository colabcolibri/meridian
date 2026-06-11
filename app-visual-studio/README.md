# Meridian Harness

**Repo-native harness for AI coding agents** — in VS Code and Cursor.

Meridian keeps specs, decisions, and task status in **files** (`docs/`), not in chat. Agents follow guides, skills, and slash commands (`.agent/`). This extension **bundles that kit** and gives you a **kanban board** and planning views inside the editor.

**Install:** [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=colabcolibri.meridian-vscode) — search **Meridian Harness**, publisher **colabcolibri**  
**GitHub:** https://github.com/colabcolibri/meridian

---

## How to use (short)

| Surface | You do | Examples |
| ------- | ------ | -------- |
| **Extension** | Click — see and validate | Open Board · Validate Project · Sync Board |
| **Chat** | Type slash **workflows** | `/status` · `/create-us` · `/complete-us US-0103` |

**You invoke workflows, not agents.** Workflows route the right agent automatically. Override with `@process-manager` when needed.

**Guides in the IDE** (sidebar Meridian → Commands → **Guides**):

1. **How to use** — full onboarding (extension + chat)
2. **Start here** — concepts (phases, gates, artifacts)
3. **Usage guide** — day-to-day situations
4. **Agents & slash commands** — command map and steps 1–17

---

## What is this?

AI agents ship code fast, but without a written spec scope drifts, decisions get lost, and “done” is whatever the model said last.

Meridian is a **thin harness** on top of Cursor or Claude Code:

- **`docs/`** — versions, sprints, user stories, architecture (what to build and what counts as done)
- **`.agent/`** — agents, skills, workflows, validators (how the agent should work)
- **This extension** — installs the kit into your project and shows board / versions / sprints / epics from `docs/`

Chat does not persist. **Files do.**

---

## What you get

| Piece | Where | Role |
| ----- | ----- | ---- |
| **Extension** | Installed in the editor (Marketplace) | UI + bundled kit source |
| **Kit** | `{project}/.agent/` after **Install Harness** | Slash commands (`/init-meridian`, `/create-us`, …), agents, skills |
| **Multi-product** | `.meridian/projects.json` (optional) | Several `docs/` trees — one **active** at a time |
| **IDE adapters** | `.cursor/`, `.claude/`, `.agents/skills/`, `.codex/` after **Install Harness** | Cursor, Claude Code, Codex |
| **Docs** | `{project}/docs/` after `/init-meridian` | Living spec — board, US, versions |

The extension is **global** (one install per machine). The kit is **per project**.

---

## The loop

```txt
document → plan → refine → implement → close
```

1. **Document** — scope, stack, security, architecture in `docs/`
2. **Plan** — epics, versions, sprints, user stories (`/create-us`, …)
3. **Refine** — story gets a concrete approach before code (`/refine-us`)
4. **Implement** — agent codes against acceptance criteria
5. **Close** — evidence in the story record (`/complete-us`); you approve

Use **slash commands in chat** for steps 1–5. Use **Open Board** to see status.

---

## How to install

### 1. Install the extension

1. **Extensions** (⇧⌘X / Ctrl+Shift+X)
2. Search **Meridian Harness** (publisher **colabcolibri**)
3. **Install** → **Developer: Reload Window**

### 2. Open your project

**File → Open Folder…**

### 3. Install the harness in the project

| Where | Command |
| ----- | ------- |
| Status bar | **Meridian: install harness** |
| Command Palette | **Meridian: Install Harness** |
| **Meridian → Commands** | **Install harness** |

Copies `.agent/` and syncs IDE adapters. Log: **Output → Meridian Tools**.

### 4. Create docs (new projects only)

In **chat**:

```txt
/init-meridian
```

### 5. Read the guides

**Meridian: How to Use** — or sidebar → Commands → Guides.

---

## Extension commands

| Goal | Command |
| ---- | ------- |
| Onboarding | **Meridian: How to Use** |
| Concepts | **Meridian: Open Start Here** |
| Situations | **Meridian: Open Usage Guide** |
| Slash commands | **Meridian: Open Agents Help** |
| Kanban | **Meridian: Open Board** |
| Planning | **Open Versions**, **Open Sprints**, **Open Epics** |
| Regenerate board.json | **Meridian: Sync Board** |
| Validate project | **Meridian: Validate Project** (needs `python3`) |
| Multi-product | **Meridian: Select Active Project** |

---

## Update the kit

1. Update **Meridian Harness** in Extensions
2. Reload window
3. **Meridian: Upgrade Harness** in each project

---

## Requirements

- VS Code or Cursor
- `python3` only for **Validate Project**

---

## Maintainers

Help panels read `.agent/references/*.md` at runtime (start-here, usage-guide, agents-help). Command palette copy: `src/command-catalog.ts`. Protocol changes: [instruction-surfaces.md](../.agent/references/instruction-surfaces.md).

---

## Quick flow

```txt
Marketplace → Install Meridian Harness → Reload
Open project folder
Meridian: Install Harness
Meridian: How to Use          ← read first
/init-meridian                ← only if no docs/
Meridian: Open Board · /status · /create-us …
```
