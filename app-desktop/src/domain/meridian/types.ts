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
  /** O que esta capacidade entrega ao usuário (seção Capacidade). */
  description: string
  /** Quando consideramos o epic concluído no nível produto (frontmatter). */
  outcome: string
  /** Limites explícitos — o que não pertence a este epic. */
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

/** Sprint dentro de uma versão (docs/sprints/vX-SY.md). */
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

/** Arquivo diário em docs/decisions/. */
export interface DecisionDay {
  date: string
  filename: string
  entries: DecisionEntry[]
}
