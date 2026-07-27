import { assembleForceGraphRuntime } from "./graph-runtime/assemble.js"

/** Inline force-directed graph runtime for webviews (Obsidian-style pan/zoom/drag). */
export const FORCE_GRAPH_RUNTIME = assembleForceGraphRuntime()
