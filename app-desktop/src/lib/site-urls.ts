/** Public Meridian repo — shown in demo header and external links. */
export const MERIDIAN_GITHUB_URL = "https://github.com/colabcolibri/meridian"

/** Asset paths under `public/`, respecting Vite `base` (e.g. GitHub Pages `/meridian/`). */
export function publicAssetUrl(assetPath: string): string {
  const path = assetPath.replace(/^\//, "")
  return `${import.meta.env.BASE_URL}${path}`
}
