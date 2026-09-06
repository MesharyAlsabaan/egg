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

import unicodedata
from pathlib import Path

from fontTools.otlLib import builder as otl
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.recordingPen import RecordingPen
from fontTools.subset import Options, Subsetter, load_font, parse_unicodes, save_font
from fontTools.ttLib.tables import otTables as ot

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


# How far to push a sub-dotted letter clear of the tail in front of it, in
# font units (the masters are 1000 upem). The tails overhang their own advance
# box by 75. Clearing that exactly is not enough: the tail then grazes the
# first of the two dots under a ي, and at body sizes the pair rasterises into
# one blob — "التوزيع" reads as "التوزبع". 100 leaves the dots visibly
# separate at every size on the site and still reads as a small space.
KERN = 100


def _closed_contours(glyph_set, name: str) -> list[list[tuple[float, float]]]:
    """Every closed contour of a glyph, as lists of points."""
    pen = RecordingPen()
    glyph_set[name].draw(pen)
    out: list[list[tuple[float, float]]] = []
    current: list[tuple[float, float]] = []
    for op, args in pen.value:
        if op == "moveTo":
            current = [args[0]]
        elif op == "lineTo":
            current.append(args[0])
        elif op == "qCurveTo":
            current.extend(a for a in args if a)
        elif op == "curveTo":
            current.extend(args)
        elif op == "closePath" and current:
            out.append(current)
            current = []
    if current:
        out.append(current)
    return out


def _letters(font) -> dict[str, int]:
    """Glyph name -> codepoint, for Arabic letters only.

    Stylistic alternates (`uni0631.ss01`) inherit their base glyph's
    codepoint; combining marks and symbols are excluded deliberately, because
    a mark carries no advance of its own and kerning one would shove the rest
    of the word sideways instead of moving the mark.
    """
    reverse = {name: cp for cp, name in font.getBestCmap().items()}
    out: dict[str, int] = {}
    for name in font.getGlyphOrder():
        cp = reverse.get(name) or reverse.get(name.split(".")[0])
        if cp is None or not (0x0600 <= cp <= 0x08FF or 0xFB50 <= cp <= 0xFEFF):
            continue
        if unicodedata.category(chr(cp)) != "Lo":
            continue
        out[name] = cp
    return out


def sub_dot_pairs(font) -> list[tuple[str, str]]:
    """The pairs where a swash tail lands on the next letter's sub-dots.

    Madani ships no kerning at all — its GPOS holds `mark` and `mkmk` and not
    a single PairPos lookup — while ر, ز and their forms carry ink 75 units to
    the left of their advance box. Arabic sets right-to-left, so that ink lands
    squarely on whatever follows, and the letters that follow with two dots
    slung under them (ي, ب, ج) collide with it: in "للتوريد" the dots of the ي
    disappear into the tail of the ر.

    Both sides are found by measuring, not by listing letters, so every form
    and every stylistic alternate in the masters is covered.
    """
    glyph_set = font.getGlyphSet()
    letters = _letters(font)
    tails, dotted = [], []
    for name in letters:
        bounds_pen = BoundsPen(glyph_set)
        try:
            glyph_set[name].draw(bounds_pen)
        except Exception:  # noqa: BLE001 - a glyph we cannot draw cannot collide
            continue
        if not bounds_pen.bounds:
            continue
        if bounds_pen.bounds[0] <= -40:
            tails.append(name)
        for contour in _closed_contours(glyph_set, name):
            ys = [p[1] for p in contour]
            xs = [p[0] for p in contour]
            # A closed shape sitting wholly under the baseline, small in both
            # directions: a dot, not a descender.
            if max(ys) <= -30 and max(xs) - min(xs) < 300 and max(ys) - min(ys) < 300:
                dotted.append(name)
                break
    return [(a, b) for a in tails for b in dotted]


def add_kerning(font, pairs: list[tuple[str, str]]) -> None:
    """Add a `kern` feature, leaving the existing `mark`/`mkmk` intact.

    The adjustment goes on the *second* glyph of the pair. Moving the first
    one instead (XPlacement) shifts the tail to the right and merely trades the
    collision for a tighter join with the letter before it; advancing the
    second pushes it clear and leaves everything to its right untouched.
    """
    value = otl.buildValue({"XAdvance": KERN})
    glyph_map = {g: i for i, g in enumerate(font.getGlyphOrder())}
    subtable = otl.buildPairPosGlyphsSubtable({p: (None, value) for p in pairs}, glyph_map)
    lookup = otl.buildLookup([subtable], flags=0)

    gpos = font["GPOS"].table
    lookup_index = len(gpos.LookupList.Lookup)
    gpos.LookupList.Lookup.append(lookup)
    gpos.LookupList.LookupCount = len(gpos.LookupList.Lookup)

    feature = ot.Feature()
    feature.FeatureParams = None
    feature.LookupListIndex = [lookup_index]
    feature.LookupCount = 1
    record = ot.FeatureRecord()
    record.FeatureTag = "kern"
    record.Feature = feature

    # FeatureRecords are required to be sorted by tag, so 'kern' lands ahead of
    # 'mark' and 'mkmk' and every LangSys index at or past it shifts by one.
    feature_list = gpos.FeatureList
    insert_at = 0
    for i, existing in enumerate(feature_list.FeatureRecord):
        if existing.FeatureTag < "kern":
            insert_at = i + 1
    feature_list.FeatureRecord.insert(insert_at, record)
    feature_list.FeatureCount = len(feature_list.FeatureRecord)

    def relink(lang_sys) -> None:
        if lang_sys is None:
            return
        lang_sys.FeatureIndex = [
            i + 1 if i >= insert_at else i for i in lang_sys.FeatureIndex
        ]
        lang_sys.FeatureIndex.append(insert_at)
        lang_sys.FeatureIndex.sort()
        lang_sys.FeatureCount = len(lang_sys.FeatureIndex)

    for script_record in gpos.ScriptList.ScriptRecord:
        relink(script_record.Script.DefaultLangSys)
        for lang_sys_record in script_record.Script.LangSysRecord:
            relink(lang_sys_record.LangSys)


def build(weight: int, filename: str) -> tuple[int, int, int, int]:
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

    pairs = sub_dot_pairs(font)
    add_kerning(font, pairs)

    subsetter = Subsetter(options=options)
    subsetter.populate(unicodes=parse_unicodes(UNICODES))
    subsetter.subset(font)

    after = font["maxp"].numGlyphs
    target = OUT / f"madani-arabic-{weight}.woff2"
    save_font(font, str(target), options)
    font.close()
    return before, after, target.stat().st_size, len(pairs)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    total = 0
    for weight, filename in WEIGHTS.items():
        before, after, size, pairs = build(weight, filename)
        total += size
        source_kb = (SRC / filename).stat().st_size // 1024
        print(f"  {weight}  {filename:32s} {source_kb:4d} KB ttf -> "
              f"{size // 1024:3d} KB woff2   glyphs {before} -> {after}"
              f"   kern pairs {pairs}")
    print(f"\n  total {total // 1024} KB across {len(WEIGHTS)} weights")
    print("  ->", OUT)


if __name__ == "__main__":
    main()
