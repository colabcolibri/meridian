import assert from "node:assert/strict"
import { execFileSync } from "node:child_process"
import * as fs from "node:fs"
import * as os from "node:os"
import * as path from "node:path"
import { test } from "node:test"

import {
  formatStatusTooltip,
  resolveMeridianWorkspaceFromPaths,
} from "../src/meridian-workspace.ts"

const KIT_ROOT = path.resolve(import.meta.dirname, "../..")

function writeKit(root: string): void {
  fs.cpSync(path.join(KIT_ROOT, ".agent"), path.join(root, ".agent"), { recursive: true })
}

function writeDocsScope(root: string): void {
  const docs = path.join(root, "docs")
  fs.mkdirSync(docs, { recursive: true })
  fs.writeFileSync(path.join(docs, "00_scope.md"), "---\nstatus: draft\n---\n# scope\n")
}

function seedSqliteStories(packageRoot: string, storyIds: string[]): void {
  const bootstrap = path.join(KIT_ROOT, ".agent", "scripts", "bootstrap_meridian_db.py")
  execFileSync("python3", [bootstrap, packageRoot], { encoding: "utf-8" })
  if (storyIds.length === 0) {
    return
  }
  const py = `
import sqlite3, json
from pathlib import Path
root = Path(${JSON.stringify(packageRoot)})
conn = sqlite3.connect(root / ".meridian" / "meridian.db")
conn.execute("INSERT OR IGNORE INTO versions (id, title, status) VALUES ('v1', 'Test', 'active')")
conn.execute("INSERT OR IGNORE INTO epics (id, title, status) VALUES ('EPIC-01', 'Epic', 'active')")
for sid in ${JSON.stringify(storyIds)}:
    conn.execute(
        """INSERT OR REPLACE INTO user_stories (
          id, title, epic_id, version_id, status, moscow, depends_on_json, ready,
          done_when, tests, tests_status, body_markdown
        ) VALUES (?, ?, 'EPIC-01', 'v1', '❌', 'Must', '[]', 0, 'done', 'required', 'pending', ?)""",
        (sid, sid, f"---\\nid: {sid}\\n---\\n"),
    )
conn.commit()
conn.close()
`
  execFileSync("python3", ["-c", py], { encoding: "utf-8" })
}

test("client project: kit and docs at workspace root", () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "meridian-ws-"))
  writeKit(tmp)
  writeDocsScope(tmp)
  seedSqliteStories(tmp, ["US-0001", "US-0002"])

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
  writeDocsScope(app)
  seedSqliteStories(app, ["US-0042"])

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
  const product = path.join(tmp, "my-product")
  writeDocsScope(product)
  seedSqliteStories(product, ["US-0099"])

  const info = resolveMeridianWorkspaceFromPaths(tmp)
  assert.ok(info)
  assert.equal(info.docsExists, true)
  assert.equal(info.usCount, 1)
  assert.ok(info.docsRoot.endsWith("my-product/docs"))
  assert.equal(info.packageRoot, path.join(tmp, "my-product"))
  assert.equal(info.projects.length, 1)
})
