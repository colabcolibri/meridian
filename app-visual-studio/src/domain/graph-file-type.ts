import type { GraphModel, GraphNode } from "./graph-model.js"

/** Canonical language key from a repo-relative file path. */
export function languageFromPath(filePath: string): string {
  const base = filePath.split("/").pop() ?? filePath
  const dot = base.lastIndexOf(".")
  if (dot < 0) {
    if (base === "Dockerfile" || base.startsWith("Dockerfile.")) return "docker"
    if (base === "Makefile") return "make"
    return "other"
  }
  const ext = base.slice(dot + 1).toLowerCase()
  const map: Record<string, string> = {
    ts: "typescript",
    tsx: "typescript",
    mts: "typescript",
    cts: "typescript",
    js: "javascript",
    jsx: "javascript",
    mjs: "javascript",
    cjs: "javascript",
    py: "python",
    pyi: "python",
    md: "markdown",
    mdx: "markdown",
    json: "json",
    yaml: "yaml",
    yml: "yaml",
    css: "css",
    scss: "scss",
    html: "html",
    sql: "sql",
    sh: "shell",
    bash: "shell",
    zsh: "shell",
    rs: "rust",
    go: "go",
    java: "java",
    kt: "kotlin",
    swift: "swift",
    rb: "ruby",
    php: "php",
    vue: "vue",
    svelte: "svelte",
  }
  return map[ext] ?? ext
}

const LANGUAGE_COLORS: Record<string, string> = {
  typescript: "#3b82f6",
  javascript: "#eab308",
  python: "#22c55e",
  markdown: "#94a3b8",
  json: "#f97316",
  yaml: "#a855f7",
  css: "#ec4899",
  scss: "#f472b6",
  html: "#f87171",
  sql: "#06b6d4",
  shell: "#84cc16",
  rust: "#f97316",
  go: "#38bdf8",
  java: "#ef4444",
  kotlin: "#a78bfa",
  swift: "#fb7185",
  ruby: "#dc2626",
  php: "#8b5cf6",
  vue: "#10b981",
  svelte: "#f43f5e",
  docker: "#2563eb",
  make: "#64748b",
  other: "#64748b",
}

/** Stable accent per language — known palette first, else deterministic HSL. */
export function colorForLanguage(language: string): string {
  const known = LANGUAGE_COLORS[language]
  if (known) {
    return known
  }
  let hash = 0
  for (let i = 0; i < language.length; i++) {
    hash = (hash * 33 + language.charCodeAt(i)) | 0
  }
  const hue = Math.abs(hash) % 360
  return `hsl(${hue}, 58%, 56%)`
}

export function enrichImportGraphNode(node: { id: string; label: string }): GraphNode {
  const fileType = languageFromPath(node.id)
  return {
    id: node.id,
    label: node.label,
    fileType,
    color: colorForLanguage(fileType),
  }
}

export type FileTypeLegendEntry = {
  type: string
  color: string
  count: number
}

export function buildFileTypeLegend(model: GraphModel): FileTypeLegendEntry[] {
  const counts = new Map<string, { color: string; count: number }>()
  for (const node of model.nodes) {
    const type = node.fileType ?? languageFromPath(node.id)
    const color = node.color ?? colorForLanguage(type)
    const prev = counts.get(type)
    if (prev) {
      prev.count++
    } else {
      counts.set(type, { color, count: 1 })
    }
  }
  return [...counts.entries()]
    .map(([type, { color, count }]) => ({ type, color, count }))
    .sort((a, b) => b.count - a.count || a.type.localeCompare(b.type))
}
