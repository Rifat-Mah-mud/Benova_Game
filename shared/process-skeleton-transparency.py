"""Sync skeleton sources and apply proper alpha transparency (rembg AI matting)."""
from __future__ import annotations

import re
import shutil
from pathlib import Path

from PIL import Image
from rembg import new_session, remove

ROOT = Path(__file__).resolve().parent
MASCOTS = ROOT / "mascots"
IN_GAME_DIR = MASCOTS / "in-game"
OUTSIDE_DIR = MASCOTS / "outside"

SITTING_SRC = Path(r"z:\Projects\Benova_game\stitch_fskeleton\stitch_friendly_3d_cartoon_skeleton")
STANDING_SRC = Path(r"z:\Projects\Benova_game\stitch_friendly_3d_cartoon_skeleton")

STANDING_MAP = {
    "a_cute_3d_rendered_cartoon_skeleton_character_age_2_full_body_standing_pose_": "skeleton-age-2.png",
    "cute_3d_rendered_cartoon_skeleton_character_age_5_proportions_full_body": "skeleton-age-5.png",
    "cute_3d_rendered_cartoon_skeleton_character_age_8_full_body_standing_pose_": "skeleton-age-8.png",
    "a_cute_3d_rendered_cartoon_skeleton_character_age_14_full_body_standing_pose_": "skeleton-age-14.png",
    "a_cute_3d_rendered_cartoon_skeleton_character_age_32_full_body_standing_pose": "skeleton-age-32.png",
    "a_cute_3d_rendered_cartoon_skeleton_character_age_35_full_body_standing_pose": "skeleton-age-35.png",
    "a_cute_3d_rendered_cartoon_skeleton_character_age_38_full_body_standing_pose": "skeleton-age-38.png",
    "a_cute_3d_rendered_cartoon_skeleton_character_age_41_full_body_standing_pose": "skeleton-age-41.png",
    "a_cute_3d_rendered_cartoon_skeleton_character_age_44_full_body_standing_pose": "skeleton-age-44.png",
    "a_cute_3d_rendered_cartoon_skeleton_character_age_50_full_body_standing_pose_1": "skeleton-age-50.png",
    "a_cute_3d_rendered_cartoon_skeleton_character_age_50_full_body_standing_pose_2": "skeleton-age-50-alt.png",
    "a_cute_3d_rendered_cartoon_skeleton_character_age_53_full_body_standing_pose": "skeleton-age-53.png",
    "a_cute_3d_rendered_cartoon_skeleton_character_age_56_full_body_standing_pose": "skeleton-age-56.png",
    "a_cute_3d_rendered_cartoon_skeleton_character_age_59_full_body_standing_pose": "skeleton-age-59.png",
}


def sync_sources() -> list[Path]:
    IN_GAME_DIR.mkdir(parents=True, exist_ok=True)
    OUTSIDE_DIR.mkdir(parents=True, exist_ok=True)
    targets: list[Path] = []

    for folder in sorted(SITTING_SRC.iterdir()):
        if not folder.is_dir():
            continue
        match = re.search(r"age_(\d+)", folder.name)
        if not match:
            continue
        src = folder / "screen.png"
        if not src.is_file():
            continue
        dest = IN_GAME_DIR / f"skeleton-age-{match.group(1)}.png"
        shutil.copy2(src, dest)
        targets.append(dest)

    for folder_name, file_name in STANDING_MAP.items():
        src = STANDING_SRC / folder_name / "screen.png"
        if not src.is_file():
            raise FileNotFoundError(src)
        dest = OUTSIDE_DIR / file_name
        shutil.copy2(src, dest)
        targets.append(dest)

    return targets


def make_transparent(path: Path, session) -> None:
    raw = path.read_bytes()
    cutout = remove(raw, session=session)
    image = Image.open(__import__("io").BytesIO(cutout)).convert("RGBA")
    image.save(path, format="PNG", optimize=True)
    alpha = image.getchannel("A")
    print(f"processed {path.relative_to(MASCOTS)}  alpha={alpha.getextrema()}")


def main() -> None:
    targets = sync_sources()
    if not targets:
        raise SystemExit("No skeleton images found to process.")

    session = new_session("u2net")
    for target in targets:
        make_transparent(target, session)

    print(f"Done — {len(targets)} skeleton images now have proper transparency.")


if __name__ == "__main__":
    main()
