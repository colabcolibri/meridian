#!/usr/bin/env python3
"""SQLite access layer for Meridian 2.0 delivery artifacts."""

from __future__ import annotations

import sqlite3
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
MIGRATIONS_DIR = REPO_ROOT / ".agent" / "migrations"
DB_FILENAME = "meridian.db"
MERIDIAN_DIR = ".meridian"


def resolve_db_path(package_root: str | Path) -> Path:
    return Path(package_root).resolve() / MERIDIAN_DIR / DB_FILENAME


def resolve_migrations_dir() -> Path:
    return MIGRATIONS_DIR


def connect(package_root: str | Path) -> sqlite3.Connection:
    db_path = resolve_db_path(package_root)
    db_path.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    conn.execute("PRAGMA journal_mode = WAL")
    return conn


def list_tables(conn: sqlite3.Connection) -> list[str]:
    rows = conn.execute(
        "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
    ).fetchall()
    return [row["name"] for row in rows]


def applied_migrations(conn: sqlite3.Connection) -> set[str]:
    if "schema_migrations" not in list_tables(conn):
        return set()
    rows = conn.execute("SELECT name FROM schema_migrations").fetchall()
    return {row["name"] for row in rows}


def apply_migrations(package_root: str | Path) -> list[str]:
    """Apply pending SQL migrations. Returns names of newly applied migrations."""
    migrations_dir = resolve_migrations_dir()
    if not migrations_dir.is_dir():
        raise FileNotFoundError(f"Migrations directory not found: {migrations_dir}")

    conn = connect(package_root)
    applied: list[str] = []
    try:
        already = applied_migrations(conn)
        for sql_file in sorted(migrations_dir.glob("*.sql")):
            name = sql_file.name
            if name in already:
                continue
            sql = sql_file.read_text(encoding="utf-8")
            conn.executescript(sql)
            conn.execute(
                "INSERT INTO schema_migrations (name) VALUES (?)",
                (name,),
            )
            applied.append(name)
        conn.commit()
    finally:
        conn.close()
    return applied


def bootstrap(package_root: str | Path) -> str:
    """Bootstrap database; returns status message."""
    if not is_meridian_package(package_root):
        raise ValueError(
            f"Not a Meridian product folder (missing docs/ fingerprint): {package_root}"
        )
    applied = apply_migrations(package_root)
    if applied:
        return f"Applied migrations: {', '.join(applied)}"
    return "Database already up to date"


def is_meridian_package(package_root: str | Path) -> bool:
    docs = Path(package_root).resolve() / "docs"
    if not docs.is_dir():
        return False
    if (docs / "00_scope.md").exists():
        return True
    return any(docs.glob("us/US-*.md"))


def main() -> int:
    import argparse

    parser = argparse.ArgumentParser(description="Meridian SQLite utilities")
    sub = parser.add_subparsers(dest="command", required=True)

    list_parser = sub.add_parser("list-tables", help="List tables in meridian.db")
    list_parser.add_argument("package_root", nargs="?", default="app-desktop")

    migrate_parser = sub.add_parser("migrate", help="Apply pending migrations")
    migrate_parser.add_argument("package_root", nargs="?", default="app-desktop")

    args = parser.parse_args()
    root = args.package_root

    if args.command == "list-tables":
        conn = connect(root)
        try:
            for name in list_tables(conn):
                print(name)
        finally:
            conn.close()
        return 0

    if args.command == "migrate":
        print(bootstrap(root))
        return 0

    return 1


if __name__ == "__main__":
    raise SystemExit(main())
