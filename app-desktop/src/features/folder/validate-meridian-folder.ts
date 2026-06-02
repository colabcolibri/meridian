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
    return 'Pasta inválida: falta "00_scope.md" na raiz. Escolha a pasta docs/ do projeto (ex.: app-desktop/docs/).'
  }
  if (!validation.hasUsDir) {
    return 'Pasta inválida: falta a pasta "us/". Escolha a pasta docs/ do projeto Meridian.'
  }
  return null
}

export function meridianFolderHints(validation: MeridianFolderValidation): string[] {
  const hints: string[] = []
  if (!validation.hasKanban) {
    hints.push('Pasta "kanban/" não encontrada (board.json opcional até sync-board).')
  }
  return hints
}
