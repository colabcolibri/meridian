import type { DeliveryFolder } from "./delivery-path.js"

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/

export function parseFrontmatterLine(line: string): [string, string] | null {
  const idx = line.indexOf(":")
  if (idx === -1) {
    return null
  }
  const key = line.slice(0, idx).trim()
  let value = line.slice(idx + 1).trim()
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1)
  }
  return [key, value]
}

export function parseDeliveryMarkdown(text: string): {
  frontmatter: Record<string, string>
  body: string
  full: string
} {
  const match = FRONTMATTER_RE.exec(text)
  if (!match) {
    return { frontmatter: {}, body: text, full: text }
  }
  const frontmatter: Record<string, string> = {}
  for (const line of match[1].split("\n")) {
    const parsed = parseFrontmatterLine(line)
    if (parsed) {
      frontmatter[parsed[0]] = parsed[1]
    }
  }
  const body = text.slice(match[0].length)
  return { frontmatter, body, full: text }
}

const ENTITY_LABELS: Record<DeliveryFolder, string> = {
  us: "User story",
  epics: "Epic",
  versions: "Version",
  sprints: "Sprint",
}

export function deliveryEntityLabel(folder: DeliveryFolder): string {
  return ENTITY_LABELS[folder]
}

export function frontmatterBadgeKeys(folder: DeliveryFolder): string[] {
  const common = ["id", "title", "status"]
  switch (folder) {
    case "us":
      return [...common, "epic", "version", "sprint", "moscow", "ready"]
    case "epics":
      return [...common, "versions", "outcome"]
    case "versions":
      return [...common, "outcome"]
    case "sprints":
      return [...common, "version", "goal"]
    default:
      return common
  }
}
