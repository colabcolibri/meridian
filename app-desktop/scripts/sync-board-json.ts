#!/usr/bin/env npx tsx
/** Regenera docs/kanban/board.json a partir dos frontmatters das US. */
import { readFileSync, readdirSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"

import { parseUserStoryFile } from "../src/domain/meridian/parser.ts"

const docsUs = resolve(import.meta.dirname, "../docs/us")
const boardPath = resolve(import.meta.dirname, "../docs/kanban/board.json")

const files = readdirSync(docsUs)
  .filter((f) => /^US-\d{4}\.md$/.test(f))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))

const board = files.map((filename) => {
  const raw = readFileSync(resolve(docsUs, filename), "utf8")
  const story = parseUserStoryFile(filename, raw)
  return {
    id: story.id,
    title: story.title,
    epic: story.epic,
    version: story.version,
    status: story.status,
    moscow: story.moscow,
    depends_on: story.dependsOn,
    done_when: story.doneWhen,
    tests: story.tests,
    tests_status: story.testsStatus,
  }
})

writeFileSync(boardPath, `${JSON.stringify(board, null, 2)}\n`, "utf8")
console.log(`board.json: ${board.length} entradas`)
