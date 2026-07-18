import { KIT_REFERENCES } from "./kit-references.js"
import type { KitReferencePanelConfig } from "./kit-reference-editor-panel.js"

export const HOW_TO_USE_PANEL: KitReferencePanelConfig = {
  viewType: "meridian.howToUse",
  tabTitle: "Meridian — how to use",
  relativeFromAgent: KIT_REFERENCES.howToUse,
  sourceLabel: ".agent/references/how-to-use.md",
  intro: {
    title: "Meridian — how to use",
    description:
      "Start here: extension vs chat, what you type (/commands), setup, and reading order for the other guides.",
  },
}

export const START_HERE_PANEL: KitReferencePanelConfig = {
  viewType: "meridian.startHere",
  tabTitle: "Meridian — start here",
  relativeFromAgent: KIT_REFERENCES.startHere,
  sourceLabel: ".agent/references/start-here.md",
  intro: {
    title: "Meridian — start here",
    description:
      "Concepts: phases, gates, folders. No command lists — see usage guide and agents help for procedures.",
  },
}

export const USAGE_GUIDE_PANEL: KitReferencePanelConfig = {
  viewType: "meridian.usageGuide",
  tabTitle: "Meridian — usage guide",
  relativeFromAgent: KIT_REFERENCES.usageGuide,
  sourceLabel: ".agent/references/usage-guide.md",
  intro: {
    title: "Meridian — usage guide",
    description:
      "Recipes by situation: new project, brownfield, phase docs, backlog, implement, close US.",
  },
}

export const AGENTS_HELP_PANEL: KitReferencePanelConfig = {
  viewType: "meridian.agentsHelp",
  tabTitle: "Meridian — agents & slash commands",
  relativeFromAgent: KIT_REFERENCES.agentsHelp,
  sourceLabel: ".agent/references/agents-help.md",
  intro: {
    title: "Meridian — agents & slash commands",
    description:
      "Reference lookup: all slash commands, agent groups, steps 1–20. Not a linear tutorial.",
  },
}

export const ARTIFACT_REFERENCE_PANEL: KitReferencePanelConfig = {
  viewType: "meridian.artifactReference",
  tabTitle: "Meridian — artifact reference",
  relativeFromAgent: KIT_REFERENCES.artifactReference,
  sourceLabel: ".agent/references/artifact-reference.md",
  intro: {
    title: "Meridian — artifact reference",
    description:
      "Field-level detail for US, epic, version, sprint, and decision log entries.",
  },
}
