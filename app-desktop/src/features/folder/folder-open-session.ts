import type { ProjectFolderStatus } from "@/features/folder/types"

/** After reset + failed bind/pick — never return to open without a new bind. */
export function resolveStatusAfterOpenFailure(): ProjectFolderStatus {
  return "error"
}

export function shouldApplyAsyncResult(
  operationGeneration: number,
  currentGeneration: number,
): boolean {
  return operationGeneration === currentGeneration && operationGeneration > 0
}

/** Picker cancelled after hard reset — no rollback to previous folder. */
export function resolveStatusAfterPickerAbort(options: {
  demoBuild: boolean
}): ProjectFolderStatus {
  return options.demoBuild ? "opening" : "none"
}
