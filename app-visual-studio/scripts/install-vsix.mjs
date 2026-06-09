#!/usr/bin/env node
/**
 * Install the latest meridian-vscode-*.vsix via cursor or code CLI.
 * Resolves the CLI when it is not on PATH (common on fresh macOS installs).
 */
import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, statSync } from "node:fs";
import { homedir, platform } from "node:os";
import { join, resolve } from "node:path";

const IDE = process.argv[2];

if (IDE !== "cursor" && IDE !== "code") {
  console.error("Usage: node scripts/install-vsix.mjs <cursor|code>");
  process.exit(1);
}

function onPath(command) {
  const isWin = platform() === "win32";
  const result = spawnSync(isWin ? "where" : "command", isWin ? [command] : ["-v", command], {
    encoding: "utf8",
    shell: isWin,
  });
  if (result.status !== 0) {
    return null;
  }
  const line = result.stdout.trim().split(/\r?\n/)[0]?.trim();
  return line && existsSync(line) ? line : null;
}

function cliCandidates(name) {
  const home = homedir();
  const os = platform();

  if (name === "cursor") {
    if (os === "darwin") {
      return [
        join(home, "Applications/Cursor.app/Contents/Resources/app/bin/cursor"),
        "/Applications/Cursor.app/Contents/Resources/app/bin/cursor",
      ];
    }
    if (os === "win32") {
      const localAppData = process.env.LOCALAPPDATA ?? join(home, "AppData", "Local");
      return [
        join(localAppData, "Programs/cursor/resources/app/bin/cursor.cmd"),
        join(localAppData, "Programs/Cursor/resources/app/bin/cursor.cmd"),
      ];
    }
    return [
      "/usr/bin/cursor",
      "/usr/local/bin/cursor",
      join(home, ".local/bin/cursor"),
    ];
  }

  if (os === "darwin") {
    return [
      join(home, "Applications/Visual Studio Code.app/Contents/Resources/app/bin/code"),
      "/Applications/Visual Studio Code.app/Contents/Resources/app/bin/code",
    ];
  }
  if (os === "win32") {
    const localAppData = process.env.LOCALAPPDATA ?? join(home, "AppData", "Local");
    const programFiles = process.env.ProgramFiles ?? "C:\\Program Files";
    return [
      join(localAppData, "Programs/Microsoft VS Code/bin/code.cmd"),
      join(programFiles, "Microsoft VS Code/bin/code.cmd"),
    ];
  }
  return ["/usr/bin/code", "/usr/local/bin/code", join(home, ".local/bin/code")];
}

function resolveCli(name) {
  return onPath(name) ?? cliCandidates(name).find((path) => existsSync(path)) ?? null;
}

function latestVsix(cwd) {
  return readdirSync(cwd)
    .filter((file) => file.startsWith("meridian-vscode-") && file.endsWith(".vsix"))
    .map((file) => ({ file, mtime: statSync(join(cwd, file)).mtimeMs }))
    .sort((a, b) => b.mtime - a.mtime)[0]?.file;
}

const cwd = process.cwd();
const cli = resolveCli(IDE);
const vsix = latestVsix(cwd);

if (!cli) {
  console.error(`Could not find ${IDE} CLI on PATH or in default install locations.`);
  if (IDE === "cursor") {
    console.error("");
    console.error("Fix options:");
    console.error("  1. Cursor → Cmd/Ctrl+Shift+P → Shell Command: Install 'cursor' command in PATH");
    console.error("  2. Install Cursor.app (macOS: /Applications/Cursor.app)");
    console.error("  3. Extensions → ⋯ → Install from VSIX… → pick meridian-vscode-*.vsix");
  } else {
    console.error("");
    console.error("Fix options:");
    console.error("  1. VS Code → Cmd/Ctrl+Shift+P → Shell Command: Install 'code' command in PATH");
    console.error("  2. Extensions → ⋯ → Install from VSIX… → pick meridian-vscode-*.vsix");
  }
  process.exit(1);
}

if (!vsix) {
  console.error("No meridian-vscode-*.vsix found. Run pnpm package:vsix first.");
  process.exit(1);
}

const vsixPath = resolve(cwd, vsix);
console.error(`Using ${IDE} CLI: ${cli}`);
console.error(`Installing: ${vsix}`);

const result = spawnSync(cli, ["--install-extension", vsixPath, "--force"], {
  stdio: "inherit",
});

process.exit(result.status ?? 1);
