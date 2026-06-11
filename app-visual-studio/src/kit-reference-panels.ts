import { KIT_REFERENCES } from "./kit-references.js"
import type { KitReferencePanelConfig } from "./kit-reference-editor-panel.js"

export const START_HERE_PANEL: KitReferencePanelConfig = {
  viewType: "meridian.startHere",
  tabTitle: "Meridian — start here",
  relativeFromAgent: KIT_REFERENCES.startHere,
  sourceLabel: ".agent/references/start-here.md",
  intro: {
    title: "Meridian — start here",
    description:
      "Concepts first: phases, artifacts, gates, and folder layout. Read this before slash commands or the board.",
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
      "Day-to-day situations: when to run each step, sequences, and how the VS Code extension fits with chat slash commands.",
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
      "Who does what: slash commands (workflows), agents, skills, and the numbered sequence. You invoke workflows — agents follow automatically.",
  },
}
