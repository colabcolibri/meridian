/** Validation of the docs/ folder opened in the monitor (root = Meridian content). */
export interface MeridianFolderValidation {
  hasScopeDoc: boolean
  hasUsDir: boolean
  hasKanban: boolean
}

export interface MeridianFolderSnapshot {
  name: string
  validation: MeridianFolderValidation
}

export type ProjectFolderStatus = "none" | "opening" | "open" | "error"
