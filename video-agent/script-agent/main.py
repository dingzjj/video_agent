"""Script Agent entry point — generate storyboard from concept."""

from __future__ import annotations
import argparse
import sys
from pathlib import Path

from dotenv import load_dotenv
load_dotenv(Path(__file__).parent.parent / ".env")

from task_manager import create_task, get_task
from agent import ScriptAgent


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Script Agent — generate storyboard JSON from a concept"
    )
    parser.add_argument("concept", nargs="?", help="Video concept (text)")
    parser.add_argument("--task", metavar="TASK_ID", help="Work on an existing task")
    parser.add_argument("--suggestion", metavar="TEXT", help="Refinement hint for the existing storyboard")
    args = parser.parse_args()

    if not args.concept and not args.suggestion and not args.task:
        parser.print_help()
        sys.exit(1)

    # ── Resolve task ─────────────────────────────────────────────────────────
    if args.task:
        task = get_task(args.task)
        if not task:
            print(f"[ERROR] Task {args.task!r} not found.")
            sys.exit(1)
    elif args.concept:
        task = create_task(args.concept)
        print(f"[ScriptAgent] Created task: {task.id}")
    else:
        task = get_task()
        if not task:
            print("[ERROR] No current task found. Provide a concept.")
            sys.exit(1)

    print(f"[ScriptAgent] Task: {task.id}  Concept: {task.concept!r}")
    result = ScriptAgent().run(task, suggestion=args.suggestion)
    print(f"\n✓  Storyboard written → {result['storyboard_path']}")


if __name__ == "__main__":
    main()
