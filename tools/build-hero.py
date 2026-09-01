#!/usr/bin/env python3
"""
Family Eggs — hero film build.

Cuts, grades and encodes the hero loop from the original 1280x720 masters in
../../videos, and writes two independently reframed versions plus posters
into public/media/.

    python tools/build-hero.py            # everything
    python tools/build-hero.py stills     # grade proof sheets only
    python tools/build-hero.py desktop
    python tools/build-hero.py mobile

Why two encodes and not one crop: a 16:9 master centre-cropped to 9:16 keeps
26% of the frame width and throws away the parts of the site that make the
shot readable. Each shot below carries its own mobile framing instead.

Grade targets were measured off the masters, not guessed:

    clip            R      G      B    R-B   stddev  clipped
    11 solar     133.0  121.1  111.3  +21.7    47.5    0.83%
    12 aerial    145.5  129.4  113.8  +31.8    33.3    0.18%
    13 houses    131.1  123.5  117.3  +13.9    40.2    0.31%
    6  interior  182.4  183.9  205.4  -23.1    31.4    1.32%

The three aerials carry a warm cast that grows with altitude; the interior is
strongly blue from the hall lighting. Both are pulled toward a common, still
natural, balance: desert stays warm, the hall goes clean white, and the roofs
stop clipping.

Requires: ffmpeg/ffprobe on PATH, Pillow.
"""

from __future__ import annotations

import subprocess
import sys
from dataclasses import dataclass, field
from pathlib import Path

HERE = Path(__file__).resolve().parent
APP = HERE.parent
SRC = APP.parent / "videos"
OUT = APP / "public" / "media"
WORK = APP / ".hero-build"

FPS = 30
DESKTOP = (1920, 1080)
MOBILE = (1080, 1920)
XFADE = 0.4          # seconds, the only transition used
LOOP_BLEND = 0.5     # head blended over the tail so the loop point matches


@dataclass(frozen=True)
class Shot:
    source: str
    start: float
    duration: float
    note: str
    grade: str
    #: Horizontal centre of the 9:16 mobile crop, 0..1 of the frame width.
    mobile_x: float = 0.5
    #: Vertical centre of the 9:16 mobile crop, 0..1 of the frame height.
    mobile_y: float = 0.5
    #: Extra zoom for the mobile reframe; 1.0 keeps full frame height.
    mobile_zoom: float = 1.0


# Shared front of the chain: kill the block noise the 9-12 Mbps h264 masters
# still carry at this bitrate, then a light temporal denoise. Both run before
# any colour work so the grade is not amplifying noise.
CLEAN = "deblock=filter=weak:block=4,hqdn3d=luma_spatial=2:chroma_spatial=2:luma_tmp=4:chroma_tmp=4"

# Shared tail: a gentle S with the top rolled off, so white roofs keep their
# detail instead of clipping, plus a small shadow lift that stops short of
# raising noise. Sharpening is deliberately mild - these are 720p masters.
TONE = (
    "curves=all='0/0.015 0.25/0.245 0.5/0.505 0.75/0.765 0.92/0.925 1/0.975'"
)
SHARP = "unsharp=5:5:0.55:5:5:0.0"

SHOTS: list[Shot] = [
    Shot(
        source="12.mp4", start=1.0, duration=3.5,
        note="wide aerial, whole site and the solar field",
        # Warmest of the three aerials (R-B +31.8) and the flattest
        # (stddev 33.3): pull the cast back and give it some contrast.
        grade=f"{CLEAN},colorbalance=rm=-0.088:bm=0.088:rh=-0.052:bh=0.052,"
              f"{TONE},eq=contrast=1.07:saturation=1.02:gamma=1.01,{SHARP}",
        mobile_x=0.44, mobile_y=0.56, mobile_zoom=1.30,
    ),
    Shot(
        source="11.mp4", start=0.8, duration=2.5,
        note="solar array with the production houses behind",
        # R-B +21.7 and already the most contrasty shot (stddev 47.5), so the
        # cast comes back but the contrast is left alone.
        grade=f"{CLEAN},colorbalance=rm=-0.035:bm=0.035:rh=-0.02:bh=0.02,"
              f"{TONE},eq=contrast=1.0:saturation=1.02:gamma=1.02,{SHARP}",
        mobile_x=0.42, mobile_y=0.62, mobile_zoom=1.16,
    ),
    Shot(
        source="13.mp4", start=3.0, duration=3.0,
        note="houses, internal road and the truck at the dock",
        # Nearly neutral already (R-B +13.9): the smallest correction of the
        # three, which is what keeps the three aerials looking like one day.
        grade=f"{CLEAN},colorbalance=rm=-0.012:bm=0.012,"
              f"{TONE},eq=contrast=1.03:saturation=1.02:gamma=1.0,{SHARP}",
        mobile_x=0.40, mobile_y=0.55, mobile_zoom=1.28,
    ),
    Shot(
        source="6.mp4", start=6.6, duration=3.0,
        note="eggs travelling the belt - no people, no forklift in frame",
        # Strongly blue hall lighting (R-B -23.1) and 1.32% already clipped at
        # mean 190. Warmed and greened to neutral - the first pass left a
        # magenta cast because green sat below both red and blue - then the
        # exposure comes down a little so the white hall keeps its shape.
        # Result: R 180.3 / G 182.1 / B 184.1, a 3.8-level spread.
        grade=f"{CLEAN},colorbalance=rm=0.06:gm=0.052:bm=-0.095:rh=0.04:gh=0.03:bh=-0.06,"
              f"curves=all='0/0.01 0.3/0.30 0.6/0.585 0.85/0.83 1/0.945',"
              f"eq=contrast=1.06:saturation=1.05:brightness=-0.02,{SHARP}",
        mobile_x=0.30, mobile_y=0.82, mobile_zoom=1.28,
    ),
    Shot(
        source="12.mp4", start=1.0, duration=2.0,
        note="back to the opening aerial so the loop point matches",
        grade=f"{CLEAN},colorbalance=rm=-0.088:bm=0.088:rh=-0.052:bh=0.052,"
              f"{TONE},eq=contrast=1.07:saturation=1.02:gamma=1.01,{SHARP}",
        mobile_x=0.44, mobile_y=0.56, mobile_zoom=1.30,
    ),
]


def run(args: list[str]) -> None:
    proc = subprocess.run(args, capture_output=True, text=True)
    if proc.returncode != 0:
        sys.stderr.write(proc.stderr[-6000:])
        raise SystemExit(f"command failed: {' '.join(args[:6])} ...")


def reframe(shot: Shot, size: tuple[int, int], *, mobile: bool) -> str:
    """Scale and crop one shot to the target frame."""
    w, h = size
    if not mobile:
        # 1280x720 and 1920x1080 are the same ratio: a straight upscale, no crop.
        return f"scale={w}:{h}:flags=lanczos"

    # Portrait: take a 9:16 window out of the landscape frame, positioned per
    # shot, then scale it up. zoom>1 tightens the window.
    src_w, src_h = 1280, 720
    win_h = src_h / shot.mobile_zoom
    win_w = win_h * 9 / 16
    x = shot.mobile_x * src_w - win_w / 2
    y = shot.mobile_y * src_h - win_h / 2
    x = max(0, min(src_w - win_w, x))
    y = max(0, min(src_h - win_h, y))
    return (
        f"crop={win_w:.0f}:{win_h:.0f}:{x:.0f}:{y:.0f},"
        f"scale={w}:{h}:flags=lanczos"
    )


def build_segments(size: tuple[int, int], *, mobile: bool) -> list[Path]:
    WORK.mkdir(exist_ok=True)
    tag = "m" if mobile else "d"
    paths = []
    for i, shot in enumerate(SHOTS):
        target = WORK / f"seg_{tag}{i}.mp4"
        chain = f"{shot.grade},{reframe(shot, size, mobile=mobile)},fps={FPS},format=yuv420p"
        run([
            "ffmpeg", "-v", "error", "-y",
            "-ss", str(shot.start), "-t", str(shot.duration),
            "-i", str(SRC / shot.source),
            "-an", "-vf", chain,
            "-c:v", "libx264", "-preset", "slow", "-crf", "16",
            "-pix_fmt", "yuv420p", str(target),
        ])
        paths.append(target)
        print(f"    {shot.source} {shot.start}-{shot.start + shot.duration}s  {shot.note}")
    return paths


def stitch(segments: list[Path], out: Path) -> None:
    """Concatenate with short cross-dissolves, then blend the head over the
    tail so the last frame matches the first and the loop does not jump."""
    inputs = []
    for path in segments:
        inputs += ["-i", str(path)]

    steps = []
    prev = "0:v"
    offset = 0.0
    for i in range(1, len(segments)):
        offset += SHOTS[i - 1].duration - XFADE
        label = f"x{i}"
        steps.append(
            f"[{prev}][{i}:v]xfade=transition=fade:duration={XFADE}:offset={offset:.3f}[{label}]"
        )
        prev = label
    filtergraph = ";".join(steps) if steps else None

    stitched = WORK / f"stitched_{out.stem}.mp4"
    args = ["ffmpeg", "-v", "error", "-y", *inputs]
    if filtergraph:
        args += ["-filter_complex", filtergraph, "-map", f"[{prev}]"]
    args += ["-c:v", "libx264", "-preset", "slow", "-crf", "16",
             "-pix_fmt", "yuv420p", "-an", str(stitched)]
    run(args)

    total = sum(s.duration for s in SHOTS) - XFADE * (len(SHOTS) - 1)
    # Fade the opening back in over the final LOOP_BLEND seconds. The last
    # frame then IS the first frame, so `loop` has nothing to jump over.
    run([
        "ffmpeg", "-v", "error", "-y",
        "-i", str(stitched), "-i", str(stitched),
        "-filter_complex",
        f"[1:v]trim=0:{LOOP_BLEND},setpts=PTS-STARTPTS,"
        f"format=yuva420p,fade=t=in:st=0:d={LOOP_BLEND}:alpha=1[head];"
        f"[0:v][head]overlay=0:0:enable='gte(t,{total - LOOP_BLEND:.3f})'[v]",
        "-map", "[v]",
        "-c:v", "libx264", "-preset", "slow", "-crf", "16",
        "-pix_fmt", "yuv420p", "-an", "-movflags", "+faststart",
        str(WORK / f"looped_{out.stem}.mp4"),
    ])
    (WORK / f"looped_{out.stem}.mp4").replace(out)


def encode_delivery(master: Path, out_mp4: Path, out_webm: Path | None, crf: int, bitrate: str) -> None:
    """H.264 only. VP9 was measured on this material and came out larger than
    x264 at matched quality (10.5 MB vs 10.1 MB desktop, 6.9 vs 6.3 mobile),
    so the second file would cost bytes and buy nothing."""
    del out_webm
    run([
        "ffmpeg", "-v", "error", "-y", "-i", str(master),
        "-an", "-c:v", "libx264", "-profile:v", "high", "-preset", "veryslow",
        "-crf", str(crf), "-maxrate", bitrate, "-bufsize", "12M",
        "-pix_fmt", "yuv420p", "-movflags", "+faststart", str(out_mp4),
    ])


def poster(master: Path, stem: str, at: float, widths: tuple[int, ...]) -> None:
    from PIL import Image

    frame = WORK / f"{stem}.png"
    run(["ffmpeg", "-v", "error", "-y", "-ss", str(at), "-i", str(master),
         "-frames:v", "1", str(frame)])
    img = Image.open(frame).convert("RGB")
    for width in widths:
        if width > img.width:
            continue
        height = round(img.height * width / img.width)
        resized = img.resize((width, height), Image.LANCZOS)
        resized.save(OUT / f"{stem}-{width}.avif", quality=58, speed=4)
        resized.save(OUT / f"{stem}-{width}.webp", quality=76, method=6)
        resized.save(OUT / f"{stem}-{width}.jpg", quality=82, optimize=True, progressive=True)
    print(f"  poster {stem}  ({img.width}x{img.height})")


def build_automation() -> None:
    """The automation section's own clip.

    It has to hold under the line "without human contact", so it comes from
    the same window of 6.mp4 the hero uses — the only stretch where neither
    the forklift nor any worker is in frame. People appear from about 11.5s.
    """
    shot = SHOTS[3]
    print("automation 1920x1080")
    master = WORK / "automation-master.mp4"
    run([
        "ffmpeg", "-v", "error", "-y",
        "-ss", "6.2", "-t", "5.2", "-i", str(SRC / "6.mp4"),
        "-an", "-vf", f"{shot.grade},scale=1920:1080:flags=lanczos,fps={FPS},format=yuv420p",
        "-c:v", "libx264", "-preset", "slow", "-crf", "16",
        "-pix_fmt", "yuv420p", str(master),
    ])
    encode_delivery(master, OUT / "automation.mp4", None, crf=23, bitrate="4M")
    poster(master, "automation-poster", 1.0, (768, 1280, 1600))
    print(f"  automation.mp4           "
          f"{(OUT / 'automation.mp4').stat().st_size / 1024 / 1024:5.2f} MB")


def build_stills() -> None:
    """Before/after proof sheet, so the grade is judged on frames rather than
    trusted because the encode succeeded."""
    from PIL import Image, ImageDraw

    WORK.mkdir(exist_ok=True)
    rows = []
    for i, shot in enumerate(SHOTS[:4]):
        at = shot.start + shot.duration / 2
        raw = WORK / f"proof_raw_{i}.png"
        graded = WORK / f"proof_graded_{i}.png"
        run(["ffmpeg", "-v", "error", "-y", "-ss", str(at), "-i", str(SRC / shot.source),
             "-frames:v", "1", str(raw)])
        run(["ffmpeg", "-v", "error", "-y", "-ss", str(at), "-i", str(SRC / shot.source),
             "-frames:v", "1", "-vf", shot.grade, str(graded)])
        rows.append((shot.source, Image.open(raw), Image.open(graded)))

    tw = 560
    th = round(tw * 720 / 1280)
    sheet = Image.new("RGB", (tw * 2, th * len(rows)), "black")
    draw = ImageDraw.Draw(sheet)
    for i, (name, a, b) in enumerate(rows):
        sheet.paste(a.resize((tw, th), Image.LANCZOS), (0, i * th))
        sheet.paste(b.resize((tw, th), Image.LANCZOS), (tw, i * th))
        draw.text((8, i * th + 8), f"{name} BEFORE", fill="yellow")
        draw.text((tw + 8, i * th + 8), f"{name} AFTER", fill="#7CFC00")
    target = WORK / "grade-proof.jpg"
    sheet.save(target, quality=90)
    print("  proof sheet ->", target)


def build_framing() -> None:
    """Proof of the 9:16 reframing, with the headline block marked, so mobile
    composition is judged before a 14-second encode is spent on it."""
    from PIL import Image, ImageDraw

    WORK.mkdir(exist_ok=True)
    tiles = []
    for i, shot in enumerate(SHOTS[:4]):
        at = shot.start + shot.duration / 2
        target = WORK / f"mob_{i}.png"
        run(["ffmpeg", "-v", "error", "-y", "-ss", str(at), "-i", str(SRC / shot.source),
             "-frames:v", "1", "-vf",
             f"{shot.grade},{reframe(shot, MOBILE, mobile=True)}", str(target)])
        tiles.append((shot.source, Image.open(target)))

    tw, th = 300, 533
    sheet = Image.new("RGB", (tw * len(tiles), th), "black")
    draw = ImageDraw.Draw(sheet)
    for i, (name, im) in enumerate(tiles):
        sheet.paste(im.resize((tw, th), Image.LANCZOS), (i * tw, 0))
        draw.text((i * tw + 8, 8), name, fill="yellow")
        draw.rectangle([i * tw, int(th * 0.60), (i + 1) * tw - 1, th - 1],
                       outline="#F49320", width=2)
    sheet.save(WORK / "mobile-framing.jpg", quality=90)
    print("  framing proof ->", WORK / "mobile-framing.jpg")


def main() -> None:
    stages = sys.argv[1:] or ["desktop", "mobile", "automation"]
    OUT.mkdir(parents=True, exist_ok=True)

    if "stills" in stages:
        build_stills()
        return
    if "framing" in stages:
        build_framing()
        return

    if "desktop" in stages:
        print("desktop 1920x1080")
        segs = build_segments(DESKTOP, mobile=False)
        master = WORK / "hero-desktop-master.mp4"
        stitch(segs, master)
        encode_delivery(master, OUT / "hero-desktop.mp4", None, crf=21, bitrate="7M")
        poster(master, "hero-poster-desktop", 1.2, (1280, 1600, 1920))

    if "mobile" in stages:
        print("mobile 1080x1920")
        segs = build_segments(MOBILE, mobile=True)
        master = WORK / "hero-mobile-master.mp4"
        stitch(segs, master)
        encode_delivery(master, OUT / "hero-mobile.mp4", None, crf=23, bitrate="4M")
        poster(master, "hero-poster-mobile", 1.2, (720, 900, 1080))

    if "automation" in stages:
        build_automation()

    print()
    for name in ("hero-desktop.mp4", "hero-mobile.mp4", "automation.mp4"):
        path = OUT / name
        if path.exists():
            print(f"  {name:24s} {path.stat().st_size / 1024 / 1024:5.2f} MB")


if __name__ == "__main__":
    main()
