import type { StoryStatus } from "@/domain/meridian/types"

export function extractMarkdownSection(body: string, heading: string): string {
  const pattern = new RegExp(`^## ${heading}\\s*\\n([\\s\\S]*?)(?=^## |\\z)`, "m")
  const match = body.match(pattern)
  return match?.[1]?.trim() ?? ""
}

export function acceptanceHasFalta(body: string): boolean {
  const acceptance = extractMarkdownSection(body, "Aceite")
  return /\*\*Falta:\*\*|^-\s+\[[ x]\]\s+.*Falta:/im.test(acceptance)
}

export function testsSectionMissingEvidence(body: string): boolean {
  const tests = extractMarkdownSection(body, "Testes")
  if (!tests) {
    return true
  }
  const lines = tests
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith("#"))
  return lines.length === 0
}

export function validateStoryBody(status: StoryStatus, body: string): string[] {
  const messages: string[] = []

  if (status === "🔶" && !acceptanceHasFalta(body)) {
    messages.push('Status 🔶 exige "Falta:" na seção Aceite.')
  }

  if (status === "✅" && testsSectionMissingEvidence(body)) {
    messages.push("Status ✅ sem evidência na seção Testes.")
  }

  return messages
}
