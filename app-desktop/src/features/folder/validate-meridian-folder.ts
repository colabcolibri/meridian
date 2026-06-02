import type { MeridianFolderValidation } from "@/features/folder/types"

export async function validateMeridianFolder(
  handle: FileSystemDirectoryHandle,
): Promise<MeridianFolderValidation> {
  let hasScopeDoc = false
  try {
    await handle.getFileHandle("00_scope.md")
    hasScopeDoc = true
  } catch {
    hasScopeDoc = false
  }

  let hasUsDir = false
  try {
    await handle.getDirectoryHandle("us")
    hasUsDir = true
  } catch {
    hasUsDir = false
  }

  let hasKanban = false
  try {
    await handle.getDirectoryHandle("kanban")
    hasKanban = true
  } catch {
    hasKanban = false
  }

  return { hasScopeDoc, hasUsDir, hasKanban }
}

export function assertMeridianFolder(
  validation: MeridianFolderValidation,
): string | null {
  if (!validation.hasScopeDoc) {
    return 'Invalid folder: missing "00_scope.md" at the root. Choose the project docs/ folder (e.g. app-desktop/docs/).'
  }
  if (!validation.hasUsDir) {
    return 'Invalid folder: missing "us/" folder. Choose the Meridian project docs/ folder.'
  }
  return null
}

export function meridianFolderHints(validation: MeridianFolderValidation): string[] {
  const hints: string[] = []
  if (!validation.hasKanban) {
    hints.push('Folder "kanban/" not found (board.json optional until sync-board).')
  }
  return hints
}
