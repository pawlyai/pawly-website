import json
import shutil
import subprocess
import sys

import pytest
import yaml

from toki_quiz_gen import autocheck, cli, rules
from toki_quiz_gen.artwork import ArtworkError, build_art_dict
from toki_quiz_gen.render import output_name, render
from toki_quiz_gen.spec import SpecError, load_questions_csv, load_spec, pascal_slug

from conftest import ART, SPECS, needs_node


def test_output_name_pascal_slug_and_date(quiz):
    assert output_name(quiz, "2026-10-17") == "Toki_Quiz_ElementalMysticism_InApp_EN_2026-10-17.html"
    del quiz["slug"]
    assert pascal_slug(quiz) == "ElementalMysticism"
    with pytest.raises(SpecError):
        output_name(quiz, "17-10-2026")
    quiz["slug"] = "bad slug"
    with pytest.raises(SpecError):
        pascal_slug(quiz)


def test_render_roundtrip_and_script_safety(quiz):
    quiz["disclaimer"] = "x </script><b>{{TITLE}}</b>"
    html = render(quiz, {"dog-a": "data:image/jpeg;base64,AAAA"})
    assert html.count("{{SPEC_JSON}}") == 0 and html.count("{{ART_JSON}}") == 0
    assert html.count("</script>") == 1
    assert rules.extract_quiz_from_html(html)["disclaimer"] == quiz["disclaimer"]


@needs_node
def test_cli_end_to_end(tmp_path, capsys):
    rc = cli.main([str(SPECS / "elemental_mysticism.yml"), "--artwork", str(ART), "--out", str(tmp_path), "--date", "2026-10-17"])
    out = capsys.readouterr().out
    assert rc == 0, out
    page = tmp_path / "Toki_Quiz_ElementalMysticism_InApp_EN_2026-10-17.html"
    assert page.stat().st_size <= 1_300_000
    text = page.read_text()
    assert 'src="http' not in text and "url(http" not in text   # no external image dependency
    assert "result-art ok · solar icons ok · no emoji · dog ≠ cat" in out
    assert "gap=0, overlap=0, covers full [min, max]" in out


def test_cli_refuses_invalid_spec_and_writes_nothing(tmp_path, quiz, capsys):
    quiz["BANDS"][1]["min"] += 1
    spec = tmp_path / "bad.yml"
    spec.write_text(yaml.safe_dump(quiz, allow_unicode=True))
    rc = cli.main([str(spec), "--artwork", str(ART), "--out", str(tmp_path / "o"), "--skip-autocheck"])
    assert rc == 1 and not (tmp_path / "o").exists()


def test_cli_missing_artwork_lists_every_file(tmp_path, capsys):
    (tmp_path / "art").mkdir()
    rc = cli.main([str(SPECS / "elemental_mysticism.yml"), "--artwork", str(tmp_path / "art"), "--out", str(tmp_path / "o")])
    err = capsys.readouterr().err
    assert rc == 2 and "dog-fire-spirit.png" in err and "cat-water-spirit.png" in err


def test_cli_rejects_oversize(tmp_path, capsys):
    rc = cli.main([str(SPECS / "elemental_mysticism.yml"), "--artwork", str(ART), "--out", str(tmp_path), "--max-bytes", "1000"])
    assert rc == 1 and not list(tmp_path.glob("*.html"))


def test_cli_bad_yaml(tmp_path, capsys):
    p = tmp_path / "x.yml"
    p.write_text("a: [unclosed")
    assert cli.main([str(p), "--artwork", str(ART), "--out", str(tmp_path)]) == 2


def test_artwork_missing_dir(tmp_path, quiz):
    with pytest.raises(ArtworkError):
        build_art_dict(quiz, tmp_path / "nope")


@pytest.mark.skipif(shutil.which("sips") is None, reason="sips (macOS) not available")
def test_artwork_embeds_jpeg_data_uris(quiz):
    art = build_art_dict(quiz, ART)
    assert len(art) == 10 and all(v.startswith("data:image/jpeg;base64,") for v in art.values())


def test_csv_adapter(tmp_path, quiz):
    csv_text = (
        "species,tag,q,t,s,prof_k,prof_v\n"
        "dog,Zen,Q1 on the walk,a,1,k,low\ndog,Zen,Q1 on the walk,b,2,k,high\n"
        "cat,Zen,Q1 at the window,a,1,k,low\ncat,Zen,Q1 at the window,b,2,k,high\n"
    )
    (tmp_path / "q.csv").write_text(csv_text)
    dog, cat = load_questions_csv(tmp_path / "q.csv")
    assert len(dog) == 1 and len(cat) == 1 and [o["s"] for o in dog[0]["opts"]] == [1, 2]
    quiz.pop("DOG_QUESTIONS"), quiz.pop("CAT_QUESTIONS")
    quiz["questionsCsv"] = "q.csv"
    quiz["BANDS"] = [dict(quiz["BANDS"][0], min=2, max=4)]
    (tmp_path / "s.yml").write_text(yaml.safe_dump(quiz, allow_unicode=True))
    assert len(load_spec(tmp_path / "s.yml")["DOG_QUESTIONS"]) == 1


def test_csv_adapter_rejects(tmp_path):
    (tmp_path / "a.csv").write_text("species,tag,q,t,s,prof_k,prof_v\nbird,T,Q,t,1,k,v\n")
    with pytest.raises(SpecError, match="species"):
        load_questions_csv(tmp_path / "a.csv")
    (tmp_path / "b.csv").write_text("species,tag,q,t,s,prof_k,prof_v\ndog,T,Q,t,x,k,v\n")
    with pytest.raises(SpecError, match="integer"):
        load_questions_csv(tmp_path / "b.csv")
    (tmp_path / "c.csv").write_text("a,b\n1,2\n")
    with pytest.raises(SpecError, match="columns"):
        load_questions_csv(tmp_path / "c.csv")


@pytest.fixture
def page(tmp_path, quiz):
    art = {f"{sp}-{b['artwork']}": "data:image/jpeg;base64," + "A" * 200 for b in quiz["BANDS"] for sp in ("dog", "cat")}
    return lambda q=quiz, a=art: _write(tmp_path, render(q, a))


def _write(tmp_path, html):
    p = tmp_path / "p.html"
    p.write_text(html, encoding="utf-8")
    return p


@needs_node
def test_autocheck_passes_good_page(page):
    ok, summary, problems = autocheck.evaluate(page())
    assert ok, problems


@needs_node
def test_autocheck_catches_syntax_error(page, tmp_path):
    p = page()
    p.write_text(p.read_text().replace("function init(){", "function init({{", 1))
    ok, _, problems = autocheck.evaluate(p)
    assert not ok and "does not compile" in problems[0]


@needs_node
def test_autocheck_catches_emoji_in_result(page, quiz):
    quiz["BANDS"][0]["tagline"] = "Hot \U0001F525 stuff"
    ok, summary, problems = autocheck.evaluate(page(quiz))
    assert not ok and any("emoji" in p for p in problems)


@needs_node
def test_autocheck_catches_identical_species_text(page, quiz):
    for b in quiz["BANDS"]:
        b["descCat"] = b["descDog"]
    ok, _, problems = autocheck.evaluate(page(quiz))
    assert not ok and any("identical" in p for p in problems)


@needs_node
def test_autocheck_catches_missing_art(page):
    ok, _, problems = autocheck.evaluate(page(a={}))
    assert not ok and any("result-art" in p for p in problems)


def test_verify_logic_cli_exit_codes(tmp_path, quiz):
    from toki_quiz_gen import verify_logic
    assert verify_logic.main([str(SPECS / "elemental_mysticism.yml")]) == 0
    quiz["BANDS"][1]["min"] += 1
    bad = tmp_path / "bad.yml"
    bad.write_text(yaml.safe_dump(quiz, allow_unicode=True))
    assert verify_logic.main([str(bad)]) == 1
    assert verify_logic.main([str(tmp_path / "missing.yml")]) == 1
