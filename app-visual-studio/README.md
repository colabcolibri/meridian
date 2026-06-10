# Meridian Harness

**Repo-native harness for AI coding agents** — in VS Code and Cursor.

Meridian keeps specs, decisions, and task status in **files** (`docs/`), not in chat. Agents follow guides, skills, and slash commands (`.agent/`). This extension **bundles that kit** and gives you a **kanban board** and planning views inside the editor.

**Install:** [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=colabcolibri.meridian-vscode) — search **Meridian Harness**, publisher **colabcolibri**  
**GitHub:** https://github.com/colabcolibri/meridian

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
| **Multi-product** | `.meridian/projects.json` (optional) | Several `docs/` trees — **Select Active Project** picks which one board/validate use |
| **Cursor adapters** | `{project}/.cursor/` after **Install Harness** | Cursor reads rules, skills, commands from here |
| **Docs** | `{project}/docs/` after `/init-meridian` | Living spec — board, US, versions |

The extension is **global** (one install per machine). The kit is **per project** — you run **Install Harness** in each folder.

---

## The loop

```txt
document → plan → refine → implement → close
```

1. **Document** — scope, stack, security, architecture in `docs/`
2. **Plan** — epics, versions, sprints, user stories
3. **Refine** — story gets a concrete approach before code
4. **Implement** — agent codes against acceptance criteria
5. **Close** — evidence in the story record; you approve

Use slash commands in Cursor for most steps. Use **Meridian: Open Board** to see kanban from `docs/us/`.

---

## How to install

### 1. Install the extension

1. **Extensions** (⇧⌘X / Ctrl+Shift+X)
2. Search **Meridian Harness** (publisher **colabcolibri**)
3. **Install** → **Developer: Reload Window**

### 2. Open your project

**File → Open Folder…**

### 3. Install the harness in the project

The extension **never** installs the kit automatically. You run **Install Harness** once per project:

| Where | Command |
| ----- | ------- |
| Status bar | **Meridian: install harness** |
| Command Palette (⇧⌘P / Ctrl+Shift+P) | **Meridian: Install Harness** |
| **Meridian → Commands** | **Install harness** |
| **View → Meridian** | **Meridian: Install Harness** |

Copies `.agent/` into the project and syncs `.cursor/`. Log: **Output → Meridian Tools**.

### 4. Create docs (new projects only)

After step 3, in **Cursor chat**:

```txt
/init-meridian
```

---

## How to use

| Goal | Command |
| ---- | ------- |
| Kanban board | **Meridian: Open Board** |
| Versions / sprints / epics | **Meridian: Open Versions**, **Open Sprints**, **Open Epics** |
| Regenerate board.json | **Meridian: Sync Board** |
| Validate project | **Meridian: Validate Project** (needs `python3`) |
| Agents & slash commands | **Meridian: Open Agents Help** |

Slash commands (after Install Harness): `/init-meridian`, `/create-us`, `/architecture`, `/complete-us`, …

**Status bar:** **install harness** when kit is missing · US count when `docs/` is ready.

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

Help panels (Agents Help, Usage, Start Here) read `.agent/references/*.md` from the workspace kit. Command palette copy lives in `src/command-catalog.ts`. When the protocol changes, see [instruction-surfaces.md](../.agent/references/instruction-surfaces.md).

---

## Quick flow

```txt
Marketplace → Install Meridian Harness → Reload
Open project folder
Meridian: Install Harness          ← you run this (not automatic)
/init-meridian                     ← only if no docs/
Meridian: Open Board · slash commands
```
