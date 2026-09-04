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
- **Voice Profile**: Female Neural Voice (`en-US-JennyNeural` via Edge-TTS) at **natural conversational speed** (`rate="+0%"`). **DO NOT artificially speed up the voice.**
- **Mandatory Silence / Pause Compression**: Automatically strip out unnatural dead-air pauses between sentences and paragraphs using the silence-compression filter (`silenceremove`, capping pauses to ~150ms–180ms).
- **Word Timestamps**: Precise millisecond alignment generated via GPU `faster-whisper` on the pause-trimmed master audio.

## 4. Character Animation & Pro-Editor Integration
- **Character Asset**: High-resolution transparent PNG cutout (`public/Character/...`).
- **Placement & Motion**:
  - Slide-in entrances with Remotion `spring()` physics from bottom-right / center.
  - Continuous subtle breathing/floating parallax idle animation (`Math.sin(frame)`).
  - Contextual appearances at key psychological beats (Hook reveal, Reality checks, Mindset shifts, CTA).
  - Framed with frosted glass pedestals, halo rings, and status badges.

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
## 7. Autonomous Scriptwriting & Direct Topic Protocol (`{no meta}`)
- **Zero ChatGPT Middle Step**: Paste raw topics directly (e.g., `{Self Improvement} The Fear of Being Caught Trying` or `{Self Improvement} {no meta} The 2 AM Phone Loop`).
- **Mode A: Standard (Product-Linked)**: Default when `{no meta}` is absent:
  - Scans `Products/*.pdf` via `scripts/pdf_topic_matcher.py`.
  - Generates `[METADATA]` block with exact page & exercise title.
  - **MANDATORY SILENT PDF RULE**: Spoken voiceover must NEVER say "Photon" or the page number aloud (visual proof is rendered on screen).
- **Mode B: Organic / Growth (`{no meta}`)**: Triggered when `{no meta}` is present:
  - Completely skips PDF lookup; outputs ONLY `[VOICEOVER]`.
  - Ends with an organic community / subscriber CTA.
- **Judy Persona Rules**:
  - Warm, intelligent older sister / caring friend voice.
  - 75–90 words target (~30–35s, hard cap 100 words).
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
