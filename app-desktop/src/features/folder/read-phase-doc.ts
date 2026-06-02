import { phaseDocFilename } from "@/domain/meridian/phase-doc-files"
import { splitMarkdown } from "@/domain/meridian/frontmatter"

export interface PhaseDocContent {
  filename: string
  raw: string
  frontmatter: string | null
  body: string
}

export async function readPhaseDocFromFolder(
  docsRoot: FileSystemDirectoryHandle,
  docId: string,
): Promise<PhaseDocContent> {
  const filename = phaseDocFilename(docId)
  const fileHandle = await docsRoot.getFileHandle(filename)
  const file = await fileHandle.getFile()
  const raw = await file.text()
  const { frontmatter, body } = splitMarkdown(raw)

  return { filename, raw, frontmatter, body }
}
