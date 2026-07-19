import { execFileSync } from "node:child_process"

import {
  resolvePythonCommand,
  sqliteDbExists,
} from "./load-from-sqlite.js"
import { resolveExportScriptPath } from "./resolve-kit-scripts.js"

export type DecisionEntry = {
  time?: string
  title?: string
  affected_document?: string
  what_changed?: string
  why_changed?: string
  impact?: string
  responsible?: string
}

export type DecisionDay = {
  date: string
  count: number
  entries: DecisionEntry[]
}

export type DecisionsPayload = {
  dates: DecisionDay[]
  totalEntries: number
}

export type DecisionsLoadResult = {
  payload: DecisionsPayload | null
  error: string | null
}

export function loadDecisionsPayloadDetailed(
  packageRoot: string,
  extensionPath?: string,
): DecisionsLoadResult {
  if (!sqliteDbExists(packageRoot)) {
    return { payload: null, error: null }
  }
  const script = resolveExportScriptPath(packageRoot, extensionPath)
  if (!script) {
    return {
      payload: null,
      error: `Kit script not found for ${packageRoot}`,
    }
  }
  const python = resolvePythonCommand()
  try {
    const stdout = execFileSync(
      python,
      [script, packageRoot, "--format", "decisions"],
      { encoding: "utf-8", maxBuffer: 8 * 1024 * 1024 },
    )
    const data = JSON.parse(stdout) as DecisionsPayload
    return {
      payload: {
        dates: data.dates ?? [],
        totalEntries: data.totalEntries ?? 0,
      },
      error: null,
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return {
      payload: null,
      error: `SQLite decisions export failed (${python}): ${message}`,
    }
  }
}

export function loadDecisionsPayload(
  packageRoot: string,
  extensionPath?: string,
): DecisionsPayload | null {
  return loadDecisionsPayloadDetailed(packageRoot, extensionPath).payload
}
