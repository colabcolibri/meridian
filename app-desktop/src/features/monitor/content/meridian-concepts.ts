import { PHASE_DOC_IDS } from "@/domain/meridian/phase-doc-files"
import { phaseLabelForDocId } from "@/domain/meridian/doc-refs"
import { SCRUM_MERIDIAN_MERMAID } from "@/features/monitor/content/scrum-meridian-mermaid"

export type ConceptBlock = {
  id: string
  title: string
  summary: string
  bullets?: string[]
}

export type JourneyPhase = {
  id: string
  label: string
  subtitle: string
  purpose: string
  documents: string[]
  gate?: string
  note?: string
}

export type GuideSubsection = {
  title: string
  paragraphs: string[]
  bullets?: string[]
}

export type DailyWorkflowStep = {
  id: string
  title: string
  when: string
  actions: string[]
  commands?: string[]
  tip?: string
}

export type SlashCommandHint = {
  command: string
  when: string
  example?: string
}

export type AnatomyField = { field: string; meaning: string }

export type AnatomySection = {
  heading: string
  description: string
  subsections?: { label: string; description: string }[]
}

export type AnatomyGuide = {
  title: string
  intro: string
  fields: AnatomyField[]
  sections?: AnatomySection[]
  exampleTitle?: string
  exampleCode?: string
}

// ─── Intro ────────────────────────────────────────────────────────────────────

export const meridianIntro = {
  title: "What Meridian is",
  paragraphs: [
    "Meridian is my workflow experiment for building with AI agents — a thin, repo-native harness on top of Cursor or Claude Code. docs/ holds task specs and memory; .agent/ holds guides (rules, agents, skills, workflows); validators act as sensors.",
    "I plan in docs/ and work solo with the agent, but I'm also testing longer autonomous stretches on open sprints and US. Scrum shapes the management loop; the technical bet is harness engineering: guides, sensors, and persistent state in Git.",
    "This tab is the full reference. To work with a real project, open docs/ from the home screen or use the IDE with the .agent/ kit.",
  ],
}

export type AudienceCard = {
  id: string
  label: string
  description: string
}

export const audiences: AudienceCard[] = [
  {
    id: "solo",
    label: "Solo developer",
    description:
      "Working alone with AI agents. Meridian keeps your project organized — scope, decisions, and progress in one place — so each new session picks up exactly where the last one ended.",
  },
  {
    id: "small-team",
    label: "Small team (2–3 people)",
    description:
      "No dedicated PM tool. Meridian gives the team a shared written spec that everyone — and every agent — works from. No more 'what did we decide last week?'",
  },
  {
    id: "agent-driven",
    label: "Agent-heavy workflow",
    description:
      "Running agents autonomously across long sessions or multiple tasks. The file structure gives agents a stable context to read, follow, and update — so they stay aligned without constant supervision.",
  },
]

export const meridianLoop = {
  title: "The development loop",
  subtitle:
    "Each user story follows this cycle. The files persist across every session.",
  steps: [
    {
      id: "document",
      label: "Document",
      description:
        "Scope, architecture, and decisions in docs/ — I approve, agent drafts.",
    },
    {
      id: "plan",
      label: "Plan",
      description:
        "Epics, versions, sprint, and user stories define what ships and in what order.",
    },
    {
      id: "refine",
      label: "Refine",
      description:
        "Each story needs a clear Approach and ready: true before product code.",
    },
    {
      id: "implement",
      label: "Implement",
      description: "Agent reads the US and implements against acceptance criteria.",
    },
    {
      id: "close",
      label: "Close",
      description: "Record with evidence; I review before status ✅.",
    },
    {
      id: "commit",
      label: "Commit",
      description: "One commit per story — code and docs in the same Git history.",
    },
  ],
}

export const whatImLearning = {
  footer: "Still open questions. This repository is my lab.",
  questions: [
    "Once versions, sprints, and open US are in docs/, can the agent run long continuous sessions on the backlog — refine, implement, close — without drifting or skipping harness gates?",
    "Does managing Scrum in files (commands, skills, structured artifacts) cost fewer credits than re-explaining context and priorities in chat every session?",
    "Does the harness — guides, sensors, ready/Record gates, phase docs — actually ship functional, organized, secure, documented software, not just fast code?",
  ],
}

export const welcomeHome = {
  eyebrow: "Experiment · AI agent harness",
  title: "Spec in Git. Guides for the agent. I direct the loop.",
  lead: "Meridian is my thin harness layer on top of Cursor or Claude Code: docs/ holds versions, sprints, and task specs; .agent/ holds guides and workflows; validators act as sensors. I plan and work solo with the agent — and I'm testing whether it can also run longer autonomous stretches on the open backlog without breaking the flow. This app is observability — it reads docs/ and shows setup, deliverables, and board.",
  hypothesis: {
    title: "What I'm learning",
    questions: whatImLearning.questions,
  },
  rules: "No ready: true → no product code. No ## Record → no ✅.",
  ctaLabel: "Open your Meridian project's docs folder",
  demoCtaLabel: "Load demo project",
  demoNote:
    "Opens this repository's docs/ — setup, deliverables, and board with real Meridian data.",
}

// ─── Scrum ↔ Meridian (synthesis) ─────────────────────────────────────────────

export type ScrumMappingRow = {
  scrum: string
  meridian: string
  note?: string
}

export type ScrumCeremonyRow = {
  ceremony: string
  meridian: string
}

export const scrumMeridianMap = {
  title: "Scrum and Meridian",
  subtitle:
    "Scrum-inspired management loop on top of the harness — files in docs/, not chat.",
  paragraphs: [
    "Use this section for day-to-day mapping. The full Scrum textbook lives in the kit as optional human reading — agents use scrum-meridian-map.md in .agent/references/, not the long guide, unless you ask.",
    "We skip story points, velocity, burndown, and a mandatory Feature layer. Sprint priority is the order of US ids in the sprint file.",
  ],
  flowTitle: "How concepts map",
  flowColumns: {
    scrum: "Scrum (reference)",
    meridian: "Meridian (source of truth)",
  },
  flowRows: [
    { scrum: "Phase / product vision", meridian: "docs/00–11 phase docs" },
    { scrum: "Epic", meridian: "docs/epics/EPIC-XX.md" },
    { scrum: "Feature (optional)", meridian: "— (epic → US)" },
    { scrum: "User story", meridian: "docs/us/US-XXXX.md" },
    { scrum: "Task / subtask", meridian: "Plan → Approach + Planned" },
    { scrum: "Bug", meridian: "Correction US or fix in current US" },
    { scrum: "Spike", meridian: "US with timebox in Notes → decision log" },
    { scrum: "Release", meridian: "docs/versions/vX.md" },
    { scrum: "Sprint", meridian: "docs/sprints/vX-SY.md (optional)" },
    { scrum: "Board", meridian: "docs/kanban/board.json (generated)" },
  ],
  mermaidDiagram: SCRUM_MERIDIAN_MERMAID,
  ceremoniesTitle: "Ceremonies → commands",
  ceremonies: [
    {
      ceremony: "Backlog refinement",
      meridian: "/create-us · /review-us · /refine-us",
    },
    {
      ceremony: "Sprint planning",
      meridian: "/plan-sprint — stories: order = priority",
    },
    { ceremony: "Daily", meridian: "/daily-with-ai or /status" },
    { ceremony: "Sprint review", meridian: "You demo against Acceptance + Planned" },
    {
      ceremony: "Retrospective",
      meridian: "/complete-sprint — Retrospective + status complete",
    },
  ] satisfies ScrumCeremonyRow[],
  notImported: [
    "Story points and velocity",
    "Burndown charts as required",
    "docs/tasks/ or docs/bugs/ folders",
    "Agents auto-prioritizing the backlog",
  ],
  kitPaths: {
    map: ".agent/references/scrum-meridian-map.md",
    textbook: ".agent/references/scrum-guide-complete.md",
  },
}

// ─── Core principles ─────────────────────────────────────────────────────────

export const corePrinciples: ConceptBlock[] = [
  {
    id: "spec-first",
    title: "Files carry the context",
    summary:
      "Scope, architecture, and acceptance criteria live in docs/ before any implementation. Every agent session starts by reading these files — so context is never rebuilt from scratch in chat.",
    bullets: [
      "A story needs a written Approach before the agent implements. /refine-us establishes this.",
      "Architecture approval gates the backlog — so agents always build on solid, agreed ground.",
    ],
  },
  {
    id: "human-manager",
    title: "You set the direction",
    summary:
      "The developer steers the project — approving documents, reviewing output, deciding what ships. The agent moves faster when the direction is clear in the files.",
    bullets: [
      "Phase docs move to approved when you review and confirm them.",
      "Stories close with ✅ after reviewing the evidence with /complete-us.",
    ],
  },
  {
    id: "audit-status",
    title: "Done means recorded",
    summary:
      "A completed story has real evidence in the file: acceptance criteria checked, files listed, tests run. The next session — yours or the agent's — picks up exactly where things left off.",
    bullets: [
      "🔶 marks a story as partial, with an explicit note on what is still missing.",
      "The board reflects the story files. Run /sync-board to regenerate it after any change.",
    ],
  },
]

// ─── Journey phases ───────────────────────────────────────────────────────────

export const journeyPhases: JourneyPhase[] = [
  {
    id: "phase-1",
    label: "Phase 1 — Foundation",
    subtitle: "What are we building and for whom",
    purpose:
      "At the end of this phase you have a clear answer to what the product is, what it is not, and who uses it. The agent can help draft these — or read an existing codebase and infer them.",
    documents: [
      "00_scope.md — product scope and boundaries",
      "03_user_types.md — who uses it",
      "11_decisions.md — decision log (starts here, runs forever)",
    ],
    gate: "00_scope.md approved → Phase 2 opens",
  },
  {
    id: "phase-2",
    label: "Phase 2 — Architecture",
    subtitle: "How it is built",
    purpose:
      "At the end of this phase the technical ground is stable: stack, security model, architecture, data, APIs, environments. This is what agents reference when writing code.",
    documents: [
      "01_tech_stack.md — languages and frameworks",
      "02_security.md — threats and auth model",
      "04_principles.md — code conventions",
      "05_architecture.md — modules and boundaries",
      "06_database.md — data model",
      "07_api_contracts.md — API definitions",
      "08_environments.md — dev, staging, production",
    ],
    gate: "05_architecture.md approved → backlog opens",
  },
  {
    id: "phase-3",
    label: "Phase 3 — Backlog",
    subtitle: "What ships and in what order",
    purpose:
      "At the end of this phase there is a structured backlog: epics group the capabilities, versions define releases, sprints scope the work, and user stories are the executable units the agent implements one at a time.",
    documents: [
      "docs/epics/ — product capabilities",
      "docs/versions/ — releases",
      "docs/sprints/ — time-boxed scope",
    ],
    gate: "Epic + version exist → user stories can be created",
  },
  {
    id: "phase-4",
    label: "Phase 4 — Execution",
    subtitle: "Build, record, ship",
    purpose:
      "Each user story is refined, implemented, and closed with evidence. The board reflects what is actually done. One commit per story — code and docs together.",
    documents: [
      "docs/us/ — one story per file, full lifecycle",
      "docs/kanban/board.json — generated from story files",
    ],
  },
]

// ─── Folder structure ─────────────────────────────────────────────────────────

export const folderStructure = {
  title: "What is inside docs/",
  intro: [
    "Two types of files: foundation docs that define the project, and delivery files that track the work. Every agent session reads from here. Everything the project knows lives here.",
    "Monorepos may have several docs/ folders (any path — root docs/, apps/pkg/docs/, etc.). Only folders named exactly docs qualify; docs-extra does not. Optional .meridian/projects.json at kit root declares products. The VS Code extension keeps one active project at a time (saved across sessions); Board and Deliverables show a Project row in the toolbar — name, docs/ path, dropdown to switch.",
  ],
  items: [
    {
      path: "docs/*.md",
      label: "Foundation docs",
      description:
        "Scope, stack, security, architecture, and principles. Written once, updated when things change. The stable ground agents build on.",
    },
    {
      path: "docs/epics/",
      label: "Epics",
      description:
        "Product capabilities — the big things the product can do, written in plain language.",
    },
    {
      path: "docs/versions/",
      label: "Versions",
      description:
        "Releases — what ships together, what the goal is, what done looks like at the release level.",
    },
    {
      path: "docs/sprints/",
      label: "Sprints",
      description:
        "Time-boxed scope within a version. A sprint has one goal and a defined list of stories.",
    },
    {
      path: "docs/us/",
      label: "User stories",
      description:
        "One file per task. Carries the full lifecycle — intent, approach, implementation record, and evidence of completion.",
    },
    {
      path: "docs/decisions/",
      label: "Decision log",
      description:
        "Why things are the way they are. One JSON file per day, entries prepended — a permanent record agents and developers read to understand past choices.",
    },
    {
      path: "docs/kanban/board.json",
      label: "Kanban board (generated)",
      description:
        "Generated from the US files. Never edit by hand. Run /sync-board after changing any US.",
    },
    {
      path: "docs/inventory/",
      label: "As-is inventory (Mode B)",
      description:
        "Transitional map during migration of an existing codebase — docs/inventory/as-is.md. Archive after 05_architecture is approved; not a permanent source of truth.",
    },
    {
      path: ".meridian/projects.json",
      label: "Projects manifest (multi-product)",
      description:
        "Optional at kit root when the repo has several docs/ trees (any path). Declares ids, names, default, exclude. Discovery finds folders named exactly docs; docs-extra never counts. Active choice persists; IDE toolbar shows which docs/ is loaded.",
    },
    {
      path: "docs/templates/",
      label: "Delivery templates",
      description:
        "Human-readable mirror of kit templates (symlinks). Agents read .agent/references/templates/.",
    },
  ],
}

export const docFlowNote =
  "Foundation docs follow a sequence — each one builds on the previous. The backlog (epics, versions, stories) only opens after architecture is approved. The decision log starts on day one and never closes."

// ─── Artifact anatomy ─────────────────────────────────────────────────────────

export const userStoryAnatomy: AnatomyGuide = {
  title: "User Story (US-XXXX)",
  intro:
    "One task, one file. A story travels through its full lifecycle in the same document — from intent to implementation record.",
  fields: [
    { field: "id", meaning: "Permanent identifier — US-0001, US-0042." },
    { field: "title", meaning: "What it delivers, in plain language." },
    { field: "epic", meaning: "Parent epic (EPIC-02)." },
    { field: "version", meaning: "Which release this ships in." },
    { field: "status", meaning: "❌ not started · 🔶 partial · ✅ done · 🧊 frozen" },
    { field: "moscow", meaning: "Priority: Must · Should · Could · Won't" },
    { field: "depends_on", meaning: "Stories that must be ✅ before this one starts." },
    {
      field: "ready",
      meaning:
        "Gate for implementation. Set by /refine-us when the Approach is concrete.",
    },
    {
      field: "done_when",
      meaning: "One observable sentence that proves this story is complete.",
    },
    {
      field: "tests",
      meaning: "required — must be written and pass. none — explicitly no tests.",
    },
    { field: "tests_status", meaning: "pending · done · n/a" },
  ],
  sections: [
    {
      heading: "## Intent",
      description: "What this story does and why it matters.",
      subsections: [
        {
          label: "### Acceptance",
          description: "Verifiable checklist — observable outcomes, not plans.",
        },
        {
          label: "### Why",
          description:
            "What problem this slice solves and what becomes possible after it.",
        },
        {
          label: "### Where",
          description: "Where this story fits in the release and what it unblocks.",
        },
      ],
    },
    {
      heading: "## Plan",
      description: "How it will be built. Written before implementation starts.",
      subsections: [
        {
          label: "### Approach",
          description:
            "What changes, where in the codebase, and why. Required before /refine-us sets ready: true.",
        },
        {
          label: "### Architecture refs",
          description: "Exact section headings from 05_architecture.md.",
        },
        {
          label: "### API / DB",
          description: "Named endpoints or tables affected, or n/a.",
        },
        {
          label: "### Planned",
          description: "Manual test steps and exact test commands.",
        },
      ],
    },
    {
      heading: "## Record",
      description: "What was actually built. Filled on close by /complete-us.",
      subsections: [
        { label: "### Files", description: "Real paths changed." },
        {
          label: "### Executed",
          description: "Test output and the git commit reference.",
        },
      ],
    },
    {
      heading: "## Boundaries",
      description: "Scope control.",
      subsections: [
        {
          label: "### Out of scope",
          description: "What this story explicitly does not do.",
        },
        { label: "### Notes", description: "Links, risks, follow-ups." },
      ],
    },
  ],
  exampleTitle: "US-0017 — Read phase documents in Markdown",
  exampleCode: `---
id: US-0017
title: Read phase documents in Markdown
epic: EPIC-02
version: v1
status: ✅
moscow: Must
ready: true
done_when: User clicks a phase doc and reads its full content inside the app.
tests: required
tests_status: done
---

## Intent

### Acceptance
- [ ] Each phase doc has an Open button
- [ ] Content renders with frontmatter and body visible
- [ ] Works via File System Access API in Chrome/Edge

### Why
The developer needs to review scope and architecture decisions without leaving the monitor.

### Where
Sits in the Setup tab. Unblocks inline editing in a future story.

## Plan

### Approach
- Add a PhaseDocReader component that reads the file and renders Markdown
- Wire the Open button in PhaseStepCard

### Architecture refs
- 05_architecture.md § Monitor — read-only views

### Planned
1. Click Open on 00_scope.md
2. Verify frontmatter and body render correctly

## Record

### Files
- src/features/monitor/components/PhaseDocReader.tsx (new)
- src/features/monitor/components/PhaseStepCard.tsx (modified)

### Executed
All tests pass. git commit: a3f9c1d — feat(monitor): phase doc reader (US-0017)`,
}

export const epicAnatomy: AnatomyGuide = {
  title: "Epic (EPIC-XX)",
  intro:
    "A product capability — something meaningful the product can do. Written in plain language, not in modules or file paths.",
  fields: [
    { field: "id", meaning: "EPIC-01, EPIC-02 — permanent." },
    { field: "title", meaning: "Capability name in plain language." },
    { field: "status", meaning: "active · complete · paused" },
    { field: "versions", meaning: "Which releases this epic ships across." },
    { field: "outcome", meaning: "One sentence: what is true when this epic is done." },
  ],
  sections: [
    {
      heading: "## Capability",
      description: "The user problem and what the product offers after this epic.",
    },
    {
      heading: "## Expected outcome",
      description: "How you recognize this epic is done — an observable signal.",
    },
    {
      heading: "## Out of scope",
      description: "What is deferred, and why.",
    },
  ],
  exampleTitle: "EPIC-02 — Project setup monitor",
  exampleCode: `---
id: EPIC-02
title: Project setup monitor
status: active
versions: [v1]
outcome: Developer opens docs/ and sees the real state of every phase document.
---

## Capability

Today the developer has no visual way to know which foundation documents
are missing or incomplete without opening each file manually.

After this epic, opening docs/ in the monitor shows a Setup view —
each phase document with its current status, what is blocking it,
and a way to read its content inline.

## Expected outcome

Developer opens the app, sees that 05_architecture.md is still in draft,
and knows exactly what to work on next — without running any command.

## Out of scope

- Editing documents from inside the app (planned for a later epic)
- Notifications or alerts outside the monitor`,
}

export const versionAnatomy: AnatomyGuide = {
  title: "Version (vX)",
  intro:
    "A release — what ships together and what done looks like at the release level.",
  fields: [
    { field: "id", meaning: "v0, v1, v2 — sequential." },
    { field: "title", meaning: "Short release name." },
    { field: "status", meaning: "planned · active · complete" },
    {
      field: "outcome",
      meaning: "One sentence: what is true when this release ships.",
    },
  ],
  sections: [
    {
      heading: "## Objective",
      description: "What changes for the user in this release.",
    },
    {
      heading: "## Done criteria",
      description: "The observable condition to close this version.",
    },
    {
      heading: "## Included",
      description: "Epics and stories in this release, with one line per item.",
    },
    {
      heading: "## Go-live checklist",
      description: "What must be true before marking this version complete.",
    },
  ],
  exampleTitle: "v1 — Monitor MVP",
  exampleCode: `---
id: v1
title: Monitor MVP
status: active
outcome: Developer opens docs/ and sees real setup progress, deliverables, and board.
---

## Objective

v1 delivers the core monitor: a read-only view of the docs/ folder.
The developer can track phase document progress, browse epics and stories,
and see the board without leaving the browser.

## Done criteria

Developer opens docs/ in the app and sees Setup, Deliverables, and Board
populated with real data from the project.

## Included

- EPIC-02 — Project setup monitor
- US-0009 through US-0022

## Go-live checklist

- [ ] All Must stories ✅
- [ ] Live demo deployed to GitHub Pages`,
}

export const sprintAnatomy: AnatomyGuide = {
  title: "Sprint (vX-SY)",
  intro:
    "A time-boxed commitment inside a version. One goal, a defined list of stories, a retrospective on close.",
  fields: [
    { field: "id", meaning: "v1-S1, v1-S2 — version + sprint number." },
    { field: "version", meaning: "Parent version." },
    { field: "status", meaning: "planned · active · complete" },
    { field: "goal", meaning: "One sentence: what this sprint proves or delivers." },
    { field: "done_when", meaning: "Observable condition to close the sprint." },
    { field: "stories", meaning: "List of US ids in this sprint." },
  ],
  sections: [
    {
      heading: "## Goal",
      description: "Why this sprint, why now, what changes by the end.",
    },
    {
      heading: "## Scope",
      description: "Stories with status, priority, and dependencies.",
    },
    {
      heading: "## Out of scope for this sprint",
      description: "What is deferred and why — capacity, dependency, or priority.",
    },
    {
      heading: "## Retrospective",
      description:
        "Filled on close. What worked, what to improve, decisions to log. Mandatory — even one line each. Decisions go to docs/decisions/.",
    },
  ],
}

export const decisionLogAnatomy: AnatomyGuide = {
  title: "Decision Log entry",
  intro:
    "Every significant decision lives in docs/decisions/YYYY-MM-DD.json. Entries are prepended and never edited — a permanent record of why the project is the way it is.",
  fields: [
    { field: "date", meaning: "YYYY-MM-DD." },
    { field: "title", meaning: "What was decided, in a phrase." },
    { field: "context", meaning: "The situation that forced a choice." },
    { field: "decision", meaning: "What was decided — specific and unambiguous." },
    { field: "consequences", meaning: "What is now true, what becomes harder." },
  ],
  exampleTitle: "Switching from REST to file-based state",
  exampleCode: `{
  "date": "2025-03-12",
  "title": "Use File System Access API instead of a backend",
  "context": "We considered a lightweight Express server to read docs/ files, but it would require users to run a local process and manage ports.",
  "decision": "Use the browser File System Access API to read docs/ directly. The app stays fully static — no server, no build step for users.",
  "consequences": "App works only in Chrome and Edge on localhost. Safari and Firefox are not supported. No backend to maintain."
}`,
}

// ─── Epics / versions / stories — table ──────────────────────────────────────

export type DeliveryArtifact = {
  id: string
  artifact: string
  question: string
  description: string
  path: string
}

export const deliveryArtifacts: DeliveryArtifact[] = [
  {
    id: "epic",
    artifact: "Epic",
    question: "What can the product do?",
    description:
      "A capability written in plain language. Stays high-level — no file paths, no technical detail. Groups the user stories that together deliver this capability.",
    path: "docs/epics/",
  },
  {
    id: "version",
    artifact: "Version",
    question: "What ships in this release?",
    description:
      "A release package. Defines the goal, which epics are in scope, and what done looks like at the release level. One version per go-live.",
    path: "docs/versions/",
  },
  {
    id: "sprint",
    artifact: "Sprint",
    question: "What are we tackling right now?",
    description:
      "A time-boxed commitment inside a version. One goal, a defined list of stories. Optional — but useful when you want a clear boundary for each work cycle.",
    path: "docs/sprints/",
  },
  {
    id: "story",
    artifact: "User story",
    question: "What is the next concrete thing to build?",
    description:
      "One task, one file. Carries the full lifecycle: intent, approach, implementation record, and evidence of completion. The agent implements from this file.",
    path: "docs/us/",
  },
]

export const deliveryArtifactsNote =
  "Creation order: epic → version → sprint → story. A story needs its epic and version to exist first."

// ─── Status guide ─────────────────────────────────────────────────────────────

export const statusGuide = {
  title: "Status reference",
  documentStatuses: [
    { label: "draft", meaning: "Being written — not yet ready for human review." },
    {
      label: "review",
      meaning: "Ready for human review — agent proposes, you decide.",
    },
    {
      label: "approved",
      meaning:
        "Human has reviewed and approved — unlocks dependents. Only you set this.",
    },
  ],
  epicStatuses: [
    { label: "active", meaning: "Capability in delivery — US can be created." },
    { label: "complete", meaning: "Outcome reached at product level." },
    { label: "paused", meaning: "Intentionally frozen — outside the current flow." },
  ],
  versionStatuses: [
    { label: "planned", meaning: "Defined, not yet started." },
    { label: "active", meaning: "Release in progress — sprints and US active." },
    { label: "complete", meaning: "Go-live for this release completed." },
  ],
  sprintStatuses: [
    { label: "planned", meaning: "Defined, not yet started." },
    {
      label: "active",
      meaning: "In progress — one sprint active per version at a time.",
    },
    { label: "complete", meaning: "Done — Retrospective filled." },
  ],
  storyStatuses: [
    { emoji: "❌", label: "Pending", meaning: "Not started or not finished." },
    {
      emoji: "🔶",
      label: "In progress",
      meaning:
        "Partially done. Acceptance must include Missing: explaining what is missing.",
    },
    {
      emoji: "✅",
      label: "Done",
      meaning: "Acceptance criteria and tests evidenced in the files.",
    },
    {
      emoji: "🧪",
      label: "Waiting for tests",
      meaning: "Board column when tests: required and tests_status: pending.",
    },
    {
      emoji: "🧊",
      label: "Frozen",
      meaning: "Intentionally paused — not part of the current flow.",
    },
  ],
  kanbanNote:
    "The board derives 🧪 from tests_status: pending. board.json is generated from US files — never edit it. Run /sync-board after any US change.",
}

// ─── Usage guide intro + situations ───────────────────────────────────────────

export type UsageGuideSection = {
  id: string
  title: string
  subtitle: string
  defaultOpen?: boolean
  steps: DailyWorkflowStep[]
}

export const usageGuideIntro = {
  title: "Commands",
  lead: "How to run the experiment day to day — from first /init-meridian to closing a story.",
  paragraphs: [
    "Concepts (epic, ready, Record) are on the Learn tab.",
    "Anytime in the IDE: /status — blockers, state, and suggested next step.",
    "After /complete-us and /sync-board, commit in Git before the next story — unless you batch commits on purpose.",
  ],
}

export const usageSituations = [
  {
    situation: "No docs/ folder yet",
    section: "Getting started",
    sectionId: "start",
    command: "/init-meridian",
  },
  {
    situation: "Existing codebase, no docs/",
    section: "Getting started",
    sectionId: "start",
    command: "/init-meridian",
  },
  {
    situation: "docs/ exists, phase docs incomplete",
    section: "Work through the phase documents",
    sectionId: "document",
    command: "/status",
  },
  {
    situation: "Architecture approved, no backlog yet",
    section: "Build the backlog",
    sectionId: "backlog",
    command: "/create-epic",
  },
  {
    situation: "Backlog exists, ready to implement",
    section: "Implement a user story",
    sectionId: "implement",
    command: "/implement-us",
  },
  {
    situation: "Monorepo with several docs/ trees",
    section: "Multiple Meridian projects",
    sectionId: "multi-project",
    command: "/status",
  },
  {
    situation: "Implementation done, not recorded",
    section: "Close a user story",
    sectionId: "complete-us",
    command: "/complete-us",
  },
  {
    situation: "US is ✅ in docs — confirm /sync-board, then git commit",
    section: "Close a user story",
    sectionId: "complete-us",
    command: "/sync-board",
  },
]

// ─── Usage guide sections ─────────────────────────────────────────────────────

export const gettingStartedSteps: DailyWorkflowStep[] = [
  {
    id: "new-project",
    title: "Start a new project",
    when: "No docs/ folder yet.",
    actions: [
      "Run /init-meridian in the IDE.",
      "The agent asks up to 5 questions: problem, users, scope, technology, security constraints.",
      "Answer what you know — leave gaps for later.",
      "docs/ is created with all phase document stubs and 00_scope.md populated from your answers.",
    ],
    commands: ["/init-meridian"],
    tip: "After this, go to Work through the phase documents.",
  },
  {
    id: "existing-project",
    title: "Migrate an existing project",
    when: "Code exists but no docs/ folder.",
    actions: [
      "Open your codebase in the IDE and run /init-meridian.",
      "The agent reads the code first — package files, folder structure, README, any existing docs.",
      "It creates docs/inventory/as-is.md — a transitional table of existing capabilities (evidence, confidence, epic candidates).",
      "Phase documents are populated from inventory + observations — every inference is marked as an assumption.",
      "Review the inventory, then docs/00_scope.md and docs/05_architecture.md — promote validated rows; archive inventory after architecture is approved.",
      "Create epics for major existing capabilities (optional v0 baseline). No retroactive user stories with ✅ — forward work only in v1+.",
    ],
    commands: ["/init-meridian"],
  },
  {
    id: "resume",
    title: "Resume after time away",
    when: "Returning to an existing project.",
    actions: [
      "Open the project root in the IDE (where .agent/ and docs/ live).",
      "Run /status — blockers, current state, and suggested next action.",
      "Open the docs/ folder in this app to see visual progress.",
    ],
    commands: ["/status"],
  },
]

export const documentWorkflowSteps: DailyWorkflowStep[] = [
  {
    id: "doc-order",
    title: "Work through documents in order",
    when: "Phase docs are incomplete or in draft.",
    actions: [
      "Check Setup tab or run /status to see which document is next and what is blocking it.",
      "One file per conversation — do not mix documents.",
      "Ask the agent to draft, fill gaps, or review a specific section.",
    ],
    commands: ["/status"],
  },
  {
    id: "doc-commands",
    title: "Use specialized commands",
    when: "Target document identified.",
    actions: [
      "/architecture — draft or review 05_architecture.md.",
      "/security-pass — draft or review 02_security.md.",
      "For any other doc, open it and ask the agent to work on it directly.",
      "Significant decision made? Log it with /update-decisions-log (real clock via date command).",
    ],
    commands: ["/architecture", "/security-pass"],
  },
  {
    id: "doc-approve",
    title: "You approve in frontmatter",
    when: "You have reviewed the content — the agent never sets approved on its own.",
    actions: [
      "Set status: draft → review in the file YAML when content is ready for your review.",
      "Set status: review → approved after your review.",
      "Check whether the next document in the sequence became unblocked in Setup.",
      "Gate: 05_architecture.md approved unlocks the backlog.",
    ],
  },
]

export const backlogWorkflowSteps: DailyWorkflowStep[] = [
  {
    id: "backlog-gate",
    title: "Confirm the gate is open",
    when: "Before creating any epic, version, or US.",
    actions: [
      "05_architecture.md must be approved (Setup tab or /status).",
      "If it is not, finish the phase documents first.",
    ],
    commands: ["/status"],
  },
  {
    id: "backlog-epic",
    title: "Create epics",
    when: "Architecture approved — define what capabilities the product will have.",
    actions: [
      "Run /create-epic for each major product capability.",
      "Write in user language — what the user can do, not what the code does.",
      "An epic can ship across multiple versions. You decide that when creating versions.",
    ],
    commands: ["/create-epic"],
  },
  {
    id: "backlog-version",
    title: "Create a version",
    when: "Epics exist — define what goes live in the next release.",
    actions: [
      "Run /create-version to define a release (v1, v2, …).",
      "A version groups epics into a deliverable milestone — what ships together.",
      "Set the objective, done criteria, and which epics are included.",
    ],
    commands: ["/create-version"],
  },
  {
    id: "backlog-sprint",
    title: "Plan a sprint",
    when: "Version exists and you are ready to start work — optional but recommended.",
    actions: [
      "Run /plan-sprint to create a sprint inside the current version (e.g. v1-S1).",
      "A sprint is not a planning artifact — it is a commitment: which specific US to tackle, in what order, done by when.",
      "Each sprint has one goal. Choose US that together prove or deliver that goal.",
      "One sprint active per version at a time. Close with /complete-sprint vX-SY (Retrospective filled) before opening the next.",
    ],
    commands: ["/plan-sprint"],
    tip: "Sprints are optional. If you prefer a continuous flow, work directly from the Board without them.",
  },
  {
    id: "backlog-bugs-spikes",
    title: "Bugs and spikes (no extra folders)",
    when: "Correction work or investigation before estimating implementation.",
    actions: [
      "Bug in production: /create-us with fix acceptance; prioritize with MoSCoW and version (e.g. patch release).",
      "Bug found while implementing: fix in the current US; record in ## Record on close.",
      "Spike: US with timebox in Notes, tests: none, outcome in docs/decisions/ — not a docs/spikes/ folder.",
      "See .agent/references/scrum-meridian-map.md in the kit.",
    ],
  },
  {
    id: "backlog-us",
    title: "Create and refine user stories",
    when: "Epic and version exist — create the executable tasks.",
    actions: [
      "/create-us — creates the story with Intent (Why + Where) filled. ready: false.",
      "/review-us US-XXXX — optional quality audit before refining. Read-only, no changes.",
      "/refine-us US-XXXX — writes the Approach, sets architecture refs, concrete tests. Sets ready: true when checklist passes.",
      "A story without ready: true cannot be implemented.",
      "Run /sync-board after any US change.",
    ],
    commands: ["/create-us", "/review-us", "/refine-us", "/sync-board"],
  },
]

export const multiProjectWorkflowSteps: DailyWorkflowStep[] = [
  {
    id: "multi-declare",
    title: "Declare products (optional manifest)",
    when: "Repo has more than one folder named docs with Meridian content.",
    actions: [
      "Create .meridian/projects.json at kit root (see projects-manifest-template.md) — ids, names, default, exclude.",
      "Discovery still finds unnamed docs/ trees; manifest adds friendly names and default.",
      "Only folders named exactly docs count — not docs-extra.",
    ],
    commands: ["/status"],
  },
  {
    id: "multi-ide",
    title: "Pick and see active project in the IDE",
    when: "Using Meridian Harness extension with several docs/ trees.",
    actions: [
      "First visit with N>1: Quick Pick once — then choice is saved.",
      "Board and Deliverables: first toolbar row Project shows name, docs/ path, US count.",
      "Switch: dropdown in toolbar, Meridian: Select Active Project, or status bar.",
      "Reopening Board keeps the same project — no repeat picker.",
      "Validate and agents target the active package folder, not always repo root.",
    ],
    commands: ["/status"],
    tip: "Run validate_meridian.py on the folder that owns docs/ (e.g. apps/pkg), not the monorepo root.",
  },
]

export const implementWorkflowSteps: DailyWorkflowStep[] = [
  {
    id: "pick-us",
    title: "Choose the story",
    when: "There is a Must story with ready: true and no pending depends_on.",
    actions: [
      "Board tab or /status — prefer unblocked Must (❌ or 🔶).",
      "One US per implementation session. Do not mix stories in one conversation.",
    ],
    commands: ["/status"],
  },
  {
    id: "implement",
    title: "Run /implement-us",
    when: "US has ready: true (after /refine-us).",
    actions: [
      "Command: /implement-us US-XXXX — gate checks ready, Plan, depends_on, then codes.",
      "If blocked: run /refine-us US-XXXX first.",
      "One US per session; agent reads Architecture refs before Write on code.",
    ],
    commands: ["/implement-us US-XXXX"],
    tip: "Do not skip the gate — P0 requires ready: true before product code.",
  },
  {
    id: "review-diff",
    title: "Review the output",
    when: "Agent delivered a diff.",
    actions: [
      "Review the code in the IDE; run build and tests.",
      "If partially complete: mark status: 🔶 with Missing: in Acceptance. Do not use /complete-us yet.",
      "If complete with evidence: go to Close a user story.",
    ],
  },
]

export const completeUsWorkflowSteps: DailyWorkflowStep[] = [
  {
    id: "complete-gate",
    title: "Check preconditions",
    when: "Before /complete-us — implementation already reviewed by you.",
    actions: [
      "All depends_on stories are ✅.",
      "Acceptance criteria are verifiable with evidence — not just 'it works'.",
      "If tests: required — tests have been run and passed.",
    ],
    tip: "If something fails, do not force ✅. Use 🔶 and Missing: in Acceptance.",
  },
  {
    id: "complete-run",
    title: "Run /complete-us",
    when: "Gates ok — best in a conversation focused only on closing.",
    actions: [
      "Command: /complete-us US-XXXX",
      "The agent fills ## Record — real file paths, layer summary, executed test output.",
      "Acceptance items checked [x]. Frontmatter: status ✅, tests_status: done.",
      "Cross-cutting decision → /update-decisions-log (agent runs date +%Y-%m-%d and date +%H:%M before Write).",
    ],
    commands: ["/complete-us US-XXXX"],
  },
  {
    id: "complete-board",
    title: "Update board and verify",
    when: "Immediately after /complete-us.",
    actions: [
      "Run /sync-board to regenerate board.json.",
      "Board tab: US in the correct column (✅, 🔶, or 🧪).",
      "Does Record match what you tested? If not, fix it before continuing.",
    ],
    commands: ["/sync-board"],
  },
  {
    id: "complete-commit",
    title: "Commit to git (you)",
    when: "After /complete-us and /sync-board for this US — before the next story.",
    actions: [
      "Review git diff: scope must match ### Files in the Record (one US per commit).",
      "Use suggested commit from ### Executed if the agent wrote it, or feat(app-desktop): summary (US-XXXX).",
      "Pre-commit must pass (lint-staged). Run validate_meridian.py if docs/ changed.",
      "Ask the agent to commit only if you explicitly want it — default is you run git commit.",
      "After commit, add under ### Executed: git commit: <sha> — <subject> (optional but recommended; US stays ✅ without it).",
    ],
    tip: "Meridian ✅ closes the story in docs; git commit is the repository snapshot of the same slice.",
  },
]

export const usageGuideSections: UsageGuideSection[] = [
  {
    id: "start",
    title: "Getting started",
    subtitle: "New project, migration, or resuming after time away.",
    defaultOpen: true,
    steps: gettingStartedSteps,
  },
  {
    id: "document",
    title: "Work through the phase documents",
    subtitle:
      "Foundation → architecture → technical detail. Gate: 05_architecture approved.",
    steps: documentWorkflowSteps,
  },
  {
    id: "backlog",
    title: "Build the backlog",
    subtitle: "Epic → version → sprint → user stories.",
    steps: backlogWorkflowSteps,
  },
  {
    id: "multi-project",
    title: "Multiple Meridian projects",
    subtitle: "Monorepo — several docs/ trees, one active at a time.",
    steps: multiProjectWorkflowSteps,
  },
  {
    id: "implement",
    title: "Implement a user story",
    subtitle: "Choose a ready story, implement against Acceptance, review the diff.",
    steps: implementWorkflowSteps,
  },
  {
    id: "complete-us",
    title: "Close a user story",
    subtitle: "Record delivery in files, sync board, then commit (you).",
    steps: completeUsWorkflowSteps,
  },
]

// ─── Slash command reference (grouped) ────────────────────────────────────────

export type SlashCommandGroup = {
  group: string
  description: string
  commands: SlashCommandHint[]
}

export const slashCommandGroups: SlashCommandGroup[] = [
  {
    group: "Start",
    description: "First time or resuming",
    commands: [
      {
        command: "/init-meridian",
        when: "Create docs/ structure — new project or existing codebase migration",
      },
      {
        command: "/status",
        when: "Check blockers, current state, and suggested next action",
      },
    ],
  },
  {
    group: "Document",
    description: "Build and approve phase docs",
    commands: [
      { command: "/architecture", when: "Draft or review 05_architecture.md" },
      { command: "/security-pass", when: "Draft or review 02_security.md" },
      {
        command: "/update-decisions-log",
        when: "Prepend decision — agent runs date +%Y-%m-%d and date +%H:%M before Write",
      },
    ],
  },
  {
    group: "Plan",
    description: "Define what will be built",
    commands: [
      {
        command: "/create-epic",
        when: "New product capability — written in user language",
      },
      {
        command: "/create-version",
        when: "New release that groups epics into a deliverable milestone",
      },
      {
        command: "/plan-sprint",
        when: "New sprint inside a version — choose which US to tackle now",
      },
      {
        command: "/complete-sprint",
        when: "Close sprint — retrospective filled, status complete",
        example: "/complete-sprint v1-S1",
      },
    ],
  },
  {
    group: "Work",
    description: "Create, refine, implement, and close stories",
    commands: [
      {
        command: "/create-us",
        when: "New user story — gates: architecture approved + epic + version exist",
      },
      {
        command: "/review-us",
        when: "Quality audit — read-only, no changes, no ready flag",
        example: "/review-us US-0017",
      },
      {
        command: "/refine-us",
        when: "Deepen Plan and Approach — sets ready: true when checklist passes",
        example: "/refine-us US-0017",
      },
      {
        command: "/implement-us",
        when: "Gate + implement — requires ready: true; blocks if refine skipped",
        example: "/implement-us US-0017",
      },
      {
        command: "/complete-us",
        when: "Close story — fills Record, marks ✅; then you commit (see Close section)",
        example: "/complete-us US-0017",
      },
      {
        command: "/sync-board",
        when: "Regenerate docs/kanban/board.json from US files",
      },
    ],
  },
  {
    group: "Session",
    description: "Full loop shortcut",
    commands: [
      {
        command: "/daily-with-ai",
        when: "Guided session — status, refine, implement, close, sync board, commit (you)",
      },
    ],
  },
]

// Flat list kept for any component that still needs it
export const slashCommandReference: SlashCommandHint[] = slashCommandGroups.flatMap(
  (g) => g.commands,
)

// ─── Anti-patterns ────────────────────────────────────────────────────────────

export const usageAntiPatterns = [
  "Asking the agent to implement without /implement-us or ready: true.",
  "Implementing when ready is false — run /refine-us first.",
  "Marking ✅ in chat without running /complete-us in the files.",
  "Editing board.json directly — it is always generated.",
  "Creating US before 05_architecture.md is approved.",
  "Mixing document work, backlog work, and implementation in one conversation.",
  "Setting approved on a document you did not read.",
  "Using status: ✅ without a filled ## Record.",
  "Closing a US with /complete-us and starting the next story without committing the closed slice (unless you batch commits intentionally).",
  "Letting the agent git commit without your explicit request.",
  "Adding story points or velocity fields — Meridian uses MoSCoW, depends_on, and sprint story order instead.",
  "Creating docs/tasks/ or docs/bugs/ — use Plan/Planned and correction US files.",
]

// ─── Validate hint ────────────────────────────────────────────────────────────

export const validateProjectHint = {
  title: "Validate Meridian structure",
  command: "python3 .agent/scripts/validate_meridian.py <project-folder>",
  note: "Run at the project root. Append --json for machine-readable output. Fix errors before creating US or marking docs approved.",
}

// ─── Monitor tabs ─────────────────────────────────────────────────────────────

export const appIntro = {
  title: "What each tab in this app shows",
  paragraphs: [
    "After opening the docs/ folder, use the tabs to navigate. They read the same files you edit in the IDE. Nothing is duplicated in a database.",
  ],
}

export const monitorTabsGuide = [
  {
    label: "Learn",
    hint: "Harness concepts, loop, Scrum map, and artifact reference. Available without an open folder.",
  },
  {
    label: "Commands",
    hint: "Day-to-day in the IDE — /init-meridian, /status, /complete-us…",
  },
  {
    label: "Setup",
    hint: "Phase documents 00–11 — what is left to approve before the backlog.",
  },
  {
    label: "Deliverables",
    hint: "Epics and versions for the product.",
  },
  {
    label: "Board",
    hint: "Kanban derived from user stories.",
  },
]

// ─── Next steps ───────────────────────────────────────────────────────────────

export const nextStepsAfterConcepts = {
  title: "Ready to start?",
  paragraphs: [
    "Go to the Commands tab for step-by-step instructions and slash commands for your current situation.",
    "Run /init-meridian in your IDE to create docs/ — new project or existing codebase migration.",
    "Open your repository's docs/ folder on the home screen to see Setup, Deliverables, and Board with real data.",
    "Coming from Scrum? Read the Scrum and Meridian section above, then .agent/references/scrum-meridian-map.md in the repo for the full map and Mermaid diagram.",
  ],
}

// ─── Phase doc descriptions (used by Setup view) ──────────────────────────────

const phaseGroupIntro: Record<string, string> = {
  "Phase 0":
    "Sequential foundation: understand the project, stack, security, and users before any delivery.",
  "Phase 1": "Code principles: conventions before designing the system.",
  "Phase 2": "Architecture: apps, modules, boundaries. Gate for the backlog.",
  "Phase 3": "Technical details: database, API contracts, and environments.",
  Delivery:
    "Backlog in epics/, versions/, and sprints/ folders — only after 05_architecture is approved.",
  Continuous:
    "Permanent decision record. Whenever something relevant changes, add an entry (never delete).",
}

const phaseDocDescriptions: Record<string, string> = {
  "00_scope": "What the product is and is not — problem, scope, in/out, risks.",
  "01_tech_stack": "Languages, frameworks, infrastructure, and rationale for choices.",
  "02_security": "Threats, sensitive data, auth model, OWASP, compliance posture.",
  "03_user_types": "Who uses the product and what each profile needs.",
  "04_principles": "Code quality and design conventions.",
  "05_architecture": "How the system is divided — apps, modules, services, boundaries.",
  "06_database": "Data model, schema, and migration strategy.",
  "07_api_contracts": "Contracts between services and external APIs.",
  "08_environments": "Local, staging, and production environment definitions.",
  "11_decisions":
    "Decision log index. Entries in docs/decisions/YYYY-MM-DD.json — prepend, never edit.",
}

export const phaseDocuments = PHASE_DOC_IDS.map((id) => ({
  id,
  phase: phaseLabelForDocId(id),
  phaseIntro: phaseGroupIntro[phaseLabelForDocId(id)] ?? "",
  description: phaseDocDescriptions[id] ?? "",
}))
