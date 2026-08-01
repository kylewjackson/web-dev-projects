"""Command-line entry point.

Commands are introduced in later milestones. Keeping the entry point executable
now verifies packaging without prematurely implementing application behavior.
"""

from __future__ import annotations

import argparse
from collections.abc import Sequence


def build_parser() -> argparse.ArgumentParser:
    """Build the application's top-level argument parser."""
    return argparse.ArgumentParser(
        prog="reddit-archiver",
        description="Archive complete Reddit discussion threads.",
    )


def main(argv: Sequence[str] | None = None) -> int:
    """Run the command-line application."""
    parser = build_parser()
    parser.parse_args(argv)
    parser.print_help()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
