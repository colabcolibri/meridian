import {
  extractMarkdownSection,
  extractMarkdownSubsection,
} from "@/domain/meridian/story-body"
import type { UserStory } from "@/domain/meridian/types"

/** US schema v2 — grouped by delivery phase. */
export const US_H2_SECTIONS = ["Intent", "Plan", "Record", "Boundaries"] as const

export const US_INTENT_H3 = ["Acceptance", "Why", "Where"] as const

export const US_PLAN_H3 = [
  "Architecture refs",
  "API / DB impact",
  "Security notes",
  "Related decisions",
  "Planned",
] as const

export const US_PLAN_H3_OPTIONAL = ["Approach"] as const

export const US_RECORD_H3 = [
  "Files",
  "Backend",
  "Frontend",
  "Scripts / Docs",
  "Executed",
] as const

export const US_BOUNDARIES_H3 = ["Out of scope for this story", "Notes"] as const

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

function subsectionHeading(name: string): string {
  return name.replace(/ \(optional\)$/i, "").trim()
}

export function validateUserStoryStructure(
  storyId: string,
  body: string,
  strict: boolean,
  status?: UserStory["status"],
): string[] {
  const messages: string[] = []
  const h2Present = listH2Sections(body)

  for (const section of US_H2_SECTIONS) {
    if (!h2Present.includes(section)) {
      messages.push(`${storyId}: missing required ## ${section} (see us-template.md).`)
    }
  }

  if (strict) {
    for (const subsection of US_INTENT_H3) {
      if (!listH3InSection(body, "Intent").includes(subsection)) {
        messages.push(`${storyId}: missing ### ${subsection} under ## Intent.`)
      }
    }

    const planH3 = listH3InSection(body, "Plan").map(subsectionHeading)
    for (const subsection of US_PLAN_H3) {
      if (!planH3.includes(subsection)) {
        messages.push(`${storyId}: missing ### ${subsection} under ## Plan.`)
      }
    }

    for (const subsection of US_RECORD_H3) {
      if (!listH3InSection(body, "Record").includes(subsection)) {
        messages.push(`${storyId}: missing ### ${subsection} under ## Record.`)
      }
    }

    for (const subsection of US_BOUNDARIES_H3) {
      if (!listH3InSection(body, "Boundaries").includes(subsection)) {
        messages.push(`${storyId}: missing ### ${subsection} under ## Boundaries.`)
      }
    }
  } else {
    for (const subsection of ["Out of scope for this story", "Notes"] as const) {
      if (!listH3InSection(body, "Boundaries").includes(subsection)) {
        messages.push(
          `${storyId}: missing ### ${subsection} under ## Boundaries (recommended).`,
        )
      }
    }
  }

  if (status === "✅" && !h2Present.includes("Record")) {
    messages.push(`${storyId}: status ✅ requires ## Record with delivery evidence.`)
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
  const plan = extractMarkdownSection(body, "Plan")
  return extractMarkdownSubsection(plan, "Planned")
}
