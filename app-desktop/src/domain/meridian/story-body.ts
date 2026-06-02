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
  const acceptance = extractMarkdownSection(body, "Aceite")
  return /\*\*Falta:\*\*|^-\s+\[[ x]\]\s+.*Falta:/im.test(acceptance)
}

const PLANNED_TEST_LINE = /^-\s*\[( |x|X)\]\s+/i

export function getPlannedTestLines(body: string): string[] {
  const tests = extractMarkdownSection(body, "Testes")
  const planned = extractMarkdownSubsection(tests, "Planejado")
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
  const tests = extractMarkdownSection(body, "Testes")
  const executado = extractMarkdownSubsection(tests, "Executado")
  if (!executado) {
    return false
  }
  const lines = executado
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith("#"))
  return lines.some(
    (line) => !/^_\([^)]*\)_\s*$/.test(line) && !/^_\(?pendente\)?_\s*$/i.test(line),
  )
}

export function validateStoryBody(
  story: Pick<UserStory, "status" | "tests" | "testsStatus">,
  body: string,
): string[] {
  const messages: string[] = []

  if (story.status === "🔶" && !acceptanceHasFalta(body)) {
    messages.push('Status 🔶 exige "Falta:" na seção Aceite.')
  }

  if (story.tests === "none") {
    if (story.testsStatus !== "n/a") {
      messages.push("tests: none exige tests_status: n/a.")
    }
    return messages
  }

  if (story.testsStatus === "n/a") {
    messages.push("tests: required não pode usar tests_status: n/a.")
  }

  const planned = getPlannedTestLines(body)
  if (planned.length === 0) {
    messages.push("tests: required exige ### Planejado com itens `- [ ]`.")
  }

  if (story.testsStatus === "done") {
    if (!allPlannedTestsChecked(body)) {
      messages.push(
        "tests_status: done exige todos os itens em ### Planejado marcados [x].",
      )
    }
    if (!executadoHasEvidence(body)) {
      messages.push("tests_status: done exige ### Executado preenchido.")
    }
  }

  if (story.status === "✅") {
    if (story.testsStatus === "pending") {
      messages.push("status: ✅ exige tests_status: done (ou tests: none).")
    }
    if (story.testsStatus === "done" && !allPlannedTestsChecked(body)) {
      messages.push("status: ✅ com testes incompletos em ### Planejado.")
    }
  }

  return messages
}
