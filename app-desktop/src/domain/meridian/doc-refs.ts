/** Converte `01_tech_stack.md` → `01_tech_stack`. */
export function normalizeDocRef(value: string): string {
  return value.replace(/\.md$/i, "").trim()
}

export function normalizeDocRefList(values: unknown): string[] {
  if (!Array.isArray(values)) {
    return []
  }
  return values
    .filter((item): item is string => typeof item === "string")
    .map(normalizeDocRef)
}

export function phaseLabelForDocId(id: string): string {
  if (id.startsWith("11")) {
    return "Contínuo"
  }
  if (id.startsWith("07")) {
    return "Fase 2"
  }
  if (id.startsWith("08") || id.startsWith("09") || id.startsWith("10")) {
    return "Fase 3"
  }
  if (id.startsWith("04") || id.startsWith("05") || id.startsWith("06")) {
    return "Fase 1"
  }
  return "Fase 0"
}

export function extractPurposeFromBody(body: string): string {
  const lines = body.split("\n")
  let seenMainHeading = false

  for (const line of lines) {
    if (/^#\s+\d{2}\s*—/.test(line) || /^#\s+/.test(line)) {
      seenMainHeading = true
      continue
    }
    if (!seenMainHeading) {
      continue
    }
    if (line.startsWith("#")) {
      continue
    }
    const text = line.trim()
    if (text.length > 0 && !text.startsWith("|") && !text.startsWith("```")) {
      return text.length > 220 ? `${text.slice(0, 217)}…` : text
    }
  }

  return ""
}
