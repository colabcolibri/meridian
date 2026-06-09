import assert from "node:assert/strict"
import { test } from "node:test"

import { groupStoriesForKanban, resolveKanbanColumn } from "../src/domain/kanban.js"
import type { UserStory } from "../src/domain/types.js"

function story(partial: Partial<UserStory> & Pick<UserStory, "id" | "status">): UserStory {
  return {
    title: partial.id,
    epic: "EPIC-01",
    version: "v1",
    moscow: "Must",
    dependsOn: [],
    doneWhen: "",
    tests: "required",
    testsStatus: "pending",
    ready: true,
    ...partial,
  }
}

test("resolveKanbanColumn maps pending tests to 🧪", () => {
  assert.equal(
    resolveKanbanColumn(story({ id: "US-0001", status: "✅", testsStatus: "pending" })),
    "🧪",
  )
})

test("groupStoriesForKanban sorts cards by id within column", () => {
  const groups = groupStoriesForKanban([
    story({ id: "US-0002", title: "Zebra", status: "❌" }),
    story({ id: "US-0001", title: "Alpha", status: "❌" }),
  ])
  const todo = groups.find((g) => g.columnId === "❌")
  assert.deepEqual(
    todo?.stories.map((s) => s.id),
    ["US-0001", "US-0002"],
  )
})

test("groupStoriesForKanban buckets by column", () => {
  const groups = groupStoriesForKanban([
    story({ id: "US-0001", status: "❌" }),
    story({ id: "US-0002", status: "✅", testsStatus: "done" }),
  ])
  const todo = groups.find((g) => g.columnId === "❌")
  const done = groups.find((g) => g.columnId === "✅")
  assert.equal(todo?.stories.length, 1)
  assert.equal(done?.stories.length, 1)
})
