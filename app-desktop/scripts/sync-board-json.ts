#!/usr/bin/env npx tsx
/** Optional export: writes docs/kanban/board.json from US frontmatter (git snapshot / CSV). */
import { readFileSync, readdirSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"

import { deriveBoardFromStories } from "../src/domain/meridian/board-derive.ts"
import { parseUserStoryFile } from "../src/domain/meridian/parser.ts"
import { USER_STORY_FILENAME_PATTERN } from "../src/domain/meridian/user-story-id.ts"

const docsUs = resolve(import.meta.dirname, "../docs/us")
const boardPath = resolve(import.meta.dirname, "../docs/kanban/board.json")

const files = readdirSync(docsUs)
  .filter((f) => USER_STORY_FILENAME_PATTERN.test(f))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))

const stories = files.map((filename) => {
  const raw = readFileSync(resolve(docsUs, filename), "utf8")
  return parseUserStoryFile(filename, raw)
})

const board = deriveBoardFromStories(stories)

writeFileSync(boardPath, `${JSON.stringify(board, null, 2)}\n`, "utf8")
console.log(`board.json: ${board.length} entradas`)
