"""Quiz rules: scoring-band coverage (handover §B.5 verify_logic) plus the content rules added in PAW-166."""
from __future__ import annotations

import json
import re
from dataclasses import dataclass, field

SPECIES = (("dog", "DOG_QUESTIONS"), ("cat", "CAT_QUESTIONS"))

# Option text may only describe behaviour; any score / direction hint leaks the scoring.
SCORE_LEAK_RE = re.compile(
    r"\+\s*older|[–—−-]\s*younger"          # "+older" / "–younger"
    r"|\(\s*[+−–-]?\s*\d+\s*\)"             # "(3)" "(+2)" "(−1)"
    r"|\b\d+\s*(?:pts?|points?)\b",         # "3 pts"
    re.IGNORECASE,
)
# Whole words (plus plain inflections) so "parkour" is not "park" and "specific" is not "FIC"; FIC (feline idiopathic
# cystitis) is an acronym, so it is matched case-sensitively.
_INFLECT = r"(?:s|es|ed|ing|ers?)?\b"
DOG_IMAGERY_RE = re.compile(r"\b(?:leash|park|recall|walk|fetch|bark)" + _INFLECT, re.IGNORECASE)
CAT_IMAGERY_RE = re.compile(
    r"(?i:\b(?:litter|perch|slow[ -]blink|window|high ground)" + _INFLECT + r")|\bFIC\b"
)


@dataclass
class Result:
    name: str
    ok: bool
    summary: str
    problems: list[str] = field(default_factory=list)


def score_range(quiz: dict, side: str) -> tuple[int, int]:
    lo = hi = quiz["scoreBase"]
    for q in quiz[side]:
        ss = [o["s"] for o in q["opts"]]
        lo += min(ss)
        hi += max(ss)
    return lo, hi


def check_band_coverage(quiz: dict) -> list[Result]:
    """Closed-interval bands must leave no gap, no overlap, and cover [scoreBase+Σmin, scoreBase+Σmax]."""
    out = []
    for species, side in SPECIES:
        lo, hi = score_range(quiz, side)
        hits = {n: [] for n in range(lo, hi + 1)}
        for b in quiz["BANDS"]:
            for n in range(max(b["min"], lo), min(b["max"], hi) + 1):
                hits[n].append(b["name"])
        gaps = [n for n, v in hits.items() if not v]
        overlaps = [n for n, v in hits.items() if len(v) > 1]
        problems = []
        if gaps:
            problems.append(f"{species}: scores with no band: {_ranges(gaps)}")
        if overlaps:
            problems.append(f"{species}: scores in more than one band: {_ranges(overlaps)}")
        covers = not gaps
        summary = (
            f"{species}: range [{lo}, {hi}] · {len(quiz['BANDS'])} bands · gap={len(gaps)}, overlap={len(overlaps)}, "
            + ("covers full [min, max]" if covers else "DOES NOT cover full [min, max]")
        )
        out.append(Result(f"band-coverage/{species}", not problems, summary, problems))
    dog, cat = score_range(quiz, "DOG_QUESTIONS"), score_range(quiz, "CAT_QUESTIONS")
    if dog != cat:
        out.append(Result("band-coverage/species-parity", False, f"dog range {dog} != cat range {cat}",
                          [f"dog range {list(dog)} differs from cat range {list(cat)}"]))
    return out


def _ranges(nums: list[int]) -> str:
    runs, start, prev = [], nums[0], nums[0]
    for n in nums[1:]:
        if n != prev + 1:
            runs.append((start, prev))
            start = n
        prev = n
    runs.append((start, prev))
    return ", ".join(str(a) if a == b else f"{a}-{b}" for a, b in runs)


def check_structure(quiz: dict) -> Result:
    """Same question count per species, every option has s + prof, every band has descDog and descCat."""
    problems = []
    if len(quiz["DOG_QUESTIONS"]) != len(quiz["CAT_QUESTIONS"]):
        problems.append("dog and cat question counts differ")
    for species, side in SPECIES:
        for i, q in enumerate(quiz[side], 1):
            for j, o in enumerate(q["opts"], 1):
                if not isinstance(o.get("s"), int):
                    problems.append(f"{species} Q{i} option {j}: missing s")
                p = o.get("prof")
                if not (isinstance(p, dict) and p.get("k") and p.get("v")):
                    problems.append(f"{species} Q{i} option {j}: missing prof")
    for b in quiz["BANDS"]:
        for k in ("descDog", "descCat"):
            if not b.get(k):
                problems.append(f"band {b.get('name')!r}: missing {k}")
    n = len(quiz["DOG_QUESTIONS"])
    return Result("structure", not problems,
                  f"{n} questions per species · {len(quiz['BANDS'])} bands, each with descDog + descCat, every option has s + prof",
                  problems)


def check_no_score_leak(quiz: dict) -> Result:
    """NEW 1: option text must not reveal scoring."""
    problems = []
    n = 0
    for species, side in SPECIES:
        for i, q in enumerate(quiz[side], 1):
            for j, o in enumerate(q["opts"], 1):
                n += 1
                m = SCORE_LEAK_RE.search(o["t"])
                if m:
                    problems.append(f"{species} Q{i} option {j} leaks scoring ({m.group()!r}): {o['t']}")
    return Result("no-score-leak", not problems, f"scanned {n} options, no scoring hints", problems)


def check_species_imagery(quiz: dict) -> Result:
    """NEW 2: dog side needs dog imagery, cat side needs cat imagery (across question stems + options)."""
    def side_text(side):
        return " ".join(q["q"] + " " + " ".join(o["t"] for o in q["opts"]) for q in quiz[side])

    dog_hits = sorted({m.group().lower() for m in DOG_IMAGERY_RE.finditer(side_text("DOG_QUESTIONS"))})
    cat_hits = sorted({m.group().lower() for m in CAT_IMAGERY_RE.finditer(side_text("CAT_QUESTIONS"))})
    problems = []
    if not dog_hits:
        problems.append("dog questions contain none of: leash|park|recall|walk|fetch|bark")
    if not cat_hits:
        problems.append("cat questions contain none of: litter|perch|slow blink|window|high ground|FIC")
    return Result("species-imagery", not problems,
                  f"dog imagery {dog_hits} · cat imagery {cat_hits}", problems)


def run_all(quiz: dict) -> list[Result]:
    return [*check_band_coverage(quiz), check_structure(quiz), check_no_score_leak(quiz), check_species_imagery(quiz)]


def extract_quiz_from_html(html: str) -> dict:
    """Read the QUIZ object back out of a generated page (it is embedded as plain JSON)."""
    marker = "const QUIZ = "
    i = html.find(marker)
    if i < 0:
        raise ValueError("no 'const QUIZ = ' found in HTML")
    obj, _ = json.JSONDecoder().raw_decode(html[i + len(marker):])
    return obj
