import { phaseDocFilename } from "@/domain/meridian/phase-doc-files"
import { splitMarkdown } from "@/domain/meridian/frontmatter"
import type { MeridianDocsRoot } from "@/features/folder/meridian-docs-root"

export interface PhaseDocContent {
  filename: string
  raw: string
  frontmatter: string | null
  body: string
}

export async function readPhaseDocFromFolder(
  docsRoot: MeridianDocsRoot,
  docId: string,
): Promise<PhaseDocContent> {
  const filename = phaseDocFilename(docId)
  const raw = await docsRoot.readText(filename)
  const { frontmatter, body } = splitMarkdown(raw)

  return { filename, raw, frontmatter, body }
}
