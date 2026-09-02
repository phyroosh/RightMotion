# 🎬 RightClips Autonomous AI Agent Engine Guide

This document is the **authoritative specification** for any AI Agent (Antigravity/AGY, Claude Code, Cursor, Copilot, ChatGPT) working in the **RightClips** repository.

---

## 🏷️ Universal Bracket-Tag Channel Routing (MANDATORY AGENT RULE)

Every video script submitted to RightClips is tagged with one of three channel niche brackets:
- **`{Self Improvement}`** (or `{Self Improvment}`) $\rightarrow$ Judy Insights Channel
- **`{Finance}`** $\rightarrow$ Apex Wealth / Capital Markets Channel
- **`{Health}`** $\rightarrow$ BioMatrix / Longevity & Cellular Biology Channel

> [!CRITICAL]
> **MANDATORY AGENT STOP-AND-ASK RULE**:
> If the user submits a script prompt **WITHOUT** `{Finance}`, `{Self Improvement}`, or `{Health}`:
> **The AI Agent MUST HALT immediately and ask the user which style they want before taking any action:**
> *"Which channel editing style would you like me to use for this video?*
> *1. `{Self Improvement}` (Judy Insights: Apple Studio Light mesh canvas, psychology, mindset, Judy presenter)*
> *2. `{Finance}` (Apex Wealth: Rich Dark Obsidian & Cyber-Gold/Emerald, high-velocity financial graphics)*
> *3. `{Health}` (BioMatrix: Deep Bio-Tech Navy & Cyber-Mint/Cyan clinical luxury, biometric telemetry)*"
>
> DO NOT guess or assume the style if the tag is missing!

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

### 🎨 Channel Design Systems Matrix

| Feature | `{Self Improvement}` (Judy Insights) | `{Finance}` (Apex Wealth) | `{Health}` (BioMatrix) |
| :--- | :--- | :--- | :--- |
| **Canvas Background** | Pure Studio Off-White (`#f8fafc`) + warm amber & cognitive blue living orbs | Ultra-Rich Deep Obsidian Carbon (`#030712`, `#0b0f19`) + gold/emerald grid | Deep Bio-Tech Obsidian Navy (`#060913`, `#0a1124`) + cellular neon glow |
| **Color Accents** | Electric Blue (`#0071e3`), Warm Amber (`#f59e0b`), Rose (`#e11d48`) | Liquid Emerald (`#10b981`), Cyber-Gold (`#f59e0b`), Platinum Ice White | Cyber Mint (`#10b981`), Electric Cyan (`#06b6d4`), Vital Coral (`#f43f5e`) |
| **Pacing / Tempo** | `rate="+8%"` (Crisp articulate retention) | `rate="+11%"` (High-velocity, fast-paced Wall Street drive) | `rate="+8%"` (Authoritative, dense clinical retention) |
| **Beat Transitions** | `snap_up` / `zoom_out` (2.5s - 3.5s beats) | `whip_left` / `snap_up` (1.8s - 2.5s rapid cuts) | `snap_up` / `zoom_in` (2.2s - 3.0s telemetry shifts) |
| **3D Camera** | `dramatic_swoop` (Gentle documentary swoop with ReadabilityLock) | `isometric_shelf` + `impact_shake` (High-torque perspective sweeps) | `isometric_shelf` (Clinical telemetry HUD angle) |
| **Foley & Sound** | Sharpie doodles, masking tape snaps, light clicks | Heavy cash thuds, stock ticker chimes, cinematic sub-bass drops | Heartbeat pulses, digital telemetry beeps, synaptic sparks |
| **BGM Genre** | Acoustic piano & light ambient documentary | Dark, driving, minimalist synth pulse | Deep ambient biological drone & rhythmic bio-pulse |
| **Hero Graphics** | Cutout props, masking tape, hand-drawn doodles | Compounding curves, wealth meters, cash flow trees, ROI tickers | Biometric rings, circadian clock, cortisol curve, metabolic gauge |
| **Thumbnail Theme** | `theme="apple_studio"` | `theme="obsidian"` (or `obsidian_gold`) | `theme="obsidian"` (or `biotech_cyan`) |

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
