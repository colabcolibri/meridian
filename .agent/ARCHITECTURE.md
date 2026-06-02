# Meridian Agent Architecture

> Agent, skill, workflow, rule and script structure for projects using Meridian.

---

## Purpose

The `.agent/` folder is the operational layer for AI agents.

Root `meridian.md` explains the repository and product.
`.agent/MERIDIAN.md` is the master protocol for agents.
`.agent/` gives agents practical roles, skills, workflows, rules and scripts to apply
the protocol consistently.

The app desktop is separate. It monitors a project folder.
The `.agent/` folder helps agents work inside that folder.

---

## Directory Structure

```txt
.agent/
  ARCHITECTURE.md
  agents/
  skills/
  workflows/
  rules/
  scripts/
  .shared/
```

## Agents

Agents are role definitions. They describe how an AI agent should think and what
skills it should load.

| Agent                      | Purpose                                         | Skills                                                |
| -------------------------- | ----------------------------------------------- | ----------------------------------------------------- |
| `process-manager`          | Keep the human in control of the Meridian flow. | init-project, update-decisions-log                    |
| `scope-architect`          | Define scope boundaries before implementation.  | init-project, update-decisions-log                    |
| `documentation-strategist` | Create and review phase docs.                   | init-project, create-user-story, update-decisions-log |
| `architecture-guardian`    | Keep architecture aligned with approved docs.   | update-decisions-log, security-review                 |
| `sprint-planner`           | Plan versions, sprints and execution order.     | create-user-story, generate-board-json                |
| `security-steward`         | Threat model, secrets, security posture.        | security-review, update-decisions-log                 |
| `board-keeper`             | Keep user stories and board JSON consistent.    | create-user-story, generate-board-json                |

## Skills

Skills are folder-based packages:

```txt
.agent/skills/skill-name/
  SKILL.md
  references/
  scripts/
  assets/
```

Only `SKILL.md` is required.
References, scripts and assets are optional.

## Workflows

Workflows are slash-command-like procedures:

| Workflow        | Purpose                                       |
| --------------- | --------------------------------------------- |
| `init-meridian` | Start a new project with Meridian.            |
| `plan-sprint`   | Prepare version/sprint planning without code. |
| `create-us`     | Create a valid user story.                    |
| `architecture`  | Create or review `07_architecture.md`.        |
| `security-pass` | Review or deepen project security.            |
| `sync-board`    | Regenerate `docs/kanban/board.json`.          |
| `status`        | Report health of the Meridian project.        |

## Rules

Rules are global constraints all agents must respect.

Current rules:

- `MERIDIAN.md`: global operating rules for all agents.

## Scripts

Scripts are optional validation helpers.

Current scripts:

- `validate_meridian.py`: static checks for docs, US and board JSON.

## Authority

If there is a conflict:

1. User instruction wins.
2. `.agent/MERIDIAN.md` wins over other `.agent/` files.
3. Rules win over workflows.
4. Workflows win over agents.
5. Agents choose skills.
6. Skills guide task execution.
