"""autocheck: compile the page's <script>, then drive it end to end for dog and cat with a stub DOM (Node)."""
from __future__ import annotations

import argparse
import json
import shutil
import subprocess
import sys
from importlib import resources
from pathlib import Path

from .rules import extract_quiz_from_html, score_range


def run_harness(html_path: Path) -> dict:
    node = shutil.which("node")
    if not node:
        raise RuntimeError("autocheck needs Node.js (`node`) on PATH")
    harness = resources.files("toki_quiz_gen").joinpath("autocheck_harness.cjs")
    with resources.as_file(harness) as hp:
        r = subprocess.run([node, str(hp), str(html_path)], capture_output=True, text=True, timeout=120)
    if r.returncode != 0:
        raise RuntimeError(f"node harness crashed: {r.stderr.strip()[:500]}")
    return json.loads(r.stdout)


def evaluate(html_path: Path) -> tuple[bool, list[str], list[str]]:
    """Returns (ok, summary_lines, problems)."""
    html = html_path.read_text(encoding="utf-8")
    quiz = extract_quiz_from_html(html)
    rep = run_harness(html_path)
    problems: list[str] = []
    if rep["compile"] != "ok":
        return False, [f"compile {rep['compile']}"], [f"script does not compile: {rep['compile']}"]

    stems = {"dog": [q["q"] for q in quiz["DOG_QUESTIONS"]], "cat": [q["q"] for q in quiz["CAT_QUESTIONS"]]}
    sides = {"dog": "DOG_QUESTIONS", "cat": "CAT_QUESTIONS"}
    art_ok = solar_ok = emoji_free = True
    for sp, runs in rep["runs"].items():
        lo, hi = score_range(quiz, sides[sp])
        want = {"min": lo, "max": hi}
        for pick, r in runs.items():
            tag = f"{sp}/{pick}"
            if "error" in r:
                problems.append(f"{tag}: script threw: {r['error'].splitlines()[0]}")
                continue
            if r["answered"] != r["total"] or not r["sessionOk"]:
                problems.append(f"{tag}: flow incomplete (answered {r['answered']}/{r['total']}, session logged={r['sessionOk']})")
            if r["stems"] != stems[sp]:
                problems.append(f"{tag}: served questions that are not the {sp} set")
            if pick in want:
                if r["score"] != want[pick]:
                    problems.append(f"{tag}: score {r['score']} != expected {want[pick]}")
                exp = next((b["name"] for b in quiz["BANDS"] if b["min"] <= want[pick] <= b["max"]), None)
                if r["band"] != exp:
                    problems.append(f"{tag}: landed in {r['band']!r}, expected {exp!r}")
            if r["resultLength"] == 0:
                problems.append(f"{tag}: empty result")
            if not (r["hasResultArt"] and r["hasArtSrc"]):
                art_ok = False
                problems.append(f"{tag}: result lacks .result-art with an embedded image")
            if not r["hasSolar"]:
                solar_ok = False
                problems.append(f"{tag}: result has no ic- solar icon")
            if r["hasEmoji"]:
                emoji_free = False
                problems.append(f"{tag}: result contains emoji")
    dog, cat = rep["runs"]["dog"].get("mix", {}), rep["runs"]["cat"].get("mix", {})
    differ = bool(dog.get("about")) and bool(cat.get("about")) and dog["about"] != cat["about"]
    if not differ:
        problems.append("dog and cat About text are identical (or empty)")

    ok = not problems
    n_runs = sum(len(v) for v in rep["runs"].values())
    summary = [
        "compile ok",
        f"flow ok ({n_runs} runs: dog+cat × min/max/mix)" if not any("flow" in p or "script threw" in p or "score" in p or "landed" in p for p in problems) else "flow FAIL",
        " · ".join([
            "result-art ok" if art_ok else "result-art FAIL",
            "solar icons ok" if solar_ok else "solar icons FAIL",
            "no emoji" if emoji_free else "EMOJI FOUND",
            "dog ≠ cat" if differ else "dog = cat (FAIL)",
        ]),
    ]
    return ok, summary, problems


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(prog="autocheck", description=__doc__)
    ap.add_argument("files", nargs="+", type=Path, help="generated quiz .html")
    args = ap.parse_args(argv)
    all_ok = True
    for f in args.files:
        try:
            ok, summary, problems = evaluate(f)
        except (RuntimeError, ValueError, OSError, subprocess.TimeoutExpired) as e:
            print(f"[{f.name}] FAIL: {e}")
            all_ok = False
            continue
        print(f"[{f.name}] {'PASS' if ok else 'FAIL'}")
        for line in summary:
            print(f"    {line}")
        for p in problems:
            print(f"    - {p}")
        all_ok &= ok
    return 0 if all_ok else 1


if __name__ == "__main__":
    sys.exit(main())
