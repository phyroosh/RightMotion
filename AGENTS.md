# 🎬 RightClips Autonomous AI Agent Engine Guide

This document is the **authoritative specification** for any AI Agent (Antigravity/AGY, Claude Code, Cursor, Copilot, ChatGPT) working in the **RightClips** repository.

When a user provides a script and says:
> *"Here is the script to generate the short video: <script text>"* or *"Generate a long-form video for: <script text>"*

Follow this exact automated pipeline to generate the voiceover, word timestamps, Remotion composition, 4K thumbnail, and final MP4 render without needing additional user explanation.

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
Synthesize the voiceover with `edge-tts` (`en-US-AvaMultilingualNeural` at `rate="+0%"`) and extract GPU/CPU millisecond timestamps using `faster-whisper`:
- Audio output: `public/<name>/voiceover.mp3`
- Transcript output: `src/clips/<name>/transcript.json`

#### Step 2: Scaffold the Clip Component Directory (`src/clips/<name>/`)
Create 4 modular files:
1. `Background.tsx`: Clean Apple Studio mesh background (`bg-[#f8fafc]` with subtle ambient orbs and dot-grid).
2. `Canvas.tsx`: High-retention motion graphics storyboard using `<ProCutout />` or `<PropComparison />`.
3. `Presenter.tsx`: Judy multi-pose animations (`character_fullbody_pointing.png`, `character_pointing.png`, `character_crossed.png`, `character_open.png`, `character_fullbody_open.png`) using `CharacterKeyframeAnimator`.
4. `index.tsx`: Main Composition uniting voiceover, BGM, synchronized SFX layer, `AppleProgressBar`, `AppleKineticCaptions`, and **FRAME 0 THUMBNAIL COVER**.

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
4. **Strict Mobile Font Scale**:
   - Card Titles & Headers: `48px - 58px` (`text-5xl`), `font-black`.
   - Primary Labels: `32px - 40px` (`text-2xl` to `text-3xl`), `font-black`.
   - Badges & Chips: **MINIMUM 24px - 30px** (`text-xl` / `text-2xl`, `font-black`), NEVER `text-xs` (12px) or `text-sm` (14px).
   - Handwritten / Script Accents: `28px - 36px` (`text-3xl font-serif italic font-black`).
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
