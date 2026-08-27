# 🎬 RightClips Autonomous AI Agent Engine Guide

This document is the **authoritative specification** for any AI Agent (Antigravity/AGY, Claude Code, Cursor, Copilot, ChatGPT) working in the **RightClips** repository.

When a user provides a script and says:
> *"Here is the script to generate the short video: <script text>"* or *"Generate a long-form video for: <script text>"*

Follow this exact automated pipeline to generate the voiceover, word timestamps, Remotion composition, 4K thumbnail, and final MP4 render without needing additional user explanation.

---

## 🛠️ High-Speed Video Generation Pipeline

You can run the automated master CLI script or follow the 5 core steps below:

### Option A: Master CLI Generator (Instant All-in-One)
```bash
python scripts/create_clip.py --name "<clip_name>" --topic "<topic_name>" --script "<script_text>" --format "shorts"
```
*(Options: `--format shorts` for 9:16 vertical or `--format longform` for 16:9 widescreen)*

---

### Option B: Step-by-Step Production Process

#### Step 1: Synthesize Neural Voiceover Audio & Word-Level Timestamps
Synthesize the voiceover with `edge-tts` (`en-US-AvaNeural`) and extract GPU/CPU millisecond timestamps using `faster-whisper`:
- Audio output: `public/<name>/voiceover.mp3`
- Transcript output: `src/clips/<name>/transcript.json`

```python
# Script template:
import edge_tts, asyncio, json
from faster_whisper import WhisperModel

# 1. TTS
communicate = edge_tts.Communicate(text=SCRIPT_TEXT, voice="en-US-AvaNeural", rate="+3%")
await communicate.save("public/<name>/voiceover.mp3")

# 2. Whisper Word Timestamps (ms)
model = WhisperModel("base.en", device="cuda" if can_cuda else "cpu")
segments, _ = model.transcribe("public/<name>/voiceover.mp3", word_timestamps=True)
words = [{"word": w.word.strip(), "start": round(w.start * 1000), "end": round(w.end * 1000)} for s in segments for w in s.words]
json.dump(words, open("src/clips/<name>/transcript.json", "w"), indent=2)
```

#### Step 2: Scaffold the Clip Component Directory (`src/clips/<name>/`)
Create 4 modular files:
1. `Background.tsx`: Clean Apple Studio mesh background (`bg-[#f8fafc]` with subtle amber/indigo ambient orbs and dot-grid).
2. `Canvas.tsx`: High-retention motion graphics storyboard illustrating the core psychological models (Comparison cards, Progress meters, Diagnostic badges, Micro-action blueprints).
3. `Presenter.tsx`: Judy multi-pose animations (`character_pointing.png`, `character_talking.png`, `character_casual.png`, `character_open.png`) with Apple Glass floating badges.
4. `index.tsx`: Main Composition uniting voiceover, BGM, **PRO MULTI-SFX layer** (see below), `AppleProgressBar`, and `AppleKineticCaptions`.

**🔊 PRO SOUND DESIGN RULE (MANDATORY — PERMANENT):**
Every `index.tsx` MUST include a full multi-SFX layer auto-calculated from the video duration. **NEVER use only one SFX.** The rules:

| Position | SFX File | Volume | Why |
|---|---|---|---|
| Frame 0 (intro) | `audio/sfx/whoosh_fast.wav` | 0.32 | Energetic swipe-in opening |
| Every scene change (~4.5s apart) | `audio/sfx/mouse_click.mp3` | 0.28 | Tactile UI feedback at visual beat |
| Emotional peak (~60% of duration) | `audio/sfx/impact_hit.wav` | 0.22 | Cinematic gut-punch at key insight |
| Finale (~2.5s before end) | `audio/sfx/whoosh_sparkle.wav` | 0.30 | Triumphant sparkle outro |
| Climax fallback (if no peak assigned) | `audio/sfx/whoosh_deep.wav` | 0.20 | Deep whoosh at emotional climax |

**Available SFX** (`public/audio/sfx/`): `mouse_click.mp3`, `impact_hit.wav`, `whoosh_cinematic.wav`, `whoosh_deep.wav`, `whoosh_fast.wav`, `whoosh_sparkle.wav`

The `scripts/create_clip.py` auto-generates all SFX Sequences correctly. If writing `index.tsx` manually, calculate `SFX_FRAMES` like this:
```tsx
// Auto-calculated at ~4.5s intervals; whoosh_fast opens, impact_hit at 60%, whoosh_sparkle closes
const SFX_FRAMES = [0, 135, 270, 405, ...]; // frame = Math.round(sec * 30)
```

#### Step 3: Register in `src/Root.tsx`
1. Add `<Composition id="<Name>Video" component={<Name>Composition} durationInFrames={duration} fps={30} width={1080} height={1920} />`
2. Add `<Still id="<Name>Thumbnail" component={<Name>Thumbnail} width={1080} height={1920} />`

#### Step 4: Register 4K Thumbnail in `src/thumbnails/index.tsx`
Use the high-converting `ThumbnailCard`:
```tsx
export const <Name>Thumbnail: React.FC = () => (
  <ThumbnailCard
    title="<PUNCHY ALL-CAPS TITLE>"
    highlightWord="<KEYWORD>"
    highlightColor="rose" // amber | rose | emerald | sky | purple | yellow
    subtitle="<Key Curiosity Hook Subtitle>"
    categoryBadge="<CATEGORY>"
    characterPose="character_fullbody_pointing.png"
    characterScale={1.0}
    theme="obsidian" // obsidian | crimson | slate | purple | emerald | amber | blue
    aspectRatio="9:16" // 9:16 for Shorts, 16:9 for Long-Form
    extraBadge="<EXTRA TAG>"
  />
);
```

#### Step 5: Render Video & 4K Thumbnail
```bash
# Render 4K Still Thumbnail
cmd /c "npx remotion still src/index.ts <Name>Thumbnail out/<name>_video_thumbnail.png --overwrite"

# Render Full Video MP4
cmd /c "npx remotion render src/index.ts <Name>Video out/<name>_video.mp4 --concurrency=4 --overwrite"
```

#### Step 6: Add Metadata to `studio/metadata.json`
Add the viral title (with `#Shorts`), high-CTR description, category (`27` Education), and SEO tags so it instantly appears in the Studio Web Dashboard (`http://localhost:4000`).

---

## 🎨 Golden Rules of Editing

### 📱 9:16 Shorts (Vertical)
1. **Aspect Ratio**: Always `1080x1920` (9:16) at `30fps`.
2. **Character Placement**:
   - **Thumbnails**: Judy MUST be centered bottom-half (`left: 50%, transform: translateX(-50%)`), full-body grounded with NO text scrim fading over her upper body and NO footer clutter at the bottom.
   - **Video Presenter**: Judy cutouts enter with buttery spring animations, float keyframes, and frosted backdrop glass.
3. **Captions**: Central `AppleKineticCaptions` with neon-blue active word pill glow.
4. **Sound Design**: Tactile mouse click SFX at each visual shift; ducked ambient documentary BGM.

### 🎬 16:9 Long-Form (Widescreen)
1. **Aspect Ratio**: Always `1920x1080` (16:9) at `30fps`.
2. **Composition**: Side-by-side layout (Left 60% Text/Graphics, Right 40% Judy Presenter).
3. **Color Background**: Solid dark themes (Obsidian, Crimson, Slate) with mathematical 3D After Effects camera keyframe tracking.
4. **Chapters**: Full chapter navigation timeline.

---

## 🌐 Studio Dashboard & YouTube Automation
- Run `start_studio.bat` or `npm run studio` to launch the local studio at `http://localhost:4000`.
- The studio automatically attaches 4K thumbnails, schedules native YouTube releases, and syncs upload states.
