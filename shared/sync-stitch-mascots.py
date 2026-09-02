"""Copy stitch_friendly_3d_cartoon_skeleton refs into in-game mascot PNGs."""
from __future__ import annotations

import io
import re
from pathlib import Path

from PIL import Image
from rembg import new_session, remove

import importlib.util

_spec = importlib.util.spec_from_file_location(
    "prepare_mascot_assets",
    Path(__file__).resolve().parent / "prepare-mascot-assets.py",
)
_mod = importlib.util.module_from_spec(_spec)
assert _spec.loader is not None
_spec.loader.exec_module(_mod)
cleanup_matte = _mod.cleanup_matte
trim_and_pad = _mod.trim_and_pad

ROOT = Path(__file__).resolve().parent.parent
STITCH_DIR = ROOT / "stitch_friendly_3d_cartoon_skeleton"
IN_GAME_DIR = ROOT / "shared" / "mascots" / "in-game"
SPRITE_SHEET = (
    ROOT
    / "shared"
    / "mascots"
    / "stitch new image"
    / "a_mobile_game_sprite_sheet_for_a_cute_friendly_3d_cartoon_skeleton_mascot_based.png"
)

AGE_RE = re.compile(r"age_(\d+)_")


def stitch_sources() -> dict[int, Path]:
    sources: dict[int, Path] = {}
    for folder in sorted(STITCH_DIR.iterdir()):
        if not folder.is_dir():
            continue
        match = AGE_RE.search(folder.name)
        if not match:
            continue
        screen = folder / "screen.png"
        if not screen.exists():
            continue
        age = int(match.group(1))
        if age not in sources or "sitting_on_the" in folder.name:
            sources[age] = screen
    return dict(sorted(sources.items()))


def rembg_cutout(img: Image.Image, session) -> Image.Image:
    flat = Image.new("RGBA", img.size, (255, 255, 255, 255))
    flat.alpha_composite(img.convert("RGBA"))
    buf = io.BytesIO()
    flat.save(buf, format="PNG")
    cut = remove(buf.getvalue(), session=session)
    return Image.open(io.BytesIO(cut)).convert("RGBA")


def process_source(path: Path, session) -> Image.Image:
    source = Image.open(path).convert("RGBA")
    cut = rembg_cutout(source, session)
    clean = cleanup_matte(cut)
    return trim_and_pad(clean)


def slice_sprite_sheet(path: Path, session) -> dict[str, Image.Image]:
    sheet = Image.open(path).convert("RGBA")
    w, h = sheet.size
    cols = 4
    frame_w = w // cols
    frame_h = h
    labels = ["mouth-open", "chew", "happy", "sad"]
    frames: dict[str, Image.Image] = {}
    for i, label in enumerate(labels):
        crop = sheet.crop((i * frame_w, 0, (i + 1) * frame_w, frame_h))
        cut = rembg_cutout(crop, session)
        clean = cleanup_matte(cut)
        frames[label] = trim_and_pad(clean)
    frames["chew-2"] = frames["chew"].copy()
    return frames


def main() -> None:
    session = new_session("u2net")
    IN_GAME_DIR.mkdir(parents=True, exist_ok=True)

    sources = stitch_sources()
    if not sources:
        raise SystemExit(f"No stitch sources found in {STITCH_DIR}")

    print(f"Syncing {len(sources)} idle sprites from stitch references…")
    for age, source in sources.items():
        target = IN_GAME_DIR / f"skeleton-age-{age}.png"
        print(f"  age {age}: {source.parent.name}")
        process_source(source, session).save(target, format="PNG", optimize=True)

    if SPRITE_SHEET.exists():
        print("Slicing age-5 mood frames from sprite sheet…")
        for label, image in slice_sprite_sheet(SPRITE_SHEET, session).items():
            target = IN_GAME_DIR / f"skeleton-age-5-{label}.png"
            image.save(target, format="PNG", optimize=True)
            print(f"  skeleton-age-5-{label}.png")

    print("Done.")


if __name__ == "__main__":
    main()
