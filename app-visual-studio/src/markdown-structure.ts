/** Wrap parsed markdown HTML into Meridian lanes (h2) and fields (h3). */

const LANE_SLUGS = new Set(["intent", "plan", "record", "boundaries"])

function slug(text: string): string {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

function wrapFieldsHtml(html: string): string {
  const parts = html.split(/(?=<h3(?:\s[^>]*)?>)/i)
  if (parts.length <= 1) {
    return html
  }
  let out = parts[0] ?? ""
  for (const part of parts.slice(1)) {
    const match = part.match(/^<h3(?:\s[^>]*)?>([\s\S]*?)<\/h3>/i)
    if (!match) {
      out += part
      continue
    }
    const field = slug(match[1] ?? "")
    const rest = part.slice(match[0].length)
    out += `<div class="md-field"${field ? ` data-field="${field}"` : ""}><h3 class="md-field-title"${field ? ` data-field="${field}"` : ""}>${match[1]}</h3>${rest}</div>`
  }
  return out
}

function wrapLaneHtml(chunk: string): string {
  const match = chunk.match(/^<h2(?:\s[^>]*)?>([\s\S]*?)<\/h2>/i)
  if (!match) {
    return chunk
  }
  const lane = slug(match[1] ?? "")
  const laneKey = LANE_SLUGS.has(lane) ? lane : lane || "section"
  const rest = wrapFieldsHtml(chunk.slice(match[0].length))
  return `<section class="md-lane" data-lane="${laneKey}"><h2 class="md-lane-title" data-lane="${laneKey}">${match[1]}</h2>${rest}</section>`
}

export function structureMarkdownHtml(html: string): string {
  const trimmed = html.trim()
  if (!/<h2[\s>]/i.test(trimmed)) {
    return trimmed
  }

  const parts = trimmed.split(/(?=<h2(?:\s[^>]*)?>)/i)
  const head = parts[0]?.trim() ?? ""
  let out = ""

  if (head && !/^<h2/i.test(head)) {
    out += `<div class="md-preamble">${head}</div>`
  }

  const lanes = head && !/^<h2/i.test(head) ? parts.slice(1) : parts
  for (const part of lanes) {
    const lane = part.trim()
    if (!lane) continue
    out += wrapLaneHtml(lane)
  }

  return out
}
