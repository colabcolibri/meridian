import assert from "node:assert/strict"
import { test } from "node:test"

import {
  fileEventTouchesBoardSync,
  isBoardSyncDocsPath,
  relativeDocsPath,
} from "../src/docs-board-sync.ts"

const docs = "/proj/docs"

test("relativeDocsPath normalizes separators", () => {
  assert.equal(
    relativeDocsPath(docs, "/proj/docs/us/US-0042.md"),
    "us/US-0042.md",
  )
})

test("isBoardSyncDocsPath accepts US, board.json, and deliverables", () => {
  assert.equal(isBoardSyncDocsPath(docs, `${docs}/us/US-0001.md`), true)
  assert.equal(isBoardSyncDocsPath(docs, `${docs}/kanban/board.json`), true)
  assert.equal(isBoardSyncDocsPath(docs, `${docs}/epics/EPIC-05.md`), true)
  assert.equal(isBoardSyncDocsPath(docs, `${docs}/versions/v4.md`), true)
  assert.equal(isBoardSyncDocsPath(docs, `${docs}/sprints/v4-S3.md`), true)
  assert.equal(isBoardSyncDocsPath(docs, `${docs}/05_architecture.md`), false)
  assert.equal(isBoardSyncDocsPath(docs, "/proj/README.md"), false)
})

test("fileEventTouchesBoardSync ignores phase docs", () => {
  const touch = fileEventTouchesBoardSync(docs, [
    { newUri: { fsPath: `${docs}/05_architecture.md` } as import("vscode").Uri },
  ])
  assert.equal(touch, false)
})

test("fileEventTouchesBoardSync detects epic changes", () => {
  const touch = fileEventTouchesBoardSync(docs, [
    { newUri: { fsPath: `${docs}/epics/EPIC-01.md` } as import("vscode").Uri },
  ])
  assert.equal(touch, true)
})

test("fileEventTouchesBoardSync detects US renames", () => {
  const touch = fileEventTouchesBoardSync(docs, [
    {
      oldUri: { fsPath: `${docs}/us/US-0001.md` } as import("vscode").Uri,
      newUri: { fsPath: `${docs}/us/US-0099.md` } as import("vscode").Uri,
    },
  ])
  assert.equal(touch, true)
})
