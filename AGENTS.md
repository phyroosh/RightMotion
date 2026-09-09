# 🎬 RightClips Autonomous AI Agent Engine Guide

This document is the **authoritative specification** for any AI Agent (Antigravity/AGY, Claude Code, Cursor, Copilot, ChatGPT) working in the **RightClips** repository.

---

## 🚀 RULE 0: MANDATORY AUTONOMOUS END-TO-END EXECUTION DIRECTIVE

> [!CRITICAL]
> **RIGHTCLIPS IS AN AGENTIC REMOTION ENGINE, NOT A STATIC TEMPLATE GENERATOR!**
> A topic submission is an order to **code bespoke, After Effects-grade Remotion motion graphics from scratch** in `Canvas.tsx` for that exact topic!
> Reusing the same hardcoded graphics (like cortisol/melatonin curves, sleep scales, or generic placeholders) across different topics is **STRICTLY PROHIBITED**.
> Every topic has unique biological, psychological, or conceptual mechanics that the AI Agent MUST visually represent in Remotion.
>
> The AI Agent MUST autonomously execute the complete 5-step production workflow in that **SAME turn**:
>
> 1. **Step 1 — Script & Viral Metadata**:
>    - Formulate the script using the **3-Pillar Pure Information Architecture**: Introduce Problem > Explain the Logic > Deliver the Solution.
>    - **Runtime**: Strict **25–35 seconds** (**70–100 words**, hard cap 105 words).
>    - **STRICTLY NO CTA AT THE END!** Pure high-density information only. ZERO ending questions, ZERO passive pitches, ZERO comments requests.
>    - **Mode B (Organic Growth)** is DEFAULT: strictly skip PDF hunting and omit the `[METADATA]` block. (Mode A product PDF search ONLY runs when `{meta}` is explicitly present).
>    - Generate an authoritative `[PINNED COMMENT]` summarizing the core takeaway or protocol rule.
>
> 2. **Step 2 — Plumbing Setup via CLI**:
>    - Execute:
>      ```bash
>      .venv/bin/python3 scripts/create_clip.py --name "<clip_name>" --topic "<topic>" --script "<script>" [--andrew] [--meta]
>      ```
>    - This autonomously synthesizes neural audio, transcribes word-level Faster-Whisper timestamps (`transcript.json`), selects the opening tactical meme, registers the composition in `Root.tsx`, and scaffolds a clean starter `Canvas.tsx`.
>    - **Note**: `create_clip.py` does NOT render the final video by default because the AI Agent MUST write `Canvas.tsx` in Step 3 first!
>
> 3. **Step 3 — BESPOKE REMOTION MOTION DESIGN IN `Canvas.tsx` (MANDATORY AGENT TASK)**:
>    - **The AI Agent MUST OPEN `src/clips/<clip_name>/Canvas.tsx` AND WRITE 100% CUSTOM REMOTION MOTION GRAPHICS FROM SCRATCH!**
>    - Inspect `transcript.json` to identify the exact frame timing of key concepts and sentences.
>    - Design 4 distinct, topic-tailored After Effects scenes (Beats 1–4):
>      - **Scene 1 (Hook / Problem — Introduce the Paradox)**:
>        - Mandatory waist-up Judy intro pop-up (`GlossyJudyIntro`) at Frame 0 (0-110 frames / ~3.8s) with atmospheric back-glow and downward wet-floor reflection, gliding out before Scene 2.
>        - 3-Tier `KineticTypoLadder` (leadIn, slamWord, punchText) with custom words from the hook + `VectorCursor` selection bounding box.
>        - Upright vector graph (`GlossyGlowGraph`) or custom metric visualization representing the starting friction/problem.
>      - **Scene 2 (Mechanism — Explain the Logic)**:
>        - `KineticTypoLadder` with the core psychological/biological/financial concept.
>        - Visual mechanism archetype: tactile friction slider (`GlossyFrictionSlider`) dragged by authentic glove cursor, frosted toggle switchboard (`GlossyToggleBoard`), or dual comparative vector pathways.
>      - **Scene 3 (Twist / Comparative Breakdown — Logic Deep-Dive)**:
>        - `KineticTypoLadder` highlighting the hidden trap.
>        - Dynamic comparative balance see-saw (`GlossyBalanceScale`), vertical frosted glass columns (`GlossyBarChart`), or side-by-side comparative cards (The Trap [Red] vs The Protocol [Green]) with settling physics.
>      - **Scene 4 (High-Leverage Solution & Protocol Resolution)**:
>        - `KineticTypoLadder` stating the exact actionable protocol rule.
>        - 360° circular progress gauge / chronograph (`GlossyRadialDial`), frosted glass staircase (`SteppedProgressionStairs`) with golden hopping orb, and centered high-leverage telemetry verdict bar. (ZERO CTA).
>    - **Enforce Mobile 480p Legibility & Safe Zones**:
>      - All primary graphics stay between `top: 6%` and `top: 68%` (`y: 115px` to `y: 1320px`).
>      - Captions occupy `top: 73%` to `81%`. ZERO overlap with graphics!
>      - Montserrat 78-92px slam words, JetBrains Mono 56-72px primary metrics.
>
> 4. **Step 4 — Visual Audit via Remotion Stills**:
>    - Run:
>      ```bash
>      npx remotion still src/index.ts <PascalName>Video out/<clip_name>_scene1.png --frame=80
>      npx remotion still src/index.ts <PascalName>Video out/<clip_name>_scene2.png --frame=250
>      npx remotion still src/index.ts <PascalName>Video out/<clip_name>_scene3.png --frame=500
>      npx remotion still src/index.ts <PascalName>Video out/<clip_name>_scene4.png --frame=850
>      ```
>    - Visually audit each still using `view_file` to confirm 10/10 Jordan Brown / Iman Gadzhi aesthetic, flawless contrast, and zero caption overlap.
>
> 5. **Step 5 — Final Video Export & Delivery**:
>    - Render the master video:
>      ```bash
>      npx remotion render src/index.ts <PascalName>Video out/<clip_name>_video.mp4
>      ```
>    - Deliver the final video path, viral title, thumbnail title, and pinned comment to the user.
>
> *(The agent only outputs the script alone if the user explicitly writes "script only" or "write a script").*

---

## 🏷️ Rule 1: Universal Bracket-Tag Channel Routing

Every video script submitted to RightClips is tagged with one of four channel niche brackets:

| Tag | Channel | Visual Canvas & Presenter Archetype |
| :--- | :--- | :--- |
| **`{Self Improvement}`** | **Judy Insights** | Apple Studio Light mesh canvas (`#f8fafc`), psychology/mindset, Judy bust presenter (`CharacterKeyframeAnimator` / `<DuoPresenter />`). |
| **`{Finance}`** | **Apex Wealth** | Rich Dark Obsidian & Cyber-Gold/Emerald (`#030712`), compound growth charts, ticker badges. **No presenter character.** |
| **`{Health}`** | **BioMatrix** | Deep Bio-Tech Navy & Cyber-Mint/Cyan (`#060913`), biometric telemetry, circadian rings, metabolic cards. **No presenter character.** |
| **`{facecam}`** | **Creator Facecam** | Dynamic zoom punch-ins, real speaker video/audio, split-screen host slide-down (`translateY: ~360px`), top B-roll, kinetic captions. |

> [!CRITICAL]
> **STOP-AND-ASK RULE**:
> If the user submits a topic **WITHOUT** `{Self Improvement}`, `{Finance}`, `{Health}`, or `{facecam}`:
> **The AI Agent MUST HALT immediately and ask the user which style they want before taking any action:**
> *"Which channel editing style would you like me to use for this video?*
> *1. `{Self Improvement}` (Judy Insights)*
> *2. `{Finance}` (Apex Wealth)*
> *3. `{Health}` (BioMatrix)*
> *4. `{facecam}` (Talking-Head Facecam)"*

---

## 👥 Rule 2: Solo Judy vs. Judy & Andrew Duo (`{andrew}`) & Runtime Policy

> [!CRITICAL]
> **EXPLICIT {andrew} OPT-IN TRIGGER & RUNTIME ALLOCATION:**
>
> 1. **Solo Judy (DEFAULT without `{andrew}`)**:
>    - Strict **25–35s runtime** (**70–100 words**, hard cap 105 words).
>    - *Why*: Delivers the complete 3-pillar depth: Introduce Problem -> Explain the Logic -> Deliver the High-Leverage Solution with maximum clarity and retention.
>    - Voice: `en-US-AvaMultilingualNeural` at `rate="+8%"`.
>    - Framing: Screen-intimate waist-up cutouts (`baseHeight={1280 - 1550}`) in `public/` (`character_pointing.png`, `character_crossed.png`, `character_open.png`). (Far head-to-toe avatars are permanently archived).
>
> 2. **Judy & Andrew Duo (OPT-IN with `{andrew}` or `--andrew`)**:
>    - Andrew is included **ONLY** when **`{andrew}`** or `--andrew` is explicitly present in the prompt or command. Never trigger Andrew automatically from raw script dialogue!
>    - Allowed **up to 40s runtime** (**80–120 words**, hard cap 125 words) with 140ms snappy inter-turn pause compression.
>    - Staging: `<DuoPresenter />` with turn-based speaker scaling (`1.08x` active, `0.92x` listening), top broadcast HUD badge (`top-[5.5%]`), and dual-color kinetic captions (Amber `#f59e0b` for Andrew, Electric Sky Blue `#38bdf8` / `#0071e3` for Judy).
>    - Voice Profiles: Judy (`en-US-AvaMultilingualNeural`, `+8%`) & Andrew (`en-US-SteffanNeural`, `+7%`).
>
> 3. **Automatic Sanitization**:
>    - Strip `{andrew}` and `{duo}` from all prompt text, titles, canvas text, and speech synthesis.

---

## 🧠 Rule 3: Organic Default (Mode B) vs. Product PDF (`{meta}` Mode A)

> [!CRITICAL]
> **ORGANIC GROWTH MODE IS DEFAULT! NEVER HUNT FOR PDF UNLESS '{meta}' IS PRESENT!**

### 1. Mode B: Organic / Growth Video — DEFAULT (When '{meta}' is ABSENT):
1. **STRICTLY SKIP ALL PDF SEARCH**: Do NOT inspect `Products/*.pdf`, do NOT extract product screenshots, and do NOT output a `[METADATA]` block inside the script.
2. **Script Format**: Output the clean `[VOICEOVER]` text directly using the 3-Pillar Pure Information Architecture (Introduce Problem > Explain Logic > Deliver Solution).
3. **Strict No-CTA & No-Ending-Question Directive**:
   - The video must deliver 100% pure high-density information.
   - **PERMANENT BAN ON ALL CTAs AND CLOSING QUESTIONS**: NEVER ask the audience a question at the end (*"Tell me below"*, *"What do you think?"*, *"Be honest: ..."* are strictly forbidden). NEVER ask viewers to follow, subscribe, or comment. The video must end crisply and decisively on the actionable solution itself.
4. **Authoritative `[PINNED COMMENT]`**:
   - Formulate an authoritative protocol rule or key takeaway summarizing the solution (e.g. *"The Protocol: Morning photons trigger an immediate cortisol surge that powers daytime energy, while setting a natural timer to release melatonin sixteen hours later."*).

### 2. Mode A: Standard (Product-Linked Video) — OPT-IN ONLY (When '{meta}' IS PRESENT):
1. **Scan Product PDFs**: Inspect `Products/*.pdf` (e.g. `Photon.pdf`) via `python3 scripts/pdf_topic_matcher.py --topic "<topic>"`.
2. **Retina Screenshot**: Run `python3 scripts/extract_product_page.py <pdf> <page_num>`.
3. **Metadata Block**: Output `[METADATA]` block (`product_file`, `page_number`, `exercise_title`) followed by `[VOICEOVER]`. Render on-screen via `<ProductPageShowcase />`.
4. **MANDATORY SILENT PDF RULE**: NEVER speak the PDF name ("Photon") or page number aloud. Visual proof card handles it on screen.
5. **ZERO Page Numbers on Thumbnails**: Thumbnails must NEVER contain `(PAGE 7)`, `PAGE 14`, or PDF filenames.

---

## 🎭 Rule 4: Universal Tactical Meme Integration Protocol (< 2.0s, Frame 0)

> [!CRITICAL]
> **TACTICAL MEMES: FIRST-FRAME HOOK ONLY, < 2.0S CAP, MUTED AUDIO, FAST-FORWARDED!**

1. **Default-On Policy**:
   - Tactical retention memes are **enabled by default** for all videos!
   - Reserved **exclusively for the opening hook (`startFrame=0`)**. Memes are permanently banned in the middle of the video.
   - Max **1 meme per video** to maintain intentionality.
2. **Internet Culture Meme Board (`public/memes/MEME_BOARD.md` & `registry.json`)**:
   - The engine includes 21 curated, iconic internet culture memes categorized into 7 psychological archetypes:
     - **Disbelief & Brain Reboot**: `ishowspeed_stare`, `lego_bruce_flabbergasted`, `confused_kid`, `wet_seal_cat`
     - **Repeating Autopilot Loops**: `doctor_strange_loop`
     - **Overthinking & Mental Overload**: `doctor_strange_multiverse`, `chrome_cyborg_overload`, `sweating_gamer`
     - **Exhaustion & Defeat**: `al_pacino_depressed_bench`, `walter_white_despair`
     - **Accountability & Calling Out**: `courtroom_shout_me`, `bateman_iphone_inspection`
     - **Swagger, Stoicism & Boundaries**: `ronaldo_sipping_tea`, `tony_stark_explosion`
     - **Rage, Drama & Chaos**: `office_rage_smash`, `angry_grandpa_rage`, `cat_laughing_pointing`, `michael_jackson_popcorn`, `rdj_shocked_closeup`, `ishowspeed_nodding_headphones`, `rowley_innocent_wave`
   - Autonomous matcher (`scripts/meme_matcher.py`) instantly pairs the topic/hook with the culturally accurate meme in `<15ms`.
3. **Execution Specs**:
   - **Duration**: 40–46 frames (~1.3s–1.5s, hard cap 2.0s).
   - **Audio**: 100% muted (`volume=0`).
   - **Playback**: Fast-forwarded (1.35x–1.45x).
   - **Transition**: High-velocity spring pop in on frame 0, rapid spring collapse snap-out revealing hero art.
4. **Universal '{no meme}' Modifier Tag**:
   - If user includes `{no meme}` or `--no-meme`, memes are strictly disabled.
   - Override with `{meme: <id>}` (e.g. `{meme: ronaldo_sipping_tea}`).

5. **Gen-Z Mid-Video Meme Reaction Stickers (`<MemeStickerOverlay />`)**:
   - Distinct from opening video memes: formatted as **tactile die-cut stickers** with thick white borders (`border: 4px solid white`), tactile drop shadows, and Gen-Z reaction badge tags (`[ LIVE REACTION ]`, `[ HEH 𓁹‿𓁹 ]`, `[ TALKING TO A WALL ]`, `[ HEAD EMPTY ]`).
   - Designed to pop in during **Beat 1, Beat 2, or Beat 3 (seconds 9–16)** for 24–36 frames (~0.8s–1.2s) as an authentic, relatable reaction spike without interrupting voiceover audio.
   - 15 curated internet reaction stickers in `public/memes/stickers/`:
     - `anya_crying` (Dramatic breakdown over tiny friction), `talking_to_brick_wall` (Communicating to unresponsive/stubborn people), `verne_turtle_shock` (Live reaction to uncomfortable truth), `patrick_drool` (Zero thoughts 2 AM brainrot), `anya_smug` (Caught in 4K / knowing you're right), `toddler_head_panic` (Sudden deadline panic attack), `crying_kid_homework` (Reluctant adulting / procrastination pain), `assignment_overload_cram` (11:59 PM deadline panic), `girl_crying_at_desk` (Quiet emotional burnout), `spiderman_scheming_chair` (Mastermind overthinking / let him cook), `tai_lung_laptop_despair` (Confronting receipts / checking bank account), `shannon_sharpe_suit_flex` (Main character swagger & boundaries), `shaq_timeout_pause` (Reality check pattern interrupt), `tom_holland_knuckle_bite` (Agonizing suspense / waiting for text), `friends_dapping_laughing` (Real camaraderie / mutual validation).
   - Matched automatically via `scripts/meme_sticker_matcher.py` or overridden with `{sticker: <id>}` / `--sticker <id>`. Disable with `{no sticker}` / `--no-sticker`.

---

## 📜 Rule 4.5: Grounded Editorial Texture Architecture (Anti-Ad Directive)

> [!CRITICAL]
> **NO MORE STERILE SAAS AD COMMERCIALS! ENFORCE GROUNDED EDITORIAL TACTILITY!**

1. **300gsm Archival Cotton Paper Tooth (`<ArchivalPaperCanvas />`)**:
   - Replaces sterile digital vector gradients with an organic 300gsm cotton rag tooth substrate via deterministic SVG fractal micro-noise and warm editorial off-white tint (`#faf8f5` / `#f4f0e8`).
   - Integrated into `LivingStudioBackground.tsx` as the foundational substrate.
2. **35mm Living Film Grain & Optical Halation (`<GroundedTextureEngine />`)**:
   - **35mm Living Film Grain**: Procedural temporal grain flutter (3.5%–4.2% opacity) synchronized with frame count, giving life to static frames.
   - **Warm Optical Halation**: Softens harsh digital vector anti-aliasing with warm editorial highlight bloom (`rgba(255, 248, 235, 0.05)`).
   - **Prime Cinema Lens Vignette**: Subtle edge falloff (`radial-gradient`) directing mobile viewer focus to the center.
   - Mounted at the top of the render stack in `index.tsx` with `z-50 pointer-events-none`.
3. **Letterpress Edge Deboss & Studio Shadow Depth (`<PhysicalCard />`)**:
   - Multi-layered tactile shadow: ambient occlusion contact shadow (`0 2px 4px rgba(0,0,0,0.10)`), direct diffuse shadow, and outer air shadow.
   - Letterpress deboss edge: subtle inner hairline border/bevel (`boxShadow: inset 0 1.5px 1px rgba(255,255,255,0.85), inset 0 -1.5px 2px rgba(0,0,0,0.07)`).

---

## 🎨 Rule 5: Autonomous Clean Editorial Hero Visual Protocol

> [!CRITICAL]
> **CLEAN MODERN EDITORIAL 2.5D CONCEPTUAL ART (VOX / APPLE EDITORIAL AESTHETIC)!**

1. **Editorial Aesthetic Standards**:
   - **Art Style**: Clean modern editorial conceptual illustration with crisp vector lines, elegant color blocking, and soft pastel gradients (sky blue, warm coral, sage green, off-white).
   - **Lighting & Setting**: Warm natural sunlight, bright architectural/everyday settings, generous negative space.
   - **Strict Bans**: NO gloomy dark impasto oil paintings, NO repetitive chiaroscuro boilerplates, NO anime faces, NO 3D CGI cartoon look, NO text/watermarks.
   - **PERMANENT BAN ON FIXED REFERENCE IMAGES**: NEVER pass fixed reference images (`ImagePaths`) to `generate_image`!
2. **Prompt Generation Script**:
   - Run `python3 scripts/generate_illustration_prompt.py --topic "<topic>" --script "<hook>"` to derive the tailored prompt.
   - Call `generate_image` with `AspectRatio="16:9"`. Save to `public/<clip_name>/assets/scene_illustration.png`.
3. **Motion Graphics Wrap (`<CinematicIllustrationCard />`)**:
   - Clean gallery editorial presentation: wrapped in tactile 3D card tilt (`PhysicalCard tiltX={3} tiltY={-3}`), 2.5D Ken Burns slow zoom-drift (1.0x -> 1.07x), and specular diagonal glass glare sheen sweep.
   - **Strict Visual Bans**: NO masking tape strips, NO fake sci-fi telemetry HUD bars (`LIVE SIGNAL`), NO fake weather/kinetic badges (`ATMOSPHERIC CHANCE`), and NO redundant hook text blocks on the card (kinetic subtitles below handle reading and spoken words).
   - **PERMANENT BAN ON IN-PICTURE MOTION DESIGN**: All speech-synchronized motion design elements (callouts, stamps, badges, diagnostic tags) must be displayed **STRICTLY OUTSIDE OF THE PICTURE** (floating cleanly above the card in the canvas). The hero illustration artwork must remain 100% unobstructed, pristine editorial art with zero graphical clutter, zero boxes, and zero reticles on top of subjects.
   - Sits behind the opening tactical meme hook and is revealed as the meme collapses.

---

## 💎 Rule 5.5: The 10/10 Dark Glossy Reflection Motion Graphics System (Master Standard)

> [!CRITICAL]
> **ZERO TEXT WALLS, ZERO DECORATIVE PILLS, 100% CINEMATIC MOTION DESIGN!**
> Videos must match the high-end dark obsidian, wet-floor glossy reflection aesthetic of `/home/phyroosh/Desktop/Editing Upgrade/`:

1. **Pitch-Black Obsidian Void & Atmospheric Lighting (`<GlossyFloorStage />`)**:
   - Deep obsidian background (`#000000`) with atmospheric radial color auras (`glowColor`) pulsating behind the active graphic.
   - **Downward Glossy Wet-Floor Mirror Reflections**: Every standing element reflects downward (`transform: scaleY(-1)`) with soft blur (`blur: 2-2.5px`) and vertical alpha falloff (`opacity: 0.35-0.42`).
2. **Minimalist Glowing Typography (Anti-Text-Wall Law)**:
   - Exactly **1–2 uppercase words** glowing in 3D space with soft neon bloom (`text-shadow: 0 0 20px ...`).
   - Spoken dialogue is handled **100% by kinetic captions** (`<AppleKineticCaptions theme="dark" />`).
   - **PERMANENT BAN ON SMALL PILL BADGES**: Never render decorative status tags (`[LIVE REACTION]`, `[PARADOX]`, `[CRITICAL DIAGNOSTIC]`, `[COMMUNITY CHECK]`).
3. **The 9 Motion Design Archetypes (`src/components/pure_graphics/`)**:
   - **`<GlossyJudyIntro />`** (*Mandatory Intro Host Pop-Up*): Waist-up Judy cutout with atmospheric back-glow, downward glossy wet-floor mirror reflection, spring punch entrance, and non-linear cushioned slide-down exit.
   - **`<GlossyGlowGraph />`** (*Ref 1: Dynamic Coordinate Graphs*): Upright standing coordinate frame, variable-speed cubic bezier path trimming, single spike or dual comparative curves (Green Optimal vs Red Inverted), radiating ripple rings on the beacon head, and floor reflection.
   - **`<GlossyFrictionSlider />`** (*Ref 3: Tactile Friction Slider*): Frosted glass horizontal slider track clicked and dragged by the authentic cartoon glove pointer cursor (`public/assets/cursor_pointer.png`) from high friction to flow state.
   - **`<GlossyBalanceScale />`** (*3D Comparative Balance See-Saw*): Dynamic see-saw comparing the Trap (Red) vs the Protocol (Green) with spring torque and weight settling physics.
   - **`<GlossyBarChart />`** (*3D Frosted Glass Metric Columns*): Vertical glass columns with glowing gradient tops, staggered non-linear springs, live value tickers, and floor reflection.
   - **`<GlossyRadialDial />`** (*360° Circular Telemetry Dial / Chronograph*): Circular gauge with animated glowing radial arc, digital center readout, and floor reflection. Ideal for time thresholds and countdown timers.
   - **`<GlossyToggleBoard />`** (*Ref 3: "SUCCESS" Switchboard*): Frosted glass panel with tactile iOS toggle switches that flip from grey to glowing emerald green, clicked by the authentic cartoon glove pointer cursor (`public/assets/cursor_pointer.png`).
   - **`<SteppedProgressionStairs />`** (*Ref 2: Plan -> Action -> Goal*): Ascending staircase of frosted glass step blocks with a radiant golden orb leaping dynamically between steps.
   - **`<GlossyFeatureGrid />`** (*Ref 4: 3x3 Tile Grid*) & **`<PolishStickerFloat />`**: Matrix of square frosted glass tiles popping in with sequential checkmarks, or floating 3D perspective assets with smooth floating sine physics.
4. **Authentic Tactile Cursor Integration (`<TactileCursorPointer />`)**:
   - Uses the permanent high-res glove cursor cutout in `public/assets/cursor_pointer.png` with natural click spring scale (`scale: 0.86`) and realistic drop shadow.
5. **3D Floating Holographic Assets (`<PolishStickerFloat />`)**:
   - Assets and reaction characters float with 3D perspective tilt (`rotateX`, `rotateY`), smooth floating sine physics, and soft neon rim glow, completely free of tacky badge borders.

---

## 📱 Rule 5.6: The Mobile 480p Legibility Standard & The 2-Font Kinetic System (Permanent Master Directive)

> [!CRITICAL]
> **MOBILE-FIRST AT 480P RESOLUTION: ZERO SQUINTING, ZERO CAPTION OVERLAP!**
> Over 85% of YouTube Shorts and TikTok viewers watch on mobile screens (e.g. iPhone 11) frequently downscaled to 480p.
> Desktop-sized 12px/14px fonts and hairline 1.5px lines turn into blurry mush. All agents MUST permanently enforce the following:

1. **The 2-Font Kinetic Pairing System**:
   - **Font Style 1 (Display / Headings / Slam Words / Big Values)**: **`Montserrat`** (Weights 700 Bold, 800 ExtraBold, 900 Black) via `font-display`. Wide, punchy geometric grotesque that delivers an authoritative headline presence even at 480p.
   - **Font Style 2 (Technical / Telemetry / Metrics / Units / Timestamps / Labels)**: **`JetBrains Mono`** (Weights 700 Bold, 800 ExtraBold) via `font-mono`. Precision monospace with wide counters, unmistakable character separation, and high-tech biometric telemetry aesthetics.
   - **Font Storage & Zero-Latency Renders**: Both fonts are permanently stored locally in `public/fonts/` (`Montserrat-Black.ttf`, `JetBrainsMono-Bold.ttf`, etc.) and loaded at runtime via `<FontLoader />` (`staticFile("fonts/...")`), backed by `@import` in `style.css`. Never use raw `url('/fonts/...')` in CSS that breaks Webpack bundling.

2. **Mobile Typography Hierarchy (Render Canvas: 1080×1920)**:
   - **Headline Slam Words**: `78px – 92px` font-display font-black (e.g. `CORTISOL`, `INVERSION`). Anchor from `right: 5%` or center to prevent bezel truncation.
   - **Section / Scene Titles**: `30px – 36px` font-display font-black with tracking `[0.2em]` and gradient glow underlines.
   - **Primary Metric Readouts**: `56px – 72px` font-mono font-black (e.g. `+340%`, `−16 HRS`, `78%`).
   - **Callout Card Values**: `32px – 36px` font-display font-black.
   - **Callout & Telemetry Labels**: `18px – 22px` font-mono font-black uppercase (never 10px–12px `text-xs`!).
   - **Callout Containers**: Chunkier padding (`px-6 py-4 rounded-2xl`), `2.5px` vivid neon border, `16px` glass blur backdrop.

3. **Stroke & Graphic Robustness Standards**:
   - Coordinate graph axes: minimum `5px` stroke with soft glow.
   - Glowing graph curves: `8px` core neon stroke + `18px` outer ambient blur pass.
   - Circular telemetry dials (`GlossyRadialDial`): `14px` track ring + `18px` active glowing sweep arc.
   - Friction sliders (`GlossyFrictionSlider`): `34px` track bar + `42px` glowing knob.
   - Balance scales (`GlossyBalanceScale`): `6px` beam + `4px` hanging cables + `240px` minimum pan cards.

4. **The Mobile Safe-Zone Architecture (Strict Anti-Caption-Collision Law)**:
   - **Visual Sweet Spot**: `top: 6%` to `top: 68%` (`y: 115px` to `y: 1320px`). All primary graphics, coordinate axes, balance scales, dials, and callouts MUST be framed inside this zone.
   - **The Caption & UI Exclusion Zone**: `AppleKineticCaptions` sits at `bottom-[19%]` (`top: 73%` to `top: 81%`), and player UI/scrub bar occupies the lowest 15%.
   - **PERMANENT BAN ON LOW-ANCHORED CARDS**: Never place comparative cards, callout boxes, or word slams below `top: 68%` (or `bottom: 12%`). All bottom stat bars and word slams must sit cleanly at `top: 63% – 66%`, directly above the caption line with zero overlap.

---

## 📐 Rule 5.7: Architectural Drafting Grid & 3-Tier Kinetic Typographic Ladder (Master Reference Standard)

> [!CRITICAL]
> **FILL THE CANVAS: TYPOGRAPHY AS MOTION ART & ZERO DEAD ZONES!**
> Inspired by top-tier motion design (e.g. Jordan Brown / Iman Gadzhi caliber), the canvas must never look empty or static.
> Spoken words are reinforced by hero typographic hierarchy and tactile drafting graphics:

1. **Architectural Drafting Substrate (`<ArchitecturalDraftingCanvas />`)**:
   - **Coordinate Grid**: Minimalist dashed grid lines (`strokeDasharray="4 4"`, subtle opacity `0.07` on dark / `0.10` on light, 80px cell size) giving an authentic blueprint / technical schematic aesthetic.
   - **Intersection Crosshairs**: Precision `+` registration marks at grid intersections with soft glow.
   - **Geometric Matte Corner Accents**: Solid geometric 45° corner triangles (top-left & bottom-right) anchoring the vertical frame boundaries.
   - Built directly into clip backgrounds to ground all floating vector graphs and metrics.

2. **The 3-Tier Kinetic Typographic Ladder (`<KineticTypoLadder />`)**:
   - Anchors the upper-middle zone (`top: 10%` to `16%`) of every scene, working in harmony with the lower-middle vector graphics (`top: 48%` to `74%`).
   - **Line 1 (Context Lead-in)**: `34px - 38px` font-display font-bold uppercase with tracking `[0.2em]`. Enters at frame 0 with smooth non-linear slide-up (`translateY: 28px -> 0px`) and motion blur.
   - **Line 2 (Headline Slam Word)**: `82px - 92px` font-display font-black uppercase (`#0f172a` on light, `#ffffff` on dark). Enters staggered at frame 6 with high-velocity spring punch and directional motion blur simulation.
   - **Line 3 (Tactile Punchline Bounding Box)**: `42px - 48px` font-display font-bold. Enters staggered at frame 12, framed inside an interactive dashed bounding box (`2px dashed` with 8 corner/edge square selection handles).
   - **Masked Text Transitions**: Every text line is nested in an `overflow: hidden` wrapper with spring-driven vertical reveals (`translateY`), guaranteeing pristine editorial masks without text jumping.

3. **Tactile Vector Cursor Snapping (`<VectorCursor />`)**:
   - Authentic Figma/OS style precision vector arrow and pointer cursors (`public/assets/cursor_pointer.png` and SVG path cursor).
   - Dynamic non-linear bezier flight path (`damping: 14, stiffness: 120`) flying from off-screen or from a previous element, landing precisely on selection handles, buttons, or slider thumbs.
   - Spring click physics (`scale: 0.82`) synchronized with tactile click sound effects (`mouse_click.mp3` / `click.mp3`), visually activating dashed bounding boxes and toggles.

---

## 🎨 Rule 5.8: Graphic Designer First & The "Canva Feel" Alignment Law (Master Directive)

> [!CRITICAL]
> **THINK AND PLAN LIKE A GRAPHIC DESIGNER BEFORE THINKING LIKE AN EDITOR!**
> Motion design without graphic design fundamentals creates chaotic, lopsided, unaligned visual noise.
> All clips MUST deliver the **"Canva Feel"**: clean, balanced, minimalistic, perfectly aligned with generous whitespace and ZERO clutter.
> The AI Agent MUST strictly enforce the following 5 graphic design laws:

1. **The 920px Central Alignment Axis (Zero Edge Bleed)**:
   - On a 1080×1920 canvas, the active design column is strictly **`max-w-[920px]`** centered horizontally (`left: 50%, transform: translateX(-50%)` or centered flex column).
   - Guarantees **80px minimum margins** on the left and right screen borders.
   - **PERMANENT BAN ON ASYMMETRICAL FLOATING BOXES**: Never use arbitrary coordinates like `left: 2%` or `left: 62%` that cause cards to bleed off the edge or create diagonal dead zones.
   - If using a 2-column layout (e.g. comparative cards), use `flex justify-between gap-6` within `w-[920px]` with symmetrical widths (e.g. `w-[440px]` each).

2. **The "One Hero Centerpiece" Law (Strict Anti-Clutter Minimalist Principle)**:
   - In any given sub-scene or visual beat, display **EXACTLY ONE PRIMARY HERO GRAPHIC** that commands attention.
   - **PERMANENT BAN ON WIDGET SPAMMING**: Never display a graph, plus 2 cards, plus a percentage ticker, plus a ladder simultaneously. It overwhelms the viewer and destroys Canva-level elegance.
   - If a scene has multiple concepts, split it into sequential sub-phases (e.g. Phase 1: Dial -> Phase 2: Progression Stairs -> Phase 3: Verdict Bar) rather than cramming everything on screen at once.

3. **Canva-Grade Vertical Spacing & Hierarchy**:
   - **Top Zone (`top: 10% - 24%`)**: 3-Tier `KineticTypoLadder` (Lead-in -> Slam Word -> Punch Bounding Box).
   - **Center Hero Zone (`top: 28% - 58%`)**: The single Hero Graphic (Coordinate Graph, Radial Dial, Balance Scale, Friction Slider, or Stepped Stairs).
   - **Supporting Zone (`top: 59% - 66%`)**: Symmetrical status pill or clean horizontal telemetry readout bar.
   - **Caption Exclusion Zone (`top: 73% - 81%`)**: `AppleKineticCaptions`. Completely untouched with 80px+ vertical buffer above it.

4. **Symmetrical Card Proportions & Interior Padding**:
   - Cards must feel tangible, premium, and balanced:
     - Full-width hero cards: `w-[900px] - w-[920px]`, `rounded-[32px]`, `p-8`.
     - Dual comparative cards: `w-[440px]`, `rounded-[28px]`, `p-6`.
     - Hairline borders (`border: 2px solid ...`), subtle glassmorphism (`backdrop-blur-xl`), and soft multi-layered studio drop shadows.
   - Interior typography: Crisp labels, prominent headline values, and tight line heights with zero awkward text wraps.

5. **Grounded Presenter Law**:
   - Judy cutouts MUST be anchored cleanly to `bottom: 0` (`width: 980px`, `baseHeight: 1460px`, `alignItems: flex-end`).
   - Never float cut-off thighs in mid-air with fake mid-screen reflections!
   - Video cutout pose MUST be distinct from the thumbnail pose.
   - ZERO background graphics while Judy is on screen. Judy must completely exit below the bottom bezel before any graphs or cards enter.

---

## ⚡ Rule 6: The 3-Pillar Pure Information Architecture & Scriptwriting Standards

Every short-form script follows the high-retention 3-pillar information architecture (25–35s runtime, 70–100 words, **STRICTLY NO CTA**):

1. **Pillar 1 — Introduce the Problem (0–8s)**: High-velocity cognitive paradox, biological quirk, or behavioral hypocrisy (*"You wake up exhausted because your daily cortisol curve is completely inverted."*).
2. **Pillar 2 — Explain the Logic (8–22s)**: Scientific mechanism, underlying biological/cognitive system, and why standard intuition fails or traps you (*"Cortisol isn't just stress—it is an energy-deploying hormone designed to unlock glucose and drive physical alertness. When you miss morning sunlight, your cortisol stays flat all day and surges late at night..."*).
3. **Pillar 3 — Deliver the Solution (22–32s)**: Concrete, actionable high-leverage protocol or rewire shift that directly resolves the problem (*"The solution is getting direct outdoor sunlight into your eyes for ten to fifteen minutes within sixty minutes of waking. Morning photons trigger an immediate cortisol surge that powers daytime energy, while setting a natural timer to release melatonin sixteen hours later."*).
4. **STRICT NO-CTA LAW**: The video ends decisively and crisply on the solution itself. **ZERO audience questions**, ZERO "tell me below", ZERO "comment below", ZERO follow/subscribe pitches.

### The "Comfort" Title Trap & Tier-1 Linguistic Filter:
- ❌ **THE "COMFORT" TITLE TRAP BAN**: Never output comforting reassurances or optimistic platitudes (*"True relationships still exist..."*, *"When life feels unfair..."*, *"You are not alone"*). Impatient scrollers stop ONLY for cognitive tension, paradoxes, and uncomfortable truths (*"Why Social Media Convinced You Love Isn't Real"*, *"The Dating Illusion That's Exhausting Your Brain"*).
- ❌ **TIER-1 AMERICAN LINGUISTIC FILTER**: Strictly enforce natural American English idioms. Ban unnatural literal phrasing like *"made it look untrue"* (replace with *"made it feel fake"*, *"lied to you"*, *"distorted reality"*).

### The 9 Core Psychological Archetypes (Mode B Classification):
The scriptwriter autonomously categorizes uncurated topics into 9 proven psychological archetypes (75–95 words, 25–35s runtime, pure Problem > Logic > Solution, ZERO CTA):
1. **People-Pleasing & Boundaries**: Fawn Response Conditioning (*"Notice how saying yes to plans you dread always leaves you secretly resenting the other person?..."*) $\rightarrow$ 24-Hour Delay Rule.
2. **Comparison & Timelines**: Upward Social Anchoring (*"Notice how achieving your goals never stops you from feeling five years behind everyone else?..."*) $\rightarrow$ Reverse Tracking Protocol.
3. **Fear of Trying & Casual Mask**: Anticipatory Self-Handicapping (*"Notice how you pretend not to care about the things you secretly want most in life?..."*) $\rightarrow$ Radical Public Effort Protocol.
4. **Dopamine & Screen Loops**: Dopamine Variable Reward Hijacking (*"Ever open your phone to check a quick message, only to lose forty-five minutes scrolling on autopilot?..."*) $\rightarrow$ Grayscale Display Friction Protocol.
5. **Chronic Overthinking**: Threat Simulation Rumination (*"Why does your brain wait until your head hits the pillow to replay an awkward conversation from three years ago?..."*) $\rightarrow$ Physical Brain Dump Protocol.
6. **Burnout & Freeze**: Autonomic Nervous System Freeze (*"Notice how lying on the couch scrolling doesn't recharge you when your mind is screaming with guilt?..."*) $\rightarrow$ Active Physiological Regulation Protocol.
7. **Relationships & Attachment**: Anxious Attachment Mirroring (*"Why does modern dating leave you completely exhausted, yet being alone feels unbearable?..."*) $\rightarrow$ Nervous System Grounding Rule.
8. **Wealth & Hedonic Spending**: The Hedonic Treadmill Effect (*"Notice how earning more money never makes you feel permanently financially secure?..."*) $\rightarrow$ 50% Reverse-Budget Protocol.
9. **Sleep & Biology**: The Cortisol Awakening Mismatch (*"You wake up exhausted because your daily cortisol curve is completely inverted..."*) $\rightarrow$ 60-Minute Outdoor Sunlight Protocol.

### Banned AI Clichés & Sales Hype:
- ❌ *"Here's the thing..."*, *"The truth is..."*, *"You're not lazy, you're..."*, *"What most people don't realize is..."*, *"The tricky part is..."*
- ❌ *"masterpiece"*, *"life-changing"*, *"must-read"*, *"buy now"*, *"game-changer"*
- ❌ Vague comfort topics (*"When life feels unfair"*, *"You are not alone"*). Use concrete quirks only!
- ❌ Banned ending CTAs: *"tell me below"*, *"comment below"*, *"drop a comment"*, *"what do you think?"*, *"be honest:"*.

---

## 📱 Rule 7: Mobile Readability, Sound Design & Quality Standards

1. **iPhone 15 Base Model Readability**:
   - Main titles: `48px - 58px` (`text-5xl font-black`).
   - Item labels: `32px - 40px` (`text-2xl` to `text-3xl font-black`).
   - Badges & chips: **MINIMUM 24px - 30px** (`text-xl font-black`).
   - Zero tiny text (`text-xs` and `text-sm` are permanently banned).
2. **Settled State Stability (PERMANENT RULE)**:
   - Once elements enter via spring physics, they **MUST remain 100% stationary**.
   - NEVER apply continuous `ambientFloat` (`Math.sin`), vertical bobbing, or breathing loops to cards, cutouts, or text.
3. **Acoustic Sound Design (Multi-SFX Suite)**:
   - `whoosh_deep` / `whoosh_fast`: Major transitions & presenter entrances (`vol: 0.30 - 0.34`).
   - `impact_hit` / `piano_hit`: High-impact concept reveals, diagnostic reveals, cutout stamps (`vol: 0.24`, `durationFrames: 90`). Mapped to the iconic Dhruv Rathee cinematic piano hit (`universfield-cinematic-piano-hit-567216.mp3` with 3.0s resonant decay).
   - `click`: Tactile UI pills, chips, badges (`vol: 0.24 - 0.28`).
   - `whoosh_sparkle`: Key psychological revelations, solution cutouts (`vol: 0.30 - 0.35`).
4. **Frame 0 High-CTR Thumbnail Standard**:
   - Automatically captured by YouTube Shorts at frame 0.
   - Pure viral hook titles only with cognitive tension (`THE DATING ILLUSION`, `DIAGRAM YOUR LOOP`, `THE COMPARISON TRAP`).
   - **INTIMATE WAIST-UP EYE-LEVEL THUMBNAILS**: In 9:16 vertical thumbnails, Judy must ALWAYS be framed in an intimate waist-up crop (`width: 980px - 1160px`, `height: 1460px - 1680px`), with her head and eyes positioned at eye level below the title block with zero scrim fog, commanding immediate viewer connection on mobile feeds. Far head-to-toe crops are permanently banned.
   - NEVER include page numbers or PDF names on thumbnails!

---

## 🛠️ Rule 8: Master Production CLI & Remotion Workflow

> [!CRITICAL]
> **DO NOT RENDER BEFORE WRITING BESPOKE REMOTION GRAPHICS!**
> `create_clip.py` is the scaffolding pipeline; the AI Agent is the motion designer.
> Never render a video until you have customized `Canvas.tsx` for the script's topic.

### 1. Step 1 — Scaffold Assets & Composition:
```bash
.venv/bin/python3 scripts/create_clip.py \
  --name "<clip_name>" \
  --topic "<topic>" \
  --script "<script_text>" \
  [--andrew] \
  [--meta] \
  [--meme <id>] \
  [--no-meme]
```
*(This creates `public/<clip_name>/voiceover.mp3`, `src/clips/<clip_name>/transcript.json`, registers the clip in `src/Root.tsx`, and generates the starter `Canvas.tsx`.)*

### 2. Step 2 — Code Bespoke Motion Design in `Canvas.tsx`:
- Open `src/clips/<clip_name>/Canvas.tsx`.
- Review `src/clips/<clip_name>/transcript.json` for precise word timestamps and sentence boundaries.
- Build 4 bespoke scenes using Remotion (`interpolate`, `spring`, `useCurrentFrame`, `useVideoConfig`).
- Incorporate `KineticTypoLadder`, `VectorCursor`, and pure graphics components (`GlossyGlowGraph`, `GlossyBalanceScale`, `GlossyRadialDial`, `GlossyFrictionSlider`, `SteppedProgressionStairs`, etc.).
- Strictly adhere to Mobile 480p Legibility and Safe Zones (stay between `top: 6%` and `top: 68%`, captions at `top: 73%`–`81%`).
- **BANNED**: Never leave hardcoded Cortisol, Melatonin, Sleep, or generic placeholder text.

### 3. Step 3 — Visual Audit via Remotion Stills:
```bash
# Render scene stills to verify visual composition and zero caption collision
npx remotion still src/index.ts <PascalName>Video out/<clip_name>_scene1.png --frame=80
npx remotion still src/index.ts <PascalName>Video out/<clip_name>_scene2.png --frame=250
npx remotion still src/index.ts <PascalName>Video out/<clip_name>_scene3.png --frame=500
npx remotion still src/index.ts <PascalName>Video out/<clip_name>_scene4.png --frame=850

# Render 4K Still Thumbnail
npx remotion still src/index.ts <PascalName>Thumbnail out/<clip_name>_thumbnail.png
```
*Use `view_file` to audit each still before rendering the final video.*

### 4. Step 4 — Master Video Render:
```bash
# Render Master MP4 Video
npx remotion render src/index.ts <PascalName>Video out/<clip_name>_video.mp4
```

### Git Push & Clean Repo Policy:
- Always test with `python3 -m py_compile` before committing.
- Commit all production assets, scripts, and documentation together with clean conventional commits (`feat(clip): ...`).
- Push to `origin main` upon completion.

