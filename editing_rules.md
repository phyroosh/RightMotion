> **Note:** This is the v1 baseline aesthetic spec. The evolved motion-design
> philosophy (bespoke scene metaphors, centered-focus rule, mobile readability,
> slower cinematic springs) now lives in `.agents/rules/editing-style.md`,
> which Antigravity loads automatically into every new chat. Read that file
> first — it supersedes the card-grid approach described below wherever the
> two disagree.

# RightClips Editing Rules & Aesthetic Specification

## 1. Visual Theme: Apple Glass & Liquid Motion (Light Mode)
- **Background**: Apple pure studio backdrop (`#f8fafc` / `#ffffff`) with ultra-smooth radial lighting and ambient liquid glass mesh orbs.
- **Glassmorphism Materials**:
  - `backdrop-blur-2xl` with high transmittance `bg-white/65` to `bg-white/80`.
  - Specular edge highlights: `border border-white/90` and `ring-1 ring-black/5`.
  - Diffused Apple multi-layer shadows: `shadow-[0_20px_50px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]`.
  - Specular glass light sheen animations traversing across cards.
- **Liquid Motion**:
  - Organic floating blurred blobs with iridescent gradients (Soft Cyan `#06b6d4`, Electric Indigo `#6366f1`, Apple Blue `#0071e3`, Lavender `#a855f7`, Rose `#f43f5e`).
  - Fluid spring curves (`damping: 14, stiffness: 160`) for bouncy, organic entrances and exits.

## 2. Typography & Kinetic Captions
- **Font Stack**: Apple San Francisco / Inter / system sans-serif (`font-black`, `tracking-tight`).
- **Inactive / Completed Words**: Deep Charcoal (`#1d1d1f` / `#0f172a`) with crisp contrast and readability.
- **Active Spoken Word**:
  - Apple Electric Blue (`#0071e3`) or Neon Teal (`#0ea5e9`).
  - Active frosted glass pill backing with soft specular glow.
  - Spring-driven pop scale (`scale(1.08)`) synchronized with word-level millisecond timestamps.
- **Chunking**: Dynamic 2–4 words per chunk, holding cleanly across natural speech pauses.

## 3. Audio & Voiceovers
- **Voice Profiles**:
  - Solo Judy: Female Neural Voice (`en-US-AvaMultilingualNeural` via Edge-TTS) at `rate="+8%"`.
  - Judy & Andrew Conversational Duo: Judy (`en-US-AvaMultilingualNeural`, `+8%`) paired with Andrew (`en-US-SteffanNeural`, `+7%`).
- **Mandatory Silence / Pause Compression**: Automatically strip out unnatural dead-air pauses between sentences and dialogue turns using snappy pause compression (~140ms–180ms).
- **Word Timestamps**: Precise millisecond alignment generated via `faster-whisper` on the pause-trimmed master audio with deterministic speaker attribution.

## 4. Character Animation & Pro-Editor Integration
- **Character Assets**: High-resolution transparent PNG cutouts in `public/` (`character_pointing.png`, `character_crossed.png`, `character_open.png` for Judy; `andrew_crossed.png`, `andrew_thinking.png` for Andrew).
- **Screen-Intimate Framing Rule (PERMANENT ARCHIVE OF FAR FULL-BODY AVATARS)**:
  - Far head-to-toe full-body avatars make characters appear distant and disconnected on vertical mobile screens.
  - All avatars must be **screen-intimate, zoomed waist-up cutouts** (`baseHeight={1280 - 1550}`) so characters are close to the viewer. Legacy full-body avatars are archived in `public/archive_avatars/`.
- **Judy & Andrew Duo Staging (`<DuoPresenter />`)**:
  - Turn-based dynamic scaling (`1.08x` active speaker with full opacity, `0.92x` listening speaker with subtle dimming).
  - Broadcast HUD badge anchored at `top-[5.5%]`.
  - Dual-color kinetic captions: Amber/Gold (`#f59e0b`) for Andrew, Electric Sky Blue (`#38bdf8` / `#0071e3`) for Judy.

## 5. Composition Standards
- **Resolution**: 1080 x 1920 (Vertical 9:16 format for Shorts/Reels/TikTok).
- **Frame Rate**: 30 frames per second (fps).
- **Dynamic Timing**: Auto-calculated duration matching transcript length + smooth hold outro.

## 6. Pro-Editor Facecam Editing Rules (`{facecam}`)
- **Real Video Footage as A-Roll**: Real creator footage (`.mp4`) played via Remotion's `<Video />`.
- **Dynamic Framing & Punch-Ins**:
  - Never leave camera static. Cut between 1.0x wide framing and 1.15x - 1.22x punch-ins on punchlines, numbers, and emotional shifts.
  - Smooth camera spring or snap transitions paired with `whoosh_fast` audio cues.
- **Dynamic Host Slide-Down Motion**:
  - When B-roll is displayed on screen, the host video automatically and smoothly slides down into the lower half (`translateY: ~340px - 360px`).
  - This keeps the speaker's face, upper chest, and active hand gestures centered in the lower 50% of the screen without any awkward occlusion!
  - When the B-roll ends, the host video springs back up to the normal center position (`translateY: 0`).
- **Autonomous Entity B-Roll Protocol**:
  - Whenever the creator mentions a specific entity (person, founder, brand, hotel, product, location, acquisition, valuation):
    1. The AI Agent fetches or generates authentic visual proof media using `scripts/fetch_entity_media.py` (news clippings, search AI overviews, founder photos, B-roll stills/clips).
    2. Uses `<FacecamBRoll />` in the top safe zone (`top-[6%] h-[45%]`) with subtle Ken Burns slow-zoom, rounded corners, drop shadows, and category badges.
    3. Triggers `slideDownBeats` during those B-roll intervals.
- **Safe Zones & Occlusion Control**:
  - Keep the speaker's eyes and mouth 100% visible and un-occluded.
  - Non-B-roll badges and stamps occupy the lower-third chest zone (`bottom-[28%]`).
- **Speech-Synchronized Kinetic Captions**:
  - Lower safe zone (`bottom-[18%]`), 2-3 words per chunk.
  - Minimum 32px font size (`text-3xl font-black`), active word spring pop (`scale(1.1)`) with glowing cyan/gold highlight.
## 7. Autonomous Scriptwriting & Direct Topic Protocol (Organic Default, '{meta}' Opt-In)
- **Zero ChatGPT Middle Step**: Paste raw topics directly (e.g., `{Self Improvement} The Fear of Being Caught Trying`).
- **Mode B: Organic / Growth — DEFAULT (When '{meta}' is ABSENT)**:
  - Completely skips PDF lookup; outputs ONLY `[VOICEOVER]`.
  - Ends with an organic community / subscriber CTA.
  - Zero product hunting or PDF extraction.
- **Mode A: Standard / Product-Linked — OPT-IN ONLY (When '{meta}' IS PRESENT)**:
  - Triggered only when `{meta}`, `--meta`, or `{product: ...}` is in the request.
  - Scans `Products/*.pdf` via `scripts/pdf_topic_matcher.py`.
  - Generates `[METADATA]` block with exact page & exercise title and extracts retina screenshot.
  - **MANDATORY SILENT PDF RULE**: Spoken voiceover must NEVER say "Photon" or the page number aloud (visual proof is rendered on screen).
- **Judy Persona Rules**:
  - Warm, intelligent older sister / caring friend voice.
  - 65–85 words target (~24–30s, hard cap 90 words).
  - Permanent ban on AI clichés (*"here's the thing"*, *"the truth is"*, *"you're not lazy"*) and sales hype (*"life-changing"*, *"must-read"*).

## 8. Autonomous Painterly Illustrations & Motion Graphics Protocol
- **Signature Fine-Art Aesthetic**:
  - Stylized digital painterly concept illustration with thick expressive impasto brushstrokes, textured oil/gouache canvas finish, atmospheric chiaroscuro lighting, deep cinematic slate/obsidian shadows, and vibrant glowing prismatic neon trails (cyan, magenta, turquoise, amber).
  - Strict bans: No anime faces, no 3D CGI cartoon look, no glossy flat photorealism, no text, no watermarks, no borders.
  - Prompt formulation tool: `scripts/generate_illustration_prompt.py --topic "<topic>"`.
- **Motion Graphics Card (`<CinematicIllustrationCard />`)**:
  - Never display flat, static images!
  - Wrap in `<CinematicIllustrationCard />`: 2.5D Ken Burns slow drift, diagonal specular glass sheen sweep, 3D tactile card tilt with top masking tape (`TapeStrip`), monospace HUD telemetry (`COGNITIVE DIAGNOSTIC // 01` with pulsing live dot), in-image status badges (`ATMOSPHERIC CHANCE // HIGH`, `2.5D KINETIC`), and speech-anchored spotlight pulse.
- **Graceful Multi-Agent Fallback**:
  - Antigravity / agents with `generate_image`: generate bespoke 16:9 art to `public/<clip_name>/assets/scene_illustration.png`.
  - Claude Code / Cursor / Copilot (agents without `generate_image`): cleanly skip image generation; `create_clip.py` falls back smoothly to standard `ProCutout` props without error.
- **Scene & Presenter Timing**:
  - Illustration card enters Frame 0 as the instant hero hook. Judy does not blur/cover the card during intro; Judy enters smoothly during outro (`isFinale`) for the personal connection and CTA.
- **Multi-Beat Progressive Overlays (Anti-Retention Drop Standard)**:
  - Never let an illustration card sit static or slowly drift for $> 3.5$s.
  - Layer speech-synchronized events every 1.5–2.5s:
    - Beat 1 (0s): Hero entrance, glass sheen sweep, hook title.
    - Beat 2 (~2.5s): Camera punch zoom (`zoomLevel: 1.15`), target reticle, tactical HUD callout pin (`<IllustrationCalloutPin />`), and progressive subtitle reveal (`subtitleFrame`).
    - Beat 3 (~5.5s): Angled diagnostic warning stamp (`<IllustrationStamp />`) with `impact_hit` sound.
  - Split long sentences ($\ge 16$ words) on contrast conjunctions so Scene 1 transitions into Scene 2 by ~7–8s.

## 9. High-Retention Blueprint, 7-Second Pivot & Pinned Comment Engine
- **Runtime Hard-Cap**: Strict **24–32 seconds** (~65–85 words). Empirical channel data proves shorter videos achieve 65–75%+ retention and 10x higher view velocity.
- **The Cognitive Paradox Standard (Anti-Flop)**:
  - Ban vague emotional comfort (*"When life feels unfair"* $\rightarrow$ 20.8% retention).
  - Target concrete behavioral contradictions & self-sabotage mechanisms (*"Why smart people keep making bad choices"* $\rightarrow$ 63.2% retention).
- **The 7-Second Retention Pivot**:
  - The 7-second mark is where 75% of viewers swipe away if there's a lull.
  - Deliver the counter-intuitive psychological/neurological mechanism by second 5.5–7.0.
  - Eliminate dead air pauses in audio and ensure Scene 1 transitions into Scene 2 by Frame 190–220.
- **Interactive Engagement Overlay (`<InteractiveEngagementPill />`)**:
  - Pops in at ~70% timeline (seconds 18–22) for 3.5s just above the caption safe zone to prompt comments and likes (*"Have you felt this? Drop a 🧠 below"*, *"Save this for later 📌"*).
- **Autonomous Pinned Comment Engine**:
  - Output `[PINNED COMMENT]` with every script generation.
  - Stored in `studio/metadata.json` under `pinnedComment`.
  - Automatically posted to YouTube via YouTube Data API (`commentThreads.insert`) on upload.

## 10. Universal Tactical Meme Integration Engine (Default-On, < 2.5s Rule)
- **Default-On Policy (High-Retention by Default)**:
  - Tactical memes are **ENABLED BY DEFAULT** for all videos. The autonomous matcher (`scripts/meme_matcher.py`) automatically maps topics and emotional cues to the best-matching meme.
  - Max 1 meme per standard video (usually in Scene 1 hook or Scene 2 friction). Never spam!
- **Opt-Out Modifier Tag (`{no meme}` / `{no memes}`)**:
  - Include `{no meme}` or `{no memes}` in prompt or CLI `--no-meme` to disable memes completely.
- **Explicit Meme Override (`{meme: <id>}`)**:
  - Explicitly select a meme with `{meme: <id>}` or CLI `--meme <id>`.
- **Strict Retention Cap (< 2.5s)**:
  - The brain recognizes familiar memes in $<0.5$s. Holding $>2.5$s causes steep retention drop-offs. Standardize on **1.2s–2.0s hold** (36–60 frames at 30 fps) with snappy spring entrance and collapse exit.
- **100% Muted Audio (`volume={0}`)**:
  - Native meme audio is completely muted to keep narration and background music uninterrupted.
- **Fast-Forward Playback (`playbackRate={1.35 - 1.5}`)**:
  - Default `1.4x` sped-up velocity to match rapid short-form attention spans.
- **23-Meme Curated Catalog (`public/memes/`) & Autonomous Matcher (`scripts/meme_matcher.py`)**:
  - 23 high-retention memes pre-trimmed, audio-stripped, and indexed in `public/memes/registry.json`.
- **Tactical Glass Card (`<TacticalMemeCard />`)**:
  - Elevated at `top-[7%]` (`w-[560px]`) floating safely in the upper third above the waist-up avatar without facial collision.
  - Features diagonal specular glass glare sweep, monospace HUD badge (`[REACTION PROTOCOL // 01]`), and synchronized `whoosh_fast` (entry) / `click` (exit) SFX.
- **Sanitization**:
  - Strip `{meme}`, `{meme: <id>}`, `{no meme}`, and `{no memes}` from speech synthesis and canvas text.
