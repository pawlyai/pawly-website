"""Render the quiz template: {{TITLE}}, {{SPEC_JSON}} and {{ART_JSON}} are the only holes."""
from __future__ import annotations

import datetime as dt
import html
import json
import re
from importlib import resources

from .spec import SpecError, pascal_slug, quiz_config

HOLES = ("{{TITLE}}", "{{SPEC_JSON}}", "{{ART_JSON}}")


def template_text() -> str:
    return resources.files("toki_quiz_gen").joinpath("templates/quiz_template.html").read_text(encoding="utf-8")


def js_json(obj) -> str:
    """JSON that is also safe inside an inline <script> (no literal '</')."""
    return json.dumps(obj, ensure_ascii=False, indent=1).replace("</", "<\\/")


def output_name(quiz: dict, date: dt.date | str) -> str:
    d = date if isinstance(date, str) else date.isoformat()
    if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", d):
        raise SpecError(f"date must be YYYY-MM-DD, got {d!r}")
    return f"Toki_Quiz_{pascal_slug(quiz)}_InApp_EN_{d}.html"


def render(quiz: dict, art: dict[str, str]) -> str:
    out = template_text()
    for hole in HOLES:
        if out.count(hole) != 1:
            raise RuntimeError(f"template must contain {hole} exactly once")
    # Replace via split/join: spec text may itself contain braces or backslashes.
    out = out.replace("{{TITLE}}", html.escape(quiz["titleShort"], quote=False))
    out = out.replace("{{SPEC_JSON}}", js_json(quiz_config(quiz)))
    out = out.replace("{{ART_JSON}}", js_json(art))
    return out
