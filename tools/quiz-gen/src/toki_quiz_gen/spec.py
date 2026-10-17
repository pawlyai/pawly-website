"""Load a quiz spec (YAML, optionally with a CSV question adapter) into the QUIZ dict the engine consumes."""
from __future__ import annotations

import csv
import re
from pathlib import Path

import yaml

REQUIRED_TOP = [
    "id", "titleShort", "eraTitle", "h1", "sub", "trending", "startLabel", "tipTemplate",
    "calcLines", "scoreBase", "meterEnds", "dims", "dimKeys",
    "DOG_QUESTIONS", "CAT_QUESTIONS", "BANDS", "disclaimer",
]
OPTIONAL_TOP = ["scoreDisplay", "artAlt", "questionsCsv", "slug"]
BAND_REQUIRED = ["min", "max", "theme", "artwork", "name", "tagline", "chip", "descDog", "descCat", "traits", "tipDog", "tipCat"]
THEMES = {"A", "B", "C", "D"}
SLUG_RE = re.compile(r"^[A-Za-z0-9]+$")
ARTWORK_RE = re.compile(r"^[a-z0-9]+(-[a-z0-9]+)*$")


class SpecError(ValueError):
    """The spec is structurally wrong (as opposed to a rule violation found by the checks)."""


def load_spec(path: str | Path) -> dict:
    path = Path(path)
    try:
        data = yaml.safe_load(path.read_text(encoding="utf-8"))
    except yaml.YAMLError as e:
        raise SpecError(f"{path}: invalid YAML: {e}") from e
    if not isinstance(data, dict):
        raise SpecError(f"{path}: top level must be a mapping")
    csv_ref = data.get("questionsCsv")
    if csv_ref:
        dog, cat = load_questions_csv(path.parent / csv_ref)
        data.setdefault("DOG_QUESTIONS", dog)
        data.setdefault("CAT_QUESTIONS", cat)
    validate_structure(data)
    return data


def load_questions_csv(path: str | Path) -> tuple[list, list]:
    """CSV adapter. Columns: species,tag,q,t,s,prof_k,prof_v. One row per option; a question is a run of
    consecutive rows sharing (species, tag, q)."""
    path = Path(path)
    lists: dict[str, list] = {"dog": [], "cat": []}
    last_key = None
    with path.open(newline="", encoding="utf-8") as fh:
        reader = csv.DictReader(fh)
        need = {"species", "tag", "q", "t", "s", "prof_k", "prof_v"}
        if not reader.fieldnames or not need <= set(reader.fieldnames):
            raise SpecError(f"{path}: CSV needs columns {sorted(need)}")
        for n, row in enumerate(reader, start=2):
            sp = (row["species"] or "").strip().lower()
            if sp not in lists:
                raise SpecError(f"{path}:{n}: species must be dog or cat, got {row['species']!r}")
            try:
                score = int(row["s"])
            except (TypeError, ValueError):
                raise SpecError(f"{path}:{n}: s must be an integer, got {row['s']!r}") from None
            key = (sp, row["tag"], row["q"])
            if key != last_key:
                lists[sp].append({"tag": row["tag"], "q": row["q"], "opts": []})
                last_key = key
            lists[sp][-1]["opts"].append(
                {"t": row["t"], "s": score, "prof": {"k": row["prof_k"], "v": row["prof_v"]}}
            )
    return lists["dog"], lists["cat"]


def validate_structure(q: dict) -> None:
    """Hard schema errors: anything the engine would crash on or silently mis-render. Raises SpecError listing all."""
    errs: list[str] = []
    for k in REQUIRED_TOP:
        if k not in q or q[k] in (None, "", []):
            errs.append(f"missing required field '{k}'")
    for k in q:
        if k not in REQUIRED_TOP and k not in OPTIONAL_TOP:
            errs.append(f"unknown top-level field '{k}'")
    if errs:
        raise SpecError("; ".join(errs))
    if not isinstance(q["scoreBase"], int):
        errs.append("scoreBase must be an integer")
    me = q["meterEnds"]
    if not (isinstance(me, dict) and {"low", "high"} <= set(me)):
        errs.append("meterEnds must have low and high")
    for side in ("DOG_QUESTIONS", "CAT_QUESTIONS"):
        qs = q[side]
        if not isinstance(qs, list) or not qs:
            errs.append(f"{side} must be a non-empty list")
            continue
        for i, qu in enumerate(qs, 1):
            where = f"{side}[{i}]"
            if not isinstance(qu, dict) or not qu.get("tag") or not qu.get("q"):
                errs.append(f"{where}: needs tag and q")
                continue
            opts = qu.get("opts")
            if not isinstance(opts, list) or len(opts) < 2:
                errs.append(f"{where}: needs at least 2 opts")
                continue
            for j, o in enumerate(opts, 1):
                w = f"{where}.opts[{j}]"
                if not isinstance(o, dict) or not o.get("t"):
                    errs.append(f"{w}: needs t")
                    continue
                if not isinstance(o.get("s"), int) or isinstance(o.get("s"), bool):
                    errs.append(f"{w}: needs integer s")
                prof = o.get("prof")
                if not (isinstance(prof, dict) and prof.get("k") and prof.get("v")):
                    errs.append(f"{w}: needs prof {{k, v}}")
    if len(q["DOG_QUESTIONS"]) != len(q["CAT_QUESTIONS"]):
        errs.append(f"DOG_QUESTIONS ({len(q['DOG_QUESTIONS'])}) and CAT_QUESTIONS ({len(q['CAT_QUESTIONS'])}) must have the same length")
    if not isinstance(q["BANDS"], list) or not q["BANDS"]:
        errs.append("BANDS must be a non-empty list")
    else:
        for i, b in enumerate(q["BANDS"], 1):
            for k in BAND_REQUIRED:
                if b.get(k) in (None, "", []):
                    errs.append(f"BANDS[{i}]: missing '{k}'")
            if b.get("theme") not in THEMES:
                errs.append(f"BANDS[{i}]: theme must be one of A/B/C/D")
            if not isinstance(b.get("min"), int) or not isinstance(b.get("max"), int):
                errs.append(f"BANDS[{i}]: min/max must be integers")
            elif b["min"] > b["max"]:
                errs.append(f"BANDS[{i}]: min > max")
            if b.get("artwork") and not ARTWORK_RE.match(str(b["artwork"])):
                errs.append(f"BANDS[{i}]: artwork slug must be lowercase-kebab, got {b['artwork']!r}")
            for k in ("descDog", "descCat"):
                if k in b and not (isinstance(b[k], list) and all(isinstance(x, str) for x in b[k])):
                    errs.append(f"BANDS[{i}]: {k} must be a list of strings")
    if errs:
        raise SpecError("; ".join(errs))


def pascal_slug(q: dict, fallback: str = "Quiz") -> str:
    """Filename slug: explicit `slug` field, else PascalCase of `id` (karma_check -> KarmaCheck)."""
    if q.get("slug"):
        slug = str(q["slug"])
    else:
        slug = "".join(p[:1].upper() + p[1:] for p in re.split(r"[^A-Za-z0-9]+", str(q.get("id", ""))) if p) or fallback
    if not SLUG_RE.match(slug):
        raise SpecError(f"slug {slug!r} must be alphanumeric PascalCase")
    return slug


def quiz_config(q: dict) -> dict:
    """The dict embedded as `const QUIZ` (generator-only fields stripped)."""
    return {k: v for k, v in q.items() if k not in ("questionsCsv", "slug")}
