import assert from "node:assert/strict"
import { test } from "node:test"

import { buildBoardPayload } from "../src/board-webview-html.js"
import type { UserStory } from "../src/domain/types.js"

function story(id: string, version: string, epic = "EPIC-01"): UserStory {
  return {
    id,
    title: id,
    epic,
    version,
    status: "❌",
    moscow: "Must",
    dependsOn: [],
    doneWhen: "",
    tests: "required",
    testsStatus: "pending",
    ready: true,
  }
}

test("buildBoardPayload defaults to all versions selected", () => {
  const payload = buildBoardPayload(
    [story("US-0001", "v1"), story("US-0002", "v2"), story("US-0003", "v1")],
    [{ id: "EPIC-01", title: "Epic", versions: ["v1", "v2"] }],
    [
      { id: "v2", title: "Two", status: "complete" },
      { id: "v1", title: "One", status: "complete" },
    ],
  )
  assert.deepEqual(payload.defaultVersions, ["v1", "v2"])
})
