function esc(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function formatInline(text: string): string {
  let out = esc(text)
  out = out.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
  out = out.replace(/`([^`]+)`/g, "<code>$1</code>")
  out = out.replace(/\*(.+?)\*/g, "<em>$1</em>")
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<span class="md-link">$1</span>')
  return out
}

function isTableLine(line: string): boolean {
  return line.trimStart().startsWith("|")
}

function isBlockStart(line: string): boolean {
  const t = line.trim()
  return (
    t.startsWith("#") ||
    t.startsWith("```") ||
    isTableLine(line) ||
    /^---+$/.test(t) ||
    /^[-*]\s+/.test(t) ||
    /^\d+\.\s+/.test(t)
  )
}

function parseTableRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((c) => c.trim())
}

function isSeparatorRow(cells: string[]): boolean {
  return cells.every((c) => /^:?-{3,}:?$/.test(c))
}

function renderTable(lines: string[]): string {
  const rows = lines.map(parseTableRow)
  if (rows.length === 0) {
    return ""
  }
  const header = rows[0] ?? []
  let body = rows.slice(1)
  if (body.length > 0 && isSeparatorRow(body[0] ?? [])) {
    body = body.slice(1)
  }
  const thead = `<tr>${header.map((c) => `<th>${formatInline(c)}</th>`).join("")}</tr>`
  const tbody = body
    .map((row) => `<tr>${row.map((c) => `<td>${formatInline(c)}</td>`).join("")}</tr>`)
    .join("")
  return `<div class="table-wrap"><table>${thead}${tbody}</table></div>`
}

/** Minimal markdown → HTML for kit reference pages (agents-help.md). */
export function markdownToHtml(markdown: string): string {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n")
  const out: string[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i] ?? ""

    if (line.startsWith("```")) {
      i++
      const code: string[] = []
      while (i < lines.length && !(lines[i] ?? "").startsWith("```")) {
        code.push(lines[i] ?? "")
        i++
      }
      out.push(`<pre><code>${esc(code.join("\n"))}</code></pre>`)
      if (i < lines.length) {
        i++
      }
      continue
    }

    if (isTableLine(line)) {
      const tableLines: string[] = []
      while (i < lines.length && isTableLine(lines[i] ?? "")) {
        tableLines.push(lines[i] ?? "")
        i++
      }
      out.push(renderTable(tableLines))
      continue
    }

    const heading = line.match(/^(#{1,6})\s+(.+)$/)
    if (heading) {
      const level = heading[1]?.length ?? 1
      out.push(`<h${level}>${formatInline(heading[2] ?? "")}</h${level}>`)
      i++
      continue
    }

    if (/^---+$/.test(line.trim())) {
      out.push("<hr />")
      i++
      continue
    }

    if (/^[-*]\s+/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^[-*]\s+/.test(lines[i] ?? "")) {
        items.push((lines[i] ?? "").replace(/^[-*]\s+/, ""))
        i++
      }
      out.push(`<ul>${items.map((item) => `<li>${formatInline(item)}</li>`).join("")}</ul>`)
      continue
    }

    if (line.trim() === "") {
      i++
      continue
    }

    const para: string[] = [line]
    i++
    while (
      i < lines.length &&
      (lines[i] ?? "").trim() !== "" &&
      !isBlockStart(lines[i] ?? "")
    ) {
      para.push(lines[i] ?? "")
      i++
    }
    out.push(`<p>${formatInline(para.join(" "))}</p>`)
  }

  return out.join("\n")
}

export { esc, formatInline }
