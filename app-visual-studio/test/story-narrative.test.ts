import assert from "node:assert/strict"
import { test } from "node:test"

import { compactStoryNarrative, extractUsPreamble } from "../src/domain/story-narrative.js"

const SAMPLE = `# US-0001 — Open Meridian app locally

**As** Process Manager,
**I want** to open the Meridian app locally,
**so that** I can start operating the development flow with visibility.

## Intent

### Acceptance
`

test("extractUsPreamble stops before first section", () => {
  const preamble = extractUsPreamble(SAMPLE)
  assert.match(preamble, /\*\*As\*\* Process Manager/)
  assert.doesNotMatch(preamble, /## Intent/)
})

test("compactStoryNarrative strips heading and markdown", () => {
  const compact = compactStoryNarrative(extractUsPreamble(SAMPLE))
  assert.ok(compact)
  assert.doesNotMatch(compact!, /US-0001/)
  assert.doesNotMatch(compact!, /\*\*/)
  assert.match(compact!, /I want/)
  assert.match(compact!, /so that/)
})

test("extractUsPreamble strips frontmatter when present", () => {
  const full = `---
id: US-0001
title: Sample
---

${SAMPLE}`
  const preamble = extractUsPreamble(full)
  assert.match(preamble, /\*\*As\*\* Process Manager/)
  assert.doesNotMatch(preamble, /^---/)
})
