import {
  extractMarkdownSection,
  extractMarkdownSubsection,
} from "@/domain/meridian/story-body"
import type { UserStory } from "@/domain/meridian/types"

export const US_H2_SECTIONS = [
  "Acceptance",
  "Context & constraints",
  "Technical implementation",
  "Tests",
  "Out of scope for this story",
  "Notes",
] as const

export const US_CONTEXT_H3 = [
  "Why this story",
  "Where it fits",
  "Approach",
  "Architecture refs",
  "API / DB impact",
  "Security notes",
  "Related decisions",
] as const

export const US_CONTEXT_H3_LEGACY = [
  "Architecture refs",
  "API / DB impact",
  "Security notes",
  "Related decisions",
  "Implementation hints (preliminary)",
] as const

export const US_TECH_H3 = ["Files", "Backend", "Frontend", "Scripts / Docs"] as const

export const US_TESTS_H3 = ["Planned", "Executed"] as const

export const US_FRONTMATTER_REQUIRED = [
  "id",
  "title",
  "epic",
  "version",
  "status",
  "moscow",
  "done_when",
  "tests",
  "tests_status",
] as const

export const US_FRONTMATTER_STRICT = [
  ...US_FRONTMATTER_REQUIRED,
  "ready",
  "depends_on",
] as const

const VERSION_H2_RULES: ReadonlyArray<{ canonical: string; aliases: string[] }> = [
  { canonical: "Objective", aliases: ["Objective", "Goal"] },
  { canonical: "Done criteria", aliases: ["Done criteria"] },
  { canonical: "Included in this version", aliases: ["Included in this version"] },
  { canonical: "Explicitly out", aliases: ["Explicitly out"] },
  { canonical: "Go-live checklist", aliases: ["Go-live checklist"] },
]

export function listH2Sections(body: string): string[] {
  const matches = body.match(/^## (.+)$/gm)
  return matches ? matches.map((line) => line.replace(/^## /, "").trim()) : []
}

function hasH2Match(present: string[], canonical: string, aliases: string[]): boolean {
  for (const option of aliases) {
    if (present.includes(option)) {
      return true
    }
    if (
      present.some((heading) => heading === option || heading.startsWith(`${option} `))
    ) {
      return true
    }
  }
  return false
}

function listH3InSection(body: string, h2Heading: string): string[] {
  const section = extractMarkdownSection(body, h2Heading)
  if (!section) {
    return []
  }
  const matches = section.match(/^### (.+)$/gm)
  return matches ? matches.map((line) => line.replace(/^### /, "").trim()) : []
}

export function validateUserStoryStructure(
  storyId: string,
  body: string,
  strict: boolean,
  status?: UserStory["status"],
): string[] {
  const messages: string[] = []
  const h2Present = listH2Sections(body)

  if (strict) {
    for (const section of US_H2_SECTIONS) {
      if (!h2Present.includes(section)) {
        messages.push(
          `${storyId}: missing required ## ${section} (strict US with ready).`,
        )
      }
    }

    const contextH3 = listH3InSection(body, "Context & constraints")
    const hasNewContext = US_CONTEXT_H3.every((name) => contextH3.includes(name))
    const hasLegacyContext = US_CONTEXT_H3_LEGACY.every((name) =>
      contextH3.includes(name),
    )

    if (hasNewContext) {
      // canonical Context subsections
    } else if (hasLegacyContext) {
      messages.push(
        `${storyId}: Context uses legacy subsections — run /refine-us to add Why this story, Where it fits, and Approach.`,
      )
    } else {
      for (const subsection of US_CONTEXT_H3) {
        if (!contextH3.includes(subsection)) {
          messages.push(
            `${storyId}: missing ### ${subsection} under ## Context & constraints.`,
          )
        }
      }
    }

    for (const subsection of US_TECH_H3) {
      if (!listH3InSection(body, "Technical implementation").includes(subsection)) {
        messages.push(
          `${storyId}: missing ### ${subsection} under ## Technical implementation.`,
        )
      }
    }

    for (const subsection of US_TESTS_H3) {
      if (!listH3InSection(body, "Tests").includes(subsection)) {
        messages.push(`${storyId}: missing ### ${subsection} under ## Tests.`)
      }
    }
  } else {
    if (!h2Present.includes("Context & constraints")) {
      messages.push(
        `${storyId}: missing ## Context & constraints (legacy — run /refine-us).`,
      )
    }
    for (const section of ["Out of scope for this story", "Notes"] as const) {
      if (!h2Present.includes(section)) {
        messages.push(`${storyId}: missing ## ${section} (recommended by template).`)
      }
    }
  }

  for (const section of ["Acceptance", "Tests", "Technical implementation"] as const) {
    if (!h2Present.includes(section)) {
      messages.push(`${storyId}: missing required ## ${section} (see us-template.md).`)
    }
  }

  if (status === "✅" && !h2Present.includes("Technical implementation")) {
    messages.push(`${storyId}: status ✅ requires ## Technical implementation section.`)
  }

  return messages
}

export function validateEpicStructure(epicId: string, body: string): string[] {
  const messages: string[] = []
  const h2Present = listH2Sections(body)

  for (const section of ["Capability", "Expected outcome"] as const) {
    if (!h2Present.includes(section)) {
      messages.push(`${epicId}: missing required ## ${section} (see epic-template.md).`)
    }
  }

  if (
    !hasH2Match(h2Present, "Out of scope for this epic", [
      "Out of scope for this epic",
      "Out of this epic",
    ])
  ) {
    messages.push(
      `${epicId}: missing required ## Out of scope for this epic (see epic-template.md).`,
    )
  }

  return messages
}

export function validateVersionStructure(versionId: string, body: string): string[] {
  const messages: string[] = []
  const h2Present = listH2Sections(body)

  for (const rule of VERSION_H2_RULES) {
    if (!hasH2Match(h2Present, rule.canonical, rule.aliases)) {
      messages.push(
        `${versionId}: missing required ## ${rule.canonical} (see version-template.md).`,
      )
    }
  }

  return messages
}

export function plannedSectionFromBody(body: string): string {
  const tests = extractMarkdownSection(body, "Tests")
  return extractMarkdownSubsection(tests, "Planned")
}
