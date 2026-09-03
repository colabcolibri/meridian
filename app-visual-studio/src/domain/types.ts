export type StoryStatus = "✅" | "🔶" | "❌" | "🧊" | "🚫"
export type TestsRequirement = "required" | "none"
export type TestsStatus = "pending" | "done" | "n/a"
export type Moscow = "Must" | "Should" | "Could" | "Won't"

export type UserStory = {
  id: string
  title: string
  epic: string
  version: string
  sprint: string | null
  status: StoryStatus
  moscow: Moscow
  dependsOn: string[]
  doneWhen: string
  tests: TestsRequirement
  testsStatus: TestsStatus
  ready: boolean | null
  inProgress?: boolean
  preamble?: string | null
}
