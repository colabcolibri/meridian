import * as path from "node:path"

import type { MeridianWorkspaceInfo } from "./meridian-workspace.js"

/** Canonical kit references (relative to `.agent/`). */
export const KIT_REFERENCES = {
  howToUse: path.join("references", "how-to-use.md"),
  agentsHelp: path.join("references", "agents-help.md"),
  usageGuide: path.join("references", "usage-guide.md"),
  startHere: path.join("references", "start-here.md"),
  artifactReference: path.join("references", "artifact-reference.md"),
} as const

export function kitReferencePath(
  info: MeridianWorkspaceInfo,
  relativeFromAgent: string,
): string {
  return path.join(info.projectRoot, ".agent", relativeFromAgent)
}
