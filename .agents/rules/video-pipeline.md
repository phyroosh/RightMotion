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

## 2. Voice & Layered Sound Design Standard (Natural Speed + Layered SFX)
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
- **Layered Sound Design Engine (`SoundDesignEngine.tsx`):**
  - Renders frame-synced sound effects from `public/audio/sfx/`:
    - `whoosh_fast.wav` (`volume={0.35}`) — Snappy card / element reveals
    - `whoosh_deep.wav` (`volume={0.30}`) — Scene transitions & presenter entries
    - `whoosh_sparkle.wav` (`volume={0.32}`) — Revelations & perspective shifts
    - `impact_hit.wav` (`volume={0.38}`) — Heavy statements, card slams, warning guardrails
    - `whoosh_cinematic.wav` (`volume={0.35}`) — Cinematic horizon intros & climax builds
    - `mouse_click.mp3` (`volume={0.28}`) — Chip / pill activations & step ticks

## 3. GPU Hardware Acceleration Standard
Always leverage the dedicated NVIDIA RTX GPU:
- **Audio Transcription:** Run `faster-whisper` on CUDA (`device="cuda"`, `compute_type="float16"`).
- **Remotion Video Rendering:** Render with Chromium ANGLE/D3D11 GPU acceleration (`Config.setChromiumOpenGlRenderer("angle")`).

## 4. Multi-Pose Avatar System + Organic Eye Blink Engine
- **6-Pose Doctrine:**
  - `character_fullbody_pointing.png` — **Intro only** (baseHeight: 1550)
  - `character_fullbody_open.png` — **Outro only** (baseHeight: 1550)
  - `character_fullbody_casual.png` — **Intro/Outro** warm alternative (baseHeight: 1550)
  - `character_pointing.png` — **Mid-video bust** (baseHeight: 1200)
  - `character_crossed.png` — **Mid-video bust** (baseHeight: 1200)
  - `character_open.png` — **Mid-video bust** (baseHeight: 1200)
- **Judy Eye Blink Engine:**
  - Animated automatically in `CharacterKeyframeAnimator.tsx` via `public/character_*_blink.png` layers.
  - Naturally triggers every ~3.8s for an organic 4-frame blink (closing → closed → opening → open).

## 5. YouTube Studio Web UI Publisher
- Located at `studio/` (`node studio/server.js`, port 4000).
- Automatically serves `out/<topic>_video.mp4` with pre-generated viral metadata from `studio/metadata.json`.
- Dynamically adapts video player for 16:9 Widescreen and 9:16 Shorts.
- 1-click publishing via Google OAuth 2.0 and YouTube Data API v3.

---

## 6. ⚠️ MANDATORY METADATA STEP — NEVER SKIP, NEVER FALLBACK TO DEFAULTS

Every new clip MUST have its metadata entry added to `studio/metadata.json` **before or immediately after rendering**. The studio server falls back to a useless generic placeholder when no metadata exists. That is completely unacceptable.

### Metadata Entry Template
Add an entry keyed exactly as `"<topic>_video.mp4"`:

```json
"<topic>_video.mp4": {
  "topic": "<topic>",
  "title": "<Title with strong hook, 1 relevant emoji, and #Shorts — max 100 chars>",
  "description": "<Full YouTube description — see format below>",
  "tags": ["Shorts", "<3-4 core topic tags>", "Mental Health", "Psychology", "Mindset", "Personal Growth", "Self Improvement", "<2-3 specific niche tags>"],
  "categoryId": "27",
  "privacyStatus": "public"
}
```

### Title Rules (make it viral)
- **Pattern:** `<Provocative curiosity hook> <1 strong emoji> #Shorts`
- **Target:** 60–90 characters total (never exceed 100).
- **Hooks that crush it:** "Why You...", "The Real Reason...", "What Nobody Tells You About...", "This Is Why..."
- **Examples:** `Why Men & Women Handle Emotions So Differently 🧠 #Shorts`, `The Real Reason You Can't Break Bad Habits 🧠 #Shorts`

### Description Rules
The description follows this exact 5-part formula:
```
[PART 1 — HOOK, 2-3 sentences]: Mirror the opening script line. Establish the relatable human tension.

[PART 2 — INSIGHT, 2-3 sentences]: Deliver the core psychological/emotional reframe.

[PART 3 — KEY TAKEAWAY, 1-3 bullet lines]: Pull out the most shareable quote or principle. Use a 🔑 emoji.

[PART 4 — CLOSING WISDOM, 1-2 sentences]: End with warmth, not urgency. 1 fitting emoji.

[PART 5 — HASHTAGS]: Space-separated inline hashtags on the final line. 
Format: #Shorts #<MainTopic> #<Niche1> #<Niche2> #Psychology #MentalHealth #Mindset #PersonalGrowth #<Specific3> #<Specific4>
```

### Tags Rules (10–14 tags, keyword research optimised)
- Always include: `"Shorts"`, `"Mental Health"`, `"Psychology"`, `"Mindset"`, `"Personal Growth"`, `"Self Improvement"`.
- 4–6 topic-specific tags drawn from actual search queries (e.g. `"Emotional Intelligence"`, `"Gender Psychology"`, `"Atomic Habits"`, `"ADHD"`, etc.).
- No duplicates. No generic filler.

### Agent Self-Prompt for Writing Metadata
When creating metadata for a new clip, think through these questions:
1. **What is the single most surprising / counterintuitive truth in this script?** → That becomes the title hook.
2. **What is the viewer's painful relatable feeling before watching this?** → That opens the description.
3. **What is the single most retweetable/shareable sentence in the script?** → That is the 🔑 KEY TAKEAWAY.
4. **Which YouTube search queries would someone type to find this video?** → Those become the tags.
5. **What emotional state should the viewer leave with?** → That closes the description.

