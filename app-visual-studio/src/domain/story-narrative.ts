/** Compact As / I want / so that for board cards (no H1, no markdown). */
export function compactStoryNarrative(preamble: string | null | undefined): string | null {
  if (!preamble?.trim()) {
    return null
  }
  let text = preamble.trim()
  text = text.replace(/^#\s+US-\d{4}\s*[—-]\s*.+\n?/i, "")
  text = text.replace(/\*\*/g, "")
  text = text.replace(/\s+/g, " ").trim()
  if (!text) {
    return null
  }
  if (text.length > 140) {
    return `${text.slice(0, 137)}…`
  }
  return text
}

export function extractUsPreamble(raw: string): string {
  let body = raw
  if (body.replace(/^\uFEFF/, "").startsWith("---")) {
    const end = body.indexOf("---", 3)
    if (end !== -1) {
      body = body.slice(end + 3)
    }
  }
  const match = /^## /m.exec(body)
  if (!match || match.index === undefined) {
    return body.trim()
  }
  return body.slice(0, match.index).trim()
}
