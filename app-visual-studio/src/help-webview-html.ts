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
      ? `<span class="badge stub">Em breve</span>`
      : `<span class="badge ok">Disponível</span>`

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

export function helpWebviewHtml(): string {
  const sections = COMMAND_HELP_GROUPS.map((group) => {
    const entries = MERIDIAN_COMMAND_CATALOG.filter((c) => c.group === group.id)
    const cards = entries.map(renderEntry).join("")
    return `<section class="group">
      <h1>${esc(group.label)}</h1>
      ${cards}
    </section>`
  }).join("")

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline';" />
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: var(--vscode-font-family);
      font-size: var(--vscode-font-size);
      line-height: 1.5;
      color: var(--vscode-foreground);
      background: var(--vscode-editor-background);
      padding: 20px 24px 32px;
      max-width: 720px;
    }
    .intro {
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--vscode-panel-border);
    }
    .intro h1 {
      margin: 0 0 8px;
      font-size: 1.35em;
      font-weight: 600;
    }
    .intro p { margin: 0 0 8px; color: var(--vscode-descriptionForeground); }
    .intro ul { margin: 8px 0 0; padding-left: 1.2em; color: var(--vscode-descriptionForeground); font-size: 0.95em; }
    .group { margin-bottom: 28px; }
    .group > h1 {
      font-size: 0.75em;
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
    .palette { margin: 0 0 8px; font-size: 0.9em; }
    .palette code {
      font-family: var(--vscode-editor-font-family, monospace);
      font-size: 0.88em;
      color: var(--vscode-textLink-foreground);
    }
    .lead { margin: 0 0 10px; }
    .details {
      margin: 0 0 10px;
      padding-left: 1.25em;
      font-size: 0.92em;
      color: var(--vscode-foreground);
    }
    .details li { margin-bottom: 4px; }
    .meta { margin: 0; font-size: 0.85em; color: var(--vscode-descriptionForeground); }
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
  <div class="intro">
    <h1>Meridian — comandos da extensão</h1>
    <p>Referência read-only: o que cada ação faz, onde ver o resultado e como abrir.</p>
    <ul>
      <li><strong>Sidebar</strong> → ícone Meridian → Commands (clique na linha)</li>
      <li><strong>Menu</strong> → View → Meridian</li>
      <li><strong>Palette</strong> → ⇧⌘P → digite <code>Meridian:</code></li>
    </ul>
  </div>
  ${sections}
</body>
</html>`
}

export function helpEntryCount(): number {
  return MERIDIAN_COMMAND_CATALOG.length
}
