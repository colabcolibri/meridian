import * as fs from "node:fs"
import * as path from "node:path"

import { parse as parseYaml } from "yaml"

import type {
  ArchitectureDiagramKind,
  ArchitectureDiagramMeta,
  ArchitectureDiagramsPayload,
  LoadedArchitectureDiagram,
} from "./domain/architecture-diagram.js"

const DIAGRAM_EXTENSIONS = new Set([".mmd", ".md"])

export function diagramsDirectory(docsRoot: string): string {
  return path.join(docsRoot, "architecture", "diagrams")
}

export function loadArchitectureDiagramsPayload(
  docsRoot: string,
): ArchitectureDiagramsPayload {
  const dir = diagramsDirectory(docsRoot)
  if (!fs.existsSync(dir)) {
    return { diagrams: [] }
  }

  const files = fs
    .readdirSync(dir)
    .filter((name) => DIAGRAM_EXTENSIONS.has(path.extname(name).toLowerCase()))
    .sort((a, b) => a.localeCompare(b))

  const diagrams: LoadedArchitectureDiagram[] = files.map((fileName) => {
    const absolutePath = path.join(dir, fileName)
    const relativePath = path.join("architecture", "diagrams", fileName).replace(/\\/g, "/")
    try {
      const raw = fs.readFileSync(absolutePath, "utf8")
      const ext = path.extname(fileName).toLowerCase()
      if (ext === ".mmd") {
        return loadMmdFile(fileName, relativePath, absolutePath, raw)
      }
      return loadMdFile(fileName, relativePath, absolutePath, raw)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      return emptyDiagram(fileName, relativePath, absolutePath, message)
    }
  })

  return { diagrams }
}

function loadMmdFile(
  fileName: string,
  relativePath: string,
  absolutePath: string,
  raw: string,
): LoadedArchitectureDiagram {
  const mermaid = raw.trim()
  if (!mermaid) {
    throw new Error("Empty .mmd file")
  }
  return finalizeDiagram(fileName, relativePath, absolutePath, { title: titleFromFileName(fileName) }, mermaid)
}

function loadMdFile(
  fileName: string,
  relativePath: string,
  absolutePath: string,
  raw: string,
): LoadedArchitectureDiagram {
  const { frontmatter, body } = splitFrontmatter(raw)
  const meta = parseMeta(frontmatter, fileName)
  const mermaid = extractMermaidBlock(body)
  if (!mermaid) {
    throw new Error("No ```mermaid code block found in .md file")
  }
  return finalizeDiagram(fileName, relativePath, absolutePath, meta, mermaid)
}

function emptyDiagram(
  fileName: string,
  relativePath: string,
  absolutePath: string,
  error: string,
): LoadedArchitectureDiagram {
  return {
    fileName,
    relativePath,
    absolutePath,
    meta: { title: titleFromFileName(fileName), kind: inferKindFromFileName(fileName) },
    mermaid: null,
    error,
  }
}

function finalizeDiagram(
  fileName: string,
  relativePath: string,
  absolutePath: string,
  meta: ArchitectureDiagramMeta,
  mermaid: string,
): LoadedArchitectureDiagram {
  return {
    fileName,
    relativePath,
    absolutePath,
    meta: {
      ...meta,
      kind: meta.kind ?? inferKindFromFileName(fileName),
    },
    mermaid,
    error: null,
  }
}

export function splitFrontmatter(raw: string): { frontmatter: string; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) {
    return { frontmatter: "", body: raw }
  }
  return { frontmatter: match[1] ?? "", body: match[2] ?? "" }
}

export function parseMeta(frontmatter: string, fileName: string): ArchitectureDiagramMeta {
  if (!frontmatter.trim()) {
    return { title: titleFromFileName(fileName) }
  }
  const doc = parseYaml(frontmatter) as Record<string, unknown> | null
  if (!doc || typeof doc !== "object") {
    return { title: titleFromFileName(fileName) }
  }
  const title =
    typeof doc.title === "string" && doc.title.trim()
      ? doc.title.trim()
      : titleFromFileName(fileName)
  return {
    title,
    subtitle: typeof doc.subtitle === "string" ? doc.subtitle : undefined,
    source_doc: typeof doc.source_doc === "string" ? doc.source_doc : undefined,
    updated: typeof doc.updated === "string" ? doc.updated : undefined,
    kind: parseKind(doc.kind) ?? inferKindFromFileName(fileName),
  }
}

const DIAGRAM_KINDS = new Set<ArchitectureDiagramKind>([
  "runtime",
  "database",
  "integration",
  "security",
  "flow",
  "other",
])

export function parseKind(value: unknown): ArchitectureDiagramKind | undefined {
  if (typeof value !== "string") {
    return undefined
  }
  const normalized = value.trim().toLowerCase()
  return DIAGRAM_KINDS.has(normalized as ArchitectureDiagramKind)
    ? (normalized as ArchitectureDiagramKind)
    : undefined
}

export function inferKindFromFileName(fileName: string): ArchitectureDiagramKind {
  const lower = fileName.toLowerCase()
  if (/(database|schema|er-|er_|delivery-store)/.test(lower)) {
    return "database"
  }
  if (/(runtime|system|overview|context)/.test(lower)) {
    return "runtime"
  }
  if (/(integration|api|contract)/.test(lower)) {
    return "integration"
  }
  if (/(security|auth|trust)/.test(lower)) {
    return "security"
  }
  if (/(flow|sequence|state)/.test(lower)) {
    return "flow"
  }
  return "other"
}

export function kindLabel(kind: ArchitectureDiagramKind | undefined): string {
  switch (kind) {
    case "runtime":
      return "Runtime"
    case "database":
      return "Database"
    case "integration":
      return "Integration"
    case "security":
      return "Security"
    case "flow":
      return "Flow"
    default:
      return "Diagram"
  }
}

export function extractMermaidBlock(body: string): string | null {
  const match = body.match(/```mermaid\s*\r?\n([\s\S]*?)```/i)
  return match?.[1]?.trim() ?? null
}

export function titleFromFileName(fileName: string): string {
  const base = path.basename(fileName, path.extname(fileName))
  return base
    .split(/[-_]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}
