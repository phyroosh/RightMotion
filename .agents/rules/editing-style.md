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
- **Smart Multi-Pose Switching:**
  1. `character_pointing.png` — Directing attention, opening hooks, action directives ("Do 5 minutes anyway").
  2. `character_crossed.png` — Arms crossed for analytical evaluation, addressing excuses, skepticism ("I'm just lazy", "Did you magically become disciplined?").
  3. `character_open.png` — Open palms for explaining, questioning, empathetic reframes ("You don't hate the task, you hate how it makes you feel"), and compassionate closing wisdom.
- **Visual Treatment during A-Roll:**
  - **Hero Presenter Framing:** Centered prominently (`w-[900px] h-[1080px]` in 16:9 widescreen or `w-[760px] h-[1200px]` in 9:16 Shorts).
  - **Frosted Glass Blur Backdrop:** Full-screen frosted glass blur (`backdrop-blur-3xl bg-white/40`) over smooth, gently breathing liquid mesh gradients.
  - **Zero Graphic Clutter:** Do NOT show motion graphics cards or floating diagram clutter while she is on screen.
  - **Large High-Contrast Presenter Badges (CRITICAL RULE for Mobile & 480p):** Badges and pills accompanying the presenter MUST NEVER be tiny. Use large, prominent styling: `px-12 py-5 rounded-[28px] border-[3px] shadow-2xl`, icons `w-10 h-10` to `w-12 h-12`, typography `text-2xl` to `text-3xl font-black uppercase tracking-wider`.
  - **Dynamic Camera Cuts:** Punch in slightly (`1.0x -> 1.08x`) on major breakthrough realizations.

### B-Roll Motion Graphics Shots (Single-Concept Visual Metaphors)
- **When it appears:** During all intermediate explanatory scenes, comparisons, examples, and breakdowns.
- **Avatar is completely hidden:** She slides out smoothly.
- **Single-Focused Statement Pacing:** Spotlight **one** hero prop or visual metaphor at a time that mirrors the exact words being spoken. Animate in on beat, hold for comprehension, and morph/whoosh cleanly to the next concept.

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
