import assert from "node:assert/strict"
import { test } from "node:test"

import {
  columnHeaderLabel,
  groupStoriesForKanban,
  resolveKanbanColumn,
} from "../src/domain/kanban.js"
import type { UserStory } from "../src/domain/types.js"

function story(partial: Partial<UserStory> & Pick<UserStory, "id" | "status">): UserStory {
  return {
    title: partial.id,
    epic: "EPIC-01",
    version: "v1",
    sprint: null,
    moscow: "Must",
    dependsOn: [],
    doneWhen: "",
    tests: "required",
    testsStatus: "pending",
    ready: true,
    ...partial,
  }
}

test("columnHeaderLabel prefixes board columns for scanability", () => {
  assert.equal(columnHeaderLabel("backlog"), "📋 Backlog")
  assert.equal(columnHeaderLabel("todo"), "📌 Todo")
  assert.equal(columnHeaderLabel("🔶"), "🔶 Partial")
  assert.equal(columnHeaderLabel("🚫"), "🚫 Deprecated")
})

test("resolveKanbanColumn maps pending tests to 🧪", () => {
  assert.equal(
    resolveKanbanColumn(story({ id: "US-0001", status: "✅", testsStatus: "pending" })),
    "🧪",
  )
})

test("resolveKanbanColumn splits ❌ into backlog vs todo by ready", () => {
  assert.equal(
    resolveKanbanColumn(story({ id: "US-0001", status: "❌", ready: false })),
    "backlog",
  )
  assert.equal(
    resolveKanbanColumn(story({ id: "US-0002", status: "❌", ready: true })),
    "todo",
  )
  assert.equal(
    resolveKanbanColumn(story({ id: "US-0003", status: "❌", ready: null })),
    "backlog",
  )
})

test("resolveKanbanColumn maps terminal statuses", () => {
  assert.equal(resolveKanbanColumn(story({ id: "US-0001", status: "🧊" })), "🧊")
  assert.equal(resolveKanbanColumn(story({ id: "US-0002", status: "🚫" })), "🚫")
  assert.equal(
    resolveKanbanColumn(story({ id: "US-0003", status: "🔶", testsStatus: "done" })),
    "🔶",
  )
})

test("groupStoriesForKanban sorts cards by id descending within column", () => {
  const groups = groupStoriesForKanban([
    story({ id: "US-0002", title: "Zebra", status: "❌", ready: true }),
    story({ id: "US-0001", title: "Alpha", status: "❌", ready: true }),
  ])
  const todo = groups.find((g) => g.columnId === "todo")
  assert.deepEqual(
    todo?.stories.map((s) => s.id),
    ["US-0002", "US-0001"],
  )
})

test("groupStoriesForKanban buckets by column", () => {
  const groups = groupStoriesForKanban([
    story({ id: "US-0001", status: "❌", ready: false }),
    story({ id: "US-0002", status: "❌", ready: true }),
    story({ id: "US-0003", status: "✅", testsStatus: "done" }),
  ])
  const backlog = groups.find((g) => g.columnId === "backlog")
  const todo = groups.find((g) => g.columnId === "todo")
  const done = groups.find((g) => g.columnId === "✅")
  assert.equal(backlog?.stories.length, 1)
  assert.equal(todo?.stories.length, 1)
  assert.equal(done?.stories.length, 1)
})
