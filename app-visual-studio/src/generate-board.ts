import type { UserStory } from "./domain/types.js"

export type BoardJsonEntry = {
  id: string
  title: string
  epic: string
  version: string
  status: UserStory["status"]
  moscow: UserStory["moscow"]
  depends_on: string[]
  done_when: string
  tests: UserStory["tests"]
  tests_status: UserStory["testsStatus"]
  ready: boolean
}

export function storyToBoardEntry(story: UserStory): BoardJsonEntry {
  return {
    id: story.id,
    title: story.title,
    epic: story.epic,
    version: story.version,
    status: story.status,
    moscow: story.moscow,
    depends_on: story.dependsOn,
    done_when: story.doneWhen,
    tests: story.tests,
    tests_status: story.testsStatus,
    ready: story.ready === true,
  }
}

export function storiesToBoardEntries(stories: UserStory[]): BoardJsonEntry[] {
  return stories.map(storyToBoardEntry)
}
