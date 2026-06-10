import assert from "node:assert/strict"
import * as fs from "node:fs"
import * as os from "node:os"
import * as path from "node:path"
import { test } from "node:test"

import {
  applyExclude,
  discoverMeridianProjects,
  isMeridianDocs,
  mergeMeridianProjects,
  resolveMeridianProjects,
} from "../src/resolve-meridian-projects.ts"

function writeKit(root: string): void {
  fs.mkdirSync(path.join(root, ".agent"), { recursive: true })
  fs.writeFileSync(path.join(root, ".agent", "MERIDIAN.md"), "# kit\n")
}

function writeMeridianDocs(docsRoot: string, usId = "US-0001"): void {
  fs.mkdirSync(path.join(docsRoot, "us"), { recursive: true })
  fs.writeFileSync(path.join(docsRoot, "us", `${usId}.md`), "---\n")
}

test("discover finds root docs and nested package docs", () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "meridian-proj-"))
  writeKit(tmp)
  writeMeridianDocs(path.join(tmp, "docs"), "US-0001")
  writeMeridianDocs(path.join(tmp, "apps", "app-osc", "docs"), "US-0002")

  const found = discoverMeridianProjects(tmp)
  assert.equal(found.length, 2)
  assert.ok(found.some((p) => p.docs === "docs"))
  assert.ok(found.some((p) => p.docs === "apps/app-osc/docs"))
})

test("discover skips docs-extra even with 00_scope inside", () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "meridian-proj-"))
  writeKit(tmp)
  const extra = path.join(tmp, "apps", "sistema", "docs-extra")
  fs.mkdirSync(extra, { recursive: true })
  fs.writeFileSync(path.join(extra, "00_scope.md"), "---\n")
  writeMeridianDocs(path.join(tmp, "apps", "sistema", "docs"))

  const found = discoverMeridianProjects(tmp)
  assert.equal(found.length, 1)
  assert.equal(found[0].docs, "apps/sistema/docs")
})

test("merge manifest with discovery and apply exclude", () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "meridian-proj-"))
  writeKit(tmp)
  writeMeridianDocs(path.join(tmp, "docs"))
  writeMeridianDocs(path.join(tmp, "client-a", "docs"), "US-0002")
  writeMeridianDocs(path.join(tmp, "client-b", "docs"), "US-0003")

  fs.mkdirSync(path.join(tmp, ".meridian"), { recursive: true })
  fs.writeFileSync(
    path.join(tmp, ".meridian", "projects.json"),
    JSON.stringify({
      version: 1,
      default: "main",
      projects: [
        { id: "main", name: "Main product", docs: "docs" },
        { id: "b", name: "Client B", docs: "client-b/docs" },
      ],
      exclude: ["client-a/docs"],
    }),
  )

  const merged = resolveMeridianProjects(tmp)
  assert.equal(merged.length, 2)
  assert.ok(merged.some((p) => p.id === "main" && p.name === "Main product"))
  assert.ok(merged.some((p) => p.id === "b"))
  assert.ok(!merged.some((p) => p.docs === "client-a/docs"))
})

test("applyExclude removes exact docs paths only", () => {
  const projects = [
    {
      id: "a",
      name: "A",
      docs: "apps/foo/docs",
      packageRoot: "apps/foo",
      source: "discovered" as const,
    },
  ]
  const out = applyExclude(projects, ["apps/foo/docs"])
  assert.equal(out.length, 0)
})
