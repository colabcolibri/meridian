import assert from "node:assert/strict"
import * as fs from "node:fs"
import * as os from "node:os"
import * as path from "node:path"
import { test } from "node:test"

import { architectureDiagramWebviewHtml } from "../src/architecture-diagram-webview-html.js"
import {
  extractMermaidBlock,
  inferKindFromFileName,
  kindLabel,
  loadArchitectureDiagramsPayload,
  parseKind,
  parseMeta,
  splitFrontmatter,
  titleFromFileName,
} from "../src/load-architecture-diagrams.js"
import { buildMeridianMermaidInitConfig, polishMeridianSvg } from "../src/meridian-mermaid/index.js"
import { buildWebviewProjectContext } from "../src/webview-project-context.js"
import type { MeridianWorkspaceInfo } from "../src/meridian-workspace.js"

function workspace(docsRoot: string): MeridianWorkspaceInfo {
  return {
    projectRoot: docsRoot.replace(/\/docs$/, ""),
    docsRoot,
    packageRoot: docsRoot.replace(/\/docs$/, ""),
    projectId: "meridian",
    projectName: "meridian",
    projects: [
      {
        id: "meridian",
        name: "meridian",
        docs: "docs",
        packageRoot: ".",
        source: "discovered",
        usCount: 0,
        isActive: true,
      },
    ],
    kitDetected: true,
    docsExists: true,
    usCount: 0,
  }
}

test("extractMermaidBlock reads fenced mermaid", () => {
  const src = "# Title\n\n```mermaid\nflowchart LR\n  A --> B\n```\n"
  assert.equal(extractMermaidBlock(src), "flowchart LR\n  A --> B")
})

test("parseMeta uses frontmatter title and kind", () => {
  const meta = parseMeta("title: My diagram\nsubtitle: test\nkind: database\n", "file.mmd")
  assert.equal(meta.title, "My diagram")
  assert.equal(meta.subtitle, "test")
  assert.equal(meta.kind, "database")
})

test("parseKind and inferKindFromFileName", () => {
  assert.equal(parseKind("runtime"), "runtime")
  assert.equal(parseKind("invalid"), undefined)
  assert.equal(inferKindFromFileName("meridian-database.md"), "database")
  assert.equal(kindLabel("database"), "Database")
})

test("titleFromFileName humanizes kebab-case", () => {
  assert.equal(titleFromFileName("meridian-runtime.md"), "Meridian Runtime")
})

test("buildMeridianMermaidInitConfig uses Meridian role palette", () => {
  const config = buildMeridianMermaidInitConfig()
  assert.equal(config.theme, "base")
  assert.equal(config.themeVariables.primaryColor, "#0f766e")
  assert.equal(config.flowchart.useMaxWidth, false)
})

test("polishMeridianSvg adds meridian-diagram class", () => {
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" style="max-width: 100%;"><rect/></svg>'
  const polished = polishMeridianSvg(svg)
  assert.match(polished, /class="meridian-diagram"/)
  assert.doesNotMatch(polished, /max-width:\s*100%/)
})

test("loadArchitectureDiagramsPayload reads md and mmd files", () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "meridian-diagram-"))
  const docsRoot = path.join(tmp, "docs")
  const diagramsDir = path.join(docsRoot, "architecture", "diagrams")
  fs.mkdirSync(diagramsDir, { recursive: true })
  fs.writeFileSync(
    path.join(diagramsDir, "sample.mmd"),
    "flowchart LR\n  X --> Y\n",
    "utf8",
  )
  fs.writeFileSync(
    path.join(diagramsDir, "sample-md.md"),
    "---\ntitle: From MD\nkind: runtime\n---\n\n```mermaid\nflowchart TD\n  A --> B\n```\n",
    "utf8",
  )

  const payload = loadArchitectureDiagramsPayload(docsRoot)
  assert.equal(payload.diagrams.length, 2)
  const mmd = payload.diagrams.find((d) => d.fileName === "sample.mmd")
  const md = payload.diagrams.find((d) => d.fileName === "sample-md.md")
  assert.equal(mmd?.mermaid?.includes("X --> Y"), true)
  assert.equal(md?.meta.title, "From MD")
  assert.equal(md?.meta.kind, "runtime")

  fs.rmSync(tmp, { recursive: true, force: true })
})

test("architecture diagram webview loads mermaid and meridian theme", () => {
  const payload = {
    diagrams: [
      {
        fileName: "sample.mmd",
        relativePath: "architecture/diagrams/sample.mmd",
        absolutePath: "/tmp/sample.mmd",
        meta: { title: "Sample", kind: "runtime" as const },
        mermaid: "flowchart LR\n  A --> B",
        error: null,
      },
    ],
  }
  const html = architectureDiagramWebviewHtml(
    payload,
    buildWebviewProjectContext(workspace("/repo/docs")),
    { mermaidScriptSrc: "https://example.test/mermaid.min.js", cspSource: "vscode-webview:" },
  )
  assert.match(html, /mermaid\.min\.js/)
  assert.match(html, /meridianMermaidTheme/)
  assert.match(html, /polishMeridianSvg/)
  assert.match(html, /diagramViewport/)
  assert.match(html, /tightenDiagramViewBox/)
  assert.match(html, /fitBtn/)
  assert.match(html, /wireProjectContext\(projectContext\)/)
  assert.match(html, /optionLabel/)
  assert.match(html, /KIND_LABELS/)
})

test("splitFrontmatter separates yaml header", () => {
  const raw = "---\ntitle: X\n---\n\nbody\n"
  const parts = splitFrontmatter(raw)
  assert.match(parts.frontmatter, /title: X/)
  assert.equal(parts.body.trim(), "body")
})
