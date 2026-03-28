"""Invoke Remotion CLI to render the video."""

from __future__ import annotations
import json
import subprocess
import sys
from pathlib import Path

VIDEO_DIR = Path(__file__).parent.parent / "video"
CHROMIUM = "/usr/bin/chromium-browser"


def render_video(
    storyboard_path: Path,
    output_path: Path,
    dry_run: bool = False,
) -> None:
    """Call `npx remotion render` to produce the MP4."""
    output_path.parent.mkdir(parents=True, exist_ok=True)

    # Read total frames from storyboard
    storyboard = json.loads(storyboard_path.read_text())
    fps = storyboard.get("fps", 30)
    total_seconds = storyboard.get("total_duration_seconds", 60)
    total_frames = round(total_seconds * fps)
    last_frame = total_frames - 1

    cmd = [
        "npx", "remotion", "render",
        "KnowledgeVideo",
        str(output_path),
        f"--frames=0-{last_frame}",
        f"--browser-executable={CHROMIUM}",
        "--chromium-flags=--no-sandbox",
        "--concurrency=2",
    ]

    print(f"  Total: {total_frames} frames ({total_seconds:.0f}s @ {fps}fps)", flush=True)
    print(f"  Output: {output_path}", flush=True)

    if dry_run:
        print("  [dry-run] Skipping actual render.", flush=True)
        return

    result = subprocess.run(cmd, cwd=VIDEO_DIR, stdout=sys.stdout, stderr=sys.stderr)
    if result.returncode != 0:
        raise RuntimeError(f"Remotion render failed (exit code {result.returncode})")
