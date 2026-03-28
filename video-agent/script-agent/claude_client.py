"""LLM client — storyboard generation and voiceover via Azure OpenAI."""

from __future__ import annotations
import json
import os
from pathlib import Path
from typing import Optional

from openai import AzureOpenAI

from schemas import Storyboard, VoiceoverScript

_PROMPTS = Path(__file__).parent / "prompts"
_STORYBOARD_SYSTEM = (_PROMPTS / "storyboard_prompt.txt").read_text(encoding="utf-8")
_VOICEOVER_SYSTEM  = (_PROMPTS / "voiceover_prompt.txt").read_text(encoding="utf-8")

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


def generate_storyboard(
    concept: str,
    suggestion: Optional[str] = None,
    existing_storyboard: Optional[Storyboard] = None,
) -> Storyboard:
    print(f"  [LLM] Generating storyboard [{AZURE_DEPLOYMENT}]...", flush=True)

    if suggestion and existing_storyboard:
        existing_json = json.dumps(
            json.loads(existing_storyboard.model_dump_json(by_alias=True)),
            ensure_ascii=False,
            indent=2,
        )
        messages: list[dict] = [
            {"role": "user",      "content": concept},
            {"role": "assistant", "content": existing_json},
            {
                "role": "user",
                "content": (
                    "USER SUGGESTION — please refine the storyboard above:\n\n"
                    + suggestion
                    + "\n\nKeep everything that works well. "
                    "Return a new, complete storyboard JSON — not a summary or explanation."
                ),
            },
        ]
    else:
        messages = [{"role": "user", "content": concept}]

    data = _chat_json(_STORYBOARD_SYSTEM, messages)
    return Storyboard.model_validate(data)
