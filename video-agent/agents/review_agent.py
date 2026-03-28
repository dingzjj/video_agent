"""VideoReviewAgent — evaluates storyboard quality via LLM."""

from __future__ import annotations

from .base import BaseAgent
from orchestrator.claude_client import review_storyboard
from orchestrator.schemas import Storyboard, StoryboardReview, APPROVAL_THRESHOLD


class VideoReviewAgent(BaseAgent):
    name = "VideoReviewAgent"

    def run(self, storyboard: Storyboard) -> dict:
        """
        Review a storyboard for educational quality.

        Returns:
            {
                "review": StoryboardReview,
                "approved": bool,
                "summary": str,   # one-line human-readable summary
            }
        """
        review: StoryboardReview = review_storyboard(storyboard)

        scores = review.scores
        self.log(
            f"Score: {review.average_score:.1f}/10 "
            f"(quality={scores.educational_quality:.1f}, "
            f"completeness={scores.completeness:.1f}, "
            f"variety={scores.variety:.1f}, "
            f"pacing={scores.pacing:.1f}, "
            f"clarity={scores.clarity:.1f})"
        )

        if review.approved:
            self.log(f"✅ APPROVED (threshold={APPROVAL_THRESHOLD})")
        else:
            self.log(f"❌ REJECTED (threshold={APPROVAL_THRESHOLD})")
            for issue in review.issues:
                self.log(f"  Issue: {issue}")

        summary = (
            f"{'✅' if review.approved else '❌'} "
            f"avg={review.average_score:.1f} | "
            f"issues={len(review.issues)}"
        )

        return {
            "review": review,
            "approved": review.approved,
            "summary": summary,
        }
