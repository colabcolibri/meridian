import assert from "node:assert/strict"
import * as fs from "node:fs"
import * as os from "node:os"
import * as path from "node:path"
import { describe, it } from "node:test"

import {
  resolveExportScriptPath,
  scriptsSupportDeliveryForm,
} from "../src/resolve-kit-scripts.js"

describe("resolve kit scripts", () => {
  const extRoot = path.join(import.meta.dirname, "..")
  const repoRoot = path.join(extRoot, "..")

  it("finds form-capable scripts from monorepo kit when workspace kit is stale", () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "meridian-kit-resolve-"))
    try {
      fs.mkdirSync(path.join(tmp, ".meridian"), { recursive: true })
      fs.writeFileSync(path.join(tmp, ".meridian", "meridian.db"), "")
      fs.mkdirSync(path.join(tmp, ".agent", "scripts"), { recursive: true })
      fs.writeFileSync(path.join(tmp, ".agent", "MERIDIAN.md"), "# stale\n")
      fs.writeFileSync(
        path.join(tmp, ".agent", "scripts", "meridian_db_export.py"),
        "# old export without form\n",
      )
      assert.equal(scriptsSupportDeliveryForm(path.join(tmp, ".agent", "scripts")), false)
      const script = resolveExportScriptPath(tmp, extRoot)
      assert.ok(script, "expected fallback to extension/monorepo kit scripts")
      assert.equal(
        fs.existsSync(path.join(path.dirname(script!), "meridian_delivery_form.py")),
        true,
      )
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true })
    }
  })
})
