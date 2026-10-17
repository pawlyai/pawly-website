"""Shrink result artwork and turn it into data: URIs so the page has no external image dependency."""
from __future__ import annotations

import base64
import shutil
import subprocess
import tempfile
from pathlib import Path

EXTS = (".png", ".jpg", ".jpeg")
MAX_EDGE = 640
JPEG_QUALITY = 60


class ArtworkError(RuntimeError):
    pass


def art_key(species: str, band: dict) -> str:
    return f"{species}-{band['artwork']}"


def find_source(art_dir: Path, key: str) -> Path | None:
    for ext in EXTS:
        p = art_dir / f"{key}{ext}"
        if p.is_file():
            return p
    return None


def compress(src: Path, dst: Path) -> None:
    """sips -Z 640 -s formatOptions 60 (macOS); Pillow is used when sips is not available."""
    if shutil.which("sips"):
        r = subprocess.run(
            ["sips", "-Z", str(MAX_EDGE), "-s", "format", "jpeg", "-s", "formatOptions", str(JPEG_QUALITY), str(src), "--out", str(dst)],
            capture_output=True, text=True,
        )
        if r.returncode != 0 or not dst.is_file():
            raise ArtworkError(f"sips failed on {src.name}: {r.stderr.strip() or r.stdout.strip()}")
        return
    try:
        from PIL import Image
    except ImportError:
        raise ArtworkError("need macOS `sips` or the Pillow package to compress artwork") from None
    with Image.open(src) as im:
        im = im.convert("RGB")
        im.thumbnail((MAX_EDGE, MAX_EDGE))
        im.save(dst, "JPEG", quality=JPEG_QUALITY)


def build_art_dict(quiz: dict, art_dir: Path) -> dict[str, str]:
    """{'dog-<slug>': 'data:image/jpeg;base64,...', ...} for every band x species. All missing files are reported at once."""
    art_dir = Path(art_dir)
    if not art_dir.is_dir():
        raise ArtworkError(f"artwork directory not found: {art_dir}")
    wanted = [(sp, b) for b in quiz["BANDS"] for sp in ("dog", "cat")]
    missing = [f"{art_key(sp, b)}.png" for sp, b in wanted if find_source(art_dir, art_key(sp, b)) is None]
    if missing:
        raise ArtworkError(f"missing artwork in {art_dir}: " + ", ".join(missing))
    out: dict[str, str] = {}
    with tempfile.TemporaryDirectory() as tmp:
        for sp, b in wanted:
            key = art_key(sp, b)
            dst = Path(tmp) / f"{key}.jpg"
            compress(find_source(art_dir, key), dst)
            out[key] = "data:image/jpeg;base64," + base64.b64encode(dst.read_bytes()).decode("ascii")
    return out
