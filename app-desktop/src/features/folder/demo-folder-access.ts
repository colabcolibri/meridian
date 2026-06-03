import {
  createStaticDocsRoot,
  fetchDemoManifest,
  validateDemoManifest,
} from "@/features/folder/static-docs-root"
import {
  assertMeridianFolder,
  meridianFolderHints,
} from "@/features/folder/validate-meridian-folder"
import type { MeridianDocsRoot } from "@/features/folder/meridian-docs-root"
import type { MeridianFolderSnapshot } from "@/features/folder/types"

export interface DemoFolderOpenResult {
  snapshot: MeridianFolderSnapshot
  docsRoot: MeridianDocsRoot
}

export async function openDemoMeridianFolder(): Promise<DemoFolderOpenResult> {
  const manifest = await fetchDemoManifest()
  const validation = validateDemoManifest(manifest)
  const invalidMessage = assertMeridianFolder(validation)
  if (invalidMessage) {
    throw new Error(invalidMessage)
  }

  return {
    snapshot: { name: manifest.name, validation },
    docsRoot: createStaticDocsRoot(manifest),
  }
}

export { meridianFolderHints }
