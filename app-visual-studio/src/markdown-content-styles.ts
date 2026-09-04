/** Shared markdown body styles for kit reference and delivery viewer webviews. */
export const MARKDOWN_CONTENT_STYLES = `
  .content {
    font-size: calc(var(--vscode-font-size) * 1.18);
    line-height: 1.6;
  }
  .content .md-preamble {
    margin: 0 0 20px;
    padding: 14px 16px;
    border: 1px solid var(--vscode-panel-border);
    border-left: 3px solid var(--vscode-textLink-foreground);
    border-radius: 8px;
    background: var(--vscode-sideBar-background);
  }
  .content .md-preamble h1 {
    margin: 0 0 10px;
    padding: 0;
    border: none;
    font-size: 1.35em;
  }
  .content .md-preamble p { margin: 0 0 8px; }
  .content .md-preamble p:last-child { margin-bottom: 0; }
  .content .md-lane {
    margin: 0 0 18px;
    border: 1px solid var(--vscode-panel-border);
    border-radius: 8px;
    background: var(--vscode-editor-background);
    overflow: hidden;
  }
  .content .md-lane-title {
    margin: 0;
    padding: 11px 16px;
    font-size: 0.78em;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    border-bottom: 1px solid var(--vscode-panel-border);
    background: var(--vscode-sideBar-background);
    color: var(--vscode-foreground);
  }
  .content .md-lane[data-lane="intent"] .md-lane-title {
    border-left: 4px solid var(--vscode-charts-yellow, #cca700);
    color: var(--vscode-charts-yellow, #cca700);
  }
  .content .md-lane[data-lane="plan"] .md-lane-title {
    border-left: 4px solid var(--vscode-charts-orange, #d18616);
    color: var(--vscode-charts-orange, #d18616);
  }
  .content .md-lane[data-lane="record"] .md-lane-title {
    border-left: 4px solid var(--vscode-testing-iconPassed, #73c991);
    color: var(--vscode-testing-iconPassed, #73c991);
  }
  .content .md-lane[data-lane="boundaries"] .md-lane-title {
    border-left: 4px solid var(--vscode-descriptionForeground);
    color: var(--vscode-descriptionForeground);
  }
  .content .md-field {
    padding: 12px 16px 14px;
    border-top: 1px solid var(--vscode-panel-border);
  }
  .content .md-field:first-of-type { border-top: none; }
  .content .md-field-title {
    margin: 0 0 10px;
    padding: 0;
    font-size: 0.8em;
    font-weight: 700;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: var(--vscode-descriptionForeground);
  }
  .content .md-field[data-field="why"] .md-field-title,
  .content .md-field[data-field="where"] .md-field-title {
    color: var(--vscode-foreground);
  }
  .content .md-field[data-field="acceptance"] .md-field-title {
    color: var(--vscode-charts-blue, #3794ff);
  }
  .content .md-field[data-field="approach"] .md-field-title,
  .content .md-field[data-field="planned"] .md-field-title {
    color: var(--vscode-charts-orange, #d18616);
  }
  .content > h1 { font-size: 1.5em; font-weight: 600; margin: 28px 0 12px; }
  .content > h1:first-child { margin-top: 0; }
  .content > h2:not(.md-lane-title) { font-size: 1.28em; font-weight: 600; margin: 24px 0 10px; }
  .content > h3:not(.md-field-title) {
    font-size: 1.12em;
    font-weight: 600;
    margin: 20px 0 8px;
    color: var(--vscode-descriptionForeground);
  }
  .content h4 {
    font-size: 1.05em;
    font-weight: 600;
    margin: 16px 0 6px;
  }
  .content p { margin: 0 0 14px; }
  .content hr {
    border: none;
    border-top: 1px solid var(--vscode-panel-border);
    margin: 22px 0;
  }
  .content code {
    font-family: var(--vscode-editor-font-family, monospace);
    font-size: 0.94em;
    padding: 2px 6px;
    border-radius: 4px;
    background: var(--vscode-textCodeBlock-background);
  }
  .content pre {
    margin: 0 0 16px;
    padding: 14px 16px;
    border-radius: 8px;
    border: 1px solid var(--vscode-panel-border);
    background: var(--vscode-textCodeBlock-background);
    overflow-x: auto;
    font-size: 0.95em;
    line-height: 1.5;
  }
  .content pre code {
    padding: 0;
    background: transparent;
    white-space: pre;
  }
  .content ul { margin: 0 0 14px; padding-left: 1.35em; }
  .content ol { margin: 0 0 14px; padding-left: 1.35em; }
  .content li { margin-bottom: 6px; }
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
    font-size: 0.98em;
  }
  .content th,
  .content td {
    padding: 9px 12px;
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
