/**
 * Canonical Mermaid for Scrum ↔ Meridian synthesis.
 * Keep in sync with `.agent/references/scrum-meridian-map.md` (```mermaid fence).
 * App renders with Mermaid 11.12.0 + Dagre (default) — same stack as VS Code Markdown preview.
 */
export const SCRUM_MERIDIAN_MERMAID = `flowchart TB
  subgraph guia [Scrum guide - human reference]
    E[Epic]
    F[Feature optional]
    USg[User Story]
    T[Tasks]
    C[Ceremonies + metrics]
  end

  subgraph meridian [Meridian - agent system]
    P[docs 00-11]
    EP[EPIC]
    V[Version]
    S[Sprint]
    USm[US Intent/Plan/Record]
    A[Agents + skills + validate]
    B[board.json derived]
  end

  E --> EP
  F -.->|not used| EP
  USg --> USm
  T -.->|Plan + Planned| USm
  C -.->|daily-with-ai, refine, complete| A
  P --> EP
  EP --> V --> S --> USm --> B`
