/** Shared CSS for Versions / Sprints / Epics webviews. */
export const PLANNING_WEBVIEW_STYLES = `
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: var(--vscode-font-family);
      font-size: var(--vscode-font-size);
      color: var(--vscode-foreground);
      background: var(--vscode-editor-background);
      display: flex;
      flex-direction: column;
      height: 100vh;
    }
    .toolbar {
      flex-shrink: 0;
      border-bottom: 1px solid var(--vscode-panel-border);
      background: var(--vscode-sideBar-background);
      padding: 10px 12px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .toolbar-row { display: flex; flex-wrap: wrap; align-items: center; gap: 4px; }
    .toolbar-row .chip { margin: 0 2px 2px 0; }
    .chip-group { display: inline-flex; flex-wrap: wrap; align-items: center; gap: 4px; margin-left: 2px; }
    .toolbar-label {
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--vscode-descriptionForeground);
      min-width: 52px;
    }
    .chip {
      font: inherit;
      font-size: 11px;
      padding: 3px 8px;
      border-radius: 4px;
      border: 1px solid var(--vscode-widget-border);
      background: var(--vscode-input-background);
      color: var(--vscode-foreground);
      cursor: pointer;
    }
    .chip:hover { border-color: var(--vscode-focusBorder); }
    .chip.on {
      background: var(--vscode-button-background);
      color: var(--vscode-button-foreground);
      border-color: var(--vscode-button-background);
    }
    .chip:disabled { opacity: 0.45; cursor: default; pointer-events: none; }
    .count { margin-left: auto; font-size: 11px; color: var(--vscode-descriptionForeground); }
    .main { flex: 1; overflow: auto; padding: 12px; }
    .block {
      border: 1px solid var(--vscode-panel-border);
      border-radius: 6px;
      margin-bottom: 10px;
      background: var(--vscode-sideBar-background);
      overflow: hidden;
    }
    .block.open .block-head { border-bottom-color: var(--vscode-panel-border); }
    .block-head {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 10px;
      border-bottom: 1px solid transparent;
    }
    .acc-btn {
      flex-shrink: 0;
      width: 22px;
      height: 22px;
      padding: 0;
      border: none;
      border-radius: 4px;
      background: transparent;
      color: inherit;
      font: inherit;
      font-size: 10px;
      cursor: pointer;
    }
    .acc-btn:hover { background: var(--vscode-list-hoverBackground); }
    .link-btn {
      padding: 0;
      border: none;
      background: none;
      font: inherit;
      cursor: pointer;
      text-align: left;
    }
    .row-id {
      font-weight: 700;
      font-size: 13px;
      min-width: 44px;
      color: var(--vscode-textLink-foreground);
    }
    .row-id:hover { text-decoration: underline; }
    .row-title { flex: 1; font-size: 12px; min-width: 0; }
    .badge {
      flex-shrink: 0;
      font-size: 10px;
      padding: 2px 6px;
      border-radius: 3px;
      background: var(--vscode-badge-background);
      color: var(--vscode-badge-foreground);
    }
    .block-body { padding: 8px 12px 12px; }
    .meta-line { font-size: 11px; color: var(--vscode-descriptionForeground); margin: 4px 0; }
    .row-btn {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px;
      margin-bottom: 4px;
      border: 1px solid var(--vscode-widget-border);
      border-radius: 4px;
      background: var(--vscode-input-background);
      color: inherit;
      font: inherit;
      cursor: pointer;
      text-align: left;
    }
    .row-btn:hover { border-color: var(--vscode-focusBorder); }
    .progress-wrap { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
    .progress-bar {
      width: 64px;
      height: 4px;
      border-radius: 2px;
      background: var(--vscode-widget-border);
      overflow: hidden;
    }
    .progress-fill { height: 100%; background: var(--vscode-progressBar-background); }
    .progress-fill.done { background: var(--vscode-testing-iconPassed); }
    .progress-text { font-size: 10px; color: var(--vscode-descriptionForeground); min-width: 36px; text-align: right; }
    .empty { padding: 24px; text-align: center; color: var(--vscode-descriptionForeground); }
    .pager {
      flex-shrink: 0;
      border-top: 1px solid var(--vscode-panel-border);
      background: var(--vscode-sideBar-background);
    }
    .pager-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
    }
    .pager-label {
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--vscode-descriptionForeground);
    }
    .pager-select {
      font: inherit;
      font-size: 11px;
      padding: 2px 6px;
      border-radius: 4px;
      border: 1px solid var(--vscode-widget-border);
      background: var(--vscode-input-background);
      color: var(--vscode-foreground);
    }
    .pager-info {
      font-size: 11px;
      color: var(--vscode-descriptionForeground);
    }
    .pager-spacer { flex: 1; min-width: 8px; }
`

export function planningWebviewShell(nonce: string, styles: string, body: string, script: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'nonce-${nonce}';" />
  <style>${styles}</style>
</head>
<body>
${body}
<script nonce="${nonce}">
${script}
</script>
</body>
</html>`
}

/** Client-side filter helpers (embedded in webview). */
export const FILTER_CHIP_SCRIPT = `
    function wireAllNone(allBtn, noneBtn, allOn, noneOn, disabled, onAll, onNone) {
      allBtn.className = "chip" + (allOn ? " on" : "");
      allBtn.disabled = disabled || allOn;
      allBtn.onclick = onAll;
      noneBtn.className = "chip" + (noneOn ? " on" : "");
      noneBtn.disabled = disabled || noneOn;
      noneBtn.onclick = onNone;
    }
    function renderChipGroup(root, items, selected, disabled, onToggle) {
      root.innerHTML = "";
      for (const item of items) {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "chip" + (selected.has(item.id) ? " on" : "");
        b.textContent = item.label;
        b.title = item.title || item.label;
        b.disabled = !!disabled;
        b.onclick = () => onToggle(item.id);
        root.appendChild(b);
      }
    }
    function progress(stories) {
      const total = stories.length;
      const done = stories.filter((s) => s.status === "✅").length;
      return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
    }
    function esc(t) {
      const d = document.createElement("div");
      d.textContent = t;
      return d.innerHTML;
    }
`

/** Pagination controls for planning list webviews (embedded in webview). */
export const PAGINATION_SCRIPT = `
    const PAGE_SIZES = [25, 50, 100];
    const DEFAULT_PAGE_SIZE = 50;

    function totalPages(count, pageSize) {
      if (count <= 0 || pageSize <= 0) return 1;
      return Math.ceil(count / pageSize);
    }

    function clampPage(page, pages) {
      if (pages < 1) return 1;
      return Math.min(Math.max(1, page), pages);
    }

    function pageSlice(items, page, pageSize) {
      const pages = totalPages(items.length, pageSize);
      const safe = clampPage(page, pages);
      const start = (safe - 1) * pageSize;
      return { slice: items.slice(start, start + pageSize), page: safe, pages };
    }

    function normalizePageSize(value) {
      const n = Number(value);
      return PAGE_SIZES.includes(n) ? n : DEFAULT_PAGE_SIZE;
    }

    function renderPager(root, total, page, pageSize, onPage, onPageSize) {
      if (!root) return page;
      root.innerHTML = "";
      if (total === 0) {
        root.style.display = "none";
        return 1;
      }
      root.style.display = "";
      const pages = totalPages(total, pageSize);
      const safePage = clampPage(page, pages);
      const from = (safePage - 1) * pageSize + 1;
      const to = Math.min(safePage * pageSize, total);

      const row = document.createElement("div");
      row.className = "pager-row";

      const sizeLabel = document.createElement("span");
      sizeLabel.className = "pager-label";
      sizeLabel.textContent = "Show";

      const select = document.createElement("select");
      select.className = "pager-select";
      select.title = "Items per page";
      for (const n of PAGE_SIZES) {
        const opt = document.createElement("option");
        opt.value = String(n);
        opt.textContent = String(n);
        if (n === pageSize) opt.selected = true;
        select.appendChild(opt);
      }
      select.onchange = () => onPageSize(normalizePageSize(select.value));

      const info = document.createElement("span");
      info.className = "pager-info";
      info.textContent = from + "–" + to + " of " + total;

      const spacer = document.createElement("span");
      spacer.className = "pager-spacer";

      const prev = document.createElement("button");
      prev.type = "button";
      prev.className = "chip";
      prev.textContent = "Prev";
      prev.disabled = safePage <= 1;
      prev.onclick = () => onPage(safePage - 1);

      const pageInfo = document.createElement("span");
      pageInfo.className = "pager-info";
      pageInfo.textContent = "Page " + safePage + " / " + pages;

      const next = document.createElement("button");
      next.type = "button";
      next.className = "chip";
      next.textContent = "Next";
      next.disabled = safePage >= pages;
      next.onclick = () => onPage(safePage + 1);

      row.append(sizeLabel, select, info, spacer, prev, pageInfo, next);
      root.appendChild(row);
      return safePage;
    }
`
