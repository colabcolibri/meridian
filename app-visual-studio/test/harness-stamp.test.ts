import assert from "node:assert/strict"
import * as fs from "node:fs"
import * as os from "node:os"
import * as path from "node:path"
import { describe, it } from "node:test"

import {
  compareHarnessVersions,
  formatHarnessPrompt,
  formatHarnessStatusLine,
  inspectHarness,
  isHarnessSourceRepo,
  parseFirstChangelogSection,
  plainHarnessNoteBullets,
  stampWorkspaceHarness,
} from "../src/harness-stamp.js"

describe("harness-stamp", () => {
  it("treats missing VERSION as unknown (behind in inspect)", () => {
    assert.equal(compareHarnessVersions(null, "1.1.53"), "unknown")
    assert.equal(compareHarnessVersions("1.1.52", "1.1.53"), "behind")
    assert.equal(compareHarnessVersions("1.1.53", "1.1.53"), "current")
    assert.equal(compareHarnessVersions("1.1.54", "1.1.53"), "ahead")
  })

  it("parses the first changelog section only", () => {
    const md = [
      "# Changelog",
      "",
      "## [1.1.54] - 2026-09-03",
      "",
      "### Added",
      "",
      "- harness prompt",
      "",
      "## [1.1.53] - 2026-09-03",
      "",
      "- old",
      "",
    ].join("\n")
    const section = parseFirstChangelogSection(md)
    assert.match(section, /harness prompt/)
    assert.equal(section.includes("old"), false)
  })

  it("stamps VERSION from the extension package.json", () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "meridian-stamp-"))
    try {
      const ext = path.join(tmp, "ext")
      const agent = path.join(tmp, "agent")
      fs.mkdirSync(ext)
      fs.mkdirSync(agent)
      fs.writeFileSync(
        path.join(ext, "package.json"),
        JSON.stringify({ name: "meridian-vscode", version: "9.8.7" }),
        "utf8",
      )
      fs.writeFileSync(
        path.join(ext, "CHANGELOG.md"),
        "## [9.8.7] - 2026-09-03\n\n- notes here\n",
        "utf8",
      )
      stampWorkspaceHarness(agent, ext)
      assert.equal(fs.readFileSync(path.join(agent, "VERSION"), "utf8").trim(), "9.8.7")
      assert.match(fs.readFileSync(path.join(agent, "HARNESS_NOTES.md"), "utf8"), /notes here/)
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true })
    }
  })

  it("inspects a client folder as behind when VERSION is missing", () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "meridian-insp-"))
    try {
      const ext = path.join(tmp, "ext")
      const project = path.join(tmp, "app")
      const bundled = path.join(ext, "bundled", "kit", ".agent")
      fs.mkdirSync(bundled, { recursive: true })
      fs.mkdirSync(path.join(project, ".agent"), { recursive: true })
      fs.writeFileSync(path.join(project, ".agent", "MERIDIAN.md"), "# kit\n", "utf8")
      fs.writeFileSync(
        path.join(ext, "package.json"),
        JSON.stringify({ name: "meridian-vscode", version: "1.1.55" }),
        "utf8",
      )
      const inspection = inspectHarness(project, ext, bundled)
      assert.equal(inspection?.relation, "behind")
      assert.equal(inspection?.installedVersion, null)
      assert.equal(formatHarnessStatusLine(inspection!), "Meridian: harness legacy → 1.1.55")
      assert.match(formatHarnessPrompt(inspection!), /not stamped/)
      assert.equal(formatHarnessPrompt(inspection!).includes("###"), false)
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true })
    }
  })

  it("detects the kit source repo and does not status-line a bump", () => {
    const root = path.join(import.meta.dirname, "..", "..")
    assert.equal(isHarnessSourceRepo(root), true)
    const ext = path.join(root, "app-visual-studio")
    const bundled = path.join(ext, "..", ".agent")
    const inspection = inspectHarness(root, ext, bundled)
    assert.equal(inspection?.relation, "source")
    assert.equal(formatHarnessStatusLine(inspection!), null)
  })

  it("strips markdown from note bullets", () => {
    const md = [
      "### Added",
      "",
      "- **Harness version:** Install stamps `.agent/VERSION`",
      "- Status bar shows `harness A → B`",
      "",
    ].join("\n")
    const bullets = plainHarnessNoteBullets(md)
    assert.equal(bullets.length, 2)
    assert.match(bullets[0], /Harness version/)
    assert.equal(bullets[0].includes("**"), false)
    assert.equal(bullets[0].includes("`"), false)
  })
})
