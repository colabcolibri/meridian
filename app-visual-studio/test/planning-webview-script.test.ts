import assert from "node:assert/strict"
import * as path from "node:path"
import { test } from "node:test"

import { epicsWebviewHtml } from "../src/epics-webview-html.js"
import type { PlanningPayload } from "../src/planning-payload.js"
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

function workspace(docsRoot: string, payload: PlanningPayload): MeridianWorkspaceInfo {
  return {
    projectRoot: path.dirname(docsRoot),
    docsRoot,
    packageRoot: path.dirname(docsRoot),
    projectId: "meridian",
    projectName: "meridian",
    projects: [
      {
        id: "meridian",
        name: "meridian",
        docs: "docs",
        packageRoot: ".",
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
  const payload = {
    versions: [{ id: "v1", title: "One", status: "active", outcome: "Ship it." }],
    epics: [{ id: "EPIC-01", title: "Epic", status: "active", outcome: "", versions: ["v1"] }],
    sprints: [
      {
        id: "v1-S1",
        title: "Sprint one",
        version: "v1",
        status: "active",
        goal: "Prove the flow.",
        doneWhen: "US-0001 is done.",
        stories: ["US-0001"],
      },
    ],
    stories: [
      {
        id: "US-0001",
        title: "Story one",
        epic: "EPIC-01",
        version: "v1",
        status: "❌" as const,
        moscow: "Must" as const,
        dependsOn: [],
        doneWhen: "Done",
        tests: "required" as const,
        testsStatus: "pending" as const,
        ready: false,
      },
    ],
  }
  const docsRoot = "/tmp/meridian-test-docs"
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
