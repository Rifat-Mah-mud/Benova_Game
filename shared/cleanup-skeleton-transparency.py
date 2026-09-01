"""Remove baked-in checkerboard / matte artifacts from skeleton PNG cutouts."""
from __future__ import annotations

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent
OUTSIDE_DIR = ROOT / "mascots" / "outside"


def is_neutral_gray(r: int, g: int, b: int) -> bool:
    return abs(r - g) < 10 and abs(g - b) < 10 and abs(r - b) < 10


def cleanup_checkerboard(img: Image.Image) -> tuple[Image.Image, int]:
    img = img.convert("RGBA")
    px = img.load()
    w, h = img.size
    removed = 0

    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a < 16:
                px[x, y] = (r, g, b, 0)
                continue

            if r < 24 and g < 24 and b < 24:
                px[x, y] = (0, 0, 0, 0)
                removed += 1
                continue

            avg = (r + g + b) / 3
            if is_neutral_gray(r, g, b):
                if 40 <= avg <= 135 or avg >= 248:
                    px[x, y] = (0, 0, 0, 0)
                    removed += 1
                    continue

            if a < 64:
                px[x, y] = (r, g, b, 0)
                removed += 1

    return img, removed


def process_file(path: Path) -> None:
    img, removed = cleanup_checkerboard(Image.open(path))
    img.save(path, format="PNG", optimize=True)
    print(f"cleaned {path.name}: removed {removed} pixels")


def main() -> None:
    if not OUTSIDE_DIR.is_dir():
        raise SystemExit(f"Missing directory: {OUTSIDE_DIR}")

    targets = sorted(OUTSIDE_DIR.glob("skeleton-age-*.png"))
    if not targets:
        raise SystemExit("No outside skeleton PNGs found.")

    for path in targets:
        if path.name.endswith("-fixed.png"):
            continue
        process_file(path)

    print(f"Done — cleaned {len(targets)} outside skeleton images.")


if __name__ == "__main__":
    main()
