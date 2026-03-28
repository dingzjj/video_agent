"""TTS synthesis via ElevenLabs API.

Install:  pip install elevenlabs
Voices:   https://elevenlabs.io/app/voice-library
Docs:     https://elevenlabs.io/docs/eleven-api/guides/cookbooks/text-to-speech

Set ELEVENLABS_API_KEY in .env.
Optionally set ELEVENLABS_VOICE_ID to override the default voice.
"""

from __future__ import annotations
import os
import subprocess
from pathlib import Path

# eleven_multilingual_v2 auto-detects language (zh, en, ja, etc.)
MODEL_ID = "eleven_multilingual_v2"
OUTPUT_FORMAT = "mp3_44100_128"

# Default voice: "Rachel" — works well for both Chinese and English.
# Override via ELEVENLABS_VOICE_ID env var, or browse voices at:
# https://elevenlabs.io/app/voice-library
DEFAULT_VOICE_ID = os.environ.get(
    "ELEVENLABS_VOICE_ID", "21m00Tcm4TlvDq8ikWAM"
)


def is_available() -> bool:
    """Return True if the elevenlabs SDK and API key are present."""
    try:
        import elevenlabs  # noqa: F401
    except ImportError:
        return False
    return bool(os.environ.get("ELEVENLABS_API_KEY"))


def synthesize_scene(text: str, output_path: Path, language: str = "zh-CN") -> bool:
    """Synthesize one scene's narration text to an MP3 file via ElevenLabs.

    `language` is accepted for API compatibility but not passed to ElevenLabs —
    eleven_multilingual_v2 detects the language automatically from the text.

    Returns True on success, False on failure (prints reason).
    """
    if not is_available():
        if not os.environ.get("ELEVENLABS_API_KEY"):
            print("  [TTS] ELEVENLABS_API_KEY not set — add it to .env")
        else:
            print("  [TTS] elevenlabs SDK not installed — run: pip install elevenlabs")
        return False

    from elevenlabs.client import ElevenLabs

    output_path.parent.mkdir(parents=True, exist_ok=True)
    client = ElevenLabs(api_key=os.environ.get("ELEVENLABS_API_KEY"))

    try:
        audio = client.text_to_speech.convert(
            voice_id=DEFAULT_VOICE_ID,
            text=text,
            model_id=MODEL_ID,
            output_format=OUTPUT_FORMAT,
        )
        with output_path.open("wb") as f:
            for chunk in audio:
                f.write(chunk)
        return True
    except Exception as exc:
        print(f"  [TTS] ElevenLabs synthesis failed: {exc}")
        return False


def merge_audio_files(audio_files: list[Path], output_path: Path) -> bool:
    """Concatenate MP3 files in order using ffmpeg.

    Returns True on success.
    """
    if not audio_files:
        return False

    output_path.parent.mkdir(parents=True, exist_ok=True)
    list_file = output_path.parent / "_concat_list.txt"
    list_file.write_text(
        "\n".join(f"file '{f.resolve()}'" for f in audio_files),
        encoding="utf-8",
    )

    result = subprocess.run(
        [
            "ffmpeg", "-y",
            "-f", "concat", "-safe", "0",
            "-i", str(list_file),
            "-c", "copy",
            str(output_path),
        ],
        capture_output=True,
        text=True,
    )
    list_file.unlink(missing_ok=True)

    if result.returncode != 0:
        print(f"  [TTS] ffmpeg merge failed:\n{result.stderr[-500:]}")
        return False
    return True


def merge_audio_into_video(
    video_path: Path,
    audio_path: Path,
    output_path: Path,
) -> bool:
    """Mix an audio track into a video file using ffmpeg.

    Video codec is copied (no re-encode). Audio is encoded as AAC.
    -shortest ensures the output stops when the shorter stream ends.

    Returns True on success.
    """
    output_path.parent.mkdir(parents=True, exist_ok=True)

    result = subprocess.run(
        [
            "ffmpeg", "-y",
            "-i", str(video_path),
            "-i", str(audio_path),
            "-map", "0:v",
            "-map", "1:a",
            "-c:v", "copy",
            "-c:a", "aac",
            "-shortest",
            str(output_path),
        ],
        capture_output=True,
        text=True,
    )

    if result.returncode != 0:
        print(f"  [TTS] ffmpeg audio merge failed:\n{result.stderr[-500:]}")
        return False
    return True
