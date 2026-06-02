# Meridian — Documentation-Driven Development Protocol for AI Agents

> Define the meridian before writing code.
> It is what keeps people, AI agents, decisions, and deliverables aligned.

This is the master protocol for agents.
In the kit monorepo, [`README.md`](../README.md) is the GitHub onboarding page;
this file defines how agents should work in any Meridian project.

---

## 1. What is Meridian

Meridian is a pragmatic documentation-driven development protocol,
built for the new era of working with AI agents.

It is not a specific tool, does not depend on an extension, does not require a SaaS,
and does not assume the project will be developed inside a proprietary management system.
Meridian is above all a working structure: a set of documents,
dependencies, maturity rules, and generated artifacts that allows software development
to be conducted with clarity.

The central idea is simple:

**the documentation is the project.**

Code exists to implement what is documented. AI agents can accelerate
execution, suggest alternatives, fill drafts, and implement tasks, but they
do not replace direction, context, acceptance criteria, and recorded decisions.

Meridian exists so that a person remains manager of the process while
using AI agents productively, auditably, and consistently.

---

## 2. Who it is for

Meridian is for any person or group that wants to develop software with AI agents
without losing control of the process.

This includes:

- devs working solo;
- founders building a product;
- product managers running a digital project;
- designers or operators who need to turn an idea into a system;
- tech leads who need a simple and auditable workflow;
- people using coding agents and wanting to keep visibility over what is being done.

Meridian is also not a complex mesh of agents.

It is a minimal, explicit, and sufficient flow for consistent development.

---

## 3. The problem Meridian solves

AI agents make it easy to produce code quickly. This is useful, but it also creates
a new risk: agents can work a lot, for a long time, without the project actually
becoming clearer.

Without an explicit flow, it is common for:

- code to come before scope;
- features to come before architecture;
- databases to be built before understanding user types;
- implementation to happen before acceptance criteria;
- important decisions to be lost in the chat;
- agents to create files without a source of truth;
- user stories to have no clear dependencies;
- status to be marked as done just because it compiled;
- documentation to fall behind the code;
- rework to happen because direction changed without a record.

Meridian solves this by requiring the agent to work within a protocol.

Before writing code, the agent must understand the project.
Before executing a sprint, the agent must know which documents are approved.
Before creating user stories, epics and versions must be defined.
Before marking something as done, acceptance must be proven.

The goal is not "fast software" at any cost.
The goal is consistent development.

---

## 4. Core principles

### 4.1 Documentation precedes code

Nothing enters development without being documented.
Nothing is done if the documentation does not reflect the real state.

### 4.2 The person is manager of the process

AI agents execute, suggest, verify, and implement.
The person decides direction, approves maturity, accepts relevant changes, and controls
what enters the flow.

### 4.3 Agents work with explicit context

An agent should not rely on conversation memory when the decision should be
in the project. Decisions, scope, constraints, architecture, and acceptance criteria must
be in Meridian files.

### 4.4 Simplicity is part of the product

Meridian must avoid unnecessary bureaucracy. The flow exists to provide clarity, not
to create 1001 agents, 1001 documents, or a heavy process.

### 4.5 Status must be auditable

An item is not done because it "looks ready" or because "it compiled".
Status must reflect evidence.

### 4.6 The board is derived, not manually edited

The canonical board is `docs/kanban/board.json`.
It is generated from the frontmatters of user stories.
It must never be manually edited as a primary source.

---

## 5. How to use this file

Copy `.agent/` (including this file) to the project root, then use it as follows:

1. Ensure `.agent/MERIDIAN.md` is at the project root (inside `.agent/`).
2. Ask an AI agent to read this file in full.
3. The agent must create the `/docs` structure.
4. The agent must initialize the decision log.
5. The agent must follow the document order, dependencies, and approvals.
6. The agent should only write code when the documentation required for that stage exists.

This file does not require the use of a Meridian management app.

An app, extension, or dashboard can monitor the project folder and visualize the structure,
but the protocol works with only Markdown and JSON files.

---

## 6. Mandatory instructions for AI agents

If you are an AI agent reading this file, follow these rules:

1. Do not start by writing code.
2. First check whether a `docs/` folder exists.
3. If `docs/` does not exist, create the Meridian structure.
4. Record relevant decisions in `docs/decisions/YYYY-MM-DD.json` before making cross-cutting changes.
5. Create `docs/00_scope.md` and maintain it as the project's first source of truth.
6. Do not advance dependent documents beyond `draft` if their predecessors are not `approved`.
7. Do not create user stories before `05_architecture.md` is `approved` (delivery gate).
8. Do not edit `docs/kanban/board.json` as a primary source; generate it from user stories.
9. Always record decisions that change scope, stack, architecture, security, version, or criteria.
10. If an `approved` document needs to change, record the decision and move the document back to `review`.
11. If a US is `🔶`, the acceptance section must contain `Missing:`.
12. If a US depends on another, it can only leave `❌` when all dependencies are `✅`.
13. Before implementing, identify which US, version, and epic justify the change.
14. Before finishing, update the affected documents and run applicable validations.

If the user asks for speed without minimum documentation, explain the risk and propose the
smallest set of documents needed to move forward safely.

---

## 7. Folder structure

When starting a Meridian project, create the project structure in `docs/`.
Maintain a `.agent/` folder at the project root with specialized agents, skills,
workflows, rules, and scripts for AI.

```txt
/README.md          # optional; Git convention (kit monorepo uses it for onboarding)

/.agent
  MERIDIAN.md
  ARCHITECTURE.md
  agents/
  skills/
    doc.md
  workflows/
  rules/
    MERIDIAN.md    # trigger: always_on
  scripts/
  .shared/

/docs
  README.md
  00_scope.md
  01_tech_stack.md
  02_security.md
  03_user_types.md
  04_principles.md
  05_architecture.md
  06_database.md
  07_api_contracts.md
  08_environments.md
  11_decisions.md

  /decisions
    YYYY-MM-DD.json

  /templates
    README.md              # human guide + symlinks to kit templates

  /versions
    vX.md

  /sprints
    vX-SY.md

  /epics
    EPIC-XX.md

  /us
    US-XXXX.md

  /kanban
    board.json
```

### 7.1 About `.agent/` and `.cursor/`

`.agent/` contains the portable operational layer for AI agents (Antigravity standard).

It is optional for simple projects, but recommended when agents will be used
frequently. Its purpose is to keep specialized instructions outside the main protocol,
without losing governance.

**Cursor IDE:** Cursor does not natively index `.agent/`. Use `.cursor/` as a **local** adapter:

- Edit the kit in `.agent/` (versioned source).
- Run `./.agent/scripts/sync_cursor_kit.sh` after clone or when adding a skill/agent/workflow/template.
- Sync also creates `.cursor/references/templates/` (writing-guide, section-contracts, lifecycle, …).
- **Do not commit `.cursor/`** — local symlinks (`.gitignore` at the kit root).
- Always-on rule: `.agent/rules/meridian.mdc` → mirrored in `.cursor/rules/meridian.mdc`.
- Slash commands: `.cursor/commands/` mirrors `.agent/workflows/`.

Recommended structure:

- `agents/`: agent roles/personas;
- `skills/`: knowledge packages with `SKILL.md`;
- `workflows/`: actionable procedures;
- `rules/MERIDIAN.md`: global rules always active (`trigger: always_on`);
- `scripts/`: local validations and automations;
- `.shared/`: shared resources.

Official kit skills (see `.agent/skills/doc.md`):

- `init-project`
- `create-epic`
- `create-version`
- `create-sprint`
- `create-user-story`
- `refine-user-story`
- `complete-user-story`
- `generate-board-json`
- `update-decisions-log`
- `security-review`
- `meridian-routing`

**Delivery templates** (read before Write on epics, versions, US):

- `.agent/references/templates/INDEX.md` — registry
- `.agent/references/templates/writing-guide.md` — **prose quality** (Why / Where / Approach, epic paragraphs)
- `.agent/references/templates/section-contracts.md` — fixed `##` / `###` structure
- `.agent/references/templates/lifecycle.md` — create → refine → implement → close

Human mirror in target projects: `docs/templates/` (symlinks to kit).

Rules:

- `.agent/MERIDIAN.md` (this file) is the primary protocol authority.
- `.agent/rules/` defines global rules for agents.
- `.agent/workflows/` defines procedures.
- `.agent/agents/` defines responsibilities.
- `.agent/skills/` details specific tasks.
- If there is a conflict between a skill and this file, `.agent/MERIDIAN.md` wins.
- If a skill causes a relevant change, record it in `docs/decisions/YYYY-MM-DD.json`.

### 7.2 About `docs/README.md`

`docs/README.md` is the human entry point for the project.
It must contain:

- a link to each phase document;
- current status of each document;
- current product version;
- next milestone;
- active user stories for the version in progress;
- useful notes for agents and people.

### 7.3 About `docs/kanban/board.json`

`board.json` is a generated artifact.
It represents a consolidated view of the frontmatters of user stories.

Do not create `board.csv` as a file maintained in parallel.
CSV, spreadsheets, or other formats are derived exports, generated on demand
by future tooling.

---

## 8. Standard frontmatter for phase documents

Every phase document must begin with:

```yaml
---
title: Document name
status: draft | review | approved
version: 1.0
updated: YYYY-MM-DD
depends_on: []
blocks: []
---
```

### Document statuses

- `draft`: document being created or incomplete.
- `review`: document complete enough for human validation.
- `approved`: document approved and unblocking dependents.

### Maturity rule

```txt
draft -> review -> approved
          ^          |
          |----------|
     relevant change returns to review
```

No dependent document should advance beyond `draft` while its predecessors
are not `approved`.

---

## 9. Dependency map

```txt
11_decisions + docs/decisions/
  rules stub; entries in `docs/decisions/YYYY-MM-DD.json` — starts on day 1; never blocks anything

00_scope
  unblocks all other documents

01_tech_stack
  depends on 00_scope
  unblocks 02_security, 04_principles, 08_environments

02_security
  depends on 00_scope, 01_tech_stack
  unblocks 03_user_types, 04_principles

03_user_types
  depends on 02_security
  unblocks 04_principles, 05_architecture, 06_database, 07_api_contracts

04_principles
  depends on 01_tech_stack, 02_security, 03_user_types
  unblocks 05_architecture

05_architecture
  depends on 00_scope, 01_tech_stack, 02_security, 03_user_types, 04_principles
  unblocks 06_database, 07_api_contracts, 08_environments
  unblocks creation of user stories (epic/version in the folders)

06_database
  depends on 03_user_types, 05_architecture
  unblocks 07_api_contracts

07_api_contracts
  depends on 03_user_types, 05_architecture, 06_database

08_environments
  depends on 01_tech_stack, 05_architecture
```

Delivery (folders — source of truth, no markdown index):

```txt
docs/epics/EPIC-XX.md
docs/versions/vX.md
docs/sprints/vX-SY.md
docs/us/US-XXXX.md
docs/kanban/board.json   # derived from user stories
```

User stories can only be created when:

```txt
05_architecture = approved
referenced epic exists in docs/epics/
referenced version exists in docs/versions/
```

---

## 10. Phase-by-phase workflow

### Phase 0 — Foundation

Always sequential.

1. `11_decisions.md`
2. `00_scope.md`
3. `01_tech_stack.md`
4. `02_security.md`
5. `03_user_types.md`

Security comes before architecture.
User types come before principles and architecture.
Releases, epics, and sprints come after architecture (delivery axis).

### Phase 1 — Principles

- `04_principles.md`

Code conventions and quality — guide implementation and architecture.

### Phase 2 — Architecture

- `05_architecture.md`

Architecture reflects scope, stack, security, users, and principles.

### Phase 3 — Technical detail

- `06_database.md`
- `07_api_contracts.md`
- `08_environments.md`

Database comes before full API contracts.
Environments document setup, commands, variables, and differences between local/dev/staging/prod.

### Delivery backlog (folders)

- `docs/epics/EPIC-XX.md` — product capabilities
- `docs/versions/vX.md` — releases
- `docs/sprints/vX-SY.md` — time slices

Only create user stories after `05_architecture.md` is approved.
Each US references an epic and version that already exist in the folders.

### Execution

- individual US files in `docs/us/` — create with `/create-us`, refine with `/refine-us`, implement only when `ready: true`;
- sprints in `docs/sprints/`;
- code;
- go-live checklist;
- continuous update of decisions in `docs/decisions/YYYY-MM-DD.json`.

**US lifecycle:** `/create-us` (Why / Where / Approach prose, `ready: false`) → `/refine-us` (deepen Approach, exact architecture §, `ready: true`) → implement → `/complete-us` → `/sync-board`.

---

## 11. Required content for each document

### 11.1 `00_scope.md` — Scope

Must answer:

- What is the name of the project?
- What does the project do?
- What problem does it solve?
- Who does it solve it for?
- What is in scope?
- What is out of scope?
- What constraints exist?
- What assumptions are being made?
- What risks are already known?

Rule for agents:

Do not treat scope as a generic list. Write concrete boundaries.
What is out of scope is as important as what is in scope.

### 11.2 `01_tech_stack.md` — Tech stack

Must cover:

- frontend;
- backend;
- database;
- infrastructure;
- CI/CD;
- containers;
- DX;
- linting;
- formatting;
- testing;
- justification for each choice;
- discarded alternatives.

Rule for agents:

Do not choose technology merely out of familiarity. Explain why the choice serves the project.

### 11.3 `02_security.md` — Security

Must cover:

- minimum threat model;
- authentication;
- authorization;
- data protection;
- input and output validation;
- rate limiting;
- audit and logs;
- secrets management;
- dependency security;
- AI agent security;
- compliance;
- OWASP Top 10 in the project context;
- accepted risks and out-of-scope risks.

The document must be practical. Listing "use HTTPS" or "validate inputs" is not enough.
The agent must explain how security applies to the specific project.

#### 11.3.1 Minimum threat model

Include:

- internal and external actors;
- user profiles with system access;
- sensitive data;
- attack surfaces;
- external integrations;
- destructive operations;
- impact of leak, unauthorized modification, or unavailability.

Mandatory questions:

- Who might try to access data without authorization?
- What data must not leak?
- What actions require strong authorization?
- What parts of the system receive untrusted input?
- Which external integrations increase risk?
- What happens if an AI agent accidentally receives sensitive context?

#### 11.3.2 Secrets management

Define:

- which environment files exist;
- which files never go into Git;
- whether `.env.example` is required;
- how secrets are loaded;
- how secrets are rotated;
- where secrets must not appear.

Mandatory rules:

- `.env` and `.env.*` do not go into Git.
- `.env.example` must be versioned without real values.
- Secrets must not appear in logs.
- Secrets must not be pasted into prompts for AI agents.
- Tokens, cookies, authorization headers, and private keys are sensitive data.

#### 11.3.3 AI agent security

When AI agents participate in development, document:

- which files may be shared with agents;
- which files must not be sent to external services;
- which commands require human confirmation;
- how to handle destructive commands;
- how to record decisions suggested by agents;
- how to validate code generated by agents.

Mandatory rules for agents:

- Do not execute destructive commands without explicit authorization.
- Do not exfiltrate `.env`, secrets, keys, tokens, or private data.
- Do not reduce security to "make it work" without recording a decision.
- Do not create authentication/authorization bypasses without marking them as critical risk.
- Do not mark security as done without evidence.

#### 11.3.4 Authentication and authorization

Define:

- whether the system is public, authenticated, or hybrid;
- session strategy — JWT, OAuth, SSO, or another model;
- expiration, renewal, and revocation;
- authorized profiles per action;
- RBAC, ABAC, or custom model;
- multi-tenant isolation where applicable.

Rule:

Authentication answers "who you are".
Authorization answers "what you can do".
Do not mix the two.

#### 11.3.5 Data protection

Classify:

- public data;
- internal data;
- sensitive data;
- PII;
- financial data;
- health data;
- legal/regulatory data;
- credentials and secrets.

For each category, define:

- storage;
- access;
- encryption;
- retention;
- logs;
- backup;
- deletion.

#### 11.3.6 Validation and injection

Define:

- where inputs are validated;
- which schemas are used;
- who sanitizes output;
- how to prevent SQL injection, command injection, XSS, and path traversal;
- how uploads are validated;
- how markdown, HTML, or user-generated content is rendered.

#### 11.3.7 Dependencies and supply chain

Define:

- package manager;
- single lockfile;
- audit policy;
- dependency updates;
- criteria for adding libraries;
- prevention of abandoned or unnecessary packages;
- secret scanning where applicable.

#### 11.3.8 Logs, audit, and monitoring

Define:

- events that must be logged;
- events that must not be logged;
- log retention;
- log access;
- audit trail;
- minimum alerts;
- protection against PII and secrets leakage.

#### 11.3.9 Contextual OWASP checklist

For each item of the OWASP Top 10, indicate:

- whether it is applicable;
- where it appears in the project;
- main risk;
- mitigation;
- open items.

Do not write only "not applicable" without justification.

Rule for agents:

Security is not a final step. Security comes before architecture.
If security is incomplete, architecture and implementation must declare the risk.

### 11.4 `03_user_types.md` — User types

For each profile:

```md
## Profile name

- **Description:** who this user is
- **Origin:** how they enter the system
- **Permissions:** allowed actions
- **Restrictions:** prohibited actions
- **Session:** expiration, renewal, logout
- **Visible data:** accessible entities and fields
- **Edge cases:** inactive, expired invite, downgrade, concurrent access
```

Rule for agents:

Do not advance to database, API, or authorization before understanding the profiles.

### 11.5 `docs/epics/` — Epics (product capabilities)

Each epic lives in **`docs/epics/EPIC-XX.md`** (flat folder, one file per epic),
in the same spirit as `docs/us/US-XXXX.md`. There is no duplicate markdown index.

Format for each epic (`docs/epics/EPIC-XX.md`):

```yaml
---
id: EPIC-XX
title: Short name
status: active | complete | paused
versions: [v0, v1]
profiles: [Profile A, Profile B]
outcome: "Epic done at product level — objective sentence."
---

# EPIC-XX — Name

## Capability

Two short paragraphs: (1) user problem today (2) product behavior after the epic. See `writing-guide.md`.

## Expected outcome

One paragraph — observable signal that the epic is done (not only “all US ✅”).

## Out of scope for this epic

Boundaries — what belongs to another epic or version.
```

Rules:

- Permanent IDs: `EPIC-01`, `EPIC-02`, … (never reuse).
- Filename must match `id` (`EPIC-01.md` → `id: EPIC-01`).
- `outcome` is mandatory in the frontmatter (done at product level, not implementation).
- Do not create subfolders inside `docs/epics/`.
- Only create epics and user stories after `05_architecture.md` is `approved`.
- User stories **reference** the epic (`epic: EPIC-XX`) — they do not repeat the epic's description, `outcome`, or scope.

Rule for agents:

An epic is not a technical module. An epic is a product capability. New epic → skill `create-epic`.

### 11.6 `04_principles.md` — Code principles

Must define:

- where components live;
- where validations live;
- where types live;
- where constants live;
- where queries live;
- layer pattern;
- naming conventions;
- branches;
- commits;
- error handling;
- API pattern;
- formatting and lint standards.

Rule for agents:

Use this document to prevent each agent from inventing a different structure.

### 11.7 `docs/versions/` and `docs/sprints/` — Releases and sprints

Each version lives in **`docs/versions/vX.md`**; sprints in **`docs/sprints/vX-SY.md`**.
There is no duplicate markdown index — the folder is the source of truth.

Format for each version (`docs/versions/vX.md`):

```yaml
---
id: v1
title: Short release name
status: planned | active | complete
outcome: "Release done at product level."
---

# v1 — Name

## Objective
## Done criteria
## Included in this version
## Explicitly out
## Go-live checklist
## Sprints
```

Format for each sprint (`docs/sprints/v1-S1.md`):

```yaml
---
id: v1-S1
version: v1
title: Sprint name
status: planned | active | complete
done_when: "Objective condition."
stories: [US-0001, US-0002]
---

# v1-S1 — Name

(optional US table in the body)
```

Rules:

- Version IDs: `v0`, `v1`, `v2`… (`v0.md` → `id: v0`). `v0` is technical foundation — do not sell as product.
- Sprint IDs: `v1-S1`, `v2-S1`…
- User stories reference **`version: vX`** — they do not repeat the version plan.
- Epics reference **`versions: [v0, v1]`** — releases where the capability lands.
- US gate: `05_architecture.md` = `approved` + epic/version exist in the folders.
- New release → skill `create-version` or `/create-version`.
- New sprint → skill `create-sprint` or `/plan-sprint`.

### 11.8 `05_architecture.md` — Architecture

Must cover:

- architecture type;
- component diagram;
- data flow;
- frontend structure;
- backend structure;
- state strategy;
- fetch/cache strategy;
- form strategy;
- external integrations;
- logging and observability.

Rule for agents:

Architecture must explain decisions, not just list folders.

### 11.9 `06_database.md` — Database

Must cover:

- ER diagram;
- tables/collections;
- fields;
- types;
- nullable;
- defaults;
- indexes;
- relationships;
- audit;
- soft delete;
- sensitive fields;
- migrations;
- seeds.

Recommended audit fields:

```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
created_at TIMESTAMPTZ NOT NULL DEFAULT now()
updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
deleted_at TIMESTAMPTZ NULL
created_by UUID REFERENCES users(id)
```

### 11.10 `07_api_contracts.md` — API contracts

For each endpoint:

```md
## METHOD /path

- **Authentication:** required | public
- **Minimum permission:** profile
- **Version:** available from vX

### Request

### Response — Success

### Response — Errors
```

Rule:

A complete API contract depends on the database when the endpoint returns persisted data.

### 11.11 `08_environments.md` — Environments

Must cover:

- prerequisites;
- local setup;
- day-to-day commands;
- environment variables;
- protected files;
- available environments;
- differences between environments.

Rule:

`.env` and `.env.*` must not go into Git.
Use `.env.example` as the versioned contract.

### 11.12 `11_decisions.md` + `docs/decisions/` — Decision log

Starts on day 1.
`11_decisions.md` is a stub with rules; the log lives in **`docs/decisions/YYYY-MM-DD.json`** — one file per day.

New entries go **at the beginning** of the `entries` array (prepend on the same day).
Never edit an old entry; record a new decision above the previous ones.

Format of the daily file:

```json
{
  "date": "2026-06-02",
  "entries": [
    {
      "time": "17:30",
      "title": "Objective title",
      "affected_document": "path/to/doc.md",
      "what_changed": "objective description",
      "why_changed": "context and motivation",
      "impact": "list of affected docs",
      "responsible": "person or role"
    }
  ]
}
```

Rules:

- `date` must match the filename (`2026-06-02.json`).
- `time` uses `HH:MM` format (24h) — **the real clock when the entry is written** (`date +"%H:%M"` at log time). Do not use rounded or invented times.
- New calendar day → new JSON file.
- Same day → prepend at `entries[0]`.

Archiving: when a day accumulates dozens of entries, keep the day's file;
old days remain as immutable history in the folder.

---

## 12. User stories

Each US is an individual file in:

```txt
docs/us/US-XXXX.md
```

The folder is flat.
Do not create subfolders by epic.

Each US references an epic in `docs/epics/` via the frontmatter `epic: EPIC-XX`.
The referenced epic must exist as a file in `docs/epics/`.

### 12.1 Creation rule

USs can only be created after:

```txt
05_architecture.md = approved
referenced epic in docs/epics/
referenced version in docs/versions/
```

### 12.2 ID policy

- IDs are permanent.
- IDs are never reused.
- Fixed format: **`US-XXXX`** — four digits with leading zeros (`US-0001`, `US-0017`, `US-0123`).
- Filename must match `id` (`US-0001.md` → `id: US-0001`).
- Gaps are acceptable.
- Next ID = highest existing number + 1, always with 4 digits.

### 12.3 US frontmatter

```yaml
---
id: US-XXXX
title: Short title
epic: EPIC-XX
version: v1
status: ✅ | 🔶 | ❌ | 🧊
moscow: Must | Should | Could | Won't
depends_on: [US-YYYY]
ready: false | true
done_when: "Objective and measurable condition."
tests: required | none
tests_status: pending | done | n/a
---
```

### 12.4 US body

```md
# US-XXXX — Short title

**As** [user type],
**I want** [action],
**so that** [benefit].

## Acceptance

- Objective condition
- Objective condition
- **Missing:** required when status = 🔶

## Context & constraints

Explain this slice — frontmatter already has `epic:`. Do not paste epic text.

### Why this story

2–4 sentences: before/after **this US**.

### Where it fits

2–4 sentences: version, dependencies, what this unblocks.

### Approach

Explanatory bullets (full thoughts, not bare paths).

### Architecture refs

- `docs/05_architecture.md` — § …

### API / DB impact

- _n/a_ | …

### Security notes

- _n/a_ | …

### Related decisions

- _n/a_ | …

## Technical implementation

> **Creation:** placeholder or optional preliminary plan.  
> **Closing (`✅`):** real record — touched files, summary by layer. Skill `complete-user-story`.

### Files

### Backend

### Frontend

### Scripts / Docs

## Tests

> **Creation:** fill in **Planned**. **Closing:** check `[x]` and record in **Executed**; then set `tests_status: done`.

### Planned

- [ ] **automated** — `pnpm test` — describe scope
- [ ] **manual** — steps and expected result

### Executed

_(pending)_

## Out of scope for this story

## Notes
```

### 12.5 US statuses

| Symbol | Name        | Meaning                                  |
| ------ | ----------- | ---------------------------------------- |
| ✅     | Done        | Delivered and acceptance proven          |
| 🔶     | In progress | Partial; must declare `Missing:`         |
| ❌     | Pending     | Does not exist yet for the user          |
| 🧊     | Frozen      | Won't do in this version                 |

Rules:

- `✅` requires proven acceptance and, if `tests: required`, `tests_status: done` with **Planned** `[x]` and **Executed** filled in.
- `🔶` requires `Missing:` in the acceptance section.
- `❌` must not hide partial work.
- `🧊` requires a deliberate decision, not forgetfulness.

**Test fields (frontmatter):**

| Field          | Values                    | Use                                            |
| -------------- | ------------------------- | ---------------------------------------------- |
| `tests`        | `required` / `none`       | Does the US need verification before closing?  |
| `tests_status` | `pending` / `done` / `n/a` | `n/a` only with `tests: none`                 |

**Derived column in the monitor:** `🧪` when `tests: required` and `tests_status: pending` (do not store emoji in YAML).

---

## 13. Board JSON

The canonical board is:

```txt
docs/kanban/board.json
```

It is generated from the frontmatters of `docs/us/US-XXXX.md` files.

Structure:

```json
[
  {
    "id": "US-0001",
    "title": "Short title",
    "epic": "EPIC-01",
    "version": "v1",
    "status": "❌",
    "moscow": "Must",
    "depends_on": ["US-0002"],
    "ready": false,
    "done_when": "Objective completion condition.",
    "tests": "required",
    "tests_status": "pending"
  }
]
```

Rules for agents:

- Do not edit `board.json` as a primary source.
- Update the US first.
- Generate `board.json` afterwards.
- If there is a divergence between a US and the board, the US wins.
- CSV is a future export, not a source of truth.

### Validation scripts

Run at the target project root (kit repo example: `app-desktop`):

```bash
python3 .agent/scripts/validate_meridian.py <project-folder>
python3 .agent/scripts/validate_meridian.py <project-folder> --json   # CI / machine output
```

The validator checks frontmatter, section contracts (`section-contracts.md`), board sync hints, and prose gates (Why / Where / Approach on US, epic paragraphs). Legacy Context headings warn until migrated.

One-time migrations for older US files:

```bash
python3 .agent/scripts/migrate_legacy_us_context.py <project-folder>
python3 .agent/scripts/migrate_us_writing_format.py <project-folder>   # --force to re-run
```

---

## 14. AI agents within the Meridian flow

Meridian assumes AI agents will be used.
But agents must work with governance.

### 14.1 The agent may

- create document drafts;
- suggest decisions;
- point out risks;
- create user stories after unblocking;
- implement approved USs;
- run tests;
- update affected documentation;
- generate `board.json`;
- suggest next steps.

### 14.2 The agent must not

- start with code without minimum documentation;
- invent scope without recording assumptions;
- create USs before epics and versions are approved;
- mark anything as `✅` without evidence;
- edit old decisions;
- hide blockers;
- turn Meridian into a complex network of autonomous agents;
- act indefinitely without returning visibility to the process manager;
- read, copy, or expose secrets without explicit need;
- send sensitive data to external services without authorization;
- execute destructive commands without confirmation;
- weaken authentication, authorization, or validation to speed up delivery;
- treat generated code as trustworthy without review.

### 14.3 How the agent should respond when documentation is missing

If the user asks for implementation and the minimum documentation does not exist, the agent must say:

1. which document is missing;
2. why it blocks implementation;
3. what is the smallest content needed to move forward;
4. whether it can create a draft for review.

The agent should prefer documented progress over speed without direction.

---

## 15. Bootstrap checklist for agents

Upon receiving a new project with this file, execute:

1. Read `.agent/MERIDIAN.md` in full.
2. Check whether `docs/` exists.
3. If it does not exist, create the base structure.
4. Create `docs/11_decisions.md` (stub) and `docs/decisions/YYYY-MM-DD.json`.
5. Record the initial decision in JSON: "Project initialized with Meridian".
6. Create `docs/00_scope.md` in `draft`.
7. Ask for or carefully infer the initial scope.
8. Promote `00_scope.md` to `review` only when it is complete.
9. Only promote to `approved` when there is human confirmation or explicit authorization.
10. Create the remaining documents respecting dependencies.
11. Create `docs/kanban/board.json` as an empty array.
12. If desired or present, create `.agent/` with agents, skills, workflows, rules, and scripts.
13. Ensure a minimum `.gitignore` before any secret or local dependency.
14. Do not create USs until `05_architecture` is `approved` and epic/version exist in the folders.
15. Before writing code, identify the version, epic, and US.
16. After implementing, update the US, affected docs, and the board.

---

## 16. Pre-code checklist

Before any implementation, confirm:

- Does `00_scope.md` exist?
- Is the relevant scope approved?
- Is the stack defined?
- Has security been documented with threats, secrets, data, and permissions?
- Do user types exist?
- Is there a related epic?
- Is there a related version?
- Is there a related US?
- Are the US dependencies done?
- Is the acceptance criterion clear?
- Are expected tests or validations defined?
- Are `.env`, secrets, builds, and local dependencies protected in Git?
- Does the agent need any specific skill before executing?

If the answer is "no" for any essential item, document first.

---

## 17. Done checklist

A delivery is only done when:

- code has been implemented;
- applicable build/lint/test has passed;
- acceptance has been validated;
- `## Technical implementation` of the US is filled with changed/created files and a summary of what was done (no placeholder);
- affected documentation has been updated;
- relevant decisions have been recorded;
- the US has been updated (acceptance, status, implementation, tests);
- `board.json` has been regenerated;
- nothing is left `🔶` without `Missing:`.

---

## 18. Meridian and management tools

Meridian can be used without any tool.

A Meridian management system can open a project folder and monitor:

- phase documents;
- statuses;
- dependencies;
- blockers;
- decisions;
- user stories;
- board JSON;
- inconsistencies.

But the tool is not the source of truth.

The source of truth is the project folder.

This allows anyone to use Meridian with only files, and visual tools to be
optional layers on top of the protocol.

---

## 19. Operational phrase

When in doubt, apply this rule:

> If it is not documented, it is not ready to be implemented.
> If it has been implemented, it must be reflected in the documentation.
> If an agent worked, the process manager must be able to audit what changed.

---

## 20. Protocol version

Meridian Protocol Version: 1.0

This file is meant to be copied to any project as a starter for working
with AI agents and consistent development.
