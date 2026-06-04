import type { MeridianDocsRoot } from "@/features/folder/meridian-docs-root"
import type { MeridianFolderValidation } from "@/features/folder/types"

export {
  assertMeridianFolder,
  meridianFolderHints,
} from "@/features/folder/validate-meridian-folder"

export async function validateMeridianFolder(
  root: MeridianDocsRoot,
): Promise<MeridianFolderValidation> {
  const [hasScopeDoc, hasUsDir, hasKanban] = await Promise.all([
    root
      .readText("00_scope.md")
      .then(() => true)
      .catch(() => false),
    root
      .listFiles("us", /\.md$/)
      .then((f) => f.length > 0)
      .catch(() => false),
    root
      .listFiles("kanban", /\.json$/)
      .then((f) => f.length > 0)
      .catch(() => false),
  ])
  return { hasScopeDoc, hasUsDir, hasKanban }
}
