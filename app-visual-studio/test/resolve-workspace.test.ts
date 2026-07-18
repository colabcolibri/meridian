import assert from "node:assert/strict"
import * as fs from "node:fs"
import * as os from "node:os"
import * as path from "node:path"
import { test } from "node:test"

import {
  formatStatusTooltip,
  resolveMeridianWorkspaceFromPaths,
} from "../src/meridian-workspace.ts"

function writeKit(root: string): void {
  const agent = path.join(root, ".agent")
  fs.mkdirSync(agent, { recursive: true })
  fs.writeFileSync(path.join(agent, "MERIDIAN.md"), "# kit\n")
}

function writeDocs(root: string, usIds: string[]): void {
  const usDir = path.join(root, "docs", "us")
  fs.mkdirSync(usDir, { recursive: true })
  for (const id of usIds) {
    fs.writeFileSync(path.join(usDir, `${id}.md`), "---\n")
  }
}

test("client project: kit and docs at workspace root", () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "meridian-ws-"))
  writeKit(tmp)
  writeDocs(tmp, ["US-0001", "US-0002"])

  const info = resolveMeridianWorkspaceFromPaths(tmp)
  assert.ok(info)
  assert.equal(info.projectRoot, tmp)
  assert.equal(info.docsExists, true)
  assert.equal(info.usCount, 2)
  assert.match(formatStatusTooltip(info), /User stories \(active\): 2/)
})

test("nested app folder: kit at parent, docs in workspace", () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "meridian-ws-"))
  writeKit(tmp)
  const app = path.join(tmp, "my-app")
  fs.mkdirSync(app)
  writeDocs(app, ["US-0042"])

  const info = resolveMeridianWorkspaceFromPaths(app)
  assert.ok(info)
  assert.equal(info.projectRoot, tmp)
  assert.equal(path.basename(info.docsRoot), "docs")
  assert.equal(info.usCount, 1)
})

test("kit without docs warns via docsExists false", () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "meridian-ws-"))
  writeKit(tmp)

  const info = resolveMeridianWorkspaceFromPaths(tmp)
  assert.ok(info)
  assert.equal(info.docsExists, false)
  assert.equal(info.usCount, 0)
  assert.match(formatStatusTooltip(info), /docs\/ folder missing/)
})

test("non-Meridian folder returns null", () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "meridian-ws-"))
  assert.equal(resolveMeridianWorkspaceFromPaths(tmp), null)
})

test("monorepo root: kit at root, docs in nested package folder", () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "meridian-ws-"))
  writeKit(tmp)
  writeDocs(path.join(tmp, "my-product"), ["US-0099"])

  const info = resolveMeridianWorkspaceFromPaths(tmp)
  assert.ok(info)
  assert.equal(info.docsExists, true)
  assert.equal(info.usCount, 1)
  assert.ok(info.docsRoot.endsWith("my-product/docs"))
  assert.equal(info.packageRoot, path.join(tmp, "my-product"))
  assert.equal(info.projects.length, 1)
})
