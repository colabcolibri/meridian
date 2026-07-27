import assert from "node:assert/strict"
import * as fs from "node:fs"
import * as os from "node:os"
import * as path from "node:path"
import { test } from "node:test"

import { resolveImportGraphScript } from "../src/run-import-graph.js"

test("resolveImportGraphScript walks up from active package to shared monorepo kit", () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "meridian-import-graph-"))
  try {
    const kitScripts = path.join(tmp, ".agent", "scripts")
    fs.mkdirSync(kitScripts, { recursive: true })
    fs.writeFileSync(path.join(kitScripts, "meridian_db_export.py"), "# export\n")
    fs.writeFileSync(path.join(kitScripts, "meridian_import_graph.py"), "# graph\n")

    const packageRoot = path.join(tmp, "apps", "app-osc")
    fs.mkdirSync(path.join(packageRoot, ".meridian"), { recursive: true })
    fs.writeFileSync(path.join(packageRoot, ".meridian", "meridian.db"), "")

    const script = resolveImportGraphScript(packageRoot)
    assert.equal(script, path.join(kitScripts, "meridian_import_graph.py"))
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true })
  }
})
