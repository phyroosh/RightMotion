# 🎬 RightMotion — AI Agent Guide

---

> [!IMPORTANT]
> ### 🎯 THE RIGHTMOTION CREATIVE MANTRA & RETENTION LAW
> **RIGHTMOTION DOES NOT TRY TO LOOK CREATIVE.**
> **RIGHTMOTION TRIES TO MAKE THE IDEA CLEAR.**
> 
> * **SIMPLE FRAME. RICH TIMELINE.** Keep the screen simple. Keep the timeline alive.
> * Creativity comes from finding the simplest visual metaphor that makes the idea unforgettable.
> * One excellent visual idea is worth more than ten impressive effects.
> * `visualDensity ≠ attentionIntensity`. A clean frame can generate extreme tension through anticipation and micro-events.
> * Anticipation is as important as payoff.
> * The viewer's attention is a limited resource. Spend it deliberately.
> * When the visual is already explaining the idea, stop adding things.

---

> [!IMPORTANT]
> ### 🏛️ CREATIVE HIERARCHY OF AUTHORITY
> In any creative or visual decision, this precedence order is absolute:
> 1. **`RIGHTMOTION_CREATIVE_CONSTITUTION.md`** — Supreme creative law, foundational principles, visual thinking tests, and card-escape logic.
> 2. **`creative_brief.json`** — Authoritative shot plan, attention plan, pacing modes, micro-events, visual state changes, and pedagogical references.
> 3. **Shot Directives & Attention Plan** — Scene-by-scene primary visual idea, focal hierarchy, micro-events, and mechanical action.
> 4. **Component Index** — Candidate implementation tools (optional choices, never mandatory ingredients).
> 5. **Agent Implementation** — Bespoke `Canvas.tsx` execution adhering to the above.

---

## 🚀 RULE 0: MANDATORY AUTONOMOUS PRODUCTION

> [!CRITICAL]
> **RIGHTMOTION IS AN AGENTIC REMOTION ENGINE.** Topic → AI creative decisions → bespoke `Canvas.tsx` → rendered video. No templates. No predefined visual system. The AI agent owns every visual decision.
>
> Execute this **complete 5-step workflow in the same turn**:
>
> 1. **Script & Hero Illustration**:
>    - 3-Pillar architecture (§Rule 7). 25–35s, 70–100 words (hard cap 105). No CTA. Mode B by default (§Rule 3). Generate `[PINNED COMMENT]`.
>    - Generate hero illustration prompt for the Hook and Thumbnail:
>      ```bash
>      python3 scripts/generate_illustration_prompt.py --topic "<topic>" --script "<hook>"
>      ```
>    - Call `generate_image` tool (`AspectRatio="16:9"`) and copy result to `public/<name>/assets/scene_illustration.png`.
> 2. **CLI Scaffold**:
>    ```bash
>    .venv/bin/python3 scripts/create_clip.py --name "<name>" --topic "<topic>" --script "<script>" [--andrew] [--meta]
>    ```
> 3. **Design & implement** `src/clips/<name>/Canvas.tsx` & `Presenter.tsx`:
>    - **MANDATORY CONSTITUTION & BRIEF READING**: You MUST read `RIGHTMOTION_CREATIVE_CONSTITUTION.md` and `src/clips/<name>/creative_brief.json` before writing any JSX. It contains the Shot Director's authoritative shot plan, pedagogical reference deconstruction, pacing modes (HOLD, BUILD, IMPACT, etc.), and the 5-question visual state changes. Review the RIGHTMOTION CREATIVE MISSION header at the top of `Canvas.tsx`.
>    - **Mandatory ~2.5s Hook Intro (frames 0 to ~75)**: Showcase the created picture (`scene_illustration.png`) inside an editorial card alongside Judy close-up/near to the screen (`baseHeight: 1250–1360px`, `position="right"` or intimate waist-up) so viewers on a 6-inch mobile screen feel immediately connected.
>    - Read `transcript.json` for frame-accurate word timing. Anchor subsequent scenes with large transparent semantic cutouts (`400–750px`) from `public/assets/` or open-canvas physical mechanisms. See Rule 5 for the creative standard.
> 4. **Visual audit & Editorial Critique**:
>    - Run structural critique:
>      ```bash
>      .venv/bin/python3 scripts/visual_critic.py --clip "<name>"
>      ```
>      Inspect `src/clips/<name>/visual_critique.md` via `view_file` to address actionable editorial advice (no unmotivated cardification, physical mechanisms, 5 visual state questions).
>    - Generate and inspect stills:
>      ```bash
>      npx remotion still src/index.ts <PascalName>Video out/<name>_hook.png --frame=35
>      npx remotion still src/index.ts <PascalName>Video out/<name>_scene1.png --frame=120
>      npx remotion still src/index.ts <PascalName>Video out/<name>_scene2.png --frame=350
>      ```
>      Inspect each still via `view_file`. Confirm razor-sharp contrast, zero dirty grain on light mode, and zero caption overlap.
> 5. **Render (Optimized High-Throughput Production Path)**:
>    ```bash
>    python3 scripts/render_clip.py --name "<name>" [--concurrency=4]
>    ```
>    *MANDATORY PRODUCTION PIPELINE*: Always render using the unified production runner `scripts/render_clip.py` (hardware-accelerated GPU via ANGLE, defaulting to concurrency 4 for ~2-4 min exports). SwiftShader CPU mode is only an automatic fallback if GPU is unavailable. Deliver path + viral title + pinned comment.
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

## 🎭 Rule 4: Semantic Asset Cutouts, Character Presenters & Hero Illustration Intro (Zero Memes)

> [!CRITICAL]
> **ZERO MEMES POLICY**: Opening video memes (`TacticalMemeCard`, `TacticalMemeFrame`) and reaction stickers (`MemeStickerOverlay`) are **STRICTLY BANNED**. Never use memes.
> **MANDATORY HERO ILLUSTRATION & INTIMATE PRESENTER INTRO (FIRST 2.5s / FRAMES 0–75)**:
> Every clip hook MUST generate a bespoke hero illustration (`scripts/generate_illustration_prompt.py` + `generate_image`) and stage it in the opening ~2.5 seconds (frames 0–75) alongside a close-up presenter (Judy in Self Improvement, `baseHeight: 1250–1360px`, `position="right"` or intimate waist-up). This creates immediate personal connection and curiosity on 6-inch mobile screens (720p).
> **FULL FOCUS ON PHYSICAL CUTOUTS**: Beyond the hero intro, every scene must be visually anchored by high-resolution transparent PNG cutouts from `public/assets/` and presenter characters (`public/character_*.png`, `public/andrew_*.png`).

- **Asset Library (`public/assets/registry.json`)**: 40+ curated transparent semantic cutouts categorized into:
  - `psychology/` (`hyperrealistic_3d_glowing_brain`, `dopamine_head_circuit`, `enlightened_mind_insight`, `heart_and_brain_harmony`, `tangled_confusion_chaos`, etc.)
  - `burnout/` (`battery_low_red`, `brain_battery_depleted`, `brain_trapped_in_cage`, `exhausted_in_bed`, `overwhelmed_mind_ripples`, etc.)
  - `relationships/` (`setting_boundary_stop_hand`, `isolated_curled_up`, `peer_pressure_criticism`, `friendship_comfort_support`, etc.)
  - `habits/` (`target_focus_crosshair`, `calendar_habit_check`, `mood_rating_scale_emojis`, etc.)
  - `devices/` (`phone_dopamine_overload`, `smartphone_lockscreen_notifications`, etc.)
- **Hero Cutout Staging**:
  - Size cutouts large: **400px–750px**. They must be bold physical subjects, not tiny decorative icons.
  - Anchor with crisp drop-shadows (`drop-shadow-[0_25px_35px_rgba(0,0,0,0.18)]`) or clean contrast rim glows.
  - Animate with spring dynamics (`damping: 12–14, stiffness: 120–150, mass: 0.6`).
- **Presenter Cutouts & The Law of Presenter Grounding (Anti-Severed-Torso)**:
  - Judy poses (`character_pointing.png`, `character_crossed.png`, `character_open.png`, `character.png`) represent living human hosts.
  - **Hard Ban**: NEVER float a waist-up cutout in the middle of empty canvas space with an exposed horizontal cut line! That looks amateurish and bizarre.
  - **Mandatory Grounding**: Presenters must either:
    1) Ground to the bottom bezel of the phone screen (waist-up `baseHeight: 1250–1360px`, anchored at `bottom: 0`, e.g. `<GlossyJudyIntro />`).
    2) Anchor to a screen edge or emerge cleanly from behind an editorial card.
    3) Frame inside a circular host avatar token (`w-24 h-24 rounded-full border-2 border-slate-950 overflow-hidden shadow-lg`).
  - If a scene does not need a presenter host, do NOT force Judy into the card! Anchor the scene with large 3D semantic cutouts (`psychology/`, `burnout/`, etc.) or high-contrast kinetic typography.

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

### 5.0 — The Minimalist Visual Storytelling Standard

> [!CRITICAL]
> **CLARITY OVER COMPLEXITY · SIMPLICITY OVER SPECTACLE · MEANING OVER DECORATION · ONE STRONG VISUAL IDEA BEATS FIVE COMPETING IDEAS.**
> 
> RightMotion behaves like an exceptional motion designer explaining a difficult concept to someone in the simplest possible visual language.
> The goal is NOT to maximize: component usage, motion, visual density, camera movement, effects, typography, physical systems, or simultaneous animations.
> The goal IS to maximize: **How quickly and effortlessly the viewer understands the visual idea.**
> 
> *"RightMotion does not try to look creative. RightMotion tries to make the idea clear."*

#### 1. The Visual Hierarchy:
Every shot must strictly adhere to:
```text
PRIMARY (Exactly ONE dominant visual idea — thing viewer looks at first)
   ↓
SECONDARY (At most 1 subtle supporting cue: label, secondary object, subtle environmental cue)
   ↓
AMBIENT (Pristine backdrop / context that improves the primary idea; ZERO competition)
```
**STRICT BAN**: Never allow `PRIMARY + SECONDARY x 3 + TEXT + ICON + PRESENTER + CHART + DECORATION + PARTICLES` all demanding attention at once.

#### 2. Visual Clarity Budget:
- Every shot defines `visualDensity`: `"LOW" | "MEDIUM" | "HIGH"`
- **`LOW` (DEFAULT)**: explanations, setup, emotional moments, conceptual metaphors, visual holds, reflection.
- **`MEDIUM`**: mechanisms, accumulation, transitions, escalating systems, multi-step explanations.
- **`HIGH`**: temporary ONLY for major impact, climax, rupture, reveal, transformation. Never maintain HIGH across a video!

#### 3. One Visual Idea Per Shot:
- Every shot must answer: *"What is the one thing I want the viewer to understand visually?"*
- `primaryVisualIdea`: Must be understandable in one simple sentence.
  - *Good*: "Each distraction adds another weight to the character."
  - *Bad*: "Show the character, phone, notifications, dopamine graph, clock, thought bubbles, productivity chart, and several labels to communicate distraction."

#### 4. Component Suggestions Are Options, NOT Ingredients:
- `suggestedComponents` are mutually optional candidates, NOT a checklist.
- The agent must prefer the smallest number of visual systems capable of clearly communicating the shot.
- `componentBudget`: Default: **1**. Maximum recommended: **2**. Exceed only when story genuinely requires it.

#### 5. Ban Visual Over-Explanation:
- Stop explaining the same idea multiple times visually.
- If the physical motion itself explains the sentence, do NOT add giant redundant typography slamming over it.

#### 6. Motion Must Communicate Meaning:
- Every significant movement must have a semantic reason:
  - Object grows → accumulation
  - Space shrinks → constraint
  - Camera pushes in → pressure / intimacy
  - Object moves away → emotional distance
  - Crack spreads → consequence
  - Structure bends → increasing load
- **Banned motion**: bouncing because bouncing looks cool; camera rotating because 3D is available; particles floating because canvas looks empty; text flying in because the library supports it.

#### 7. Minimalism Does Not Mean Static:
- The target is: **Minimal composition + meaningful motion**.
- A shot with one object, one clean ground, and one transformation is far more cinematic than five simultaneous effects.

#### 8. Visual Focus & Negative Space as a Feature:
- `visualFocus`: `{ primary: string, secondary?: string, backgroundRole: string }`.
- Negative space isolates the subject, increases emotional weight, improves readability, and creates breathing room. Empty space is NOT a rendering failure.

#### 9. The "Remove One Thing" Pass:
- Before finalizing every shot, ask: *"What can I remove without losing meaning?"*
- Categorize into Primary, Supporting, Decorative. Strip decorative elements. Remove unnecessary supporting elements.

#### 10. Visual Breathing Model:
- Alternate naturally: `QUIET → BUILD → IMPACT → QUIET` (or `OBSERVE → BUILD → RELEASE`). Viewer attention is a limited resource.

#### 11. Simple Visual Storytelling Default:
- Prefer one evolving object/system over many separate objects (e.g. 1 structure deforming over 5 separate illustrations; 1 path wearing down over 4 UI cards; 1 character moving into negative space over multiple charts).
- Visual grammar: `STATE → EVENT → CHANGE → CONSEQUENCE`.

#### 12. Reduce Simultaneous Motion:
- Only the primary visual system moves significantly. Secondary motion is subtle and restrained.

#### 13. Camera, Typography & Presenter Restraint:
- Camera movement is not decoration: a static camera with an excellent transformation is better than unnecessary camera drift.
- Typography supports, not competes: caption system already handles spoken words. Extra typography is only for emphasis, label, or concept naming.
- Presenter supports the story: use Judy when emotional intimacy matters; remove Judy when a physical mechanism explains the concept.

#### 14. Frame-Level Quality Checks:
- **Blur Test**: At small scale / blurred, can I still identify the primary subject?
- **Squint Test**: Is there one obvious focal point?
- **One-Sentence Test**: Can I describe the visual in one simple sentence?
- **Caption-Off Test**: Does the visual still communicate if captions disappear?
- **Remove-One Test**: Can something be removed without reducing clarity?
- **Motion Test**: Can I explain why each major movement exists?

---

### 5.0.1 — Simple Frame, Rich Timeline & The Retention Choreographer

> [!CRITICAL]
> **RIGHTMOTION PRINCIPLE — SIMPLE FRAME, RICH TIMELINE**
> 
> A frame should be easy to understand at a glance.
> A sequence should remain dynamically interesting over time.
> 
> Do not increase visual complexity merely to increase stimulation.
> Create retention through anticipation, timing, transformation, camera choreography, micro-events, contrast, reveals, impacts, resets, and visual state changes.
> 
> **Keep the screen simple. Keep the timeline alive.**

#### 1. Retention is Not Visual Density (`visualDensity ≠ attentionIntensity`):
- A shot can have **LOW visual complexity** and **HIGH attention intensity** (e.g. one red boundary slowly moving toward a character with rising sound cue, deceleration, breath-hold, and sudden snap).
- Never add clutter, extra icons, floating text, or background noise to make a scene "feel more active".

#### 2. Temporal Complexity Over Spatial Clutter:
- Prefer **one object with many meaningful states** over **many objects with one simple state**.
- *Example*: One structural beam holding baseline $\rightarrow$ bending $\rightarrow$ micro-cracking $\rightarrow$ fracturing $\rightarrow$ settling.
- Choreograph the timeline with frame-accurate precision rather than filling canvas coordinates with widgets.

#### 3. The Micro-Event System:
- A micro-event is a small meaningful event that keeps the timeline alive without making the frame crowded.
- Examples: object nudges, subtle accelerations, camera micro-punches, highlights, state mutations, sound accents, brief freezes, reversals, shape snaps.
- **Every micro-event MUST have a reason**: `progression`, `anticipation`, `emphasis`, `causality`, `escalation`, `contrast`, `emotional_change`, `reveal`, or `punctuation`.
- Do NOT generate micro-events just for random jitter or visual noise.

#### 4. Anticipation & Payoff:
- **Anticipation is a first-class tool**: Before an important event, create a brief anticipation state (movement slows, tension tightens, camera creeps forward, sound cue rises).
- **Payoffs must exist**: A meaningful setup must receive a payoff (fracture snap, clean rebound, sovereign release). The viewer must feel: *"Ah. That was leading somewhere."*

#### 5. Micro-Resets & Contrast:
- Contrast creates retention: `quiet → build → impact → breath → reset`.
- Use intentional visual resets (hard cut, momentary stillness, background simplification, sound drop) to refresh attention between major phases.
- Do not make every second busy; viewers need dynamic contrast to stay engaged.

#### 6. Simultaneous Motion Budget:
- **Primary moving system**: Exactly **1** (e.g. active physical mechanism or host presenter).
- **Secondary subtle motion**: At most **0–1** (e.g. subtle camera drift or gentle rim highlight).
- **Strict Ban**: Never animate presenter + mechanism + camera drift + text slam + floating badges + background particles simultaneously.

#### 7. Effects Must Serve Retention:
- Effects are allowed ONLY when they perform a clear narrative function:
  - *Camera punch* $\rightarrow$ emphasizes impact.
  - *Glow / highlight* $\rightarrow$ directs attention to a changing metric or node.
  - *Motion blur* $\rightarrow$ communicates acceleration.
  - *Shake* $\rightarrow$ communicates physical collision.
  - *Flash* $\rightarrow$ punctuation.
  - *Sound hit* $\rightarrow$ tactile impact.
  - *Zoom* $\rightarrow$ intimacy or pressure.
  - *Freeze* $\rightarrow$ realization or shock.
- Banned: random particles, decorative spin, extra ambient glow, or camera orbit for its own sake.

#### 8. Camera Choreography:
- **Micro-movement**: Subtle 1–2% drift or push to maintain visual life.
- **Significant movement**: Reveal, impact, or transformation on major story beats.
- **Static hold**: Locked tripod when the viewer needs cognitive breathing room to absorb the concept.

#### 9. Captions Remain Protected:
- `AppleKineticCaptions` remains the dedicated spoken word system.
- Retention is driven by the physical and camera choreography on the canvas, not by making captions more chaotic.

#### 10. The 11-Point Retention Check:
Before finalizing any shot, verify:
1. **Clarity**: What is the viewer looking at?
2. **Meaning**: What is the visual communicating?
3. **Motion**: Why is it moving?
4. **Attention**: Why does the viewer want to keep watching?
5. **Anticipation**: Is something worth waiting for?
6. **Change**: What becomes different?
7. **Payoff**: Does the setup lead somewhere?
8. **Contrast**: Does the rhythm change?
9. **Reset**: Does the edit occasionally refresh attention?
10. **Restraint**: Could the same result be achieved with fewer simultaneous elements?
11. **Satisfaction**: Does the timeline feel choreographed?

---

### 5.0.2 — The Multi-Layer Editing Composition Standard & Mobile Scale Law

> [!CRITICAL]
> **RIGHTMOTION IS AN EDITING SYSTEM, NOT A COMPONENT LIBRARY.**
> Do not merely place components on screen. Direct and edit the idea through:
> `IDEA → VISUAL METAPHOR → EDITING LAYERS → TIMING / INTERACTION → PAYOFF`

#### 1. The 11 Editing Layers:
The agent directs shots by selecting and composing appropriate editing layers (see [`docs/EDITING_LAYERS_PLAYBOOK.md`](file:///home/phyroosh/TopProducts/RightClips/docs/EDITING_LAYERS_PLAYBOOK.md)):
1. **Physical & Visual Metaphors**: Deforming matter, beam deflection, fracture engines, furrows, fulcrums, bespoke SVG curves.
2. **Causal State Machines**: `CausalWorld`, deterministic trigger-cascade graphs, threshold reactors.
3. **Camera Choreography**: `CameraCanvas` AE 2.5D push-ins, tracking, Dutch tilts, and organic handheld drift.
4. **Tactile Sound Design**: `SoundDesignEngine` with frame-accurate cues (`click`, `whoosh_fast`, `whoosh_deep`, `impact_hit`, `tape_snap`).
5. **Open-Canvas Staging**: `MechanismStage` providing safe bounds (y: 260–1340px) with ZERO card walls.
6. **Micro-Animation & Secondary Motion**: `SecondaryMotion`, `SquashAndStretch`, chronic load tremors.
7. **Continuity & Persistent Memory Traces**: `PersistentMemoryStage` with dashed ghost lines and permanent ground scars.
8. **AppleKineticCaptions Interaction**: Visual impulse frames aligned to exact word timestamps; bottom 19% kept clear.
9. **Transitions & Visual Transformations**: `AnimatedSlashStrike`, `KineticHighlighter`, sovereign clarity blooms.
10. **Retention Choreographer**: Micro-events every 45–75 frames, anticipation pauses, decisive payoffs.
11. **Semantic Asset Cutouts & Presenters**: High-res 400–750px cutouts; Judy bottom-bezel grounded.

#### 2. The Mobile Scale Law (Simple Frame ≠ Small Visuals):
Viewers watch 9:16 Shorts on 6-inch phone screens at ~720p effective resolution:
- **PRIMARY Visual Subject**: Must occupy **400px–750px** width/height, with **6px–14px** SVG strokes. Must be instantly recognizable in a split second. Never draw 100–250px tiny shapes.
- **SECONDARY Visual Support**: **150px–300px**, clearly subordinated.
- **TYPOGRAPHY**: Hero words **80px–110px**, scene titles **56px–72px**, absolute floor **36px**. Never use tiny web body copy.

#### 3. Prevention of Generic Fallback:
- ❌ **STRICTLY REJECT**: Converting a dynamic physical/causal concept into a static white card + paragraph + Lucide icon.
- ✅ **MANDATORY**: If the narration discusses pressure, deform a structure live on screen. If it discusses habit formation, carve a furrow. If it discusses balance, tilt a fulcrum.

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

### 5.4 — Background, Color, Typography & Sharpness Standard

**Visual Clarity & Contrast Standard:**
- **Clean Intentional Ground:** On light canvas (`#f8fafc` / `#fbfbfd`) or dark surfaces, keep backgrounds pristine and readable. Do NOT overlay dirty random noise or muddy texture haze.
- **High Visual Hierarchy & Contrast:** Headlines and primary text must maintain strong contrast against backgrounds (minimum 7:1 for hero display) so they remain immediately legible at 720p on 6-inch mobile screens.
- **Zero Muddy Tone-on-Tone:** BANNED: amber text on amber background, red text on pink background, light gray text on white. High-impact color means clear separation between visual subject and background.
- **Crisp Definition:** Visual elements should have intentional geometry and clean edge definition. No hazy, diffuse, washed-out blur boxes.

**Background** (characteristics, not recipes): subtle vector grid structures · clean studio radial lighting · crisp spatial depth · atmospheric lighting · elegant geometry · dark cinematic surfaces (Finance/Health).

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

### 5.5 — The Law of No Unmotivated Cardification & Visual Decision Tree

> [!CRITICAL]
> **THE LAW OF NO UNMOTIVATED CARDIFICATION:**
> Cards are permitted ONLY when they genuinely improve clarity or serve a justified narrative purpose (e.g. hero illustration card, product page worksheet proof, physical smartphone screen, blueprint).
> **A card must NEVER be used as a lazy default wrapper around text or icons.**
> When explaining a concept, prefer open-canvas physical mechanisms, spatial transformations, or bold kinetic typography.

#### Visual Solution Decision Tree:
```text
Does this scene have a clear physical or spatial metaphor?
├── YES → Stage an open-canvas physical/spatial mechanism (e.g. deflection, carving, expansion, fracture, scale tension).
└── NO → Is there a concrete real-world object (device, document, body part, cutout)?
    ├── YES → Ground the physical object boldly (400-750px) with live transformation.
    └── NO → Does this convey an abstract cognitive or emotional shift?
        ├── YES → Use spatial typography or kinetic contrast typography.
        └── NO → Is a card genuinely required (document proof, physical card, UI screen)?
            ├── YES → Render a motivated card with high intentionality.
            └── NO → STOP. Do not default to a card. Reframe into a physical mechanism or kinetic typography.
```

#### The Anti-Cardification Rules:
1. **Rule A (No Unmotivated Cards):** Cards are forbidden as default containers for information. A card may ONLY be used when the narrative object is literally a physical card, document, device screen, or blueprint/worksheet proof (`ProductPageShowcase`, hook hero illustration).
2. **Rule B (Primary Mechanism Dominance):** In every non-hook scene, the primary visual idea (mechanism, spatial transformation, or bold kinetic subject) must dominate screen real estate and viewer focus.
3. **Rule C (Qualitative Purity Check):** Check that every scene has:
   - ✅ clear focal hierarchy
   - ⚠ no generic card fallback
   - ⚠ no decorative motion
   - ✅ meaningful state progression
4. **Rule D (Zero Pill/Capsule Badges):** BANNED: `● PROTOCOL // 5 PILLARS`, numbered capsules (`01 // CIRCADIAN ARCHITECTURE`), status chips (`TOLERATED`, `ACCEPTED`), and icon+capsule pairings.
5. **Rule E (Zero Explanatory Paragraphs in Boxes):** Audio carries the informational load. The screen displays large kinetic typography (80–110px) and live physical mechanics. Never put 2-3 lines of body text inside a card.
6. **Rule F (Live In-Scene Mutation):** Actions (deflection, carving, fracture, viscoelastic relaxation) must occur live in real time on screen. Never show a static finished state when the action can be performed live.
7. **Rule G (Causal Action-Reaction Coupling):** Every premise that causes a consequence must physically transmit an impulse to the reaction target (`CausalActionCoupling`). Action → Propagation → Reaction.
8. **Rule H (Persistent World Memory):** Irreversible mutations (scars, deflections, worn furrows) must leave ghost traces or permanent marks across subsequent scenes (`persistentWorldMemory`).
9. **Rule I (Open-Stage Safe Layout):** Stage physical mechanisms inside `<MechanismStage>` (top: 280, bottom: 1340, width: 1080) without container walls, borders, or box outlines.
10. **Rule J (Spoken-Word Frame Alignment):** Spoken words trigger physical forces and mutations within +/- 3 frames of audio events from `transcript.json`.
11. **Rule K (Mute Test & Remove-the-Text Test):** Every scene must pass both tests:
    - *Mute Test*: Remove audio — the physical transformation alone communicates the idea.
    - *Remove-the-Text Test*: Strip all text — an active physical mechanism remains on screen, not empty colored rectangles.

#### The 7 Creative Gate Questions (Mandatory Pre-JSX Audit):
Before writing any JSX, the agent must answer all 7 questions:
1. *What is the primary visual mechanism of this scene?* (Must name a physical or spatial entity, not a card or layout).
2. *If all text were removed, what would the viewer see happen?* (Must describe a physical or visual event).
3. *What is State A, what is the trigger, and what is State B?* (Must define a transformation).
4. *Does this scene contain any card containers? If yes, what is its narrative justification (is it literally a document, proof, or device)?*
5. *How does this mechanism connect to the previous scene and the next scene?* (Continuous physical trace).
6. *Does the primary visual idea dominate the viewer's focus?*
7. *Would someone describe this visual to a friend tomorrow?*

---

### 5.5b — Other Banned Visual Patterns
1. **Dashboard/list-card rows** — 3–5 stacked rows each with a number, title, sub-description, and right-side badge. This is a dashboard layout. Design a different scene — do not resize the list.
2. **3+ simultaneous floating text elements** — unless scale contrast makes hierarchy unmistakable.
3. **Icon + micro-text pairings** — icon < 40px paired with label < 40px. Make the icon a primary visual or remove it.
4. **HUD/dashboard/telemetry panels** — stat rows, floating metric boxes with small type, thin-border data panels, game-HUD aesthetics.
5. **Memes & reaction stickers** — opening memes (`TacticalMemeCard`, `TacticalMemeFrame`) and sticker pops (`MemeStickerOverlay`) are completely banned. Focus 100% on semantic cutouts and Judy character poses.

**The alternative to all of these: open-canvas physical mechanisms, fewer things, much larger, much bolder, razor-sharp contrast, anchored by physical semantic cutouts.**

---

### 5.6 — Motion, Choreography & Transitions

**Motion quality — favor:**
smooth acceleration/deceleration · spring physics with intentional overshoot · audio-synchronized timing · strong arrivals with weight · purposeful exits · state transformations · spatial continuity · rhythmic choreographic beat

**Think in choreography, not independent animations.** Elements enter in sequence, react to each other, hand off focus, synchronize, push/pull/reveal. One element's exit triggers another's entrance. Camera follows objects. Objects transform into the next scene's opening state. Ask: *"Do these elements know about each other?"*

**The Law of Progressive Micro-Choreography (Zero Static Layouts):**
- Multi-row comparisons, lists, or compound cards must NEVER appear all at once like a static slide.
- Every block, row, contradiction, and annotation MUST enter sequentially on its exact spoken word timestamp from `transcript.json`.
- Beat 1: Container/Premise enters (`frame >= t1`) → Beat 2: Block 1 enters (`frame >= t2`) → Beat 3: Block 2 enters (`frame >= t3`) → Beat 4: Action/Payoff executes.

**The Law of In-Scene Mutation (Action Over Display):**
- Never display a static finished state when an action can be performed live.
- Whenever an idea involves negation, rejection, contradiction, or realization (e.g. "not X", "fails", "drops", "crushes"), the canvas MUST execute that physical mutation live on screen:
  - An animated blade or marker cut slices across the text in real-time (`<AnimatedSlashStrike />`) synced to a whoosh/scribble sound cue.
  - A dial or slider violently drops with a haptic click.
  - A stamp impacts with micro camera shake (`CameraShake`).
- The viewer must SEE the action occur, not just read a pre-cancelled word.

**The Law of Variable-Energy Pacing & The Dramatic Breath Hold:**
- Never run an entire 30s video at flat, uniform intensity.
- Sequence every narrative through an intentional emotional rhythm:
  1) **Hook (0–2.5s)**: High intimacy, bespoke illustration inside editorial card + Judy grounded close-up.
  2) **Friction & Conflict (2.5s–12s)**: Rapid progressive micro-reveals, high-contrast contradictions, subtle camera push-in.
  3) **The Dramatic Breath Hold (~14s)**: A 12–20 frame micro-freeze right before the epiphany. Visual drift drops to zero, and audio drops into an intimate sub-bass hum.
  4) **The Epiphany Release**: Explosive resolution (`<AnimatedSlashStrike />`, `<KineticHighlighter />`, `<CameraShake />`) with particles or glowing accents.
  5) **Decisive Takeaway**: Grounded presenter or clean closing question with zero visual clutter.

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

### 5.9 — Restraint, Density Limits & Platform-Safe Composition

**Mental model:** Audio carries information load. Visuals carry one dominant impression at a time. They work together — not redundantly.

Every element must answer: *"Does this help the viewer understand, feel, or remember the idea?"* If not — remove it.

**Discipline: fewer things, much larger, much bolder.**

> [!CRITICAL]
> **RIGHTMOTION LAW: PLATFORM UI IS PART OF THE COMPOSITIONAL ENVIRONMENT.**
> Vertical videos are viewed inside social feeds (YouTube Shorts, Reels, TikTok) with top navigation bars, right-side engagement rails, and bottom metadata/captions. Video Canvas + Platform Safe Region + Creative Focal Region.
>
> **CRITICAL CSS TRAP**: NEVER use Tailwind percentage padding (e.g. `pt-[8%]`, `pt-[9%]`) for vertical layout! In CSS, percentage padding is calculated against **CONTAINER WIDTH (1080px)**, not height! `pt-[8%]` computes to just 86px, which directly collides with the Shorts top navigation bar (0–240px). Always use explicit pixel heights: `style={{ paddingTop: 280 }}` or `useSafePlacement().safeTop`.

**Hard limits (1080×1920):**
- **Platform Safe Text Zone**: `y: 280px` to `y: 1340px` (clearing top navigation 0–240px and top caution buffer 240–280px).
- **Right Engagement Rail Clearance**: Maximum width `870px` (or `max-w-[780px]` centered in `px-8`), clearing the right interaction rail (`x: 910px to 1080px` in `y: 700px to 1560px`).
- **Optical Focal Center**: `x: 120px to 840px`, `y: 480px to 1100px` (mobile eye-level tracking).
- **Captions Zone (`<AppleKineticCaptions />`)**: `top: 73%` to `top: 81%` (`y: 1380px to 1560px`). Zero content below caption zone.
- Maximum **3 distinct text elements** simultaneously on screen.
- Maximum **2 visual objects** simultaneously unless forming a single unified composition.
- Scale sanity check: *"At 360×640, is the main element still readable?"* If no — scale up or remove.

**Element Importance Classification:**
- **`CRITICAL`**: Primary headlines, key numbers, character faces, core visual metaphors, essential diagrams. MUST remain 100% inside platform safe bounds across all frames and motion trajectories.
- **`IMPORTANT`**: Supporting labels, secondary cards, annotations. Should preferably remain visible and clear of major obstructions.
- **`DECORATIVE`**: Atmospheric lighting, background blur orbs, tape strips, environmental art. May touch caution/obstruction zones with intentional edge placement.

**Platform Safe Pre-Flight Audit:**
```bash
python3 scripts/platform_safe_validator.py <clip_name>
python3 tests/unit/test_platform_safe.py
```

---

### 5.10 — Originality & Components

**Originality:** RightMotion must produce scenes that have never existed in this repository. Invent directly in `Canvas.tsx` when the concept demands it. Do not abstract every creative solution into a reusable component.

**Existing components** (optional implementation tools — not a creative menu):
- `camera3d/` — CinematicParallaxRig, VirtualCamera3D, IsometricCard
- `pure_graphics/` — DynamicSankeyFlow, KineticTensionDial, GlossyGlowGraph, GlossyBalanceScale, GlossyFrictionSlider, GlossyRadialDial, GlossyBarChart, GlossyToggleBoard, GlossyFeatureGrid, SteppedProgressionStairs, KineticTypoLadder, ArchitecturalDraftingCanvas, TactileCursorPointer, VectorCursor
- `physics/` — PhysicalCard, spring utilities, squash-and-stretch
- `texture/` — GroundedTextureEngine, ArchivalPaperCanvas, depth layers
- `collage/` — TapeStrip, HandDrawnDoodle, HighlighterStroke
- `finance/` · `health/` · `facecam/` — channel-specific backgrounds and frames
- `kinetic_text/` — AnimatedSlashStrike, KineticHighlighter, CameraShake, GlitchText, SemanticWord
- Root: `<KineticCaptions />` · `<AppleKineticCaptions />` · `<CinematicIllustrationCard />` · `<ConceptKeywordSlam />` · `<DuoPresenter />` · `<AnimatedSlashStrike />`

Do not cycle through this list. Do not use a component because it was used before. Use it when it genuinely serves the composition. A component IS appropriate when:
- Graph → idea is measurable change over time
- Scale → idea involves genuine balance or comparison
- Dial → idea involves a spectrum or threshold
- Card → a contained information unit genuinely helps
- Diagram → structural explanation is required

**Mandatory Hero Illustration & 2.5s Hook Intro:**
Every clip MUST generate a bespoke hero illustration for the hook & thumbnail:
```bash
python3 scripts/generate_illustration_prompt.py --topic "<topic>" --script "<hook>"
```
Call `generate_image` with `AspectRatio="16:9"`. Save to `public/<name>/assets/scene_illustration.png`.
- **Opening 2.5s (frames 0 to ~75)**: Stage the illustration inside an editorial card (or `<CinematicIllustrationCard />`) accompanied by a close-up presenter (Judy in Self Improvement, `baseHeight: 1250–1360px`, `position="right"` or intimate waist-up). This creates immediate visual curiosity and human connection on 6-inch mobile screens (720p).
- **Thumbnail integration**: Mount the hero illustration inside `visualGraphic` on `ThumbnailCard` in `src/thumbnails/index.tsx` so the thumbnail and video intro share the identical compelling visual world.

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
  [--andrew] [--meta]

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
