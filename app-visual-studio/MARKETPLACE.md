# Publish to Visual Studio Marketplace

This extension appears in **VS Code** and **Cursor** Extensions search after you publish to the [Visual Studio Marketplace](https://marketplace.visualstudio.com/vscode) (not the Windows Microsoft Store).

**Listing URL (after publish):** `https://marketplace.visualstudio.com/items?itemName=colabcolibri.meridian-vscode`

**Publisher ID in `package.json`:** `colabcolibri` — must match your Marketplace publisher exactly.

---

## One-time setup (you, ~15 minutes)

### 1. Create a publisher

1. Open https://marketplace.visualstudio.com/manage
2. Sign in with your **Microsoft** account (same you use for Azure DevOps if applicable)
3. **Create publisher**
   - **ID:** `colabcolibri` (must match `package.json` → `"publisher"`)
   - **Name:** display name on Marketplace (e.g. `colabcolibri`)
4. Optional: add profile link to https://github.com/colabcolibri

### 2. Create a Personal Access Token (PAT)

1. Open https://dev.azure.com → your profile → **Personal access tokens**
   - Or: https://marketplace.visualstudio.com/manage → **Access tokens** / Azure DevOps link
2. **New Token**
   - **Organization:** **All accessible organizations** (required — otherwise 401)
   - **Scopes:** **Marketplace** → **Manage** (publish)
   - Expiration: 90 days or custom (renew before expiry)
3. **Copy the token** — shown once only

### 3. Log in with vsce (local machine)

```bash
cd app-visual-studio
pnpm install
pnpm exec vsce login colabcolibri
# paste PAT when prompted
```

Alternative (CI or one-shot):

```bash
export VSCE_PAT="<your-pat>"
pnpm publish:marketplace
```

Never commit the PAT. Use GitHub Actions secret `VSCE_PAT` if you automate later.

---

## Publish a new version

1. Bump `"version"` in `package.json` (semver).
2. Update `CHANGELOG.md`.
3. Test locally:

```bash
cd app-visual-studio
pnpm test
pnpm package:vsix
pnpm install:cursor   # smoke in Cursor
```

4. Publish:

```bash
pnpm publish:marketplace
# or: pnpm exec vsce publish --no-dependencies
# or bump: pnpm exec vsce publish patch --no-dependencies
```

5. Verify: search **Meridian** in Extensions (VS Code or Cursor) within a few minutes.

---

## Marketplace listing checklist

| Item | Status |
| ---- | ------ |
| `publisher`: `colabcolibri` | In `package.json` |
| `icon`: 128×128 PNG | `media/icon.png` |
| `LICENSE` in package | `LICENSE` (PolyForm Noncommercial) |
| `README.md` | Used as listing page (keep user-facing intro at top) |
| `CHANGELOG.md` | Recommended |
| `repository` URL | GitHub link on listing |
| Kit dependency | **Bundled in VSIX** — `Meridian: Install Harness` copies `.agent/` into workspace |

### Categories (official VS Code enum)

Microsoft allows only fixed categories. Meridian installs the **agent harness** (`.agent/` — agents, skills, slash commands) and provides board/planning UI.

| Category | Use for Meridian? | Why |
| -------- | ----------------- | --- |
| **AI** | **Yes** | Installs and upgrades the Meridian agent harness in the workspace |
| **Visualization** | **Yes** | Board kanban, Versions/Sprints/Epics tabs |
| **Chat** | **No** | No in-editor chat participant API — agents run via Cursor + kit |
| **Other** | Optional | Omitted — AI + Visualization are enough |

**Discovery:** `displayName`, `keywords` (`harness`, `meridian harness`, `agent harness`), and description.

Current manifest: `"categories": ["AI", "Visualization"]`, `displayName`: **Meridian Harness**.

---

## License note

This extension is **PolyForm Noncommercial 1.0.0**. Marketplace allows noncommercial licenses; the listing should state that the extension is free and noncommercial. The Meridian kit (`.agent/`) ships **inside** the same VSIX.

---

## Cursor vs VS Code

- **VS Code:** installs from Visual Studio Marketplace by default.
- **Cursor:** Extensions → **Meridian Harness** → Install (same Marketplace as VS Code).

---

## Troubleshooting

| Error | Fix |
| ----- | --- |
| `401 Unauthorized` / `403 Forbidden` | PAT scope **Marketplace Manage**; organization **All accessible organizations** |
| `Publisher 'colabcolibri' not found` | Create publisher at marketplace.visualstudio.com/manage with ID `colabcolibri` |
| `Extension version already exists` | Bump `version` in `package.json` |
| `private: true` | Removed from manifest — must not be set for publish |

Official docs: https://code.visualstudio.com/api/working-with-extensions/publishing-extension
