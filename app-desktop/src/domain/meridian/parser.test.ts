import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"

import {
  parseEpicsFromMarkdown,
  parsePhaseDocument,
  parseUserStoryFile,
} from "@/domain/meridian/parser"

const docsRoot = resolve(__dirname, "../../../docs")

describe("meridian parser", () => {
  it("parseia 00_scope.md", () => {
    const raw = readFileSync(resolve(docsRoot, "00_scope.md"), "utf8")
    const doc = parsePhaseDocument("00_scope", raw)

    expect(doc.status).toBe("approved")
    expect(doc.dependsOn).toEqual([])
    expect(doc.blocks).toContain("01_tech_stack")
    expect(doc.title).toBe("Escopo")
  })

  it("parseia 07_architecture.md com depends_on multilinha", () => {
    const raw = readFileSync(resolve(docsRoot, "07_architecture.md"), "utf8")
    const doc = parsePhaseDocument("07_architecture", raw)

    expect(doc.status).toBe("approved")
    expect(doc.dependsOn).toContain("00_scope")
    expect(doc.dependsOn).toContain("06_versions")
  })

  it("parseia US-001.md", () => {
    const raw = readFileSync(resolve(docsRoot, "us/US-001.md"), "utf8")
    const story = parseUserStoryFile("US-001.md", raw)

    expect(story.id).toBe("US-001")
    expect(story.epic).toBe("EPIC-01")
    expect(story.status).toBe("✅")
    expect(story.moscow).toBe("Must")
  })

  it("parseia epics em 04_epics.md", () => {
    const raw = readFileSync(resolve(docsRoot, "04_epics.md"), "utf8")
    const epics = parseEpicsFromMarkdown(raw)

    expect(epics.length).toBeGreaterThanOrEqual(5)
    expect(epics.find((epic) => epic.id === "EPIC-02")?.title).toContain("Configuração")
    expect(epics.find((epic) => epic.id === "EPIC-05")?.status).toBe("paused")
  })
})
