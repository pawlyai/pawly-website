"""verify_logic: band coverage + structure + content rules, for a spec (.yml) or a generated page (.html)."""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

from . import rules
from .spec import SpecError, load_spec


def load_quiz(path: Path) -> dict:
    if path.suffix.lower() in (".html", ".htm"):
        return rules.extract_quiz_from_html(path.read_text(encoding="utf-8"))
    return load_spec(path)


def report(quiz: dict, label: str, out=None) -> bool:
    out = out or sys.stdout
    ok = True
    for r in rules.run_all(quiz):
        print(f"[{label}] {'PASS' if r.ok else 'FAIL'} {r.name}: {r.summary}", file=out)
        for p in r.problems:
            print(f"    - {p}", file=out)
        ok &= r.ok
    return ok


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(prog="verify_logic", description=__doc__)
    ap.add_argument("files", nargs="+", type=Path, help="spec .yml or generated .html")
    args = ap.parse_args(argv)
    ok = True
    for f in args.files:
        try:
            quiz = load_quiz(f)
        except (SpecError, ValueError, OSError) as e:
            print(f"[{f.name}] FAIL load: {e}")
            ok = False
            continue
        ok &= report(quiz, quiz.get("id", f.stem))
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
