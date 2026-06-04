import type {
  ListedDocsFile,
  MeridianDocsRoot,
} from "@/features/folder/meridian-docs-root"
import { sliceTextForFrontmatter } from "@/features/folder/meridian-docs-root"

const BASE = ""

async function fetchText(filePath: string): Promise<string> {
  const res = await fetch(`${BASE}/api/files?path=${encodeURIComponent(filePath)}`)
  if (!res.ok) throw new Error(`File not found: ${filePath}`)
  return res.text()
}

async function fetchList(dir: string): Promise<string[]> {
  const res = await fetch(`${BASE}/api/list?dir=${encodeURIComponent(dir)}`)
  if (!res.ok) throw new Error(`Directory not found: ${dir}`)
  return res.json() as Promise<string[]>
}

export async function probeHttpServer(folderPath: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/list?dir=${encodeURIComponent(folderPath)}`, {
      method: "HEAD",
    })
    return res.ok
  } catch {
    return false
  }
}

export function createHttpDocsRoot(folderPath: string): MeridianDocsRoot {
  const displayName = folderPath.split("/").filter(Boolean).at(-1) ?? folderPath

  function absPath(relativePath: string): string {
    return `${folderPath}/${relativePath}`
  }

  return {
    kind: "filesystem",
    displayName,
    async readText(relativePath) {
      return fetchText(absPath(relativePath))
    },
    async readTextForFrontmatter(relativePath, maxBytes) {
      const text = await fetchText(absPath(relativePath))
      return sliceTextForFrontmatter(text, maxBytes)
    },
    async listFiles(directory, namePattern) {
      const dir = directory ? `${folderPath}/${directory}` : folderPath
      const names = await fetchList(dir)
      const matched = names.filter((n) => namePattern.test(n))
      const prefix = directory ? `${directory}/` : ""
      return matched.map(
        (name): ListedDocsFile => ({
          name,
          relativePath: `${prefix}${name}`,
        }),
      )
    },
  }
}
