"""Main entry point for the knowledge video agent.

Usage:
    python -m orchestrator.main "Explain how neural networks learn"
    python -m orchestrator.main --dry-run "Photosynthesis explained"
"""

from __future__ import annotations
import argparse
import json
import shutil
import sys
from pathlib import Path

# Load .env if present
try:
    from dotenv import load_dotenv
    load_dotenv(Path(__file__).parent.parent / ".env")
except ImportError:
    pass

from .claude_client import generate_storyboard
from .asset_retriever import fetch_all_images
from .renderer import render_video

WORKSPACE = Path(__file__).parent.parent / "workspace"
VIDEO_PUBLIC = Path(__file__).parent.parent / "video" / "public"
STORYBOARD_FILE = VIDEO_PUBLIC / "storyboard.json"


def main() -> None:
    parser = argparse.ArgumentParser(description="Knowledge Video Agent")
    parser.add_argument("concept", help="Concept or script to turn into a video")
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Generate storyboard and fetch assets but skip video rendering",
    )
    parser.add_argument(
        "--output", default=None,
        help="Output video path (default: workspace/output/<title>.mp4)",
    )
    args = parser.parse_args()

    print("\n🎬 Knowledge Video Agent")
    print("=" * 50)

    # ── Step 1: Generate storyboard ──────────────────────────
    print("\n[1/4] Generating storyboard via Azure OpenAI...")
    storyboard = generate_storyboard(args.concept)
    print(f"  ✓ {len(storyboard.scenes)} scenes, {storyboard.total_duration_seconds:.0f}s total")
    for scene in storyboard.scenes:
        print(f"    • {scene.id} [{scene.type}] {scene.duration_seconds:.0f}s — {scene.title or scene.heading or scene.message or ''}")

    # ── Step 2: Download images ───────────────────────────────
    print("\n[2/4] Fetching assets...")
    assets_dir = WORKSPACE / "assets"
    image_map = fetch_all_images(storyboard.scenes, assets_dir)

    # Inject resolved paths into storyboard (relative to video/public/)
    for scene in storyboard.scenes:
        if scene.id in image_map:
            # Copy to video/public/assets/ so Remotion can serve them
            src = Path(image_map[scene.id])
            VIDEO_PUBLIC.mkdir(parents=True, exist_ok=True)
            pub_assets = VIDEO_PUBLIC / "assets"
            pub_assets.mkdir(exist_ok=True)
            dst = pub_assets / src.name
            shutil.copy2(src, dst)
            scene.asset_path = f"assets/{src.name}"

    print(f"  ✓ {len(image_map)} images fetched")

    # ── Step 3: Write storyboard JSON for Remotion ───────────
    print("\n[3/4] Writing storyboard.json → video/public/...")
    VIDEO_PUBLIC.mkdir(parents=True, exist_ok=True)
    storyboard_data = json.loads(storyboard.model_dump_json(by_alias=True))
    STORYBOARD_FILE.write_text(
        json.dumps(storyboard_data, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    # Also save a copy to workspace for reference
    (WORKSPACE / "storyboard.json").parent.mkdir(parents=True, exist_ok=True)
    (WORKSPACE / "storyboard.json").write_text(
        json.dumps(storyboard_data, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print("  ✓ storyboard.json written")

    if args.dry_run:
        print("\n[4/4] Dry-run mode — skipping render.")
        print(f"\n✅ Storyboard saved to: {STORYBOARD_FILE}")
        print("   Run without --dry-run to render the video.\n")
        return

    # ── Step 4: Render video ──────────────────────────────────
    print("\n[4/4] Rendering video with Remotion...")
    safe_title = storyboard.title[:40].replace(" ", "_").replace("/", "_")
    output_path = Path(args.output) if args.output else WORKSPACE / "output" / f"{safe_title}.mp4"

    render_video(STORYBOARD_FILE, output_path, dry_run=args.dry_run)

    print(f"\n✅ Done! Video saved to: {output_path}\n")


if __name__ == "__main__":
    main()
