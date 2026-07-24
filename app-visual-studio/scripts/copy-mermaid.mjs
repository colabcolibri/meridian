import * as fs from "node:fs"
import * as path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const source = path.join(root, "node_modules", "mermaid", "dist", "mermaid.min.js")
const target = path.join(root, "media", "mermaid.min.js")

if (!fs.existsSync(source)) {
  console.error("copy-mermaid: mermaid.min.js not found — run pnpm install")
  process.exit(1)
}

fs.copyFileSync(source, target)
console.log("copied mermaid.min.js → media/")
