export type DocStatus = "draft" | "review" | "approved"
export type SetupStepState = "locked" | "active" | "complete" | "alert"
export type StoryStatus = "✅" | "🔶" | "❌" | "🧊"
export type Moscow = "Must" | "Should" | "Could" | "Won't"
export type EpicStatus = "active" | "paused" | "complete"

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
  description: string
  versions: string[]
  profiles: string[]
  status: EpicStatus
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
}
