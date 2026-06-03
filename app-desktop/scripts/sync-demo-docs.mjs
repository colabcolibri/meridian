import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const docsDir = path.join(scriptDir, "../docs")
const outDir = path.join(scriptDir, "../public/demo-docs")

function collectFiles(dir, relativeBase = "") {
  const files = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const relativePath = relativeBase ? `${relativeBase}/${entry.name}` : entry.name
    const absolutePath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...collectFiles(absolutePath, relativePath))
      continue
    }
    files.push({ relativePath, absolutePath })
  }
  return files
}

function copyFile({ relativePath, absolutePath }) {
  const targetPath = path.join(outDir, relativePath)
  fs.mkdirSync(path.dirname(targetPath), { recursive: true })
  fs.copyFileSync(absolutePath, targetPath)
}

if (!fs.existsSync(docsDir)) {
  console.error(`docs folder not found: ${docsDir}`)
  process.exit(1)
}

fs.rmSync(outDir, { recursive: true, force: true })
fs.mkdirSync(outDir, { recursive: true })

const entries = collectFiles(docsDir)
for (const entry of entries) {
  copyFile(entry)
}

const manifest = {
  name: "app-desktop/docs (demo)",
  files: entries.map((entry) => entry.relativePath).sort(),
}

fs.writeFileSync(
  path.join(outDir, "manifest.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
  "utf8",
)

console.log(`Synced ${entries.length} files to public/demo-docs/`)
