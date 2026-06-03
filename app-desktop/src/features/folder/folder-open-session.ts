import type { MeridianDocsRoot } from "@/features/folder/meridian-docs-root"
import type {
  MeridianFolderSnapshot,
  ProjectFolderStatus,
} from "@/features/folder/types"

/** Binding captured before a user-initiated open (for AbortError rollback). */
export interface FolderBindingSnapshot {
  status: ProjectFolderStatus
  folderKey: string | null
  folder: MeridianFolderSnapshot | null
  pendingFolderName: string | null
  hints: string[]
  error: string | null
  isDemoActive: boolean
  docsRoot: MeridianDocsRoot | null
}

export interface FolderBindingState {
  status: ProjectFolderStatus
  folderKey: string | null
  folder: MeridianFolderSnapshot | null
  pendingFolderName: string | null
  hints: string[]
  error: string | null
  isDemoActive: boolean
  docsRoot: MeridianDocsRoot | null
}

export function createBindingSnapshot(
  state: FolderBindingState,
): FolderBindingSnapshot {
  return {
    status: state.status,
    folderKey: state.folderKey,
    folder: state.folder,
    pendingFolderName: state.pendingFolderName,
    hints: [...state.hints],
    error: state.error,
    isDemoActive: state.isDemoActive,
    docsRoot: state.docsRoot,
  }
}

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

export function resolveStatusAfterAbort(
  prior: FolderBindingSnapshot | null,
  options: { demoBuild: boolean },
): ProjectFolderStatus {
  if (prior) {
    return prior.status
  }
  return options.demoBuild ? "opening" : "none"
}

export function hadBoundFolder(snapshot: FolderBindingSnapshot | null): boolean {
  return snapshot?.status === "open" && snapshot.folderKey !== null
}
