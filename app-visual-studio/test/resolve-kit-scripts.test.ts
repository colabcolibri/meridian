import assert from "node:assert/strict"
import * as fs from "node:fs"
import * as os from "node:os"
import * as path from "node:path"
import { describe, it } from "node:test"

import { kitRootFromPackageRoot } from "../src/load-from-sqlite.js"
import {
  resolveExportScriptPath,
  scriptsSupportDeliveryForm,
} from "../src/resolve-kit-scripts.js"

describe("resolve kit scripts", () => {
  const extRoot = path.join(import.meta.dirname, "..")

  it("resolves kit scripts from monorepo root when package has only meridian.db", () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "meridian-kit-nested-"))
    try {
      const kitScripts = path.join(tmp, ".agent", "scripts")
      fs.mkdirSync(kitScripts, { recursive: true })
      fs.writeFileSync(path.join(tmp, ".agent", "MERIDIAN.md"), "# kit\n")
      fs.writeFileSync(path.join(kitScripts, "meridian_db_export.py"), "# export\n")
      fs.writeFileSync(path.join(kitScripts, "meridian_delivery_form.py"), "# form\n")

      const packageRoot = path.join(tmp, "apps", "app-osc")
      fs.mkdirSync(path.join(packageRoot, ".meridian"), { recursive: true })
      fs.writeFileSync(path.join(packageRoot, ".meridian", "meridian.db"), "")

      assert.equal(kitRootFromPackageRoot(packageRoot), tmp)
      const script = resolveExportScriptPath(packageRoot)
      assert.equal(script, path.join(kitScripts, "meridian_db_export.py"))
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true })
    }
  })

  it("prefers nearest script-capable kit over stub .agent/MERIDIAN.md without scripts", () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "meridian-kit-stub-"))
    try {
      const kitScripts = path.join(tmp, ".agent", "scripts")
      fs.mkdirSync(kitScripts, { recursive: true })
      fs.writeFileSync(path.join(tmp, ".agent", "MERIDIAN.md"), "# root kit\n")
      fs.writeFileSync(path.join(kitScripts, "meridian_db_export.py"), "# export\n")
      fs.writeFileSync(path.join(kitScripts, "meridian_delivery_form.py"), "# form\n")

      const packageRoot = path.join(tmp, "apps", "app-osc")
      fs.mkdirSync(path.join(packageRoot, ".agent"), { recursive: true })
      fs.writeFileSync(path.join(packageRoot, ".agent", "MERIDIAN.md"), "# stub\n")
      fs.mkdirSync(path.join(packageRoot, ".meridian"), { recursive: true })
      fs.writeFileSync(path.join(packageRoot, ".meridian", "meridian.db"), "")

      assert.equal(kitRootFromPackageRoot(packageRoot), tmp)
      const script = resolveExportScriptPath(packageRoot)
      assert.equal(script, path.join(kitScripts, "meridian_db_export.py"))
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true })
    }
  })

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
