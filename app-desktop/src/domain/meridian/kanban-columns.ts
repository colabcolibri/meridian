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

/** Frozen US count per version id (only versions that have at least one 🧊). */
export function frozenCountByVersion(stories: UserStory[]): Map<string, number> {
  const counts = new Map<string, number>()

  for (const story of stories) {
    if (resolveKanbanColumn(story) !== "🧊") {
      continue
    }
    counts.set(story.version, (counts.get(story.version) ?? 0) + 1)
  }

  return counts
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

export type KanbanColumnCount = {
  columnId: KanbanColumnId
  count: number
}

/** Per-column US counts using the same visibility rules as the board grid. */
export function countKanbanColumns(
  stories: UserStory[],
  options: { showFrozen: boolean },
): KanbanColumnCount[] {
  const grouped = groupStoriesForKanban(stories)
  return visibleKanbanColumns(grouped, options)
    .map(({ columnId, stories: columnStories }) => ({
      columnId,
      count: columnStories.length,
    }))
    .filter(({ count }) => count > 0)
}
