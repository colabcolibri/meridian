import assert from "node:assert/strict"
import { test } from "node:test"

import { MERIDIAN_COMMAND_CATALOG } from "../src/command-catalog.js"
import { helpEntryCount, helpWebviewHtml } from "../src/help-webview-html.js"

test("helpWebviewHtml documents all catalog commands", () => {
  const html = helpWebviewHtml()
  assert.equal(helpEntryCount(), MERIDIAN_COMMAND_CATALOG.length)
  for (const entry of MERIDIAN_COMMAND_CATALOG) {
    assert.match(html, new RegExp(entry.paletteTitle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")))
  }
  assert.match(html, /Meridian Validate/)
  assert.match(html, /Meridian Tools/)
})
