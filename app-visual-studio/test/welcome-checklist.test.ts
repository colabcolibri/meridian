import assert from "node:assert/strict"
import { describe, it } from "node:test"

import { buildWelcomeChecklist } from "../src/welcome-webview-html.js"

describe("welcome checklist", () => {
  it("marks incomplete workspace steps as pending", () => {
    const items = buildWelcomeChecklist(null)
    assert.equal(items.length, 5)
    assert.equal(items.every((i) => !i.done), true)
  })

  it("marks first-value complete when kit docs and delivery exist", () => {
    const items = buildWelcomeChecklist({
      projectRoot: "/proj",
      docsRoot: "/proj/docs",
      packageRoot: "/proj",
      projectId: "main",
      projectName: "Main",
      projects: [],
      kitDetected: true,
      kitInstalled: true,
      docsExists: true,
      meridianDbExists: true,
      cursorAdaptersSynced: true,
      usCount: 3,
    })
    const done = items.filter((i) => i.done).map((i) => i.id)
    assert.deepEqual(done, ["kit", "docs", "delivery", "adapters", "board"])
  })
})
