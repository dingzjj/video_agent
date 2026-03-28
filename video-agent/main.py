"""
Knowledge Video Agent — multi-agent pipeline CLI.

Usage:
    python main.py "Explain how neural networks learn"
    python main.py --dry-run "Photosynthesis explained"
    python main.py --max-iterations 2 --output ./my_video.mp4 "Quantum entanglement"
    python main.py --no-review "Quick demo concept"   # single-pass, skip review loop

Architecture:
    OrchestratorAgent
    ├── VideoGenerationAgent  (LLM storyboard → assets → render)
    └── VideoReviewAgent      (LLM quality check → revision feedback)
"""

from __future__ import annotations
import argparse
import sys
from pathlib import Path

# Load .env if present
try:
    from dotenv import load_dotenv
    load_dotenv(Path(__file__).parent / ".env")
except ImportError:
    pass


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Knowledge Video Agent — generate animated explanation videos",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument("concept", help="Concept or script to turn into a video")
    parser.add_argument("--dry-run", action="store_true",
                        help="Generate storyboard only, skip video rendering")
    parser.add_argument("--output", default=None, metavar="PATH",
                        help="Output video path (default: workspace/output/<title>.mp4)")
    parser.add_argument("--max-iterations", type=int, default=3, metavar="N",
                        help="Max generate→review cycles (default: 3)")
    parser.add_argument("--no-review", action="store_true",
                        help="Skip the review agent; generate and render in one pass")
    args = parser.parse_args()

    print("\n🎬 Knowledge Video Agent")
    print("=" * 60)
    print(f"  Mode    : {'dry-run' if args.dry_run else 'full render'}")
    print(f"  Review  : {'disabled' if args.no_review else f'enabled (max {args.max_iterations} iterations)'}")
    print(f"  Concept : {args.concept!r}")
    print("=" * 60)
    print()

    output_path = Path(args.output) if args.output else None

    # ── No-review fast path ───────────────────────────────────────────────────
    if args.no_review:
        from agents.generation_agent import VideoGenerationAgent
        result = VideoGenerationAgent().run(
            concept=args.concept,
            dry_run=args.dry_run,
            output_path=output_path,
            iteration=1,
        )
        _print_final(
            approved=None,
            iterations=1,
            output_path=result["output_path"],
            history=[],
            dry_run=args.dry_run,
        )
        return

    # ── Full multi-agent pipeline ─────────────────────────────────────────────
    from agents.orchestrator import OrchestratorAgent
    result = OrchestratorAgent().run(
        concept=args.concept,
        dry_run=args.dry_run,
        output_path=output_path,
        max_iterations=args.max_iterations,
    )

    _print_final(
        approved=result["approved"],
        iterations=result["iterations"],
        output_path=result["output_path"],
        history=result["history"],
        dry_run=args.dry_run,
    )

    # Exit code 1 if max iterations reached without approval
    if not result["approved"] and not args.dry_run:
        sys.exit(1)


def _print_final(
    approved,
    iterations: int,
    output_path,
    history: list,
    dry_run: bool,
) -> None:
    print("\n" + "=" * 60)
    print("  PIPELINE COMPLETE")
    print("=" * 60)

    if history:
        print("\n  Iteration history:")
        for h in history:
            icon = "✅" if h["approved"] else "❌"
            print(
                f"    {icon} Iter {h['iteration']}: "
                f"score={h['average_score']:.1f}  "
                f"scenes={h['scenes']}  "
                f"duration={h['duration_s']:.0f}s  "
                f"issues={h['issues_count']}"
            )

    if approved is None:
        print("\n  Review: skipped (--no-review)")
    elif approved:
        print(f"\n  Review: ✅ Approved after {iterations} iteration(s)")
    else:
        print(f"\n  Review: ❌ Not approved after {iterations} iteration(s)")
        print("         Rendered best available storyboard.")

    if dry_run:
        print("\n  Video : [dry-run] not rendered")
    elif output_path:
        size_mb = Path(output_path).stat().st_size / 1_048_576
        print(f"\n  Video : {output_path}  ({size_mb:.1f} MB)")

    print()


if __name__ == "__main__":
    main()
