import {
  COMMAND_HELP_GROUPS,
  MERIDIAN_COMMAND_CATALOG,
  type CommandHelpEntry,
} from "./command-catalog.js"

function esc(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function renderEntry(entry: CommandHelpEntry): string {
  const details = entry.details.map((d) => `<li>${esc(d)}</li>`).join("")
  const output = entry.outputChannel
    ? `<p class="meta"><span class="badge">Output</span> ${esc(entry.outputChannel)}</p>`
    : ""
  const status =
    entry.status === "stub"
      ? `<span class="badge stub">Coming soon</span>`
      : `<span class="badge ok">Available</span>`

  return `<article class="card">
    <header class="card-head">
      <h2>${esc(entry.title)}</h2>
      ${status}
    </header>
    <p class="palette"><code>${esc(entry.paletteTitle)}</code></p>
    <p class="lead">${esc(entry.summary)}</p>
    <ul class="details">${details}</ul>
    ${output}
  </article>`
}

const HOW_TO_USE_HTML = `
  <section class="onboarding" id="extension-commands-intro">
    <h1>Extension commands</h1>
    <p class="lead">This tab lists <strong>IDE palette commands</strong> (board, validate, kit install). For chat slash commands (<code>/create-us</code>, <code>/status</code>), open <strong>Meridian: Open How to Use</strong> or <code>.agent/references/agents-help.md</code>.</p>
    <p class="hint">Human guides (read in order): How to use → Concepts → Usage guide → Agents help (reference).</p>
  </section>
`

export function helpWebviewHtml(): string {
  const sections = COMMAND_HELP_GROUPS.map((group) => {
    const entries = MERIDIAN_COMMAND_CATALOG.filter((c) => c.group === group.id)
    if (entries.length === 0) {
      return ""
    }
    const cards = entries.map(renderEntry).join("")
    return `<section class="group">
      <h1>${esc(group.label)}</h1>
      ${cards}
    </section>`
  }).join("")

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline';" />
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: var(--vscode-font-family);
      font-size: calc(var(--vscode-font-size) * 1.08);
      line-height: 1.55;
      color: var(--vscode-foreground);
      background: var(--vscode-editor-background);
      padding: 20px 24px 32px;
      max-width: 760px;
    }
    .onboarding {
      margin-bottom: 32px;
      padding-bottom: 24px;
      border-bottom: 1px solid var(--vscode-panel-border);
    }
    .onboarding h1 {
      margin: 0 0 12px;
      font-size: 1.4em;
      font-weight: 600;
    }
    .onboarding h2 {
      margin: 20px 0 10px;
      font-size: 1.05em;
      font-weight: 600;
    }
    .onboarding .lead { margin: 0 0 16px; color: var(--vscode-descriptionForeground); }
    .onboarding .hint {
      margin: 12px 0 0;
      font-size: 0.95em;
      color: var(--vscode-descriptionForeground);
    }
    .steps { margin: 0 0 12px; padding-left: 1.3em; }
    .steps li { margin-bottom: 6px; }
    .rules { margin: 0 0 12px; padding-left: 1.25em; }
    .rules li { margin-bottom: 6px; }
    .table-wrap {
      overflow-x: auto;
      margin: 0 0 16px;
      border: 1px solid var(--vscode-panel-border);
      border-radius: 8px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.96em;
    }
    th, td {
      padding: 8px 10px;
      border-bottom: 1px solid var(--vscode-panel-border);
      text-align: left;
      vertical-align: top;
    }
    th {
      background: var(--vscode-sideBar-background);
      font-weight: 600;
    }
    tr:last-child td { border-bottom: none; }
    pre {
      margin: 0 0 16px;
      padding: 12px 14px;
      border-radius: 8px;
      border: 1px solid var(--vscode-panel-border);
      background: var(--vscode-textCodeBlock-background);
      overflow-x: auto;
      font-size: 0.88em;
      line-height: 1.45;
    }
    pre code { font-family: var(--vscode-editor-font-family, monospace); }
    code {
      font-family: var(--vscode-editor-font-family, monospace);
      font-size: 0.9em;
      padding: 1px 4px;
      border-radius: 4px;
      background: var(--vscode-textCodeBlock-background);
    }
    .group { margin-bottom: 28px; }
    .group > h1 {
      font-size: 0.82em;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--vscode-descriptionForeground);
      margin: 0 0 12px;
    }
    .card {
      border: 1px solid var(--vscode-panel-border);
      border-radius: 8px;
      padding: 14px 16px;
      margin-bottom: 12px;
      background: var(--vscode-sideBar-background);
    }
    .card-head {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
      margin-bottom: 6px;
    }
    .card-head h2 {
      margin: 0;
      font-size: 1.05em;
      font-weight: 600;
    }
    .palette { margin: 0 0 8px; font-size: 0.96em; }
    .palette code {
      color: var(--vscode-textLink-foreground);
      background: transparent;
      padding: 0;
    }
    .lead { margin: 0 0 10px; }
    .details {
      margin: 0 0 10px;
      padding-left: 1.25em;
      font-size: 0.98em;
    }
    .details li { margin-bottom: 4px; }
    .meta { margin: 0; font-size: 0.92em; color: var(--vscode-descriptionForeground); }
    .badge {
      font-size: 0.7em;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      padding: 2px 6px;
      border-radius: 4px;
      background: var(--vscode-badge-background);
      color: var(--vscode-badge-foreground);
    }
    .badge.ok { background: var(--vscode-testing-iconPassed); color: var(--vscode-editor-background); }
    .badge.stub { opacity: 0.85; }
  </style>
</head>
<body>
  ${HOW_TO_USE_HTML}
  ${sections}
</body>
</html>`
}

export function helpEntryCount(): number {
  return MERIDIAN_COMMAND_CATALOG.length
}
