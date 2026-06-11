import type {
  Moscow,
  StoryStatus,
  TestsRequirement,
  TestsStatus,
} from "@/domain/meridian/types"

export interface BoardEntry {
  id: string
  title: string
  epic: string
  version: string
  status: StoryStatus
  moscow: Moscow
  depends_on: string[]
  done_when: string
  tests: TestsRequirement
  tests_status: TestsStatus
  ready: boolean
}
