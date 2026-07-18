import { execFileSync } from "node:child_process"
import * as fs from "node:fs"
import * as os from "node:os"
import * as path from "node:path"

import { writeBoardJson } from "./generate-board.js"
import { kitRootFromPackageRoot, resolvePythonCommand, sqliteDbExists } from "./load-from-sqlite.js"
import type { MeridianWorkspaceInfo } from "./meridian-workspace.js"

function generateBoardScriptPath(packageRoot: string): string | null {
  const kitRoot = kitRootFromPackageRoot(packageRoot)
  const script = path.join(kitRoot, ".agent", "scripts", "generate_board.py")
  return fs.existsSync(script) ? script : null
}

/** Regenerate docs/kanban/board.json from SQLite only (v10+). */
export function syncBoardFromDocs(info: MeridianWorkspaceInfo): {
  ok: boolean
  written: number
  boardPath: string
  message: string
} {
  const boardPath = path.join(info.docsRoot, "kanban", "board.json")

  if (!sqliteDbExists(info.packageRoot)) {
    return {
      ok: false,
      written: 0,
      boardPath,
      message: `Meridian: .meridian/meridian.db not found under ${info.packageRoot}`,
    }
  }

  const script = generateBoardScriptPath(info.packageRoot)
  if (!script) {
    return {
      ok: false,
      written: 0,
      boardPath,
      message: "Meridian: generate_board.py not found in kit.",
    }
  }

  const python = resolvePythonCommand()
  try {
    const output = execFileSync(python, [script, info.packageRoot], {
      encoding: "utf-8",
    }).trim()
    const raw = fs.readFileSync(boardPath, "utf-8")
    const entries = JSON.parse(raw) as unknown[]
    const written = Array.isArray(entries) ? entries.length : 0
    if (written === 0) {
      return {
        ok: false,
        written: 0,
        boardPath,
        message: "Meridian: generate_board.py wrote zero stories.",
      }
    }
    return {
      ok: true,
      written,
      boardPath,
      message: output || `Exported ${written} stories to ${boardPath}`,
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return {
      ok: false,
      written: 0,
      boardPath,
      message: `Meridian: sync board failed (${python}): ${message}`,
    }
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
