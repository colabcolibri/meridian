import type { UserStory } from "./types.js"
import { sortStoriesById } from "./sort-by-id.js"

/** Board columns — derived from SQLite `ready` + `status`, not stored separately. */
export type KanbanColumnId =
  | "backlog"
  | "todo"
  | "🔶"
  | "🧪"
  | "✅"
  | "🧊"
  | "🚫"

export type KanbanColumnGroup = {
  columnId: KanbanColumnId
  stories: UserStory[]
}

export const KANBAN_COLUMN_ORDER: KanbanColumnId[] = [
  "backlog",
  "todo",
  "🔶",
  "🧪",
  "✅",
  "🧊",
  "🚫",
]

/** Display titles for board column headers (UI only — not US `status`). */
const COLUMN_HEADER_LABELS: Record<KanbanColumnId, string> = {
  backlog: "📋 Backlog",
  todo: "📌 Todo",
  "🔶": "🔶 Partial",
  "🧪": "🧪 Tests",
  "✅": "✅ Done",
  "🧊": "🧊 Frozen",
  "🚫": "🚫 Deprecated",
}

export function columnHeaderLabel(columnId: KanbanColumnId): string {
  return COLUMN_HEADER_LABELS[columnId]
}

/** @deprecated use columnHeaderLabel */
export function columnLabel(columnId: KanbanColumnId): string {
  return columnHeaderLabel(columnId)
}

export function isReadyForTodo(story: UserStory): boolean {
  return story.ready === true
}

export function resolveKanbanColumn(story: UserStory): KanbanColumnId {
  if (story.status === "🧊") {
    return "🧊"
  }
  if (story.status === "🚫") {
    return "🚫"
  }
  if (story.status === "❌") {
    return isReadyForTodo(story) ? "todo" : "backlog"
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

/** Columns visible by default (hide empty Frozen / Deprecated). */
export function visibleBoardColumns(groups: KanbanColumnGroup[]): KanbanColumnGroup[] {
  return groups.filter(({ columnId, stories }) => {
    if (columnId === "🧊" || columnId === "🚫") {
      return stories.length > 0
    }
    return true
  })
}
