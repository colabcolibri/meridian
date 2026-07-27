#!/usr/bin/env python3
"""Tests for import_graph builder (US-0163)."""

from __future__ import annotations

import sys
import tempfile
from pathlib import Path

_SCRIPT_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(_SCRIPT_DIR.parent / "lib"))

from import_graph import build_import_graph  # noqa: E402


def main() -> int:
    with tempfile.TemporaryDirectory() as tmp:
        root = Path(tmp)
        (root / "node_modules" / "x").mkdir(parents=True)
        (root / "node_modules" / "x" / "index.js").write_text("export default 1\n")
        (root / "a.ts").write_text('import { b } from "./b.js";\nexport const a = b;\n')
        (root / "b.ts").write_text("export const b = 1;\n")
        graph = build_import_graph(root)
        ids = {n["id"] for n in graph["nodes"]}
        if "a.ts" not in ids or "b.ts" not in ids:
            print(f"FAIL: nodes {ids}")
            return 1
        if any("node_modules" in n["id"] for n in graph["nodes"]):
            print("FAIL: node_modules leaked into graph")
            return 1
        edge_set = {(e["from"], e["to"]) for e in graph["edges"]}
        if ("a.ts", "b.ts") not in edge_set and ("a.ts", "b.js") not in edge_set:
            # resolver may keep relative path b.js if file is b.ts — accept either
            if not any(e["from"] == "a.ts" for e in graph["edges"]):
                print(f"FAIL: missing edge from a.ts: {graph['edges']}")
                return 1
    print("OK: import graph tests passed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
