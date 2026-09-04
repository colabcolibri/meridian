import type { MeridianWorkspaceInfo } from "./meridian-workspace.js"

export type WelcomeChecklistItem = {
  id: string
  label: string
  detail: string
  done: boolean
  commandId?: string
  chatHint?: string
}

export function buildWelcomeChecklist(info: MeridianWorkspaceInfo | null): WelcomeChecklistItem[] {
  const kit = info?.kitInstalled === true
  const docs = info?.docsExists === true
  const delivery = info?.meridianDbExists === true
  const adapters = info?.cursorAdaptersSynced === true

  return [
    {
      id: "kit",
      label: "Harness installed",
      detail: ".agent/ with agents, skills, and slash workflows",
      done: kit,
      commandId: "meridian.installKit",
    },
    {
      id: "docs",
      label: "Phase docs initialized",
      detail: "docs/00_scope.md and the phase doc set",
      done: docs,
      chatHint: "/init-meridian or /document-project",
    },
    {
      id: "delivery",
      label: "Delivery database",
      detail: ".meridian/meridian.db — backlog source of truth",
      done: delivery,
      chatHint: "/init-meridian (after docs/)",
    },
    {
      id: "adapters",
      label: "IDE adapters synced",
      detail: ".cursor/commands/ mirrors .agent/workflows/",
      done: adapters,
      commandId: "meridian.upgradeKit",
    },
    {
      id: "board",
      label: "Open board + /status",
      detail: "Confirm the loop in the extension and chat",
      done: kit && docs && delivery,
      commandId: "meridian.openBoard",
      chatHint: "/status",
    },
  ]
}

export function welcomeWebviewHtml(
  items: WelcomeChecklistItem[],
  projectLabel: string,
): string {
  const doneCount = items.filter((i) => i.done).length
  const rows = items
    .map((item) => {
      const status = item.done ? "✓" : "○"
      const statusClass = item.done ? "done" : "pending"
      const action =
        item.commandId && !item.done
          ? `<button class="action" data-command="${escapeAttr(item.commandId)}">Run in IDE</button>`
          : ""
      const chat =
        item.chatHint && !item.done
          ? `<span class="chat-hint">Chat: <code>${escapeHtml(item.chatHint)}</code></span>`
          : ""
      return `<li class="check ${statusClass}">
        <span class="status" aria-hidden="true">${status}</span>
        <div class="body">
          <strong>${escapeHtml(item.label)}</strong>
          <p>${escapeHtml(item.detail)}</p>
          <div class="actions">${action}${chat}</div>
        </div>
      </li>`
    })
    .join("")

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    :root {
      color: var(--vscode-foreground);
      background: var(--vscode-editor-background);
      font-family: var(--vscode-font-family);
      font-size: var(--vscode-font-size);
      line-height: 1.5;
    }
    body { margin: 0; padding: 1.25rem 1.5rem 2rem; max-width: 42rem; }
    h1 { font-size: 1.35rem; font-weight: 600; margin: 0 0 0.35rem; }
    .lede { opacity: 0.9; margin: 0 0 1.25rem; }
    .meta { font-size: 0.85rem; opacity: 0.75; margin-bottom: 1rem; }
    .progress {
      display: inline-block;
      padding: 0.2rem 0.55rem;
      border-radius: 4px;
      background: var(--vscode-badge-background);
      color: var(--vscode-badge-foreground);
      font-size: 0.8rem;
      margin-bottom: 1rem;
    }
    ul { list-style: none; padding: 0; margin: 0; }
    .check {
      display: flex;
      gap: 0.75rem;
      padding: 0.85rem 0;
      border-bottom: 1px solid var(--vscode-panel-border);
    }
    .status { font-size: 1.1rem; width: 1.25rem; flex-shrink: 0; }
    .check.done .status { color: var(--vscode-testing-iconPassed, #3fb950); }
    .check.pending .status { opacity: 0.45; }
    .body p { margin: 0.2rem 0 0.5rem; font-size: 0.9rem; opacity: 0.85; }
    .actions { display: flex; flex-wrap: wrap; gap: 0.5rem 1rem; align-items: center; }
    .action {
      cursor: pointer;
      border: none;
      border-radius: 4px;
      padding: 0.25rem 0.65rem;
      background: var(--vscode-button-background);
      color: var(--vscode-button-foreground);
      font-size: 0.85rem;
    }
    .action:hover { background: var(--vscode-button-hoverBackground); }
    .chat-hint { font-size: 0.8rem; opacity: 0.8; }
    code {
      font-family: var(--vscode-editor-font-family);
      background: var(--vscode-textCodeBlock-background);
      padding: 0.1rem 0.35rem;
      border-radius: 3px;
    }
    .footer {
      margin-top: 1.5rem;
      font-size: 0.85rem;
      opacity: 0.8;
    }
    .footer a { color: var(--vscode-textLink-foreground); }
  </style>
</head>
<body>
  <h1>Welcome to Meridian</h1>
  <p class="lede">Specialist agents, defensive gates, repo-native delivery. Complete this checklist for first-value onboarding.</p>
  <p class="meta">Workspace: ${escapeHtml(projectLabel)}</p>
  <p class="progress">${doneCount} / ${items.length} complete</p>
  <ul>${rows}</ul>
  <p class="footer">
    Orchestration: type <code>/deus-ex</code> when unsure what to run next.
    <a href="#" data-command="meridian.openHowToUse">How to use</a> ·
    <a href="#" data-command="meridian.doctor">Doctor</a>
  </p>
  <script>
    const vscode = acquireVsCodeApi();
    document.querySelectorAll('[data-command]').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        const cmd = el.getAttribute('data-command');
        if (cmd) vscode.postMessage({ type: 'runCommand', commandId: cmd });
      });
    });
  </script>
</body>
</html>`
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function escapeAttr(value: string): string {
  return value.replace(/"/g, "&quot;")
}
