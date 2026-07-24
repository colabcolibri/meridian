/** Architecture diagram loaded from Mermaid sources in docs/architecture/diagrams/ */

export type ArchitectureDiagramKind =
  | "runtime"
  | "database"
  | "integration"
  | "security"
  | "flow"
  | "other"

export type ArchitectureDiagramMeta = {
  title: string
  subtitle?: string
  source_doc?: string
  updated?: string
  /** Picker grouping — runtime, database (ER), integration, etc. */
  kind?: ArchitectureDiagramKind
}

export type LoadedArchitectureDiagram = {
  fileName: string
  relativePath: string
  absolutePath: string
  meta: ArchitectureDiagramMeta
  mermaid: string | null
  error: string | null
}

export type ArchitectureDiagramsPayload = {
  diagrams: LoadedArchitectureDiagram[]
}

export type ArchitectureDiagramWebviewAssets = {
  mermaidScriptSrc: string
  cspSource: string
}
