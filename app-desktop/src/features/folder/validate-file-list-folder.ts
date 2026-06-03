import type { MeridianFolderValidation } from "@/features/folder/types"

export {
  assertMeridianFolder,
  meridianFolderHints,
} from "@/features/folder/validate-meridian-folder"

function normalizePath(path: string): string {
  return path.replace(/\\/g, "/")
}

export function collectRelativePaths(files: File[]): string[] {
  return files.map((file) => normalizePath(file.webkitRelativePath || file.name))
}

export function validateFileListFolder(files: File[]): MeridianFolderValidation {
  const paths = collectRelativePaths(files)
  const hasScopeDoc = paths.some(
    (path) => path === "00_scope.md" || path.endsWith("/00_scope.md"),
  )
  const hasUsDir = paths.some((path) => path.startsWith("us/") || path.includes("/us/"))
  const hasKanban = paths.some(
    (path) => path.startsWith("kanban/") || path.includes("/kanban/"),
  )
  return { hasScopeDoc, hasUsDir, hasKanban }
}

export function inferFolderDisplayName(files: File[]): string {
  const first = files[0]
  if (!first) {
    return "docs"
  }
  const relative = normalizePath(first.webkitRelativePath || first.name)
  const slash = relative.indexOf("/")
  return slash === -1 ? "docs" : relative.slice(0, slash)
}
