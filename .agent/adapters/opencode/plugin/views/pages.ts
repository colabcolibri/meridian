// Presentation — single responsibility: render Meridian views as HTML pages.
// No data access, no transport: pure functions (data in → HTML out).

import type { Planning, Decisions } from "./data.ts"
import { buildColumns, columnHeaderLabel, countByColumn } from "./board.ts"

const NAV = [
  { path: "/", label: "Overview" },
  { path: "/board", label: "Board" },
  { path: "/versions", label: "Versions" },
  { path: "/sprints", label: "Sprints" },
  { path: "/epics", label: "Epics" },
  { path: "/decisions", label: "Decisions" },
]

export function esc(s: unknown): string {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
}

function layout(title: string, body: string, activePath: string, refreshSeconds?: number): string {
  const refresh = refreshSeconds
    ? `<meta http-equiv="refresh" content="${Number(refreshSeconds) || 30}">`
    : ""
  const nav = NAV.map(
    (item) =>
      `<a class="nav${item.path === activePath ? " active" : ""}" href="${item.path}">${item.label}</a>`,
  ).join("")
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
${refresh}<title>Meridian — ${esc(title)}</title>
<style>
  :root { color-scheme: dark; }
  * { box-sizing: border-box; }
  body { margin: 0; background: #0d1117; color: #c9d1d9; font: 14px/1.5 -apple-system, "Segoe UI", Roboto, sans-serif; }
  a { color: #58a6ff; text-decoration: none; }
  a:hover { text-decoration: underline; }
  header { display: flex; align-items: center; gap: 16px; padding: 10px 20px; background: #010409; border-bottom: 1px solid #21262d; position: sticky; top: 0; }
  header .brand { font-weight: 700; color: #e6edf3; }
  nav { display: flex; gap: 4px; flex-wrap: wrap; }
  .nav { padding: 4px 10px; border-radius: 6px; color: #c9d1d9; }
  .nav:hover { background: #161b22; text-decoration: none; }
  .nav.active { background: #1f6feb33; color: #58a6ff; }
  main { padding: 20px; max-width: 1400px; margin: 0 auto; }
  h1 { font-size: 18px; color: #e6edf3; margin: 0 0 4px; }
  .sub { color: #8b949e; margin: 0 0 16px; font-size: 12px; }
  .board { display: flex; gap: 10px; align-items: flex-start; overflow-x: auto; padding-bottom: 20px; }
  .column { background: #161b22; border: 1px solid #21262d; border-radius: 8px; min-width: 220px; flex: 1; }
  .column-header { padding: 8px 10px; font-weight: 600; font-size: 13px; border-bottom: 1px solid #21262d; color: #e6edf3; display: flex; justify-content: space-between; }
  .column-header .count { color: #8b949e; font-weight: 400; }
  .column-body { padding: 8px; display: flex; flex-direction: column; gap: 8px; min-height: 40px; }
  .card { background: #0d1117; border: 1px solid #30363d; border-radius: 6px; padding: 8px 10px; }
  .card .id { font-family: ui-monospace, monospace; font-size: 11px; }
  .card .title { color: #e6edf3; font-size: 13px; margin: 2px 0; }
  .card .meta { font-size: 11px; color: #8b949e; }
  .chip { display: inline-block; padding: 1px 8px; border-radius: 10px; border: 1px solid #30363d; font-size: 11px; margin: 2px 4px 2px 0; color: #c9d1d9; }
  .chip.on { background: #1f6feb33; border-color: #1f6feb; color: #58a6ff; }
  table { border-collapse: collapse; width: 100%; }
  th, td { text-align: left; padding: 6px 10px; border-bottom: 1px solid #21262d; vertical-align: top; }
  th { color: #8b949e; font-size: 12px; }
  td .mono, .mono { font-family: ui-monospace, monospace; font-size: 12px; }
  .muted { color: #8b949e; }
  .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 10px; margin: 12px 0 20px; }
  .stat { background: #161b22; border: 1px solid #21262d; border-radius: 8px; padding: 12px; }
  .stat .n { font-size: 22px; color: #e6edf3; font-weight: 700; }
  .error { background: #da363322; border: 1px solid #da3633; border-radius: 8px; padding: 14px; white-space: pre-wrap; }
  .empty { color: #8b949e; font-size: 12px; padding: 6px 2px; }
</style>
</head>
<body>
<header><span class="brand">◆ Meridian</span><nav>${nav}</nav></header>
<main>${body}</main>
</body>
</html>`
}

function chipRow(label: string, values: string[], selected: string, baseQuery: Record<string, string>, basePath: string): string {
  const mk = (value: string, text: string) => {
    const query = new URLSearchParams({ ...baseQuery })
    if (value === "") query.delete(label.toLowerCase())
    else query.set(label.toLowerCase(), value)
    const qs = query.toString()
    const on = selected === value || (value === "" && !selected)
    return `<a class="chip${on ? " on" : ""}" href="${basePath}${qs ? `?${qs}` : ""}">${esc(text)}</a>`
  }
  const parts = [mk("", `All ${label.toLowerCase()}s`)]
  for (const value of values) parts.push(mk(value, value))
  return `<div style="margin: 0 0 12px">${parts.join("")}</div>`
}

function card(story: Record<string, unknown>): string {
  const meta = [story.moscow, story.epic, story.version, story.sprint].filter(Boolean).join(" · ")
  const doneWhen = story.doneWhen ? ` title="${esc(story.doneWhen)}"` : ""
  return `<div class="card"${doneWhen}>
    <div class="id"><a href="#${esc(story.id)}">${esc(story.id)}</a></div>
    <div class="title">${esc(story.title)}</div>
    <div class="meta">${esc(meta)}</div>
  </div>`
}

export function renderDashboard(data: { planning: Planning; decisions: Decisions }, activePath: string): string {
  const { planning, decisions } = data
  const counts = countByColumn(planning.userStories)
  const stat = (n: unknown, label: string) => `<div class="stat"><div class="n">${esc(n ?? 0)}</div><div class="muted">${label}</div></div>`
  const boardCounts = ["backlog", "todo", "🔶", "🧪", "✅"]
    .map((key) => `${columnHeaderLabel(key)}: ${counts[key] ?? 0}`)
    .join(" · ")
  const body = `
<h1>Delivery overview</h1>
<p class="sub">${esc(planning.packageRoot)} · read-only · data cached 15s</p>
<div class="grid">
  ${stat(planning.userStories.length, "user stories")}
  ${stat(planning.versions.length, "versions")}
  ${stat(planning.epics.length, "epics")}
  ${stat(planning.sprints.length, "sprints")}
  ${stat(decisions.totalEntries, "decisions")}
</div>
<p><a href="/board">→ Open the kanban board</a></p>
<p class="muted mono">${esc(boardCounts)}</p>`
  return layout("Overview", body, activePath)
}

export type BoardFilters = { version: string; epic: string; sprint: string }

export function renderBoard(
  data: { planning: Planning },
  filters: BoardFilters,
  activePath: string,
  refreshSeconds?: number,
): string {
  const { planning } = data
  const match = (story: Record<string, unknown>): boolean =>
    (!filters.version || story.version === filters.version) &&
    (!filters.epic || story.epic === filters.epic) &&
    (!filters.sprint || story.sprint === filters.sprint)

  const stories = planning.userStories.filter((story) => match(story))
  const columns = buildColumns(stories)
  const baseQuery: Record<string, string> = {}
  if (filters.version) baseQuery.version = filters.version
  if (filters.epic) baseQuery.epic = filters.epic
  if (filters.sprint) baseQuery.sprint = filters.sprint

  const versions = [...new Set(planning.userStories.map((s) => s.version).filter(Boolean))].sort()
  const epics = [...new Set(planning.userStories.map((s) => s.epic).filter(Boolean))].sort()
  const sprints = [...new Set(planning.userStories.map((s) => s.sprint).filter(Boolean))].sort()

  const without = (key: string): Record<string, string> =>
    Object.fromEntries(Object.entries(baseQuery).filter(([k]) => k !== key))
  const refreshQuery = new URLSearchParams(baseQuery)
  const refreshHref = `${activePath}?refresh=30${refreshQuery.toString() ? `&${refreshQuery}` : ""}`

  const board = columns
    .map(
      (col) => `<div class="column">
        <div class="column-header"><span>${esc(col.label)}</span><span class="count">${col.stories.length}</span></div>
        <div class="column-body">${
          col.stories.length ? col.stories.map(card).join("") : `<div class="empty">empty</div>`
        }</div>
      </div>`,
    )
    .join("")

  const body = `
<h1>Kanban board</h1>
<p class="sub">${stories.length} of ${planning.userStories.length} stories shown · hover a card for done-when · <a href="${refreshHref}">auto-refresh 30s</a></p>
${chipRow("Version", versions, filters.version, without("version"), activePath)}
${chipRow("Epic", epics, filters.epic, without("epic"), activePath)}
${chipRow("Sprint", sprints, filters.sprint, without("sprint"), activePath)}
<div class="board">${board}</div>`
  return layout("Board", body, activePath, refreshSeconds)
}

function rows(items: Record<string, unknown>[], cols: { label: string; render: (item: Record<string, unknown>) => string }[]): string {
  return `<table><thead><tr>${cols.map((c) => `<th>${esc(c.label)}</th>`).join("")}</tr></thead>
<tbody>${items.map((item) => `<tr>${cols.map((c) => `<td>${c.render(item)}</td>`).join("")}</tr>`).join("")}</tbody></table>`
}

export function renderVersions(data: { planning: Planning }, activePath: string): string {
  const body = `<h1>Versions</h1><p class="sub">${data.planning.versions.length} releases</p>` +
    rows(data.planning.versions, [
      { label: "ID", render: (v) => `<span class="mono">${esc(v.id)}</span>` },
      { label: "Title", render: (v) => esc(v.title) },
      { label: "Status", render: (v) => esc(v.status) },
      { label: "Outcome / summary", render: (v) => `<span class="muted">${esc(v.outcome || v.summary || "")}</span>` },
    ])
  return layout("Versions", body, activePath)
}

export function renderSprints(data: { planning: Planning }, activePath: string): string {
  const body = `<h1>Sprints</h1><p class="sub">${data.planning.sprints.length} sprints</p>` +
    rows(data.planning.sprints, [
      { label: "ID", render: (s) => `<span class="mono">${esc(s.id)}</span>` },
      { label: "Version", render: (s) => `<span class="mono">${esc(s.version)}</span>` },
      { label: "Title", render: (s) => esc(s.title) },
      { label: "Status", render: (s) => esc(s.status) },
      { label: "Stories", render: (s) => esc(Array.isArray(s.stories) ? s.stories.length : 0) },
      { label: "Goal", render: (s) => `<span class="muted">${esc(s.goal || s.summary || "")}</span>` },
    ])
  return layout("Sprints", body, activePath)
}

export function renderEpics(data: { planning: Planning }, activePath: string): string {
  const body = `<h1>Epics</h1><p class="sub">${data.planning.epics.length} epics</p>` +
    rows(data.planning.epics, [
      { label: "ID", render: (e) => `<span class="mono">${esc(e.id)}</span>` },
      { label: "Title", render: (e) => esc(e.title) },
      { label: "Status", render: (e) => esc(e.status) },
      { label: "Versions", render: (e) => `<span class="mono">${esc(Array.isArray(e.versions) ? e.versions.join(", ") : e.versions ?? "")}</span>` },
      { label: "Outcome", render: (e) => `<span class="muted">${esc(e.outcome || e.summary || "")}</span>` },
    ])
  return layout("Epics", body, activePath)
}

export function renderDecisions(data: { decisions: Decisions }, activePath: string): string {
  const sections = [...data.decisions.dates]
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(
      (day) => `<h1 style="font-size:15px">${esc(day.date)} <span class="muted">(${day.count})</span></h1>` +
        rows(day.entries as unknown as Record<string, unknown>[], [
          { label: "Time", render: (e) => `<span class="mono">${esc(e.time)}</span>` },
          { label: "Title", render: (e) => esc(e.title) },
          { label: "What changed", render: (e) => `<span class="muted">${esc(e.what_changed)}</span>` },
        ]),
    )
    .join("")
  const body = `<h1>Decisions</h1><p class="sub">${data.decisions.totalEntries} entries</p>${sections || `<p class="empty">none</p>`}`
  return layout("Decisions", body, activePath)
}

export function renderError(message: string, activePath: string): string {
  const body = `<h1>Meridian views</h1><div class="error">${esc(message)}</div><p class="sub">Check that the Meridian kit is installed and the delivery database exists (.meridian/).</p>`
  return layout("Error", body, activePath)
}
