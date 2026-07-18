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
  <section class="onboarding" id="how-to-use">
    <h1>How to use Meridian</h1>
    <p class="lead">Two surfaces work together: <strong>this extension</strong> (see and validate) and <strong>chat slash commands</strong> (create and change). You are the manager — agents execute against <code>docs/</code>.</p>

    <h2>1. First-time setup</h2>
    <ol class="steps">
      <li>Install this extension (Marketplace) and reload the window.</li>
      <li>Open your project folder.</li>
      <li><strong>Meridian: Install Harness</strong> — copies <code>.agent/</code> (agents, skills, workflows).</li>
      <li>In <strong>chat</strong>, run <code>/init-meridian</code> if <code>docs/</code> does not exist yet.</li>
      <li><strong>Meridian: Open Board</strong> to see the kanban from <code>.meridian/meridian.db</code> (bootstrap with <code>bootstrap_meridian_db.py</code> if missing).</li>
    </ol>

    <h2>2. Extension vs chat — who does what</h2>
    <div class="table-wrap">
      <table>
        <thead>
          <tr><th>You want to…</th><th>Use</th><th>Example</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>See kanban, versions, epics</td>
            <td><strong>Extension</strong> (views below)</td>
            <td>Meridian: Open Board</td>
          </tr>
          <tr>
            <td>Validate project structure</td>
            <td><strong>Extension</strong> (governance)</td>
            <td>Meridian: Validate Project</td>
          </tr>
          <tr>
            <td>Create or change docs, run a procedure</td>
            <td><strong>Chat slash command</strong> (workflow)</td>
            <td><code>/create-us</code> · <code>/complete-us US-0103</code></td>
          </tr>
          <tr>
            <td>Check health and next step</td>
            <td><strong>Chat slash command</strong></td>
            <td><code>/status</code></td>
          </tr>
        </tbody>
      </table>
    </div>

    <h2>3. Workflow, agent, or skill?</h2>
    <pre><code>YOU type          →  /create-us          (workflow — .agent/workflows/)
workflow routes   →  @backlog-refiner    (agent — .agent/agents/)
agent runs        →  create-user-story   (skill — .agent/skills/)
output lands in   →  .meridian/meridian.db   (delivery source of truth)</code></pre>
    <ul class="rules">
      <li><strong>You invoke workflows</strong> — slash commands in Cursor, Claude Code, or Codex skills (<code>$workflow-create-us</code>).</li>
      <li><strong>You rarely @mention agents</strong> — the workflow picks the right persona. Override with <code>@scrum-master</code> or <code>@developer</code> when needed.</li>
      <li><strong>You never type skills</strong> — agents load them from the kit.</li>
    </ul>

    <h2>4. Reading order (guides)</h2>
    <ol class="steps">
      <li><strong>Start here</strong> — concepts (phases, gates, artifacts)</li>
      <li><strong>Usage guide</strong> — situations (new project, migrate, implement, close)</li>
      <li><strong>Agents &amp; slash commands</strong> — full command map and steps 1–17</li>
      <li><strong>This tab</strong> — extension command reference (views + governance)</li>
    </ol>
    <p class="hint">Open guides from the Meridian sidebar → Commands, or ⇧⌘P → <code>Meridian: Open …</code></p>
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
