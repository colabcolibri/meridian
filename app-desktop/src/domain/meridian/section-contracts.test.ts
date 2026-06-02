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
### Why this story
Problem before and outcome after this slice.

### Where it fits
Part of v1; depends on US-0022.

### Approach
- Update KanbanView to filter by version so planning sessions stay focused.

### Architecture refs
- docs/05_architecture.md — Monitor

### API / DB impact
- _n/a_

### Security notes
- _n/a_

### Related decisions
- _n/a_

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
  it("passes strict US with canonical Context subsections", () => {
    expect(validateUserStoryStructure("US-0099", minimalUsBody, true, "❌")).toEqual([])
  })

  it("warns on legacy Context subsections", () => {
    const legacy = minimalUsBody.replace(
      "### Why this story\nProblem before and outcome after this slice.\n\n### Where it fits\nPart of v1; depends on US-0022.\n\n### Approach\n- Update KanbanView to filter by version so planning sessions stay focused.\n\n",
      "### Implementation hints (preliminary)\n- src/foo.ts\n\n",
    )
    const messages = validateUserStoryStructure("US-0099", legacy, true, "❌")
    expect(messages.some((m) => m.includes("legacy subsections"))).toBe(true)
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
