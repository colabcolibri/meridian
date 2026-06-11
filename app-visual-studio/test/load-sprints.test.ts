import assert from "node:assert/strict"
import * as fs from "node:fs"
import * as os from "node:os"
import * as path from "node:path"
import { test } from "node:test"

import { loadSprintSummaries } from "../src/load-sprints.js"

test("loadSprintSummaries reads goal, done_when, and stories from frontmatter", () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "meridian-sprints-"))
  const sprintsDir = path.join(tmp, "sprints")
  fs.mkdirSync(sprintsDir)
  fs.writeFileSync(
    path.join(sprintsDir, "v1-S1.md"),
    `---
id: v1-S1
version: v1
title: First sprint
status: active
goal: "Ship the monitor MVP."
done_when: "All Must stories are done."
stories: [US-0001, US-0002]
---
`,
    "utf-8",
  )

  const sprints = loadSprintSummaries(tmp)
  assert.equal(sprints.length, 1)
  assert.equal(sprints[0]?.id, "v1-S1")
  assert.equal(sprints[0]?.goal, "Ship the monitor MVP.")
  assert.equal(sprints[0]?.doneWhen, "All Must stories are done.")
  assert.deepEqual(sprints[0]?.storyIds, ["US-0001", "US-0002"])
})

test("loadSprintSummaries defaults missing optional fields", () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "meridian-sprints-"))
  const sprintsDir = path.join(tmp, "sprints")
  fs.mkdirSync(sprintsDir)
  fs.writeFileSync(
    path.join(sprintsDir, "v0-S1.md"),
    `---
id: v0-S1
version: v0
title: Legacy sprint
status: complete
---
`,
    "utf-8",
  )

  const sprints = loadSprintSummaries(tmp)
  assert.equal(sprints[0]?.goal, "")
  assert.equal(sprints[0]?.doneWhen, "")
  assert.deepEqual(sprints[0]?.storyIds, [])
})
