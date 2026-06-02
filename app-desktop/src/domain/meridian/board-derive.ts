import type { BoardEntry } from "@/domain/meridian/board-types"
import type { UserStory } from "@/domain/meridian/types"
import { compareUserStoryIds } from "@/domain/meridian/user-story-id"

export function userStoryToBoardEntry(story: UserStory): BoardEntry {
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
  }
}

/** Derives kanban board entries from parsed user stories (source of truth: docs/us/). */
export function deriveBoardFromStories(stories: UserStory[]): BoardEntry[] {
  return [...stories]
    .sort((a, b) => compareUserStoryIds(a.id, b.id))
    .map(userStoryToBoardEntry)
}
