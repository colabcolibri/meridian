import assert from "node:assert/strict"
import { test } from "node:test"

import {
  fileEventTouchesMeridianDb,
  isMeridianDbPath,
  meridianDbPath,
} from "../src/docs-board-sync.js"

test("isMeridianDbPath matches package .meridian/meridian.db", () => {
  const pkg = "/proj"
  const db = meridianDbPath(pkg)
  assert.equal(isMeridianDbPath(pkg, db), true)
  assert.equal(isMeridianDbPath(pkg, "/proj/README.md"), false)
})

test("fileEventTouchesMeridianDb detects db renames", () => {
  const pkg = "/proj"
  const db = meridianDbPath(pkg)
  assert.equal(
    fileEventTouchesMeridianDb(pkg, [{ newUri: { fsPath: db } as import("vscode").Uri }]),
    true,
  )
  assert.equal(
    fileEventTouchesMeridianDb(pkg, [{ newUri: { fsPath: "/proj/docs/00_scope.md" } as import("vscode").Uri }]),
    false,
  )
})
