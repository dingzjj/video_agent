#!/bin/bash
set -e

echo "=== Knowledge Video Agent Setup ==="
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo ""
echo "[1/3] Installing Python dependencies..."
pip3 install -r "$ROOT/requirements.txt" -q

echo ""
echo "[2/3] Installing Node.js dependencies (Remotion)..."
cd "$ROOT/video"
npm install --prefer-offline 2>&1 | tail -5

echo ""
echo "[3/3] Creating workspace directories..."
mkdir -p "$ROOT/workspace/assets" "$ROOT/workspace/output"
mkdir -p "$ROOT/video/public/assets"

# Create placeholder storyboard so Remotion Studio can start
if [ ! -f "$ROOT/video/public/storyboard.json" ]; then
  cat > "$ROOT/video/public/storyboard.json" << 'PLACEHOLDER'
{
  "title": "Sample Video",
  "total_duration_seconds": 10,
  "fps": 30,
  "resolution": {"width": 1920, "height": 1080},
  "theme": {
    "primary_color": "#1E3A5F",
    "accent_color": "#4CAF50",
    "background_color": "#0D1B2A",
    "font_family": "Inter",
    "text_color": "#FFFFFF"
  },
  "scenes": [
    {
      "id": "scene_0",
      "type": "title",
      "duration_seconds": 5,
      "animation": "fade_zoom_in",
      "image_query": null,
      "asset_path": null,
      "title": "Knowledge Video Agent",
      "subtitle": "Run: python -m orchestrator.main \"your concept here\""
    },
    {
      "id": "scene_1",
      "type": "outro",
      "duration_seconds": 5,
      "animation": "fade_in_center",
      "image_query": null,
      "asset_path": null,
      "message": "Powered by Claude claude-opus-4-6 + Remotion"
    }
  ]
}
PLACEHOLDER
fi

echo ""
echo "=== Setup complete! ==="
echo ""
echo "Quick start:"
echo "  1. Copy .env.example to .env and add your ANTHROPIC_API_KEY"
echo "  2. cd $ROOT && python -m orchestrator.main \"Explain neural networks\""
echo "  3. Or preview in browser: cd video && npx remotion studio"
echo ""
