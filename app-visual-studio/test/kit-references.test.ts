import assert from "node:assert/strict"
import * as path from "node:path"
import { test } from "node:test"

import { KIT_REFERENCES, kitReferencePath } from "../src/kit-references.js"
import type { MeridianWorkspaceInfo } from "../src/meridian-workspace.js"

test("kitReferencePath resolves agents-help under project root", () => {
  const info: MeridianWorkspaceInfo = {
    projectRoot: "/repo",
    docsRoot: "/repo/docs",
    packageRoot: "/repo",
    projectId: "meridian",
    projectName: "Desktop",
    projects: [],
    kitDetected: true,
    docsExists: true,
    usCount: 0,
  }
  assert.equal(
    kitReferencePath(info, KIT_REFERENCES.agentsHelp),
    path.join("/repo", ".agent", "references", "agents-help.md"),
  )
})
