import { describe, expect, it } from "vitest"

import { phaseLabelForDocId } from "@/domain/meridian/doc-refs"

describe("phaseLabelForDocId", () => {
  it("mapeia docs de fase 00–08 e 11 (entrega fica nas pastas)", () => {
    expect(phaseLabelForDocId("00_scope")).toBe("Fase 0")
    expect(phaseLabelForDocId("03_user_types")).toBe("Fase 0")
    expect(phaseLabelForDocId("04_principles")).toBe("Fase 1")
    expect(phaseLabelForDocId("05_architecture")).toBe("Fase 2")
    expect(phaseLabelForDocId("06_database")).toBe("Fase 3")
    expect(phaseLabelForDocId("07_api_contracts")).toBe("Fase 3")
    expect(phaseLabelForDocId("08_environments")).toBe("Fase 3")
    expect(phaseLabelForDocId("11_decisions")).toBe("Contínuo")
  })
})
