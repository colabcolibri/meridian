import { splitMarkdown } from "@/domain/meridian/frontmatter"

export interface MarkdownDocContent {
  filename: string
  relativePath: string
  raw: string
  frontmatter: string | null
  body: string
}

export async function readMarkdownDocFromFolder(
  docsRoot: FileSystemDirectoryHandle,
  relativePath: string,
): Promise<MarkdownDocContent> {
  const segments = relativePath.split("/").filter(Boolean)
  let directory = docsRoot

  for (let index = 0; index < segments.length - 1; index += 1) {
    directory = await directory.getDirectoryHandle(segments[index]!)
  }

  const filename = segments.at(-1)!
  const fileHandle = await directory.getFileHandle(filename)
  const file = await fileHandle.getFile()
  const raw = await file.text()
  const { frontmatter, body } = splitMarkdown(raw)

  return { filename, relativePath, raw, frontmatter, body }
}
