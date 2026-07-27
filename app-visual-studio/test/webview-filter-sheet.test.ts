import assert from "node:assert/strict"
import { test } from "node:test"

import {
  filterSheetHtml,
  filterSheetOpenButtonHtml,
} from "../src/webview-filter-sheet.js"

test("filterSheetHtml renders lateral panel columns", () => {
  const html = filterSheetHtml([
    {
      key: "version",
      label: "Versão",
      listId: "version-chips",
      allId: "version-all",
      noneId: "version-none",
    },
  ])
  assert.match(html, /filter-sheet-panel/)
  assert.match(html, /id="version-chips"/)
  assert.match(html, /Resetar/)
})

test("filterSheetOpenButtonHtml exposes Filtros chip", () => {
  assert.match(filterSheetOpenButtonHtml(), /id="open-filters"/)
  assert.match(filterSheetOpenButtonHtml("summary"), /id="summary"/)
})
