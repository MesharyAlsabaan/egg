#!/usr/bin/env python3
"""
Family Eggs — media build pipeline.

Reads the ORIGINAL master assets that live OUTSIDE the Angular app
(../../videos and ../../BARNDING) and writes web-optimised derivatives
into egg/public/. Nothing here is committed by hand; re-run the script
whenever a master asset is replaced:

    python tools/build-media.py

Requires: ffmpeg/ffprobe on PATH, Pillow >= 11 (AVIF + WebP support).
"""

from __future__ import annotations

import shutil
import subprocess
import sys
from pathlib import Path

from PIL import Image

HERE = Path(__file__).resolve().parent
APP = HERE.parent                     # .../egg
ROOT = APP.parent                     # .../02_FamilyEggs-Website
SRC_VIDEOS = ROOT / "videos"
SRC_BRAND = ROOT / "BARNDING" / "logo"

OUT_MEDIA = APP / "public" / "media"
OUT_BRAND = APP / "public" / "brand"

def _master_video() -> Path:
    """The farm footage has been re-uploaded under a few different WhatsApp
    names. Take the largest .mp4 in the folder rather than pinning one name."""
    clips = sorted(SRC_VIDEOS.glob("*.mp4"), key=lambda p: p.stat().st_size, reverse=True)
    if not clips:
        raise SystemExit(f"no .mp4 master found in {SRC_VIDEOS}")
    return clips[0]


MASTER_VIDEO = _master_video()

# Restored 5504x3072 masters of the three aerial frames — no watermark, and
# far sharper than the WhatsApp originals they were rebuilt from.
MASTER_DUSK = SRC_VIDEOS / "FAMILYEGGS_01.png"   # farm at dusk, solar rows
MASTER_DAY = SRC_VIDEOS / "FAMILYEGGS_02.png"    # daylight, houses + solar field
MASTER_GATE = SRC_VIDEOS / "FAMILYEGGS_03.png"   # gate, canopies, trucks

# Responsive widths. Masters are 5504px wide, so nothing here upscales.
WIDTHS = (480, 768, 1200, 1800, 2400)

# Cut list, derived by reviewing the master frame by frame.
# (name, start seconds, duration seconds)
# The shot cuts from the date groves to the production houses at 66.0s, so the
# hero starts just after it — verified as a true 390x844 cover crop, not a
# rough centre slice. It ends before the next cut at ~74.5s.
HERO_CLIP = ("hero", 66, 8)
# Only the clips the site actually renders are built. These other timecodes
# were verified frame by frame and are one line away if a section needs them:
#     stage-1-production   82s   cage rows inside the layer house
#     stage-2-collection   76s   in-house belt, loaded with eggs
#     stage-4-packing     140s   packing stations, crates being filled
#     stage-5-distribution  2s   trucks at the loading yard
STAGE_CLIPS = [
    ("stage-3-grading", 120, 6),      # the long grading conveyor, eggs on it
]

# Art-directed crops, as fractions (x0, y0, x1, y1) of the master frame.
CROPS = {
    "farm-solar": (MASTER_DAY, (0.74, 0.22, 1.00, 0.60)),
    "logistics-trucks": (MASTER_GATE, (0.55, 0.60, 1.00, 0.96)),
}


def run(args: list[str]) -> None:
    proc = subprocess.run(args, capture_output=True, text=True)
    if proc.returncode != 0:
        sys.stderr.write(proc.stderr[-4000:])
        raise SystemExit(f"command failed: {args[0]}")


def encode_image(img: Image.Image, stem: str) -> None:
    """Write avif/webp/jpg at every width that does not upscale."""
    img = img.convert("RGB")
    for width in WIDTHS:
        if width > img.width:
            continue
        height = round(img.height * width / img.width)
        resized = img.resize((width, height), Image.LANCZOS)
        resized.save(OUT_MEDIA / f"{stem}-{width}.avif", quality=54, speed=4)
        resized.save(OUT_MEDIA / f"{stem}-{width}.webp", quality=72, method=6)
        resized.save(OUT_MEDIA / f"{stem}-{width}.jpg", quality=80, optimize=True,
                     progressive=True)
    print(f"  image  {stem}  ({img.width}x{img.height})")


def build_images() -> None:
    print("images")
    for stem, master in (
        ("farm-day", MASTER_DAY),
        ("farm-dusk", MASTER_DUSK),
        ("logistics-gate", MASTER_GATE),
    ):
        encode_image(Image.open(master), stem)

    for stem, (master, box) in CROPS.items():
        src = Image.open(master)
        x0, y0, x1, y1 = box
        encode_image(
            src.crop((round(x0 * src.width), round(y0 * src.height),
                      round(x1 * src.width), round(y1 * src.height))),
            stem,
        )


# The master has two watermarks burned into the picture: a green/orange mark
# in the top-left corner of every shot, and "dji PHANTOM 4 PRO" bottom-right
# on the aerials. Neither may appear on the site — the top-left one lands
# exactly where our own logo sits in the LTR header. Both are cropped out.
# Replace the master with clean footage and set these to 0.
CROP_TOP = 0.19
CROP_BOTTOM = 0.12


def crop_filter() -> str:
    keep = 1 - CROP_TOP - CROP_BOTTOM
    return f"crop=iw:ih*{keep:.4f}:0:ih*{CROP_TOP:.4f}"


def encode_clip(stem: str, start: float, duration: float, *, mobile: bool) -> None:
    width = 640 if mobile else 848
    crf = "27" if mobile else "24"
    suffix = "-mobile" if mobile else ""
    run([
        "ffmpeg", "-v", "error", "-y",
        "-ss", str(start), "-t", str(duration), "-i", str(MASTER_VIDEO),
        "-an",                                   # strip audio entirely
        "-vf", f"{crop_filter()},scale={width}:-2:flags=lanczos",
        "-c:v", "libx264", "-profile:v", "high", "-preset", "slow",
        "-crf", crf, "-pix_fmt", "yuv420p",
        "-movflags", "+faststart",
        str(OUT_MEDIA / f"{stem}{suffix}.mp4"),
    ])


def grab_poster(stem: str, at: float) -> None:
    """A still from the clip itself, so there is no visible swap when playback
    begins — and something real to show when motion is turned off."""
    frame = OUT_MEDIA / f"_{stem}.png"
    run([
        "ffmpeg", "-v", "error", "-y", "-ss", str(at), "-i", str(MASTER_VIDEO),
        "-frames:v", "1", "-vf", crop_filter(), str(frame),
    ])
    encode_image(Image.open(frame), f"{stem}-poster")
    frame.unlink()


def build_video() -> None:
    print("video")
    name, start, duration = HERO_CLIP
    encode_clip(name, start, duration, mobile=False)
    encode_clip(name, start, duration, mobile=True)
    grab_poster("hero", start + 0.3)
    print(f"  clip   {name} ({duration}s, desktop + mobile)")

    for name, start, duration in STAGE_CLIPS:
        encode_clip(name, start, duration, mobile=True)
        grab_poster(name, start + 1)
        print(f"  clip   {name} ({duration}s + poster)")


def build_brand() -> None:
    """Logo derivatives. The eggs are gradient-mesh artwork, so the vector
    export is a 3 MB mesh-per-egg SVG — the transparent PNG masters are the
    honest, smaller choice for the web."""
    print("brand")
    variants = {
        "logo-lockup": "Family eggs logo final-01.png",   # terracotta wordmark
        "logo-mark": "Family eggs logo final-02.png",     # primary icon, no type
        "logo-lockup-green": "Family eggs logo final-03.png",
    }
    for stem, filename in variants.items():
        src = Image.open(SRC_BRAND / filename).convert("RGBA")
        src = src.crop(src.getbbox())  # trim the transparent margin
        for width in (120, 240, 480, 720):
            if width > src.width:
                continue
            height = round(src.height * width / src.width)
            resized = src.resize((width, height), Image.LANCZOS)
            resized.save(OUT_BRAND / f"{stem}-{width}.webp", quality=88, method=6)
            resized.save(OUT_BRAND / f"{stem}-{width}.png", optimize=True)
        print(f"  logo   {stem}  ({src.width}x{src.height} trimmed)")

    # Favicon: the primary icon on the brand ivory, squared.
    mark = Image.open(SRC_BRAND / variants["logo-mark"]).convert("RGBA")
    mark = mark.crop(mark.getbbox())
    side = max(mark.size)
    square = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    square.paste(mark, ((side - mark.width) // 2, (side - mark.height) // 2))
    for size in (180, 192, 512):
        square.resize((size, size), Image.LANCZOS).save(OUT_BRAND / f"icon-{size}.png",
                                                        optimize=True)
    square.resize((32, 32), Image.LANCZOS).save(OUT_BRAND / "favicon.png", optimize=True)
    print("  logo   favicons")


def write_manifest() -> None:
    """Record which widths actually exist for each image stem.

    Masters differ in size and we never upscale, so the available widths vary
    per image. The component reads this instead of guessing — which is what
    produced 404s for farm-solar at 1800w.

    Built by scanning the output folder, so it stays correct even when only
    one stage of this script is re-run.
    """
    widths: dict[str, set[int]] = {}
    for path in OUT_MEDIA.glob("*.avif"):
        stem, _, width = path.stem.rpartition("-")
        if stem and width.isdigit():
            widths.setdefault(stem, set()).add(int(width))

    lines = [
        "// GENERATED by tools/build-media.py — do not edit by hand.",
        "// Widths that exist on disk for each image stem.",
        "export const MEDIA_WIDTHS: Record<string, number[]> = {",
    ]
    for stem in sorted(widths):
        lines.append(f"  '{stem}': [{', '.join(str(w) for w in sorted(widths[stem]))}],")
    lines += ["};", ""]

    target = APP / "src" / "app" / "core" / "media-manifest.ts"
    target.write_text("\n".join(lines), encoding="utf-8")
    print(f"  manifest {len(widths)} images -> {target.name}")


def main() -> None:
    for missing in [p for p in (MASTER_DUSK, MASTER_DAY, MASTER_GATE) if not p.exists()]:
        raise SystemExit(f"missing master asset: {missing}")
    if shutil.which("ffmpeg") is None:
        raise SystemExit("ffmpeg not found on PATH")

    OUT_MEDIA.mkdir(parents=True, exist_ok=True)
    OUT_BRAND.mkdir(parents=True, exist_ok=True)

    # Optional stage filter, e.g. `python tools/build-media.py video`.
    stages = sys.argv[1:] or ["images", "video", "brand"]
    if "images" in stages:
        build_images()
    if "video" in stages:
        build_video()
    if "brand" in stages:
        build_brand()

    write_manifest()
    print("\ndone:", OUT_MEDIA.parent)


if __name__ == "__main__":
    main()
