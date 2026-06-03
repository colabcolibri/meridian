import { describe, expect, it } from "vitest"

import {
  countFrozenStories,
  countKanbanColumns,
  groupStoriesForKanban,
  resolveKanbanColumn,
  visibleKanbanColumns,
} from "@/domain/meridian/kanban-columns"
import type { UserStory } from "@/domain/meridian/types"

const baseStory: UserStory = {
  id: "US-0099",
  title: "Example",
  epic: "EPIC-01",
  version: "v1",
  status: "✅",
  moscow: "Must",
  dependsOn: [],
  doneWhen: "done",
  tests: "required",
  testsStatus: "pending",
}

describe("kanban columns", () => {
  it("derives 🧪 when tests_status is pending", () => {
    expect(resolveKanbanColumn(baseStory)).toBe("🧪")
  })

  it("keeps ✅ when tests_status is done", () => {
    expect(resolveKanbanColumn({ ...baseStory, testsStatus: "done" })).toBe("✅")
  })

  it("keeps ❌ even with pending tests", () => {
    expect(resolveKanbanColumn({ ...baseStory, status: "❌" })).toBe("❌")
  })

  it("ignores tests when tests: none", () => {
    expect(
      resolveKanbanColumn({
        ...baseStory,
        tests: "none",
        testsStatus: "n/a",
      }),
    ).toBe("✅")
  })

  it("keeps workflow columns visible when empty and hides frozen by default", () => {
    const stories: UserStory[] = [
      { ...baseStory, id: "US-0001", status: "❌", testsStatus: "pending" },
      { ...baseStory, id: "US-0002", status: "✅", testsStatus: "done" },
      { ...baseStory, id: "US-0003", status: "🧊", tests: "none", testsStatus: "n/a" },
    ]

    const grouped = groupStoriesForKanban(stories)
    const visible = visibleKanbanColumns(grouped, { showFrozen: false })

    expect(visible.map((column) => column.columnId)).toEqual(["❌", "🔶", "🧪", "✅"])
    expect(countFrozenStories(stories)).toBe(1)
  })

  it("shows frozen column when toggled on", () => {
    const stories: UserStory[] = [
      { ...baseStory, id: "US-0003", status: "🧊", tests: "none", testsStatus: "n/a" },
    ]

    const grouped = groupStoriesForKanban(stories)
    expect(
      visibleKanbanColumns(grouped, { showFrozen: false }).map((c) => c.columnId),
    ).toEqual(["❌", "🔶", "🧪", "✅"])
    expect(
      visibleKanbanColumns(grouped, { showFrozen: true }).map((c) => c.columnId),
    ).toEqual(["❌", "🔶", "🧪", "✅", "🧊"])
  })

  it("preserves column order when multiple lanes are visible", () => {
    const stories: UserStory[] = [
      { ...baseStory, id: "US-0001", status: "✅", testsStatus: "done" },
      { ...baseStory, id: "US-0002", status: "🔶", tests: "none", testsStatus: "n/a" },
      { ...baseStory, id: "US-0003", status: "❌", testsStatus: "pending" },
    ]

    const visible = visibleKanbanColumns(groupStoriesForKanban(stories), {
      showFrozen: false,
    })
    expect(visible.map((column) => column.columnId)).toEqual(["❌", "🔶", "🧪", "✅"])
  })

  it("countKanbanColumns matches visible grid counts and hides zero lanes", () => {
    const stories: UserStory[] = [
      { ...baseStory, id: "US-0001", status: "❌", testsStatus: "pending" },
      { ...baseStory, id: "US-0002", status: "🔶", tests: "none", testsStatus: "n/a" },
      { ...baseStory, id: "US-0003", status: "✅", testsStatus: "done" },
      { ...baseStory, id: "US-0004", status: "🧊", tests: "none", testsStatus: "n/a" },
    ]

    expect(countKanbanColumns(stories, { showFrozen: false })).toEqual([
      { columnId: "❌", count: 1 },
      { columnId: "🔶", count: 1 },
      { columnId: "✅", count: 1 },
    ])

    expect(countKanbanColumns(stories, { showFrozen: true })).toEqual([
      { columnId: "❌", count: 1 },
      { columnId: "🔶", count: 1 },
      { columnId: "✅", count: 1 },
      { columnId: "🧊", count: 1 },
    ])
  })

  it("countKanbanColumns derives 🧪 separately from ✅", () => {
    const stories: UserStory[] = [
      { ...baseStory, id: "US-0001", status: "✅", testsStatus: "pending" },
      { ...baseStory, id: "US-0002", status: "✅", testsStatus: "done" },
    ]

    expect(countKanbanColumns(stories, { showFrozen: false })).toEqual([
      { columnId: "🧪", count: 1 },
      { columnId: "✅", count: 1 },
    ])
  })
})
