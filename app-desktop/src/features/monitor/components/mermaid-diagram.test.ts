import { describe, expect, it } from "vitest"

import { withLayoutEngine } from "./MermaidDiagram"

describe("withLayoutEngine", () => {
  it("leaves dagre charts unchanged", () => {
    const chart = "flowchart TB\n  A --> B"
    expect(withLayoutEngine(chart, "dagre")).toBe(chart)
  })

  it("prepends elk config without mutating kit source", () => {
    const chart = "flowchart TB\n  A --> B"
    expect(withLayoutEngine(chart, "elk")).toBe(
      "---\nconfig:\n  layout: elk\n---\nflowchart TB\n  A --> B",
    )
  })
})
