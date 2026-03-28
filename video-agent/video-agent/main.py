"""Video Agent entry point — render storyboard to MP4 via Remotion."""

from __future__ import annotations
import argparse
import sys
from pathlib import Path

from dotenv import load_dotenv
load_dotenv(Path(__file__).parent.parent / ".env")

from task_manager import get_task
from agent import VideoRenderAgent


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Video Agent — render storyboard to MP4 via Remotion"
    )
    parser.add_argument("--task", metavar="TASK_ID", help="Task ID to render (default: current)")
    parser.add_argument("--no-audio", action="store_true", help="Render without merging voiceover")
    args = parser.parse_args()

    task = get_task(args.task)
    if not task:
        print("[ERROR] No task found. Run script-agent first to create a task.")
        sys.exit(1)

    print(f"[VideoAgent] Task: {task.id}  Concept: {task.concept!r}")
    result = VideoRenderAgent().run(task, merge_audio=not args.no_audio)

    print(f"\n✓  Video rendered → {result['output_path']}")
    if result["audio_merged"]:
        print("   (with voiceover audio)")
    else:
        print("   (silent — no voiceover mixed in)")


if __name__ == "__main__":
    main()
