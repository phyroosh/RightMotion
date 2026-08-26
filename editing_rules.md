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
