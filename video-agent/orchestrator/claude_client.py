"""LLM client — storyboard generation and review via Azure OpenAI."""

from __future__ import annotations
import json
import os
from pathlib import Path
from typing import Optional

from openai import AzureOpenAI

from .schemas import Storyboard, StoryboardReview

_PROMPTS = Path(__file__).parent / "prompts"
_STORYBOARD_SYSTEM = (_PROMPTS / "storyboard_prompt.txt").read_text(encoding="utf-8")
_REVIEW_SYSTEM     = (_PROMPTS / "review_prompt.txt").read_text(encoding="utf-8")

# Azure OpenAI config (read from env; fallback to empty string)
AZURE_ENDPOINT    = os.environ.get("AZURE_OPENAI_ENDPOINT",    "")
AZURE_API_KEY     = os.environ.get("AZURE_OPENAI_API_KEY",     "")
AZURE_API_VERSION = os.environ.get("AZURE_OPENAI_API_VERSION", "")
AZURE_DEPLOYMENT  = os.environ.get("AZURE_OPENAI_DEPLOYMENT",  "")


def _client() -> AzureOpenAI:
    return AzureOpenAI(
        azure_endpoint=AZURE_ENDPOINT,
        api_key=AZURE_API_KEY,
        api_version=AZURE_API_VERSION,
    )


def _chat_json(system: str, messages: list[dict]) -> dict:
    """Call Azure OpenAI and return parsed JSON dict."""
    resp = _client().chat.completions.create(
        model=AZURE_DEPLOYMENT,
        messages=[{"role": "system", "content": system}] + messages,
        max_completion_tokens=4096,
        response_format={"type": "json_object"},
    )
    raw = (resp.choices[0].message.content or "").strip()
    if raw.startswith("```"):
        raw = "\n".join(
            line for line in raw.splitlines() if not line.startswith("```")
        ).strip()
    return json.loads(raw)


# ── Storyboard generation ─────────────────────────────────────────────────────

def generate_storyboard(
    concept: str,
    revision_instructions: Optional[str] = None,
) -> Storyboard:
    """Generate (or revise) a storyboard for the given concept."""
    print(f"  [LLM] Generating storyboard [{AZURE_DEPLOYMENT}]...", flush=True)

    messages: list[dict] = [{"role": "user", "content": concept}]

    if revision_instructions:
        messages.append({
            "role": "user",
            "content": (
                "REVISION REQUIRED — the previous storyboard was reviewed and rejected.\n\n"
                "Apply ALL of the following instructions to produce an improved storyboard:\n\n"
                + revision_instructions
                + "\n\nYour response must be a new, complete storyboard JSON — not a summary or explanation."
            ),
        })

    data = _chat_json(_STORYBOARD_SYSTEM, messages)
    return Storyboard.model_validate(data)


# ── Storyboard review ─────────────────────────────────────────────────────────

def review_storyboard(storyboard: Storyboard) -> StoryboardReview:
    """Review a storyboard for educational quality. Returns structured review."""
    print(f"  [LLM] Reviewing storyboard [{AZURE_DEPLOYMENT}]...", flush=True)

    storyboard_json = json.dumps(
        json.loads(storyboard.model_dump_json(by_alias=True)),
        ensure_ascii=False,
        indent=2,
    )
    messages = [{"role": "user", "content": storyboard_json}]
    data = _chat_json(_REVIEW_SYSTEM, messages)
    return StoryboardReview.model_validate(data)
