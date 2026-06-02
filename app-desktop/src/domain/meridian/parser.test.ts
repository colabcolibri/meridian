import { readFileSync, readdirSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"

import {
  parseDecisionDayFile,
  parseEpicFile,
  parsePhaseDocument,
  parseSprintFile,
  parseUserStoryFile,
  parseVersionFile,
} from "@/domain/meridian/parser"

const docsRoot = resolve(__dirname, "../../../docs")

describe("meridian parser", () => {
  it("parses 00_scope.md", () => {
    const raw = readFileSync(resolve(docsRoot, "00_scope.md"), "utf8")
    const doc = parsePhaseDocument("00_scope", raw)

    expect(doc.status).toBe("approved")
    expect(doc.dependsOn).toEqual([])
    expect(doc.blocks).toContain("01_tech_stack")
    expect(doc.title).toBe("Scope")
  })

  it("parses 05_architecture.md with multiline depends_on", () => {
    const raw = readFileSync(resolve(docsRoot, "05_architecture.md"), "utf8")
    const doc = parsePhaseDocument("05_architecture", raw)

    expect(doc.status).toBe("approved")
    expect(doc.dependsOn).toContain("00_scope")
    expect(doc.dependsOn).toContain("04_principles")
    expect(doc.dependsOn).not.toContain("21_versions")
  })

  it("parses US-0001.md", () => {
    const raw = readFileSync(resolve(docsRoot, "us/US-0001.md"), "utf8")
    const story = parseUserStoryFile("US-0001.md", raw)

    expect(story.id).toBe("US-0001")
    expect(story.epic).toBe("EPIC-01")
    expect(story.status).toBe("✅")
    expect(story.moscow).toBe("Must")
  })

  it("rejects US id with fewer than 4 digits", () => {
    const raw = readFileSync(resolve(docsRoot, "us/US-0001.md"), "utf8").replace(
      /US-0001/g,
      "US-001",
    )
    expect(() => parseUserStoryFile("US-001.md", raw)).toThrow(/4–5 digits/)
  })

  it("accepts 5-digit US ids up to US-99999", () => {
    const raw = `---
id: US-10000
title: Large backlog item
epic: EPIC-01
version: v0
status: ❌
moscow: Must
depends_on: []
done_when: Done when shipped.
tests: none
tests_status: n/a
---

# US-10000 — Large backlog item
`
    const story = parseUserStoryFile("US-10000.md", raw)
    expect(story.id).toBe("US-10000")
  })

  it("parses EPIC-02.md in docs/epics/", () => {
    const raw = readFileSync(resolve(docsRoot, "epics/EPIC-02.md"), "utf8")
    const epic = parseEpicFile("EPIC-02.md", raw)

    expect(epic.id).toBe("EPIC-02")
    expect(epic.title).toContain("Setup")
    expect(epic.status).toBe("complete")
    expect(epic.versions).toContain("v0")
    expect(epic.versions).toContain("v1")
    expect(epic.profiles.length).toBeGreaterThan(0)
    expect(epic.outcome.length).toBeGreaterThan(10)
    expect(epic.description.length).toBeGreaterThan(10)
    expect(epic.scopeOut.length).toBeGreaterThan(5)
  })

  it("parses all epics in docs/epics/", () => {
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
    expect(epic05.status).toBe("active")
  })

  it("parses v1.md in docs/versions/", () => {
    const raw = readFileSync(resolve(docsRoot, "versions/v1.md"), "utf8")
    const version = parseVersionFile("v1.md", raw)

    expect(version.id).toBe("v1")
    expect(version.title).toContain("Monitor")
    expect(version.status).toBe("complete")
    expect(version.outcome.length).toBeGreaterThan(10)
    expect(version.objective.length).toBeGreaterThan(10)
  })

  it("parses v1-S1.md in docs/sprints/", () => {
    const raw = readFileSync(resolve(docsRoot, "sprints/v1-S1.md"), "utf8")
    const sprint = parseSprintFile("v1-S1.md", raw)

    expect(sprint.id).toBe("v1-S1")
    expect(sprint.versionId).toBe("v1")
    expect(sprint.storyIds.length).toBeGreaterThan(3)
  })

  it("parses decisions/2026-06-02.json", () => {
    const raw = readFileSync(resolve(docsRoot, "decisions/2026-06-02.json"), "utf8")
    const day = parseDecisionDayFile("2026-06-02.json", raw)

    expect(day.date).toBe("2026-06-02")
    expect(day.entries.length).toBeGreaterThanOrEqual(30)
    expect(day.entries[0].time).toMatch(/^\d{2}:\d{2}$/)
    expect(day.entries[0].title.length).toBeGreaterThan(5)
    expect(day.entries[0].whatChanged.length).toBeGreaterThan(3)
    expect(day.entries[0].affectedDocument.length).toBeGreaterThan(3)
  })
})
