"""Static import graph helpers — normalize analyzer output into stable JSON."""

from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any

DEFAULT_EXCLUDES = frozenset(
    {
        "node_modules",
        "dist",
        "out",
        "build",
        ".git",
        ".meridian",
        "coverage",
        ".venv",
        "venv",
        "__pycache__",
        ".turbo",
        ".next",
    }
)

_TS_IMPORT_RE = re.compile(
    r"""(?:import\s+(?:type\s+)?(?:[^"'`]+?\s+from\s+)?|export\s+(?:type\s+)?[^"'`]*?\s+from\s+|require\s*\(\s*)['"]([^'"]+)['"]""",
    re.MULTILINE,
)
_PY_IMPORT_RE = re.compile(
    r"""^(?:from\s+([\w.]+)\s+import\s+|import\s+([\w.]+))""",
    re.MULTILINE,
)

SOURCE_SUFFIXES = {".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".py"}


def should_skip_dir(name: str, excludes: frozenset[str] = DEFAULT_EXCLUDES) -> bool:
    return name in excludes or name.startswith(".")


def iter_source_files(root: Path, excludes: frozenset[str] = DEFAULT_EXCLUDES) -> list[Path]:
    files: list[Path] = []
    root = root.resolve()
    for path in root.rglob("*"):
        if not path.is_file():
            continue
        if path.suffix not in SOURCE_SUFFIXES:
            continue
        rel_parts = path.relative_to(root).parts
        if any(should_skip_dir(part, excludes) for part in rel_parts[:-1]):
            continue
        files.append(path)
    return sorted(files)


def _resolve_relative_import(importer: Path, spec: str, root: Path) -> str | None:
    if not spec.startswith("."):
        return f"ext:{spec}"
    base = (importer.parent / spec).resolve()
    stem = base
    if base.suffix in {".js", ".jsx", ".mjs", ".cjs", ".ts", ".tsx"}:
        stem = base.with_suffix("")
    candidates = [
        base,
        stem.with_suffix(".ts"),
        stem.with_suffix(".tsx"),
        stem.with_suffix(".js"),
        stem.with_suffix(".jsx"),
        stem.with_suffix(".mjs"),
        stem.with_suffix(".py"),
        Path(str(base) + ".ts"),
        Path(str(base) + ".js"),
        base / "index.ts",
        base / "index.tsx",
        base / "index.js",
        base / "__init__.py",
    ]
    for cand in candidates:
        if cand.is_file():
            try:
                return str(cand.relative_to(root)).replace("\\", "/")
            except ValueError:
                return str(cand)
    try:
        return str(base.relative_to(root)).replace("\\", "/")
    except ValueError:
        return str(base)


def extract_imports(path: Path, root: Path) -> list[str]:
    text = path.read_text(encoding="utf-8", errors="replace")
    targets: list[str] = []
    if path.suffix == ".py":
        for match in _PY_IMPORT_RE.finditer(text):
            mod = match.group(1) or match.group(2)
            if not mod:
                continue
            if mod.startswith("."):
                resolved = _resolve_relative_import(path, mod.replace(".", "/"), root)
            else:
                resolved = f"ext:{mod.split('.')[0]}"
            if resolved:
                targets.append(resolved)
        return targets
    for match in _TS_IMPORT_RE.finditer(text):
        spec = match.group(1)
        resolved = _resolve_relative_import(path, spec, root)
        if resolved:
            targets.append(resolved)
    return targets


def build_import_graph(
    root: Path,
    *,
    excludes: frozenset[str] = DEFAULT_EXCLUDES,
) -> dict[str, Any]:
    root = root.resolve()
    files = iter_source_files(root, excludes)
    nodes: dict[str, dict[str, str]] = {}
    edges: list[dict[str, str]] = []
    seen_edges: set[tuple[str, str]] = set()

    for path in files:
        node_id = str(path.relative_to(root)).replace("\\", "/")
        nodes[node_id] = {"id": node_id, "label": path.name}
        for target in extract_imports(path, root):
            if target.startswith("ext:"):
                continue
            if target not in nodes:
                nodes[target] = {"id": target, "label": Path(target).name}
            key = (node_id, target)
            if key in seen_edges:
                continue
            seen_edges.add(key)
            edges.append({"from": node_id, "to": target})

    node_list = sorted(nodes.values(), key=lambda n: n["id"])
    edge_list = sorted(edges, key=lambda e: (e["from"], e["to"]))
    return {
        "nodes": node_list,
        "edges": edge_list,
        "meta": {
            "root": str(root),
            "nodeCount": len(node_list),
            "edgeCount": len(edge_list),
            "excludes": sorted(excludes),
        },
    }


def graph_to_json(graph: dict[str, Any]) -> str:
    return json.dumps(graph, indent=2, ensure_ascii=False, sort_keys=True) + "\n"
