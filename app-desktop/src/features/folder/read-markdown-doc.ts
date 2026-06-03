import { splitMarkdown } from "@/domain/meridian/frontmatter"
import type { MeridianDocsRoot } from "@/features/folder/meridian-docs-root"

export interface MarkdownDocContent {
  filename: string
  relativePath: string
  raw: string
  frontmatter: string | null
  body: string
}

export async function readMarkdownDocFromFolder(
  docsRoot: MeridianDocsRoot,
  relativePath: string,
): Promise<MarkdownDocContent> {
  const filename = relativePath.split("/").filter(Boolean).at(-1)!
  const raw = await docsRoot.readText(relativePath)
  const { frontmatter, body } = splitMarkdown(raw)

  return { filename, relativePath, raw, frontmatter, body }
}
