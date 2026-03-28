"""Unsplash image retrieval — downloads one image per scene that has an image_query."""

from __future__ import annotations
import os
import re
import urllib.request
from pathlib import Path
from typing import Optional

import requests

UNSPLASH_API = "https://api.unsplash.com"
PLACEHOLDER_URL = "https://picsum.photos/1280/720"  # fallback if no API key


def _sanitize(s: str, maxlen: int = 30) -> str:
    return re.sub(r"[^a-z0-9_]", "_", s.lower())[:maxlen]


def fetch_image(query: str, scene_id: str, dest_dir: Path) -> Optional[Path]:
    """Search Unsplash (or use placeholder) and download an image. Returns local path."""
    dest_dir.mkdir(parents=True, exist_ok=True)
    filename = dest_dir / f"{scene_id}_{_sanitize(query)}.jpg"

    if filename.exists():
        return filename  # cached

    access_key = os.environ.get("UNSPLASH_ACCESS_KEY", "")

    if access_key:
        try:
            resp = requests.get(
                f"{UNSPLASH_API}/search/photos",
                params={"query": query, "per_page": 1, "orientation": "landscape"},
                headers={"Authorization": f"Client-ID {access_key}"},
                timeout=10,
            )
            resp.raise_for_status()
            results = resp.json().get("results", [])
            if results:
                img_url = results[0]["urls"]["regular"]
                _download(img_url, filename)
                return filename
        except Exception as e:
            print(f"    Unsplash failed for '{query}': {e}. Using placeholder.", flush=True)

    # Fallback: picsum placeholder
    _download(f"{PLACEHOLDER_URL}?random={abs(hash(query)) % 1000}", filename)
    return filename


def _download(url: str, dest: Path) -> None:
    urllib.request.urlretrieve(url, dest)


def fetch_all_images(scenes: list, dest_dir: Path) -> dict[str, str]:
    """
    For every scene with image_query, download and return mapping:
      {scene_id -> relative asset path (relative to video/public/)}
    """
    mapping: dict[str, str] = {}
    for scene in scenes:
        if scene.image_query:
            print(f"    [{scene.id}] Fetching: {scene.image_query}", flush=True)
            local_path = fetch_image(scene.image_query, scene.id, dest_dir)
            if local_path:
                mapping[scene.id] = str(local_path)
    return mapping
