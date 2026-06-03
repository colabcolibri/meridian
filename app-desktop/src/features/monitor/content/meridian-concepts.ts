import { PHASE_DOC_IDS } from "@/domain/meridian/phase-doc-files"
import { phaseLabelForDocId } from "@/domain/meridian/doc-refs"

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

export type AnatomyGuide = {
  title: string
  intro: string
  fields: AnatomyField[]
  sections?: { heading: string; description: string }[]
  exampleTitle?: string
  exampleBody?: string
}

// ─── Intro ────────────────────────────────────────────────────────────────────

export const meridianIntro = {
  title: "What is Meridian",
  paragraphs: [
    "Meridian is a protocol for building software with AI. The core idea is simple: documentation comes before code. You define what the product is, who it is for, and how it should work — then the AI implements it, guided by those files.",
    "Without this, AI agents hallucinate scope, repeat decisions already made, and produce code that does not match what the team actually agreed on. Meridian solves that by making documentation the source of truth that both humans and agents read.",
    "It is not Jira, it is not Notion, and it does not require a login. The source of truth is the files in your repository. This app reads those files and shows progress visually.",
  ],
}

// ─── Core principles ─────────────────────────────────────────────────────────

export const corePrinciples: ConceptBlock[] = [
  {
    id: "docs-first",
    title: "Documentation before code",
    summary:
      "Scope, architecture, and acceptance criteria come first. Code implements documentation, not the other way around.",
  },
  {
    id: "human-manager",
    title: "You approve, agents execute",
    summary:
      "AI can write and review, but scope changes, approved status, and ✅ only happen with your validation. The agent never sets approved on its own.",
  },
  {
    id: "audit-status",
    title: "Done = evidence",
    summary:
      "Compiling is not enough. ✅ requires Acceptance and tests evidenced in the files. Use /complete-us after reviewing. 🔶 requires explicit Missing:.",
  },
  {
    id: "refine-before-code",
    title: "Refine before code",
    summary:
      "/create-us fills Intent and drafts Plan (ready: false). /refine-us writes the Approach and sets ready: true. No product code until then.",
  },
  {
    id: "derived-board",
    title: "Derived board",
    summary:
      "board.json is generated from the US files. Edit docs/us/*.md — not the JSON — as the status source of truth.",
  },
]

// ─── Journey phases ───────────────────────────────────────────────────────────

export const journeyPhases: JourneyPhase[] = [
  {
    id: "phase-1",
    label: "Phase 1 — Project definition",
    subtitle: "What the product is and who it is for",
    purpose:
      "Before writing any code, define what the project is. This is not technical work — it is about identity, purpose, and audience. The agent interviews you (or reads your codebase if migrating) and produces the foundation documents.",
    documents: [
      "11_decisions.md — decision log rules (stub)",
      "docs/decisions/YYYY-MM-DD.json — structured decision log from day one",
      "00_scope.md — what the product is and is not",
      "03_user_types.md — who uses it and how they relate to each other",
    ],
    gate: "00_scope.md approved → unlocks Phase 2",
  },
  {
    id: "phase-2",
    label: "Phase 2 — Structure definition",
    subtitle: "How the product is built",
    purpose:
      "Once you know what the product is, define how it is built. Technology choices, security model, architecture, database, API contracts, environments.",
    documents: [
      "01_tech_stack.md — languages, frameworks, infrastructure",
      "02_security.md — threats, sensitive data, auth model, compliance posture",
      "04_principles.md — code quality and design conventions",
      "05_architecture.md — how the system is divided into modules and services",
      "06_database.md — data model and migrations",
      "07_api_contracts.md — API definitions",
      "08_environments.md — dev, staging, production",
    ],
    gate: "05_architecture.md approved → unlocks Phase 3",
  },
  {
    id: "phase-3",
    label: "Phase 3 — Backlog definition",
    subtitle: "What will be built and in what order",
    purpose:
      "With the architecture approved, define what will be built: epics (capabilities), versions (releases), sprints (time boxes), and user stories (executable tasks).",
    documents: [
      "docs/epics/EPIC-XX.md — product capability",
      "docs/versions/vX.md — release goal and scope",
      "docs/sprints/vX-SY.md — time-boxed unit within a version",
    ],
    gate: "Epic and version exist → US can be created",
    note: "Usual creation order: epic → version → sprint → US.",
  },
  {
    id: "phase-4",
    label: "Phase 4 — Execution",
    subtitle: "Implement, record, close",
    purpose:
      "The AI implements each user story, guided by the files from Phase 3. You review the code, then close the story with evidence. The board reflects reality.",
    documents: [
      "docs/us/US-XXXX.md — one executable task per file",
      "docs/kanban/board.json — generated status summary (never edit by hand)",
    ],
    note: "/create-us → /refine-us → implement → /complete-us → /sync-board → commit (you). No code without ready: true. No ✅ without evidence in the Record. Agents suggest commit message on close; they do not commit unless you ask.",
  },
]

// ─── Folder structure ─────────────────────────────────────────────────────────

export const folderStructure = {
  title: "What is inside docs/",
  intro: [
    "Every Meridian project has a docs/ folder at the root. That is the folder you open in this app. Its content is split between phase documents at the docs/ root and delivery folders:",
  ],
  items: [
    {
      path: "docs/*.md",
      label: "Phase documents (00–08, 11)",
      description:
        "Foundation (00–03), principles (04), architecture (05), technical detail (06–08), decision log index (11). Delivery lives in epics/, versions/, sprints/, and us/ folders.",
    },
    {
      path: "docs/epics/EPIC-XX.md",
      label: "Epics — product capabilities",
      description:
        "One file per epic. Defines a large product capability in user language. Only created after 05_architecture is approved.",
    },
    {
      path: "docs/versions/vX.md",
      label: "Versions — releases",
      description:
        "One file per release (v0, v1, v2…). Release goal, scope, done criteria, and go-live checklist.",
    },
    {
      path: "docs/sprints/vX-SY.md",
      label: "Sprints — time boxes",
      description:
        "Time-boxed delivery units within a version. Each sprint has a single goal and a list of US in frontmatter.",
    },
    {
      path: "docs/us/US-XXXX.md",
      label: "User stories — executable tasks",
      description:
        "One file per task. Only after 05_architecture is approved and epic/version exist. Lifecycle: create → refine → implement → complete.",
    },
    {
      path: "docs/decisions/YYYY-MM-DD.json",
      label: "Decision log",
      description:
        "One JSON file per day. Entries array, newest first — never edited, only prepended. Records why the system is the way it is.",
    },
    {
      path: "docs/kanban/board.json",
      label: "Kanban board (generated)",
      description:
        "Generated from the US files. Never edit by hand. Run /sync-board after changing any US.",
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
  "Dependencies: 00–03 in sequence; 04_principles before 05_architecture; 06–08 after 05 (06 before 07). Decision log starts day one. Epics, versions, and US only after 05_architecture is approved."

// ─── Artifact anatomy ─────────────────────────────────────────────────────────

export const userStoryAnatomy: AnatomyGuide = {
  title: "Anatomy of a User Story (US-XXXX)",
  intro:
    "A user story is not a ticket title. It is a complete document that travels through the full lifecycle — from intent to implementation record. Open any file in docs/us/ to see it.",
  fields: [
    {
      field: "id",
      meaning: "Permanent identifier — US-0001, US-0042. Never changes after creation.",
    },
    {
      field: "title",
      meaning: "Short name for the story — what it delivers, not how.",
    },
    {
      field: "epic",
      meaning:
        "Reference to the parent epic (EPIC-02). Frontmatter only — never paste epic text into the body.",
    },
    { field: "version", meaning: "Which release this story ships in (v1)." },
    {
      field: "status",
      meaning:
        "❌ not started · 🔶 partial (requires Missing: in Acceptance) · ✅ done · 🧊 frozen",
    },
    { field: "moscow", meaning: "Priority: Must · Should · Could · Won't" },
    {
      field: "depends_on",
      meaning: "List of US ids that must be ✅ before this one can be implemented.",
    },
    {
      field: "ready",
      meaning:
        "false after /create-us. true only after /refine-us passes all checks. Gate for implementation.",
    },
    {
      field: "done_when",
      meaning:
        "One measurable sentence — the observable condition that proves this story is complete.",
    },
    {
      field: "tests",
      meaning:
        "required — tests must be written and pass. none — explicitly no tests (document why).",
    },
    {
      field: "tests_status",
      meaning:
        "pending · done · n/a (only when tests: none). Board shows 🧪 when pending + required.",
    },
  ],
  sections: [
    {
      heading: "## Intent — what and why",
      description:
        "Acceptance: verifiable checklist — observable outcomes, not plans. Why: 2–4 sentences explaining what problem this slice solves and what the user can do after this US alone. Where: 2–4 sentences on where this story sits in the release and what it unblocks.",
    },
    {
      heading: "## Plan — how it will be built",
      description:
        "Approach: optional at create, required at refine — minimum 2 bullets explaining what changes, where in the codebase, and why. Architecture refs: exact section headings from 05_architecture.md. API / DB impact: named endpoints, tables, or n/a with a short explanation. Security notes: auth checks, data exposure risks, or n/a with reason. Planned: numbered manual steps and/or exact test commands.",
    },
    {
      heading: "## Record — what was actually done",
      description:
        "Filled only on close (/complete-us). Files: real paths changed. Backend / Frontend / Scripts / Docs: summary by layer. Executed: test output, suggested commit on close, optional git commit line (SHA + message) after you commit — omit git commit until then.",
    },
    {
      heading: "## Boundaries — scope control",
      description:
        "Out of scope for this story: what this US explicitly does not do. Prevents scope creep during implementation. Notes: links, risks, follow-ups.",
    },
  ],
  exampleTitle: "US-0017 — Read phase documents in Markdown",
  exampleBody:
    "As the process manager, I want to open each phase document inside the app, so I can review scope and architecture without leaving the monitor. Acceptance: button on each doc, reading via File System Access API, visible frontmatter + body.",
}

export const epicAnatomy: AnatomyGuide = {
  title: "Anatomy of an Epic (EPIC-XX)",
  intro:
    "An epic is a product capability — a meaningful thing the product can do. It is written in user language, not in modules or file paths. Open docs/epics/EPIC-XX.md to see it.",
  fields: [
    { field: "id", meaning: "Permanent identifier — EPIC-01, EPIC-02." },
    { field: "title", meaning: "Short capability name in user language." },
    {
      field: "status",
      meaning:
        "active — delivery in progress · complete — outcome reached · paused — frozen",
    },
    {
      field: "versions",
      meaning:
        "Which releases this epic ships across ([v1], [v1, v2]). An epic can span multiple releases.",
    },
    {
      field: "profiles",
      meaning: "User types from 03_user_types.md that this epic serves.",
    },
    {
      field: "outcome",
      meaning:
        "One sentence: what is true at the product level when this epic is done.",
    },
  ],
  sections: [
    {
      heading: "## Capability",
      description:
        "Minimum two paragraphs — no bullet lists. Paragraph 1: the user problem today. Paragraph 2: what the product offers after this epic, in user language.",
    },
    {
      heading: "## Expected outcome",
      description:
        "One paragraph. How a manager or user recognizes the epic is done — an observable signal, not 'all US ✅'.",
    },
    {
      heading: "## Out of scope for this epic",
      description:
        "Bullets with rationale — what belongs in another epic, a later version, or is explicitly deferred. Each line explains why.",
    },
    {
      heading: "## Notes",
      description:
        "Optional. Decisions, risks, links — only when they add context not already in the body.",
    },
  ],
  exampleTitle: "EPIC-02 — Initial setup monitor",
  exampleBody:
    "Outcome: manager opens docs/, sees progress for the 10 phase documents, and reads each .md inline. US-0017 and US-0018 reference epic: EPIC-02 in frontmatter without repeating this text.",
}

export const versionAnatomy: AnatomyGuide = {
  title: "Anatomy of a Version (vX)",
  intro:
    "A version is a release — a go-live package. It defines what changes for the user in a specific delivery, and what the observable done condition is at the release level. Open docs/versions/vX.md to see it.",
  fields: [
    { field: "id", meaning: "v0, v1, v2 — sequential." },
    { field: "title", meaning: "Short release name describing the theme." },
    { field: "status", meaning: "planned · active · complete" },
    {
      field: "outcome",
      meaning:
        "One sentence: what is true at the product level when this release ships.",
    },
  ],
  sections: [
    {
      heading: "## Objective",
      description:
        "One paragraph. What changes for the user or manager in this release — the theme, the main capabilities, how it differs from the previous version. Not a list of tickets.",
    },
    {
      heading: "## Done criteria",
      description:
        "One paragraph. The observable condition to close this version — who validates, what they can do, what must be true in docs and product.",
    },
    {
      heading: "## Included in this version",
      description: "Epics and US by id, one line each explaining why they belong here.",
    },
    {
      heading: "## Explicitly out",
      description: "Bullets with rationale — what waits for a later version and why.",
    },
    {
      heading: "## Go-live checklist",
      description: "Items that must be true before the version is marked complete.",
    },
    {
      heading: "## Sprints",
      description: "List of sprint ids and their theme.",
    },
  ],
  exampleTitle: "v1 — Folder Monitor MVP",
  exampleBody:
    "Outcome: user opens docs/, tabs reflect real .md files. US-0009 to US-0022 use version: v1. Sprints v1-S1 and v1-S2 in docs/sprints/.",
}

export const sprintAnatomy: AnatomyGuide = {
  title: "Anatomy of a Sprint (vX-SY)",
  intro:
    "A sprint is a time-boxed unit within a version. It has a single goal, a defined scope, and a retrospective on close. It is not a bucket for whatever is left. Open docs/sprints/vX-SY.md to see it.",
  fields: [
    {
      field: "id",
      meaning: "v1-S1, v1-S2 — version + sprint number. Must match filename.",
    },
    { field: "version", meaning: "Parent version — must exist in docs/versions/." },
    { field: "title", meaning: "Short sprint name." },
    {
      field: "status",
      meaning: "planned · active · complete. One sprint active per version at a time.",
    },
    {
      field: "goal",
      meaning:
        "One measurable sentence — what this sprint proves or delivers. Not a copy of the version objective.",
    },
    {
      field: "done_when",
      meaning: "Observable condition to close the sprint — not 'all US done'.",
    },
    { field: "stories", meaning: "Canonical list of US ids — used by validation." },
  ],
  sections: [
    {
      heading: "## Goal",
      description:
        "One or two sentences. Why this sprint, why now, what changes by the end.",
    },
    {
      heading: "## Scope",
      description:
        "Table of US with status, MoSCoW, dependencies, epic, and description.",
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
  title: "Anatomy of a Decision Log entry",
  intro:
    "Every significant decision — technology choice, architecture change, scope adjustment, security posture — is logged in docs/decisions/YYYY-MM-DD.json. Entries are prepended (newest first) and never edited. This is the audit trail of why the system is the way it is.",
  fields: [
    { field: "date", meaning: "ISO date string — YYYY-MM-DD." },
    { field: "title", meaning: "Short decision name — what was decided in a phrase." },
    {
      field: "context",
      meaning: "Why this decision was needed — the situation that forced a choice.",
    },
    { field: "decision", meaning: "What was decided — specific and unambiguous." },
    {
      field: "consequences",
      meaning: "What changes as a result — what is now true, what becomes harder.",
    },
  ],
}

// ─── Epics / versions / stories — prose guide ─────────────────────────────────

export const epicsVersionsStories: GuideSubsection[] = [
  {
    title: "How they relate",
    paragraphs: [
      "Epic answers: what capability are we building? It defines a large product capability in user language — not a technical module. An epic may span multiple versions.",
      "Version answers: what goes live in this release? It is a go-live package that groups epics into a deliverable milestone. You decide what fits in each version.",
      "Sprint answers: which user stories do we tackle this week or fortnight? A sprint belongs to one version and has a single goal. It is not a planning artifact — it is a commitment: these specific US, in this order, done by the end of the sprint.",
      "User story answers: what is the smallest executable slice? Each story belongs to one epic and one version. The sprint selects which stories to implement now.",
    ],
    bullets: [
      "Creation order: epic → version → sprint → user story. You cannot create a US before the epic and version exist.",
      "Sprints are optional but recommended — they give a goal and a boundary to each delivery cycle.",
      "A story references epic and version in frontmatter only (epic: EPIC-02, version: v1). The story body explains its own slice.",
      "An epic can span multiple versions (versions: [v1, v2]). A sprint belongs to exactly one version.",
    ],
  },
]

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
  title: "Usage guide",
  lead: "How to work with Meridian day-to-day — commands, checks, and the sequence of actions for each situation.",
  paragraphs: [
    "For concepts (what is an epic, how phases work, what ready means), read Start here first.",
    "Run /status at any point to get blockers, current state, and the suggested next action.",
    "After you close a US in the files (/complete-us + /sync-board), commit in git (one commit per US) before starting the next story — unless you batch commits on purpose.",
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
    command: "/refine-us",
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
      "It asks only what it could not infer from the code.",
      "Phase documents are populated from what it observed — every inference is marked as an assumption.",
      "Review docs/00_scope.md and docs/05_architecture.md — correct anything the agent got wrong.",
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
      "Significant decision made? Log it with /update-decisions-log.",
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
      "One sprint active per version at a time. Close it (Retrospective filled) before opening the next.",
    ],
    commands: ["/plan-sprint"],
    tip: "Sprints are optional. If you prefer a continuous flow, work directly from the Board without them.",
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
    title: "Ask the agent to implement",
    when: "US selected, focused conversation.",
    actions: [
      "Reference the file explicitly: implement docs/us/US-0017.md per its Acceptance criteria.",
      "The agent reads Acceptance, Approach, Architecture refs, and Planned tests before writing code.",
      "It will refuse if ready is not true or if the Plan has placeholders.",
    ],
    tip: 'Example: "Implement docs/us/US-0017.md per its Acceptance criteria."',
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
      "Cross-cutting decision → prepend to docs/decisions/YYYY-MM-DD.json.",
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
        when: "Prepend a decision entry to docs/decisions/YYYY-MM-DD.json",
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
  "Asking the agent to implement without a ready: true story.",
  "Marking ✅ in chat without running /complete-us in the files.",
  "Editing board.json directly — it is always generated.",
  "Creating US before 05_architecture.md is approved.",
  "Mixing document work, backlog work, and implementation in one conversation.",
  "Setting approved on a document you did not read.",
  "Using status: ✅ without a filled ## Record.",
  "Closing a US with /complete-us and starting the next story without committing the closed slice (unless you batch commits intentionally).",
  "Letting the agent git commit without your explicit request.",
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
    label: "Start here",
    hint: "What Meridian is, the four phases, and the anatomy of each artifact. Available without an open folder.",
  },
  {
    label: "Usage guide",
    hint: "Step-by-step per situation: getting started, phase docs, backlog, implement, close, commit.",
  },
  {
    label: "Setup",
    hint: "Phase docs 00–08 and 11: foundation → principles → architecture → technical detail. Shows which are blocked, draft, or approved.",
  },
  {
    label: "Deliverables",
    hint: "Epic-centric view: each epic shows US coverage. Toggle version to filter the release you are planning.",
  },
  {
    label: "Board",
    hint: "US kanban: ❌, 🔶, ✅, 🧪 (pending tests), 🧊. Filterable by epic.",
  },
]

// ─── Next steps ───────────────────────────────────────────────────────────────

export const nextStepsAfterConcepts = {
  title: "Ready to start?",
  paragraphs: [
    "Go to the Usage guide tab for step-by-step commands and checks for your current situation.",
    "The same guides live in the kit repo: .agent/references/start-here.md and .agent/references/usage-guide.md — for IDE and GitHub without this app.",
    "Open your repository's docs/ folder in this app to see Setup, Deliverables, and Board with real data.",
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
