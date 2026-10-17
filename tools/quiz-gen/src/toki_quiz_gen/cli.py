"""toki-quiz-gen <spec.yml> --artwork <dir> --out <dir>"""
from __future__ import annotations

import argparse
import datetime as dt
import sys
from pathlib import Path

from . import autocheck, rules
from .artwork import ArtworkError, build_art_dict
from .render import output_name, render
from .spec import SpecError, load_spec
from .verify_logic import report

MAX_BYTES = 1_300_000


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(
        prog="toki-quiz-gen",
        description="Spec file -> validate -> render template -> embed artwork -> self-contained In-App quiz HTML.",
    )
    ap.add_argument("spec", type=Path, help="quiz spec (.yml)")
    ap.add_argument("--artwork", type=Path, required=True,
                    help="directory with {dog,cat}-{band.artwork}.png for every band")
    ap.add_argument("--out", type=Path, required=True, help="output directory")
    ap.add_argument("--date", default=None, help="YYYY-MM-DD for the file name (default: today)")
    ap.add_argument("--max-bytes", type=int, default=MAX_BYTES, help=f"fail if the page is larger (default {MAX_BYTES})")
    ap.add_argument("--skip-autocheck", action="store_true", help="skip the Node-based render check")
    args = ap.parse_args(argv)

    try:
        quiz = load_spec(args.spec)
    except (SpecError, OSError) as e:
        print(f"spec error: {e}", file=sys.stderr)
        return 2

    print(f"== verify_logic: {quiz['id']}")
    if not report(quiz, quiz["id"]):
        print("spec failed validation; nothing written", file=sys.stderr)
        return 1

    try:
        art = build_art_dict(quiz, args.artwork)
        name = output_name(quiz, args.date or dt.date.today())
    except (ArtworkError, SpecError) as e:
        print(f"error: {e}", file=sys.stderr)
        return 2
    page = render(quiz, art)
    size = len(page.encode("utf-8"))
    if size > args.max_bytes:
        print(f"error: page is {size:,} bytes, over the {args.max_bytes:,} limit", file=sys.stderr)
        return 1

    args.out.mkdir(parents=True, exist_ok=True)
    dest = args.out / name
    dest.write_text(page, encoding="utf-8")
    print(f"== wrote {dest} ({size:,} bytes, {len(art)} images embedded)")

    if args.skip_autocheck:
        return 0
    print("== autocheck")
    return autocheck.main([str(dest)])


if __name__ == "__main__":
    sys.exit(main())
