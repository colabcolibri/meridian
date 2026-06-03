import type { UserStory } from "@/domain/meridian/types"

export type TechnicalImplementationStatus =
  | "documented"
  | "incomplete"
  | "placeholder"
  | "missing"

export type StoryDocumentationBadge = "impl-ok" | "impl-missing" | null

const PLACEHOLDER_LINE = /^_\([^)]*\)_\s*$/i

function lineIsPlaceholder(line: string): boolean {
  const trimmed = line.trim()
  if (!trimmed) {
    return true
  }
  if (PLACEHOLDER_LINE.test(trimmed)) {
    return true
  }
  if (/^_\(?pending\)?_\s*$/i.test(trimmed)) {
    return true
  }
  return false
}

function sectionContentLines(content: string): string[] {
  return content
    .split("\n")
    .map((line) => line.trim())
    .filter(
      (line) =>
        line.length > 0 &&
        !line.startsWith(">") &&
        !line.startsWith("#") &&
        !/^On \*\*creation\*\*/i.test(line),
    )
}

function hasFilePathEvidence(text: string): boolean {
  if (!text.trim()) {
    return false
  }

  return sectionContentLines(text).some(
    (line) => !lineIsPlaceholder(line) && lineHasFilePathBacktick(line),
  )
}

function lineHasFilePathBacktick(line: string): boolean {
  const matches = line.match(/`([^`\n]+)`/g)
  if (!matches) {
    return false
  }

  return matches.some((token) => {
    const inner = token.slice(1, -1).trim()
    if (!inner || inner === "_n/a_") {
      return false
    }
    return inner.includes("/") || /\.(tsx?|jsx?|py|md|json|css|mjs|cjs)$/i.test(inner)
  })
}

function hasSubstantiveText(text: string): boolean {
  return sectionContentLines(text).some(
    (line) => !lineIsPlaceholder(line) && line !== "_n/a_",
  )
}

export function extractMarkdownSection(body: string, heading: string): string {
  const start = body.search(new RegExp(`^## ${heading}\\s*$`, "m"))
  if (start === -1) {
    return ""
  }
  const afterHeading = body.indexOf("\n", start)
  if (afterHeading === -1) {
    return ""
  }
  const rest = body.slice(afterHeading + 1)
  const nextSection = rest.search(/^## /m)
  const content = nextSection === -1 ? rest : rest.slice(0, nextSection)
  return content.trim()
}

export function extractMarkdownSubsection(section: string, heading: string): string {
  const start = section.search(new RegExp(`^### ${heading}\\s*$`, "m"))
  if (start === -1) {
    return ""
  }
  const afterHeading = section.indexOf("\n", start)
  if (afterHeading === -1) {
    return ""
  }
  const rest = section.slice(afterHeading + 1)
  const nextSection = rest.search(/^### /m)
  const content = nextSection === -1 ? rest : rest.slice(0, nextSection)
  return content.trim()
}

function recordSection(body: string): string {
  return extractMarkdownSection(body, "Record")
}

function planSection(body: string): string {
  return extractMarkdownSection(body, "Plan")
}

function intentSection(body: string): string {
  return extractMarkdownSection(body, "Intent")
}

export function getTechnicalImplementationStatus(
  body: string,
): TechnicalImplementationStatus {
  const section = recordSection(body)
  if (!section) {
    return "missing"
  }

  const lines = sectionContentLines(section)
  if (lines.length === 0) {
    return "missing"
  }

  if (lines.every(lineIsPlaceholder)) {
    return "placeholder"
  }

  const files = extractMarkdownSubsection(section, "Files")
  const hasFilesHeading = /^### Files\s*$/m.test(section)

  if (hasFilePathEvidence(files)) {
    return "documented"
  }

  if (!hasFilesHeading && hasFilePathEvidence(section)) {
    return "documented"
  }

  if (hasFilesHeading || hasSubstantiveText(section)) {
    return "incomplete"
  }

  return "placeholder"
}

export function resolveStoryDocumentationBadge(
  story: Pick<UserStory, "status">,
  body: string,
): StoryDocumentationBadge {
  if (story.status === "❌" || story.status === "🧊") {
    return null
  }

  if (getTechnicalImplementationStatus(body) === "documented") {
    return "impl-ok"
  }

  if (story.status === "✅" || story.status === "🔶") {
    return "impl-missing"
  }

  return null
}

export function acceptanceHasMissing(body: string): boolean {
  const acceptance = extractMarkdownSubsection(intentSection(body), "Acceptance")
  return /\*\*Missing:\*\*|^-\s+\[[ x]\]\s+.*Missing:/im.test(acceptance)
}

const PLANNED_TEST_LINE = /^-\s*\[( |x|X)\]\s+/i

export function getPlannedTestLines(body: string): string[] {
  const planned = extractMarkdownSubsection(planSection(body), "Planned")
  if (!planned) {
    return []
  }
  return planned
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => PLANNED_TEST_LINE.test(line))
}

export function allPlannedTestsChecked(body: string): boolean {
  const lines = getPlannedTestLines(body)
  if (lines.length === 0) {
    return false
  }
  return lines.every((line) => /^-\s*\[x\]/i.test(line))
}

export function executadoHasEvidence(body: string): boolean {
  const executado = extractMarkdownSubsection(recordSection(body), "Executed")
  if (!executado) {
    return false
  }
  const lines = executado
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith("#"))
  return lines.some(
    (line) => !/^_\([^)]*\)_\s*$/.test(line) && !/^_\(?pending\)?_\s*$/i.test(line),
  )
}

function appendTechnicalImplementationMessages(
  story: Pick<UserStory, "status">,
  body: string,
  messages: string[],
): void {
  if (story.status === "❌" || story.status === "🧊") {
    return
  }

  const implStatus = getTechnicalImplementationStatus(body)
  if (implStatus === "documented") {
    return
  }

  if (story.status === "✅") {
    messages.push(
      "Record: status ✅ requires ## Record with ### Files and real paths (/complete-us).",
    )
    return
  }

  if (story.status === "🔶") {
    messages.push(
      "Record: partial US missing touched-files record (fill in via /complete-us).",
    )
  }
}

export function validateStoryBody(
  story: Pick<UserStory, "status" | "tests" | "testsStatus">,
  body: string,
): string[] {
  const messages: string[] = []

  if (story.status === "🔶" && !acceptanceHasMissing(body)) {
    messages.push('Status 🔶 requires "Missing:" in the Acceptance section.')
  }

  if (story.tests === "none") {
    if (story.testsStatus !== "n/a") {
      messages.push("tests: none requires tests_status: n/a.")
    }
    appendTechnicalImplementationMessages(story, body, messages)
    return messages
  }

  if (story.testsStatus === "n/a") {
    messages.push("tests: required cannot use tests_status: n/a.")
  }

  const planned = getPlannedTestLines(body)
  if (planned.length === 0) {
    messages.push(
      "tests: required requires ### Planned under ## Plan with `- [ ]` items.",
    )
  }

  if (story.testsStatus === "done") {
    if (!allPlannedTestsChecked(body)) {
      messages.push("tests_status: done requires all items in ### Planned marked [x].")
    }
    if (!executadoHasEvidence(body)) {
      messages.push(
        "tests_status: done requires ### Executed under ## Record filled in.",
      )
    }
  }

  if (story.status === "✅") {
    if (story.testsStatus === "pending") {
      messages.push("status: ✅ requires tests_status: done (or tests: none).")
    }
    if (story.testsStatus === "done" && !allPlannedTestsChecked(body)) {
      messages.push("status: ✅ with incomplete tests in ### Planned.")
    }
  }

  appendTechnicalImplementationMessages(story, body, messages)

  return messages
}

const PLAN_PLACEHOLDER_MARKERS = [
  "_(fill in",
  "_(pending)_",
  "§ [section name",
  "§ …",
  "path/to/…",
  "add when implementation scope is known",
]

function planSectionIsPlaceholder(body: string): boolean {
  const plan = planSection(body)
  if (!plan.trim()) {
    return true
  }

  const substantive = sectionContentLines(plan).filter(
    (line) => line !== "_n/a_" && line !== "- _n/a_",
  )

  if (substantive.length === 0) {
    return true
  }

  const lowered = plan.toLowerCase()
  const hits = PLAN_PLACEHOLDER_MARKERS.filter((marker) =>
    lowered.includes(marker.toLowerCase()),
  ).length

  return hits >= Math.max(1, Math.ceil(substantive.length / 2))
}

function plannedTestsAreGeneric(body: string): boolean {
  const planned = extractMarkdownSubsection(planSection(body), "Planned")
  if (!planned.trim()) {
    return false
  }

  const lowered = planned.toLowerCase()
  if (lowered.includes("add when implementation scope is known")) {
    return true
  }

  return (
    lowered.includes("verify acceptance criteria end-to-end") &&
    !/^\d+\./m.test(planned)
  )
}

export function validateStoryReadiness(
  story: Pick<UserStory, "status" | "ready">,
  body: string,
): string[] {
  if (story.status === "✅" || story.status === "🧊") {
    return []
  }

  const messages: string[] = []

  if (!planSection(body).trim()) {
    messages.push("Missing ## Plan — run /refine-us before implement.")
  } else if (planSectionIsPlaceholder(body)) {
    messages.push("## Plan still has placeholders — run /refine-us.")
  }

  if (story.ready === false) {
    messages.push("ready: false — run /refine-us before implement.")
  } else if (story.ready !== true) {
    messages.push("ready not set to true — run /refine-us before implement.")
  }

  if (plannedTestsAreGeneric(body)) {
    messages.push("Plan/Planned still generic — run /refine-us with concrete steps.")
  }

  return messages
}
