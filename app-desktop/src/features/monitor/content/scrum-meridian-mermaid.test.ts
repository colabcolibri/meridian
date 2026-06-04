import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"

import { SCRUM_MERIDIAN_MERMAID } from "./scrum-meridian-mermaid"

const REPO_ROOT = resolve(import.meta.dirname, "../../../../../")
const KIT_MAP_PATH = resolve(REPO_ROOT, ".agent/references/scrum-meridian-map.md")

function extractMermaidFence(markdown: string): string {
  const match = markdown.match(/```mermaid\r?\n([\s\S]*?)```/)
  return match?.[1]?.trim() ?? ""
}

describe("scrum-meridian-mermaid", () => {
  it("matches the mermaid fence in .agent/references/scrum-meridian-map.md", () => {
    const kit = readFileSync(KIT_MAP_PATH, "utf8")
    expect(extractMermaidFence(kit)).toBe(SCRUM_MERIDIAN_MERMAID.trim())
  })
})
