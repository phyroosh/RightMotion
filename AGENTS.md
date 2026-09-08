# 🎬 RightClips Autonomous AI Agent Engine Guide

This document is the **authoritative specification** for any AI Agent (Antigravity/AGY, Claude Code, Cursor, Copilot, ChatGPT) working in the **RightClips** repository.

---

## 🚀 RULE 0: MANDATORY AUTONOMOUS END-TO-END EXECUTION DIRECTIVE

> [!CRITICAL]
> **A TOPIC SUBMISSION IS AN ORDER TO PRODUCE THE FULL VIDEO, NOT JUST A SCRIPT!**
> When a user submits any topic prompt with channel brackets (e.g. `Topic {Self Improvement}: ...`, `{Finance} ...`, etc.):
> **The AI Agent MUST NOT HALT after generating the script!**
> The AI Agent MUST autonomously execute the complete 4-step production workflow in that **SAME turn**:
>
> 1. **Step 1 — Script & Viral Metadata**:
>    - Formulate the 2-Beat Curiosity Gap voiceover script and viral metadata.
>    - **Mode B (Organic Growth)** is DEFAULT: strictly skip PDF hunting and omit the `[METADATA]` block. (Mode A product PDF search ONLY runs when `{meta}` is explicitly present).
>    - Enforce the Spoken Interactive Question CTA and generate a `[PINNED COMMENT]`.
> 2. **Step 2 — Professional After Effects Motion Design Planning (MANDATORY)**:
>    - **Plan like a Senior After Effects / Cinema 4D Motion Design Artist before touching code!**
>    - Run:
>      ```bash
>      python3 scripts/plan_motion_design.py --topic "<topic>" --script "<script>"
>      ```
>    - Formulate a scene-by-scene storyboard (Beats 1–4) enforcing the **10/10 Dark Glossy Reflection System**:
>      - **Scene 1 (Hook/Paradox)**: Upright glowing vector graph (`GlossyGlowGraph`) with starting tension/spike curve, glowing focus title, and downward wet-floor mirror reflection.
>      - **Scene 2 (Mechanism)**: Frosted glass switchboard (`GlossyToggleBoard`) with authentic glove pointer cursor (`public/assets/cursor_pointer.png`) clicking toggles to neon green, or 3D asset float (`PolishStickerFloat`).
>      - **Scene 3 (Twist / Comparative Shift)**: Dual-curve comparative graph (`GlossyGlowGraph`) contrasting Trap (Red) vs Optimal Rewire (Green).
>      - **Scene 4 (Action Protocol & CTA)**: Frosted glass staircase (`SteppedProgressionStairs`) with hopping radiant golden orb up to the Goal.
>    - **Strict Anti-Clutter Laws**: Exactly 1–2 uppercase glowing focus words per scene. ZERO small pills or diagnostic tags. Spoken words handled 100% by dark neon `AppleKineticCaptions`.
> 3. **Step 3 — Clean Editorial Hero Illustration (When applicable)**:
>    - Derive the prompt using `python3 scripts/generate_illustration_prompt.py --topic "<topic>" --script "<hook>"`.
>    - Call `generate_image` with `AspectRatio="16:9"` (do NOT pass fixed reference images). Save to `public/<clip_name>/assets/scene_illustration.png`.
> 4. **Step 4 — Master CLI Execution**:
>    - Execute:
>      ```bash
>      .venv/bin/python3 scripts/create_clip.py --name "<clip_name>" --topic "<topic>" --script "<script>" [--andrew] [--meta]
>      ```
>    - This autonomously synthesizes neural audio (with 220ms CTA breath pause), transcribes Faster-Whisper timestamps, selects the tactical meme, scaffolds the 10/10 pure graphics components, and registers the 4K thumbnail.
> 5. **Step 5 — Final Audit & Delivery**:
>    - Verify the scaffolded composition and deliver the final viral title, thumbnail title, and pinned comment to the user.
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
>    - Strict **20–24s runtime** (**55–70 words**, hard cap 75 words).
>    - *Why*: YouTube Studio analytics prove 20–24s runtimes achieve **68–78%+ completion rates**, driving exponential Shorts feed recommendation.
>    - Voice: `en-US-AvaMultilingualNeural` at `rate="+8%"`.
>    - Framing: Screen-intimate waist-up cutouts (`baseHeight={1280 - 1550}`) in `public/` (`character_pointing.png`, `character_crossed.png`, `character_open.png`). (Far head-to-toe avatars are permanently archived).
>
> 2. **Judy & Andrew Duo (OPT-IN with `{andrew}` or `--andrew`)**:
>    - Andrew is included **ONLY** when **`{andrew}`** or `--andrew` is explicitly present in the prompt or command. Never trigger Andrew automatically from raw script dialogue!
>    - Allowed **up to 40s runtime** (**75–115 words**, hard cap 120 words) with 140ms snappy inter-turn pause compression.
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
2. **Script Format**: Output the clean `[VOICEOVER]` text directly.
3. **Mandatory Spoken Interactive Question CTA**:
   - Voiceover must conclude with an open-ended, polarizing spoken question directed to the viewer (*"Be honest: what's the one thing you secretly care about, but pretend is no big deal? Tell me below."*).
   - Permanent ban on passive CTA endings (*"Follow along for more breakdowns"* or *"Stick around"*).
   - Enforce an intimate 200–250ms breath pause before the question.
4. **Mandatory `[PINNED COMMENT]`**:
   - Formulate an aligned provocative pinned comment to ignite viewer replies from 0 (e.g. *"Question for you: What's the one thing you secretly care deeply about, but pretend is no big deal? Be honest 👇"*).

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
3. **The 4 Flagship Motion Archetypes (`src/components/pure_graphics/`)**:
   - **`<GlossyGlowGraph />`** (*Ref 1: Motivation vs Discipline*): Upright standing coordinate frame, single or dual comparative glowing Bezier curves (Green Optimal vs Red Inverted), pulsing beacon heads, area gradients, and floor reflections.
   - **`<GlossyToggleBoard />`** (*Ref 3: "SUCCESS" Switchboard*): Frosted glass panel with tactile iOS toggle switches that flip from grey to glowing emerald green, clicked by the authentic cartoon glove pointer cursor (`public/assets/cursor_pointer.png`).
   - **`<SteppedProgressionStairs />`** (*Ref 2: Plan -> Action -> Goal*): Ascending staircase of frosted glass step blocks with a radiant golden orb leaping dynamically between steps.
   - **`<GlossyFeatureGrid />`** (*Ref 4: 3x3 Tile Grid*): Matrix of square frosted glass tiles popping in with sequential checkmark illuminates.
4. **Authentic Tactile Cursor Integration (`<TactileCursorPointer />`)**:
   - Uses the permanent high-res glove cursor cutout in `public/assets/cursor_pointer.png` with natural click spring scale (`scale: 0.86`) and realistic drop shadow.
5. **3D Floating Holographic Assets (`<PolishStickerFloat />`)**:
   - Assets and reaction characters float with 3D perspective tilt (`rotateX`, `rotateY`), smooth floating sine physics, and soft neon rim glow, completely free of tacky badge borders.

---

## ⚡ Rule 6: The 2-Beat Curiosity Gap Framework & Scriptwriting Standards

Every short-form script follows the high-retention 4-beat structure:

1. **Hook (0–3s)**: High-velocity cognitive paradox, hypocrisy, or behavioral quirk (*"Why being single feels lonely, but dating leaves you exhausted"*).
2. **Beat 1 — The Mechanism (4–8s)**: Names the psychological concept with scientific authority (*"Psychologists call this Identity Borrowing."*). Spoken cue is synchronized with on-screen `<ConceptKeywordSlam />`.
3. **Beat 2 — The Trap / The Twist (9–15s)**: **Immediately raises the stakes** so curiosity peaks a second time (*"And here's the trap: your nervous system confuses anxiety with chemistry..."*). Never let curiosity die after naming the term!
4. **Beat 3 — The Rewire Shift (16–20s)**: Sharp, memorable psychological rule (*"If you have to shrink yourself to keep them, that's not connection — it's nervous system panic."*).
5. **Beat 4 — The Spoken Interactive CTA (21–24s)**: After an intimate 200–250ms breath pause, Judy asks a direct, open-ended question looking into the camera (*"Be honest: have you ever lost yourself trying to keep someone else happy? Tell me below."*).

### The "Comfort" Title Trap & Tier-1 Linguistic Filter:
- ❌ **THE "COMFORT" TITLE TRAP BAN**: Never output comforting reassurances or optimistic platitudes (*"True relationships still exist..."*, *"When life feels unfair..."*, *"You are not alone"*). Impatient scrollers stop ONLY for cognitive tension, paradoxes, and uncomfortable truths (*"Why Social Media Convinced You Love Isn't Real"*, *"The Dating Illusion That's Exhausting Your Brain"*).
- ❌ **TIER-1 AMERICAN LINGUISTIC FILTER**: Strictly enforce natural American English idioms. Ban unnatural literal phrasing like *"made it look untrue"* (replace with *"made it feel fake"*, *"lied to you"*, *"distorted reality"*).

### The 9 Core Psychological Archetypes (Mode B Classification):
The scriptwriter autonomously categorizes uncurated topics into 9 proven psychological archetypes (62–68 words, 21–24s runtime) or synthesizes an exact 2-Beat curiosity gap script:
1. **People-Pleasing & Boundaries**: Fawn Response Conditioning (*"Notice how saying yes to plans you dread always leaves you resenting the other person?..."*)
2. **Comparison & Timelines**: Upward Social Anchoring (*"Notice how achieving your goals never stops you from feeling five years behind everyone else?..."*)
3. **Fear of Trying & Casual Mask**: Anticipatory Self-Handicapping (*"Notice how you pretend not to care about the things you want most?..."*)
4. **Dopamine & Screen Loops**: Dopamine Loop Hijacking (*"Ever close an app only to reopen it five seconds later without thinking?..."*)
5. **Chronic Overthinking**: Threat Simulation Rumination (*"Why does your brain wait until your head hits the pillow to replay an awkward text?..."*)
6. **Burnout & Freeze**: Autonomic Nervous System Freeze (*"Notice how resting on the couch doesn't recharge you when your mind is screaming with guilt?..."*)
7. **Relationships & Attachment**: Anxious Attachment Mirroring (*"Why does dating leave you exhausted, but being alone feels unbearable?..."*)
8. **Wealth & Hedonic Spending**: The Hedonic Treadmill Effect (*"Notice how earning more money never makes you feel financially secure?..."*)
9. **Sleep & Biology**: The Cortisol Awakening Mismatch (*"Why do you wake up with a racing heart at three AM even when exhausted?..."*)

### Banned AI Clichés & Sales Hype:
- ❌ *"Here's the thing..."*, *"The truth is..."*, *"You're not lazy, you're..."*, *"What most people don't realize is..."*, *"The tricky part is..."*
- ❌ *"masterpiece"*, *"life-changing"*, *"must-read"*, *"buy now"*, *"game-changer"*
- ❌ Vague comfort topics (*"When life feels unfair"*, *"You are not alone"*). Use concrete quirks only!

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

## 🛠️ Rule 8: Master Production CLI Execution

### Master Command:
```bash
.venv/bin/python3 scripts/create_clip.py \
  --name "<clip_name>" \
  --topic "<topic>" \
  --script "<script_text>" \
  [--andrew] \
  [--meta] \
  [--illustration "<clip_name>/assets/scene_illustration.png"] \
  [--meme <id>] \
  [--no-meme] \
  [--facecam <path_to_video>]
```

### Render Outputs:
```bash
# Render 4K Still Thumbnail
npx remotion still src/index.ts <clip_name>Thumbnail out/<clip_name>_thumbnail.png

# Render Full Video MP4
npx remotion render src/index.ts <clip_name> out/<clip_name>.mp4
```

### Git Push & Clean Repo Policy:
- Always test with `python3 -m py_compile` before committing.
- Commit all production assets, scripts, and documentation together with clean conventional commits (`feat(clip): ...`).
- Push to `origin main` upon completion.
