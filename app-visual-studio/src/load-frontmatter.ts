import { parse as parseYaml } from "yaml"

export function extractFrontmatter(raw: string): string | null {
  const t = raw.replace(/^\uFEFF/, "")
  if (!t.startsWith("---")) {
    return null
  }
  const end = t.indexOf("---", 3)
  return end === -1 ? null : t.slice(3, end).trim()
}

export function parseFrontmatterRecord(raw: string): Record<string, unknown> | null {
  const fm = extractFrontmatter(raw)
  if (!fm) {
    return null
  }
  try {
    return parseYaml(fm) as Record<string, unknown>
  } catch {
    return null
  }
}

export function parseStringList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((v): v is string => typeof v === "string")
  }
  if (typeof value === "string") {
    return value
      .split(/[,\s]+/)
      .map((s) => s.trim())
      .filter(Boolean)
  }
  return []
}
