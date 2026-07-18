import { esc, markdownToHtml } from "./markdown-to-html.js"
import { MARKDOWN_CONTENT_STYLES } from "./markdown-content-styles.js"

export type KitReferenceIntro = {
  title: string
  description: string
}

const CONTENT_STYLES = MARKDOWN_CONTENT_STYLES

export function kitReferenceLoadingHtml(): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"/>
    <style>
      body{font-family:var(--vscode-font-family);font-size:calc(var(--vscode-font-size)*1.08);
      color:var(--vscode-descriptionForeground);background:var(--vscode-editor-background);padding:24px;}
      p{margin:0;}
    </style></head>
    <body><p>Loading…</p></body></html>`
}

export function kitReferenceWebviewHtml(
  markdown: string,
  sourceLabel: string,
  intro: KitReferenceIntro,
): string {
  const body = markdownToHtml(markdown)

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
      max-width: 860px;
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
    .intro p { margin: 0 0 8px; color: var(--vscode-descriptionForeground); font-size: 1em; }
    .source {
      margin-top: 8px;
      font-size: 0.88em;
      color: var(--vscode-descriptionForeground);
      font-family: var(--vscode-editor-font-family, monospace);
    }
    ${CONTENT_STYLES}
  </style>
</head>
<body>
  <div class="intro">
    <h1>${esc(intro.title)}</h1>
    <p>${esc(intro.description)}</p>
    <p class="source">${esc(sourceLabel)}</p>
  </div>
  <div class="content">
    ${body}
  </div>
</body>
</html>`
}

/** @deprecated use kitReferenceLoadingHtml */
export const agentsHelpLoadingHtml = kitReferenceLoadingHtml

/** @deprecated use kitReferenceWebviewHtml */
export function agentsHelpWebviewHtml(markdown: string, sourceLabel: string): string {
  return kitReferenceWebviewHtml(markdown, sourceLabel, {
    title: "Meridian — agents & slash commands",
    description:
      "Agent groups, slash commands, skills, and the numbered sequence (1–17). Read-only — sourced from the kit .agent/.",
  })
}
