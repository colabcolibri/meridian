import type { StoryStatus, UserStory } from "./types.js"
import { sortStoriesById } from "./sort-by-id.js"

export type KanbanColumnId = StoryStatus | "🧪"

export type KanbanColumnGroup = {
  columnId: KanbanColumnId
  stories: UserStory[]
}

export const KANBAN_COLUMN_ORDER: KanbanColumnId[] = ["❌", "🔶", "🧪", "✅", "🧊"]

const COLUMN_LABELS: Record<KanbanColumnId, string> = {
  "❌": "Todo",
  "🔶": "Partial",
  "🧪": "Tests",
  "✅": "Done",
  "🧊": "Frozen",
}

export function columnLabel(columnId: KanbanColumnId): string {
  return COLUMN_LABELS[columnId]
}


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

/** Columns visible by default (hide empty Frozen). */
export function visibleBoardColumns(groups: KanbanColumnGroup[]): KanbanColumnGroup[] {
  return groups.filter(
    ({ columnId, stories }) => columnId !== "🧊" || stories.length > 0,
  )
}
