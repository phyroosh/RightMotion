# 🎬 RightMotion — AI Agent Guide

---

## 🚀 RULE 0: MANDATORY AUTONOMOUS PRODUCTION

> [!CRITICAL]
> **RIGHTMOTION IS AN AGENTIC REMOTION ENGINE.** Topic → AI creative decisions → bespoke `Canvas.tsx` → rendered video. No templates. No predefined visual system. The AI agent owns every visual decision.
>
> Execute this **complete 5-step workflow in the same turn**:
>
> 1. **Script** — 3-Pillar architecture (§Rule 7). 25–35s, 70–100 words (hard cap 105). No CTA. Mode B by default (§Rule 3). Generate `[PINNED COMMENT]`.
> 2. **CLI Scaffold**:
>    ```bash
>    .venv/bin/python3 scripts/create_clip.py --name "<name>" --topic "<topic>" --script "<script>" [--andrew] [--meta]
>    ```
>    Produces: neural audio, `transcript.json` (word-level timestamps), meme selection, `Root.tsx` registration, starter `Canvas.tsx`.
> 3. **Design & implement** `src/clips/<name>/Canvas.tsx` from scratch. Read `transcript.json` for frame-accurate word timing. See Rule 5 for the creative standard.
> 4. **Visual audit**:
>    ```bash
>    npx remotion still src/index.ts <PascalName>Video out/<name>_scene1.png --frame=80
>    npx remotion still src/index.ts <PascalName>Video out/<name>_scene2.png --frame=250
>    npx remotion still src/index.ts <PascalName>Video out/<name>_scene3.png --frame=500
>    ```
>    Inspect each still via `view_file`. Confirm quality and zero caption overlap.
> 5. **Render**: `npx remotion render src/index.ts <PascalName>Video out/<name>_video.mp4`. Deliver path + viral title + pinned comment.
>
> *(Output script only if the user writes "script only" or "write a script".)*

---

## 🏷️ Rule 1: Channel Routing

| Tag | Channel | Visual Identity |
|:---|:---|:---|
| `{Self Improvement}` | **Judy Insights** | `#f8fafc` light canvas, Judy bust presenter |
| `{Finance}` | **Apex Wealth** | `#030712` dark obsidian/cyber-gold, no presenter |
| `{Health}` | **BioMatrix** | `#060913` bio-navy/cyber-mint, no presenter |
| `{facecam}` | **Creator Facecam** | Dynamic zoom punch-ins, real speaker video/audio |

> [!CRITICAL]
> **If the topic has no routing tag — STOP immediately and ask which channel before any action.**

---

## 👥 Rule 2: Solo vs. Duo

> [!CRITICAL]
> **Solo (DEFAULT):** 25–35s · 70–100 words (hard cap 105) · Voice: `en-US-AvaMultilingualNeural` at `rate="+8%"` · Waist-up cutouts.
> **Duo (`{andrew}` opt-in):** Up to 40s · 80–120 words (hard cap 125) · Add Andrew: `en-US-SteffanNeural` at `rate="+7%"` · Use `<DuoPresenter />`.
> **Strip `{andrew}` and `{duo}` from all prompt text, titles, canvas text, and speech synthesis.**

---

## 🧠 Rule 3: Mode B (Organic, Default) vs. Mode A (`{meta}`)

> [!CRITICAL]
> **Never search for a PDF unless `{meta}` is explicitly present.**

**Mode B (default, `{meta}` absent):** No PDF. Output `[VOICEOVER]` using 3-Pillar. No CTA. End decisively. Output `[PINNED COMMENT]`.

**Mode A (`{meta}` present):**
```bash
python3 scripts/pdf_topic_matcher.py --topic "<topic>"
python3 scripts/extract_product_page.py <pdf> <page_num>
```
Output `[METADATA]` block (`product_file`, `page_number`, `exercise_title`) + `[VOICEOVER]`. Never speak the PDF name or page number aloud. Never put page numbers on thumbnails.

---

## 🎭 Rule 4: Meme System

> [!CRITICAL]
> **First frame only. Muted. Fast-forwarded. Max 1 per video.**

- **Clip:** `startFrame=0` · 40–46 frames · `volume=0` · `playbackRate=1.35–1.45`
- **Source:** 21 curated memes in `public/memes/registry.json`. Auto-matched via `scripts/meme_matcher.py`.
- **Disable:** `{no meme}` / `--no-meme` · **Override:** `{meme: <id>}`
- **Mid-video stickers** (`<MemeStickerOverlay />`): seconds 9–16 only · 15 stickers in `public/memes/stickers/` · Auto-matched via `scripts/meme_sticker_matcher.py` · Disable: `{no sticker}`

---

## 🎨 Rule 5: Creative Standard

> [!CRITICAL]
> **The AI agent makes all visual design decisions. Components are implementation tools, not creative prompts.**
> **Script → Editing AI → Remotion → Video. Not: Script → Template Selection → Remotion → Video.**

**Creative north star (three levels of ambition):**
> *STYLE IS CONSISTENT. COMPOSITION IS CREATIVE. VISUAL SOLUTION IS SCRIPT-DEPENDENT.*
> *Do not animate what the script says. Design something that visually expresses what the script means.*
> *Create visuals that make the viewer want to keep watching — not merely understand the narration.*

Channel identity sets atmosphere and art direction. It does **not** dictate composition.
RightMotion DNA: **premium · modern · clean · sharp · editorial · minimal · intelligent · intentional · visually sophisticated**

---

### 5.1 — Design-First Sequence

Before writing any JSX, execute strictly in this order:

1. **Script meaning** — what is actually being said?
2. **Core idea** — what must the viewer take away?
3. **Viewer reaction** — surprise? alarm? reassurance? What visual question can this scene create *before* the audio answers it?
4. **Visual concept** — what physical visual expresses this idea? Apply the §5.3 visual-thinking test before defaulting to typography.
5. **Composition** — where do elements live on the canvas? What approach serves the idea? (§5.2)
6. **Motion** — what moves and why? Prefer `STATE A → transformation → STATE B` over element-appears-and-holds.
7. **Transition** — how does this scene connect to the next?
8. **Implementation** — which components (if any) serve this concept?

> [!CAUTION]
> **Never begin at step 8. A component does not suggest a scene — a scene suggests whether a component is useful.**

---

### 5.2 — Composition Approaches

Valid approaches (possibilities only — choose based on what the idea demands, not rotation):

**Typography-led · Object-led · Diagram-led · Illustration-led · Asymmetric · Split-screen · Full-bleed · Centered minimalism · Layered depth · Editorial · Geometric · Cinematic · Collage-like**

---

### 5.3 — Visual Metaphor & Visual Thinking First

> [!CRITICAL]
> **Before animating a sentence, ask:** *"Would this idea be clearer, more memorable, or more emotionally powerful if something other than text physically represented it?"* If yes — redesign the scene around that thing.

A text-only scene is right when typography genuinely is the strongest representation. It is not automatically right because the sentence is important.

**Physical representation starting points** (examples for thinking, not a mapping system):

| Concept | Physical form |
|---|---|
| Growth | expansion / accumulation / multiplication |
| Choice | branching / competing paths / divergence |
| Conflict | opposing forces / collision / tension |
| Pressure | compression / crowding / deformation |
| Transformation | morphing / one state becoming another |
| Cause & Effect | one object triggering another in a chain |
| Comparison | two states in spatial tension |
| Breakthrough | obstruction → sudden release / expansion |
| Focus | convergence / elimination of noise |
| Scarcity | shrinking / being consumed |
| Time | accumulation / progressive timeline |

**Push past the first metaphor.** The obvious representation is usually the least memorable. Ask: *"Is there a more physically interesting or unexpected way to represent the same idea that communicates just as clearly?"* Prefer the second or third idea when it lands with more force. Clarity beats originality — but do not stop at generic.

**Creative vocabulary** (any combination; not a checklist or quota):
typography · animated objects/shapes · data and counters · diagrams and process flows · geometric systems · visual metaphors · generated imagery · spatial environments · parallax and depth · camera movement (push-ins, pull-backs, lateral travel, perspective shifts) · multi-layer compositions at different rates · object interactions and transformations · text-object hybrids

**Camera and spatial motion:** The entire composition may move. A push-in can be the reveal. A pull-back can reframe. Use when it improves storytelling — not as decoration.

**Hybrid scenes:** Background + object + data + typography + motion — when those layers work together to communicate one idea. **Complexity without hierarchy is bad design.**

**Rich motion** comes from visual relationships, not from adding effects:
one element transforming into another · cause-effect chains · progressive construction · accumulation in front of the viewer · scale relationships · objects crossing the frame with weight · shared elements carrying meaning between scenes · depth layers moving at different rates · text and objects aware of each other

---

### 5.4 — Background, Color & Typography

**Background** (characteristics, not recipes): subtle grid structures · restrained gradients · light texture · soft spatial depth · atmospheric lighting · elegant geometry · dark cinematic surfaces (Finance/Health)

**Color:** Restrained palette — 2–3 deliberate colors. Accent = purposeful. No neon for neon's sake. No glow as decoration. Color supports the idea.

**Typography — hard minimums (1080×1920 canvas, must read at 720p on a 6-inch screen):**

| Role | Minimum size | Font |
|---|---|---|
| Hero / slam words | **80–110px** | Montserrat Black |
| Scene headlines | **56–72px** | Montserrat Bold |
| Body / supporting lines | **36–44px** | Montserrat or JetBrains Mono |
| Metric readouts | **56–80px** | JetBrains Mono Black |
| **Absolute floor** | **36px** | Nothing rendered smaller. Ever. |

Two fonts only: **Montserrat** (headlines, display, slam words) + **JetBrains Mono** (metrics, numbers, data labels). Both loaded via `<FontLoader />` + `style.css`.

> [!CAUTION]
> **Never use Tailwind below `text-2xl` (24px). Never force `small label → big heading → subtitle` stacking unless it is genuinely the right choice.**

**Typography is a tool, not the default.** It may be: oversized (80–180px dominating the canvas) · cropped at the canvas edge for tension · layered (foreground over faded background) · dynamically revealed on the audio beat · used as a visual object · at extreme scale contrast · intentionally minimal (one word, maximum space).

**Text participates in the visual world.** Text may attach to objects · reveal or mask visuals · transform into non-text elements · collide with objects · act as measurement/annotation inside a diagram · emerge from or dissolve into the environment. Ask: *"How does this sentence behave inside the visual world?"* — not *"How do I animate this sentence?"*

---

### 5.5 — Banned Visual Patterns

> [!CRITICAL]
> **These are hard bans. They produce small, cluttered, illegible results that fail on mobile.**

1. **Pill/capsule badges** — `● PROTOCOL // 5 PILLARS`, numbered capsules (`01 // CIRCADIAN ARCHITECTURE`), `NON-NEGOTIABLE`/`MANDATORY` chips, status tags, icon+capsule pairings. RightMotion is motion design, not a mobile app UI.
2. **Dashboard/list-card rows** — 3–5 stacked rows each with a number, title, sub-description, and right-side badge. This is a dashboard layout. Design a different scene — do not resize the list.
3. **Sub-descriptions inside cards** — 2–3 lines of body text inside a card element. Audio carries the information load.
4. **3+ simultaneous floating text elements** — unless scale contrast makes hierarchy unmistakable.
5. **Icon + micro-text pairings** — icon < 40px paired with label < 40px. Make the icon a primary visual or remove it.
6. **HUD/dashboard/telemetry panels** — stat rows, floating metric boxes with small type, thin-border data panels, game-HUD aesthetics.

**The alternative to all of these: fewer things, much larger, much bolder. Let audio carry information density.**

---

### 5.6 — Motion, Choreography & Transitions

**Motion quality — favor:**
smooth acceleration/deceleration · spring physics with intentional overshoot · audio-synchronized timing · strong arrivals with weight · purposeful exits · state transformations · spatial continuity · rhythmic choreographic beat

**Think in choreography, not independent animations.** Elements enter in sequence, react to each other, hand off focus, synchronize, push/pull/reveal. One element's exit triggers another's entrance. Camera follows objects. Objects transform into the next scene's opening state. Ask: *"Do these elements know about each other?"*

**Motion — avoid:**
perpetual bobbing after settling · meaningless rotation · decorative particles · constant glow pulses · movement with no semantic reason

Every significant movement must answer: **"Why is this moving?"**
Valid answers: to reveal / explain / emphasize / transform / connect / separate / compare / guide attention / create rhythm / communicate causality.

**Transitions** connect ideas, not merely separate scenes. Choose based on the *relationship* between adjacent scenes:

| Transition | When to use |
|---|---|
| Cut | sharp idea break |
| Scale | one idea grows into the next |
| Spatial movement | scenes share space; camera travels between them |
| Mask | one scene reveals from behind another |
| Morph | element from A physically becomes element in B |
| Shared element | object travels through the transition |
| Typography transformation | words evolve into the next idea |
| Sudden contrast | pivot point in the script |

---

### 5.7 — Scene Structure, Rhythm & Escalation

**Variation:** Before finalizing a scene, ask: *"Would a viewer perceive this as a genuinely different visual construction from the previous scene?"* "Same layout, different text" — redesign. Color and copy changes alone do not count as variation.

**Escalation:** When the script builds (Problem → Logic → Solution), the visual should build with it. An element introduced in Scene 1 may transform in Scene 2 and resolve in Scene 3. The viewer should feel the video progressing toward something — not watching isolated cards reset. Avoid unnecessary visual world resets.

**Visual rhythm:** Alternate intentionally — high-energy · quiet · dense · sparse · dramatic hold. A simple scene can be stronger than a complex one. Do not maintain uniform intensity throughout.

**Video-level consistency:** Maintain coherent typography, spacing, color relationships, shape language, motion quality, and tone across all scenes. → **Consistent art direction + varied scene design.**

---

### 5.8 — Visual Storytelling Standard

> *The goal is not merely to explain the narration. The visual should make the viewer want to keep watching.*

**Design scenes as visual stories:**

> **STATE A → tension/build → transformation → STATE B**

The transformation communicates the idea. Do not merely show the final state. A scene moving from empty→full, simple→complex, blocked→released communicates through its *process*, not its endpoint alone.

**Design for attention:**
- What visual question does this scene open before the audio answers it?
- What changes between the first and last frame?
- Is there a visual payoff — something the viewer *sees happen*?

A scene that asks a visual question and answers it is more engaging than a scene that illustrates a sentence.

**One memorable visual moment per video.** For the most important idea, find the most physically interesting, emotionally resonant, or visually unexpected representation. One extraordinary moment outperforms consistent adequacy throughout.

**10-second mute test:** Remove audio mentally. Does the visual progression still feel intentional? Would you continue watching? If no — the narration is doing all the work. Redesign the visual behavior.

**Memorability test:** Would someone describe this visual to a friend tomorrow? If no — consider a more distinct representation. Do not force novelty; do not settle for generic when a stronger concept is available and equally clear.

---

### 5.9 — Restraint & Density Limits

**Mental model:** Audio carries information load. Visuals carry one dominant impression at a time. They work together — not redundantly.

Every element must answer: *"Does this help the viewer understand, feel, or remember the idea?"* If not — remove it.

**Discipline: fewer things, much larger, much bolder.**

**Hard limits (1080×1920):**
- Primary graphics zone: `top: 6%` to `top: 68%` (y: 115px–1320px)
- Captions (`<AppleKineticCaptions />`): `top: 73%` to `top: 81%`
- Zero overlap between graphics and captions. Zero content below the caption zone.
- Maximum **3 distinct text elements** simultaneously on screen
- Maximum **2 visual objects** simultaneously unless forming a single unified composition
- Scale sanity check: *"At 360×640, is the main element still readable?"* If no — scale up or remove.

---

### 5.10 — Originality & Components

**Originality:** RightMotion must produce scenes that have never existed in this repository. Invent directly in `Canvas.tsx` when the concept demands it. Do not abstract every creative solution into a reusable component.

**Existing components** (optional implementation tools — not a creative menu):
- `pure_graphics/` — GlossyGlowGraph, GlossyBalanceScale, GlossyFrictionSlider, GlossyRadialDial, GlossyBarChart, GlossyToggleBoard, GlossyFeatureGrid, SteppedProgressionStairs, KineticTypoLadder, ArchitecturalDraftingCanvas
- `physics/` — PhysicalCard, spring utilities, squash-and-stretch
- `texture/` — GroundedTextureEngine, ArchivalPaperCanvas, depth layers
- `collage/` — TapeStrip, HandDrawnDoodle, HighlighterStroke
- `finance/` · `health/` · `facecam/` — channel-specific backgrounds and frames
- `kinetic_text/` — CameraShake, GlitchText, SemanticWord
- Root: `<KineticCaptions />` · `<AppleKineticCaptions />` · `<CinematicIllustrationCard />` · `<ConceptKeywordSlam />` · `<DuoPresenter />` · `<TacticalMemeCard />` · `<MemeStickerOverlay />`

Do not cycle through this list. Do not use a component because it was used before. Use it when it genuinely serves the composition. A component IS appropriate when:
- Graph → idea is measurable change over time
- Scale → idea involves genuine balance or comparison
- Dial → idea involves a spectrum or threshold
- Card → a contained information unit genuinely helps
- Diagram → structural explanation is required

**Hero illustration (optional):**
```bash
python3 scripts/generate_illustration_prompt.py --topic "<topic>" --script "<hook>"
```
Call `generate_image` with `AspectRatio="16:9"`. Save to `public/<name>/assets/scene_illustration.png`. Wrap in `<CinematicIllustrationCard />`. If image generation is unavailable, build the scene entirely in Remotion. Visual ambition must not decrease.

---

### 5.11 — Quality Gates

**Pre-scene checklist** (answer before implementing any major scene):

| Question | Tests |
|---|---|
| What is the idea? | Meaning |
| What must the viewer take away? | Communication |
| What visual best expresses this idea? | Concept |
| Would something other than text be clearer or more powerful? | Anti-text-default |
| Where do important elements live? | Composition |
| What does the eye see first? | Hierarchy |
| What moves, and why? | Motion |
| What changes between the first and last frame? | Visual story |
| How does this connect to the next scene? | Transition |
| Is this genuinely different from the previous scene? | Variation |
| What can be removed? | Restraint |
| Largest text ≥ 56px? | Mobile legibility |
| Any capsule badges, list rows, or dashboard panels? | Anti-pattern |
| If audio is muted, does the progression feel intentional? | Mute test |
| Would this look professionally designed at 1080×1920? | Quality |

**Final quality test — inspect rendered stills, not just code:**
- Looks intentionally designed?
- Visual reinforces *this specific* script moment?
- Compositionally distinct from the previous scene?
- Clear visual hierarchy?
- Anything unnecessary?
- Every text element readable at 720p on a 6-inch screen?
- No pill badges, capsule labels, list rows, or dashboard panels?
- Feels like premium motion design — not an automated template?

If a still frame could have come from a generic template — redesign it.

---

### 5.12 — Do Not Overcorrect

Do not force variety. Do not use randomness as creativity. Do not abandon RightMotion identity in pursuit of novelty. Do not avoid a component merely because it was used before. Use repetition when repetition is genuinely the strongest artistic decision.

> **Intentional variety ≠ forced variety.**

---

## 📱 Rule 6: Sound Design

| SFX | When | Volume |
|---|---|---|
| `whoosh_deep` / `whoosh_fast` | Major transitions, presenter entrances | 0.30–0.34 |
| `impact_hit` / `piano_hit` | High-impact concept reveals | 0.24 |
| `click` | UI interactions | 0.24–0.28 |
| `whoosh_sparkle` | Solution reveals, psychological revelations | 0.30–0.35 |

---

## ✍️ Rule 7: Scriptwriting

**3-Pillar Pure Information Architecture:**
1. **Problem (0–8s):** Cognitive paradox, biological quirk, or behavioral hypocrisy
2. **Logic (8–22s):** Mechanism, root cause, why intuition fails
3. **Solution (22–32s):** Concrete, actionable protocol

**STRICT NO-CTA LAW:** End decisively on the solution. Zero "tell me below," "comment below," or subscribe asks.

**Banned language:** "Here's the thing" · "The truth is" · "You're not lazy, you're…" · "life-changing" · "must-read" · "game-changer" · comfort-topic framing ("When life feels unfair") · any ending CTA

---

## 🛠️ Rule 8: CLI Reference

```bash
# Scaffold
.venv/bin/python3 scripts/create_clip.py \
  --name "<name>" --topic "<topic>" --script "<script>" \
  [--andrew] [--meta] [--meme <id>] [--no-meme]

# Visual audit stills
npx remotion still src/index.ts <PascalName>Video out/<name>_scene1.png --frame=80
npx remotion still src/index.ts <PascalName>Video out/<name>_scene2.png --frame=250
npx remotion still src/index.ts <PascalName>Video out/<name>_scene3.png --frame=500

# Render
npx remotion render src/index.ts <PascalName>Video out/<name>_video.mp4

# Thumbnail
npx remotion still src/index.ts <PascalName>Thumbnail out/<name>_thumbnail.png
```

**Git:** `python3 -m py_compile` before commit · Conventional commits: `feat(clip): …` · Push to `origin main`.
