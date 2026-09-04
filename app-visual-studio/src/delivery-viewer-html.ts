import type { DeliveryFolder } from "./delivery-path.js"
import { esc, markdownToHtml } from "./markdown-to-html.js"
import { MARKDOWN_CONTENT_STYLES } from "./markdown-content-styles.js"
import { frontmatterBadgeKeys } from "./parse-delivery-markdown.js"

export type DeliveryViewerModel = {
  relativePath: string
  entityLabel: string
  folder: DeliveryFolder
  frontmatter: Record<string, string>
  bodyMarkdown: string
  saveError?: string
  saveOk?: boolean
}

function renderBadges(folder: DeliveryFolder, frontmatter: Record<string, string>): string {
  const keys = frontmatterBadgeKeys(folder)
  const chips = keys
    .filter((key) => frontmatter[key])
    .map(
      (key) =>
        `<span class="meta-chip"><span class="meta-key">${esc(key)}</span>${esc(frontmatter[key] ?? "")}</span>`,
    )
  return chips.join("")
}

export function buildDeliveryViewerHtml(model: DeliveryViewerModel): string {
  const title = model.frontmatter.title || model.frontmatter.id || model.relativePath
  const bodyHtml = markdownToHtml(model.bodyMarkdown)
  const badges = renderBadges(model.folder, model.frontmatter)
  const statusMsg = model.saveError
    ? `<p class="banner error">${esc(model.saveError)}</p>`
    : model.saveOk
      ? `<p class="banner ok">Saved to SQLite.</p>`
      : ""

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline';" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: var(--vscode-font-family);
      font-size: calc(var(--vscode-font-size) * 1.12);
      line-height: 1.6;
      color: var(--vscode-foreground);
      background: var(--vscode-editor-background);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    .toolbar {
      position: sticky;
      top: 0;
      z-index: 2;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
      padding: 10px 14px;
      border-bottom: 1px solid var(--vscode-panel-border);
      background: var(--vscode-sideBar-background);
    }
    .toolbar-title {
      flex: 1 1 180px;
      min-width: 0;
      font-weight: 600;
      font-size: 0.95em;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .toolbar-actions { display: flex; flex-wrap: wrap; gap: 6px; }
    .btn {
      font: inherit;
      font-size: 12px;
      padding: 5px 10px;
      border-radius: 4px;
      border: 1px solid var(--vscode-button-border, transparent);
      background: var(--vscode-button-secondaryBackground);
      color: var(--vscode-button-secondaryForeground);
      cursor: pointer;
    }
    .btn:hover { background: var(--vscode-button-secondaryHoverBackground); }
    .btn.primary {
      background: var(--vscode-button-background);
      color: var(--vscode-button-foreground);
    }
    .btn.primary:hover { background: var(--vscode-button-hoverBackground); }
    .main {
      flex: 1;
      padding: 16px 18px 28px;
      max-width: 920px;
      width: 100%;
      margin: 0 auto;
    }
    .header {
      margin-bottom: 18px;
      padding-bottom: 14px;
      border-bottom: 1px solid var(--vscode-panel-border);
    }
    .entity-label {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--vscode-descriptionForeground);
      margin-bottom: 6px;
    }
    .meta-row {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 10px;
    }
    .meta-chip {
      display: inline-flex;
      gap: 6px;
      align-items: baseline;
      font-size: 11px;
      padding: 4px 8px;
      border-radius: 999px;
      border: 1px solid var(--vscode-panel-border);
      background: var(--vscode-input-background);
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .meta-key {
      color: var(--vscode-descriptionForeground);
      text-transform: uppercase;
      letter-spacing: 0.04em;
      flex-shrink: 0;
    }
    .source {
      margin-top: 8px;
      font-size: 11px;
      color: var(--vscode-descriptionForeground);
      word-break: break-all;
    }
    .banner {
      margin: 0 0 12px;
      padding: 8px 10px;
      border-radius: 6px;
      font-size: 12px;
    }
    .banner.error {
      background: color-mix(in srgb, var(--vscode-errorForeground) 12%, transparent);
      color: var(--vscode-errorForeground);
      border: 1px solid color-mix(in srgb, var(--vscode-errorForeground) 35%, transparent);
    }
    .banner.ok {
      background: color-mix(in srgb, var(--vscode-testing-iconPassed) 12%, transparent);
      color: var(--vscode-foreground);
      border: 1px solid var(--vscode-panel-border);
    }
    ${MARKDOWN_CONTENT_STYLES}
  </style>
</head>
<body>
  <header class="toolbar">
    <div class="toolbar-title">${esc(title)}</div>
    <div class="toolbar-actions">
      <button type="button" class="btn primary" id="editBtn">Edit</button>
    </div>
  </header>
  <main class="main">
    <div class="header">
      <div class="entity-label">${esc(model.entityLabel)}</div>
      <div class="meta-row">${badges}</div>
      <div class="source">SQLite · ${esc(model.relativePath)}</div>
    </div>
    ${statusMsg}
    <div class="content">${bodyHtml}</div>
  </main>
  <script>
    const vscode = acquireVsCodeApi();
    document.getElementById("editBtn").onclick = () => vscode.postMessage({ type: "edit" });
  </script>
</body>
</html>`
}
