export type DocStatus = "draft" | "review" | "approved"
export type SetupStepState = "locked" | "active" | "complete" | "alert"
export type StoryStatus = "✅" | "🔶" | "❌" | "🧊"
export type TestsRequirement = "required" | "none"
export type TestsStatus = "pending" | "done" | "n/a"
export type Moscow = "Must" | "Should" | "Could" | "Won't"
export type EpicStatus = "active" | "paused" | "complete"
export type ReleaseStatus = "planned" | "active" | "complete"
export type SprintStatus = "planned" | "active" | "complete"

export interface PhaseDocument {
  id: string
  title: string
  phase: string
  status: DocStatus
  dependsOn: string[]
  blocks: string[]
  purpose: string
}

export interface Epic {
  id: string
  title: string
  /** What this capability delivers to the user (Capability section). */
  description: string
  /** When we consider the epic done at product level (frontmatter). */
  outcome: string
  /** Explicit boundaries — what does not belong to this epic. */
  scopeOut: string
  versions: string[]
  profiles: string[]
  status: EpicStatus
}

/** Release de produto (docs/versions/vX.md). */
export interface ProductVersion {
  id: string
  title: string
  outcome: string
  objective: string
  scopeIn: string
  scopeOut: string
  status: ReleaseStatus
}

/** Sprint within a version (docs/sprints/vX-SY.md). */
export interface Sprint {
  id: string
  versionId: string
  title: string
  doneWhen: string
  status: SprintStatus
  storyIds: string[]
}

export interface UserStory {
  id: string
  title: string
  epic: string
  version: string
  status: StoryStatus
  moscow: Moscow
  dependsOn: string[]
  doneWhen: string
  tests: TestsRequirement
  testsStatus: TestsStatus
  /** Set by /refine-us when the story is ready for implementation. */
  ready?: boolean
}

/** Entrada em docs/decisions/YYYY-MM-DD.json. */
export interface DecisionEntry {
  time: string
  title: string
  affectedDocument: string
  whatChanged: string
  whyChanged: string
  impact: string
  responsible: string
}

/** Daily file in docs/decisions/. */
export interface DecisionDay {
  date: string
  filename: string
  entries: DecisionEntry[]
}
