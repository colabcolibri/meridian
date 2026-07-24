/**
 * Meridian diagram renderer — in-house theme and SVG polish for bundled Mermaid.js.
 * Part of app-visual-studio; no third-party diagram renderer dependency.
 */

export type MeridianMermaidCssVars = {
  background: string
  foreground: string
  link: string
  border: string
  muted: string
}

/** Fallback palette when VS Code CSS variables are unavailable. */
export const MERIDIAN_MERMAID_FALLBACK: MeridianMermaidCssVars = {
  background: "#1e1e1e",
  foreground: "#cccccc",
  link: "#38bdf8",
  border: "#475569",
  muted: "#94a3b8",
}

/** Role colors aligned with generate-architecture-diagram skill classDef palette. */
export const MERIDIAN_DIAGRAM_ROLE_COLORS = {
  module: { fill: "#0f766e", stroke: "#2dd4bf", text: "#ecfeff" },
  store: { fill: "#065f46", stroke: "#34d399", text: "#ecfdf5" },
  workflow: { fill: "#5b21b6", stroke: "#c4b5fd", text: "#f5f3ff" },
  person: { fill: "#1d4ed8", stroke: "#93c5fd", text: "#eff6ff" },
  ui: { fill: "#334155", stroke: "#94a3b8", text: "#f8fafc" },
} as const

export type MeridianMermaidInitConfig = {
  theme: "base"
  themeVariables: Record<string, string>
  flowchart: { useMaxWidth: boolean; htmlLabels: boolean; curve: string; padding: number }
  er: { useMaxWidth: boolean; fontSize: number }
  sequence: { useMaxWidth: boolean; mirrorActors: boolean }
  securityLevel: "loose"
}

export function buildMeridianMermaidInitConfig(
  css: MeridianMermaidCssVars = MERIDIAN_MERMAID_FALLBACK,
): MeridianMermaidInitConfig {
  const { background, foreground, link, border, muted } = css
  const { module, store, workflow, ui } = MERIDIAN_DIAGRAM_ROLE_COLORS

  return {
    theme: "base",
    themeVariables: {
      darkMode: "true",
      background,
      primaryColor: module.fill,
      primaryTextColor: module.text,
      primaryBorderColor: module.stroke,
      secondaryColor: ui.fill,
      secondaryTextColor: ui.text,
      secondaryBorderColor: ui.stroke,
      tertiaryColor: workflow.fill,
      tertiaryTextColor: workflow.text,
      tertiaryBorderColor: workflow.stroke,
      lineColor: muted,
      textColor: foreground,
      mainBkg: module.fill,
      nodeBorder: module.stroke,
      clusterBkg: "rgba(148,163,184,0.06)",
      clusterBorder: border,
      titleColor: foreground,
      edgeLabelBackground: background,
      fontFamily: "var(--vscode-font-family)",
      noteBkgColor: store.fill,
      noteTextColor: store.text,
      noteBorderColor: store.stroke,
      actorBkg: ui.fill,
      actorBorder: ui.stroke,
      actorTextColor: ui.text,
      signalColor: muted,
      labelBoxBkgColor: background,
      labelBoxBorderColor: border,
      labelTextColor: foreground,
      relationColor: link,
    },
    flowchart: {
      useMaxWidth: false,
      htmlLabels: true,
      curve: "basis",
      padding: 16,
    },
    er: {
      useMaxWidth: false,
      fontSize: 13,
    },
    sequence: {
      useMaxWidth: false,
      mirrorActors: false,
    },
    securityLevel: "loose",
  }
}

/** JS helpers injected into the architecture diagram webview. */
export function meridianMermaidThemeScriptBody(): string {
  const roles = MERIDIAN_DIAGRAM_ROLE_COLORS
  const fallbacks = MERIDIAN_MERMAID_FALLBACK
  return `
    const MERIDIAN_ROLE_COLORS = ${JSON.stringify(roles)};
    const MERIDIAN_THEME_FALLBACKS = ${JSON.stringify(fallbacks)};

    function readCssVar(name, fallback) {
      const value = getComputedStyle(document.body).getPropertyValue(name).trim();
      return value || fallback;
    }

    function meridianMermaidTheme() {
      const css = {
        background: readCssVar("--vscode-editor-background", MERIDIAN_THEME_FALLBACKS.background),
        foreground: readCssVar("--vscode-foreground", MERIDIAN_THEME_FALLBACKS.foreground),
        link: readCssVar("--vscode-textLink-foreground", MERIDIAN_THEME_FALLBACKS.link),
        border: readCssVar("--vscode-panel-border", MERIDIAN_THEME_FALLBACKS.border),
        muted: readCssVar("--vscode-descriptionForeground", MERIDIAN_THEME_FALLBACKS.muted),
      };
      const module = MERIDIAN_ROLE_COLORS.module;
      const store = MERIDIAN_ROLE_COLORS.store;
      const workflow = MERIDIAN_ROLE_COLORS.workflow;
      const ui = MERIDIAN_ROLE_COLORS.ui;
      return {
        theme: "base",
        themeVariables: {
          darkMode: "true",
          background: css.background,
          primaryColor: module.fill,
          primaryTextColor: module.text,
          primaryBorderColor: module.stroke,
          secondaryColor: ui.fill,
          secondaryTextColor: ui.text,
          secondaryBorderColor: ui.stroke,
          tertiaryColor: workflow.fill,
          tertiaryTextColor: workflow.text,
          tertiaryBorderColor: workflow.stroke,
          lineColor: css.muted,
          textColor: css.foreground,
          mainBkg: module.fill,
          nodeBorder: module.stroke,
          clusterBkg: "rgba(148,163,184,0.06)",
          clusterBorder: css.border,
          titleColor: css.foreground,
          edgeLabelBackground: css.background,
          fontFamily: "var(--vscode-font-family)",
          noteBkgColor: store.fill,
          noteTextColor: store.text,
          noteBorderColor: store.stroke,
          actorBkg: ui.fill,
          actorBorder: ui.stroke,
          actorTextColor: ui.text,
          signalColor: css.muted,
          labelBoxBkgColor: css.background,
          labelBoxBorderColor: css.border,
          labelTextColor: css.foreground,
          relationColor: css.link,
        },
        flowchart: { useMaxWidth: false, htmlLabels: true, curve: "basis", padding: 16 },
        er: { useMaxWidth: false, fontSize: 13 },
        sequence: { useMaxWidth: false, mirrorActors: false },
        securityLevel: "loose",
      };
    }

    function polishMeridianSvg(svg) {
      let out = (svg || "").trim();
      if (!out) return out;
      if (!/class="[^"]*meridian-diagram/.test(out)) {
        out = out.replace(/<svg\\b/, '<svg class="meridian-diagram"');
      }
      out = out.replace(/\\sstyle="max-width:\\s*100%;?"/gi, "");
      out = out.replace(/\\smax-width="[^"]*"/gi, "");
      if (!/role="img"/.test(out)) {
        out = out.replace(/<svg\\b/, '<svg role="img"');
      }
      return out;
    }
  `
}
