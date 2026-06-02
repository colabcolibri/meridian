import { describe, expect, it } from "vitest"

import { phaseLabelForDocId } from "@/domain/meridian/doc-refs"

describe("phaseLabelForDocId", () => {
  it("maps phase docs 00–08 and 11 (delivery lives in folders)", () => {
    expect(phaseLabelForDocId("00_scope")).toBe("Phase 0")
    expect(phaseLabelForDocId("03_user_types")).toBe("Phase 0")
    expect(phaseLabelForDocId("04_principles")).toBe("Phase 1")
    expect(phaseLabelForDocId("05_architecture")).toBe("Phase 2")
    expect(phaseLabelForDocId("06_database")).toBe("Phase 3")
    expect(phaseLabelForDocId("07_api_contracts")).toBe("Phase 3")
    expect(phaseLabelForDocId("08_environments")).toBe("Phase 3")
    expect(phaseLabelForDocId("11_decisions")).toBe("Continuous")
  })
})
