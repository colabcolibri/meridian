import assert from "node:assert/strict"
import { test } from "node:test"

import type { MeridianWorkspaceInfo } from "../src/meridian-workspace.js"
import {
  buildWebviewProjectContext,
  formatMeridianPanelTitle,
  projectContextToolbarHtml,
} from "../src/webview-project-context.js"

function workspace(overrides: Partial<MeridianWorkspaceInfo> = {}): MeridianWorkspaceInfo {
  return {
    projectRoot: "/repo",
    docsRoot: "/repo/apps/osc/docs",
    packageRoot: "/repo/apps/osc",
    projectId: "osc",
    projectName: "App OSC",
    projects: [
      {
        id: "osc",
        name: "App OSC",
        docs: "apps/app-osc/docs",
        packageRoot: "apps/app-osc",
        source: "manifest",
        usCount: 12,
        isActive: true,
      },
      {
        id: "sistema",
        name: "Sistema",
        docs: "apps/sistema/docs",
        packageRoot: "apps/sistema",
        source: "discovered",
        usCount: 8,
        isActive: false,
      },
    ],
    kitDetected: true,
    docsExists: true,
    usCount: 12,
    ...overrides,
  }
}

test("buildWebviewProjectContext marks multiProject and active docs path", () => {
  const ctx = buildWebviewProjectContext(workspace())
  assert.equal(ctx.multiProject, true)
  assert.equal(ctx.projectName, "App OSC")
  assert.equal(ctx.docsPath, "apps/app-osc/docs")
  assert.equal(ctx.usCount, 12)
  assert.equal(ctx.projects.length, 2)
  assert.equal(ctx.projects[0]?.isActive, true)
})

test("formatMeridianPanelTitle uses project name when multiProject", () => {
  const title = formatMeridianPanelTitle("Board", workspace(), 12)
  assert.equal(title, "Board — App OSC (12)")
})

test("formatMeridianPanelTitle uses docs path when single project", () => {
  const single = workspace({
    projectName: "Main",
    projects: [
      {
        id: "main",
        name: "Main",
        docs: "app-desktop/docs",
        packageRoot: "app-desktop",
        source: "discovered",
        usCount: 100,
        isActive: true,
      },
    ],
  })
  const title = formatMeridianPanelTitle("Versions", single, 5)
  assert.equal(title, "Versions — app-desktop/docs (5)")
})

test("projectContextToolbarHtml includes select when multiProject", () => {
  const ctx = buildWebviewProjectContext(workspace())
  const html = projectContextToolbarHtml(ctx)
  assert.match(html, /project-select/)
  assert.match(html, /Project/)
})

test("projectContextToolbarHtml uses static name when single project", () => {
  const ctx = buildWebviewProjectContext(
    workspace({
      projects: [
        {
          id: "main",
          name: "Main",
          docs: "docs",
          packageRoot: ".",
          source: "discovered",
          usCount: 3,
          isActive: true,
        },
      ],
    }),
  )
  const html = projectContextToolbarHtml(ctx)
  assert.match(html, /project-name/)
  assert.doesNotMatch(html, /project-select/)
})
