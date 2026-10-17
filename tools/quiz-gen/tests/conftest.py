import copy
import shutil
from pathlib import Path

import pytest
import yaml

ROOT = Path(__file__).resolve().parents[1]
SPECS = ROOT / "specs"
ART = ROOT / "art" / "elemental_mysticism"


@pytest.fixture
def quiz():
    return yaml.safe_load((SPECS / "elemental_mysticism.yml").read_text(encoding="utf-8"))


@pytest.fixture
def mutate(quiz):
    return lambda: copy.deepcopy(quiz)


needs_node = pytest.mark.skipif(shutil.which("node") is None, reason="node not installed")
