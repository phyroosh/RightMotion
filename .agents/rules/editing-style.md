# Editing Style — Read This As My Voice, Not A Spec Sheet

I'm a professional motion editor. Everything below is me talking you through
exactly how I think about a cut, the way I'd brief a junior editor sitting
next to me. Don't treat this as a checklist to tick off — treat it as taste
you're absorbing. If a scene technically satisfies every rule below but still
*feels* like a template, it's wrong. Redo it.

## 0. The Bar
Think like an After Effects and Premiere Pro motion graphics editor first! Every visual element exists to help the viewer vividly imagine the exact statement coming out of the host's mouth in real-time. Never clutter the screen with static multi-card lists or overwhelming simultaneous panels. Keep it fast-paced, punchy, visually dynamic, yet clean, readable, and watchable.

## 1. The Cutout Asset Engine (Tactile Physical Props)
**Stop using plain text boxes as your default visual.** We have 45 indexed high-impact cutouts in `public/assets/`.
- **Always view the visual catalog first:**
  - `public/assets/visual_catalog_1.png` (Psychology & Burnout)
  - `public/assets/visual_catalog_2.png` (Devices, Relationships & Habits)
  - `public/assets/registry.json`
- **Use `<ProCutout />` and `<PropComparison />`** to instantly anchor the viewer's attention with 3D brains, dopamine meters, phone overload streams, locked cages, and mindful gratitude sparks.

## 2. Professional A-Roll vs B-Roll Pacing (The Presenter Formula)
Never squish the avatar in a corner or have graphics fighting for space on screen with the avatar. We edit like a top-tier video essayist with distinct A-Roll and B-Roll rhythm:

### A-Roll Presenter Shots (The Human Connection)
- **Voice Character & Runtime:** Solo Judy (default) uses `en-US-AvaMultilingualNeural` at `rate="+8%"` with strict **20–24s runtime** (55–70 words). Conversational Duo is triggered **ONLY** when `{andrew}` or `--andrew` is explicitly passed, pairing Judy with Andrew (`en-US-SteffanNeural` at `rate="+7%"`) and allowing **up to 40s runtime** (~80–115 words).
- **Screen-Intimate Framing Rule (PERMANENT ARCHIVE OF FAR FULL-BODY AVATARS):**
  - Never use far head-to-toe full-body avatars. They make characters feel disconnected on mobile screens. Full-body files are archived in `public/archive_avatars/`.
  - Standardize 100% on **screen-intimate, zoomed waist-up cutouts** (`baseHeight={1280 - 1550}`) so characters are close to the viewer.
- **Smart Multi-Pose Cutouts:**
  **Judy (Screen-Intimate Bust Cutouts):**
  1. `character_pointing.png` — Confident opening hooks, directing attention, action directives.
  2. `character_crossed.png` — Arms crossed for analytical evaluation, skepticism, addressing excuses.
  3. `character_open.png` — Open palms for empathetic explanations, questioning, compassionate reframes.
  **Andrew (Inquisitive Male Counterpart Cutouts):**
  4. `andrew_crossed.png` — Arms crossed, skeptical pushback, challenging assumptions.
  5. `andrew_thinking.png` — Thoughtful contemplation, inquisitive questioning, listening.
- **Character Layout Rules:**
  - Solo Judy: `CharacterKeyframeAnimator` inside `className="absolute inset-0 pointer-events-none z-30 flex flex-col items-center justify-end overflow-hidden"`.
  - Conversational Duo (`<DuoPresenter />`): Turn-based speaker scaling (`1.08x` active, `0.92x` listening), top broadcast HUD badge (`top-[5.5%]`), top-anchored canvas (`pt-[10%]`), and dual-color kinetic captions (Amber for Andrew, Sky Blue for Judy).
  - Apple Glass scene badges (`className="apple-glass"` with `border-[5px]` and Lucide icon).

### B-Roll Motion Graphics Shots (Single-Concept Visual Metaphors)
- Spotlight **one** hero prop or visual comparison at a time using `ProCutout` or `PropComparison`.
- Animate in on beat with spring physics, hold rock-solid for comprehension, and transition cleanly to the next concept.

## 3. Critical Mobile Canvas & Typography Standards (iPhone 11 Rule)
- Spacious Canvas: `w-[980px] - w-[1020px]`, `px-6` margin.
- Zero tiny text: NO `text-xs` (12px) or `text-sm` (14px) anywhere in video compositions.
- Main titles: `48px - 58px` (`text-5xl font-black`).
- Item labels: `32px - 40px` (`text-2xl` to `text-3xl font-black`).
- Badges & chips: **MINIMUM 24px - 30px** (`text-xl font-black` or `text-2xl font-black`).
- Handwritten accents: `28px - 36px` (`text-3xl font-serif italic font-black text-[#0071e3]`).

## 4. Rock-Solid Settled State Standard (PERMANENT RULE)
- Entrance physics: `spring({ damping: 18 - 22, stiffness: 85 - 110, mass: 0.8 })`.
- **NEVER apply continuous `ambientFloat` (`Math.sin`), vertical bobbing, or breathing loops to cards, cutouts, or text**.
- Once settled, all visual elements **MUST remain 100% stationary and stable**.

## 5. Rich Multi-SFX Sound Design
- `whoosh_deep` / `whoosh_fast`: Scene transitions and presenter slide-ins (`vol: 0.32`).
- `impact_hit`: Problem reveals and diagnostic cutouts (`vol: 0.22`).
- `click`: Tactile badges and chips (`vol: 0.26`).
- `whoosh_sparkle`: Solutions, rewiring breakthroughs, and finale re-entry (`vol: 0.32 - 0.35`).

## 6. Bespoke Painterly Surreal Illustrations & Motion Graphics (`<CinematicIllustrationCard />`)
- **Visual Style**: Expressive digital impasto oil brushwork, dark slate/obsidian shadows (`#080b12`), atmospheric chiaroscuro lighting, and vibrant glowing prismatic neon cognitive distortion trails (cyan, magenta, turquoise, amber).
- **Motion Polish**: Never static! Wrap in `<CinematicIllustrationCard />` with subtle 2.5D Ken Burns zoom drift (`1.0x -> 1.07x`), diagonal glass glare sheen sweep, tactile card tilt with masking tape (`TapeStrip`), and monospace HUD telemetry (`COGNITIVE DIAGNOSTIC // 01`).
- **Timing & Multi-Beat Overlays**: Enters at Frame 0 as the instant hero hook. Judy presents the outro (`isFinale`) cleanly without card clutter. Never leave the illustration static for $>3.5$s: add camera punch zoom (`1.15x`), tactical callout pins (`<IllustrationCalloutPin />`), and angled diagnostic stamps (`<IllustrationStamp />`) every 1.5–2.5s.
- **Graceful Multi-Agent Fallback**: Agents with `generate_image` (Antigravity) generate the bespoke 16:9 art; agents without it (Claude Code) skip image generation and fall back to `ProCutout` seamlessly.

## 7. High-Retention Blueprint: 3-Pillar Pure Information Architecture (STRICTLY NO CTA)
- **Runtime Standard**: Strict **25–35 seconds** (~70–100 words, hard cap 105 words). Gives full narrative space to Introduce Problem -> Explain the Logic -> Deliver the High-Leverage Solution with maximum clarity.
- **Cognitive Paradox Standard**: Ban vague comfort cliches (*"When life feels unfair"*); lead with behavioral contradictions (*"Why being single feels lonely, but dating leaves you exhausted"*).
- **The 3-Pillar Pure Information Architecture**:
  - **Pillar 1 — Introduce the Problem (0–8s)**: Cognitive paradox, biological quirk, or behavioral hypocrisy.
  - **Pillar 2 — Explain the Logic (8–22s)**: Mechanism, root biological/cognitive cause, and why intuition fails (the trap).
  - **Pillar 3 — Deliver the Solution (22–32s)**: Concrete, actionable high-leverage protocol or rewire shift.
  - **STRICT NO-CTA LAW**: Video ends decisively on the solution itself. ZERO ending questions, ZERO "tell me below", ZERO "comment below".
- **Concept Keyword Slam (`<ConceptKeywordSlam />`)**: High-impact visual reinforcement component that pops on screen at the exact spoken frame of the core concept with acoustic impact hits (`impact_hit` + `whoosh_fast`).
- **Autonomous Pinned Comment**: Generate authoritative `[PINNED COMMENT]` summarizing the core takeaway or protocol; auto-posted to YouTube via YouTube Data API (`commentThreads.insert`) on upload.
- **Organic Growth Mode by Default (Zero PDF Hunt)**: All videos default to Mode B (pure organic psychological insights with zero CTA). Only search product PDFs and extract worksheet proof when `{meta}`, `--meta`, or `{product: ...}` is explicitly requested.

## 8. Tactical Meme Integration Engine (Default-On, < 2.5s Retention Booster)
- **Default-On Policy**: Memes are **ENABLED BY DEFAULT** for all videos! Strictly deployed as the opening HOOK from Frame 0 (`startFrame={0}`). PERMANENT BAN on mid-video and outro memes. Max 1 meme per standard video.
- **Opt-Out Modifier (`{no meme}` / `{no memes}`)**: Include `{no meme}` in prompt or CLI `--no-meme` to completely disable memes for that video.
- **Explicit Override (`{meme: <id>}`)**: Override auto-selection with a specific meme tag (e.g. `{meme: ishowspeed_stare}`).
- **Strict Duration Cap (< 2.5s)**: Brain registers memes in $<0.5$s. Holding $>2.5$s causes retention drop-off. Standardize on **1.2s–2.0s hold** (36–60 frames at 30 fps) with bouncy spring entrance and quick collapse snap-out.
- **100% Muted Meme Audio (`volume={0}`)**: Mute meme native audio completely. Narration voiceover and background music remain crystal-clear and uninterrupted.
- **Fast-Forward Velocity (`playbackRate={1.35 - 1.5}`)**: Sped-up tempo (1.4x default) matching short-form dopamine pacing.
- **21 Curated Memes Catalog (`public/memes/`) & Semantic Matcher (`scripts/meme_matcher.py`)**:
  - Automatically matches topic to relevant emotional reaction.
- **Elevated Tactical Card (`<TacticalMemeCard />`)**:
  - Positioned at `top-[7%]` (`w-[560px]`), floating above Judy and Andrew without facial occlusion.
  - Complete with diagonal glass glare sheen sweep, monospace HUD badge (`[REACTION PROTOCOL // 01]`), and synchronized `whoosh_fast` (entry) / `click` (exit) sound effects.
- **Sanitization**: Strip `{meme}`, `{meme: <id>}`, `{no meme}`, and `{no memes}` from speech synthesis and canvas text.
