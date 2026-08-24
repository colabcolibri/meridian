// Transport — single responsibility: HTTP routing and port lifecycle for the views.
// Binds 127.0.0.1 only, read-only routes, dies with the opencode process.

import { loadDelivery } from "./data.ts"
import {
  renderBoard,
  renderDashboard,
  renderDecisions,
  renderEpics,
  renderError,
  renderSprints,
  renderVersions,
  type BoardFilters,
} from "./pages.ts"

export type ViewsServer = {
  url: string
  port: number
  stop(): void
}

const DEFAULT_PORT = 4788
const MAX_PORT_TRIES = 10

function filtersFromQuery(query: URLSearchParams): BoardFilters {
  return {
    version: query.get("version") ?? "",
    epic: query.get("epic") ?? "",
    sprint: query.get("sprint") ?? "",
  }
}

function parseRefresh(query: URLSearchParams): number | undefined {
  const raw = query.get("refresh")
  if (raw === null) return undefined
  const seconds = Number(raw)
  return Number.isFinite(seconds) && seconds >= 5 ? Math.min(seconds, 300) : undefined
}

function html(body: string): Response {
  return new Response(body, { headers: { "content-type": "text/html; charset=utf-8" } })
}

async function handle(root: string, pathname: string, query: URLSearchParams): Promise<Response> {
  try {
    const data = await loadDelivery(root)
    switch (pathname) {
      case "/":
        return html(renderDashboard(data, "/"))
      case "/board":
        return html(
          renderBoard({ planning: data.planning }, filtersFromQuery(query), "/board", parseRefresh(query)),
        )
      case "/versions":
        return html(renderVersions(data, "/versions"))
      case "/sprints":
        return html(renderSprints(data, "/sprints"))
      case "/epics":
        return html(renderEpics(data, "/epics"))
      case "/decisions":
        return html(renderDecisions(data, "/decisions"))
      case "/api/planning":
        return Response.json(data.planning)
      case "/api/decisions":
        return Response.json(data.decisions)
      default:
        return new Response("not found", { status: 404 })
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return new Response(renderError(message, pathname || "/"), {
      status: 503,
      headers: { "content-type": "text/html; charset=utf-8" },
    })
  }
}

export function startViewsServer(options: { root: string; port?: number }): ViewsServer {
  const base = options.port ?? (Number(process.env.MERIDIAN_VIEWS_PORT) || DEFAULT_PORT)

  let lastError: unknown = null
  for (let attempt = 0; attempt < MAX_PORT_TRIES; attempt++) {
    const port = base + attempt
    try {
      const server = Bun.serve({
        hostname: "127.0.0.1",
        port,
        async fetch(request) {
          const url = new URL(request.url)
          return handle(options.root, url.pathname, url.searchParams)
        },
      })
      return {
        url: `http://127.0.0.1:${port}`,
        port,
        stop: () => server.stop(true),
      }
    } catch (err) {
      lastError = err
    }
  }
  throw lastError instanceof Error ? lastError : new Error("could not bind a port for Meridian views")
}
