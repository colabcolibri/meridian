# Meridian Harness

**You manage delivery. AI agents ship story by story — with a plan that survives the next chat session.**

Meridian is a **repo-native harness for AI-assisted development** in **VS Code** and **Cursor**. It gives your agents structured workflows (slash commands, roles, gates) and gives **you** a board, planning views, and dependency graphs — without leaving the IDE.

**Install:** [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=colabcolibri.meridian-vscode) — search **Meridian Harness**, publisher **colabcolibri**  
**GitHub:** https://github.com/colabcolibri/meridian

---

## Who this is for

You use **Cursor, VS Code, Claude Code, or Codex** to build software with AI, and you want:

- **A real backlog** — versions, sprints, epics, and user stories in the repo, not buried in chat history
- **Control over “done”** — scope and architecture written down before code; evidence when a story closes
- **One loop** — document → plan → refine → implement → close, repeated story by story
- **Agents that follow rules** — workflows route the right role; skills and validators keep output consistent

If you only need ad-hoc prompts with no delivery structure, Meridian is probably more than you need.

---

## What you get with this extension

This extension is the **recommended way** to use Meridian: same harness as the kit, plus **visualization inside the IDE**.

| You get | Why it matters |
| ------- | -------------- |
| **Kanban board** | See backlog, todo, in progress, and done at a glance — filters by version, sprint, epic |
| **Planning views** | Versions roadmap, sprints, epics, decisions log |
| **Delivery & import graphs** | Explore story dependencies and how your codebase imports itself |
| **Architecture diagrams** | Mermaid maps from `docs/architecture/` with pan/zoom |
| **Bundled kit installer** | One click copies `.agent/` (workflows, agents, skills) into your project |
| **Guides in the sidebar** | Onboarding without hunting the repo |

**In chat** you still run slash commands (`/status`, `/create-us`, `/implement-us US-0103`). The extension is for **seeing and validating**; chat is for **creating and changing** the plan.

---

## Harness only (no extension)?

Yes. Meridian works **without** this plugin.

| | **With extension** (this) | **Kit / CLI only** |
| - | ------------------------- | ------------------- |
| Slash workflows in chat | ✅ | ✅ |
| `.agent/` agents, skills, validators | ✅ (via Install Harness) | ✅ (install script or copy `.agent/`) |
| `docs/` + `.meridian/meridian.db` delivery | ✅ | ✅ |
| Python CLI (`meridian_delivery.py`, export, validate) | ✅ | ✅ |
| Board, graphs, planning UI | ✅ | ❌ — use `/status` and SQLite export instead |

Use the **extension** when you want the board and graphs in the IDE. Use the **kit alone** in headless setups, other editors, or CI — same protocol, no visual layer.

Details: [Distribution](https://github.com/colabcolibri/meridian/blob/main/.agent/DISTRIBUTION.md) · [Kit README](https://github.com/colabcolibri/meridian/blob/main/.agent/KIT_README.md)

---

## The problem Meridian solves

Agents write code fast. Without a written plan:

- Scope drifts every session
- Decisions disappear into old threads
- “Done” means whatever the model said last

Meridian keeps **what to build** (`docs/`) and **what’s in flight** (SQLite delivery DB) **in the repository**. Chat is ephemeral; **files and the board are not**.

---

## How it works

```txt
document → plan → refine → implement → close
```

1. **Document** — approve scope, architecture, security in `docs/`
2. **Plan** — epics, versions, sprints, user stories (`/create-us`, …)
3. **Refine** — story is concrete enough to build (`/refine-us`)
4. **Implement** — agent codes only when the story is `ready` (`/implement-us`)
5. **Close** — evidence on the story record (`/complete-us`); you approve

**You type workflows** (`/create-us`), not low-level skills. Workflows route agents automatically. Override with `@story-maker`, `@story-checker`, `@scrum-master`, etc. when needed.

---

## Quick start

1. Install **Meridian Harness** from the Marketplace → reload the window  
2. Open your project folder  
3. **Meridian: Install Harness** (status bar or command palette)  
4. In chat: **`/init-meridian`** (new project) or **`/document-project`** (existing codebase)  
5. **Meridian: Open Board** · anytime **`/status`**

**Read first:** **Meridian: How to Use** (sidebar → Meridian → Commands → Guides)

---

## Guides in the IDE

| Guide | Purpose |
| ----- | ------- |
| **How to use** | Extension vs chat, first steps |
| **Start here** | Concepts — phases, gates, artifacts |
| **Usage guide** | Day-to-day recipes |
| **Agents & slash commands** | Full command reference |

---

## Main commands

| Goal | Command |
| ---- | ------- |
| Onboarding | **Meridian: How to Use** |
| Kanban | **Meridian: Open Board** |
| Planning | **Open Versions**, **Open Sprints**, **Open Epics**, **Open Decisions** |
| Graphs | **Open Delivery Graph**, **Open Import Graph** |
| Diagrams | **Open Architecture Diagram** |
| Health check | **Meridian: Validate Project** (needs `python3`) |
| Multi-product monorepo | **Meridian: Select Active Project** |

---

## Update the harness

1. Update **Meridian Harness** in Extensions  
2. Reload window  
3. **Meridian: Upgrade Harness** in each project — refreshes `.agent/`, IDE adapters, and DB migrations  

---

## Requirements

- VS Code **1.85+** or Cursor  
- `python3` only for **Validate Project** and CLI scripts (optional for day-to-day chat workflows)

---

## License

PolyForm Noncommercial 1.0.0 — free for noncommercial use. The Meridian kit (`.agent/`) ships inside this extension.
