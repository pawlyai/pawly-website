"""Generate PLACEHOLDER result artwork for the Elemental Mysticism pilot (flat vector-style, 1024x1024 PNG).

Design owns the real {species}-{band}.png set; drop it into the same folder and re-run toki-quiz-gen.
Usage: python scripts/make_placeholder_art.py art/elemental_mysticism
"""
import math
import sys
from pathlib import Path

from PIL import Image, ImageDraw

S = 1024
ELEMENTS = {  # slug -> (bg top, bg bottom, accent)
    "fire-spirit": ((255, 190, 120), (255, 120, 60), (255, 236, 160)),
    "wood-spirit": ((200, 235, 200), (110, 180, 130), (240, 255, 220)),
    "earth-spirit": ((245, 215, 170), (200, 150, 100), (255, 240, 205)),
    "metal-spirit": ((232, 236, 240), (150, 165, 180), (255, 255, 255)),
    "water-spirit": ((190, 225, 245), (70, 130, 190), (230, 248, 255)),
}
FUR = {"dog": (176, 120, 70), "cat": (120, 120, 130)}


def gradient(top, bottom):
    im = Image.new("RGB", (S, S))
    px = im.load()
    for y in range(S):
        t = y / (S - 1)
        c = tuple(round(top[i] + (bottom[i] - top[i]) * t) for i in range(3))
        for x in range(S):
            px[x, y] = c
    return im


def symbol(d, slug, accent, cx, cy, r):
    if slug == "fire-spirit":
        d.polygon([(cx, cy - r), (cx + r * .6, cy + r * .3), (cx, cy + r * .8), (cx - r * .6, cy + r * .3)], fill=accent)
    elif slug == "wood-spirit":
        d.ellipse([cx - r * .45, cy - r, cx + r * .45, cy + r * .6], fill=accent)
    elif slug == "earth-spirit":
        d.rectangle([cx - r * .7, cy - r * .5, cx + r * .7, cy + r * .5], fill=accent)
    elif slug == "metal-spirit":
        d.ellipse([cx - r * .7, cy - r * .7, cx + r * .7, cy + r * .7], outline=accent, width=int(r * .22))
    else:
        for k in range(3):
            y = cy - r * .5 + k * r * .5
            pts = [(cx - r + i * 6, y + math.sin(i / 6) * r * .12) for i in range(int(r * 2 / 6))]
            d.line(pts, fill=accent, width=int(r * .14))


def draw(species, slug):
    top, bottom, accent = ELEMENTS[slug]
    im = gradient(top, bottom)
    d = ImageDraw.Draw(im)
    symbol(d, slug, accent, S // 2, 250, 130)
    fur, dark = FUR[species], (60, 45, 40)
    cx, cy = S // 2, 610
    d.ellipse([cx - 260, cy + 120, cx + 260, cy + 520], fill=fur)  # body
    if species == "dog":
        d.ellipse([cx - 330, cy - 250, cx - 150, cy + 80], fill=dark)  # floppy ears
        d.ellipse([cx + 150, cy - 250, cx + 330, cy + 80], fill=dark)
    else:
        d.polygon([(cx - 250, cy - 40), (cx - 230, cy - 330), (cx - 70, cy - 190)], fill=fur)  # pointed ears
        d.polygon([(cx + 250, cy - 40), (cx + 230, cy - 330), (cx + 70, cy - 190)], fill=fur)
    d.ellipse([cx - 250, cy - 230, cx + 250, cy + 220], fill=fur)  # head
    for sx in (-1, 1):  # calm closed eyes
        d.arc([cx + sx * 110 - 55, cy - 40, cx + sx * 110 + 55, cy + 40], 20, 160, fill=dark, width=14)
    d.ellipse([cx - 28, cy + 40, cx + 28, cy + 82], fill=dark)  # nose
    d.arc([cx - 70, cy + 60, cx + 70, cy + 140], 20, 160, fill=dark, width=10)  # smile
    return im


def main(out: Path):
    out.mkdir(parents=True, exist_ok=True)
    for slug in ELEMENTS:
        for sp in ("dog", "cat"):
            draw(sp, slug).save(out / f"{sp}-{slug}.png", optimize=True)
    print(f"wrote {len(ELEMENTS) * 2} placeholder images to {out}")


if __name__ == "__main__":
    main(Path(sys.argv[1] if len(sys.argv) > 1 else "art/elemental_mysticism"))
