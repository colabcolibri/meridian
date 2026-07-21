import assert from "node:assert/strict"
import { test } from "node:test"

import { storyToBoardEntry, storiesToBoardEntries } from "../src/generate-board.js"
import type { UserStory } from "../src/domain/types.js"

const sample: UserStory = {
  id: "US-0001",
  title: "Sample",
  epic: "EPIC-01",
  version: "v0",
  sprint: null,
  status: "❌",
  moscow: "Must",
  dependsOn: [],
  doneWhen: "Done when.",
  tests: "required",
  testsStatus: "pending",
  ready: false,
}

test("storyToBoardEntry maps depends_on field name", () => {
  const entry = storyToBoardEntry(sample)
  assert.equal(entry.depends_on.length, 0)
  assert.equal(entry.tests_status, "pending")
  assert.equal(entry.done_when, "Done when.")
  assert.equal(entry.ready, false)
})

test("storiesToBoardEntries preserves ids", () => {
  assert.equal(storiesToBoardEntries([sample])[0].id, "US-0001")
})
