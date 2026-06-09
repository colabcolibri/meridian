#!/usr/bin/env node
/**
 * Copy monorepo .agent/ into bundled/kit/.agent for VSIX packaging.
 * Run before vsce package / publish (vscode:prepublish).
 */
import { cpSync, existsSync, rmSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const extRoot = join(dirname(fileURLToPath(import.meta.url)), "..")
const kitSrc = join(extRoot, "..", ".agent")
const kitDest = join(extRoot, "bundled", "kit", ".agent")

if (!existsSync(join(kitSrc, "MERIDIAN.md"))) {
  console.error(`ERROR: missing kit source at ${kitSrc}`)
  process.exit(1)
}

rmSync(kitDest, { recursive: true, force: true })

cpSync(kitSrc, kitDest, {
  recursive: true,
  filter: (src) => !src.includes("__pycache__") && !src.endsWith(".DS_Store"),
})

console.log(`Bundled kit: ${kitSrc} → ${kitDest}`)
