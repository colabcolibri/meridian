import assert from "node:assert/strict"
import { test } from "node:test"

import {
  buildFileTypeLegend,
  colorForLanguage,
  enrichImportGraphNode,
  languageFromPath,
} from "../src/domain/graph-file-type.js"

test("languageFromPath maps common extensions", () => {
  assert.equal(languageFromPath("src/foo/bar.ts"), "typescript")
  assert.equal(languageFromPath("lib/import_graph.py"), "python")
  assert.equal(languageFromPath("README.md"), "markdown")
})

test("colorForLanguage is stable per language", () => {
  const a = colorForLanguage("typescript")
  const b = colorForLanguage("typescript")
  assert.equal(a, b)
  assert.match(a, /^#|hsl\(/)
})

test("enrichImportGraphNode adds fileType and color", () => {
  const node = enrichImportGraphNode({ id: "app/main.tsx", label: "main.tsx" })
  assert.equal(node.fileType, "typescript")
  assert.ok(node.color)
})

test("buildFileTypeLegend aggregates counts", () => {
  const legend = buildFileTypeLegend({
    nodes: [
      enrichImportGraphNode({ id: "a.ts", label: "a.ts" }),
      enrichImportGraphNode({ id: "b.ts", label: "b.ts" }),
      enrichImportGraphNode({ id: "c.py", label: "c.py" }),
    ],
    edges: [],
  })
  assert.equal(legend.find((e) => e.type === "typescript")?.count, 2)
  assert.equal(legend.find((e) => e.type === "python")?.count, 1)
})
