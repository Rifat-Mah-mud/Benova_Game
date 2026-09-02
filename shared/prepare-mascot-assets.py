"""Rebuild mascot idle PNGs with clean transparency (no fake expression frames)."""
from __future__ import annotations

import io
from pathlib import Path

from PIL import Image
from rembg import new_session, remove

ROOT = Path(__file__).resolve().parent
MASCOTS = ROOT / "mascots"
IN_GAME_DIR = MASCOTS / "in-game"
OUTSIDE_DIR = MASCOTS / "outside"


def is_neutral_gray(r: int, g: int, b: int) -> bool:
    return abs(r - g) < 10 and abs(g - b) < 10 and abs(r - b) < 10


def cleanup_matte(img: Image.Image) -> Image.Image:
    img = img.convert("RGBA")
    px = img.load()
    w, h = img.size

    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a < 16:
                px[x, y] = (0, 0, 0, 0)
                continue
            if r < 24 and g < 24 and b < 24:
                px[x, y] = (0, 0, 0, 0)
                continue
            avg = (r + g + b) / 3
            if is_neutral_gray(r, g, b) and (40 <= avg <= 135 or avg >= 248):
                px[x, y] = (0, 0, 0, 0)
                continue
            if a < 48:
                px[x, y] = (0, 0, 0, 0)

    return img


def rembg_cutout(img: Image.Image, session) -> Image.Image:
    flat = Image.new("RGBA", img.size, (255, 255, 255, 255))
    flat.alpha_composite(img.convert("RGBA"))
    buf = io.BytesIO()
    flat.save(buf, format="PNG")
    cut = remove(buf.getvalue(), session=session)
    return Image.open(io.BytesIO(cut)).convert("RGBA")


def trim_and_pad(img: Image.Image, pad_ratio: float = 0.04) -> Image.Image:
    bbox = img.getbbox()
    if not bbox:
        return img
    cropped = img.crop(bbox)
    side = max(cropped.size)
    pad = int(side * pad_ratio)
    canvas = Image.new("RGBA", (side + pad * 2, side + pad * 2), (0, 0, 0, 0))
    ox = (canvas.width - cropped.width) // 2
    oy = canvas.height - cropped.height - pad
    canvas.alpha_composite(cropped, (ox, oy))
    return canvas


def idle_path(age: int) -> str:
    return f"skeleton-age-{age}.png"


def ages_from_dir(directory: Path) -> list[int]:
    ages: set[int] = set()
    for path in directory.glob("skeleton-age-*.png"):
        suffix = path.stem.replace("skeleton-age-", "")
        if "-" in suffix:
            continue
        try:
            ages.add(int(suffix))
        except ValueError:
            continue
    return sorted(ages)


def process_idle(path: Path, session) -> Image.Image:
    source = Image.open(path).convert("RGBA")
    cut = rembg_cutout(source, session)
    clean = cleanup_matte(cut)
    return trim_and_pad(clean)


def main() -> None:
    session = new_session("u2net")
    ingame_ages = ages_from_dir(IN_GAME_DIR)
    outside_ages = ages_from_dir(OUTSIDE_DIR)

    if not ingame_ages and not outside_ages:
        raise SystemExit("No skeleton-age-*.png idle files found.")

    print(f"Processing {len(ingame_ages)} in-game + {len(outside_ages)} outside idle sprites…")

    for age in ingame_ages:
        target = IN_GAME_DIR / idle_path(age)
        print(f"  in-game age {age}")
        process_idle(target, session).save(target, format="PNG", optimize=True)

    for age in outside_ages:
        target = OUTSIDE_DIR / idle_path(age)
        print(f"  outside age {age}")
        process_idle(target, session).save(target, format="PNG", optimize=True)

    print("Done — idle sprites only. Use CSS for chew/happy/sad in gameplay.")


if __name__ == "__main__":
    main()
