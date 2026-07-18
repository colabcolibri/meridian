/** Shared markdown body styles for kit reference and delivery viewer webviews. */
export const MARKDOWN_CONTENT_STYLES = `
  .content h1 { font-size: 1.35em; font-weight: 600; margin: 28px 0 12px; }
  .content h1:first-child { margin-top: 0; }
  .content h2 { font-size: 1.15em; font-weight: 600; margin: 24px 0 10px; }
  .content h3 {
    font-size: 1em;
    font-weight: 600;
    margin: 20px 0 8px;
    color: var(--vscode-descriptionForeground);
  }
  .content p { margin: 0 0 12px; }
  .content hr {
    border: none;
    border-top: 1px solid var(--vscode-panel-border);
    margin: 20px 0;
  }
  .content code {
    font-family: var(--vscode-editor-font-family, monospace);
    font-size: 0.94em;
    padding: 1px 5px;
    border-radius: 4px;
    background: var(--vscode-textCodeBlock-background);
  }
  .content pre {
    margin: 0 0 16px;
    padding: 12px 14px;
    border-radius: 8px;
    border: 1px solid var(--vscode-panel-border);
    background: var(--vscode-textCodeBlock-background);
    overflow-x: auto;
    font-size: 0.92em;
    line-height: 1.45;
  }
  .content pre code {
    padding: 0;
    background: transparent;
    white-space: pre;
  }
  .content ul { margin: 0 0 12px; padding-left: 1.25em; }
  .content li { margin-bottom: 4px; }
  .content .md-link { color: var(--vscode-textLink-foreground); }
  .table-wrap {
    overflow-x: auto;
    margin: 0 0 16px;
    border: 1px solid var(--vscode-panel-border);
    border-radius: 8px;
  }
  .content table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.94em;
  }
  .content th,
  .content td {
    padding: 8px 10px;
    border-bottom: 1px solid var(--vscode-panel-border);
    text-align: left;
    vertical-align: top;
  }
  .content th {
    background: var(--vscode-sideBar-background);
    font-weight: 600;
  }
  .content tr:last-child td { border-bottom: none; }
`
