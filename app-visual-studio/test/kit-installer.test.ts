import assert from "node:assert/strict"
import * as fs from "node:fs"
import * as os from "node:os"
import * as path from "node:path"
import { describe, it } from "node:test"

import {
  bundledKitAgentDir,
  installBundledKit,
  kitInstalledAt,
} from "../src/kit-installer.js"

describe("kit-installer", () => {
  it("resolves monorepo .agent when bundled/ is absent (dev)", () => {
    const extRoot = path.join(import.meta.dirname, "..")
    const resolved = bundledKitAgentDir(extRoot)
    assert.equal(fs.existsSync(path.join(resolved, "MERIDIAN.md")), true)
  })

  it("installBundledKit copies kit into empty workspace", () => {
    const extRoot = path.join(import.meta.dirname, "..")
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "meridian-kit-"))
    try {
      assert.equal(kitInstalledAt(tmp), false)
      const result = installBundledKit(tmp, extRoot)
      assert.equal(result.ok, true)
      assert.equal(kitInstalledAt(tmp), true)
      assert.equal(fs.existsSync(path.join(tmp, ".agent", "MERIDIAN.md")), true)
      const stamped = fs.readFileSync(path.join(tmp, ".agent", "VERSION"), "utf8").trim()
      const pkg = JSON.parse(
        fs.readFileSync(path.join(extRoot, "package.json"), "utf8"),
      ) as { version: string }
      assert.equal(stamped, pkg.version)
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true })
    }
  })

  it("installBundledKit refuses overwrite without force", () => {
    const extRoot = path.join(import.meta.dirname, "..")
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "meridian-kit-"))
    try {
      installBundledKit(tmp, extRoot)
      const again = installBundledKit(tmp, extRoot)
      assert.equal(again.ok, false)
      assert.match(again.message, /already exists/)
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true })
    }
  })

  it("installBundledKit creates backup on force upgrade", () => {
    const extRoot = path.join(import.meta.dirname, "..")
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "meridian-kit-bak-"))
    try {
      installBundledKit(tmp, extRoot)
      const marker = path.join(tmp, ".agent", "MERIDIAN.md")
      fs.writeFileSync(marker, "# custom local marker\n", "utf8")
      const upgrade = installBundledKit(tmp, extRoot, { force: true })
      assert.equal(upgrade.ok, true)
      assert.match(upgrade.message, /backup/i)
      const backups = fs.readdirSync(tmp).filter((n) => n.startsWith(".agent.backup-"))
      assert.equal(backups.length >= 1, true)
      const backupMarker = path.join(tmp, backups[0]!, "MERIDIAN.md")
      assert.match(fs.readFileSync(backupMarker, "utf8"), /custom local marker/)
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true })
    }
  })
})
