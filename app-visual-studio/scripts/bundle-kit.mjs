#!/usr/bin/env node
/**
 * Copy monorepo .agent/ into bundled/kit/.agent for VSIX packaging.
 * Run before vsce package / publish (vscode:prepublish).
 */
import { cpSync, existsSync, readFileSync, rmSync, writeFileSync } from "node:fs"
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
  dereference: true,
  filter: (src) => !src.includes("__pycache__") && !src.endsWith(".DS_Store"),
})

const pkg = JSON.parse(readFileSync(join(extRoot, "package.json"), "utf8"))
const version = String(pkg.version ?? "").trim()
writeFileSync(join(kitDest, "VERSION"), `${version}\n`)

const changelog = readFileSync(join(extRoot, "CHANGELOG.md"), "utf8")
const lines = changelog.split(/\r?\n/)
const start = lines.findIndex((line) => /^## \[[^\]]+\]/.test(line.trim()))
let notes = `_Harness ${version}._`
if (start >= 0) {
  const body = []
  for (let i = start + 1; i < lines.length; i += 1) {
    if (/^## \[[^\]]+\]/.test(lines[i].trim())) {
      break
    }
    body.push(lines[i])
  }
  const parsed = body.join("\n").trim()
  if (parsed) {
    notes = parsed
  }
}
writeFileSync(join(kitDest, "HARNESS_NOTES.md"), `${notes}\n`)

console.log(`Bundled kit: ${kitSrc} → ${kitDest} (harness ${version})`)
