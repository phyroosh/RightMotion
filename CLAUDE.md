# RightMotion AI Agent Guidelines

Please read `AGENTS.md` for the complete video generation engine specification.

## Quick CLI Command
To generate a video and 4K thumbnail end-to-end from a script:
```bash
python scripts/create_clip.py --name "<clip_name>" --topic "<topic_name>" --script "<script_text>" --format "shorts"
```

## Golden Rules
1. **Shorts Video**: 1080x1920 (9:16), Judy character animations, kinetic captions, tactile SFX, Apple mesh background.
2. **Shorts Thumbnail**: 1080x1920 (9:16), Judy centered bottom-half, NO scrim fade over character, NO footer text, glowing high-contrast highlight pill.
3. **Long-Form Video**: 1920x1080 (16:9), solid color background with 3D camera keyframes, left text / right Judy split.
4. **Studio Dashboard**: http://localhost:4000
