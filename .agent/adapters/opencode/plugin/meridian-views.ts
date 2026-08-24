// meridian-views — OpenCode plugin generated/managed by the Meridian kit.
//
// Brings the visual delivery system (kanban board, versions, sprints, epics,
// decisions — the meridian-vscode panels) to OpenCode sessions:
//   - Starts a local read-only web server automatically when OpenCode starts
//     (bound to 127.0.0.1, dies with the process — nothing to manage).
//   - Registers the `meridian_board` tool so the model can hand you the URL.
//
// Open the board at http://127.0.0.1:4788 (or ask: "abre o board").
// Requires the Meridian kit (.agent/) in this repository.

import { tool } from "@opencode-ai/plugin"
import { countByColumn, columnHeaderLabel } from "./views/board.ts"
import { kitPresent, loadDelivery } from "./views/data.ts"
import { startViewsServer, type ViewsServer } from "./views/server.ts"

const BOARD_COLUMNS = ["backlog", "todo", "🔶", "🧪", "✅"] as const

export const MeridianViews = async ({ directory, worktree, client }) => {
  const root = worktree ?? directory

  if (!kitPresent(root)) {
    return {}
  }

  let server: ViewsServer
  try {
    server = startViewsServer({ root })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    await client?.app?.log?.({
      body: { service: "meridian-views", level: "warn", message: `views server unavailable: ${message}` },
    }).catch(() => {})
    console.error(`[meridian-views] ${message}`)
    return {}
  }

  async function boardSummary(): Promise<string> {
    const { planning } = await loadDelivery(root)
    const counts = countByColumn(planning.userStories)
    const line = BOARD_COLUMNS.map((key) => `${columnHeaderLabel(key)}: ${counts[key] ?? 0}`).join(" | ")
    return (
      `Meridian board: ${server.url}/board\n` +
      `${line}\n` +
      `Also available: /versions, /sprints, /epics, /decisions (same host).`
    )
  }

  return {
    tool: {
      meridian_board: tool({
        description:
          "Return the local URL of the visual Meridian kanban board (browser) plus current column counts. The server is already running — just share the URL with the user.",
        args: {},
        async execute() {
          try {
            return await boardSummary()
          } catch (err) {
            const message = err instanceof Error ? err.message : String(err)
            return `Meridian views server is up at ${server.url} but data loading failed:\n${message}`
          }
        },
      }),
    },
  }
}
