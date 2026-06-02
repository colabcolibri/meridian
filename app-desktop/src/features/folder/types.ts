/** Validação da pasta docs/ aberta no monitor (raiz = conteúdo Meridian). */
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
