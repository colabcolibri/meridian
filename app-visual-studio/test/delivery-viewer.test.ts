import assert from "node:assert/strict"
import { describe, it } from "node:test"

import { buildDeliveryFormHtml } from "../src/delivery-form-html.js"
import { deliveryFormFields } from "../src/delivery-form-schema.js"
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
    })
    assert.match(html, /id="editBtn"/)
    assert.match(html, /Sample story/)
  })

  it("defines form fields for all delivery folders", () => {
    for (const folder of ["us", "epics", "versions", "sprints"] as const) {
      assert.ok(deliveryFormFields(folder).length > 3)
    }
  })

  it("builds structured form html with depends_on picker", () => {
    const html = buildDeliveryFormHtml({
      relativePath: "us/US-0099.md",
      entityLabel: "User story",
      folder: "us",
      form: {
        entity: "us",
        id: "US-0099",
        frontmatter: { id: "US-0099", title: "Sample story", depends_on: "[US-0001]" },
        preamble: "# US-0099 — Sample story",
        sections: { intent_acceptance: "- [ ] Works" },
        catalog: {
          stories: [
            { id: "US-0001", title: "Prerequisite", status: "✅" },
            { id: "US-0002", title: "Other", status: "❌" },
          ],
          epics: [{ id: "EPIC-01", title: "Epic" }],
          versions: [{ id: "v10", title: "v10" }],
        },
      },
    })
    assert.match(html, /id="saveFormBtn"/)
    assert.match(html, /data-multiselect="true"/)
    assert.match(html, /US-0001/)
    assert.match(html, /Prerequisite/)
  })
})
