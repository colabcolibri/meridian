import {
  extractMarkdownSection,
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
  ProductVersion,
  Sprint,
  ReleaseStatus,
  SprintStatus,
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
const RELEASE_STATUSES: ReleaseStatus[] = ["planned", "active", "complete"]
const SPRINT_STATUSES: SprintStatus[] = ["planned", "active", "complete"]
const VERSION_ID_PATTERN = /^v\d+$/i
const SPRINT_ID_PATTERN = /^v\d+-S\d+$/i

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

function parseReleaseStatus(value: string): ReleaseStatus {
  const normalized = value.trim().toLowerCase()
  if (RELEASE_STATUSES.includes(normalized as ReleaseStatus)) {
    return normalized as ReleaseStatus
  }
  return "planned"
}

function parseSprintStatus(value: string): SprintStatus {
  const normalized = value.trim().toLowerCase()
  if (SPRINT_STATUSES.includes(normalized as SprintStatus)) {
    return normalized as SprintStatus
  }
  return "planned"
}

function assertFilenameMatchesId(file: string, filename: string, id: string) {
  const expectedFilename = `${id}.md`
  if (filename.toLowerCase() !== expectedFilename.toLowerCase()) {
    throw new MeridianParseError(
      file,
      `id "${id}" não confere com o nome do arquivo (${filename})`,
    )
  }
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
  const id = requireString(record, "id", file)
  assertFilenameMatchesId(file, filename, id)

  if (!/^US-\d{4}$/i.test(id)) {
    throw new MeridianParseError(
      file,
      `id "${id}" deve usar formato US-XXXX (4 dígitos)`,
    )
  }

  return {
    id,
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
  assertFilenameMatchesId(file, filename, id)

  return {
    id,
    title: requireString(record, "title", file),
    description:
      extractMarkdownSection(body, "Capacidade") || extractPurposeFromBody(body),
    outcome: requireString(record, "outcome", file),
    scopeOut: extractMarkdownSection(body, "Fora deste epic"),
    versions: parseEpicVersions(record.versions, file),
    profiles: parseStringList(record.profiles),
    status: parseEpicStatus(String(record.status ?? "active")),
  }
}

export function parseVersionFile(filename: string, raw: string): ProductVersion {
  const file = `versions/${filename}`
  const { frontmatter, body } = splitMarkdown(raw)

  if (!frontmatter) {
    throw new MeridianParseError(file, "frontmatter YAML obrigatório")
  }

  const record = parseFrontmatterRecord(frontmatter)
  const id = requireString(record, "id", file)
  assertFilenameMatchesId(file, filename, id)

  if (!VERSION_ID_PATTERN.test(id)) {
    throw new MeridianParseError(file, `id "${id}" deve usar formato vX (ex.: v0, v1)`)
  }

  return {
    id,
    title: requireString(record, "title", file),
    outcome: requireString(record, "outcome", file),
    objective: extractMarkdownSection(body, "Objetivo"),
    scopeIn: extractMarkdownSection(body, "Incluído nesta versão"),
    scopeOut: extractMarkdownSection(body, "Explicitamente fora"),
    status: parseReleaseStatus(String(record.status ?? "planned")),
  }
}

export function parseSprintFile(filename: string, raw: string): Sprint {
  const file = `sprints/${filename}`
  const { frontmatter } = splitMarkdown(raw)

  if (!frontmatter) {
    throw new MeridianParseError(file, "frontmatter YAML obrigatório")
  }

  const record = parseFrontmatterRecord(frontmatter)
  const id = requireString(record, "id", file)
  assertFilenameMatchesId(file, filename, id)

  if (!SPRINT_ID_PATTERN.test(id)) {
    throw new MeridianParseError(
      file,
      `id "${id}" deve usar formato vX-SY (ex.: v1-S1)`,
    )
  }

  const versionId = requireString(record, "version", file)
  if (!VERSION_ID_PATTERN.test(versionId)) {
    throw new MeridianParseError(file, `version "${versionId}" deve usar formato vX`)
  }

  return {
    id,
    versionId,
    title: requireString(record, "title", file),
    doneWhen: requireString(record, "done_when", file),
    status: parseSprintStatus(String(record.status ?? "planned")),
    storyIds: parseStringList(record.stories),
  }
}
