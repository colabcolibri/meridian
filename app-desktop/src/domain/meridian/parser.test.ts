import { readFileSync, readdirSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"

import {
  parseEpicFile,
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

  it("parseia EPIC-02.md em docs/epics/", () => {
    const raw = readFileSync(resolve(docsRoot, "epics/EPIC-02.md"), "utf8")
    const epic = parseEpicFile("EPIC-02.md", raw)

    expect(epic.id).toBe("EPIC-02")
    expect(epic.title).toContain("Configuração")
    expect(epic.status).toBe("complete")
    expect(epic.versions).toContain("v0")
    expect(epic.versions).toContain("v1")
    expect(epic.profiles.length).toBeGreaterThan(0)
    expect(epic.description.length).toBeGreaterThan(10)
  })

  it("parseia todos os epics em docs/epics/", () => {
    const epicsDir = resolve(docsRoot, "epics")
    const files = readdirSync(epicsDir).filter((name) => /^EPIC-\d+\.md$/i.test(name))

    expect(files.length).toBeGreaterThanOrEqual(5)

    for (const filename of files) {
      const raw = readFileSync(resolve(epicsDir, filename), "utf8")
      const epic = parseEpicFile(filename, raw)
      expect(epic.id).toBe(filename.replace(/\.md$/i, ""))
    }

    const epic05 = parseEpicFile(
      "EPIC-05.md",
      readFileSync(resolve(epicsDir, "EPIC-05.md"), "utf8"),
    )
    expect(epic05.status).toBe("paused")
  })
})
