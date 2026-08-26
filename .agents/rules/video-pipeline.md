# Video Production Pipeline & Automation Architecture

This document defines the permanent file structure, hardware acceleration standards, and publishing pipeline for RightClips.

## 1. Directory Structure

```
src/clips/<short_topic>/
├── index.tsx          # Composition entrypoint with +30% VO and SFX
├── Canvas.tsx         # B-Roll single-concept After Effects motion graphics
├── Presenter.tsx      # A-Roll hero avatar with smart multi-pose switching
├── Background.tsx     # Pure studio light & gentle liquid mesh gradient orbs
└── transcript.json    # Word-level timestamps from GPU Whisper

public/<short_topic>/
└── voiceover.mp3      # Fast-paced female neural voiceover (+8% rate)

public/
├── character_pointing.png  # Pointing / Attention / Intro pose
├── character_crossed.png   # Arms crossed / Analytical / Skeptical pose
├── character_open.png      # Open hands / Explaining / Compassionate pose
└── audio/
    └── sfx/               # mouse_click.mp3 tactile SFX for key visual triggers
```

## 2. Voice & Audio Mixing Standard (Natural Speed + Zero Awkward Pauses)
- **Voiceover Persona:** Female Neural Voice (`en-US-JennyNeural` via Edge-TTS) with natural conversational speed (`rate="+0%"` or natural rate). **DO NOT artificially speed up her voice.**
- **Mandatory Silence / Pause Compression (CRITICAL RULE):**
  - Raw Neural TTS naturally inserts long, sluggish pauses (500ms–1000ms) between paragraphs and sentences.
  - **Always** run the pause-trimming filter (`ffmpeg silenceremove=stop_periods=-1:stop_duration=0.18:stop_threshold=-35dB:detection=peak` or `voiceover_engine.py`) to compress inter-sentence dead air to a tight, natural 150ms–180ms gap.
  - Remove triple ellipses (`…` -> `,`) and normalize double linebreaks to prevent the TTS engine from freezing.
  - Transcribe timestamps on the pause-trimmed audio for frame-accurate word sync.
- **Voiceover Boost:** Set `volume={1.3}` (+30% boost for crisp presence).
- **Background Music (BGM):**
  - **Shorts (9:16):** Permanently include subtle BGM from `public/audio/bgm/` (`volume={0.12}` with 1s fade-in/fade-out).
  - **Long-Form (16:9):** Omit BGM by default unless requested.
- **Tactile Click SFX:** Set `volume={0.28}` on key visual triggers.

## 3. GPU Hardware Acceleration Standard
Always leverage the dedicated NVIDIA RTX GPU:
- **Audio Transcription:** Run `faster-whisper` on CUDA (`device="cuda"`, `compute_type="float16"`).
- **Remotion Video Rendering:** Render with Chromium ANGLE/D3D11 GPU acceleration (`Config.setChromiumOpenGlRenderer("angle")`).

## 4. Multi-Pose Avatar Switching
- `character_pointing.png` — Intros, direct takeaways, action triggers.
- `character_crossed.png` — Questioning excuses, skeptical analysis, evaluating problem.
- `character_open.png` — Core revelations, compassionate reframes, closing wisdom.

## 5. YouTube Studio Web UI Publisher
- Located at `studio/` (`node studio/server.js`, port 4000).
- Automatically serves `out/<topic>_video.mp4` with pre-generated viral metadata from `studio/metadata.json`.
- Dynamically adapts video player for 16:9 Widescreen and 9:16 Shorts.
- 1-click publishing via Google OAuth 2.0 and YouTube Data API v3.
