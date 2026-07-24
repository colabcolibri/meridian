/**
 * Post-process Mermaid SVG output for Meridian viewer (no DOM required).
 */

export function polishMeridianSvg(svg: string): string {
  let out = svg.trim()
  if (!out) {
    return out
  }

  if (!/\bclass="[^"]*meridian-diagram/.test(out)) {
    out = out.replace(/<svg\b/, '<svg class="meridian-diagram"')
  }

  // Mermaid often sets max-width:100% — we handle sizing via pan/zoom viewport.
  out = out.replace(/\sstyle="max-width:\s*100%;?"/gi, "")
  out = out.replace(/\smax-width="[^"]*"/gi, "")

  if (!/role="img"/.test(out)) {
    out = out.replace(/<svg\b/, '<svg role="img"')
  }

  return out
}
