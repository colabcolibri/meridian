import assert from "node:assert/strict"
import { test } from "node:test"

import { decisionsWebviewHtml } from "../src/decisions-webview-html.js"
import type { DecisionsPayload } from "../src/load-decisions.js"
import { buildWebviewProjectContext } from "../src/webview-project-context.js"
import type { MeridianWorkspaceInfo } from "../src/meridian-workspace.js"

function extractScript(html: string): string {
  const start = html.indexOf("<script nonce=")
  const openEnd = html.indexOf(">", start)
  const close = html.lastIndexOf("</script>")
  return html.slice(openEnd + 1, close)
}

function workspace(docsRoot: string): MeridianWorkspaceInfo {
  return {
    projectRoot: docsRoot.replace(/\/docs$/, ""),
    docsRoot,
    packageRoot: docsRoot.replace(/\/docs$/, ""),
    projectId: "meridian",
    projectName: "meridian",
    projects: [
      {
        id: "meridian",
        name: "meridian",
        docs: "docs",
        packageRoot: ".",
        source: "discovered",
        usCount: 0,
        isActive: true,
      },
    ],
    kitDetected: true,
    docsExists: true,
    usCount: 0,
  }
}

test("decisions webview emits valid script", () => {
  const payload: DecisionsPayload = {
    totalEntries: 1,
    dates: [
      {
        date: "2026-07-18",
        count: 1,
        entries: [
          {
            time: "14:30",
            title: "Test decision",
            affected_document: "docs/05_architecture.md",
            what_changed: "Added decisions tab.",
            why_changed: "Docs promised it.",
            impact: "Extension UI",
            responsible: "developer",
          },
        ],
      },
    ],
  }
  const context = buildWebviewProjectContext(workspace("/repo/docs"))
  const html = decisionsWebviewHtml(payload, context)
  const script = extractScript(html)
  assert.doesNotThrow(() => {
    new Function(script)
  })
  assert.match(html, /Test decision/)
  assert.match(html, /openDoc/)
})

test("decisions webview shows empty state when no dates", () => {
  const payload: DecisionsPayload = { totalEntries: 0, dates: [] }
  const context = buildWebviewProjectContext(workspace("/repo/docs"))
  const html = decisionsWebviewHtml(payload, context)
  assert.match(html, /No decisions in SQLite yet/)
})
