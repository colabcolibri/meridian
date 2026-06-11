import assert from "node:assert/strict"
import * as fs from "node:fs"
import * as os from "node:os"
import * as path from "node:path"
import { test } from "node:test"

import { epicsWebviewHtml } from "../src/epics-webview-html.js"
import { loadPlanningPayload } from "../src/planning-payload.js"
import { sprintsWebviewHtml } from "../src/sprints-webview-html.js"
import { versionsWebviewHtml } from "../src/versions-webview-html.js"
import {
  FILTER_CHIP_SCRIPT,
  PLANNING_DETAIL_SCRIPT,
  PAGINATION_SCRIPT,
} from "../src/webview-common.js"
import { buildWebviewProjectContext } from "../src/webview-project-context.js"
import type { MeridianWorkspaceInfo } from "../src/meridian-workspace.js"

function extractScript(html: string): string {
  const start = html.indexOf("<script nonce=")
  const openEnd = html.indexOf(">", start)
  const close = html.lastIndexOf("</script>")
  return html.slice(openEnd + 1, close)
}

function workspace(docsRoot: string, payload: ReturnType<typeof loadPlanningPayload>): MeridianWorkspaceInfo {
  return {
    projectRoot: path.dirname(docsRoot),
    docsRoot,
    packageRoot: path.dirname(docsRoot),
    projectId: "app-desktop",
    projectName: "app-desktop",
    projects: [
      {
        id: "app-desktop",
        name: "app-desktop",
        docs: "docs",
        packageRoot: "app-desktop",
        source: "discovered",
        usCount: payload.stories.length,
        isActive: true,
      },
    ],
    kitDetected: true,
    docsExists: true,
    usCount: payload.stories.length,
  }
}

test("planning webview helper scripts parse as JavaScript", () => {
  assert.doesNotThrow(() => {
    new Function(FILTER_CHIP_SCRIPT + PLANNING_DETAIL_SCRIPT + PAGINATION_SCRIPT)
  })
})

test("versions, sprints, and epics webviews emit valid scripts", () => {
  const docsRoot = fs.mkdtempSync(path.join(os.tmpdir(), "meridian-planning-"))
  const sprintsDir = path.join(docsRoot, "sprints")
  const versionsDir = path.join(docsRoot, "versions")
  const usDir = path.join(docsRoot, "us")
  fs.mkdirSync(sprintsDir)
  fs.mkdirSync(versionsDir)
  fs.mkdirSync(usDir)
  fs.writeFileSync(
    path.join(versionsDir, "v1.md"),
    `---
id: v1
title: One
status: active
outcome: Ship it.
---
`,
    "utf-8",
  )
  fs.writeFileSync(
    path.join(sprintsDir, "v1-S1.md"),
    `---
id: v1-S1
version: v1
title: Sprint one
status: active
goal: Prove the flow.
done_when: US-0001 is done.
stories: [US-0001]
---
`,
    "utf-8",
  )
  fs.writeFileSync(
    path.join(usDir, "US-0001.md"),
    `---
id: US-0001
title: Story one
epic: EPIC-01
version: v1
status: "❌"
moscow: Must
depends_on: []
done_when: Done
tests: required
tests_status: pending
---
`,
    "utf-8",
  )

  const payload = loadPlanningPayload(docsRoot)
  const ctx = buildWebviewProjectContext(workspace(docsRoot, payload))

  for (const html of [
    versionsWebviewHtml(payload, ctx),
    sprintsWebviewHtml(payload, ctx),
    epicsWebviewHtml(payload, ctx),
  ]) {
    const script = extractScript(html)
    assert.doesNotThrow(() => {
      new Function(script)
    })
  }
})
