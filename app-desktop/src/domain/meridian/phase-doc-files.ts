/** Arquivos de fase em `docs/` (Meridian 00–11). */
export const PHASE_DOC_IDS = [
  "00_scope",
  "01_tech_stack",
  "02_security",
  "03_user_types",
  "04_epics",
  "05_principles",
  "06_versions",
  "07_architecture",
  "08_database",
  "09_api_contracts",
  "10_environments",
  "11_decisions",
] as const

export type PhaseDocId = (typeof PHASE_DOC_IDS)[number]

export function phaseDocFilename(docId: string): string {
  return `${docId}.md`
}
