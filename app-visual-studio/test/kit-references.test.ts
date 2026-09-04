import assert from "node:assert/strict"
import * as path from "node:path"
import { test } from "node:test"

import { KIT_REFERENCES, kitReferencePath } from "../src/kit-references.js"
import type { MeridianWorkspaceInfo } from "../src/meridian-workspace.js"

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

test("kitReferencePath resolves kit v2 reference paths under project root", () => {
  assert.equal(
    kitReferencePath(info, KIT_REFERENCES.agentsHelp),
    path.join("/repo", ".agent", "references", "guides", "agents-help.md"),
  )
  assert.equal(
    kitReferencePath(info, KIT_REFERENCES.startHere),
    path.join("/repo", ".agent", "references", "guides", "start-here.md"),
  )
  assert.equal(
    kitReferencePath(info, KIT_REFERENCES.howToUse),
    path.join("/repo", ".agent", "references", "guides", "how-to-use.md"),
  )
  assert.equal(
    kitReferencePath(info, KIT_REFERENCES.artifactReference),
    path.join("/repo", ".agent", "references", "protocol", "artifact-reference.md"),
  )
})
