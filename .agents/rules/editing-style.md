# Editing Style — Read This As My Voice, Not A Spec Sheet

I'm a professional motion editor. Everything below is me talking you through
exactly how I think about a cut, the way I'd brief a junior editor sitting
next to me. Don't treat this as a checklist to tick off — treat it as taste
you're absorbing. If a scene technically satisfies every rule below but still
*feels* like a template, it's wrong. Redo it.

## 0. The Bar
Think like an After Effects and Premiere Pro motion graphics editor first! Every visual element exists to help the viewer vividly imagine the exact statement coming out of the host's mouth in real-time. Never clutter the screen with static multi-card lists or overwhelming simultaneous panels. Keep it fast-paced, punchy, visually dynamic, yet clean, readable, and watchable.

## 1. Professional A-Roll vs B-Roll Pacing (The Presenter Formula)
Never squish the avatar in a corner or have graphics fighting for space on screen with the avatar. We edit like a top-tier video essayist with distinct A-Roll and B-Roll rhythm:

### A-Roll Presenter Shots (The Human Connection)
- **Voice Character:** Always use the female neural network voice (`en-US-JennyNeural` with natural conversational speed `rate="+0%"`, DO NOT speed up the voice) matching Judy.
- **Smart Multi-Pose Switching — 6-Pose System:**

  **BUST CUTOUTS (mid-video explanatory A-Roll):**
  1. `character_pointing.png` — Directing attention, hooks, action directives.
  2. `character_crossed.png` — Arms crossed for analytical evaluation, skepticism, addressing excuses.
  3. `character_open.png` — Open palms for explaining, questioning, empathetic reframes, compassionate wisdom.

  **FULL BODY (intro hook & outro finale ONLY — the money shots):**
  4. `character_fullbody_pointing.png` — Confident pointing up, strong for opening hooks and calls to action.
  5. `character_fullbody_open.png` — Both palms open/shrug, empathetic outros, question-framing moments.
  6. `character_fullbody_casual.png` — Touching hair, relaxed and warm — humanizing bookend moments.

  **⚠️ FULL BODY DOCTRINE — THIS IS THE STANDARD STRUCTURE:**
  - **Intro (~first 3-5s):** Use `fullbody_pointing` or `fullbody_casual`. She appears full body, centered and impactful, welcoming the viewer in.
  - **Mid-video explanatory A-Roll (scattered throughout):** Switch to bust cutouts (`pointing`, `crossed`, `open`) as she slides in/out. These feel more dynamic and tight for mid-explanation punches.
  - **Outro (~last 3-5s):** Return to `fullbody_open` or `fullbody_casual`. She reappears full body for the emotional send-off.
  - **Bust `baseHeight`:** Keep `baseHeight={1200}` as before — she appears waist-up, filling the lower portion.
- **Visual Treatment during A-Roll:**

  **⚠️ CRITICAL PERMANENT LAYOUT RULE — ALWAYS USE `CharacterKeyframeAnimator` — NEVER DEVIATE:**
  - The Presenter component wrapper MUST be `className="absolute inset-0 pointer-events-none z-30 flex flex-col items-center justify-end overflow-hidden"`. The `justify-end` anchors the character to the BOTTOM of the frame so she grows upward naturally. NEVER use absolute `top-[X%]` to position the character.
  - **Full body intro/outro keyframe sets:** use `baseHeight={1550}` so the full body image fills more of the frame. **Bust cutout mid-video keyframe sets:** use `baseHeight={1200}`. You can conditionally switch the rendered `CharacterKeyframeAnimator`'s height by tracking the current segment's pose type, or simply render two separate `CharacterKeyframeAnimator` groups — one for full body, one for busts — each with their own keyframes and heights.
  - Keyframes control entrance/exit via `y` (start `y: 80` → `y: 0` = slides up from below) and `opacity` (0 → 1). Scale subtly (`1.0 → 1.06`) during the hold for cinematic push-in.
  - ALWAYS pass `currentMs` as a prop from the composition (`index.tsx`). Compute it there: `const currentMs = (frame / fps) * 1000;`.
  - **Canonical Reference:** Always copy the structure from `src/clips/goggins/Presenter.tsx`. That is the gold standard.

  **⚠️ CRITICAL BADGE RULE — Apple Glass Style ONLY:**
  - Presenter scene badges MUST use `apple-glass` CSS class. NEVER use colored `bg-gradient-to-r` pill buttons on the presenter screen.
  - Correct badge: `<div className="absolute top-[13%] apple-glass flex items-center border-[5px] border-[accent-color] shadow-2xl z-40" style={{ padding: "26px 60px", borderRadius: 48, gap: 24 }}>`
  - Badge icon: Lucide icon at `style={{ width: 60, height: 60 }}`.
  - Badge text: `<span className="text-slate-950 font-black tracking-wider uppercase" style={{ fontSize: 44 }}>TITLE</span>`

  - **Frosted Glass Blur Backdrop:** `<div className="absolute inset-0 backdrop-blur-2xl bg-white/35 pointer-events-none" />` inside the presenter wrapper, behind the character.
  - **Soft Ambient Halo:** `absolute bottom-0 left-1/2 -translate-x-1/2 w-[850px] h-[850px] rounded-full blur-[120px]` radial gradient glow behind the character feet.
  - **Zero Graphic Clutter:** Do NOT show motion graphics cards or floating diagram clutter while she is on screen.
  - **Dynamic Camera Cuts:** Punch in slightly (`scale: 1.0 → 1.08` in keyframes) on major breakthrough realizations.

### B-Roll Motion Graphics Shots (Single-Concept Visual Metaphors)
- **When it appears:** During all intermediate explanatory scenes, comparisons, examples, and breakdowns.
- **Avatar is completely hidden:** She slides out smoothly.
- **Single-Focused Statement Pacing:** Spotlight **one** hero prop or visual metaphor at a time that mirrors the exact words being spoken. Animate in on beat, hold for comprehension, and morph/whoosh cleanly to the next concept.

**⚠️ CRITICAL PERMANENT MOBILE CANVAS & TYPOGRAPHY STANDARDS (iPhone 11 Small-Display Rule):**
- **Spacious Canvas Bounds**: Never clamp cards into narrow horizontal widths (`w-[980px] - w-[1020px]`, `px-6` margin). Never cram items into tiny vertical bands at the top; use the full vertical clearance from `top: 15%` to `top: 76%` (~1150px above captions).
- **Zero Tiny Text**: NEVER use `text-xs` (12px), `text-sm` (14px), or `text-[10px]` anywhere in Remotion video compositions.
- **Strict Mobile Font Scale**:
  - Main titles: `48px - 58px` (`text-5xl`), `font-black`.
  - Item labels: `32px - 40px` (`text-2xl` to `text-3xl`), `font-black`.
  - Badges & chips: **MINIMUM 24px - 30px** (`text-xl font-black` or `text-2xl font-black`).
  - Icons: `w-8 h-8` to `w-10 h-10` icons inside `w-14 h-14` to `w-16 h-16` badge pedestals.
  - Script quotes: `28px - 36px` (`text-3xl font-serif italic font-black`).

**⚠️ CRITICAL PERMANENT MOTION GRAPHICS RULE — USE `MotionKeyframeBox` (NO CSS TRANSITIONS):**
- **NEVER use Tailwind/CSS `transition-all duration-X` or CSS keyframe animations for video elements.** In Remotion's frame-by-frame rendering, CSS transitions produce stuttering and jumping when booleans or timestamps change.
- **Always animate cards, chips, badges, and meters with `<MotionKeyframeBox currentMs={currentMs} keyframes={[...]} />`** from `src/components/MotionKeyframeBox.tsx`.
- Define continuous mathematical keyframe tracks: `[{ timeMs: enterMs, opacity: 0, scale: 0.92, y: 40 }, { timeMs: holdStart, opacity: 1, scale: 1.0, y: 0 }, { timeMs: holdEnd, opacity: 1, scale: 1.02, y: -4 }, { timeMs: exitMs, opacity: 0, scale: 0.94, y: 30 }]`.
- For numeric values (progress bars, widths, opacities, counter values), use `interpolateTrack(currentMs, points)` for buttery-smooth cubic bezier interpolation across every exported frame.

## 2. Think in tactile props, not generic panels
Stop reaching for static rounded-rectangle info-cards as your default unit. Physical, tactile objects are the hero of the frame:
- Room cleaning brush / phone mockup / video playcard / expanding folder tree.
- Digital countdown stopwatches with rapidly spinning red digits for time slips.
- Glowing night clocks with ticking second hands at 11:47 PM.
- Objects placed with soft dimensional drop shadows and subtle tilt (`rotate: -3deg to 3deg`).

## 3. Hand-annotated callouts
Use handwriting-style script with small hand-drawn accents directly on the object:
- Script/marker font (`font-serif italic font-black text-[#0071e3]`).
- Use sparingly — one impactful observation per beat.

## 4. Ghost typography
A massive, ultra-bold, low-opacity keyword sits behind headline text at ~4-6% opacity, bleeding off the frame edge for editorial texture.

## 5. Color Palettes
- **Cool Apple Studio (Default):** `#f8fafc` base, icy blues (`#0071e3`), sky blue, indigo, emerald accents, frosted glass.
- **Warm Editorial:** `#f5ecd7` warm cream base, muted red accents, paper texture, charcoal text.

## 6. Motion & Spring Physics
- Continuous slow cinematic push-in: `scale 1.00 -> 1.04` across the video.
- Snappy, responsive springs: `damping: 18, mass: 0.8, stiffness: 110`. Fast-paced and buttery without sluggish delay.

## 7. Audio Mixing & Sound Design Standards
1. **Voiceover Track (Hero Speech — Natural Pace & Zero Dead Air):**
   - **Voice Persona:** Natural female neural voice (`en-US-JennyNeural`, `rate="+0%"` / natural rate). **Do NOT artificially speed up her voice.**
   - **Mandatory Silence / Pause Compression:** Strip out sluggish inter-sentence dead air using the neural pause-compression filter (`silenceremove` capping gaps at ~150ms–180ms) so sentences connect fluidly and conversationally without stalling.
   - **Boost overall volume by +30%** (`volume={1.3}`) for high clarity and commanding presence.
2. **Background Music (BGM):**
   - **For Short-Form Videos (9:16 Shorts):** **ALWAYS and PERMANENTLY include gentle BGM** from `public/audio/bgm/` (`the_mountain-piano-documentary-567436.mp3` or `monume-documentary-documentary-music-547923.mp3`) at a subtle volume (`volume={0.12}` with 1s fade-in and 1s fade-out) so the narration remains commanding while the short stays energetic.
   - **For Long-Form Video Essays (16:9):** Omit BGM by default to maintain conversational documentary focus (unless explicitly requested).
3. **Tactile Mouse Click SFX:**
   - Source: `public/audio/sfx/mouse_click.mp3` at `volume={0.28}` on key visual trigger moments.

## 8. Captions
- Centered in the lower third (`bottom-[16%]` for 9:16 Shorts, `bottom-[10%]` for 16:9 Long-form), max-width 800px-1200px.
- 2–4 words per chunk with natural pause holds.
- Active word in bold `#0071e3` with soft glow shadow and subtle scale `1.04`.

## 9. Long-Form 16:9 Video Essay Architecture (Masterclass Videos)
For long-form YouTube essays (5–15+ minutes):
- **Resolution & Aspect Ratio:** Full 16:9 widescreen (`1920×1080`, 30fps).
- **Minimal Chapter Navigation:**
  - Sleek Apple Glass progress line along the top edge showing overall progress.
  - Animated top-left chapter badges (`CHAPTER 0X • TITLE`).
  - **No clutter in top-right** (avoid decorative series tags).
- **Fast-Paced Sequential Visual Flow:**
  - One concept at a time, moving in lockstep with the host's spoken words.
