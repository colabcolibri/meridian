import type { UserStory } from "@/domain/meridian/types"

export type TechnicalImplementationStatus = "documented" | "placeholder" | "missing"

export type StoryDocumentationBadge = "doc" | "sem-doc" | null

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

function hasPathEvidence(text: string): boolean {
  if (!text.trim()) {
    return false
  }

  return sectionContentLines(text).some(
    (line) => !lineIsPlaceholder(line) && /`[^`\n]+`/.test(line),
  )
}

function hasSubstantiveText(text: string): boolean {
  return sectionContentLines(text).some(
    (line) => !lineIsPlaceholder(line) && line !== "_n/a_",
  )
}

function subsectionNames(section: string): string[] {
  const matches = section.match(/^### (.+)$/gm)
  if (!matches) {
    return []
  }
  return matches.map((heading) => heading.replace(/^###\s+/, "").trim())
}

export function getTechnicalImplementationStatus(
  body: string,
): TechnicalImplementationStatus {
  const section = extractMarkdownSection(body, "Technical implementation")
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
  if (hasPathEvidence(files)) {
    return "documented"
  }

  for (const name of subsectionNames(section)) {
    const subsection = extractMarkdownSubsection(section, name)
    if (name === "Files") {
      continue
    }
    if (hasPathEvidence(subsection) || hasSubstantiveText(subsection)) {
      return "documented"
    }
  }

  if (hasPathEvidence(section) || hasSubstantiveText(section)) {
    return "documented"
  }

  const subsections = subsectionNames(section).map((name) =>
    extractMarkdownSubsection(section, name),
  )
  if (
    subsections.length > 0 &&
    subsections.every(
      (subsection) => !hasSubstantiveText(subsection) && !hasPathEvidence(subsection),
    )
  ) {
    return "placeholder"
  }

  return "missing"
}

export function resolveStoryDocumentationBadge(
  story: Pick<UserStory, "status">,
  body: string,
): StoryDocumentationBadge {
  if (story.status === "❌" || story.status === "🧊") {
    return null
  }

  const implStatus = getTechnicalImplementationStatus(body)
  if (implStatus === "documented") {
    return "doc"
  }

  if (story.status === "✅" || story.status === "🔶") {
    return "sem-doc"
  }

  return null
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

export function acceptanceHasFalta(body: string): boolean {
  const acceptance = extractMarkdownSection(body, "Acceptance")
  return /\*\*Missing:\*\*|^-\s+\[[ x]\]\s+.*Missing:/im.test(acceptance)
}

const PLANNED_TEST_LINE = /^-\s*\[( |x|X)\]\s+/i

export function getPlannedTestLines(body: string): string[] {
  const tests = extractMarkdownSection(body, "Tests")
  const planned = extractMarkdownSubsection(tests, "Planned")
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
  const tests = extractMarkdownSection(body, "Tests")
  const executado = extractMarkdownSubsection(tests, "Executed")
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
      "Technical implementation: status ✅ requires ## Technical implementation filled (files + layers).",
    )
    return
  }

  if (story.status === "🔶") {
    messages.push(
      "Technical implementation: partial US has no implementation record yet (fill on close).",
    )
  }
}

export function validateStoryBody(
  story: Pick<UserStory, "status" | "tests" | "testsStatus">,
  body: string,
): string[] {
  const messages: string[] = []

  if (story.status === "🔶" && !acceptanceHasFalta(body)) {
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
    messages.push("tests: required requires ### Planned with `- [ ]` items.")
  }

  if (story.testsStatus === "done") {
    if (!allPlannedTestsChecked(body)) {
      messages.push("tests_status: done requires all items in ### Planned marked [x].")
    }
    if (!executadoHasEvidence(body)) {
      messages.push("tests_status: done requires ### Executed filled in.")
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
