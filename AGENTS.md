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
> 2. **Step 2 — Clean Editorial Hero Illustration**:
>    - Derive the prompt using `python3 scripts/generate_illustration_prompt.py --topic "<topic>" --script "<hook>"`.
>    - Call `generate_image` with `AspectRatio="16:9"` (do NOT pass fixed reference images). Save to `public/<clip_name>/assets/scene_illustration.png`.
> 3. **Step 3 — Master CLI Execution**:
>    - Execute:
>      ```bash
>      .venv/bin/python3 scripts/create_clip.py --name "<clip_name>" --topic "<topic>" --script "<script>" [--andrew] [--meta]
>      ```
>    - This autonomously synthesizes neural audio (with 220ms CTA breath pause), transcribes Faster-Whisper millisecond timestamps, selects the culturally accurate tactical meme from the Meme Board, scaffolds Remotion components, and registers the 4K thumbnail.
> 4. **Step 4 — Final Audit & Delivery**:
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
   - Wrapped in tactile 3D card tilt (`PhysicalCard tiltX={3} tiltY={-3}`), 2.5D Ken Burns slow zoom-drift (1.0x -> 1.07x), specular diagonal glass glare sheen sweep, anchored masking tape strip (`TapeStrip`), and monospace telemetry HUD badge (`COGNITIVE DIAGNOSTIC // 01`).
   - Sits behind the opening tactical meme hook and is revealed as the meme collapses.

---

## ⚡ Rule 6: The 2-Beat Curiosity Gap Framework & Scriptwriting Standards

Every short-form script follows the high-retention 4-beat structure:

1. **Hook (0–3s)**: High-velocity cognitive paradox, hypocrisy, or behavioral quirk (*"Why being single feels lonely, but dating leaves you exhausted"*).
2. **Beat 1 — The Mechanism (4–8s)**: Names the psychological concept with scientific authority (*"Psychologists call this Identity Borrowing."*). Spoken cue is synchronized with on-screen `<ConceptKeywordSlam />`.
3. **Beat 2 — The Trap / The Twist (9–15s)**: **Immediately raises the stakes** so curiosity peaks a second time (*"And here's the trap: your nervous system confuses anxiety with chemistry..."*). Never let curiosity die after naming the term!
4. **Beat 3 — The Rewire Shift (16–20s)**: Sharp, memorable psychological rule (*"If you have to shrink yourself to keep them, that's not connection — it's nervous system panic."*).
5. **Beat 4 — The Spoken Interactive CTA (21–24s)**: After an intimate 200–250ms breath pause, Judy asks a direct, open-ended question looking into the camera (*"Be honest: have you ever lost yourself trying to keep someone else happy? Tell me below."*).

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
   - Pure viral hook titles only (`THE DATING TRAP`, `DIAGRAM YOUR LOOP`).
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
