import { demoDocsBaseUrl } from "@/features/folder/demo-config"
import type {
  MeridianDocsRoot,
  ListedDocsFile,
} from "@/features/folder/meridian-docs-root"
import { sliceTextForFrontmatter } from "@/features/folder/meridian-docs-root"
import type { MeridianFolderValidation } from "@/features/folder/types"

export interface DemoDocsManifest {
  name: string
  files: string[]
}

function encodeRelativePath(relativePath: string): string {
  return relativePath
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/")
}

export function validateDemoManifest(
  manifest: DemoDocsManifest,
): MeridianFolderValidation {
  const files = manifest.files
  return {
    hasScopeDoc: files.includes("00_scope.md"),
    hasUsDir: files.some((file) => file.startsWith("us/")),
    hasKanban: files.some((file) => file.startsWith("kanban/")),
  }
}

export function listManifestFiles(
  files: readonly string[],
  directory: string,
  namePattern: RegExp,
): ListedDocsFile[] {
  const prefix = directory ? `${directory}/` : ""
  const entries: ListedDocsFile[] = []

  for (const file of files) {
    if (!file.startsWith(prefix)) {
      continue
    }
    const remainder = file.slice(prefix.length)
    if (remainder.includes("/")) {
      continue
    }
    if (!namePattern.test(remainder)) {
      continue
    }
    entries.push({ name: remainder, relativePath: file })
  }

  return entries.sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { numeric: true }),
  )
}

export async function fetchDemoManifest(): Promise<DemoDocsManifest> {
  const response = await fetch(`${demoDocsBaseUrl()}manifest.json`)
  if (!response.ok) {
    throw new Error(
      `Demo data not found (${response.status}). Run pnpm sync:demo-docs before dev:demo or build:demo.`,
    )
  }
  return (await response.json()) as DemoDocsManifest
}

export function createStaticDocsRoot(manifest: DemoDocsManifest): MeridianDocsRoot {
  const baseUrl = demoDocsBaseUrl()
  const files = manifest.files

  const readText = async (relativePath: string): Promise<string> => {
    const response = await fetch(`${baseUrl}${encodeRelativePath(relativePath)}`)
    if (!response.ok) {
      throw new Error(`Could not load demo file: ${relativePath}`)
    }
    return response.text()
  }

  return {
    kind: "static",
    displayName: manifest.name,
    readText,
    async readTextForFrontmatter(relativePath, maxBytes) {
      const text = await readText(relativePath)
      return sliceTextForFrontmatter(text, maxBytes)
    },
    listFiles(directory, namePattern) {
      return Promise.resolve(listManifestFiles(files, directory, namePattern))
    },
  }
}
