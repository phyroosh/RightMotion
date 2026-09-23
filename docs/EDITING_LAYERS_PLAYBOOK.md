# 🎬 RightMotion Editing Layer Composition Playbook

> **RIGHTMOTION IS AN EDITING SYSTEM, NOT A COMPONENT LIBRARY.**
> Do not merely place components on screen. Compose them through:
> `IDEA → VISUAL METAPHOR → EDITING LAYERS → TIMING / INTERACTION → PAYOFF`

This playbook is the definitive guide for AI coding agents to compose with RightMotion's 11 core editing layers.

---

## 📐 The Mobile Scale Standard (Simple Frame ≠ Small Visuals)

All compositions render for a **9:16 vertical viewport (1080×1920)** viewed on a 6-inch mobile phone at approximately **720p effective resolution**.

| Layer Role | Mobile Size Requirement | Stroke / Border Weight | Why It Matters |
|:---|:---|:---|:---|
| **PRIMARY Visual Subject** | **400px – 750px** width / height | **6px – 14px** SVG stroke | Must be immediately recognizable in a split second in a Shorts feed. Never draw 100-250px tiny shapes. |
| **SECONDARY Visual Support** | **150px – 300px** width / height | **2px – 4px** stroke | Subordinated metric pill, counter, or status line. Must not compete with the primary subject. |
| **Hero Slam Typography** | **80px – 110px** | Font: Montserrat Black | Monumental keyword beat. |
| **Scene Headline Typography** | **56px – 72px** | Font: Montserrat Bold | Clear, high-contrast, zero clutter. |
| **Metric / Data Readouts** | **56px – 80px** | Font: JetBrains Mono Black | Clean data numbers. |
| **Absolute Typography Floor**| **36px** | Minimum allowable | Anything under 36px is completely unreadable on a phone screen. |

---

## 🏛️ The 11 Editing Layers

---

### Layer 1: Physical & Visual Metaphor Systems
*Deforming, sagging, fracturing, carving, balancing, or displacing physical matter.*

#### Available Components:
- `ViscoelasticDeformation` (`src/components/physics/materiality/ViscoelasticDeformation.tsx`)
- `StressFractureEngine` (`src/components/physics/materiality/StressFractureEngine.tsx`)
- `KineticFulcrumBeam` (`src/components/physics/consequence/KineticFulcrumBeam.tsx`)
- `KineticFurrow` (`src/components/primitives/KineticFurrow.tsx`)
- `ThresholdBoundary` (`src/components/primitives/ThresholdBoundary.tsx`)
- `CapillaryInkBleed` (`src/components/physics/materiality/CapillaryInkBleed.tsx`)
- Bespoke SVG vector deflection (e.g. `distraction_noise`, `structural_pressure`)

#### WHAT IT DOES:
Transforms abstract concepts into physical matter governed by tension, mass, elasticity, and load. An object bends progressively lower, fractures along stress lines, tilts on a pivot, or carves into ground.

#### WHEN TO USE IT:
- **Pressure, stress, burden, burnout**: Continuous deformation / sagging slab / spreading fracture.
- **Standards, compromise, boundaries**: Horizontal datum line deflecting and recalibrating lower.
- **Habits, neuroplasticity, repetition**: Linear furrow carving deeper on each pass.
- **Tradeoffs, priority dilemmas, balance**: Lever beam with unequal torque tilting sharply.
- **Irreversible damage, toxic impact**: Ink bleeding into porous paper.

#### WHAT IT LOOKS LIKE (Bespoke SVG Deflection + Ghost Baseline):
```tsx
// Live deflecting horizontal beam with persistent memory ghost trace
const beamY = 820;
const beamStartX = 120;
const beamEndX = 960;
const beamMidX = 540;
const currentMidY = beamY + deflection; // deflection driven by spring loads

const beamPath = `M ${beamStartX} ${beamY} Q ${beamMidX} ${currentMidY} ${beamEndX} ${beamY}`;
const ghostPath = `M ${beamStartX} ${beamY} L ${beamEndX} ${beamY}`;

return (
  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1080 1920">
    {/* Ghost trace of original standard */}
    {deflection > 15 && (
      <path d={ghostPath} stroke="#cbd5e1" strokeWidth={3} strokeDasharray="10 10" fill="none" opacity={0.6} />
    )}
    {/* Primary deflecting beam (Mobile scale: 8px stroke!) */}
    <path d={beamPath} stroke={beamColor} strokeWidth={8} strokeLinecap="round" fill="none" />
  </svg>
);
```

#### WHAT IT COMBINES WITH:
- **CameraCanvas**: Slow push-in (zoom 1.0 → 1.06) as deflection increases to amplify tension.
- **SoundDesignEngine**: Soft click or whoosh on each added load; sharp `impact_hit` on fracture or snap.
- **Captions**: Highlight spoken keywords (`"interest"`, `"weight"`, `"rot"`) synchronously with load drops.

#### WHAT NOT TO DO:
- ❌ Do NOT wrap the physical metaphor inside a generic white rounded card. Use `MechanismStage`.
- ❌ Do NOT draw thin 2px lines. Use 6px–12px strokes for mobile punch.
- ❌ Do NOT replace the physical deformation with a static text label reading "BURNOUT".

---

### Layer 2: Causal Animation & State-Machine Behavior
*Deterministic, event-driven state transitions with physical impact reaction.*

#### Available Components:
- `CausalWorld`, `CausalNode`, `ThresholdReactor`, `useNodeState`, `useCausalWorld` (`src/causal/`)

#### WHAT IT DOES:
Pre-resolves a deterministic state graph where root trigger events cascade into downstream node conditions, value mutations, and impact physics (`scaleX/Y` squash and rebound on state entry).

#### WHEN TO USE IT:
- Multi-step cause-and-effect sequences (e.g. `interruption` → `capacity_depleted` → `overload` → `reset`).
- When one element's state change directly forces another element to react.
- When an upstream metric crosses a threshold and triggers an alarm state downstream.

#### WHAT IT LOOKS LIKE:
```tsx
import { CausalWorld, CausalNode, ThresholdReactor } from "../../causal";
import { CausalGraphDefinition, RootTrigger } from "../../causal/types";

const cognitiveGraph: CausalGraphDefinition = {
  id: "cognitive_load_loop",
  nodes: [
    {
      id: "focus_core",
      initialCondition: "PRISTINE",
      initialValues: { load: 0, integrity: 100 },
      transitions: [
        {
          triggerEventType: "NOTIFICATION_DROP",
          toCondition: "STRAINED",
          mutations: [{ property: "load", operation: "add", value: 45 }],
        },
        {
          triggerEventType: "SOVEREIGN_CUT",
          toCondition: "RESTORED",
          mutations: [{ property: "load", operation: "set", value: 0 }],
        }
      ]
    }
  ]
};

const triggers: RootTrigger[] = [
  { frame: 180, targetNodeId: "focus_core", eventType: "NOTIFICATION_DROP" },
  { frame: 540, targetNodeId: "focus_core", eventType: "SOVEREIGN_CUT" },
];

return (
  <CausalWorld graph={cognitiveGraph} rootTriggers={triggers}>
    <CausalNode id="focus_core" enableImpactPhysics={true}>
      {(state) => (
        <div className={`w-[500px] h-[500px] rounded-full border-[10px] transition-colors ${
          state.condition === "STRAINED" ? "border-rose-500 bg-rose-500/10" : "border-sky-500 bg-sky-500/10"
        }`}>
          {/* Node content reacting to state.values.load */}
        </div>
      )}
    </CausalNode>
  </CausalWorld>
);
```

#### WHAT IT COMBINES WITH:
- **SoundDesignEngine**: Synced sound cue on transition frame (`frame: 180` click, `frame: 540` whoosh).
- **SecondaryMotion**: Gentle drag / rebound on transition.

#### WHAT NOT TO DO:
- ❌ Do NOT create 10 disconnected state booleans in React. Use a unified causal sequence.
- ❌ Do NOT change states abruptly without a physical visual reaction (squash/rebound or flash).

---

### Layer 3: Camera Choreography & 2.5D Rig
*Dynamic perspective, depth tracking, push-ins, Dutch tilt, and organic breathing.*

#### Available Components:
- `CameraCanvas` (`src/components/CameraCanvas.tsx`)
- `VirtualCamera3D` (`src/components/camera3d/VirtualCamera3D.tsx`)
- `CameraShake` (`src/components/kinetic_text/CameraShake.tsx`)
- `WorldCameraBreathHold` (`src/components/temporal/WorldCameraBreathHold.tsx`)

#### WHAT IT DOES:
Applies After Effects-grade 2.5D camera motion across the canvas. Pans to focal targets, slowly pushes in during rising psychological tension, adds subtle handheld breathing drift, and applies rotational Dutch tilt during crisis moments.

#### WHEN TO USE IT:
- **Rising tension / escalation**: Camera pushes in from zoom 1.0 to 1.06 over 4–6 seconds.
- **Sudden realization / impact**: Sudden rotational punch or micro-shake (10–15 frames).
- **Profound realization / breath**: Momentary camera freeze (`WorldCameraBreathHold`).
- **Subject transition**: Smooth pan from x: 540, y: 700 to a lower settled subject at y: 920.

#### WHAT IT LOOKS LIKE (`CameraCanvas` in 9:16 Vertical Shorts):
```tsx
import { CameraCanvas, CameraKeyframe } from "../../components/CameraCanvas";

// Define intentional camera keyframes across the timeline (timeMs)
const cameraKeyframes: CameraKeyframe[] = [
  { timeMs: 0, x: 540, y: 960, zoom: 1.0, rotate: 0 },
  // Subtle push-in as tension mounts in scene 2
  { timeMs: 4500, x: 540, y: 920, zoom: 1.05, rotate: -0.5 },
  // Impact punch on rupture
  { timeMs: 8200, x: 540, y: 940, zoom: 1.08, rotate: 1.2 },
  // Reframe to wide equilibrium on resolution
  { timeMs: 11000, x: 540, y: 960, zoom: 1.0, rotate: 0 },
];

return (
  <CameraCanvas
    currentMs={currentMs}
    keyframes={cameraKeyframes}
    width={1080}
    height={1920}
    enableDrift={true}
    driftIntensity={0.6}
  >
    {/* Staged scene mechanisms live here inside the camera world */}
  </CameraCanvas>
);
```

#### WHAT IT COMBINES WITH:
- **Physical Metaphor**: Camera framing moves with the deformation.
- **SoundDesignEngine**: Deep whoosh on camera push; impact hit on camera shake.

#### WHAT NOT TO DO:
- ❌ Do NOT rotate camera rapidly for empty "dopamine" stimulation. Keep roll between -2° and +2°.
- ❌ Do NOT zoom past 1.15x unless framing an intentional macro close-up.

---

### Layer 4: Sound Design & Punctuation
*Tactile, layered auditory events synchronized with physical events.*

#### Available Components:
- `SoundDesignEngine`, `SfxCue`, `SfxType` (`src/components/SoundDesignEngine.tsx`)

#### WHAT IT DOES:
Renders frame-accurate tactile sound effects:
- `click`: Crisp, gentle pop/lock for UI switches, discrete node appearances, and step increments.
- `whoosh_fast`: Quick lateral movement, sweep, arrow slash.
- `whoosh_deep`: Heavy structural movement, baseline recalibration, large object entrance.
- `whoosh_sparkle`: Insight reveal, enlightenment, sovereign clarity bloom.
- `whoosh_cinematic`: Wide transitional sweep.
- `impact_hit` / `piano_hit`: Heavy tactile collision, boundary fracture, breaking point.
- `marker_scribble`: Handwritten line, drawing furrow, underline.
- `tape_snap`: Sharp boundary snap, tether severance, sudden halt.

#### WHEN TO USE IT:
- Every physical contact point, load drop, threshold crossing, slash cut, or resolution snap.

#### WHAT IT LOOKS LIKE:
```tsx
import { SoundDesignEngine, SfxCue } from "../../components/SoundDesignEngine";

const SFX_CUES: SfxCue[] = [
  { frame: 0, type: "whoosh_deep", volume: 0.28 },
  { frame: 150, type: "whoosh_fast", volume: 0.24 },
  { frame: 210, type: "click", volume: 0.28 },         // First load drop
  { frame: 320, type: "click", volume: 0.28 },         // Second load drop
  { frame: 450, type: "impact_hit", volume: 0.30 },    // Boundary fracture
  { frame: 680, type: "whoosh_sparkle", volume: 0.26 },// Resolution bloom
];

return (
  <>
    <SoundDesignEngine cues={SFX_CUES} />
    {/* Visual Canvas Elements */}
  </>
);
```

#### WHAT NOT TO DO:
- ❌ Do NOT wallpaper every frame with noise. Silence between events makes impacts hit harder.
- ❌ Do NOT trigger sounds out of sync with visual contact frames.

---

### Layer 5: Open-Canvas Motion Staging
*Calibrated platform-safe bounds without card walls.*

#### Available Components:
- `MechanismStage` (`src/components/primitives/MechanismStage.tsx`)
- `OpenStageSurface` (`src/components/primitives/OpenStageSurface.tsx`)
- `PersistentMemoryStage` (`src/components/primitives/PersistentMemoryStage.tsx`)

#### WHAT IT DOES:
Provides calibrated vertical bounds:
- **Top limit**: `y = 260px` (clears channel branding & top progress bar).
- **Bottom limit**: `y = 1340px` (clears the 1400px–1560px AppleKineticCaptions zone and Shorts UI buttons).
- **Width**: `1080px` full horizontal span.
Renders open vector surfaces with **zero rounded box containers**.

#### WHEN TO USE IT:
- Default wrapper for all mechanism scenes (Scene 1, Scene 2, Scene 3).

#### WHAT IT LOOKS LIKE:
```tsx
import { MechanismStage } from "../../components/primitives/MechanismStage";

return (
  <MechanismStage top={260} bottom={1340}>
    {/* All scenes render directly on open stage */}
    {isMechanism && <YourBespokePhysicalMechanism />}
  </MechanismStage>
);
```

---

### Layer 6: Micro-Animation & Secondary Motion
*Organic weight, elasticity, anticipation, and chronic load tremor.*

#### Available Components:
- `SecondaryMotion` (`src/components/physics/SecondaryMotion.tsx`)
- `SquashAndStretch` (`src/components/physics/SquashAndStretch.tsx`)
- Procedural sinusoidal tremor: `Math.sin(frame * 0.9) * 2.5`

#### WHAT IT DOES:
Prevents robotic linear motion. Adds natural physical follow-through:
- Anticipatory recoil (compressing slightly before launching).
- Squash on contact, stretch on acceleration.
- Subtle microscopic tremor/jitter under heavy chronic strain.

#### WHEN TO USE IT:
- When a weight impacts a surface.
- When an element is held under static load for >1.5 seconds (tremor conveys internal struggle).
- When an object accelerates into a new state.

---

### Layer 7: Continuity & Persistent Memory Traces
*Permanent visible consequences that carry across scene cuts.*

#### Available Components:
- `PersistentMemoryStage` (`src/components/primitives/PersistentMemoryStage.tsx`)

#### WHAT IT DOES:
Renders historical traces that remain visible even after the active mechanism finishes:
- `dashed_ghost_line`: Faint memory of original standard line.
- `worn_furrow`: Permanent etched groove in ground plane.
- `fracture_chasm`: Faint scar showing where a structure previously broke.

#### WHEN TO USE IT:
- When a standard has been compromised and the script moves to the next thought.
- When showing the compounding consequence of past choices.

---

### Layer 8: AppleKineticCaptions & Caption Interaction
*Spoken word subtitles with spatial and temporal coordination.*

#### Available Components:
- `AppleKineticCaptions` (`src/components/AppleKineticCaptions.tsx`)

#### HOW TO INTERACT WITH IT FROM CANVAS:
- Keep `y: 1380px – 1600px` 100% free of primary visual elements.
- Match visual impulse frames to exact word timestamps in `transcript.json`.
- When an important word is spoken (e.g. `"breaks"`), fire the physical event (e.g. beam fracture) on that exact frame!

---

### Layer 9: Transitions & Visual Transformations
*Decisive negation, highlighter strokes, and sovereign payoff blooms.*

#### Available Components:
- `AnimatedSlashStrike` (`src/components/kinetic_text/AnimatedSlashStrike.tsx`)
- `KineticHighlighter` (`src/components/kinetic_text/KineticHighlighter.tsx`)
- Sovereign clarity bloom / color shifts

#### WHAT IT DOES:
- `AnimatedSlashStrike`: Bold diagonal red/rose blade slash cutting through a false assumption or toxic thought.
- `KineticHighlighter`: Dynamic marker stroke drawing behind a single monumental keyword.
- Sovereign bloom: Colors shift from high-friction amber/rose to serene emerald (`#059669`) or sky blue (`#0284c7`).

---

### Layer 10: Retention Choreography & Micro-Events
*Choreographing viewer attention across time.*

#### Rules:
- **visualDensity ≠ attentionIntensity**: A clean frame with a single deforming line can create extreme tension through anticipation and slow camera creep.
- **Anticipation (frames -15 to 0)**: Slow down movement slightly, tighten tension, or pause right before a major drop or fracture.
- **Micro-Events every 45–75 frames**: An accent, a tiny crack, a numerical tick, a sound click, or a camera micro-punch keeps the timeline alive without cluttering the screen.
- **Decisive Payoff**: Every tension build MUST be resolved with an elastic rebound, fracture rupture, or sovereign release.

---

### Layer 11: Semantic Asset Cutouts & Presenter Grounding
*High-resolution physical subject cutouts.*

#### Rules:
- **Size cutouts large**: **400px–750px**. Never place a tiny 150px icon in the middle of nowhere.
- **Presenter Grounding**: Judy / Andrew must be grounded to the bottom bezel (`baseHeight: 1250–1360px`, `bottom: 0`) or framed inside an avatar token. Never float a severed waist-up torso in open air!
- In mechanism scenes, remove the presenter so the physical mechanism commands 100% of viewer focus.

---

## 🎯 The 3 Flagship Composition Recipes

When faced with a script, identify its **narrative archetype** and compose with the corresponding editing layers:

### Archetype A: Physical Metaphor (Accumulation, Pressure, Friction, Burnout)
```text
EDITING LAYERS COMPOSED:
1. Primary Physical Mechanism (Viscoelastic beam / conduit / furrow / fulcrum, 500-800px)
2. Open Stage (MechanismStage, no card container)
3. Camera Choreography (CameraCanvas slow push-in zoom 1.0 -> 1.05)
4. Micro-Event / Tremor (Math.sin tremor under chronic strain)
5. Sound Punctuation (click on load drop, impact_hit on fracture)
6. Secondary Metric Readout (single 56px mono counter)
7. Persistent Memory (dashed ghost line showing original baseline)
8. Decisive Elastic Payoff (snap back or release bloom)
```

### Archetype B: Causal State Machine (Habit loop, Triggers, Systems, Recovery)
```text
EDITING LAYERS COMPOSED:
1. Causal World / State Machine (CausalWorld with deterministic graph)
2. State Node with Impact Physics (CausalNode with spring squash on transition)
3. Threshold Reactor (visual tension flare when load > 80%)
4. Camera Response (micro-punch / Dutch angle on state shift)
5. Sound Punctuation (sound cue on transition frame)
6. Decisive Sovereign Payoff (system reset)
```

### Archetype C: Spatial Distance & Emotional Restraint (Isolation, Boundary, Clarity)
```text
EDITING LAYERS COMPOSED:
1. Spatial Geometry (Solitary node vs dense cluster, 500px gap)
2. Tension Tether (dynamic line with tensile strain)
3. Tension Severance (AnimatedSlashStrike or snap beat)
4. Camera Hold (locked wide frame letting negative space communicate distance)
5. Sound Accent (tape_snap or subtle piano hit)
6. Sovereign Bloom (emerald glow radiating into negative space)
```
