// Board domain — single responsibility: map stories to kanban columns.
// Mirrors app-visual-studio/src/board-webview-html.ts (COLUMN_ORDER + resolveColumn).

import type { Story } from "./data.ts"

export const COLUMN_ORDER = ["backlog", "todo", "🔶", "🧪", "✅", "🧊", "🚫"] as const
export type ColumnKey = (typeof COLUMN_ORDER)[number]

const COLUMN_LABELS: Record<ColumnKey, string> = {
  backlog: "📋 Backlog",
  todo: "📌 Todo",
  "🔶": "🔶 Partial",
  "🧪": "🧪 Tests",
  "✅": "✅ Done",
  "🧊": "🧊 Frozen",
  "🚫": "🚫 Deprecated",
}

// Columns hidden when empty (same default as the VSCode board).
const HIDDEN_WHEN_EMPTY: ColumnKey[] = ["🧊", "🚫"]

export function columnHeaderLabel(col: string): string {
  return COLUMN_LABELS[col as ColumnKey] ?? col
}

export function resolveColumn(story: Story): ColumnKey {
  if (story.status === "🧊") return "🧊"
  if (story.status === "🚫") return "🚫"
  if (story.status === "❌") return story.ready === true ? "todo" : "backlog"
  if (story.tests === "required" && story.testsStatus === "pending") return "🧪"
  const status = story.status as ColumnKey
  return COLUMN_ORDER.includes(status) ? status : "backlog"
}

function compareByIdDesc(a: Story, b: Story): number {
  return b.id.localeCompare(a.id, undefined, { numeric: true })
}

export function buildColumns(stories: Story[]): { key: ColumnKey; label: string; stories: Story[] }[] {
  const buckets = new Map<ColumnKey, Story[]>()
  for (const key of COLUMN_ORDER) {
    buckets.set(key, [])
  }
  for (const story of stories) {
    buckets.get(resolveColumn(story))!.push(story)
  }
  for (const list of buckets.values()) {
    list.sort(compareByIdDesc)
  }
  return COLUMN_ORDER.filter(
    (key) => !HIDDEN_WHEN_EMPTY.includes(key) || buckets.get(key)!.length > 0,
  ).map((key) => ({ key, label: columnHeaderLabel(key), stories: buckets.get(key)! }))
}

export function countByColumn(stories: Story[]): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const story of stories) {
    const key = resolveColumn(story)
    counts[key] = (counts[key] ?? 0) + 1
  }
  return counts
}
