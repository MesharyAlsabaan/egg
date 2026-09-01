#!/usr/bin/env python3
"""
Family Eggs — font build.

Subsets the licensed Madani Arabic masters (kept outside the app, in
../../BARNDING/FONTS/Fonts) to the ranges this site actually renders, and
writes WOFF2 into public/fonts/.

    python tools/build-fonts.py

Two things worth knowing about these masters:

  * Every weight ships as its own standalone family and every file reports
    usWeightClass 400 with subfamily "Regular". The @font-face `font-weight`
    descriptor in styles.scss is what maps each file to a real CSS weight,
    so the bad internal metadata does not matter.
  * Only the four weights the design uses are built. Extra Light and Light
    exist in the masters but nothing on the site calls for them.

Requires: fonttools[woff] (brotli) — `pip install "fonttools[woff]"`.
"""

from __future__ import annotations

from pathlib import Path

from fontTools.subset import Options, Subsetter, load_font, parse_unicodes, save_font

HERE = Path(__file__).resolve().parent
APP = HERE.parent
SRC = APP.parent / "BARNDING" / "FONTS" / "Fonts"
OUT = APP / "public" / "fonts"

# CSS weight -> master file. Nothing on the site uses 200/300.
WEIGHTS = {
    400: "Madani Arabic Regular.ttf",
    500: "Madani Arabic Medium.ttf",
    600: "Madani Arabic Semi Bold.ttf",
    700: "Madani Arabic Bold.ttf",
}

# Kept deliberately wider than today's copy so that editing content.ts can
# never silently drop a glyph.
UNICODES = ",".join([
    "U+0020-007E",   # basic Latin
    "U+00A0-00FF",   # Latin-1 supplement (includes the degree sign)
    "U+0600-06FF",   # Arabic
    "U+0750-077F",   # Arabic supplement
    "U+08A0-08FF",   # Arabic extended-A
    "U+2000-206F",   # general punctuation, incl. the bidi marks
    "U+20AA-20BF",   # currency, incl. the Saudi riyal sign
    "U+2100-214F",   # letterlike symbols
    "U+2190-21BB",   # arrows
    "U+25CC",        # dotted circle, for isolated combining marks
    "U+FB50-FDFF",   # Arabic presentation forms-A
    "U+FE70-FEFF",   # Arabic presentation forms-B
])


def build(weight: int, filename: str) -> tuple[int, int, int]:
    source = SRC / filename
    if not source.exists():
        raise SystemExit(f"missing font master: {source}")

    options = Options()
    options.flavor = "woff2"
    options.desubroutinize = True
    options.hinting = False
    # Arabic is unreadable without its shaping tables, so keep every layout
    # feature rather than the subsetter's default shortlist.
    options.layout_features = ["*"]
    options.name_IDs = ["*"]
    options.notdef_outline = True
    options.drop_tables += ["DSIG"]

    font = load_font(str(source), options)
    before = font["maxp"].numGlyphs

    subsetter = Subsetter(options=options)
    subsetter.populate(unicodes=parse_unicodes(UNICODES))
    subsetter.subset(font)

    after = font["maxp"].numGlyphs
    target = OUT / f"madani-arabic-{weight}.woff2"
    save_font(font, str(target), options)
    font.close()
    return before, after, target.stat().st_size


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    total = 0
    for weight, filename in WEIGHTS.items():
        before, after, size = build(weight, filename)
        total += size
        source_kb = (SRC / filename).stat().st_size // 1024
        print(f"  {weight}  {filename:32s} {source_kb:4d} KB ttf -> "
              f"{size // 1024:3d} KB woff2   glyphs {before} -> {after}")
    print(f"\n  total {total // 1024} KB across {len(WEIGHTS)} weights")
    print("  ->", OUT)


if __name__ == "__main__":
    main()
