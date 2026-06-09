import * as fs from "node:fs"
import * as os from "node:os"
import * as path from "node:path"

import { writeBoardJson } from "./generate-board.js"
import { loadUserStoriesFromDocs } from "./load-stories.js"
import type { MeridianWorkspaceInfo } from "./meridian-workspace.js"

export function syncBoardFromDocs(info: MeridianWorkspaceInfo): {
  ok: boolean
  written: number
  boardPath: string
  message: string
} {
  const stories = loadUserStoriesFromDocs(info.docsRoot)
  const { written, boardPath } = writeBoardJson(info.docsRoot, stories)
  return {
    ok: true,
    written,
    boardPath,
    message: `Exported ${written} stories to ${boardPath}`,
  }
}

/** Temp dir test helper */
export function writeBoardJsonForTest(stories: Parameters<typeof writeBoardJson>[1]): string {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "meridian-board-"))
  const docs = path.join(tmp, "docs")
  fs.mkdirSync(path.join(docs, "us"), { recursive: true })
  writeBoardJson(docs, stories)
  return path.join(docs, "kanban", "board.json")
}
