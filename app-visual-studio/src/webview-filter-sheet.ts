/** Reusable lateral filter sheet (board-style) for Meridian webviews. */

export type FilterSheetColumnSpec = {
  key: string
  label: string
  listId: string
  allId: string
  noneId: string
}

export const CHIP_STYLES = `
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
    font-weight: 600;
  }
  .chip.muted { opacity: 0.55; }
  .chip:disabled { opacity: 0.45; cursor: default; pointer-events: none; }
  .chip.filter-open.on {
    background: var(--vscode-button-secondaryBackground, var(--vscode-input-background));
    color: var(--vscode-button-secondaryForeground, var(--vscode-foreground));
    border-color: var(--vscode-focusBorder);
  }
  .filter-summary {
    font-size: 11px;
    color: var(--vscode-descriptionForeground);
    margin-left: auto;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`.trim()

export const FILTER_SHEET_STYLES = `
  .filter-sheet {
    position: fixed;
    inset: 0;
    z-index: 1000;
    display: flex;
    justify-content: flex-end;
    align-items: stretch;
    overflow: hidden;
    pointer-events: none;
  }
  .filter-sheet:not([hidden]) {
    pointer-events: auto;
  }
  .filter-sheet[hidden] { display: none !important; }
  .filter-sheet-backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.35);
  }
  .filter-sheet-panel {
    position: relative;
    width: min(300px, 100%);
    max-width: 100vw;
    height: 100%;
    background: var(--vscode-sideBar-background);
    border-left: 1px solid var(--vscode-panel-border);
    display: flex;
    flex-direction: column;
    box-shadow: -6px 0 28px rgba(0, 0, 0, 0.2);
    overflow: hidden;
  }
  .filter-sheet-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 10px 12px;
    border-bottom: 1px solid var(--vscode-panel-border);
    flex-shrink: 0;
    background: var(--vscode-editor-background);
  }
  .filter-sheet-header h2 {
    margin: 0;
    font-size: 13px;
    font-weight: 600;
    flex: 1;
    min-width: 0;
  }
  .filter-sheet-header-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    flex-shrink: 0;
    justify-content: flex-end;
  }
  .filter-sheet-cols {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
    min-width: 0;
    overflow: hidden;
  }
  .filter-col {
    flex: 1 1 0;
    min-height: 0;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 10px 12px;
    border-bottom: 1px solid var(--vscode-panel-border);
    background: var(--vscode-sideBar-background);
    overflow: hidden;
  }
  .filter-col:last-child { border-bottom: none; }
  .filter-col-head {
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--vscode-descriptionForeground);
    flex-shrink: 0;
  }
  .filter-col-actions {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: stretch;
    gap: 4px;
    flex-shrink: 0;
  }
  .filter-col-actions .chip {
    flex: 1 1 0;
    min-width: 0;
    width: auto;
    max-width: 100%;
    text-align: center;
    margin: 0;
    box-sizing: border-box;
  }
  .filter-list {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    flex: 1;
    min-height: 0;
    min-width: 0;
    overflow-x: hidden;
    overflow-y: auto;
    margin: 0;
    gap: 4px;
    -webkit-overflow-scrolling: touch;
  }
  .filter-check {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    font-size: 11px;
    line-height: 1.35;
    padding: 5px 4px;
    border-radius: 4px;
    cursor: pointer;
    user-select: none;
  }
  .filter-check:hover {
    background: var(--vscode-list-hoverBackground, rgba(128, 128, 128, 0.12));
  }
  .filter-check.disabled {
    opacity: 0.5;
    cursor: default;
    pointer-events: none;
  }
  .filter-check input {
    margin: 2px 0 0;
    flex-shrink: 0;
    accent-color: var(--vscode-focusBorder);
  }
  .filter-check span {
    flex: 1;
    min-width: 0;
    word-break: break-word;
  }
`.trim()

export function filterSheetOpenButtonHtml(summaryId = "filter-summary"): string {
  return `<button type="button" class="chip filter-open" id="open-filters" aria-expanded="false">Filtros</button>
          <span class="filter-summary" id="${summaryId}"></span>`
}

export function filterSheetHtml(columns: FilterSheetColumnSpec[]): string {
  const cols = columns
    .map(
      (col) => `<div class="filter-col" data-filter="${col.key}">
          <div class="filter-col-head">${col.label}</div>
          <div class="filter-col-actions">
            <button type="button" class="chip" id="${col.allId}">All</button>
            <button type="button" class="chip" id="${col.noneId}">None</button>
          </div>
          <div id="${col.listId}" class="filter-list"></div>
        </div>`,
    )
    .join("")
  return `<div id="filter-sheet" class="filter-sheet" hidden aria-hidden="true">
    <div class="filter-sheet-backdrop" id="filter-sheet-backdrop"></div>
    <div class="filter-sheet-panel" role="dialog" aria-labelledby="filter-sheet-title">
      <div class="filter-sheet-header">
        <h2 id="filter-sheet-title">Filtros</h2>
        <div class="filter-sheet-header-actions">
          <button type="button" class="chip" id="reset-filters">Resetar</button>
          <button type="button" class="chip" id="close-filters">Fechar</button>
        </div>
      </div>
      <div class="filter-sheet-cols">${cols}</div>
    </div>
  </div>`
}

/** Inline runtime — exposes window.MeridianFilterSheet.mount(config). */
export const FILTER_SHEET_RUNTIME = `
(function () {
  const SPRINT_NONE = "__none__";

  function wireAllNone(allBtn, noneBtn, allOn, noneOn, disabled, onAll, onNone) {
    if (!allBtn || !noneBtn) return;
    allBtn.className = "chip" + (allOn ? " on" : "");
    allBtn.disabled = !!disabled;
    allBtn.onclick = onAll;
    noneBtn.className = "chip" + (noneOn ? " on" : "");
    noneBtn.disabled = !!disabled;
    noneBtn.onclick = onNone;
  }

  function renderFilterCheckboxes(root, items, selected, disabled, onChecked) {
    root.innerHTML = "";
    for (const item of items) {
      const label = document.createElement("label");
      label.className = "filter-check" + (disabled ? " disabled" : "");
      const input = document.createElement("input");
      input.type = "checkbox";
      input.checked = selected.has(item.id);
      input.disabled = !!disabled;
      input.setAttribute("aria-label", item.title || item.label);
      const span = document.createElement("span");
      span.textContent = item.label;
      span.title = item.title || item.label;
      input.addEventListener("change", () => onChecked(item.id, input.checked));
      label.append(input, span);
      root.appendChild(label);
    }
  }

  function mount(config) {
    const state = config.initial || {};
    const selected = {};
    for (const col of config.columns) {
      selected[col.key] = new Set(state[col.key] || col.defaultSelected || []);
    }

    let open = false;

    function setOpen(next) {
      open = next;
      const sheet = document.getElementById(config.sheetId || "filter-sheet");
      const openBtn = document.getElementById(config.openBtnId || "open-filters");
      if (!sheet) return;
      if (open) {
        sheet.removeAttribute("hidden");
        sheet.setAttribute("aria-hidden", "false");
      } else {
        sheet.hidden = true;
        sheet.setAttribute("aria-hidden", "true");
      }
      if (openBtn) {
        openBtn.classList.toggle("on", open);
        openBtn.setAttribute("aria-expanded", open ? "true" : "false");
      }
    }

    function renderColumn(col) {
      const listRoot = document.getElementById(col.listId);
      if (!listRoot) return;
      const items = typeof col.items === "function" ? col.items(selected) : (col.items || []);
      const set = selected[col.key];
      const allOn = items.length > 0 && items.every((i) => set.has(i.id));
      const noneOn = set.size === 0;
      wireAllNone(
        document.getElementById(col.allId),
        document.getElementById(col.noneId),
        allOn,
        noneOn,
        false,
        () => {
          selected[col.key] = new Set(items.map((i) => i.id));
          afterChange();
        },
        () => {
          selected[col.key] = new Set();
          afterChange();
        },
      );
      renderFilterCheckboxes(
        listRoot,
        items,
        set,
        false,
        (id, checked) => {
          if (checked) set.add(id);
          else set.delete(id);
          afterChange();
        },
      );
    }

    function renderAll() {
      for (const col of config.columns) renderColumn(col);
      if (typeof config.renderSummary === "function") config.renderSummary(selected);
    }

    function afterChange() {
      renderAll();
      if (typeof config.onChange === "function") config.onChange(selected);
      if (typeof config.persist === "function") {
        const plain = {};
        for (const col of config.columns) plain[col.key] = [...selected[col.key]];
        config.persist(plain);
      }
    }

    function reset() {
      for (const col of config.columns) {
        selected[col.key] = new Set(col.defaultSelected || []);
      }
      afterChange();
    }

    const openBtn = document.getElementById(config.openBtnId || "open-filters");
    if (openBtn) {
      openBtn.addEventListener("click", (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        setOpen(!open);
      });
    }
    document.getElementById(config.closeId || "close-filters")?.addEventListener("click", () => setOpen(false));
    document.getElementById(config.backdropId || "filter-sheet-backdrop")?.addEventListener("click", () => setOpen(false));
    document.getElementById(config.resetId || "reset-filters")?.addEventListener("click", reset);

    try {
      renderAll();
      if (typeof config.onChange === "function") config.onChange(selected);
    } catch (err) {
      console.error("MeridianFilterSheet render failed", err);
    }
    if (config.startOpen === true) setOpen(true);

    return {
      getSelected() {
        const out = {};
        for (const col of config.columns) out[col.key] = new Set(selected[col.key]);
        return out;
      },
      reset,
      setOpen,
      renderAll,
      SPRINT_NONE,
    };
  }

  window.MeridianFilterSheet = { mount, SPRINT_NONE };
})();
`.trim()
