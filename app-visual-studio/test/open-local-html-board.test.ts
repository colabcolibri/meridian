import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { test } from "node:test"

import { MERIDIAN_COMMAND_CATALOG } from "../src/command-catalog.js"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")

test("local HTML board is catalogued and not spawned from activate body", () => {
  const entry = MERIDIAN_COMMAND_CATALOG.find((e) => e.commandId === "meridian.openLocalHtmlBoard")
  assert.ok(entry)
  const activate = readFileSync(join(root, "src/extension.ts"), "utf8")
  assert.match(activate, /registerCommand\("meridian\.openLocalHtmlBoard"/)
  assert.equal((activate.match(/openLocalHtmlBoard\(/g) || []).length, 1)
})
