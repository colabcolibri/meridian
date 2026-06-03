import { FRONTMATTER_READ_BYTES } from "@/features/folder/read-folder-file"

export interface ListedDocsFile {
  name: string
  /** Path relative to docs root, e.g. `us/US-0001.md`. */
  relativePath: string
}

export interface MeridianDocsRoot {
  readonly kind: "filesystem" | "static"
  readonly displayName: string
  readText(relativePath: string): Promise<string>
  readTextForFrontmatter(relativePath: string, maxBytes?: number): Promise<string>
  listFiles(directory: string, namePattern: RegExp): Promise<ListedDocsFile[]>
}

function frontmatterClosedInPrefix(text: string): boolean {
  const trimmed = text.replace(/^\uFEFF/, "")
  if (!trimmed.startsWith("---")) {
    return false
  }
  return trimmed.indexOf("---", 3) !== -1
}

export function sliceTextForFrontmatter(
  text: string,
  maxBytes = FRONTMATTER_READ_BYTES,
): string {
  if (text.length <= maxBytes) {
    return text
  }
  const prefix = text.slice(0, maxBytes)
  if (frontmatterClosedInPrefix(prefix)) {
    return prefix
  }
  return text
}
