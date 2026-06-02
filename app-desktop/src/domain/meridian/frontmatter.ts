import { parse as parseYaml } from "yaml"

export interface SplitMarkdown {
  frontmatter: string | null
  body: string
  raw: string
}

export function splitMarkdown(raw: string): SplitMarkdown {
  const trimmed = raw.replace(/^\uFEFF/, "")
  if (!trimmed.startsWith("---")) {
    return { frontmatter: null, body: trimmed, raw: trimmed }
  }
  const end = trimmed.indexOf("---", 3)
  if (end === -1) {
    return { frontmatter: null, body: trimmed, raw: trimmed }
  }
  return {
    frontmatter: trimmed.slice(3, end).trim(),
    body: trimmed.slice(end + 3).trim(),
    raw: trimmed,
  }
}

/** Collapses multiline YAML arrays (e.g. depends_on) for the yaml parser. */
export function collapseMultilineYamlArrays(yaml: string): string {
  const lines = yaml.split("\n")
  const out: string[] = []
  let index = 0

  while (index < lines.length) {
    const line = lines[index]
    const keyOnly = line.match(/^(\w+):\s*$/)

    if (
      keyOnly &&
      index + 1 < lines.length &&
      lines[index + 1].trim().startsWith("[")
    ) {
      const key = keyOnly[1]
      let chunk = ""
      index += 1
      while (index < lines.length) {
        chunk += `${lines[index].trim()} `
        if (lines[index].includes("]")) {
          index += 1
          break
        }
        index += 1
      }
      out.push(`${key}: ${chunk.trim()}`)
      continue
    }

    out.push(line)
    index += 1
  }

  return out.join("\n")
}

export function parseFrontmatterRecord(yaml: string): Record<string, unknown> {
  const collapsed = collapseMultilineYamlArrays(yaml)
  const parsed = parseYaml(collapsed)
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Invalid frontmatter: expected YAML object.")
  }
  return parsed as Record<string, unknown>
}
