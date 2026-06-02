import type { StoryStatus, UserStory } from "@/domain/meridian/types"
import { sortStoriesById } from "@/domain/meridian/validators"

/** Coluna exibida no quadro — inclui 🧪 derivado de tests_status. */
export type KanbanColumnId = StoryStatus | "🧪"

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

export function groupStoriesForKanban(stories: UserStory[]) {
  const order: KanbanColumnId[] = ["❌", "🔶", "🧪", "✅", "🧊"]

  return order.map((columnId) => ({
    columnId,
    stories: sortStoriesById(
      stories.filter((story) => resolveKanbanColumn(story) === columnId),
    ),
  }))
}
