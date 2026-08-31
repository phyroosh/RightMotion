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
- **Voice Character:** Always use the female neural network voice (`en-US-AvaMultilingualNeural` with natural conversational speed `rate="+0%"`, DO NOT speed up the voice) matching Judy.
- **Smart Multi-Pose Switching — 6-Pose System:**
  **FULL BODY (intro hook & outro finale ONLY — the money shots):**
  1. `character_fullbody_pointing.png` — Confident pointing up, strong for opening hooks and calls to action.
  2. `character_fullbody_open.png` — Both palms open/shrug, empathetic outros, question-framing moments.
  3. `character_fullbody_casual.png` — Touching hair, relaxed and warm — humanizing bookend moments.

  **BUST CUTOUTS (mid-video explanatory A-Roll):**
  4. `character_pointing.png` — Directing attention, hooks, action directives.
  5. `character_crossed.png` — Arms crossed for analytical evaluation, skepticism, addressing excuses.
  6. `character_open.png` — Open palms for explaining, questioning, empathetic reframes, compassionate wisdom.

- **Character Layout Rule:**
  - Use `CharacterKeyframeAnimator` inside `className="absolute inset-0 pointer-events-none z-30 flex flex-col items-center justify-end overflow-hidden"`.
  - Full body intro/outro: `baseHeight={1550}`. Bust cutouts: `baseHeight={1200}`.
  - Apple Glass scene badges only (`className="apple-glass"` with `border-[5px]` and Lucide icon).

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
