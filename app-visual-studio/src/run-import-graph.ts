import { execFileSync } from "node:child_process"
import * as fs from "node:fs"
import * as path from "node:path"

import type { GraphModel } from "./domain/graph-model.js"
import { kitRootFromPackageRoot, resolvePythonCommand } from "./load-from-sqlite.js"

export type ImportGraphResult =
  | { ok: true; model: GraphModel; metaLine: string }
  | { ok: false; error: string }

type ImportGraphJson = {
  nodes: Array<{ id: string; label: string }>
  edges: Array<{ from: string; to: string }>
  meta?: { nodeCount?: number; edgeCount?: number; root?: string }
}

export function resolveImportGraphScript(packageRoot: string): string {
  const kitRoot = kitRootFromPackageRoot(packageRoot)
  return path.join(kitRoot, ".agent", "scripts", "meridian_import_graph.py")
}

export function runImportGraph(packageRoot: string, scopeRoot: string): ImportGraphResult {
  const script = resolveImportGraphScript(packageRoot)
  if (!fs.existsSync(script)) {
    return { ok: false, error: `Import graph script not found: ${script}` }
  }
  const scope = path.resolve(scopeRoot)
  const workspace = path.resolve(packageRoot)
  try {
    scope.startsWith(workspace)
  } catch {
    /* ignore */
  }
  if (!scope.startsWith(workspace + path.sep) && scope !== workspace) {
    return { ok: false, error: `Scope must be inside workspace: ${workspace}` }
  }
  try {
    const python = resolvePythonCommand()
    const stdout = execFileSync(
      python,
      [script, "--root", scope, "--workspace", workspace, "--format", "json"],
      { encoding: "utf-8", maxBuffer: 20 * 1024 * 1024 },
    )
    const parsed = JSON.parse(stdout) as ImportGraphJson
    const model: GraphModel = {
      nodes: (parsed.nodes ?? []).map((n) => ({ id: n.id, label: n.label || n.id })),
      edges: (parsed.edges ?? []).map((e) => ({ from: e.from, to: e.to })),
    }
    const meta = parsed.meta ?? {}
    return {
      ok: true,
      model,
      metaLine: `${meta.nodeCount ?? model.nodes.length} nodes · ${meta.edgeCount ?? model.edges.length} edges · ${scope}`,
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return { ok: false, error: `Import graph CLI failed: ${message}` }
  }
}
