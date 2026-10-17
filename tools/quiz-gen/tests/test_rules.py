import copy
import glob
from pathlib import Path

import pytest

from toki_quiz_gen import rules
from toki_quiz_gen.spec import SpecError, load_spec, validate_structure

from conftest import SPECS


def by_name(results):
    return {r.name: r for r in results}


@pytest.mark.parametrize("path", sorted(glob.glob(str(SPECS / "*.yml"))), ids=lambda p: Path(p).stem)
def test_every_shipped_spec_passes_all_rules(path):
    results = rules.run_all(load_spec(path))
    assert all(r.ok for r in results), [r for r in results if not r.ok]


def test_coverage_reports_gap_and_overlap(quiz):
    q = copy.deepcopy(quiz)
    q["BANDS"][1]["min"] += 1            # opens a gap after band 0
    q["BANDS"][3]["min"] -= 2            # overlaps band 2
    res = by_name(rules.check_band_coverage(q))
    r = res["band-coverage/dog"]
    assert not r.ok and "gap=1" in r.summary and "overlap=2" in r.summary
    assert "DOES NOT cover" in r.summary


def test_coverage_detects_range_not_reached(quiz):
    q = copy.deepcopy(quiz)
    q["BANDS"][-1]["max"] = 30           # scores 31-32 reachable but unowned
    r = by_name(rules.check_band_coverage(q))["band-coverage/cat"]
    assert not r.ok and "31-32" in r.problems[0]


def test_coverage_species_parity(quiz):
    q = copy.deepcopy(quiz)
    q["CAT_QUESTIONS"][0]["opts"][0]["s"] = 0
    assert not by_name(rules.check_band_coverage(q))["band-coverage/species-parity"].ok


@pytest.mark.parametrize("text", [
    "Older soul (+older)", "Playful (–younger)", "Naps all day (3)", "Naps all day (+2)",
    "Naps all day (−1)", "Naps all day (-1)", "Worth 3 pts", "worth 1 point",
])
def test_score_leak_rejects(quiz, text):
    q = copy.deepcopy(quiz)
    q["DOG_QUESTIONS"][2]["opts"][1]["t"] = text
    r = rules.check_no_score_leak(q)
    assert not r.ok and "leaks scoring" in r.problems[0]


@pytest.mark.parametrize("text", ["Waits 2 minutes, then sighs", "Back in 5 minutes", "Slow-blinks back", "A 3am sprint"])
def test_score_leak_accepts_plain_behaviour(quiz, text):
    q = copy.deepcopy(quiz)
    q["CAT_QUESTIONS"][0]["opts"][0]["t"] = text
    assert rules.check_no_score_leak(q).ok


def _strip(q, side, pattern):
    import re
    for qu in q[side]:
        qu["q"] = re.sub(pattern, "thing", qu["q"], flags=re.I)
        for o in qu["opts"]:
            o["t"] = re.sub(pattern, "thing", o["t"], flags=re.I)


def test_species_imagery_dog_side_fails_without_dog_words(quiz):
    q = copy.deepcopy(quiz)
    _strip(q, "DOG_QUESTIONS", r"leash|park|recall|walk|fetch|bark")
    r = rules.check_species_imagery(q)
    assert not r.ok and "dog questions" in r.problems[0] and len(r.problems) == 1


def test_species_imagery_cat_side_fails_without_cat_words(quiz):
    q = copy.deepcopy(quiz)
    _strip(q, "CAT_QUESTIONS", r"litter|perch|slow[ -]blink|window|high ground")
    r = rules.check_species_imagery(q)
    assert not r.ok and "cat questions" in r.problems[0] and len(r.problems) == 1


def test_species_imagery_word_boundaries(quiz):
    q = copy.deepcopy(quiz)
    _strip(q, "DOG_QUESTIONS", r"leash|park|recall|walk|fetch|bark")
    q["DOG_QUESTIONS"][0]["q"] = "3am parkour"       # 'park' inside 'parkour' is not dog imagery
    assert not rules.check_species_imagery(q).ok
    q2 = copy.deepcopy(quiz)
    _strip(q2, "CAT_QUESTIONS", r"litter|perch|slow[ -]blink|window|high ground")
    q2["CAT_QUESTIONS"][0]["q"] = "A specific traffic jam"   # 'fic' inside words is not FIC
    assert not rules.check_species_imagery(q2).ok
    q2["CAT_QUESTIONS"][0]["q"] = "Signs of FIC"
    assert rules.check_species_imagery(q2).ok


def test_structure_flags_missing_prof_and_desc(quiz):
    q = copy.deepcopy(quiz)
    del q["CAT_QUESTIONS"][1]["opts"][0]["prof"]
    q["BANDS"][0]["descCat"] = []
    r = rules.check_structure(q)
    assert not r.ok and len(r.problems) == 2


def test_validate_structure_collects_errors(quiz):
    q = copy.deepcopy(quiz)
    del q["h1"]
    q["BANDS"][0]["theme"] = "Z"
    q["DOG_QUESTIONS"].pop()
    q["wat"] = 1
    with pytest.raises(SpecError) as e:
        validate_structure(q)
    msg = str(e.value)
    assert "missing required field 'h1'" in msg and "unknown top-level field 'wat'" in msg
    q2 = copy.deepcopy(quiz)
    q2["BANDS"][0]["theme"] = "Z"
    q2["DOG_QUESTIONS"].pop()
    with pytest.raises(SpecError, match="theme must be one of.*same length|same length.*theme"):
        validate_structure(q2)


def test_validate_rejects_bad_option(quiz):
    q = copy.deepcopy(quiz)
    q["DOG_QUESTIONS"][0]["opts"][0]["s"] = "3"
    q["CAT_QUESTIONS"][0]["opts"][0]["prof"] = {"k": "x"}
    with pytest.raises(SpecError) as e:
        validate_structure(q)
    assert "integer s" in str(e.value) and "prof" in str(e.value)
