"""ScriptAgent — generate storyboard and write artifacts into the task folder."""

from __future__ import annotations
import json
import shutil
from pathlib import Path
from typing import Optional

from .base import BaseAgent
from orchestrator.claude_client import generate_storyboard
from orchestrator.asset_retriever import fetch_all_images
from orchestrator.schemas import Storyboard
from orchestrator.task_manager import Task, update_stage, mark_stale_from, VIDEO_PUBLIC

WORKSPACE = Path(__file__).parent.parent / "workspace"


class ScriptAgent(BaseAgent):
    name = "ScriptAgent"

    def run(
        self,
        task: Task,
        suggestion: Optional[str] = None,
    ) -> dict:
        """
        Generate (or refine) a storyboard for the task concept.

        Args:
            task:        Active Task object — artifacts written to task.folder.
            suggestion:  Refine hint applied to the existing storyboard in task.folder.

        Returns:
            {
                "storyboard":      Storyboard,
                "storyboard_path": Path,
            }
        """
        update_stage(task, "script", "running")

        # Seed suggestion mode with the task's current storyboard (if any)
        existing: Optional[Storyboard] = None
        if suggestion and task.storyboard_path.exists():
            try:
                existing = Storyboard.model_validate(
                    json.loads(task.storyboard_path.read_text(encoding="utf-8"))
                )
            except Exception:
                pass
        if suggestion and existing is None:
            self.log("⚠️  No existing storyboard in task — generating from scratch")

        # ── Generate ──────────────────────────────────────────────────────
        storyboard = generate_storyboard(
            task.concept,
            suggestion=suggestion,
            existing_storyboard=existing,
        )
        self.log(
            f"Storyboard: '{storyboard.title}' — "
            f"{len(storyboard.scenes)} scenes, {storyboard.total_duration_seconds:.0f}s"
        )

        # ── Fetch assets ───────────────────────────────────────────────────
        task_assets = task.folder / "assets"
        task_assets.mkdir(parents=True, exist_ok=True)
        pub_assets = VIDEO_PUBLIC / "assets"
        pub_assets.mkdir(parents=True, exist_ok=True)

        image_map = fetch_all_images(storyboard.scenes, WORKSPACE / "assets")
        self.log(f"Assets: {len(image_map)} images fetched")

        for scene in storyboard.scenes:
            if scene.id in image_map:
                src = Path(image_map[scene.id])
                shutil.copy2(src, task_assets / src.name)
                shutil.copy2(src, pub_assets / src.name)
                scene.asset_path = f"assets/{src.name}"

        # ── Write storyboard.json ──────────────────────────────────────────
        storyboard_data = json.loads(storyboard.model_dump_json(by_alias=True))
        payload = json.dumps(storyboard_data, ensure_ascii=False, indent=2)

        task.storyboard_path.write_text(payload, encoding="utf-8")
        task.sync_to_public()
        self.log(f"Storyboard written → {task.storyboard_path}")

        update_stage(task, "script", "completed", scenes=len(storyboard.scenes))
        if suggestion:
            mark_stale_from(task, "script")

        return {
            "storyboard":      storyboard,
            "storyboard_path": task.storyboard_path,
        }
