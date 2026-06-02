import {
  extractPurposeFromBody,
  normalizeDocRefList,
  phaseLabelForDocId,
} from "@/domain/meridian/doc-refs"
import { parseFrontmatterRecord, splitMarkdown } from "@/domain/meridian/frontmatter"
import type {
  DocStatus,
  Epic,
  EpicStatus,
  Moscow,
  PhaseDocument,
  StoryStatus,
  UserStory,
} from "@/domain/meridian/types"

export class MeridianParseError extends Error {
  constructor(
    readonly file: string,
    message: string,
  ) {
    super(`${file}: ${message}`)
    this.name = "MeridianParseError"
  }
}

const DOC_STATUSES: DocStatus[] = ["draft", "review", "approved"]
const STORY_STATUSES: StoryStatus[] = ["✅", "🔶", "❌", "🧊"]
const MOSCOW_VALUES: Moscow[] = ["Must", "Should", "Could", "Won't"]
const EPIC_STATUSES: EpicStatus[] = ["active", "paused", "complete"]

function requireString(
  record: Record<string, unknown>,
  key: string,
  file: string,
): string {
  const value = record[key]
  if (typeof value !== "string" || value.trim() === "") {
    throw new MeridianParseError(file, `campo "${key}" ausente ou inválido`)
  }
  return value.trim()
}

function parseDocStatus(value: unknown, file: string): DocStatus {
  if (typeof value !== "string" || !DOC_STATUSES.includes(value as DocStatus)) {
    throw new MeridianParseError(
      file,
      `status deve ser draft, review ou approved (recebido: ${String(value)})`,
    )
  }
  return value as DocStatus
}

function parseStoryStatus(value: unknown, file: string): StoryStatus {
  if (typeof value !== "string" || !STORY_STATUSES.includes(value as StoryStatus)) {
    throw new MeridianParseError(file, `status de US inválido: ${String(value)}`)
  }
  return value as StoryStatus
}

function parseMoscow(value: unknown, file: string): Moscow {
  if (typeof value !== "string" || !MOSCOW_VALUES.includes(value as Moscow)) {
    throw new MeridianParseError(file, `moscow inválido: ${String(value)}`)
  }
  return value as Moscow
}

function parseEpicStatus(value: string): EpicStatus {
  const normalized = value.trim().toLowerCase()
  if (EPIC_STATUSES.includes(normalized as EpicStatus)) {
    return normalized as EpicStatus
  }
  return "active"
}

export function parsePhaseDocument(docId: string, raw: string): PhaseDocument {
  const file = `${docId}.md`
  const { frontmatter, body } = splitMarkdown(raw)

  if (!frontmatter) {
    throw new MeridianParseError(file, "frontmatter YAML obrigatório")
  }

  const record = parseFrontmatterRecord(frontmatter)

  return {
    id: docId,
    title: requireString(record, "title", file),
    phase: phaseLabelForDocId(docId),
    status: parseDocStatus(record.status, file),
    dependsOn: normalizeDocRefList(record.depends_on),
    blocks: normalizeDocRefList(record.blocks),
    purpose: extractPurposeFromBody(body),
  }
}

export function parseUserStoryFile(filename: string, raw: string): UserStory {
  const file = `us/${filename}`
  const { frontmatter } = splitMarkdown(raw)

  if (!frontmatter) {
    throw new MeridianParseError(file, "frontmatter YAML obrigatório")
  }

  const record = parseFrontmatterRecord(frontmatter)

  return {
    id: requireString(record, "id", file),
    title: requireString(record, "title", file),
    epic: requireString(record, "epic", file),
    version: requireString(record, "version", file),
    status: parseStoryStatus(record.status, file),
    moscow: parseMoscow(record.moscow, file),
    dependsOn: Array.isArray(record.depends_on)
      ? record.depends_on.filter((item): item is string => typeof item === "string")
      : [],
    doneWhen: requireString(record, "done_when", file),
  }
}

function parseStringList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean)
  }
  if (typeof value === "string" && value.trim()) {
    return [value.trim()]
  }
  return []
}

function parseEpicVersions(value: unknown, file: string): string[] {
  const items = parseStringList(value)
  if (items.length > 0) {
    return items
  }
  if (typeof value === "string") {
    return [...value.matchAll(/\bv[\w-]+(?:\.\w+)*/g)].map((match) => match[0])
  }
  if (value !== undefined && value !== null) {
    throw new MeridianParseError(file, "campo versions inválido")
  }
  return []
}

export function parseEpicFile(filename: string, raw: string): Epic {
  const file = `epics/${filename}`
  const { frontmatter, body } = splitMarkdown(raw)

  if (!frontmatter) {
    throw new MeridianParseError(file, "frontmatter YAML obrigatório")
  }

  const record = parseFrontmatterRecord(frontmatter)
  const id = requireString(record, "id", file)
  const expectedFilename = `${id}.md`

  if (filename.toLowerCase() !== expectedFilename.toLowerCase()) {
    throw new MeridianParseError(
      file,
      `id "${id}" não confere com o nome do arquivo (${filename})`,
    )
  }

  return {
    id,
    title: requireString(record, "title", file),
    description: extractPurposeFromBody(body),
    versions: parseEpicVersions(record.versions, file),
    profiles: parseStringList(record.profiles),
    status: parseEpicStatus(String(record.status ?? "active")),
  }
}
