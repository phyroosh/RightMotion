# 🎬 RightMotion — AI Agent Guide

This document is the **authoritative specification** for any AI Agent working in the **RightMotion** repository.

---

## 🚀 RULE 0: MANDATORY AUTONOMOUS END-TO-END EXECUTION

> [!CRITICAL]
> **RIGHTMOTION IS AN AGENTIC REMOTION ENGINE.**
> A topic submission is an order to **write 100% bespoke Remotion motion graphics from scratch** in `Canvas.tsx` for that exact topic.
> The editing AI makes all creative and visual design decisions. No predefined template system tells it what to design.
>
> The AI Agent MUST autonomously execute the complete 5-step production workflow in that **SAME turn**:
>
> 1. **Step 1 — Script & Viral Metadata**:
>    - Formulate the script using the **3-Pillar Pure Information Architecture**: Introduce Problem > Explain the Logic > Deliver the Solution.
>    - **Runtime**: Strict **25–35 seconds** (**70–100 words**, hard cap 105 words).
>    - **STRICTLY NO CTA AT THE END.** Pure high-density information only.
>    - **Mode B (Organic Growth)** is DEFAULT: skip PDF hunting, omit `[METADATA]` block. (Mode A only runs when `{meta}` is explicitly present).
>    - Generate an authoritative `[PINNED COMMENT]` summarizing the core takeaway.
>
> 2. **Step 2 — Plumbing Setup via CLI**:
>    ```bash
>    .venv/bin/python3 scripts/create_clip.py --name "<clip_name>" --topic "<topic>" --script "<script>" [--andrew] [--meta]
>    ```
>    This synthesizes neural audio, transcribes word-level timestamps (`transcript.json`), selects the opening tactical meme, registers the composition in `Root.tsx`, and scaffolds a clean starter `Canvas.tsx`.
>
> 3. **Step 3 — BESPOKE REMOTION MOTION DESIGN IN `Canvas.tsx`**:
>    - Open `src/clips/<clip_name>/Canvas.tsx` and write the Remotion composition from scratch.
>    - Read `transcript.json` to identify the exact frame timing of key words and sentences.
>    - Design scenes that are genuinely appropriate to **this** script's meaning — not a generic template.
>    - See **Rule 5** for the creative standard.
>
> 4. **Step 4 — Visual Audit via Remotion Stills**:
>    ```bash
>    npx remotion still src/index.ts <PascalName>Video out/<clip_name>_scene1.png --frame=80
>    npx remotion still src/index.ts <PascalName>Video out/<clip_name>_scene2.png --frame=250
>    npx remotion still src/index.ts <PascalName>Video out/<clip_name>_scene3.png --frame=500
>    ```
>    Visually audit each still using `view_file` to confirm premium quality and zero caption overlap.
>
> 5. **Step 5 — Final Video Export**:
>    ```bash
>    npx remotion render src/index.ts <PascalName>Video out/<clip_name>_video.mp4
>    ```
>    Deliver the final video path, viral title, and pinned comment.
>
> *(Output the script alone only if the user explicitly writes "script only" or "write a script".)*

---

## 🏷️ Rule 1: Channel Routing

Every video script is tagged with one of four channel niche brackets:

| Tag | Channel | Visual Identity |
| :--- | :--- | :--- |
| **`{Self Improvement}`** | **Judy Insights** | Apple Studio Light canvas (`#f8fafc`), psychology/mindset, Judy bust presenter. |
| **`{Finance}`** | **Apex Wealth** | Dark Obsidian & Cyber-Gold/Emerald (`#030712`), no presenter character. |
| **`{Health}`** | **BioMatrix** | Deep Bio-Tech Navy & Cyber-Mint/Cyan (`#060913`), no presenter character. |
| **`{facecam}`** | **Creator Facecam** | Dynamic zoom punch-ins, real speaker video/audio, kinetic captions. |

> [!CRITICAL]
> **STOP-AND-ASK RULE**:
> If the user submits a topic **WITHOUT** one of these four tags, halt immediately and ask which style they want before taking any action.

---

## 👥 Rule 2: Solo Judy vs. Judy & Andrew Duo (`{andrew}`)

> [!CRITICAL]
> 1. **Solo Judy (DEFAULT)**: 25–35s runtime (70–100 words, hard cap 105). Voice: `en-US-AvaMultilingualNeural` at `rate="+8%"`. Waist-up cutouts.
> 2. **Judy & Andrew Duo (OPT-IN with `{andrew}`)**: Up to 40s runtime (80–120 words, hard cap 125). Judy (`en-US-AvaMultilingualNeural`, `+8%`) + Andrew (`en-US-SteffanNeural`, `+7%`). Use `<DuoPresenter />`.
> 3. Strip `{andrew}` and `{duo}` from all prompt text, titles, canvas text, and speech synthesis.

---

## 🧠 Rule 3: Organic Default (Mode B) vs. Product PDF (`{meta}` Mode A)

> [!CRITICAL]
> **ORGANIC GROWTH MODE IS DEFAULT. NEVER HUNT FOR A PDF UNLESS `{meta}` IS PRESENT.**

### Mode B — Organic (Default, `{meta}` absent):
- Skip all PDF search. Output clean `[VOICEOVER]` using the 3-Pillar Architecture.
- No CTA. No ending questions. End decisively on the solution.
- Output an authoritative `[PINNED COMMENT]`.

### Mode A — Product-Linked (Opt-in, `{meta}` present):
- Scan `Products/*.pdf` via `python3 scripts/pdf_topic_matcher.py --topic "<topic>"`.
- Extract page via `python3 scripts/extract_product_page.py <pdf> <page_num>`.
- Output `[METADATA]` block (`product_file`, `page_number`, `exercise_title`) + `[VOICEOVER]`.
- Never speak the PDF name or page number aloud. Never include page numbers on thumbnails.

---

## 🎭 Rule 4: Tactical Meme Integration (< 2.0s, Frame 0)

> [!CRITICAL]
> **MEMES: FIRST-FRAME HOOK ONLY. < 2.0s. MUTED. FAST-FORWARDED.**

- Enabled by default. Max 1 per video at `startFrame=0`. No mid-video memes.
- 21 curated memes in `public/memes/registry.json`. Auto-matched via `scripts/meme_matcher.py`.
- **Specs**: 40–46 frames duration, `volume=0`, `playbackRate=1.35–1.45`.
- Disable with `{no meme}` or `--no-meme`. Override with `{meme: <id>}`.
- **Gen-Z Mid-Video Stickers** (`<MemeStickerOverlay />`): tactile die-cut sticker pops during seconds 9–16. 15 stickers in `public/memes/stickers/`. Matched via `scripts/meme_sticker_matcher.py`. Disable with `{no sticker}`.

---

## 🎨 Rule 5: Creative Standard — The Motion Design Mandate

> [!CRITICAL]
> **THE AI AGENT MAKES ALL VISUAL DESIGN DECISIONS. There is no template to choose from.**

The architecture of RightMotion is:

**Script → Editing AI → Remotion → Video**

Not:

**Script → Template Selection → Remotion → Video**

---

### 5.0 — The Core Distinction

> **STYLE IS CONSISTENT. COMPOSITION IS CREATIVE. VISUAL SOLUTION IS SCRIPT-DEPENDENT.**

RightMotion has a recognizable visual identity. It should feel premium, modern, and editorially sharp across every video.

But a visual identity is **not** a template.

The agent must understand:

> *"Make it feel like RightMotion."*

Not:

> *"Make it look like the previous RightMotion video."*

The channel identity controls the atmosphere. The script controls the composition. The agent decides everything else.

---

### 5.1 — RightMotion Visual DNA

RightMotion should feel:

**premium · modern · clean · sharp · editorial · minimal · intelligent · intentional · visually sophisticated**

The work should feel closer to professional motion design than generic AI-generated social graphics. Every frame should look crafted — not assembled from defaults.

---

### 5.2 — How to Think About a Scene (Design-First Order)

Before writing any JSX, follow this sequence strictly:

1. **Understand the script.** What is actually being said at this moment?
2. **Identify the important idea.** What is the single thing the viewer must take away?
3. **Determine the viewer's reaction.** Should they feel surprised, informed, alarmed, reassured?
4. **Decide the visual concept.** What visual would make this idea immediately understandable?
5. **Decide the composition.** Where do the important elements live on the canvas?
6. **Decide the motion.** What moves, when, and why?
7. **Decide the transition.** How does this scene connect to what comes next?
8. **Only then decide which tools/components, if any, can help implement it.**

> [!CAUTION]
> **Never reverse this order. Never start by browsing the component library looking for something that fits. A component does not suggest a scene. A scene suggests whether a component is useful.**

---

### 5.3 — Visual Metaphor

Before building a major scene, ask:

> *What is the idea? What visual could make that idea immediately understood without words?*

A concept should often become a visual metaphor — a physical representation of the abstract:

| Concept | Possible visual expression |
|---|---|
| Growth | expansion / accumulation / multiplication |
| Choice | branching / divergence / competing paths |
| Conflict | opposing forces / collision / tension |
| Transformation | morphing / replacement / evolution |
| Cause and effect | chain reactions / connected actions |
| Pressure | compression / crowding / deformation |
| Comparison | contrast / separation / competing spaces |
| Repetition | looping / rhythm / recurring rhythm |
| Breakthrough | obstruction → sudden release / expansion |
| Connection | convergence / linking / shared structure |

These are examples of **thinking**, not a lookup table. Do not map topic keywords to rows mechanically.

---

### 5.4 — Composition Principles

RightMotion should use strong composition principles: hierarchy, balance, contrast, negative space, alignment, asymmetry, scale, depth, visual rhythm, intentional framing.

The agent must be comfortable using fundamentally different compositions across scenes and across videos. Valid approaches include:

- **Typography-led** — a single word or phrase at extreme scale dominates the frame
- **Object-led** — a central visual object or diagram carries the entire meaning
- **Diagram-led** — structured information layout, arrows, relationships, process flows
- **Illustration-led** — generated or painterly imagery as the primary visual
- **Asymmetric** — intentional off-balance composition for tension or dynamism
- **Split-screen** — two competing ideas, two states, before/after
- **Full-bleed** — a single texture, color, or image fills the entire canvas
- **Centered minimalism** — almost nothing on screen; maximum negative space
- **Layered depth** — foreground, mid-ground, background with spatial separation
- **Editorial** — text and image combined like a high-end magazine spread
- **Geometric** — pattern, structure, and mathematical shape carry the visual weight
- **Cinematic** — wide-format feel, letterbox depth, dramatic framing
- **Collage-like** — multiple textures, visual fragments, tactile layering

These are **possibilities**, not a menu to cycle through. Choose based on what the idea demands.

---

### 5.5 — The Anti-Template Rule

> [!CAUTION]
> **Never choose a visual because it is an existing component or because a previous video used it. Choose it because it is the best way to communicate the current idea.**

Existing components are implementation tools. They are not creative instructions. Graphs, cards, gauges, sliders, scales, dials, and dashboards are all valid tools — but only when the underlying idea genuinely calls for them:

- A graph is appropriate when the idea is about **measurable change over time**
- A scale is appropriate when the idea involves **balance or genuine comparison**
- A dial is appropriate when the idea involves **a spectrum or a threshold**
- A card is appropriate when a **contained information unit** genuinely improves communication
- A diagram is appropriate when the idea requires **structural explanation**

**Do not use a visual because it already exists in the codebase. Do not use a visual because it was used in the last video.**

---

### 5.6 — Background Language

Backgrounds should feel refined and editorial rather than empty or generic. The background supports the concept and the channel identity — it does not announce itself.

Valid background qualities:

- subtle grid structures
- restrained gradients
- very light texture
- soft spatial depth
- controlled atmospheric lighting
- elegant geometric structure
- subtle shadow and depth
- clean paper or editorial surfaces
- dark cinematic surfaces (for Finance and Health channels)

These are **background characteristics**, not recipes. Do not force the same background treatment into every video.

---

### 5.7 — Color Language

Use color intentionally. Color should establish hierarchy, emphasis, contrast, semantic meaning, and emotional tone.

- Prefer a **restrained palette** — two to three deliberate colors rather than many unrelated ones
- Accent colors should feel **purposeful**, not decorative
- Do not turn every scene into a neon interface
- Do not use glow merely because it is available
- Color should support the idea

---

### 5.8 — Typography & Mobile Legibility Law

Typography is one of RightMotion's strongest design tools. It must also be **readable on an iPhone 15 base model screen at 720p**. That is the minimum bar. If a viewer squinting at a 6-inch screen at arm's length cannot read something in 0.5 seconds, it does not belong on screen.

**Hard size minimums (1080×1920 canvas — never go below these):**
- Hero / slam words: **80–110px** Montserrat Black — this is the primary visual element
- Scene headlines: **56–72px** Montserrat Bold minimum
- Supporting body lines: **36–44px** Montserrat or JetBrains Mono — never below 36px
- Metric readouts: **56–80px** JetBrains Mono Black
- **Absolute floor: 36px.** Nothing rendered on canvas should be smaller than 36px. Ever.

**Two fonts only:**
- **Montserrat** — headlines, slam words, display text
- **JetBrains Mono** — metrics, numbers, data labels, technical callouts
- Both loaded locally via `<FontLoader />` + `style.css`

> [!CAUTION]
> **Never use `text-xs`, `text-sm`, `text-base`, or any Tailwind size class below `text-2xl` (24px). At 1080×1920, `text-2xl` is still near the absolute floor.**

**Creative direction — what typography can be:**
- oversized — a single word at extreme scale dominating the canvas (80–180px)
- cropped — intentionally cut off at the canvas edge to create tension
- layered — foreground text over faded background text at different opacities
- dynamically revealed — words or lines appearing precisely on the audio beat
- used as a visual object — the shape of the letters is part of the composition
- extreme scale contrast — one enormous word + one much smaller supporting label together
- intentionally minimal — one or two words, maximum negative space

> [!CAUTION]
> **Do not force every scene into "small label → big heading → subtitle." That three-line stacking structure should only be used when it is genuinely the right choice.**

---

### 5.8a — Banned Visual Patterns (Hard Rules)

These patterns are **explicitly prohibited** because they produce small, cluttered, illegible results that fail on mobile. Do not use them.

> [!CRITICAL]
> **THE FOLLOWING PATTERNS ARE BANNED FROM CANVAS.TSX:**

**1. Pill / capsule badges and tags**
Do not render small rounded-pill labels like:
- `● ACTION PROTOCOL // 5 PILLARS`
- `01 // CIRCADIAN ARCHITECTURE`
- `NON-NEGOTIABLE` / `MANDATORY` / `CARDIO` badges
- Category tags in the corner of a card
- Status chips, tier labels, icon+text capsules

These are UI elements. RightMotion is motion design, not a mobile app interface. These badges are unreadable at mobile scale and they make the composition feel like a wireframe.

**2. Multi-item list cards / dashboard rows**
Do not create a scene that shows 3, 4, or 5 items stacked vertically as rows, each with:
- a numbered label
- a title
- a sub-description
- a right-side badge

This is a dashboard layout. It is not motion design. At mobile scale every element becomes too small to read. The solution is NOT to make the list bigger — the solution is to design a different scene that isn't a list.

**3. Sub-description text inside a card**
Do not place 2–3 lines of body explanation text inside a visual card or row element. If you need to communicate more detail, let the audio carry it. The visual should reinforce one idea, not transcribe the voiceover.

**4. Multiple small floating labels simultaneously**
Do not render more than 2 distinct text elements visible on screen at the same moment unless they are intentionally part of a typographic composition where scale contrast makes hierarchy unmistakable.

**5. Icon + micro-text pairings**
Do not pair a small icon (24–40px) with a text label smaller than 40px and treat it as a meaningful visual element. At mobile scale this becomes a blur. Either make the icon large enough to be its own visual statement, or remove it.

**6. HUD-style overlays and telemetry panels**
Do not build scenes that look like they belong in a game HUD, a health app, or a financial dashboard. No rows of stats with small mono labels, no floating metric boxes with 20px type, no data panels with thin borders and tiny percentages.

**The alternative to all of these:**
Show fewer things. Make each thing much larger. Let the audio carry the information load. Design with scale, not density.

---

### 5.9 — Motion Design Standard

Motion should feel professionally authored, not procedurally generated.

**Favor:**
- smooth acceleration and controlled deceleration
- spring-like physics with intentional overshoot where appropriate
- precise timing tied to the audio transcript
- strong entrances — elements arrive with weight and intention
- purposeful exits — elements leave meaningfully, not just by fading
- meaningful transformations — one state becoming another
- spatial continuity — elements that move feel like they exist in space
- rhythmic choreography — motion has a beat

**Avoid:**
- perpetual floating or bobbing after an element has settled
- meaningless rotation
- decorative particles that fill space without purpose
- constant glow pulses that never stop
- movement that has no semantic reason to exist

The question for every significant motion:

> **Why is this moving?**

Good answers: to reveal, to explain, to emphasize, to transform, to connect, to separate, to compare, to guide attention, to create rhythm, to communicate causality.

---

### 5.10 — Transitions

Transitions should connect ideas, not just separate scenes.

Do not use the same transition repeatedly because it is available. Choose based on the **relationship between the two scenes**:

- **Cut** — sharp, immediate contrast; idea breaks cleanly
- **Scale** — one idea grows into or out of the next
- **Spatial movement** — scenes inhabit the same space, camera moves between them
- **Mask** — one scene reveals from behind another
- **Morph** — an element from Scene A transforms into an element in Scene B
- **Typography transformation** — words change, morphing into the next idea
- **Shared element movement** — one object travels across the transition
- **Directional movement** — scenes slide in consistent directions to imply narrative flow
- **Deliberate disappearance** — elements vanish with intent before the next idea arrives
- **Sudden contrast** — total visual change to signal a pivot in the script

---

### 5.11 — Scene-to-Scene Variation

Before finalizing any scene, mentally compare it to the previous one and ask:

> *Would a viewer perceive this as a genuinely different visual construction?*

If the answer is: *"It is basically the same layout with different text"* — redesign it. Change the underlying composition or visual concept. Changing only colors or copy does not count as variation.

---

### 5.12 — Visual Rhythm and Intensity

A short-form video should not maintain one visual intensity throughout its entire duration. Allow:

- **high-energy moments** — fast reveals, bold type, dramatic cuts
- **quiet moments** — negative space, single elements, deliberate pause
- **dense moments** — information-rich, multiple elements in controlled hierarchy
- **sparse moments** — almost nothing on screen; maximum focus on one thing
- **dramatic visual hits** — a single frame that lands hard on a key word

A simple scene can be stronger than a complicated one. Do not add visual noise to make the video feel busy.

---

### 5.13 — Video-Level Consistency

Even when individual scenes are visually different, the whole video must feel like a single authored piece. Maintain a coherent combination of:

- typography
- spacing
- color relationships
- shape language
- motion quality
- overall visual tone

Think: **consistent art direction + varied scene design**

---

### 5.14 — Visual Restraint

RightMotion should never feel overloaded.

**The most common mistake:** building a scene that tries to show everything the audio is saying at the same time. A list of 4 items, each with a number, a title, a description, and a badge — this is not a scene. It is a dense information panel that works in a slide deck and fails completely on a phone screen.

**The correct mental model:**
- The audio carries the information load
- The visual carries one dominant impression at a time
- They work together, not redundantly

Do not include:
- card rows with 3+ simultaneous items at small scale
- pill badges, status chips, or category capsules
- sub-text descriptions inside list items
- excessive labels that restate what the audio already says
- decorative lines or particles without purpose
- redundant information displayed multiple ways simultaneously
- excessive gradients or glow stacked on top of each other

Every major element must earn its place. Ask:

> *Does this help the viewer understand, feel, or remember the idea?*

If not, remove it. The discipline is: **fewer things, much larger, much bolder.**

---

### 5.15 — Originality Requirement

RightMotion must be capable of producing scenes that have never appeared in this repository before.

The editing agent is allowed — and expected — to create new visual constructions directly in Remotion when the concept calls for them. A composition does not need to exist as a pre-built component. Do not abstract every creative solution into a reusable component. Implement it directly in the Canvas if that is the right approach.

---

### 5.16 — Existing Components

Components in `src/components/` are optional implementation tools. Use them when they genuinely serve the composition. The complete available toolset:

- `pure_graphics/` — glossy obsidian graphics (GlossyGlowGraph, GlossyBalanceScale, GlossyFrictionSlider, GlossyRadialDial, GlossyBarChart, GlossyToggleBoard, GlossyFeatureGrid, SteppedProgressionStairs, KineticTypoLadder, ArchitecturalDraftingCanvas, etc.)
- `physics/` — PhysicalCard, spring utilities, squash-and-stretch
- `texture/` — GroundedTextureEngine, ArchivalPaperCanvas, depth layers
- `collage/` — TapeStrip, HandDrawnDoodle, HighlighterStroke
- `finance/` — dark obsidian Finance components (FinanceBackground, etc.)
- `health/` — Bio-tech Health components (HealthBackground, etc.)
- `facecam/` — FacecamBRoll, FacecamFrame, FacecamCaptions
- `kinetic_text/` — CameraShake, GlitchText, SemanticWord
- Root components — `<KineticCaptions />`, `<AppleKineticCaptions />`, `<CinematicIllustrationCard />`, `<ConceptKeywordSlam />`, `<DuoPresenter />`, `<TacticalMemeCard />`, `<MemeStickerOverlay />`

Do not treat this list as a menu to work through. Do not repeatedly use the same component family across every video because it worked before.

---

### 5.17 — Hero Illustration (Optional)

```bash
python3 scripts/generate_illustration_prompt.py --topic "<topic>" --script "<hook>"
```
Then call `generate_image` with `AspectRatio="16:9"`. Save to `public/<clip_name>/assets/scene_illustration.png`. Wrap in `<CinematicIllustrationCard />`.

If image generation is unavailable, create the scene entirely with Remotion. The lack of generated imagery must never reduce the ambition of the motion design.

---

### 5.18 — Safe Zones & Density Limits (Non-Negotiable)

**Spatial zones:**
- Primary graphics: `top: 6%` to `top: 68%` (y: 115px to y: 1320px on 1080×1920)
- Captions (`<AppleKineticCaptions />`): `top: 73%` to `top: 81%`
- Zero overlap between graphics and captions. Zero content below the caption zone.

**Element density limits:**
- **Maximum 3 distinct text elements on screen at the same time.** That means 3 total — not 3 per card row.
- **Maximum 2 visual objects** (cards, shapes, diagrams) simultaneously on screen unless they are intentionally structured as a single unified composition.
- If a scene requires more than 3 text elements to "make sense," it is not a scene — it is a document. Redesign it.
- One strong idea per scene. One visual per idea.

**Scale sanity check:**
Before rendering, ask: *"If this frame were displayed at 360×640 (240p), would the main element still be readable?"* If no — the elements are too small. Scale everything up or remove the small elements.

---

### 5.19 — Channel Identity

Channel identity controls the overall visual atmosphere. It does **not** dictate the exact composition.

A light editorial channel (`{Self Improvement}`) can still contain:
- typography-only scenes
- diagrams
- objects
- illustrations
- asymmetric compositions
- cinematic moments
- dark accents used as contrast

...without abandoning its identity. The light ground, editorial tone, and Judy presenter remain consistent. What is designed within that space is free.

---

### 5.20 — The Agent's Creative Checklist

Before implementing any major scene, answer these questions:

| Question | Purpose |
|---|---|
| **What is the idea?** | Meaning |
| **What should the viewer understand immediately?** | Communication |
| **What visual could communicate it best?** | Metaphor |
| **Where should the important elements live?** | Composition |
| **What does the eye see first?** | Hierarchy |
| **What moves, and why?** | Motion |
| **How does this connect to what follows?** | Transition |
| **How is this different from the previous scene?** | Variety |
| **What can be removed?** | Restraint |
| **Is the largest text at least 56px?** | Mobile legibility |
| **Are there any capsule badges, pill labels, or list rows?** | Anti-pattern check |
| **Would this look professionally designed at 1080×1920?** | Quality |

---

### 5.21 — The Final Quality Test

Do not evaluate a video only by whether the code compiles, the render succeeds, and the timing works. Inspect the actual frames. Ask:

- Does this look intentionally designed?
- Does the visual reinforce the script at this specific moment?
- Does this scene feel compositionally distinct from the previous one?
- Is there meaningful visual hierarchy within the frame?
- Is the composition clean?
- Is anything unnecessary?
- **Is every text element readable on a 6-inch phone screen?** Squint at the still. If you need to squint harder than 1 second to read something — it is too small.
- **Does this scene contain any pill badges, capsule labels, list rows, or dashboard panels?** If yes — remove them and redesign.
- Does this feel like premium motion design — or an automated template?

If a still frame looks like it could have come from a generic template, redesign it.

---

### 5.22 — Do Not Overcorrect

Do not intentionally make every scene wildly different just to avoid repetition.

Do not use randomness to fake creativity.

Do not abandon the RightMotion visual identity in pursuit of variety.

Do not avoid a component merely because it was used before.

Use repetition when repetition is genuinely the strongest artistic decision.

> **The goal is intentional variety, not forced variety.**

---

## 📱 Rule 6: Sound Design

- `whoosh_deep` / `whoosh_fast`: Major transitions and presenter entrances (vol: 0.30–0.34).
- `impact_hit` / `piano_hit`: High-impact concept reveals (vol: 0.24).
- `click`: UI interactions, pills, badges (vol: 0.24–0.28).
- `whoosh_sparkle`: Solution reveals, psychological revelations (vol: 0.30–0.35).

---

## ✍️ Rule 7: Scriptwriting Standards

### The 3-Pillar Pure Information Architecture:
1. **Pillar 1 — Problem (0–8s)**: Cognitive paradox, biological quirk, or behavioral hypocrisy.
2. **Pillar 2 — Logic (8–22s)**: The mechanism, root cause, why intuition fails.
3. **Pillar 3 — Solution (22–32s)**: Concrete, actionable protocol.

**STRICT NO-CTA LAW**: End decisively on the solution. Zero "tell me below", zero "comment below", zero follow/subscribe asks.

### Banned phrases:
- AI clichés: "Here's the thing", "The truth is", "You're not lazy, you're..."
- Sales hype: "life-changing", "must-read", "game-changer"
- Comfort topics: "When life feels unfair" — use concrete paradoxes instead
- Ending CTAs of any kind

---

## 🛠️ Rule 8: CLI Workflow Reference

```bash
# Scaffold the clip
.venv/bin/python3 scripts/create_clip.py \
  --name "<clip_name>" \
  --topic "<topic>" \
  --script "<script_text>" \
  [--andrew] \
  [--meta] \
  [--meme <id>] \
  [--no-meme]

# Write bespoke Canvas.tsx — read transcript.json for word timestamps

# Audit stills
npx remotion still src/index.ts <PascalName>Video out/<clip_name>_scene1.png --frame=80
npx remotion still src/index.ts <PascalName>Video out/<clip_name>_scene2.png --frame=250
npx remotion still src/index.ts <PascalName>Video out/<clip_name>_scene3.png --frame=500

# Render
npx remotion render src/index.ts <PascalName>Video out/<clip_name>_video.mp4

# Thumbnail
npx remotion still src/index.ts <PascalName>Thumbnail out/<clip_name>_thumbnail.png
```

### Git discipline:
- Test with `python3 -m py_compile` before committing.
- Commit all production assets together with clean conventional commits (`feat(clip): ...`).
- Push to `origin main` upon completion.
