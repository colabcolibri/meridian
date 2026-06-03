import type {
  ListedDocsFile,
  MeridianDocsRoot,
} from "@/features/folder/meridian-docs-root"
import { sliceTextForFrontmatter } from "@/features/folder/meridian-docs-root"

function normalizePath(path: string): string {
  return path.replace(/\\/g, "/")
}

function buildFileIndex(files: File[]): Map<string, File> {
  const index = new Map<string, File>()
  for (const file of files) {
    index.set(normalizePath(file.webkitRelativePath || file.name), file)
  }
  return index
}

function resolveFile(index: Map<string, File>, relativePath: string): File | null {
  const normalized = normalizePath(relativePath)
  const direct = index.get(normalized)
  if (direct) {
    return direct
  }
  for (const [path, file] of index) {
    if (path.endsWith(`/${normalized}`) || path === normalized) {
      return file
    }
  }
  return null
}

export function createFileListDocsRoot(
  files: File[],
  displayName: string,
): MeridianDocsRoot {
  const index = buildFileIndex(files)

  return {
    kind: "filesystem",
    displayName,
    async readText(relativePath) {
      const file = resolveFile(index, relativePath)
      if (!file) {
        throw new Error(`File not found: ${relativePath}`)
      }
      return file.text()
    },
    async readTextForFrontmatter(relativePath, maxBytes) {
      const text = await this.readText(relativePath)
      return sliceTextForFrontmatter(text, maxBytes)
    },
    async listFiles(directory, namePattern) {
      const prefix = directory ? `${normalizePath(directory)}/` : ""
      const results: ListedDocsFile[] = []

      for (const path of index.keys()) {
        if (prefix && !path.startsWith(prefix)) {
          continue
        }
        const remainder = prefix ? path.slice(prefix.length) : path
        if (remainder.includes("/")) {
          continue
        }
        if (!namePattern.test(remainder)) {
          continue
        }
        results.push({ name: remainder, relativePath: path })
      }

      return results.sort((a, b) => a.relativePath.localeCompare(b.relativePath))
    },
  }
}
