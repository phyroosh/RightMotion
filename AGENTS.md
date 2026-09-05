# 🎬 RightClips Autonomous AI Agent Engine Guide

This document is the **authoritative specification** for any AI Agent (Antigravity/AGY, Claude Code, Cursor, Copilot, ChatGPT) working in the **RightClips** repository.

---

## 🏷️ Universal Bracket-Tag Channel Routing (MANDATORY AGENT RULE)

Every video script submitted to RightClips is tagged with one of four channel niche brackets:
- **`{Self Improvement}`** (or `{Self Improvment}`) $\rightarrow$ Judy Insights Channel
- **`{Finance}`** $\rightarrow$ Apex Wealth / Capital Markets Channel
- **`{Health}`** $\rightarrow$ BioMatrix / Longevity & Cellular Biology Channel
- **`{facecam}`** $\rightarrow$ Talking-Head / Creator Facecam Channel

> [!CRITICAL]
> **MANDATORY AGENT STOP-AND-ASK RULE**:
> If the user submits a script prompt **WITHOUT** `{Finance}`, `{Self Improvement}`, `{Health}`, or `{facecam}`:
> **The AI Agent MUST HALT immediately and ask the user which style they want before taking any action:**
> *"Which channel editing style would you like me to use for this video?*
> *1. `{Self Improvement}` (Judy Insights: Apple Studio Light mesh canvas, psychology, mindset, Judy presenter)*
> *2. `{Finance}` (Apex Wealth: Rich Dark Obsidian & Cyber-Gold/Emerald, high-velocity financial graphics)*
> *3. `{Health}` (BioMatrix: Deep Bio-Tech Navy & Cyber-Mint/Cyan clinical luxury, biometric telemetry)*
> *4. `{facecam}` (Talking-Head / Creator Facecam: Dynamic zoom punch-ins, real speaker video/audio, B-roll overlays, kinetic captions)*"
>
> DO NOT guess or assume the style if the tag is missing!

### 🔇 Universal '{no topics}' Modifier Tag (MANDATORY AGENT RULE)

If the user includes **`{no topics}`** (or **`{no topic}`**, case-insensitive) anywhere in their video generation request:
1. **ZERO Topic Suggestions**: The AI Agent is strictly forbidden from suggesting, pitching, or appending follow-up video topics, future content ideas, or next-step topic lists. Do NOT suggest new topics this time!
2. **Automatic Sanitization**: The agent and generation scripts MUST strip `{no topics}` or `{no topic}` from the prompt text, topic name, canvas cards, voiceover scripts, and metadata so the modifier never leaks into video assets.
3. **Laser-Focused Execution**: Focus 100% of effort purely on generating, animating, sound-designing, auditing, and delivering the single requested video.

---

### 🧠 Universal Direct Topic Protocol: Organic Mode is DEFAULT, PDF Search ONLY with '{meta}' (ZERO CHATGPT ROUND-TRIPS)

> [!CRITICAL]
> **ORGANIC GROWTH MODE IS DEFAULT! NEVER HUNT FOR PDF UNLESS '{meta}' IS EXPLICITLY USED!**
> Users can directly submit raw topics into RightClips (e.g. `{Self Improvement} The Fear of Being Caught Trying`).
> - **DEFAULT (NO PDF SEARCH)**: Every video is treated as an **Organic / Growth Video (Mode B)** by default. Strictly skip all PDF hunting and product metadata!
> - **OPT-IN PDF HUNT (`{meta}`)**: ONLY search `Products/*.pdf` and generate product metadata when **`{meta}`**, `--meta`, or **`{product: ...}`** is explicitly present in the prompt!

#### 1. Mode B: Organic / Growth Video — DEFAULT (Triggered when '{meta}' is ABSENT):
1. **STRICTLY SKIP ALL PDF SEARCH**:
   - Do NOT inspect any PDF in `Products/`, do NOT search for product content, and do NOT output a `[METADATA]` block.
2. **Output ONLY the `[VOICEOVER]` block**:
   ```
   [VOICEOVER]
   <clean voiceover script>
   ```
3. **Organic Community CTA**:
   - End with a grounded channel/subscriber invitation (e.g. *"If you're trying to figure yourself out without all the noise, stick around. We unpack these patterns every day."* or *"Follow along if you want more breakdowns on how your brain actually works."*).
4. **Sanitization**:
   - Strip `{no meta}` and `{meta}` from all prompt text, titles, canvas text, and audio synthesis so the tags never appear in video assets.

#### 2. Mode A: Standard (Product-Linked Video) — OPT-IN ONLY (Triggered when '{meta}' IS PRESENT):
1. **Autonomously Scan Product PDFs**:
   - Only runs when `{meta}` or `{product: ...}` is in the request.
   - Inspect `Products/*.pdf` (e.g. `Photon.pdf` or via `python3 scripts/pdf_topic_matcher.py --topic "<topic>"`).
   - Identify the exact matching chapter and exercise:
     - Page 4: *Trace the Wire* (conditioning, inherited beliefs)
     - Page 6: *Map the Gap* (You vs. The Mask, social performance vs alone)
     - Page 8: *Diagram Your Loop* (bad habits, phone loops, dopamine autopilot)
     - Page 10: *Write the Identity, Then the Proof* (neuroplasticity, identity votes)
     - Page 12: *The Four Layers* (values, environment, systems, feedback)
     - Page 14: *The Minimum Viable Day* (low energy survival, consistency, emergency baseline)
2. **Extract Visual Proof**:
   - Run `python3 scripts/extract_product_page.py <pdf> <page_num>` to generate the retina screenshot in `public/products/<stem>/page_<num>.png`.
3. **Generate `[METADATA]` Block**:
   ```
   [METADATA]
   product_file: Photon.pdf
   page_number: 8
   exercise_title: Diagram Your Loop

   [VOICEOVER]
   <voiceover script>
   ```
4. **MANDATORY SILENT PDF RULE (CRITICAL)**:
   - **NEVER speak the PDF filename** (never say "Photon" or "Photon.pdf" aloud).
   - **NEVER speak the page number** (never say "on page 8" or "page 14" aloud).
   - *Why*: RightClips handles the visual proof automatically by displaying the real designed page screenshot on screen via `<ProductPageShowcase />`. The voiceover only references it conversationally (e.g. *"I mapped out the full breakdown on the worksheet below so you can audit your own habits. Grab the guide below..."*).

#### 3. Judy Scriptwriting Persona & Quality Standards:
- **Persona**: Female anime-style host (Judy) with a soft, warm, intelligent, emotionally grounded voice ("smart older sister" or "caring friend").
- **Length & Pacing**: Strict **65–85 words** (~24–30s, hard cap 90 words). *Empirical channel data proves shorter runtimes (24–30s) deliver 65–75%+ retention and 10x higher view velocity.*
- **Structure**:
  - **Hook (0–3s)**: High-velocity pattern interrupt. Lead with a **cognitive paradox, hypocrisy, or concrete behavioral quirk** (*"Why smart people keep making bad choices"*, *"Notice how you pretend not to care about the things you want most"*).
  - **The 7-Second Retention Pivot (3–8s)**: By second 5.5–7.0, deliver the counter-intuitive psychological/neurological mechanism (*"It's not laziness — your nervous system is in dorsal vagal freeze."* or *"Psychologists call this the Counter-Intentional Loop."*). Never allow a narrative or visual lull at the 7-second mark!
  - **Actionable Shift & Ending (8–28s)**: Concrete, micro-habit rewiring $\rightarrow$ grounded CTA.
- **PERMANENT BAN ON VAGUE COMFORT TOPICS (ANTI-FLOP RULE)**:
  - ❌ *"When life feels unfair"* (scored 20.8% retention — 80% swipe-away rate!)
  - ❌ *"You are not alone"*, *"Believe in yourself"*, *"It's okay to feel sad"* (scrollers swipe away from broad motivational comfort expecting an unhelpful lecture).
  - ✅ **Concrete Behavioral Quirks Only**: Contradictions, inner friction, overthinking loops, self-sabotage mechanisms.
- **PERMANENT BAN ON AI CLICHÉS**:
  - ❌ *"Here's the thing..."*
  - ❌ *"The truth is..."*
  - ❌ *"You're not lazy, you're..."*
  - ❌ *"What most people don't realize is..."*
  - ❌ *"The tricky part is..."*
  - ❌ *"That's because..."*
- **PERMANENT BAN ON SALES HYPE**:
  - ❌ *"masterpiece"*, *"life-changing"*, *"must-read"*, *"buy now"*, *"worth every cent"*, *"game-changer"*

#### 4. Mandatory `[PINNED COMMENT]` Output (ZERO-COMMENT KILLER):
Every AI Agent generating a video script MUST generate an open-ended, highly relatable or polarizing creator comment to catalyst viewer engagement and comments from 0:
```
[PINNED COMMENT]
<provocative, low-friction question or callout for viewers to reply to>
```
*Example: "Question for you: What's the one thing you secretly care deeply about, but pretend is no big deal around others? Be honest 👇"*

---

### 📄 Universal '{product: <name>, page: <num>}' Showcase Tag (MANDATORY AGENT RULE)

> [!IMPORTANT]
> **PDF METADATA IS STRICTLY OPTIONAL — DEFAULT TO NORMAL RENDERING!**
> There will **NOT** always be PDF metadata or page numbers present in the script. Most video requests will be standard, high-impact videos without any attached PDF.
> - When PDF metadata (`{product: ...}`) is **ABSENT**:
>   - Render 100% normally using the standard Cutout Asset Engine (`ProCutout` props, physical cards, stickers, meters, graphs).
>   - **NEVER** search, hunt, or fail for missing PDFs or product screenshots! Default purely to standard video production.
> - When PDF metadata is **EXPLICITLY PRESENT**:
>   - ONLY then look at the PDF in `Products/` or `public/products/`, extract the target page or focused paragraph screenshot, and showcase it on screen.

If the user or script explicitly includes **`{product: Photon.pdf, page: 14}`** (or CLI `--product Photon.pdf --product-page 14`):
1. **The Strategic Purpose (The Goal)**:
   - **Visual Proof**: Showing the real, designed page from the PDF makes the product feel tangible and real instead of abstract advice. Viewers instantly see that a structured, professional solution already exists.
   - **Higher Conversions**: When viewers actually see the dark-mode layout and specific exercise on screen, trust goes up and click-through rates to buy the PDF increase significantly.
   - **Seamless CTA**: It visually backs up Judy’s voiceover the exact second she references the worksheet, making the transition feel like a natural feature of the video rather than an ad.
2. **Instant Single-Page Extraction**:
   - The engine checks `Products/<name>.pdf` and extracts **only** the target page into `public/products/<name>/page_<num>.png` using `pdftoppm` at retina resolution (220 DPI).
   - Automatically detects isolated paragraph/exercise blocks to produce a focused, readable screenshot (`page_<num>_paragraph.png`).
   - NEVER parse or read the entire PDF.
3. **Visual Presentation Requirements**:
   - Use `ProductPageShowcase` component from `../../components/ProductPageShowcase`.
   - Must render with physical 3D card tilt (`PhysicalCard`), anchored masking tape strip (`TapeStrip`), animated specular glass glare sweep, and floating telemetry badge (`PAGE 14 • WORKSHEET PROTOCOL`).
   - Timed to reveal on the exact spoken frame where the host introduces the worksheet or protocol.
4. **Automatic Sanitization**:
   - Strip `{product: ..., page: ...}` from prompt text, card titles, and speech synthesis so the tag never leaks into spoken voiceover or UI text.

---

### 🖼️ ZERO Page Numbers or PDF Names on Thumbnails (MANDATORY AGENT RULE)

> [!CRITICAL]
> **THUMBNAILS MUST NEVER INCLUDE PAGE NUMBERS OR PDF NAMES!**
> Having `(PAGE 7)`, `PAGE 14`, or `PHOTON PROTOCOL` on a YouTube Short / Instagram Reel thumbnail makes zero sense to prospective viewers and severely hurts CTR.
> 1. **Pure Viral Hooks Only**: Thumbnail titles must be 100% focused on the emotional/psychological hook (e.g., `DIAGRAM YOUR LOOP`, `THE MINIMUM VIABLE DAY`, `THE DOPAMINE RESET`).
> 2. **Strict Sanitization**: AI Agents and generators MUST strip all page mentions:
>    - `(Page <num>)`, `[Page <num>]`, `Page <num>`, `Pg. <num>`, `p. <num>`
>    - `.pdf` filenames (e.g. `Photon.pdf`)
> 3. **Badge Hygiene**: Thumbnail category badges and extra badges must strictly reflect channel niches (`PSYCHOLOGY`, `MINDSET`, `WEALTH`, `BIOHACK`), NEVER a product name or page reference.

---

### 🎥 Autonomous Entity B-Roll & Dynamic Host Slide-Down Protocol (MANDATORY FACECAM RULE)

> [!CRITICAL]
> **EVERY FACECAM VIDEO MUST PAIR NAMED ENTITIES WITH REAL B-ROLL PROOF AND SMOOTH HOST SLIDE-DOWN MOTION!**
> Viewers trust visual proof. When the host mentions a specific person, company, hotel, location, acquisition, or valuation, the AI Agent MUST autonomously fetch/generate the media and execute the split-screen slide.
>
> 1. **Entity Identification**:
>    - Scan the spoken script for named entities (e.g., *Ankit Sahni*, *The Hazelnut Factory*, *Bikaji ₹131 Crore acquisition*, *Lucknow, UP*, *Specialty Coffee*, *Artisanal Bakery*).
> 2. **Autonomous Fetching & Generation (`scripts/fetch_entity_media.py`)**:
>    - Use `python3 scripts/fetch_entity_media.py`:
>      - Real news clipping graphic with highlighted snippet (`--news-clipping --headline "..." --highlight "..."`)
>      - Search Engine AI Overview proof card (`--search-overview --query "..." --highlight "..."`)
>      - Direct URL download (`--url "<image_url>"`)
>    - Save all assets in `public/<clip_name>/broll/<entity_name>.png`.
> 3. **Dynamic Host Slide-Down Motion (`slideDownBeats`)**:
>    - Whenever B-roll is visible, the host video MUST smoothly slide down into the lower half:
>      ```tsx
>      const slideDownBeats: SlideBeat[] = [
>        { startFrame: 30, endFrame: 115, offsetY: 360 },
>        { startFrame: 155, endFrame: 250, offsetY: 360 },
>      ];
>      ```
>    - `translateY: 340px - 360px` centers the speaker's head, mic, and gesturing hands in the bottom 50% without awkward occlusion.
>    - When the B-roll beat concludes, the host video smoothly springs back up to the centered A-roll position (`translateY: 0`).
> 4. **Top B-Roll Component (`<FacecamBRoll />`)**:
>    - Renders in the top region (`top-[6%] h-[45%] rounded-[32px] border-4 border-white/20 shadow-2xl`).
>    - Includes subtle Ken Burns slow-zoom (`1.0x -> 1.08x`), status badges (`ANKIT SAHNI • FOUNDER`), and optional animated spotlight circles (`spotlightCircle={true}`).
> 5. **Caption Safe Zone**:
>    - Kinetic captions sit at `bottom-[18%]`, leaving the chest zone and B-roll safe zones completely clear and harmonious.

---

### 🎨 Autonomous Clean Editorial Hero Visual & Motion Graphics Protocol (MANDATORY AGENT RULE)

> [!CRITICAL]
> **RIGHTCLIPS USES BESPOKE CLEAN MODERN EDITORIAL 2.5D CONCEPTUAL ART WRAPPED IN MOTION GRAPHICS!**
> Slapping gloomy, dark, murky impasto oil paintings onto Judy Insights' bright Apple Studio Light mesh canvas is PERMANENTLY BANNED.
> Hero visuals must be bright, clean, modern, and directly illustrate the concrete human narrative conflict in the hook.
>
> 1. **The Flagship Editorial Aesthetic (Vox / The New Yorker / Apple Editorial)**:
>    - **Art Style**: Clean modern editorial conceptual illustration with crisp vector lines, elegant color blocking, and soft pastel gradients.
>    - **Atmosphere & Lighting**: Warm natural sunlight, bright uncluttered architectural or everyday settings (sunlit school hallway, modern library, Scandinavian study, minimalist bedroom), generous negative space.
>    - **Storytelling**: Clear visual contrast of human situations (e.g. peaceful independent protagonist vs. stressed phone-trapped couple). No random fantasy monsters, no gloomy dungeon shadows, no glowing squiggles around eyes.
>    - **Strict Style Bans**: NO murky dark impasto oil paintings, NO repetitive gloomy chiaroscuro boilerplates, NO anime faces, NO 3D CGI cartoon look, NO text, NO watermarks, NO borders.
>    - **PERMANENT BAN ON REFERENCE IMAGE LOCK-IN**: NEVER pass a fixed reference image (`ImagePaths`) to `generate_image`! Passing a reference image forces the image model to lock into the exact same face, dark moody lighting, and composition every time.
>
> 2. **Prompt Generation Script (`scripts/generate_illustration_prompt.py`)**:
>    - Run `python3 scripts/generate_illustration_prompt.py --topic "<topic>" --script "<hook>"` to derive the exact prompt directly from the spoken narrative tension.
>    - Supports styles: `--style editorial` (flagship default), `--style claymorphic_3d`, and `--style cinematic_studio`.
>
> 3. **Motion Graphics Integration (`<CinematicIllustrationCard />`)**:
>    - **NEVER display flat, static images!**
>    - Wrap generated artwork in `<CinematicIllustrationCard />` (`src/components/CinematicIllustrationCard.tsx`).
>    - **Key Motion Features**:
>      - 2.5D Ken Burns slow drift (`zoomDrift: 1.0 -> 1.07`, subtle horizontal/vertical pan drift).
>      - Diagonal specular holographic glass glare sheen sweep on entrance (`glareProgress`).
>      - Physical 3D tactile card tilt (`PhysicalCard tiltX={3} tiltY={-3}`) with anchored masking tape strip (`TapeStrip`).
>      - Monospace HUD telemetry header pill (`COGNITIVE DIAGNOSTIC // 01` with pulsing live indicator dot).
>      - In-illustration diagnostic status badges (`ATMOSPHERIC CHANCE // HIGH`, `2.5D KINETIC`).
>      - Speech-anchored spotlight pulse (`highlightFrame`).
>
> 4. **Multi-Agent Graceful Fallback Protocol**:
>    - **Antigravity (or agents with `generate_image` tool)**:
>      - Call `generate_image` with `AspectRatio="16:9"` and the prompt from `generate_illustration_prompt.py`. DO NOT pass fixed reference images!
>      - Save the output to `public/<clip_name>/assets/scene_illustration.png`.
>      - Pass `--illustration <clip_name>/assets/scene_illustration.png` (or let `create_clip.py` auto-detect it).
>    - **Agents without `generate_image` (Claude Code, Cursor, Copilot)**:
>      - Cleanly skip image generation!
>      - `create_clip.py` will automatically fall back to the standard Cutout Asset Engine (`ProCutout` props, physical cards, meters) without failing or erroring.
>
> 5. **Presenter & Scene Timing**:
>    - When an illustration card is used in Scene 1 (Frames 0 to Scene 2 start), the card is revealed behind the opening meme hook.
>    - In `Presenter.tsx`, `isIntro` is disabled so Judy does NOT obscure the card with a full-screen blur during intro.
>    - Judy enters smoothly during the outro (`isFinale`) to deliver the closing connection and CTA without card collision.

---

### 👥 Judy & Andrew Conversational Duo & Waist-Up Framing Protocol (MANDATORY AGENT RULE)

> [!CRITICAL]
> **JUDY & ANDREW CONVERSATIONAL DUO PROTOCOL & SCREEN-INTIMATE FRAMING!**
> 1. **Screen-Intimate Framing (PERMANENT BAN ON FAR FULL-BODY AVATARS)**:
>    - Full-body head-to-toe avatars make characters appear distant and disconnected on vertical mobile screens.
>    - Legacy full-body avatars are archived in `public/archive_avatars/`.
>    - All videos MUST use **screen-intimate, waist-up cutouts** (`character_pointing.png`, `character_crossed.png`, `character_open.png` for Judy; `andrew_crossed.png`, `andrew_thinking.png` for Andrew) with close-up presence (`baseHeight={1280 - 1550}`).
>    - Characters appear right in front of the viewer, maximizing intimacy, retention, and conversational warmth.
>
> 2. **Judy & Andrew Duo Dynamic**:
>    - Triggered in `{Self Improvement}` (Judy Insights) when `--duo`, `{duo}`, or speaker turns (`JUDY:` / `ANDREW:`) are present in the script or prompt.
>    - **Voice Profiles**: Judy (`en-US-AvaMultilingualNeural`, `rate="+8%"`) & Andrew (`en-US-SteffanNeural`, `rate="+7%"`).
>    - **Vibe & Chemistry**: Andrew acts as the skeptical, inquisitive viewer who voices honest pushback questions (*"Wait, so you mean I shouldn't even have fun with my friends?"*). Judy responds with warm, grounded psychological insight. They have witty, lighthearted banter with subtle chemistry.
>    - **Dialogue Engine (`scripts/dialogue_engine.py`)**: Turn-based audio synthesis with standardized 44.1kHz stereo normalization, 140ms inter-turn pause compression, and word-level faster-whisper alignment with deterministic speaker attribution.
>    - **Turn-Based Staging (`<DuoPresenter />`)**: Active speaker scales up to `1.08x` with bright illumination; inactive speaker switches to reactive listening pose at `0.92x` scale with subtle dimming (`opacity-80`). Broadcast HUD badge sits at `top-[5.5%]`.
>    - **Dual-Color Kinetic Captions**: Andrew's spoken words pop in vibrant Amber/Gold (`#f59e0b`), while Judy's pop in signature Electric Sky Blue (`#38bdf8` / `#0071e3`).

---

### 🎭 Universal Tactical Meme Integration Protocol (MANDATORY RETENTION BOOSTER RULE)

> [!CRITICAL]
> **TACTICAL MEME INTEGRATION & RETENTION ENGINE (DEFAULT-ON, < 2.5S RULE)!**
> The human brain reads and registers a familiar meme in under 0.5 seconds. If a meme lingers on screen for $>2.5$ seconds, viewer retention plummets because the visual becomes dead weight. RightClips includes an autonomous tactical meme engine designed to spike dopamine and engagement without disrupting video flow.
>
> 1. **Default-On Policy (High Retention by Default)**:
>    - **Memes are ENABLED BY DEFAULT** for all videos!
>    - The autonomous semantic matcher (`scripts/meme_matcher.py`) analyzes the prompt, topic, and script to automatically deploy the best-matching iconic meme during Scene 1 hook or Scene 2 friction.
>    - Maximum **1 meme per standard video** to maintain intentionality and prevent spam.
>
> 2. **Universal '{no meme}' Modifier Tag (Opt-Out Rule)**:
>    - If the user or script includes **`{no meme}`** (or **`{no memes}`**, case-insensitive) or CLI `--no-meme`:
>      - **STRICTLY DISABLE MEMES**: Zero memes will be rendered in the video.
>      - The engine cleanly falls back purely to the standard kinetic cutout/illustration engine.
>
> 3. **Explicit Meme Override (`{meme: <id>}`)**:
>    - If the user wants a specific meme, they can pass `{meme: <id>}` (e.g. `{meme: side_eye_dog}`) or CLI `--meme <id>` to override the auto-selection.
>
> 4. **Strict Duration Cap (< 2.5s)**:
>    - Standard duration: **1.2s to 2.0s** (36 to 60 frames at 30 fps).
>    - NEVER exceed 2.2 seconds under any circumstances!
>    - Enters with a high-velocity spring pop and snaps out cleanly with a rapid collapse spring.
>
> 5. **100% Muted Meme Audio (`volume={0}`)**:
>    - Meme audio MUST be completely muted (`volume={0}`).
>    - Narration voiceover and background music remain crystal-clear and uninterrupted.
>
> 6. **Fast-Forwarded Playback (`playbackRate={1.35 - 1.5}`)**:
>    - Memes play back at accelerated speed (default `1.4x`), matching the fast-paced tempo of modern short-form feeds.
>
> 7. **Built-in 23 Iconic Curated Memes Catalog (`public/memes/`)**:
>    - All assets are pre-trimmed, audio-stripped, and compressed (7.4 MB total repository footprint):
>      - `ishowspeed_stare`: Speechless shock, cognitive freeze, utter disbelief.
>      - `doctor_strange_loop`: Endless repetition, phone doomscrolling loops, autopilot.
>      - `side_eye_dog`: Caught red-handed, skepticism, suspicious sideways glance.
>      - `angry_grandpa_rage`: Breaking point, explosive rage, internal frustration.
>      - `awkward_smile_dog`: Masking pain, pretending everything is fine.
>      - `confused_kid`: Cognitive dissonance, paradoxical confusion.
>      - `walter_white_despair`: Rock bottom, complete ego collapse, devastation.
>      - `office_rage_smash`: Burnout overload, throwing in the towel, quitting.
>      - `michael_jackson_popcorn`: Spectator mode, watching school/online drama.
>      - `rowley_innocent_wave`: Wholesome, oblivious innocence, naive smile.
>      - `lego_bruce_flabbergasted`: Mesmerized, love-struck, stunned infatuation.
>      - `courtroom_shout_me`: Called out in 4K, defensive excuse-making.
>      - `al_pacino_depressed_bench`: Quiet isolation, existential void, feeling lonely.
>      - `ishowspeed_nodding_headphones`: Agreeing with facts, head nodding, validation.
>      - `bateman_iphone_inspection`: Perceived social scrutiny, over-analyzing texts.
>      - `cat_laughing_pointing`: Savage reality check, mocking self-delusion.
>      - `tony_stark_explosion`: Breakthrough moment, unstoppable power unlocked.
>      - `rdj_shocked_closeup`: Sudden realization, paradigm shift, twist.
>      - `wet_seal_cat`: Dorsal vagal freeze, numb paralysis, bed rotting.
>      - `ronaldo_sipping_tea`: Unbothered, zero drama, supreme calm confidence.
>      - `sweating_gamer`: Acute anxiety, high pressure, sweating bullets.
>      - `chrome_cyborg_overload`: Sensory overload, fried dopamine receptors.
>      - `doctor_strange_multiverse`: Mind-blown, expanding consciousness, ego death.
>
> 8. **Dual Tactical Meme Presentation Modes**:
>    - **Mode A: Video Loop (`<TacticalMemeCard />`)**: Fast-forwarded (1.4x), muted video loop with diagonal specular glass glare sweep, monospace HUD badge, and synchronized SFX.
>    - **Mode B: Still-Frame Reaction Sticker (`<TacticalMemeFrame />`)**: Ultra-snappy (< 1.2s) freeze-frame reaction card with tactile tilt and drop shadow, popping right on a specific spoken word (e.g. at the 7-second friction pivot point).
>    - **First-Frame Hook (`startFrame={0}`)**: Memes in Scene 1 start at frame 0 to immediately hook scrollers within the first 500ms of feed playback!
>    - **Mid-Video Retention Spike**: Tactical meme frames can also be deployed in Scene 2 (~seconds 7–12) to puncture cognitive tension with humor and prevent mid-video swipe-away.
>
> 9. **Automatic Tag Sanitization**:
>    - AI Agents and generators MUST strip `{meme}`, `{meme: <id>}`, `{no meme}`, and `{no memes}` so modifiers never leak into spoken voiceover, card titles, or canvas text.

---

## 💡 Master Channel Topic Ideation & Viral Prompt Specification

Every video produced or ideated in RightClips must target high-retention, deeply emotional, or mathematically irresistible topics across three specialized niche pillars:

### 1. `{Self Improvement}` (Judy Insights) — Deeply Relatable Teenager Psychology & Mindset:
*Goal: Speak directly to the private inner turmoil, emotional battles, and social world of teenagers with validation and actionable mindset shifts.*
- **Core Themes & Viral Hooks**:
  - **Side Character Syndrome**: Why you feel like a spectator in your own life and social circle.
  - **The Fear of Being Caught Trying**: Why teens pretend not to care about school, art, or hobbies to protect against failure.
  - **Social Overthinking at 2 AM**: The neurochemistry behind replaying awkward interactions and over-analyzing text delays.
  - **High School Mask Exhaustion**: The emotional burnout of smiling all day when you feel hollow inside.
  - **Friendship Drift & Heartbreak**: Why drifting apart from your childhood friend group hurts more than romantic breakups.
  - **The Behind-the-Scenes vs Highlight Reel**: The psychological toll of comparing your private pain to classmates' Instagram feeds.
  - **The Spotlight Illusion**: Empirical psychological proof that peers are way too worried about themselves to scrutinize you.
  - **Why Parental Criticism Stings 10x Harder**: The adolescent neurological sensitivity to parental evaluation.
  - **Rebuilding Self-Trust**: How to stop hating yourself after repeatedly breaking personal goals and promises.
  - **Starting from Absolute Zero**: A compass for teenagers with no clear passion, direction, or plan.

---

### 2. `{Health}` (BioMatrix) — Essential Habits & Health Tips for Teens, Lost & Confused People:
*Goal: Provide biological lifelines, clinical nervous system resets, and zero-friction micro-habits for individuals stuck in freeze mode, burnout, or directionless exhaustion.*
- **Core Themes & Viral Hooks**:
  - **The 10-Minute Morning Anchor**: Rebuilding agency and physiological stability when waking up feeling completely aimless.
  - **Breaking the Nervous System Freeze Response**: Physical hacks to snap out of hours-long doomscrolling paralysis.
  - **The 48-Hour Dopamine Baseline Reset**: Clearing sensory overstimulation to reignite baseline motivation and physical energy.
  - **Low-Energy Survival Protocols**: Self-compassionate physical routines for days when getting out of bed feels nearly impossible.
  - **The 2-Minute Micro-Action Rule**: Shrinking the initiation threshold so the brain cannot trigger autonomic resistance.
  - **The 3-Minute Vagus Nerve Reset**: Instant parasympathetic down-regulation to eliminate acute panic and sensory overwhelm.
  - **The 90-Minute Caffeine Delay Rule**: Allowing morning adenosine to fully clear to permanently eliminate the 2 PM energy crash.
  - **Cortisol Awakening Response (C.A.R.)**: Why you wake up feeling like a zombie even after 8 hours of sleep.
  - **Teen Circadian Phase Delay**: Why adolescent biology naturally stays awake until midnight and how to reset it without pills.
  - **Glucose Spike Mitigation**: Why lunch crashes happen and how meal sequencing prevents brain fog and lethargy.

---

### 3. `{Finance}` (Apex Wealth) — Basic to Advanced Early Adult Finance & Wealth Hacks:
*Goal: Demystify money for 18–25 year olds, eradicating predatory debt while equipping them with high-leverage compounding hacks.*

#### 💳 Pillar A: Essential Early Adult Financial Foundations (Basic to Intermediate)
- **Core Themes & Viral Hooks**:
  - **The 30% Credit Utilization Rule**: The exact credit card mechanics to reach an 800+ credit score without paying a penny of interest.
  - **The Big Bank Cash Trap**: Why keeping your savings in a 0.01% checking account loses you thousands to inflation every year.
  - **The First $10,000 Emergency Fund**: A step-by-step roadmap to build your first financial shield on an entry-level salary.
  - **The 20/4/10 Auto Loan Trap**: How a shiny car loan at age 22 silently destroys young professionals' 20s net worth.
  - **Decoding Your First Real Paycheck**: Unpacking gross income, FICA taxes, health insurance, and 401(k) company match math.
  - **Student Debt Elimination Mechanics**: Avalanche vs. Snowball methods to pay off loans 3x faster without misery.

#### 📈 Pillar B: Wealth Compounding & High-Leverage Financial Hacks (Intermediate to Advanced)
- **Core Themes & Viral Hooks**:
  - **The $1.2 Million Roth IRA Gap**: The mathematical reality of investing $200/month starting at age 20 versus age 30.
  - **The 50% Raise Rule**: How to immunize yourself against lifestyle inflation by automatically investing half of every promotion.
  - **Index Funds vs Active Stock Picking**: Why 95% of professional Wall Street traders lose to automated S&P 500 compounding.
  - **Plugging the Silent Leaks**: Identifying and killing stealth bank fees, forgotten subscriptions, and high-APR traps.
  - **Asymmetric Career Leverage**: Acquiring rare, high-value skill stacks instead of selling linear hours for wages.
  - **Side Hustle Tax Structuring**: Legal deductions and business write-offs for young creators, coders, and freelancers.

---

## 🚫 Strict Repo Hygiene & Git Push Policy (MANDATORY AGENT RULE)

> [!CRITICAL]
> **DO NOT PUSH TO GITHUB ANYTHING THAT IS PRODUCED BY RIGHTCLIPS!**
> Push **ONLY** the engine, core components, library assets, scripts, or anything that does the work.
> 
> **NEVER commit or push:**
> 1. Rendered outputs: `out/`, `out/*.mp4`, `out/*.png`
> 2. Produced video transcripts & speech: `public/*/voiceover.mp3`, `src/clips/*/transcript.json`
> 3. Produced video metadata: `studio/metadata.json`, `studio/uploads.json`
> 
> The repository must stay 100% clean as a pure reusable software engine.

---

## 🔍 Mandatory Frame-by-Frame Visual Quality Audit (MANDATORY AGENT RULE)

> [!CRITICAL]
> **EVERY AI AGENT MUST MANUALLY AUDIT STILL FRAMES BEFORE DECLARING COMPLETION!**
> Never render a video blindly. Before presenting the finished video to the user, the AI Agent MUST render key still frames across scene milestones (e.g. Frame 45, Frame 200, Frame 480, Frame 850) using:
> ```bash
> ./node_modules/.bin/remotion still src/index.ts <CompositionId> out/audit_frame_<number>.png --frame=<number> --browser-executable=/usr/bin/google-chrome --overwrite
> ```
> The agent MUST view and audit the rendered still image:
> 1. **Element Centering & Safe Zones**: Are cards, badges, and headers vertically centered in the safe zone? Ensure no element clips into the top 10% (phone status bar) or bottom 20% (caption and phone UI zone).
> 2. **Doodle & Marker Alignment**: Is every hand-drawn doodle, circle, underline, or highlight anchored strictly to its intended keyword/metric? Ensure NO doodles float detached in empty space.
> 3. **Caption Legibility & Contrast**: Are captions positioned at `bottom-[19%]` with high contrast? Ensure active word pills glow brightly (`#ffffff` on dark backgrounds, `#09090b` on light studio backgrounds).
> 4. **Mobile Font Scale Compliance**: Is EVERY piece of text $\ge 24\text{px}$?

---

## ⚡ PERMANENT BAN ON MONOLITHIC ALL-AT-ONCE BLOCKS (MANDATORY SPEECH-SYNCHRONIZED PROGRESSIVE REVEAL)

> [!CRITICAL]
> **EVERY ELEMENT MUST APPEAR ONE-BY-ONE SYNCHRONIZED WITH THE HOST'S SPOKEN WORDS!**
> Under NO circumstance may a video scene or card display multiple bullet points, switches, steps, or graphic items simultaneously at the start of the card.
>
> 1. **MANDATORY WORD SYNCHRONIZATION**:
>    - Every visual element inside a card (Hero Cutout, Problem Subtitle, Point 1, Point 2, Point 3, Actionable Protocol) MUST have its own individual spoken word cue frame (`frame >= startFrame`).
>    - Before that word cue frame is reached, the element MUST be 100% invisible:
>      ```tsx
>      const spItem1 = spring({ frame: frame - item1Frame, fps, config: { damping: 13, stiffness: 140 } });
>
>      <div
>        style={{
>          opacity: frame >= item1Frame ? Math.min(1, spItem1 * 1.2) : 0,
>          transform: `scale(${frame >= item1Frame ? interpolate(spItem1, [0, 1], [0.8, 1]) : 0.8}) translateY(${frame >= item1Frame ? interpolate(spItem1, [0, 1], [25, 0]) : 25}px)`,
>          pointerEvents: frame >= item1Frame ? "auto" : "none",
>        }}
>      >
>        {/* Item Content */}
>      </div>
>      ```
> 2. **PERMANENT BAN ON STATIC BULLET LISTS & CONCEPT DUMPS**:
>    - When presenting a 3-point rule, 3 biological switches, or financial steps, NEVER render all 3 points visible from frame 1 of the card.
>    - Point 1 lands when the voiceover says "First...".
>    - Point 2 lands when the voiceover says "Second...".
>    - Point 3 lands when the voiceover says "Third...".
>    - This progressive pacing commands viewer attention and skyrockets retention by 10x!
> 3. **SFX SYNCHRONIZATION**:
>    - Every progressive visual entrance must be paired with an audio Foley cue (`click` or `impact_hit` or `whoosh_sparkle`) in `SFX_CUES` on that exact entrance frame.

---

## 🚫 Strict Minimalist Card Hygiene (NO REDUNDANT PILL HEADERS & NO HIGHLIGHTER LINES)

> [!CRITICAL]
> **1. PERMANENT BAN ON BULKY TOP PILL HEADINGS (KEEP CARDS UNCROWDED)**:
> NEVER place repetitive, elongated top pill banners across the upper edge of cards (e.g., `CIRCADIAN DIAGNOSTICS`, `3 MORNING BIOLOGICAL SWITCHES`, `NEURO-DIAGNOSTIC ALERT`).
> - They waste critical safe-zone vertical space.
> - They collide with top tape strips and make cards feel cramped and cluttered.
> - **RULE**: Let the bold hero title and clean subtitle inside the card carry 100% of the topic context. Keep cards spacious, breathing, and minimal!
>
> **2. PERMANENT BAN ON HIGHLIGHTER LINES & UNDERLINE DOODLES ON TEXT**:
> NEVER place underline doodle strokes (`HandDrawnDoodle preset="underline"`) or marker lines (`HighlighterStroke`) under text headings.
> - They invariably collide, cut through descenders/letters, and look visually messy.
> - **RULE**: Use high-contrast colored typography (`text-rose-400`, `text-cyan-400`, `text-emerald-400`, `text-amber-400`) instead. Colored typography creates sharp, premium, zero-clutter visual hierarchy without messy lines.
> - Diagnostic circles (`HandDrawnDoodle preset="circle"`) may only be used if cleanly encircling an isolated metric (e.g., a standalone `3 AM` badge).
>
> **3. UNCLUTTERED, BREATHING VISUAL COMPOSITION**:
> - Cutout hero props (`ProCutout`) must be horizontally and vertically centered with `w-full flex justify-center items-center my-3`.
> - Always maintain generous padding (`p-8` or `p-10`) so every scene feels premium, cinematic, and easy to scan on mobile.

---

## 📱 iPhone 15 Base Model Mobile Readability Standard (NO TINY FONTS)

> [!CRITICAL]
> **VIDEOS MUST BE FULLY READABLE ON A BASE IPHONE 15 RUNNING 720p MOBILE STREAMING!**
> Small text causes instant viewer bounce and eye fatigue.
> 1. **ABSOLUTE MINIMUM FONT SIZE**: `24px` (`text-xl` or `text-2xl font-black`, `text-[24px]`).
> 2. **PERMANENT BAN**: NEVER use `text-xs` (12px), `text-sm` (14px), or `text-base` (16px) anywhere in 9:16 vertical videos.
> 3. **Hero Titles & Headers**: `50px - 72px` (`text-5xl` to `text-6xl font-black`).
> 4. **Secondary Labels & Subtitles**: `28px - 36px` (`text-2xl` to `text-3xl font-black`).
> 5. **Badges, Tickers & Telemetry Pills**: `24px - 30px` (`font-mono font-black uppercase`).

---

## 🔊 Sound Design & Foley Polish Standard (NO HARSH / PIERCING SFX)

> [!IMPORTANT]
> Audio must be cinematic, crisp, and comfortable to listen to with earbuds at full volume.
> 1. **Whip & Transition Cuts (`whoosh_fast`)**: Kept at `volume: 0.16 - 0.18` maximum with softened high frequencies (no piercing sword-like treble cuts).
> 2. **Impact Hits (`impact_hit`)**: Kept at `volume: 0.22 - 0.26` for deep punch without clipping.
> 3. **Tactile Clicks (`click`)**: `volume: 0.24 - 0.28`.
> 4. **Sparkles & Revelations (`whoosh_sparkle`)**: `volume: 0.30 - 0.34`.
> 5. **BGM Levels**: Kept at `0.10 - 0.14` so voiceover remains 100% articulate and dominant.

---

## 💯 Full Effort Creative Craftsmanship Policy (NO BAREBONES SHORTCUTS)

> [!CRITICAL]
> Every single video request must receive full creative effort:
> - Dynamic 3D depth, isometric card glare, living backgrounds, tactile tape strips.
> - High-impact visual metaphors from the Cutout Asset Engine (`ProCutout`, `PropComparison`).
> - Perfectly synchronized multi-layered sound design on every scene entrance.
> - Zero placeholder layouts or rushed shortcuts. Every video must look like a \$10,000 professional production.

---

### 🎨 Channel Design Systems Matrix

| Feature | `{Self Improvement}` (Judy Insights) | `{Finance}` (Apex Wealth) | `{Health}` (BioMatrix) | `{facecam}` (Talking-Head Creator) |
| :--- | :--- | :--- | :--- | :--- |
| **Canvas Background** | Pure Studio Off-White (`#f8fafc`) + warm amber & cognitive blue living orbs | Ultra-Rich Deep Obsidian Carbon (`#030712`, `#0b0f19`) + gold/emerald grid | Deep Bio-Tech Obsidian Navy (`#060913`, `#0a1124`) + cellular neon glow | Real Creator Video Layer (`<OffthreadVideo />`) + cinematic vignette & studio framing |
| **Color Accents** | Electric Blue (`#0071e3`), Warm Amber (`#f59e0b`), Rose (`#e11d48`) | Liquid Emerald (`#10b981`), Cyber-Gold (`#f59e0b`), Platinum Ice White | Cyber Mint (`#10b981`), Electric Cyan (`#06b6d4`), Vital Coral (`#f43f5e`) | Cyber-Gold (`#fbbf24`), Electric Cyan (`#22d3ee`), Emerald (`#10b981`), Pure White |
| **Pacing / Tempo** | `rate="+8%"` (Crisp articulate retention) | `rate="+11%"` (High-velocity, fast-paced Wall Street drive) | `rate="+8%"` (Authoritative, dense clinical retention) | Natural Creator Voice Cadence + Rapid 1.0x to 1.18x Punch-in Jump Cuts |
| **Beat Transitions** | `snap_up` / `zoom_out` (2.5s - 3.5s beats) | `whip_left` / `snap_up` (1.8s - 2.5s rapid cuts) | `snap_up` / `zoom_in` (2.2s - 3.0s telemetry shifts) | Digital Zoom Punch-ins (`whoosh_fast`), B-roll pop-ins (`impact_hit`) |
| **3D Camera** | `dramatic_swoop` (Gentle documentary swoop with ReadabilityLock) | `isometric_shelf` + `impact_shake` (High-torque perspective sweeps) | `isometric_shelf` (Clinical telemetry HUD angle) | Dynamic 2D/3D Facecam Framing with spring-cushioned digital punch-ins |
| **Foley & Sound** | Sharpie doodles, masking tape snaps, light clicks | Heavy cash thuds, stock ticker chimes, cinematic sub-bass drops | Heartbeat pulses, digital telemetry beeps, synaptic sparks | Camera shutter clicks, whoosh punch-ins, cash register hits, sparkle bells |
| **BGM Genre** | Acoustic piano & light ambient documentary | Dark, driving, minimalist synth pulse | Deep ambient biological drone & rhythmic bio-pulse | Motivational upbeat lo-fi / modern electronic pulse ducked to `0.10 - 0.12` |
| **Hero Graphics** | Cutout props, masking tape, hand-drawn doodles | Compounding curves, wealth meters, cash flow trees, ROI tickers | Biometric rings, circadian clock, cortisol curve, metabolic gauge | Floating metric badges, 3-in-1 comparison cards, tape strips, kinetic pills |
| **Thumbnail Theme** | `theme="apple_studio"` | `theme="obsidian"` (or `obsidian_gold`) | `theme="obsidian"` (or `biotech_cyan`) | High-energy speaker freeze-frame + bold viral hook & cutout badge |

---

## 🖼️ Universal Cutout Asset Engine (45 High-Impact Visual Metaphors)

Every video generated in RightClips MUST use tactile, physical cutout props instead of plain text cards or generic bullet points.

### 👁️ AI Agent Visual Perception:
Before generating a video or designing scenes, **view the visual catalog contact sheets directly**:
1. **[Visual Catalog 1 (Psychology & Burnout)](file:///home/phyroosh/TopProducts/RightClips/public/assets/visual_catalog_1.png)**
2. **[Visual Catalog 2 (Devices, Relationships & Habits)](file:///home/phyroosh/TopProducts/RightClips/public/assets/visual_catalog_2.png)**
3. **[Asset Metadata Registry](file:///home/phyroosh/TopProducts/RightClips/public/assets/registry.json)**

---

### 📚 Complete Cutout Matrix & Visual Metaphors:

| Category | Asset ID | Visual Metaphor | Suggested SFX | Best Psychological Topics |
| :--- | :--- | :--- | :--- | :--- |
| **Psychology** | `hyperrealistic_3d_glowing_brain` | 3D glass brain with glowing electrical synapses | `whoosh_sparkle` | Neuroplasticity, IQ, mental clarity, focus, rewiring |
| | `dopamine_head_circuit` | Head profile with "DOPAMINE" text & neural circuits | `click` | Dopamine addiction, reward loops, cheap dopamine |
| | `neurotransmitter_molecule_head` | Chemical neurotransmitter structure HO-C-HO | `click` | Serotonin, biology of mood, chemical balance |
| | `dopamine_sparks_brain` | Silhouette head with explosive dopamine sparks | `whoosh_sparkle` | Motivation surges, adrenaline, creative ignition |
| | `enlightened_mind_insight` | Head outline with radiant beams of light | `whoosh_sparkle` | Epiphanies, breakthrough realizations, wisdom |
| | `emotional_regulation_branches` | Brain branching to happy, neutral, and sad nodes | `click` | Emotional regulation, stoicism, mood stability |
| | `mindful_heart_gratitude` | Uplifted hands offering radiant glowing heart | `whoosh_sparkle` | Gratitude, peace, self-compassion, mindfulness |
| | `heart_and_brain_harmony` | Mascot brain and heart holding hands in harmony | `whoosh_sparkle` | Heart vs Logic, emotional alignment, inner peace |
| | `tangled_confusion_chaos` | Dense scribble knot with `?!` chaos marks | `impact_hit` | Overthinking, mental paralysis, racing thoughts |
| | `head_brain_cortex_outline` | Anatomical cortex outline in head profile | `click` | Prefrontal cortex, logical control, neurobiology |
| | `head_brain_clean_outline` | Minimalist cerebral convolutions head line-art | `click` | Critical thinking, intellect, philosophy |
| **Burnout** | `brain_battery_depleted` | Brain with red empty battery embedded inside | `impact_hit` | Burnout, mental exhaustion, fatigue, low energy |
| | `head_battery_empty` | Head silhouette with flashing critical battery bar | `impact_hit` | Sleep deprivation, cognitive depletion, energy debt |
| | `battery_low_red` | Minimalist horizontal battery bar at 10% red | `impact_hit` | Running on empty, willpower depletion |
| | `exhausted_dead_brain` | Drooling cartoon brain with crossed eyes & dead battery | `impact_hit` | Brain fog, overwork, extreme exhaustion |
| | `overwhelmed_mind_ripples` | Figure with dizzy disorienting wave ripples | `whoosh_fast` | Sensory overload, noise, ADHD overstimulation |
| | `girl_headache_stress` | Girl clutching head in acute stress & panic | `impact_hit` | Acute anxiety, panic attacks, high-pressure stress |
| | `boy_crouching_despair` | Boy crouching looking down in deep despair | `impact_hit` | Depression, giving up, rock bottom, regret |
| | `student_study_burnout` | Student slumped clutching head over textbook | `impact_hit` | Academic burnout, exam stress, information overload |
| | `anxiety_racing_thoughts` | Person holding head with blurred motion ghost heads | `whoosh_fast` | Racing thoughts, panic attacks, insomnia, ADHD |
| | `slumped_anxiety_scribble` | Person slumped under heavy dark anxiety scribble | `impact_hit` | Mental burden, heavy sorrow, dark moods |
| | `brain_trapped_in_cage` | Sad brain locked inside a birdcage | `impact_hit` | Limiting beliefs, mental prison, imposter syndrome |
| | `dark_thought_cloud_crushing` | Figure crouching under massive dark thought cloud | `impact_hit` | Negative self-talk, oppressive guilt, toxic mindsets |
| | `insomnia_awake_in_bed` | Person lying awake staring at night clock in bed | `click` | Insomnia, bedtime scrolling, late-night anxiety |
| | `exhausted_in_bed` | Weary person in bed lacking morning motivation | `impact_hit` | Lack of morning drive, depression, lethargy |
| | `furious_frustrated_pulling_hair` | Girl screaming pulling hair in explosive anger | `impact_hit` | Frustration, rage, lost patience, emotional outbursts |
| | `girl_crying_at_desk` | Girl slumped crying single tear at desk | `impact_hit` | Failure, rejection, heartbreak, loneliness |
| | `trapped_in_glass_jar` | Woman curled in corked glass jar in the rain | `impact_hit` | Suffocation, helplessness, feeling misunderstood |
| | `trembling_nervous_mascot` | Mascot shivering with nervous sweat drops | `click` | Stage fright, social anxiety, trembling fear |
| **Devices** | `phone_dopamine_overload` | Shocked guy overwhelmed by phone feed explosions | `impact_hit` | Doomscrolling, social media addiction, attention theft |
| | `phone_silent_notifications` | Hand holding phone with silenced bell icon | `click` | Digital detox, monk mode, deep work focus |
| | `smartphone_lockscreen_notifications` | Morning 08:45 lockscreen notification stack | `click` | Morning habits, digital clutter, phone addiction |
| **Relationships** | `isolated_curled_up` | Lonely figure curled in dark corner | `impact_hit` | Loneliness, social isolation, alienation |
| | `fear_paranoia_voices` | Boy clutching ears surrounded by spectral whisperers | `whoosh_fast` | Imposter syndrome, harsh critics, paranoia |
| | `peer_pressure_criticism` | One person whispering gossip into sweating friend | `impact_hit` | Toxic friendships, peer pressure, comparison |
| | `sad_blue_figure_lonely` | Soft blue watercolor figure sitting lonely | `whoosh_sparkle` | Vulnerability, gentle solitude, emotional healing |
| | `friendship_comfort_support` | Two friendly blue figures with supportive shoulder arm | `whoosh_sparkle` | Support systems, true friendship, empathy |
| | `angry_pouting_arms_crossed` | Pouting girl with arms crossed refusing to comply | `click` | Setting boundaries, saying no, stubborn ego |
| | `cute_sad_mascot_knees` | Cute white mascot hugging knees in quiet thought | `whoosh_sparkle` | Introversion, quiet reflection, soul searching |
| | `hugging_comfort_embrace` | Minimalist line-art embrace between two souls | `whoosh_sparkle` | Love, connection, reconciliation, deep comfort |
| | `setting_boundary_stop_hand` | Clear silhouette hand raised in firm STOP gesture | `impact_hit` | Setting healthy boundaries, self-respect, saying no |
| **Habits** | `mood_rating_scale_emojis` | 6-tier mood spectrum from green to red | `click` | Daily tracking, emotional awareness, journaling |
| | `happy_heart_mascot` | Pink smiling heart mascot radiating joy | `whoosh_sparkle` | Self-love, vitality, physical health, positivity |
| | `target_focus_crosshair` | Precision laser focus crosshairs | `click` | Discipline, laser focus, clear goals, execution |
| | `calendar_habit_check` | Calendar grid with confirmed streak checkmark | `click` | Habit streaks, consistency, daily execution |

---

### 💻 Pro Remotion Cutout Component Usage:

#### 1. Single Hero Cutout (`<ProCutout />`):
```tsx
import { ProCutout } from "../../components/ProCutout";

<ProCutout
  assetId="hyperrealistic_3d_glowing_brain"
  glowColor="emerald"
  animation="stamp_impact" // "punch_in" | "pop_spring" | "stamp_impact" | "slide_and_lock" | "none"
  ghostText="REWIRE"
  annotation="NEURAL SHIFT"
  annotationPosition="top-right"
  width={360}
  height={360}
/>
```

#### 2. Side-by-Side Comparison Card (`<PropComparison />`):
```tsx
import { PropComparison } from "../../components/PropComparison";

<PropComparison
  leftAssetId="phone_dopamine_overload"
  leftTitle="Cheap Dopamine Loop"
  leftSubtitle="Endless scrolling drains prefrontal cortex energy"
  leftBadge="THE TRAP"
  leftGlow="rose"

  rightAssetId="phone_silent_notifications"
  rightTitle="Digital Detox Protocol"
  rightSubtitle="90-minute monk mode blocks reclaim 4x focus"
  rightBadge="THE FIX"
  rightGlow="emerald"

  centerDividerText="VS"
/>
```

---

## 🛠️ High-Speed Video Generation Pipeline

### Option A: Master CLI Generator (Instant All-in-One)
```bash
python scripts/create_clip.py --name "<clip_name>" --topic "<topic_name>" --script "<script_text>" --format "shorts"
```
*(Options: `--format shorts` for 9:16 vertical or `--format longform` for 16:9 widescreen)*

---

### Option B: Step-by-Step Production Process

#### Step 1: Synthesize Neural Voiceover Audio & Word-Level Timestamps
Synthesize the voiceover with `edge-tts` and extract GPU/CPU millisecond timestamps using `faster-whisper`:
- Audio output: `public/<name>/voiceover.mp3`
- Transcript output: `src/clips/<name>/transcript.json`

**Channel-specific voice settings:**
| Channel | Voice | Rate | Pitch |
| :--- | :--- | :--- | :--- |
| `{Self Improvement}` | `en-US-AvaMultilingualNeural` | `+8%` | default |
| `{Finance}` | `en-US-GuyNeural` | `+11%` | `-3Hz` |
| `{Health}` | `en-US-AvaMultilingualNeural` | `+8%` | default |

#### Step 2: Scaffold the Clip Component Directory (`src/clips/<name>/`)
Create 4 modular files:
1. `Background.tsx`: Clean Apple Studio mesh background (`bg-[#f8fafc]` with subtle ambient orbs and dot-grid).
**Channel-specific component libraries:**
- `{Self Improvement}` → `Background.tsx` uses `<LivingStudioBackground />` (`#f8fafc`). `Canvas.tsx` uses `<ProCutout />`, `<PropComparison />`, `<HandDrawnDoodle />`, `<TapeStrip />`. `Presenter.tsx` uses `CharacterKeyframeAnimator` with Judy poses.
- `{Finance}` → `Background.tsx` uses `<FinanceBackground />` (`#030712`). `Canvas.tsx` uses `<CompoundGrowthChart />`, `<WealthMultiplierMeter />`, `<CashFlowSankeyCard />`, `<FinanceTickerBadge />`, `<IsometricCard />`. **No presenter character.**
- `{Health}` → `Background.tsx` uses `<HealthBackground />` (`#060913`). `Canvas.tsx` uses `<BiometricRing />`, `<CircadianClock />`, `<CortisolSpikeGraph />`, `<MetabolicStatusCard />`, `<IsometricCard />`. **No presenter character.**

2. `Canvas.tsx`: High-retention motion graphics storyboard using channel-appropriate graphics.
3. `Presenter.tsx`: Judy multi-pose animations for `{Self Improvement}` only. Finance and Health channels use `null` return (pure motion graphics).
4. `index.tsx`: Main Composition uniting voiceover, BGM, synchronized SFX layer, `<AppleProgressBar accentColor={...} />`, `<AppleKineticCaptions activeColor={...} />`, and **FRAME 0 THUMBNAIL COVER**.

**Channel-specific caption and progress bar accent colors:**
| Channel | `activeColor` | `accentColor` | `theme` |
| :--- | :--- | :--- | :--- |
| `{Self Improvement}` | default (`#0071e3`) | default | `theme="apple_studio"` |
| `{Finance}` | `#10b981` (Emerald) | `#10b981` | `theme="obsidian_gold"` |
| `{Health}` | `#06b6d4` (Cyan) | `#06b6d4` | `theme="biotech_cyan"` |

**🖼️ FRAME 0 THUMBNAIL COVER (PERMANENT RULE FOR 9:16 SHORTS):**
```tsx
{/* 0. High-Converting 4K Thumbnail First-Frame (Captured automatically by YouTube Shorts) */}
{frame === 0 && (
  <div className="absolute inset-0 w-full h-full z-50 pointer-events-none">
    <<Name>Thumbnail />
  </div>
)}
```

**🔊 SOUND DESIGN POLICY (EVENT-DRIVEN MULTI-SFX SUITE):**
- `whoosh_deep` / `whoosh_fast`: Presenter & major scene slide-ins (`volume: 0.30 - 0.34`)
- `impact_hit`: Core problem statements, diagnostic warnings, cutout stamp impacts (`volume: 0.20 - 0.24`)
- `click`: Tactile UI chips, badges, checklist micro-actions (`volume: 0.24 - 0.28`)
- `whoosh_sparkle`: Key psychological revelations, solution cutouts, positive insights (`volume: 0.30 - 0.35`)
- `marker_scribble`: Hand-drawn SVG doodle annotations, highlighter glides (`volume: 0.30 - 0.34`)
- `tape_snap`: Masking tape pinning cards to canvas (`volume: 0.28 - 0.32`)

---

### 🚀 Pro Creative Editing Suite (3 Next-Gen Engines)

1. **3D Virtual Camera & Isometric Depth (`src/components/camera3d/`)**:
   - `<VirtualCamera3D preset="dramatic_swoop" | "isometric_shelf" | "subtle_breathing" | "impact_shake">`: Hardware-accelerated CSS 3D transforms with automatic `readabilityLock` (flattens angle during reading hold).
   - `<IsometricCard tiltX={8} tiltY={-6} elevation={35}>`: Renders UI cards on an isometric plane with dynamic specular light glare.
   - `<ParallaxLayer depthZ={-250 | 0 | 60 | 120}>`: True 3D spatial depth plane separation.

2. **Documentary Tactile Collage (`src/components/collage/`)**:
   - `<HandDrawnDoodle preset="circle" | "arrow" | "underline" | "scribble_cross" color="rose" | "sky" | "amber" | "emerald">`: Self-drawing SVG annotations animated with `strokeDashoffset`.
   - `<HighlighterStroke color="yellow" | "rose" | "emerald" | "sky">`: Organic translucent text marker with soft edge bleed.
   - `<TapeStrip position="top-right" | "top-left" | "center-top">`: Semi-transparent masking tape with 45-degree serrated ends pinning cards.
   - `<DocumentaryTexture opacity={0.035}>`: Film & paper grain overlay for authentic print look.

3. **Kinetic Typography 2.0 & Screen Trauma (`src/components/kinetic_text/`)**:
   - `<SemanticWord physics="fracture" | "gravity_drop" | "elastic_expand" | "heartbeat">`: Words that physically act out their emotional meaning without overflowing into captions.
   - `<CameraShake triggerFrames={[...]} intensity={8}>`: Event-driven trauma jitter on `impact_hit` cues.
   - `<GlitchText>`: RGB chromatic aberration micro-flash on warning words.

#### Step 3: Register in `src/Root.tsx`
1. Add `<Composition id="<Name>Video" component={<Name>Composition} durationInFrames={duration} fps={30} width={1080} height={1920} />`
2. Add `<Still id="<Name>Thumbnail" component={<Name>Thumbnail} width={1080} height={1920} />`

#### Step 4: Register 4K Thumbnail in `src/thumbnails/index.tsx`
> ⚠️ **PERMANENT BRAND SIGNATURE RULE (JUDY INSIGHTS)**:
> All thumbnails MUST use `theme="apple_studio"` to match the clean Apple Studio light mesh aesthetic of the Judy Insights channel (@thejudyinsights).
> Features: Pure studio canvas, dual amber-gold and cognitive blue ambient auras, 4-point gold sparkle, and deep obsidian title typography. NEVER use dark or obsidian themes.

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
    theme="apple_studio" // ALWAYS apple_studio for Judy Insights Brand Signature
    aspectRatio="9:16" // 9:16 for Shorts, 16:9 for Long-Form
    extraBadge="<EXTRA TAG>"
  />
);
```

#### Step 5: Render Video & 4K Thumbnail
```bash
# Render 4K Still Thumbnail
npx remotion still src/index.ts <Name>Thumbnail out/<name>_video_thumbnail.png --overwrite

# Render Full Video MP4
npx remotion render src/index.ts <Name>Video out/<name>_video.mp4 --concurrency=4 --overwrite
```

#### Step 6: Add Metadata to `studio/metadata.json`
Add the viral title (with `#Shorts`), high-CTR description, category (`27` Education), and SEO tags so it instantly appears in the Studio Web Dashboard (`http://localhost:4000`).

---

## 🎨 Golden Rules of Editing

### 📱 9:16 Shorts (Vertical)
1. **Aspect Ratio**: Always `1080x1920` (9:16) at `30fps`.
2. **Visual Metaphors & Tactile Cutouts**:
   - Every video MUST feature 1–3 physical cutout assets from `public/assets/`.
   - Never use empty text-only rounded rectangles.
   - Use `<ProCutout />` and `<PropComparison />` for tactile, documentary-grade visual rhythm.
3. **Spacious Canvas Bounds**: `w-[980px] - w-[1020px]`, `px-6` margin. Vertical focal zone from `top: 15%` to `top: 76%`.
4. **Strict Mobile Font Scale & Anti-Clutter Rule (iPhone 720p Mobile Standard)**:
   - **THE GOLDEN RULE**: Videos are consumed on mobile devices (e.g. base iPhone 15 running on 720p). Tiny text causes instant viewer confusion and eye strain.
   - **PERMANENT BAN**: **NEVER use text below 24px anywhere in 9:16 vertical videos**! No `text-sm` (14px), no `text-xs` (12px), no `text-base` (16px).
   - **Card Titles & Headers**: `50px - 64px` (`text-5xl` to `text-6xl`), `font-black`.
   - **Secondary Labels & Subtitles**: `28px - 36px` (`text-2xl` to `text-3xl`), `font-black`.
   - **Badges & Chips**: **MINIMUM 24px - 30px** (`text-xl` / `text-2xl`, `font-black`).
   - **Extreme Minimalism (Anti-Clutter)**: Max 1 bold headline + 1 punchy visual badge per card. Never cram multi-sentence paragraphs, 2-column small text matrices, or fine print onto the canvas. The viewer must grasp the visual concept in 0.5 seconds!
5. **Pro Motion Graph Speed Curves & Kinetic Scenes (CapCut & After Effects Standard)**:
   - **Never use linear transitions or abrupt hard-cuts**: Wrap scenes in `<KineticScene startMs={...} endMs={...} inTransition="snap_up" outTransition="zoom_out" />`.
   - **In-Animation**: Uses `MotionCurves.snapSettle` (`cubic-bezier(0.16, 1.0, 0.3, 1.0)`) for explosive initial velocity and buttery deceleration.
   - **Living Hold Drift**: Scenes feature subtle sub-pixel scale drift (`1.0 -> 1.02`) during hold so content feels alive rather than frozen.
   - **Out-Animation**: Seamlessly dismisses old scene elements 250-300ms before next scene enters with `zoom_out` or `snap_up` blur fade.
   - **Staggered Cascade**: Use `<KineticCascadeItem delayMs={...} direction="up" />` to offset ghost text, badges, and hero cards by 60-80ms for captivating rhythm.
   - **Living Canvas**: Use `<LivingStudioBackground />` for organic floating dual ambient orbs (amber + blue).
6. **Captions**: Central `AppleKineticCaptions` with neon-blue active word pill glow.
7. **Sound Design**: Multi-SFX suite via `SoundDesignEngine` strictly tied to visual cutout and card entrances.

---

## 🌐 Studio Dashboard & YouTube Automation
- Run `./start_studio.sh` (verifies & launches) or `./Direct_start_server.sh` (direct start) on Linux, `scripts/windows/start_studio.bat` on Windows, or `npm run studio` to launch the local studio at `http://localhost:4000`.
- The studio automatically attaches 4K thumbnails, schedules native YouTube releases, and syncs upload states.
