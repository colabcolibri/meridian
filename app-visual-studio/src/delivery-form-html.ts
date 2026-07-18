import { esc } from "./markdown-to-html.js"
import {
  deliveryFormFields,
  type DeliveryFormPayload,
  selectOptionsForField,
} from "./delivery-form-schema.js"
import type { DeliveryFolder } from "./delivery-path.js"

export type DeliveryFormViewModel = {
  relativePath: string
  entityLabel: string
  folder: DeliveryFolder
  form: DeliveryFormPayload
  saveError?: string
  saveOk?: boolean
  showAdvanced?: boolean
  rawMarkdown?: string
}

function fieldValue(model: DeliveryFormViewModel, field: ReturnType<typeof deliveryFormFields>[number]): string {
  if (field.scope === "preamble") {
    return model.form.preamble
  }
  if (field.scope === "frontmatter") {
    return model.form.frontmatter[field.key] ?? ""
  }
  return model.form.sections[field.key] ?? ""
}

function renderField(model: DeliveryFormViewModel, field: ReturnType<typeof deliveryFormFields>[number]): string {
  const value = fieldValue(model, field)
  const id = `field-${field.scope}-${field.key}`
  const options = selectOptionsForField(model.folder, field)

  if (field.kind === "readonly") {
    return `<div class="field readonly"><label>${esc(field.label)}</label><div class="readonly-value">${esc(value)}</div></div>`
  }

  if (options) {
    const opts = options
      .map(
        (opt) =>
          `<option value="${esc(opt)}"${opt === value ? " selected" : ""}>${esc(opt)}</option>`,
      )
      .join("")
    return `<div class="field"><label for="${id}">${esc(field.label)}</label><select id="${id}" data-scope="${field.scope}" data-key="${esc(field.key)}">${opts}</select></div>`
  }

  if (field.kind === "textarea") {
    const rows = field.rows ?? 4
    return `<div class="field"><label for="${id}">${esc(field.label)}</label><textarea id="${id}" data-scope="${field.scope}" data-key="${esc(field.key)}" rows="${rows}" spellcheck="false">${esc(value)}</textarea></div>`
  }

  return `<div class="field"><label for="${id}">${esc(field.label)}</label><input id="${id}" type="text" data-scope="${field.scope}" data-key="${esc(field.key)}" value="${esc(value)}" /></div>`
}

export function buildDeliveryFormHtml(model: DeliveryFormViewModel): string {
  const fields = deliveryFormFields(model.folder)
  const groups = [...new Set(fields.map((f) => f.group))]
  const groupHtml = groups
    .map((group) => {
      const groupFields = fields.filter((f) => f.group === group)
      const inner = groupFields.map((f) => renderField(model, f)).join("")
      return `<section class="form-group"><h2 class="form-group-title">${esc(group)}</h2>${inner}</section>`
    })
    .join("")

  const statusMsg = model.saveError
    ? `<p class="banner error">${esc(model.saveError)}</p>`
    : model.saveOk
      ? `<p class="banner ok">Saved to SQLite.</p>`
      : ""

  const advancedBlock = model.showAdvanced
    ? `<section class="form-group advanced"><h2 class="form-group-title">Advanced markdown</h2>
       <p class="edit-hint">Raw markdown bypasses the form. Prefer Save form unless you know the template.</p>
       <textarea id="rawEditor" class="editor" spellcheck="false">${esc(model.rawMarkdown ?? "")}</textarea>
       <div class="toolbar-actions inner"><button type="button" class="btn primary" id="saveRawBtn">Save raw</button></div>
       </section>`
    : ""

  const title =
    model.form.frontmatter.title || model.form.frontmatter.id || model.relativePath

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
      font-size: calc(var(--vscode-font-size) * 1.02);
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
    .toolbar-title { flex: 1 1 180px; min-width: 0; font-weight: 600; font-size: 0.95em; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .toolbar-actions { display: flex; flex-wrap: wrap; gap: 6px; }
    .toolbar-actions.inner { margin-top: 10px; }
    .btn { font: inherit; font-size: 12px; padding: 5px 10px; border-radius: 4px; border: 1px solid var(--vscode-button-border, transparent); background: var(--vscode-button-secondaryBackground); color: var(--vscode-button-secondaryForeground); cursor: pointer; }
    .btn:hover { background: var(--vscode-button-secondaryHoverBackground); }
    .btn.primary { background: var(--vscode-button-background); color: var(--vscode-button-foreground); }
    .btn.primary:hover { background: var(--vscode-button-hoverBackground); }
    .main { flex: 1; padding: 16px 18px 28px; max-width: 920px; width: 100%; margin: 0 auto; }
    .entity-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: var(--vscode-descriptionForeground); margin-bottom: 12px; }
    .source { font-size: 11px; color: var(--vscode-descriptionForeground); margin-bottom: 16px; word-break: break-all; }
    .form-group { margin-bottom: 22px; padding-bottom: 18px; border-bottom: 1px solid var(--vscode-panel-border); }
    .form-group-title { margin: 0 0 12px; font-size: 1em; font-weight: 600; }
    .field { margin-bottom: 12px; }
    .field label { display: block; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; color: var(--vscode-descriptionForeground); margin-bottom: 4px; }
    .field input, .field select, .field textarea {
      width: 100%;
      font: inherit;
      font-size: 0.95em;
      color: var(--vscode-input-foreground);
      background: var(--vscode-input-background);
      border: 1px solid var(--vscode-input-border, var(--vscode-panel-border));
      border-radius: 6px;
      padding: 8px 10px;
    }
    .field textarea { min-height: 72px; resize: vertical; font-family: var(--vscode-editor-font-family, monospace); line-height: 1.45; }
    .readonly-value { padding: 8px 10px; border-radius: 6px; background: var(--vscode-input-background); border: 1px solid var(--vscode-panel-border); font-family: var(--vscode-editor-font-family, monospace); }
    .banner { margin: 0 0 12px; padding: 8px 10px; border-radius: 6px; font-size: 12px; }
    .banner.error { background: color-mix(in srgb, var(--vscode-errorForeground) 12%, transparent); color: var(--vscode-errorForeground); border: 1px solid color-mix(in srgb, var(--vscode-errorForeground) 35%, transparent); }
    .banner.ok { border: 1px solid var(--vscode-panel-border); }
    .edit-hint { margin: 0 0 10px; font-size: 12px; color: var(--vscode-descriptionForeground); }
    .editor { width: 100%; min-height: 50vh; resize: vertical; font-family: var(--vscode-editor-font-family, monospace); font-size: calc(var(--vscode-editor-font-size, 13px) * 0.95); line-height: 1.45; color: var(--vscode-editor-foreground); background: var(--vscode-editor-background); border: 1px solid var(--vscode-panel-border); border-radius: 8px; padding: 12px 14px; }
  </style>
</head>
<body>
  <header class="toolbar">
    <div class="toolbar-title">${esc(title)}</div>
    <div class="toolbar-actions">
      <button type="button" class="btn" id="viewBtn">View</button>
      <button type="button" class="btn primary" id="saveFormBtn">Save</button>
      <button type="button" class="btn" id="advancedBtn">${model.showAdvanced ? "Hide advanced" : "Advanced"}</button>
    </div>
  </header>
  <main class="main">
    <div class="entity-label">${esc(model.entityLabel)} · structured form</div>
    <div class="source">SQLite · ${esc(model.relativePath)}</div>
    ${statusMsg}
    <form id="deliveryForm" autocomplete="off">${groupHtml}</form>
    ${advancedBlock}
  </main>
  <script>
    const vscode = acquireVsCodeApi();
    document.getElementById("viewBtn").onclick = () => vscode.postMessage({ type: "view" });
    document.getElementById("saveFormBtn").onclick = () => {
      const payload = { frontmatter: {}, preamble: "", sections: {} };
      document.querySelectorAll("[data-scope][data-key]").forEach((el) => {
        const scope = el.getAttribute("data-scope");
        const key = el.getAttribute("data-key");
        const value = el.value ?? "";
        if (scope === "frontmatter") payload.frontmatter[key] = value;
        else if (scope === "sections") payload.sections[key] = value;
        else if (scope === "preamble") payload.preamble = value;
      });
      vscode.postMessage({ type: "saveForm", payload });
    };
    const advancedBtn = document.getElementById("advancedBtn");
    if (advancedBtn) {
      advancedBtn.onclick = () => vscode.postMessage({ type: "toggleAdvanced" });
    }
    const saveRawBtn = document.getElementById("saveRawBtn");
    const rawEditor = document.getElementById("rawEditor");
    if (saveRawBtn && rawEditor) {
      saveRawBtn.onclick = () => vscode.postMessage({ type: "saveRaw", markdown: rawEditor.value });
    }
  </script>
</body>
</html>`
}
