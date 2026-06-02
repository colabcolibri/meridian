import { describe, expect, it } from "vitest"

import type { Epic, ProductVersion, UserStory } from "@/domain/meridian/types"
import {
  allVersionsSelected,
  epicsForVersionFilter,
  filterStoriesByVersions,
  resolveDefaultSelectedVersions,
  sortVersionIdsDesc,
  versionIdsFromCatalog,
  versionIdsFromStories,
} from "@/features/monitor/version-filter"

const versions: ProductVersion[] = [
  {
    id: "v0",
    title: "Foundation",
    status: "complete",
    outcome: "x",
    objective: "x",
    scopeIn: "x",
    scopeOut: "x",
  },
  {
    id: "v1",
    title: "MVP",
    status: "complete",
    outcome: "y",
    objective: "y",
    scopeIn: "y",
    scopeOut: "y",
  },
  {
    id: "v2",
    title: "Bridge",
    status: "planned",
    outcome: "z",
    objective: "z",
    scopeIn: "z",
    scopeOut: "z",
  },
]

const stories: UserStory[] = [
  {
    id: "US-0001",
    title: "A",
    epic: "EPIC-01",
    version: "v0",
    status: "✅",
    moscow: "Must",
    dependsOn: [],
    doneWhen: "done",
    tests: "required",
    testsStatus: "done",
  },
  {
    id: "US-0002",
    title: "B",
    epic: "EPIC-04",
    version: "v1",
    status: "❌",
    moscow: "Must",
    dependsOn: [],
    doneWhen: "done",
    tests: "required",
    testsStatus: "pending",
  },
]

const epics: Epic[] = [
  {
    id: "EPIC-01",
    title: "Structure",
    status: "complete",
    versions: ["v0"],
    outcome: "x",
    description: "x",
    scopeOut: "x",
    profiles: ["Manager do Processo"],
  },
  {
    id: "EPIC-04",
    title: "Kanban",
    status: "active",
    versions: ["v1"],
    outcome: "y",
    description: "y",
    scopeOut: "y",
    profiles: ["Manager do Processo"],
  },
]

describe("sortVersionIdsDesc", () => {
  it("orders latest version first", () => {
    expect(sortVersionIdsDesc(["v0", "v1", "v2"])).toEqual(["v2", "v1", "v0"])
  })
})

describe("versionIdsFromCatalog", () => {
  it("lists every release file, not only versions with US", () => {
    expect(versionIdsFromCatalog(versions)).toEqual(["v2", "v1", "v0"])
  })
})

describe("versionIdsFromStories", () => {
  it("returns ids latest first", () => {
    expect(versionIdsFromStories(stories)).toEqual(["v1", "v0"])
  })
})

describe("resolveDefaultSelectedVersions", () => {
  it("prefers active version", () => {
    const activeVersions: ProductVersion[] = [
      ...versions,
      { ...versions[2]!, status: "active" },
    ]

    expect(resolveDefaultSelectedVersions(activeVersions, stories)).toEqual(["v2"])
  })

  it("falls back to latest version with stories", () => {
    expect(resolveDefaultSelectedVersions(versions, stories)).toEqual(["v1"])
  })
})

describe("epicsForVersionFilter", () => {
  it("limits epics to the selected versions", () => {
    expect(
      epicsForVersionFilter(epics, stories, new Set(["v1"])).map((epic) => epic.id),
    ).toEqual(["EPIC-04"])
  })
})

describe("filterStoriesByVersions", () => {
  it("returns stories for selected versions", () => {
    expect(filterStoriesByVersions(stories, new Set(["v0", "v1"]))).toHaveLength(2)
  })

  it("filters by a single version", () => {
    expect(filterStoriesByVersions(stories, new Set(["v0"]))).toEqual([stories[0]])
  })

  it("returns empty when nothing selected", () => {
    expect(filterStoriesByVersions(stories, new Set())).toHaveLength(0)
  })
})

describe("allVersionsSelected", () => {
  it("detects full selection", () => {
    expect(allVersionsSelected(["v2", "v1", "v0"], new Set(["v2", "v1", "v0"]))).toBe(
      true,
    )
    expect(allVersionsSelected(["v2", "v1", "v0"], new Set(["v1"]))).toBe(false)
  })
})
