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

export type AnatomyGuide = {
  title: string
  intro: string
  fields: { field: string; meaning: string }[]
  exampleTitle: string
  exampleBody: string
}

export const meridianIntro = {
  title: "Guide for people new to Meridian",
  paragraphs: [
    "Meridian is a way to organize software projects using Markdown files in the docs/ folder. You write what you will build, approve it, and only then ask for code, manually or with AI agents in Cursor.",
    "It is not Jira, it is not Notion, and it does not require a login. The source of truth is the files in your repository. This app only reads that folder and shows progress visually.",
    "Use this tab to understand the structure. Then go to Usage guide (steps and commands) and open the docs/ folder in this app.",
  ],
}

export type UsageGuideSection = {
  id: string
  title: string
  subtitle: string
  defaultOpen?: boolean
  steps: DailyWorkflowStep[]
}

export const usageGuideIntro = {
  title: "Usage guide",
  lead: "A practical roadmap for working on the project with AI. Open the section that matches your current situation.",
  paragraphs: [
    "Meridian supports you: it shows what is missing, suggests the next step, and records progress in the files. You approve; AI executes within what is documented.",
    "Concepts (folders, phases, status) live in Start here. This section only covers actions, commands, and what to check before moving forward.",
  ],
}

/** Shortcut: which section to open based on the current situation. */
export const usageSituations = [
  {
    situation: "Project does not have a docs/ folder yet",
    section: "First time",
    command: "/init-meridian",
  },
  {
    situation: "Phase docs are incomplete or in draft",
    section: "Document",
    command: "/status",
  },
  {
    situation: "Architecture is ok, but epic, version, or US is missing",
    section: "Build backlog",
    command: "/create-us",
  },
  {
    situation: "US created — want quality audit before refine",
    section: "Review US",
    command: "/review-us",
  },
  {
    situation: "US reviewed or draft — ready to deepen for code",
    section: "Refine US",
    command: "/refine-us",
  },
  {
    situation: "US refined (ready: true), time to code",
    section: "Implement US",
    command: undefined,
  },
  {
    situation: "Code is ready, registration in the files is missing",
    section: "Close US",
    command: "/complete-us",
  },
]

export const gettingStartedSteps: DailyWorkflowStep[] = [
  {
    id: "open-cursor",
    title: "Open the repository in Cursor",
    when: "Any work session.",
    actions: [
      "Open the project root folder (where .agent/ or .cursor/ live, and later docs/).",
      "Do not open only docs/ in Cursor. Agents and scripts live at the root.",
    ],
  },
  {
    id: "init-meridian",
    title: "Create Meridian structure (if docs/ does not exist)",
    when: "New repository or no phase documents (00–08 and 11).",
    actions: [
      "In chat, run /init-meridian. The workflow creates docs/, governance, and an empty board.json.",
      "AI may ask up to 3 questions if something is ambiguous; you confirm what is needed.",
      "Review what was generated before moving on. Still no product code.",
    ],
    commands: ["/init-meridian"],
    tip: "If docs/ already exists in git, skip to the next step.",
  },
  {
    id: "open-docs-app",
    title: "Open docs/ in this app",
    when: "To see visual progress while working in Cursor.",
    actions: [
      "Use the Open docs folder button (below or at the top of the app).",
      "Select the repository's docs/ folder.",
      "Setup tab: see which doc is blocked, in draft, or approved.",
    ],
  },
  {
    id: "first-status",
    title: "Know where to continue",
    when: "After opening the project or resuming after a few days.",
    actions: [
      "Run /status. It reports blockers, pending docs, and the suggested next action.",
      "Optional: python3 .agent/scripts/validate_meridian.py <project-folder> at the root.",
    ],
    commands: ["/status"],
  },
]

export const documentWorkflowSteps: DailyWorkflowStep[] = [
  {
    id: "doc-pick",
    title: "Choose one doc per conversation",
    when: "Before backlog or code, mature docs/ in the Setup tab.",
    actions: [
      "Check Setup to see which doc is unblocked and in draft or review.",
      "Work on one file at a time, for example docs/02_security.md or docs/05_architecture.md.",
      "Mention the full path in chat; ask for a draft, gaps, or review, without implementing product code.",
    ],
    commands: ["/status"],
  },
  {
    id: "doc-commands",
    title: "Use specialized commands when appropriate",
    when: "Target doc identified.",
    actions: [
      "/architecture — draft or review 05_architecture.md.",
      "/security-pass — draft or review 02_security.md.",
      "Scope or stack change -> prepend to docs/decisions/YYYY-MM-DD.json (never delete entries).",
    ],
    commands: ["/architecture", "/security-pass"],
  },
  {
    id: "doc-approve",
    title: "You approve in frontmatter",
    when: "Content reviewed by you. AI does not mark approved on its own.",
    actions: [
      "Change status: draft -> review -> approved in the file YAML.",
      "Check whether the next doc in the sequence became unblocked in Setup.",
      "Backlog gate: 05_architecture.md with status approved.",
    ],
  },
]

export const backlogWorkflowSteps: DailyWorkflowStep[] = [
  {
    id: "backlog-gate",
    title: "Confirm you can create US",
    when: "Before /create-epic or /create-us.",
    actions: [
      "05_architecture.md must be approved (Setup tab or /status).",
      "If it is not, go back to the Document section.",
    ],
    commands: ["/status"],
  },
  {
    id: "backlog-structure",
    title: "Create epic, version, and sprint",
    when: "Architecture approved; delivery planning is missing.",
    actions: [
      "Usual order: epic (product capability) -> version (release) -> sprint (time slice).",
      "One command per conversation when possible.",
    ],
    commands: ["/create-epic", "/create-version", "/plan-sprint"],
  },
  {
    id: "backlog-us",
    title: "Create executable user stories",
    when: "Epic and version already exist in docs/epics/ and docs/versions/.",
    actions: [
      "/create-us — Why / Where / Approach prose, Acceptance, epic and version in frontmatter; ready: false.",
      "/refine-us US-XXXX — deepens Approach, architecture §, Tests/Planned; sets ready: true.",
      "Check the Deliverables tab (coverage) and Board tab (position and deps).",
      "After creating or changing US: /sync-board.",
    ],
    commands: ["/create-us", "/refine-us", "/sync-board"],
  },
]

export const reviewWorkflowSteps: DailyWorkflowStep[] = [
  {
    id: "review-when",
    title: "Audit without editing",
    when: "After /create-us, on legacy US, or before /refine-us — read-only.",
    actions: [
      "Run /review-us US-XXXX — agent scores review-checklist.md + validate_meridian.py.",
      "Output: pass/fail table and recommendation. Does not set ready: true.",
      "Canonical template paths: .agent/references/templates/TEMPLATE_SOURCES.md",
    ],
    commands: ["/review-us US-XXXX"],
  },
  {
    id: "review-next",
    title: "Act on the report",
    when: "Review found gaps.",
    actions: [
      "If failures → /refine-us US-XXXX to fix and set ready.",
      "If all pass but ready false → still run /refine-us to set ready flag.",
      "Do not implement until ready: true.",
    ],
    commands: ["/refine-us US-XXXX"],
  },
]

export const refineWorkflowSteps: DailyWorkflowStep[] = [
  {
    id: "refine-when",
    title: "Refine before implement",
    when: "After /create-us or when Context is still placeholder — no product code yet.",
    actions: [
      "Run /refine-us US-XXXX in a focused conversation.",
      "Agent reads writing-guide.md + refine-checklist.md + target US.",
      "Deepens Approach bullets, exact architecture § headings, and Tests/Planned.",
    ],
    commands: ["/refine-us US-XXXX"],
  },
  {
    id: "refine-ready",
    title: "Set ready: true only when checklist passes",
    when: "Context has Why this story, Where it fits, and explanatory Approach.",
    actions: [
      "Frontmatter ready: true unlocks implementation.",
      "Optional: python3 .agent/scripts/validate_meridian.py <project-folder> (append --json for CI).",
      "Human templates mirror: docs/templates/README.md.",
    ],
  },
]

export const implementWorkflowSteps: DailyWorkflowStep[] = [
  {
    id: "pick-us",
    title: "Choose the US of the day",
    when: "There is a Must US on the Board with satisfied depends_on.",
    actions: [
      "Board tab: prefer an unblocked Must (❌ or 🔶).",
      "/status if you do not know which one to take.",
      "One US per implementation cycle.",
    ],
    commands: ["/status"],
  },
  {
    id: "context-us",
    title: "Ask for implementation anchored in the file",
    when: "US selected, new conversation or focused thread.",
    actions: [
      "Mention the ID and file: US-0017 or docs/us/US-0017.md.",
      "Block if ready is not true — run /refine-us first.",
      "Be clear: implement according to Acceptance; do not mark ✅ only in chat.",
      "AI reads the US, architecture, and dependencies before coding.",
    ],
    tip: 'Example: "Implement docs/us/US-0017.md according to Acceptance. Status in the files, not only here."',
  },
  {
    id: "review-diff",
    title: "You review before closing",
    when: "Agent delivered a diff.",
    actions: [
      "Review the code in Cursor; run the project's build/test.",
      "Partial -> do not use /complete-us yet; ask for an adjustment or manually mark 🔶 with Missing: in Acceptance.",
      "Ready with evidence -> go to the Close US section.",
    ],
  },
]

export const completeUsWorkflowSteps: DailyWorkflowStep[] = [
  {
    id: "complete-gate",
    title: "Check preconditions",
    when: "Before /complete-us, implementation already reviewed by you.",
    actions: [
      "Every depends_on for the US is ✅.",
      "Verifiable Acceptance with evidence (test, diff, behavior in the app).",
      "If tests: required in frontmatter, tests passed or are documented.",
    ],
    tip: "If something fails, do not force ✅. Use 🔶 and Missing: in Acceptance.",
  },
  {
    id: "complete-run",
    title: "Run /complete-us",
    when: "Gates ok; best in a conversation focused only on closing.",
    actions: [
      "Command: /complete-us US-XXXX (ex.: /complete-us US-0017).",
      "Without an ID, AI asks which US or infers it from the session. Confirm if it infers.",
      "Workflow uses board-keeper + skill complete-user-story.",
    ],
    commands: ["/complete-us US-XXXX"],
  },
  {
    id: "complete-what-ai-does",
    title: "What AI records in the file",
    when: "During /complete-us.",
    actions: [
      "Fills ## Record — real paths, summary by layer (no placeholder).",
      "Marks Intent/Acceptance [x]; updates Plan/Planned and Record/Executed if tests: required.",
      "Frontmatter: status ✅ (or 🔶 + Missing: if partial); tests_status: done when appropriate.",
      "Cross-cutting decision -> prepend to docs/decisions/YYYY-MM-DD.json.",
    ],
  },
  {
    id: "complete-board",
    title: "Update board and check",
    when: "Immediately after /complete-us.",
    actions: [
      "AI runs generate-board-json; you can confirm with /sync-board.",
      "Board tab: US in the right column (✅, 🔶, or 🧪 if tests are pending).",
      "Does Record match what you tested? If not, fix it before continuing.",
    ],
    commands: ["/sync-board", "/status"],
  },
]

export const usageGuideSections: UsageGuideSection[] = [
  {
    id: "start",
    title: "First time",
    subtitle:
      "Repository in Cursor, docs/ created or already existing, folder open in this app.",
    defaultOpen: true,
    steps: gettingStartedSteps,
  },
  {
    id: "document",
    title: "Document",
    subtitle: "Mature docs/ in Setup. Gate: 05_architecture approved.",
    steps: documentWorkflowSteps,
  },
  {
    id: "backlog",
    title: "Build backlog",
    subtitle: "Epics, versions, sprints, and US. Deliverables and Board tabs.",
    steps: backlogWorkflowSteps,
  },
  {
    id: "review",
    title: "Review US",
    subtitle: "Read-only audit — report gaps, never sets ready.",
    steps: reviewWorkflowSteps,
  },
  {
    id: "refine",
    title: "Refine US",
    subtitle: "Deepen Context and set ready: true before any product code.",
    steps: refineWorkflowSteps,
  },
  {
    id: "implement",
    title: "Implement US",
    subtitle: "Choose US, ask for code anchored in Acceptance, review diff.",
    steps: implementWorkflowSteps,
  },
  {
    id: "complete-us",
    title: "Close US",
    subtitle: "Record delivery in the files. /complete-us + updated board.",
    steps: completeUsWorkflowSteps,
  },
]

export const slashCommandReference: SlashCommandHint[] = [
  { command: "/init-meridian", when: "New project, create docs/ and governance" },
  { command: "/status", when: "Session start, blockers and next action" },
  { command: "/architecture", when: "Draft or review 05_architecture.md" },
  { command: "/security-pass", when: "Draft or review 02_security.md" },
  { command: "/create-epic", when: "New capability in docs/epics/" },
  { command: "/create-version", when: "New release in docs/versions/" },
  { command: "/plan-sprint", when: "Time slice in docs/sprints/" },
  { command: "/create-us", when: "New task in docs/us/ (gates ok); ready: false" },
  {
    command: "/review-us",
    when: "Audit US quality — report only, no ready flag",
    example: "/review-us US-0017",
  },
  {
    command: "/refine-us",
    when: "Deepen Approach, architecture §, tests; set ready: true",
    example: "/refine-us US-0017",
  },
  {
    command: "/complete-us",
    when: "Close US, Record, Acceptance, status, board",
    example: "/complete-us US-0017",
  },
  {
    command: "/sync-board",
    when: "Regenerate docs/kanban/board.json after changing US",
  },
  {
    command: "/daily-with-ai",
    when: "Shortcut: complete session loop (for people who already know the flow)",
  },
]

export const usageAntiPatterns = [
  "Asking for code without a US, with ready: false, or without 05_architecture approved.",
  "Marking ✅ in chat without /complete-us in the files.",
  "Editing board.json by hand. Use /sync-board.",
  "Mixing documentation, backlog, and implementation in the same conversation.",
  "Skipping /complete-us and manually editing status without Record.",
  "approved in a phase doc without you having read the content.",
]

export const validateProjectHint = {
  title: "Validate Meridian structure",
  command: "python3 .agent/scripts/validate_meridian.py <project-folder>",
  note: "Run at the target repository root. Append --json for CI. Fix errors before creating US or marking docs approved.",
}

export const folderStructure = {
  title: "What is inside docs/",
  intro: [
    "Every Meridian project has a docs/ folder at the root. That is the folder you open in this app. Its content is split between phase documents at the docs/ root and delivery folders:",
  ],
  items: [
    {
      path: "docs/*.md",
      label: "10 phase documents",
      description:
        "Files 00–08 and 11: foundation (00–03), principles (04), architecture (05), details (06–08). Delivery lives in the epics/, versions/, sprints/, and us/ folders.",
    },
    {
      path: "docs/epics/EPIC-XX.md",
      label: "Epics (product capabilities)",
      description:
        "One file per epic, with YAML frontmatter, just like user stories. Example: EPIC-02.md describes the setup monitor.",
    },
    {
      path: "docs/versions/vX.md",
      label: "Versions (releases)",
      description:
        "One file per release (v0, v1, v2...). Goal, outcome, scope, and go-live checklist.",
    },
    {
      path: "docs/sprints/vX-SY.md",
      label: "Sprints",
      description:
        "Time slices within a version. List of planned US (`stories` in frontmatter).",
    },
    {
      path: "docs/us/US-XXXX.md",
      label: "User stories (tasks)",
      description:
        "One file per development task. Only after 05_architecture is approved and epic/version exist in the folders.",
    },
    {
      path: "docs/decisions/YYYY-MM-DD.json",
      label: "Decision log (JSON per day)",
      description:
        "One JSON file per calendar day. entries array with time, title, affected_document, what_changed, why_changed, impact, responsible, newest first.",
    },
    {
      path: "docs/templates/",
      label: "Delivery templates",
      description:
        "Human-readable mirror of kit templates (symlinks). Agents read .agent/references/templates/.",
    },
    {
      path: "docs/kanban/board.json",
      label: "Kanban board (generated)",
      description:
        "Automatic status summary for all user stories. Never edit it by hand. It is built from the files in docs/us/.",
    },
  ],
}

export const docFlowNote =
  "Dependencies between docs: 00–03 in sequence; 04_principles before 05_architecture; 06–08 after 05 (06 before 07). Decision log in docs/decisions/ from day 1. Epics, versions, and US only after 05_architecture is approved."

export const journeyPhases: JourneyPhase[] = [
  {
    id: "fase-0",
    label: "Phase 0 — Foundation",
    subtitle: "Understand the project",
    purpose:
      "Answers: what we are building, with which technology, for whom, and with which risks. Sequential: one document unlocks the next.",
    documents: [
      "11_decisions.md — log rules (stub)",
      "docs/decisions/YYYY-MM-DD.json — structured log by day",
      "00_scope.md — problem, scope, what is in and what is out",
      "01_tech_stack.md — languages, frameworks, tools",
      "02_security.md — threats, sensitive data, rules",
      "03_user_types.md — profiles of people who use the product",
    ],
  },
  {
    id: "fase-1",
    label: "Phase 1 — Principles",
    subtitle: "Code and quality rules",
    purpose:
      "Conventions that guide implementation and review, before designing system modules and boundaries.",
    documents: ["04_principles.md — code and quality conventions"],
  },
  {
    id: "fase-2",
    label: "Phase 2 — Architecture",
    subtitle: "How the system is divided",
    purpose:
      "Apps, modules, integrations, and boundaries, based on scope, stack, security, users, and principles.",
    documents: ["05_architecture.md"],
  },
  {
    id: "fase-3",
    label: "Phase 3 — Technical details",
    subtitle: "Database, APIs, and environments",
    purpose:
      "Details data, contracts between services, and where the system runs (local, staging, production).",
    documents: ["06_database.md", "07_api_contracts.md", "08_environments.md"],
  },
  {
    id: "fase-4",
    label: "Phase 4 — Delivery backlog",
    subtitle: "Releases, epics, sprints, and US",
    purpose:
      "Only after architecture: split the system into releases, product capabilities, and executable tasks.",
    documents: [
      "docs/epics/EPIC-XX.md — product capability (outcome)",
      "docs/versions/vX.md — goal and scope of each release",
      "docs/sprints/vX-SY.md — time slices within the version",
    ],
    note: "Usual creation order: epic -> version -> sprint -> US. US gate: 05_architecture approved + epic/version exist in the folders.",
  },
  {
    id: "execucao",
    label: "Execution",
    subtitle: "Implement and reflect in the files",
    purpose:
      "User story lifecycle: /create-us (ready: false) → /refine-us (ready: true) → implement → /complete-us → /sync-board.",
    documents: [
      "docs/us/US-0001.md... — one task per file",
      "docs/kanban/board.json — consolidated view (generated)",
    ],
  },
]

export const epicsVersionsStories: GuideSubsection[] = [
  {
    title: "Epic — the large product block",
    paragraphs: [
      'An epic groups a whole product capability. Example: EPIC-02 "Initial setup monitor" covers opening a folder, reading phase documents and delivery folders, and showing progress.',
      "Each epic is a file in docs/epics/EPIC-XX.md: frontmatter with id, title, status, versions, profiles, and outcome; body with Capability and Expected outcome as explanatory prose (see writing-guide.md).",
      "There is no duplicated markdown index. The docs/epics/ folder is the source of truth. Create epics only after 05_architecture is approved.",
    ],
    bullets: [
      "Epic status: active, complete, or paused (different from draft/review/approved in phase docs).",
      "User stories reference the epic only by ID in frontmatter (`epic: EPIC-02`). They do not copy epic text.",
      "In the Deliverables tab, epics are grouped by capability with a version toggle; you see how many US are finished per epic.",
    ],
  },
  {
    title: "Version — the release (v0, v1, v2...)",
    paragraphs: [
      "A version is a go-live package: what ships together when we close a milestone. Example: v1 = open a real folder and read markdown.",
      "Each version is a file in docs/versions/vX.md, the source of truth, with no duplicated index.",
      "Sprints (v1-S1, v1-S2...) live in docs/sprints/. They organize time within the version, with a US list in frontmatter.",
    ],
    bullets: [
      "User stories reference only `version: v1`. They do not repeat the release plan.",
      "Epics reference `versions: [v0, v1]`, the releases where the capability participates.",
      "AI plans releases with /create-version; sprints with /plan-sprint.",
    ],
  },
  {
    title: "User story — the executable task",
    paragraphs: [
      'A user story (US) is the unit of work that someone (or an agent) implements. Format: "As [persona], I want [action], so that [benefit]".',
      "Each US is a file in docs/us/ (ex.: US-0017.md). YAML frontmatter at the top; body has ## Intent (Acceptance, Why, Where), ## Plan, ## Record, and ## Boundaries.",
    ],
    bullets: [
      "ready: false after /create-us; ready: true after /refine-us — gate before product code.",
      "Acceptance list: verifiable checkboxes. Do not mark ✅ without evidence.",
      "depends_on: other US that must finish first.",
      "done_when: short sentence summarizing when the US is truly ready.",
      "moscow: Must / Should / Could / Won't, priority within the version.",
      "Record and ✅: filled with /complete-us after you review the code. Do not mark done only in chat.",
      "Tests section: Planned (checkboxes) + Executed (evidence) when tests: required in frontmatter.",
    ],
  },
]

export const epicAnatomy = {
  title: "Example: how to read an epic",
  intro:
    "Open docs/epics/EPIC-XX.md. The epic defines the what and why of the capability; user stories only reference the ID (`epic: EPIC-XX`). They never paste the epic description or outcome.",
  fields: [
    { field: "id", meaning: "Permanent identifier (EPIC-02)" },
    { field: "title", meaning: "Short capability name" },
    {
      field: "status",
      meaning: "active · complete · paused — epic lifecycle, not US lifecycle",
    },
    { field: "versions", meaning: "Releases where the epic is included (v0, v1...)" },
    {
      field: "profiles",
      meaning: "User types from 03_user_types.md that benefit",
    },
    {
      field: "outcome",
      meaning: "Epic done condition at product level, when to mark complete",
    },
    {
      field: "Capability",
      meaning: "Body: what the user becomes able to do",
    },
    {
      field: "Out of this epic",
      meaning: "Body: explicit boundaries, avoids scope creep",
    },
  ],
  exampleTitle: "EPIC-02 — Initial setup monitor",
  exampleBody:
    "Outcome: manager opens docs/, sees progress for the 10 phase documents (00–08 and 11), and reads each .md inline. US-0017 and US-0018 reference epic: EPIC-02 without repeating this text.",
}

export const versionAnatomy = {
  title: "Example: how to read a version",
  intro:
    "Open docs/versions/v1.md. The version defines the release; US and sprints only reference the ID (`version: v1`).",
  fields: [
    { field: "id", meaning: "Release identifier (v0, v1, v2...)" },
    { field: "title", meaning: "Short name (ex.: Folder Monitor MVP)" },
    {
      field: "status",
      meaning: "planned · active · complete — release lifecycle",
    },
    {
      field: "outcome",
      meaning: "Release done condition at product level",
    },
    { field: "Goal", meaning: "Body: what this go-live delivers" },
    { field: "Explicitly out", meaning: "Body: what stays for future versions" },
  ],
  exampleTitle: "v1 — Folder Monitor MVP",
  exampleBody:
    "Outcome: user opens docs/, tabs reflect real .md files. US-0009 to US-0022 use version: v1. Sprints v1-S1 and v1-S2 in docs/sprints/.",
}

export const userStoryAnatomy = {
  title: "Example: how to read a user story",
  intro:
    "Open any file in docs/us/. The top is metadata; the body explains the request and Acceptance criteria. The epic field must point to an existing file in docs/epics/.",
  fields: [
    { field: "id", meaning: "Unique identifier (US-0017)" },
    { field: "title", meaning: "Short task name" },
    {
      field: "epic",
      meaning:
        "Reference by ID to the epic in docs/epics/ (ex.: EPIC-02). Do not repeat the epic description here",
    },
    {
      field: "version",
      meaning: "Release in docs/versions/ (ex.: v1), reference by ID",
    },
    {
      field: "status",
      meaning: "✅ done · 🔶 partial (Missing:) · ❌ pending · 🧊 frozen",
    },
    {
      field: "ready",
      meaning:
        "false after /create-us; true after /refine-us — required before implementing code",
    },
    {
      field: "tests",
      meaning: "required = needs verification · none = no tests (tests_status: n/a)",
    },
    {
      field: "tests_status",
      meaning:
        "pending / done / n/a — 🧪 column on the board when pending + tests required",
    },
    { field: "depends_on", meaning: "US that must finish first" },
    { field: "done_when", meaning: "Objective sentence: ready when..." },
    {
      field: "moscow",
      meaning: "Must = required in the version; Should/Could = desirable",
    },
  ],
  exampleTitle: "US-0017 — Read phase documents in Markdown",
  exampleBody:
    "As the process manager, I want to open each phase document (00–08 and 11) inside the app, so I can review scope and architecture without leaving the monitor. Acceptance: button on each doc, reading via File System Access API, visible frontmatter + body.",
}

export const statusGuide = {
  title: "Status: documents, delivery, and tasks",
  documentStatuses: [
    {
      label: "draft",
      meaning: "Draft, still being written or incomplete.",
    },
    {
      label: "review",
      meaning: "Ready for human review, content complete enough.",
    },
    {
      label: "approved",
      meaning: "Approved, unlocks documents and phases that depend on it.",
    },
  ],
  epicStatuses: [
    {
      label: "active",
      meaning: "Capability in progress, US can reference this epic.",
    },
    { label: "complete", meaning: "Epic outcome reached at product level." },
    { label: "paused", meaning: "Intentionally paused, outside the current flow." },
  ],
  versionStatuses: [
    { label: "planned", meaning: "Release defined, not running yet." },
    { label: "active", meaning: "Version in progress, sprints and US active." },
    { label: "complete", meaning: "Go-live for this release completed." },
  ],
  storyStatuses: [
    { emoji: "❌", label: "Pending", meaning: "Not started yet or not finished." },
    {
      emoji: "🔶",
      label: "In progress",
      meaning:
        'Partially done. Acceptance must include "Missing:" explaining what is missing.',
    },
    {
      emoji: "✅",
      label: "Done",
      meaning: "Acceptance criteria and Tests proven in the files.",
    },
    {
      emoji: "🧪",
      label: "Waiting for tests",
      meaning: "Board column when tests: required and tests_status: pending in YAML.",
    },
    {
      emoji: "🧊",
      label: "Frozen",
      meaning: "Intentionally paused, not part of the flow right now.",
    },
  ],
  kanbanNote:
    "The board uses YAML status and derives 🧪 from tests_status: pending. board.json includes tests and tests_status. Regenerate after changing US (generate-board-json or /sync-board).",
}

export const appIntro = {
  title: "What each tab in this app shows",
  paragraphs: [
    "After opening the docs/ folder, use the tabs to navigate. They read the same files you edit in Cursor. Nothing is duplicated in a database.",
  ],
}

export const monitorTabsGuide = [
  {
    label: "Start here",
    hint: "What Meridian is, folders, phases, and concepts. Available without an open folder.",
  },
  {
    label: "Usage guide",
    hint: "Step by step with accordions: document, backlog, implement, and close US (/complete-us).",
  },
  {
    label: "Setup",
    hint: "Docs 00–08 and 11: foundation -> principles -> architecture -> technical details.",
  },
  {
    label: "Deliverables",
    hint: "Epic-centric view: each epic shows US coverage; toggle version to filter the release you are planning.",
  },
  {
    label: "Board",
    hint: "US kanban: ❌, 🔶, ✅, 🧪 (pending tests), 🧊. Filterable by epic.",
  },
]

export const corePrinciples: ConceptBlock[] = [
  {
    id: "docs-first",
    title: "Documentation before code",
    summary:
      "Scope, architecture, and Acceptance criteria come first. Code implements documentation, not the other way around.",
  },
  {
    id: "human-manager",
    title: "You approve, agents execute",
    summary:
      "AI can write and review, but scope changes, approved status, and ✅ only happen with your validation.",
  },
  {
    id: "audit-status",
    title: "Done = evidence",
    summary:
      "Compiling is not enough. ✅ requires Acceptance and tests in the files. Use /complete-us after reviewing. 🔶 requires explicit Missing:.",
  },
  {
    id: "refine-before-code",
    title: "Refine before code",
    summary:
      "/create-us writes Why / Where / Approach (ready: false). /refine-us deepens Approach and sets ready: true. No product code until then.",
  },
  {
    id: "derived-board",
    title: "Derived board",
    summary:
      "board.json comes from the US files. Edit docs/us/*.md, not the JSON, as the status source of truth.",
  },
]

const phaseGroupIntro: Record<string, string> = {
  "Phase 0":
    "Sequential foundation: understand the project, stack, security, and users before any delivery.",
  "Phase 1": "Code principles: conventions before designing the system.",
  "Phase 2": "Architecture: apps, modules, boundaries.",
  "Phase 3": "Technical details: database, API contracts, and environments.",
  Delivery:
    "Backlog in epics/, versions/, and sprints/ folders, only after 05_architecture is approved.",
  Continuous:
    "Permanent decision record. Whenever something relevant changes, add an entry (never delete).",
}

const phaseDocDescriptions: Record<string, string> = {
  "00_scope": "Name, problem, in/out scope, risks.",
  "01_tech_stack": "Stack and rationale for choices.",
  "02_security": "Threats, secrets, OWASP in the project context.",
  "03_user_types": "Who uses it and what each profile needs.",
  "04_principles": "Code and quality conventions.",
  "05_architecture": "Apps, modules, boundaries.",
  "06_database": "Data model and migrations.",
  "07_api_contracts": "Contracts between services.",
  "08_environments": "Local, staging, production.",
  "11_decisions": "Stub with rules, log in docs/decisions/YYYY-MM-DD.json.",
}

export const phaseDocuments = PHASE_DOC_IDS.map((id) => ({
  id,
  phase: phaseLabelForDocId(id),
  phaseIntro: phaseGroupIntro[phaseLabelForDocId(id)] ?? "",
  description: phaseDocDescriptions[id] ?? "",
}))

export const nextStepsAfterConcepts = {
  title: "Next step",
  paragraphs: [
    "Understood folders, phases, and status? Go to the Usage guide tab for steps and commands (/init-meridian, /create-us, /refine-us, /complete-us…).",
    "The same guides live in the kit repo: .agent/references/start-here.md and .agent/references/usage-guide.md (for IDE and GitHub without this app).",
    "Open your repository's docs/ folder in this app to see Setup, Deliverables, and Board with real data.",
  ],
}
