export type DocStatus = "draft" | "review" | "approved" | "pending"
export type StoryStatus = "✅" | "🔶" | "❌" | "🧊"
export type Moscow = "Must" | "Should" | "Could" | "Won't"

export interface PhaseDocument {
  id: string
  title: string
  phase: string
  status: DocStatus
  dependsOn: string[]
  blocks: string[]
  purpose: string
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
