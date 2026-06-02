import { describe, expect, it } from "vitest"

import {
  validateEpicStructure,
  validateUserStoryStructure,
  validateVersionStructure,
} from "@/domain/meridian/section-contracts"

const minimalUsBody = `
## Acceptance
- [ ] criterion

## Context & constraints
### Architecture refs
- docs/05_architecture.md

### API / DB impact
- _n/a_

### Security notes
- _n/a_

### Related decisions
- _n/a_

### Implementation hints (preliminary)
- src/foo.ts

## Technical implementation
### Files
_(pending)_

### Backend
_n/a_

### Frontend
_n/a_

### Scripts / Docs
_n/a_

## Tests
### Planned
- [ ] manual — step 1

### Executed
_(pending)_

## Out of scope for this story
- none

## Notes
- none
`

describe("validateUserStoryStructure", () => {
  it("passes strict US with full template sections", () => {
    expect(validateUserStoryStructure("US-0099", minimalUsBody, true, "❌")).toEqual([])
  })

  it("errors when core section missing", () => {
    const messages = validateUserStoryStructure(
      "US-0099",
      "## Acceptance\n",
      false,
      "❌",
    )
    expect(messages.some((m) => m.includes("## Tests"))).toBe(true)
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
