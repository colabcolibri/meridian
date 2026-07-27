import assert from "node:assert/strict"
import { test } from "node:test"

import type { MeridianWorkspaceInfo } from "../src/meridian-workspace.js"
import {
  formatImportGraphScopeLabel,
  resolveImportGraphScope,
} from "../src/resolve-import-graph-scope.js"

function workspace(overrides: Partial<MeridianWorkspaceInfo> = {}): MeridianWorkspaceInfo {
  return {
    projectRoot: "/repo",
    docsRoot: "/repo/docs",
    packageRoot: "/repo",
    projectId: "main",
    projectName: "Meridian",
    projects: [],
    kitDetected: true,
    docsExists: true,
    usCount: 1,
    ...overrides,
  }
}

test("resolveImportGraphScope returns active packageRoot", () => {
  assert.equal(resolveImportGraphScope(workspace()), "/repo")
  assert.equal(
    resolveImportGraphScope(workspace({ packageRoot: "/repo/apps/shop" })),
    "/repo/apps/shop",
  )
})

test("formatImportGraphScopeLabel shows project name for root package", () => {
  assert.equal(formatImportGraphScopeLabel(workspace({ projectName: "Meridian" })), "Meridian")
})

test("formatImportGraphScopeLabel shows path for nested package", () => {
  const info = workspace({ projectName: "Shop", packageRoot: "/repo/apps/shop" })
  assert.equal(formatImportGraphScopeLabel(info), "Shop (apps/shop)")
})
