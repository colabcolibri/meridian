import assert from "node:assert/strict"
import { describe, it } from "node:test"

import { buildDeliveryViewerHtml } from "../src/delivery-viewer-html.js"
import { parseDeliveryMarkdown } from "../src/parse-delivery-markdown.js"

describe("delivery viewer", () => {
  const sample = `---
id: US-0099
title: Sample story
status: ❌
epic: EPIC-01
version: v0
---

# US-0099 — Sample story

## Intent

### Acceptance

- [ ] Works
`

  it("parses frontmatter and body", () => {
    const parsed = parseDeliveryMarkdown(sample)
    assert.equal(parsed.frontmatter.id, "US-0099")
    assert.equal(parsed.frontmatter.title, "Sample story")
    assert.match(parsed.body.trim(), /^# US-0099/)
  })

  it("builds view html with edit button", () => {
    const parsed = parseDeliveryMarkdown(sample)
    const html = buildDeliveryViewerHtml({
      relativePath: "us/US-0099.md",
      entityLabel: "User story",
      folder: "us",
      frontmatter: parsed.frontmatter,
      bodyMarkdown: parsed.body,
      fullMarkdown: sample,
      mode: "view",
    })
    assert.match(html, /id="editBtn"/)
    assert.match(html, /Sample story/)
    assert.match(html, /<h2>/)
  })

  it("builds edit html with textarea and save", () => {
    const parsed = parseDeliveryMarkdown(sample)
    const html = buildDeliveryViewerHtml({
      relativePath: "us/US-0099.md",
      entityLabel: "User story",
      folder: "us",
      frontmatter: parsed.frontmatter,
      bodyMarkdown: parsed.body,
      fullMarkdown: sample,
      mode: "edit",
    })
    assert.match(html, /id="editor"/)
    assert.match(html, /id="saveBtn"/)
    assert.match(html, /US-0099/)
  })
})
