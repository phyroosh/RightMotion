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
4. `index.tsx`: Main Composition uniting voiceover, BGM, **PRO MULTI-SFX layer** (see below), `AppleProgressBar`, `AppleKineticCaptions`, and **FRAME 0 THUMBNAIL COVER** (see below).

**🖼️ FRAME 0 THUMBNAIL COVER (PERMANENT RULE FOR 9:16 SHORTS):**
- YouTube Shorts automatically captures the frame at `0:00` (Frame 0) as the video's default thumbnail cover on YouTube Studio and the Shorts feed.
- Every vertical Shorts composition `index.tsx` MUST include the high-converting 4K ThumbnailCard at `frame === 0`:
```tsx
{/* 0. High-Converting 4K Thumbnail First-Frame (Captured automatically by YouTube Shorts) */}
{frame === 0 && (
  <div className="absolute inset-0 w-full h-full z-50 pointer-events-none">
    <<Name>Thumbnail />
  </div>
)}
```

**🔊 SOUND DESIGN POLICY (RICH, EVENT-DRIVEN, MULTI-SFX SUITE — PERMANENT):**
- **Never spam or force SFX blindly based on math timers or duration intervals.**
- **ONLY trigger an SFX when an actual visual element moves or enters the screen** (e.g. Presenter slide-in, Storyboard Card pop, Diagnostic hit, Solution sparkle).
- **Leverage the full `public/audio/sfx/` library via `SoundDesignEngine`**:
  - `whoosh_deep` / `whoosh_fast`: Presenter & major scene slide-ins (`volume: 0.30 - 0.34`)
  - `impact_hit`: Core problem statements, diagnostic warnings, contrast slams (`volume: 0.20 - 0.24`)
  - `click`: Tactile Apple-style UI chips, badges, checklist micro-actions (`volume: 0.24 - 0.28`)
  - `whoosh_sparkle`: Key psychological revelations, neural rewiring, solutions, positive insights (`volume: 0.30 - 0.35`)
  - `whoosh_cinematic`: Dramatic mid-video turning points or high-contrast structural pivots (`volume: 0.32 - 0.35`)
- Keep all SFX ducked under the voiceover and strictly tied to visual elements in `Presenter.tsx` and `Canvas.tsx`.

```tsx
import { SoundDesignEngine, SfxCue } from "../../components/SoundDesignEngine";

const SFX_CUES: SfxCue[] = [
  { frame: 0,   type: "whoosh_deep",    volume: 0.32 }, // Intro Presenter entrance
  { frame: 12,  type: "click",          volume: 0.26 }, // Topic Badge spring pop
  { frame: 144, type: "whoosh_fast",    volume: 0.34 }, // Storyboard Card entrance
  { frame: 170, type: "impact_hit",     volume: 0.22 }, // Problem diagnostic reveal
  { frame: 450, type: "whoosh_sparkle", volume: 0.32 }, // Core solution insight
  { frame: 825, type: "whoosh_sparkle", volume: 0.35 }, // Finale Presenter Re-Entry
];
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
2. **Visual Metaphors & Canvas Proportions (CRITICAL FOR RETENTION & MOBILE READABILITY — PERMANENT)**:
   - **Spacious Vertical & Horizontal Canvas Bounds (iPhone 11 Small-Display Rule)**:
     - Always use wide, comfortable card bounds (`width: 980px - 1020px`, `max-w-[1000px]`, `px-6` margin).
     - NEVER vertically compress or squish elements into tiny narrow bands at the top. The vertical safe focal zone extends from `top: 15%` down to `top: 76%` (~1150px of vertical space above captions).
     - Utilize generous vertical padding (`p-10 - p-12`, `gap-6 - gap-8`) and large row heights (`min-h-[100px] - min-h-[120px]`).
   - **Large Mobile Typography Standard (ABSOLUTELY NO TINY TEXT — PERMANENT)**:
     - Every viewer on a 5.8"-6.1" phone (e.g. iPhone 11) must read all text effortlessly.
     - **Card Titles & Headers**: `48px - 58px` (`text-5xl`), `font-black`.
     - **Primary Row Labels & Items**: `32px - 40px` (`text-2xl` to `text-3xl`), `font-black`.
     - **Badges, Tags, Chips & Category Pills**: **MINIMUM 24px - 30px** (`text-xl` / `text-2xl`, `font-black`), NEVER `text-xs` (12px), `text-sm` (14px), or `text-[10px]`.
     - **Handwritten / Script Accents**: `28px - 36px` (`text-3xl font-serif italic font-black`).
     - **Icons**: Minimum `w-8 h-8` to `w-10 h-10` inside `w-14 h-14` to `w-16 h-16` icon pedestals.
   - **ZERO Paragraphs or Tiny Subtext**: Never fill cards with long sentences, sub-bullets, or textbook explanations. The voiceover speaks the story and captions display the words. The canvas must communicate visually through **cinematic graphic metaphors** (circular orbit loops, overload meters, laser slice cuts, branching neural highways, tactile switches).
   - **Creative, Gentle, Clean & Minimal (MANDATORY AGENT DIRECTIVE)**:
     - Approach every script with **high visual creativity**, crafting tailored diagrams and metaphors for the core psychological models.
     - **Do NOT force or clutter**: Keep layouts gentle, instantly understandable, professional, and very minimal with generous breathing room and clean Apple Studio aesthetics.

3. **Advanced Mathematical Keyframe System (SMOOTH MOTION STANDARD — PERMANENT)**:
   - **Mass-Spring-Damper Physics**: Animate all elements using exact spring mechanics (`damping: 18 - 22`, `stiffness: 85 - 110`, `mass: 0.8 - 1.0`) for organic, buttery overshoot and smooth physical settling.
   - **Continuous Mathematical Camera Momentum**: Apply continuous logarithmic camera push (`scale: 1.00 ➔ 1.05`) paired with subtle harmonic floating oscillations (`Math.sin(frame * 0.03) * 4px`) so the frame possesses continuous organic life.
   - **Multi-Property Mathematical Coupling**: Always couple `translateY`, `scale`, `opacity`, and `rotate` through synchronized mathematical easing curves so elements move as unified physical objects with real inertia.

4. **Character Placement**:
   - **Thumbnails**: Judy MUST be centered bottom-half (`left: 50%, transform: translateX(-50%)`), full-body grounded with NO text scrim fading over her upper body and NO footer clutter at the bottom.
   - **Video Presenter**: Judy cutouts enter with buttery spring animations, float keyframes, and frosted backdrop glass.

5. **Captions**: Central `AppleKineticCaptions` with neon-blue active word pill glow.

6. **Sound Design (Professional, Measured & Event-Driven — 10/10 Standard)**:
   - Rich multi-SFX suite via `SoundDesignEngine` (`whoosh_deep` / `whoosh_fast` on scene pivots, `impact_hit` on diagnostic problem reveals, `click` on badge/chip springs, `whoosh_sparkle` on breakthroughs & finale return).
   - Tied 1-to-1 to visual shifts; keep audio crisp, ducked, and non-cluttered so it feels documentary-grade.

### 🎬 16:9 Long-Form (Widescreen)
1. **Aspect Ratio**: Always `1920x1080` (16:9) at `30fps`.
2. **Composition**: Side-by-side layout (Left 60% Text/Graphics, Right 40% Judy Presenter).
3. **Color Background**: Solid dark themes (Obsidian, Crimson, Slate) with mathematical 3D After Effects camera keyframe tracking.
4. **Chapters**: Full chapter navigation timeline.

---

## 🌐 Studio Dashboard & YouTube Automation
- Run `start_studio.bat` or `npm run studio` to launch the local studio at `http://localhost:4000`.
- The studio automatically attaches 4K thumbnails, schedules native YouTube releases, and syncs upload states.
