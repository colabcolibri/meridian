#!/usr/bin/env python3
"""Tests for quality and security validator warnings."""

from __future__ import annotations

import sqlite3
import sys
import tempfile
import unittest
from pathlib import Path

_SCRIPT_DIR = Path(__file__).resolve().parent.parent
if str(_SCRIPT_DIR) not in sys.path:
    sys.path.insert(0, str(_SCRIPT_DIR))

from validate_meridian import (  # noqa: E402
    validate_sqlite_security_refs,
    validate_sqlite_test_strategy_refs,
)


class SecurityRefValidationTest(unittest.TestCase):
    def test_warns_must_security_us_without_02_ref(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            docs = root / "docs"
            docs.mkdir()
            (docs / "02_security.md").write_text(
                "---\nstatus: approved\n---\n# 02\n",
                encoding="utf-8",
            )
            (root / ".meridian").mkdir()
            db = root / ".meridian" / "meridian.db"
            conn = sqlite3.connect(db)
            conn.execute(
                """
                CREATE TABLE user_stories (
                  id TEXT PRIMARY KEY,
                  moscow TEXT,
                  status TEXT,
                  body_markdown TEXT,
                  plan_architecture_refs TEXT
                )
                """
            )
            conn.execute(
                "INSERT INTO user_stories VALUES (?, ?, ?, ?, ?)",
                (
                    "US-0999",
                    "Must",
                    "❌",
                    "### Acceptance\n- [ ] JWT auth on API routes\n",
                    "docs/05_architecture.md",
                ),
            )
            conn.commit()
            conn.close()

            warnings: list[str] = []
            validate_sqlite_security_refs(root, docs, warnings)
            self.assertTrue(
                any("US-0999" in w and "02_security" in w for w in warnings)
            )


class TestStrategyRefValidationTest(unittest.TestCase):
    def test_warns_must_tests_required_without_10_ref(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            docs = root / "docs"
            docs.mkdir()
            (docs / "10_test_strategy.md").write_text(
                "---\nstatus: approved\n---\n# 10\n",
                encoding="utf-8",
            )
            (root / ".meridian").mkdir()
            db = root / ".meridian" / "meridian.db"
            conn = sqlite3.connect(db)
            conn.execute(
                """
                CREATE TABLE user_stories (
                  id TEXT PRIMARY KEY,
                  moscow TEXT,
                  status TEXT,
                  body_markdown TEXT,
                  plan_architecture_refs TEXT,
                  tests TEXT
                )
                """
            )
            conn.execute(
                "INSERT INTO user_stories VALUES (?, ?, ?, ?, ?, ?)",
                (
                    "US-0998",
                    "Must",
                    "❌",
                    "body",
                    "docs/05_architecture.md",
                    "required",
                ),
            )
            conn.commit()
            conn.close()

            warnings: list[str] = []
            validate_sqlite_test_strategy_refs(root, docs, warnings)
            self.assertTrue(
                any("US-0998" in w and "10_test_strategy" in w for w in warnings)
            )


if __name__ == "__main__":
    unittest.main()
