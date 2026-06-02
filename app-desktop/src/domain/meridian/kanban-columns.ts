import type { StoryStatus, UserStory } from "@/domain/meridian/types"
import { sortStoriesById } from "@/domain/meridian/validators"

/** Coluna exibida no quadro — inclui 🧪 derivado de tests_status. */
export type KanbanColumnId = StoryStatus | "🧪"

export type KanbanColumnGroup = {
  columnId: KanbanColumnId
  stories: UserStory[]
}

export const KANBAN_COLUMN_ORDER: KanbanColumnId[] = ["❌", "🔶", "🧪", "✅", "🧊"]

export function resolveKanbanColumn(story: UserStory): KanbanColumnId {
  if (story.status === "🧊") {
    return "🧊"
  }
  if (story.status === "❌") {
    return "❌"
  }
  if (story.tests === "required" && story.testsStatus === "pending") {
    return "🧪"
  }
  return story.status
}

export function groupStoriesForKanban(stories: UserStory[]): KanbanColumnGroup[] {
  return KANBAN_COLUMN_ORDER.map((columnId) => ({
    columnId,
    stories: sortStoriesById(
      stories.filter((story) => resolveKanbanColumn(story) === columnId),
    ),
  }))
}

export function countFrozenStories(stories: UserStory[]): number {
  return stories.filter((story) => resolveKanbanColumn(story) === "🧊").length
}

export function visibleKanbanColumns(
  columns: KanbanColumnGroup[],
  options: { showFrozen: boolean },
): KanbanColumnGroup[] {
  return columns.filter(({ columnId }) => {
    if (columnId === "🧊") {
      return options.showFrozen
    }
    return true
  })
}
