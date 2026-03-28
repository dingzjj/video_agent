"""Audio Agent entry point — generate voiceover narration and synthesize audio."""

from __future__ import annotations
import argparse
import sys
from pathlib import Path

from dotenv import load_dotenv
load_dotenv(Path(__file__).parent.parent / ".env")

from task_manager import get_task
from agent import VoiceoverAgent


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Audio Agent — generate voiceover MP3s from a task's storyboard"
    )
    parser.add_argument("--task", metavar="TASK_ID", help="Task ID to process (default: current)")
    parser.add_argument("--suggestion", metavar="TEXT", help="Refinement hint for existing narration")
    args = parser.parse_args()

    task = get_task(args.task)
    if not task:
        print("[ERROR] No task found. Run script-agent first to create a task.")
        sys.exit(1)

    print(f"[AudioAgent] Task: {task.id}  Concept: {task.concept!r}")
    result = VoiceoverAgent().run(task, suggestion=args.suggestion)

    if result["success"]:
        print(f"\n✓  Voiceover ready → {result['merged_path']}")
        print(f"   Synthesized {len(result['audio_files'])} scene(s)")
    else:
        print("\n✗  Voiceover generation failed or ElevenLabs not available.")
        print("   Set ELEVENLABS_API_KEY in .env to enable TTS synthesis.")


if __name__ == "__main__":
    main()
