# Meridian Harness

**You manage delivery. Sixteen specialist agents ship story by story — with a plan that survives the next chat session.**

Meridian is a **repo-native harness for AI-assisted development** in **VS Code** and **Cursor**. Skills and specialist agents keep chat disciplined; this extension gives you the **board**, planning views, and dependency graphs — without leaving the IDE.

**Install:** [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=colabcolibri.meridian-vscode) — search **Meridian Harness**, publisher **colabcolibri**  
**GitHub:** https://github.com/colabcolibri/meridian

---

## Who this is for

You use **Cursor, VS Code, Claude Code, or Codex** to build software with AI, and you want:

- **A real backlog** — versions, sprints, epics, and user stories in the repo, not buried in chat history
- **Control over “done”** — scope and architecture written down before code; evidence when a story closes
- **Specialist agents** — sixteen stations (Penelope, Hephaestus, Janus, …) instead of one generic assistant
- **One loop** — document → plan → refine → implement → close, repeated story by story

If you only need ad-hoc prompts with no delivery structure, Meridian is probably more than you need.

---

## What you get with this extension

| You get | Why it matters |
| ------- | -------------- |
| **Kanban board** | Backlog, todo, in progress, done — filters by version, sprint, epic |
| **Planning views** | Versions roadmap, sprints, epics, decisions log |
| **Delivery & import graphs** | Story dependencies and codebase import map |
| **Architecture diagrams** | Mermaid maps from `docs/architecture/` with pan/zoom |
| **Bundled kit installer** | One click copies `.agent/` (skills, agents, validators) into your project |
| **Harness upgrade** | **Upgrade Harness** backs up to `agent-backup/` (zip) before overwriting |
| **Guides in the sidebar** | Onboarding without hunting the repo |

**In chat** you run **skills** (`/us-create`, `/project-status`) or mention **agents** (`@story-maker`, `@developer`). The extension is for **seeing and validating**; chat is for **creating and changing** the plan.

---

## Harness only (no extension)?

| | **With extension** (this) | **Kit / CLI only** |
| - | ------------------------- | ------------------- |
| Skills & agents in chat | ✅ | ✅ |
| `.agent/` + IDE adapters | ✅ (Install Harness) | ✅ (install script or copy `.agent/`) |
| `docs/` + `.meridian/meridian.db` | ✅ | ✅ |
| Python CLI (`meridian_delivery.py`, export, validate) | ✅ | ✅ |
| Board & graphs | ✅ in IDE | `python3 .agent/board` (HTML monitor) |

Details: [Distribution](https://github.com/colabcolibri/meridian/blob/main/.agent/DISTRIBUTION.md) · [Kit README](https://github.com/colabcolibri/meridian/blob/main/.agent/KIT_README.md)

---

## Quick start

1. Install **Meridian Harness** from the Marketplace → reload the window  
2. Open your project folder  
3. **Meridian: Install Harness** (status bar or command palette)  
4. In chat: **`/init-meridian`** (new project) or **`/document-project`** (existing codebase)  
5. **Meridian: Open Board** · anytime **`/status`** · lost? **`/deus-ex`**

**Read first:** **Meridian: How to Use** (sidebar → Meridian → Commands → Guides)

---

## How it works

```txt
document → plan → refine → implement → close
```

1. **Document** — approve scope, architecture, security in `docs/`
2. **Plan** — epics, versions, sprints, stories (`/us-create`, `/epic-create`, …)
3. **Refine** — story is concrete enough to build (`/us-refine`)
4. **Implement** — agent codes only when the story is `ready` (`/us-implement`)
5. **Close** — evidence on the story record (`/us-complete`); you approve

Prefer **`/skill-name`** or **`@agent`** in chat. **`@deus-ex`** (Machina) picks the station when you are unsure.

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
3. **Meridian: Upgrade Harness** in each project — backs up previous kit to `agent-backup/`, refreshes `.agent/`, IDE adapters, and DB migrations  

---

## Requirements

- VS Code **1.85+** or Cursor  
- `python3` for **Validate Project** and CLI scripts (optional for day-to-day chat)

---

## License

PolyForm Noncommercial 1.0.0 — free for noncommercial use. The Meridian kit (`.agent/`) ships inside this extension.
