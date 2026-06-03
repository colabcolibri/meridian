import { describe, expect, it } from "vitest"

import {
  validateEpicStructure,
  validateUserStoryStructure,
  validateVersionStructure,
} from "@/domain/meridian/section-contracts"

const minimalUsBody = `
## Intent

### Acceptance
- [ ] criterion

### Why
Problem before and outcome after this slice.

### Where
Part of v1; depends on US-0022.

## Plan

### Architecture refs
- docs/05_architecture.md — Monitor

### API / DB impact
- _n/a_

### Security notes
- _n/a_

### Related decisions
- _n/a_

### Planned
- [ ] manual — step 1

## Record

### Files
_(pending)_

### Backend
_n/a_

### Frontend
_n/a_

### Scripts / Docs
_n/a_

### Executed
_(pending)_

## Boundaries

### Out of scope for this story
- none

### Notes
- none
`

describe("validateUserStoryStructure", () => {
  it("passes strict US with v2 grouped sections", () => {
    expect(validateUserStoryStructure("US-0099", minimalUsBody, true, "❌")).toEqual([])
  })

  it("requires all four phase H2 sections", () => {
    const incomplete = minimalUsBody.replace("## Boundaries", "## Missing")
    const messages = validateUserStoryStructure("US-0099", incomplete, true, "❌")
    expect(messages.some((m) => m.includes("## Boundaries"))).toBe(true)
  })
})

describe("validateEpicStructure", () => {
  it("requires capability sections", () => {
    const body = `
## Capability
x
## Expected outcome
y
## Out of scope for this epic
z
`
    expect(validateEpicStructure("EPIC-01", body)).toEqual([])
  })
})

describe("validateVersionStructure", () => {
  it("accepts Objective heading", () => {
    const body = `
## Objective
x
## Done criteria
y
## Included in this version
z
## Explicitly out
a
## Go-live checklist
b
`
    expect(validateVersionStructure("v1", body)).toEqual([])
  })
})
