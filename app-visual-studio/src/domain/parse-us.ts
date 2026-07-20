import { parse as parseYaml } from "yaml"

import type { Moscow, StoryStatus, TestsRequirement, TestsStatus, UserStory } from "./types.js"
import { extractUsPreamble } from "./story-narrative.js"

const US_FILENAME = /^US-\d{4}\.md$/i
const STORY_STATUSES: StoryStatus[] = ["✅", "🔶", "❌", "🧊", "🚫"]
const MOSCOW: Moscow[] = ["Must", "Should", "Could", "Won't"]

function splitMarkdown(raw: string): { frontmatter: string | null; body: string } {
  const trimmed = raw.replace(/^\uFEFF/, "")
  if (!trimmed.startsWith("---")) {
    return { frontmatter: null, body: trimmed }
  }
  const end = trimmed.indexOf("---", 3)
  if (end === -1) {
    return { frontmatter: null, body: trimmed }
  }
  return {
    frontmatter: trimmed.slice(3, end).trim(),
    body: trimmed.slice(end + 3).trim(),
  }
}

function str(record: Record<string, unknown>, key: string): string | null {
  const v = record[key]
  return typeof v === "string" && v.trim() ? v.trim() : null
}

export function parseUserStoryFile(filename: string, raw: string): UserStory | null {
  if (!US_FILENAME.test(filename)) {
    return null
  }
  const { frontmatter, body } = splitMarkdown(raw)
  if (!frontmatter) {
    return null
  }
  let record: Record<string, unknown>
  try {
    record = parseYaml(frontmatter) as Record<string, unknown>
  } catch {
    return null
  }

  const id = str(record, "id")
  const status = str(record, "status") as StoryStatus | null
  const moscow = str(record, "moscow") as Moscow | null
  if (!id || !status || !STORY_STATUSES.includes(status) || !moscow || !MOSCOW.includes(moscow)) {
    return null
  }

  const testsRaw = str(record, "tests") ?? "required"
  const tests = (testsRaw === "none" ? "none" : "required") as TestsRequirement
  const testsStatus = (str(record, "tests_status") ?? (tests === "required" ? "pending" : "n/a")) as TestsStatus

  let ready: boolean | null = null
  if (typeof record.ready === "boolean") {
    ready = record.ready
  }

  return {
    id,
    title: str(record, "title") ?? id,
    epic: str(record, "epic") ?? "",
    version: str(record, "version") ?? "",
    status,
    moscow,
    dependsOn: Array.isArray(record.depends_on)
      ? record.depends_on.filter((x): x is string => typeof x === "string")
      : [],
    doneWhen: str(record, "done_when") ?? "",
    tests,
    testsStatus,
    ready,
    preamble: extractUsPreamble(body) || null,
  }
}
