export type GraphNode = {
  id: string
  label: string
  version?: string
  sprint?: string | null
  status?: string
  meta?: Record<string, string>
}

export type GraphEdge = {
  from: string
  to: string
}

export type GraphModel = {
  nodes: GraphNode[]
  edges: GraphEdge[]
}

/** Escape Meridian node ids for Mermaid (US-0162 → US_0162). */
export function mermaidNodeId(id: string): string {
  return id.replace(/[^A-Za-z0-9_]/g, "_")
}

export function escapeMermaidLabel(text: string): string {
  return text.replace(/"/g, "'").replace(/\n/g, " ").slice(0, 80)
}

export function toMermaidFlowchart(model: GraphModel, direction: "LR" | "TD" = "LR"): string {
  const lines = [`flowchart ${direction}`]
  const nodeIds = new Set(model.nodes.map((n) => n.id))
  for (const node of model.nodes) {
    const mid = mermaidNodeId(node.id)
    const label = escapeMermaidLabel(`${node.id} ${node.label}`.trim())
    lines.push(`  ${mid}["${label}"]`)
  }
  for (const edge of model.edges) {
    if (!nodeIds.has(edge.from) || !nodeIds.has(edge.to)) {
      continue
    }
    lines.push(`  ${mermaidNodeId(edge.from)} --> ${mermaidNodeId(edge.to)}`)
  }
  if (model.nodes.length === 0) {
    lines.push('  empty["No nodes in filter"]')
  }
  return lines.join("\n")
}
