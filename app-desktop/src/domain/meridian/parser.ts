import {
  extractMarkdownSection,
  extractPurposeFromBody,
  normalizeDocRefList,
  phaseLabelForDocId,
} from "@/domain/meridian/doc-refs"
import { parseFrontmatterRecord, splitMarkdown } from "@/domain/meridian/frontmatter"
import { USER_STORY_ID_PATTERN } from "@/domain/meridian/user-story-id"
import type {
  DecisionDay,
  DecisionEntry,
  DocStatus,
  Epic,
  EpicStatus,
  Moscow,
  PhaseDocument,
  StoryStatus,
  TestsRequirement,
  TestsStatus,
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
const TESTS_REQUIREMENTS: TestsRequirement[] = ["required", "none"]
const TESTS_STATUSES: TestsStatus[] = ["pending", "done", "n/a"]
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
    throw new MeridianParseError(file, `field "${key}" missing or invalid`)
  }
  return value.trim()
}

function parseDocStatus(value: unknown, file: string): DocStatus {
  if (typeof value !== "string" || !DOC_STATUSES.includes(value as DocStatus)) {
    throw new MeridianParseError(
      file,
      `status must be draft, review, or approved (got: ${String(value)})`,
    )
  }
  return value as DocStatus
}

function parseStoryStatus(value: unknown, file: string): StoryStatus {
  if (typeof value !== "string" || !STORY_STATUSES.includes(value as StoryStatus)) {
    throw new MeridianParseError(file, `invalid user story status: ${String(value)}`)
  }
  return value as StoryStatus
}

function parseMoscow(value: unknown, file: string): Moscow {
  if (typeof value !== "string" || !MOSCOW_VALUES.includes(value as Moscow)) {
    throw new MeridianParseError(file, `invalid moscow value: ${String(value)}`)
  }
  return value as Moscow
}

function parseTestsRequirement(value: unknown, file: string): TestsRequirement {
  if (
    typeof value !== "string" ||
    !TESTS_REQUIREMENTS.includes(value as TestsRequirement)
  ) {
    throw new MeridianParseError(
      file,
      `tests must be required or none (got: ${String(value)})`,
    )
  }
  return value as TestsRequirement
}

function parseTestsStatus(
  value: unknown,
  tests: TestsRequirement,
  file: string,
): TestsStatus {
  if (value === undefined || value === null || value === "") {
    return tests === "none" ? "n/a" : "pending"
  }
  if (typeof value !== "string" || !TESTS_STATUSES.includes(value as TestsStatus)) {
    throw new MeridianParseError(
      file,
      `tests_status must be pending, done, or n/a (got: ${String(value)})`,
    )
  }
  return value as TestsStatus
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
      `id "${id}" does not match filename (${filename})`,
    )
  }
}

export function parsePhaseDocument(docId: string, raw: string): PhaseDocument {
  const file = `${docId}.md`
  const { frontmatter, body } = splitMarkdown(raw)

  if (!frontmatter) {
    throw new MeridianParseError(file, "YAML frontmatter required")
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
    throw new MeridianParseError(file, "YAML frontmatter required")
  }

  const record = parseFrontmatterRecord(frontmatter)
  const id = requireString(record, "id", file)
  assertFilenameMatchesId(file, filename, id)

  if (!USER_STORY_ID_PATTERN.test(id)) {
    throw new MeridianParseError(
      file,
      `id "${id}" must use US-XXXX format (4–5 digits, e.g. US-0001 or US-10000)`,
    )
  }

  const tests =
    record.tests === undefined
      ? ("required" as TestsRequirement)
      : parseTestsRequirement(record.tests, file)
  const testsStatus = parseTestsStatus(record.tests_status, tests, file)

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
    tests,
    testsStatus,
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
    throw new MeridianParseError(file, "invalid versions field")
  }
  return []
}

export function parseEpicFile(filename: string, raw: string): Epic {
  const file = `epics/${filename}`
  const { frontmatter, body } = splitMarkdown(raw)

  if (!frontmatter) {
    throw new MeridianParseError(file, "YAML frontmatter required")
  }

  const record = parseFrontmatterRecord(frontmatter)
  const id = requireString(record, "id", file)
  assertFilenameMatchesId(file, filename, id)

  return {
    id,
    title: requireString(record, "title", file),
    description:
      extractMarkdownSection(body, "Capability") || extractPurposeFromBody(body),
    outcome: requireString(record, "outcome", file),
    scopeOut: extractMarkdownSection(body, "Out of scope for this epic"),
    versions: parseEpicVersions(record.versions, file),
    profiles: parseStringList(record.profiles),
    status: parseEpicStatus(String(record.status ?? "active")),
  }
}

export function parseVersionFile(filename: string, raw: string): ProductVersion {
  const file = `versions/${filename}`
  const { frontmatter, body } = splitMarkdown(raw)

  if (!frontmatter) {
    throw new MeridianParseError(file, "YAML frontmatter required")
  }

  const record = parseFrontmatterRecord(frontmatter)
  const id = requireString(record, "id", file)
  assertFilenameMatchesId(file, filename, id)

  if (!VERSION_ID_PATTERN.test(id)) {
    throw new MeridianParseError(file, `id "${id}" must use vX format (e.g. v0, v1)`)
  }

  return {
    id,
    title: requireString(record, "title", file),
    outcome: requireString(record, "outcome", file),
    objective: extractMarkdownSection(body, "Objective"),
    scopeIn: extractMarkdownSection(body, "Included in this version"),
    scopeOut: extractMarkdownSection(body, "Explicitly out"),
    status: parseReleaseStatus(String(record.status ?? "planned")),
  }
}

const DECISION_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/
const DECISION_FILENAME_PATTERN = /^\d{4}-\d{2}-\d{2}\.json$/i
const DECISION_TIME_PATTERN = /^\d{2}:\d{2}$/

function parseDecisionEntry(
  value: unknown,
  file: string,
  index: number,
): DecisionEntry {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new MeridianParseError(file, `entries[${index}] must be an object`)
  }

  const record = value as Record<string, unknown>
  const time = requireString(record, "time", file)
  const title = requireString(record, "title", file)

  if (!DECISION_TIME_PATTERN.test(time)) {
    throw new MeridianParseError(file, `entries[${index}].time must use HH:MM format`)
  }

  return {
    time,
    title,
    affectedDocument: String(record.affected_document ?? "").trim(),
    whatChanged: String(record.what_changed ?? "").trim(),
    whyChanged: String(record.why_changed ?? "").trim(),
    impact: String(record.impact ?? "").trim(),
    responsible: String(record.responsible ?? "").trim(),
  }
}

export function parseDecisionDayFile(filename: string, raw: string): DecisionDay {
  const file = `decisions/${filename}`

  if (!DECISION_FILENAME_PATTERN.test(filename)) {
    throw new MeridianParseError(file, "filename must be YYYY-MM-DD.json")
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    throw new MeridianParseError(file, "invalid JSON")
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new MeridianParseError(file, "root must be an object with date and entries")
  }

  const record = parsed as Record<string, unknown>
  const date = requireString(record, "date", file)
  const expectedDate = filename.replace(/\.json$/i, "")

  if (!DECISION_DATE_PATTERN.test(date)) {
    throw new MeridianParseError(file, `date "${date}" must use YYYY-MM-DD format`)
  }

  if (date !== expectedDate) {
    throw new MeridianParseError(
      file,
      `date "${date}" does not match filename (${filename})`,
    )
  }

  if (!Array.isArray(record.entries)) {
    throw new MeridianParseError(file, "entries field must be an array")
  }

  const entries = record.entries.map((entry, index) =>
    parseDecisionEntry(entry, file, index),
  )

  return {
    date,
    filename,
    entries,
  }
}

export function parseSprintFile(filename: string, raw: string): Sprint {
  const file = `sprints/${filename}`
  const { frontmatter } = splitMarkdown(raw)

  if (!frontmatter) {
    throw new MeridianParseError(file, "YAML frontmatter required")
  }

  const record = parseFrontmatterRecord(frontmatter)
  const id = requireString(record, "id", file)
  assertFilenameMatchesId(file, filename, id)

  if (!SPRINT_ID_PATTERN.test(id)) {
    throw new MeridianParseError(file, `id "${id}" must use vX-SY format (e.g. v1-S1)`)
  }

  const versionId = requireString(record, "version", file)
  if (!VERSION_ID_PATTERN.test(versionId)) {
    throw new MeridianParseError(file, `version "${versionId}" must use vX format`)
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
