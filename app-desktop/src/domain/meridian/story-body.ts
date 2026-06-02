import type { UserStory } from "@/domain/meridian/types"

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

  return messages
}
