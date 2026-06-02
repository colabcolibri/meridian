/** Arquivos de fase em `docs/` (Meridian 00–08 + 11). Entrega via pastas epics/, versions/, sprints/, us/. */
export const PHASE_DOC_IDS = [
  "00_scope",
  "01_tech_stack",
  "02_security",
  "03_user_types",
  "04_principles",
  "05_architecture",
  "06_database",
  "07_api_contracts",
  "08_environments",
  "11_decisions",
] as const

export type PhaseDocId = (typeof PHASE_DOC_IDS)[number]

export function phaseDocFilename(docId: string): string {
  return `${docId}.md`
}
