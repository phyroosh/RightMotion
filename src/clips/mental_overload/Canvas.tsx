import React from "react";
import { interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { WordTimestamp } from "../../types";
// Kinetic text tools (always available):
import { AnimatedSlashStrike, KineticHighlighter, CameraShake } from "../../components/kinetic_text";
import { CinematicIllustrationCard } from "../../components/CinematicIllustrationCard";
// ═══ FRONTIER IMPORT STUBS (from orchestrator active capabilities) ═══
// Uncomment what the Visual Concept mechanism requires.
// Delete what you don't use. See docs/FRONTIER_GALLERY.md for usage.
// DO NOT default to card containers when a frontier is recommended.
// F1 — Infinite World (spatial expansion, infinite canvas):
// import { InfiniteWorldCanvas } from "../../components/world";
// F4 — Semantic Mass Physics (fulcrum balance, tether, impulse response):
// import { KineticFulcrumBeam, SemanticMassNode, TensileStructuralTether } from "../../components/physics/consequence";
// F5 — Environmental Worlds (diorama stage, bedrock foundation, cantilever):
// import { DioramaPlinth, BedrockFoundation, MonolithicCantilever } from "../../components/environment";
// F7 — Causal State Machines (causal world, node graph, threshold reactor):
// import { CausalWorld, CausalNode, ThresholdReactor } from "../../causal";
// Transformation bridges (pathway wear, boundary shift, causal coupling):
// import { KineticFurrow, ThresholdBoundary, PersistentMemoryStage, CausalActionCoupling } from "../../components/primitives";
// import { ThresholdBoundaryShift, ResistancePathway } from "../../components/transformation";

interface CanvasProps {
  transcript: WordTimestamp[];
}

/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  🎬 RIGHTMOTION CREATIVE MISSION — MentalOverloadCanvas
 * ║  Topic: "You’re Not Lazy — You’re Mentally Overloaded!"
 * ║  Primary Visual Mechanism: DISPLACEMENT
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * 🎯 THE RIGHTMOTION CREATIVE MANTRA:
 *    • RIGHTMOTION DOES NOT TRY TO LOOK CREATIVE. RIGHTMOTION TRIES TO MAKE THE IDEA CLEAR.
 *    • CLARITY OVER COMPLEXITY · SIMPLICITY OVER SPECTACLE · MEANING OVER DECORATION.
 *    • ONE STRONG VISUAL IDEA BEATS FIVE COMPETING IDEAS.
 *    • When the visual is already explaining the idea, stop adding things.
 *
 * 📖 CANONICAL BRIEF: Read src/clips/mental_overload/creative_brief.json
 *    Authoritative shot directives, visual clarity budgets, and 5-question state changes.
 *
 * 🎯 CORE STORY IDEA:
 *    "A repeated low-cost concession quietly alters the system baseline until an abnormal compromise becomes the new unconscious normal."
 *
 * 🔄 CENTRAL TRANSFORMATION:
 *    CONSCIOUS_AGENCY -> UNNOTICED_EROSION -> NORMALIZED_TOLERANCE -> HARDENED_AUTOMATICITY
 *    Why: Candidate 'Physical Boundary Displacement & Baseline Recalibration' achieved highest composite score (0.94) with superior semantic clarity (0.95) and mobile readability (0.95). Employs LEVEL_2_PHYSICAL_PROCESS depth to express 'displacement' as a live physical event rather than static card text.
 *
 * ⏱️ PLANNED SHOT SEQUENCE (from Shot Director):
 *    • shot_1_hook (f:0-308, 10.3s) [ACCELERATE | Density:LOW | Budget:1]:
 *      Primary Idea: "Hero editorial subject introduces Physical Boundary Displacement & Baseline"
 *    • shot_2_mechanism (f:308-502, 6.5s) [ACCELERATE | Density:MEDIUM | Budget:1]:
 *      Primary Idea: "One active displacement system evolves: Original boundary (100% integrity) "
 *    • shot_3_escalation (f:502-1690, 39.6s) [HOLD | Density:MEDIUM | Budget:1]:
 *      Primary Idea: "One active displacement system evolves: Original boundary (100% integrity) "
 *    • shot_4_resolution (f:1690-1961, 9.0s) [RELEASE | Density:LOW | Budget:1]:
 *      Primary Idea: "One quiet, grounded sovereign state settles with generous negative breathin"
 *
 * 🛑 MINIMALIST EDITORIAL LAWS:
 *    1. Visual Hierarchy: PRIMARY (one dominant visual idea) → SECONDARY (at most 1 supporting cue) → AMBIENT.
 *       Never PRIMARY + SECONDARY x 3 + TEXT + ICON + PRESENTER + PARTICLES all competing at once.
 *    2. Component Suggestions Are Options, NOT Ingredients: Component budget is 1 (max 2).
 *       Prefer the smallest number of visual systems capable of communicating the shot.
 *    3. The viewer must SEE the mechanism operate live, not merely read about it.
 *    4. Ban Visual Over-Explanation: If the physical motion already explains the sentence, do NOT
 *       repeat it in giant redundant text. Let the motion communicate.
 *    5. "Remove One Thing" Pass: Before finalizing every shot, ask: "What can I remove without losing meaning?"
 *    6. Five Questions: What exists before? What happens? What visibly changes? What exists after? Why does it matter?
 */
import { Img } from "remotion";

export const MentalOverloadCanvas: React.FC<CanvasProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Snappy spring helper
  const springSnappy = (delay: number) =>
    spring({
      frame: frame - delay,
      fps,
      config: { damping: 14, stiffness: 140, mass: 0.6 },
    });

  // Scene triggers mapped to 60fps transcript timestamps
  const isScene1A = frame >= 0 && frame < 135;     // Hook Intro (Judy close-up frames 0-75)
  const isScene1B = frame >= 135 && frame < 308;   // The Rest Paradox (0% energy yield)
  const isScene2  = frame >= 308 && frame < 630;   // Autonomic Nervous Freeze & Toughness Slashed
  const isScene3  = frame >= 630 && frame < 1060;  // Baseline Cortisol Displacement & Recalibration
  const isScene4  = frame >= 1060 && frame < 1680; // Active Restoration & 3-Step Protocols
  const isScene5  = frame >= 1680 && frame <= 1961; // Decisive Resolution: Emotional Safety

  // Scene 1B springs
  const s1bSpring = springSnappy(140);
  const s1bCutoutSpring = springSnappy(165);

  // Scene 2 springs
  const s2Spring = springSnappy(312);
  const s2CutoutSpring = springSnappy(335);

  // Scene 3 springs (Baseline Cortisol displacement)
  const s3Spring = springSnappy(635);
  // Displacement upward from homeostasis y: 440 to elevated y: 220 between frames 680 and 740
  const baselineElevationProgress = interpolate(frame, [680, 740], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const dynamicSagProgress = interpolate(frame, [680, 705, 740], [0, -35, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Scene 4 springs (Active Restoration protocols)
  const s4Spring = springSnappy(1065);
  const proto1Spring = springSnappy(1280);
  const proto2Spring = springSnappy(1420);
  const proto3Spring = springSnappy(1540);

  // Scene 5 springs (Decisive Resolution)
  const s5Spring = springSnappy(1685);
  const s5HarmonySpring = springSnappy(1720);

  // Breathing pulse for organic life
  const gentlePulse = 1 + 0.02 * Math.sin(frame * 0.08);

  return (
    <div className="absolute inset-0 overflow-hidden select-none font-sans pointer-events-none">
      {/* ======================================================== */}
      {/* SCENE 1A: MANDATORY HERO ILLUSTRATION INTRO (0 – 135)    */}
      {/* ======================================================== */}
      {isScene1A && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-start px-8"
          style={{ paddingTop: 280 }}
        >
          <div className="w-full max-w-[840px] flex flex-col items-center">
            {/* Editorial Header */}
            <div className="w-full mb-6 flex items-center justify-between">
              <span className="text-[36px] font-mono font-bold tracking-widest text-slate-500 uppercase">
                THE REST PARADOX
              </span>
              <span className="text-[36px] font-mono font-black text-rose-600 uppercase">
                01 // QUESTION
              </span>
            </div>

            {/* Bespoke 16:9 Hero Illustration Card */}
            <div className="w-full flex justify-center">
              <CinematicIllustrationCard
                imageSrc={staticFile("mental_overload/assets/scene_illustration.png")}
                width={820}
                height={460}
                accentColor="sky"
              />
            </div>

            {/* Grounding Annotation: Pops in after Judy's opening greeting (frame 75+) */}
            {frame >= 75 && (
              <div
                className="mt-6 flex items-center gap-4 bg-white/95 border-[2.5px] border-slate-900 px-6 py-3 rounded-2xl shadow-[0_16px_32px_-8px_rgba(0,0,0,0.12)]"
                style={{
                  opacity: interpolate(springSnappy(75), [0, 1], [0, 1]),
                  transform: `translateY(${interpolate(springSnappy(75), [0, 1], [15, 0])}px)`,
                }}
              >
                <span className="w-4 h-4 rounded-full bg-rose-500 animate-pulse" />
                <span className="text-[36px] font-mono font-black text-slate-900 tracking-wide">
                  PHYSICALLY STILL ≠ RECHARGING
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SCENE 1B: THE COGNITIVE PARADOX (135 – 308)             */}
      {/* ======================================================== */}
      {isScene1B && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-start px-8"
          style={{
            paddingTop: 280,
            opacity: interpolate(s1bSpring, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(s1bSpring, [0, 1], [30, 0])}px)`,
          }}
        >
          <div className="w-full max-w-[840px] flex flex-col items-center gap-6">
            {/* Editorial Header */}
            <div className="w-full flex items-center justify-between">
              <span className="text-[36px] font-mono font-bold tracking-widest text-slate-500 uppercase">
                COGNITIVE FRICTION
              </span>
              <span className="text-[36px] font-mono font-black text-rose-600 uppercase">
                01 // PARADOX
              </span>
            </div>

            {/* Stark Telemetry Card */}
            <div className="w-full flex items-center justify-between bg-white border-[2.5px] border-slate-900 px-8 py-4 rounded-2xl shadow-[0_16px_32px_-8px_rgba(0,0,0,0.12)]">
              <span className="text-[36px] font-mono font-bold text-slate-600">
                ENERGY RECHARGE YIELD
              </span>
              <span className="text-[52px] font-mono font-black text-rose-600">
                0.0%
              </span>
            </div>

            {/* Semantic Cutout: Tangled Confusion & Chaos */}
            <div
              className="relative flex items-center justify-center my-2"
              style={{
                transform: `scale(${interpolate(s1bCutoutSpring, [0, 1], [0.85, 1]) * gentlePulse})`,
                opacity: interpolate(s1bCutoutSpring, [0, 1], [0, 1]),
              }}
            >
              <Img
                src={staticFile("assets/psychology/tangled_confusion_chaos.png")}
                className="w-[460px] h-[460px] object-contain drop-shadow-[0_24px_36px_rgba(0,0,0,0.18)]"
              />
            </div>

            {/* Kinetic Slam */}
            <div className="w-full text-center">
              <h2 className="text-[76px] font-black text-slate-950 tracking-tight leading-[1.05]">
                SCREAMING WITH GUILT
              </h2>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SCENE 2: AUTONOMIC FREEZE & TOUGHNESS SLASH (308 – 630)  */}
      {/* ======================================================== */}
      {isScene2 && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-start px-8"
          style={{
            paddingTop: 280,
            opacity: interpolate(s2Spring, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(s2Spring, [0, 1], [30, 0])}px)`,
          }}
        >
          <div className="w-full max-w-[840px] flex flex-col items-center gap-6">
            {/* Editorial Header */}
            <div className="w-full flex items-center justify-between">
              <span className="text-[36px] font-mono font-bold tracking-widest text-slate-500 uppercase">
                NEUROBIOLOGY
              </span>
              <span className="text-[36px] font-mono font-black text-rose-600 uppercase">
                02 // MECHANISM
              </span>
            </div>

            {/* State Badge */}
            <div className="w-full flex items-center justify-center bg-white border-[2.5px] border-slate-900 px-6 py-3 rounded-2xl shadow-[0_16px_32px_-8px_rgba(0,0,0,0.12)]">
              <span className="text-[40px] font-mono font-black text-rose-600 uppercase tracking-wide">
                STATE: [ AUTONOMIC NERVOUS FREEZE ]
              </span>
            </div>

            {/* Cutout: Depleted Battery Brain */}
            <div
              className="relative flex items-center justify-center my-2"
              style={{
                transform: `scale(${interpolate(s2CutoutSpring, [0, 1], [0.85, 1])})`,
                opacity: interpolate(s2CutoutSpring, [0, 1], [0, 1]),
              }}
            >
              <Img
                src={staticFile("assets/burnout/brain_battery_depleted.png")}
                className="w-[460px] h-[460px] object-contain drop-shadow-[0_24px_36px_rgba(0,0,0,0.18)]"
              />
            </div>

            {/* Slashed Illusion: Mental Toughness */}
            <div className="w-full flex flex-col items-center gap-2 mt-2">
              <AnimatedSlashStrike
                startFrame={515}
                strokeWidth={10}
                color="rose"
              >
                <span className="text-[82px] font-black text-slate-950 tracking-tight">
                  MENTAL TOUGHNESS
                </span>
              </AnimatedSlashStrike>

              {frame >= 530 && (
                <span className="text-[44px] font-mono font-black text-rose-600 tracking-wider bg-rose-50 border border-rose-300 px-6 py-1.5 rounded-xl">
                  NEURAL EXHAUSTION LOCK
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SCENE 3: BASELINE CORTISOL DISPLACEMENT (630 – 1060)     */}
      {/* ======================================================== */}
      {isScene3 && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-start px-8"
          style={{
            paddingTop: 280,
            opacity: interpolate(s3Spring, [0, 1], [0, 1]),
          }}
        >
          <div className="w-full max-w-[840px] flex flex-col items-center gap-6">
            {/* Editorial Header */}
            <div className="w-full flex items-center justify-between">
              <span className="text-[36px] font-mono font-bold tracking-widest text-slate-500 uppercase">
                BASELINE RECALIBRATION
              </span>
              <span className="text-[36px] font-mono font-black text-rose-600 uppercase">
                02 // DISPLACEMENT
              </span>
            </div>

            {/* Live Readout Panel */}
            <div className="w-full flex items-center justify-between bg-white border-[2.5px] border-slate-900 px-8 py-4 rounded-2xl shadow-[0_16px_32px_-8px_rgba(0,0,0,0.12)]">
              <div className="flex flex-col">
                <span className="text-[36px] font-mono font-bold text-slate-500">
                  PHYSIOLOGICAL LOAD
                </span>
                <span className="text-[48px] font-mono font-black text-rose-600">
                  {frame < 680 ? "NORMAL RESTING" : "CHRONIC SURVIVAL"}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[36px] font-mono font-bold text-slate-500">
                  BASELINE CORTISOL
                </span>
                <div className="text-[52px] font-mono font-black text-slate-950">
                  +{Math.round(interpolate(baselineElevationProgress, [0, 1], [0, 180]))}%
                </div>
              </div>
            </div>

            {/* ═══ LIVE PHYSICAL MECHANISM: ARCHITECTURAL BASELINE DISPLACEMENT ═══ */}
            <div className="relative w-full h-[460px] bg-slate-50/70 border-[2.5px] border-slate-900 rounded-3xl overflow-hidden p-6 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.14)]">
              <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                {/* 1. Ghost Memory Baseline (Original Homeostasis at y = 320) */}
                {baselineElevationProgress > 0 && (
                  <g opacity={0.45}>
                    <line
                      x1="60"
                      y1="340"
                      x2="780"
                      y2="340"
                      stroke="#64748b"
                      strokeWidth="4"
                      strokeDasharray="14 10"
                    />
                    <text
                      x="70"
                      y="320"
                      fontFamily="JetBrains Mono, monospace"
                      fontSize="26"
                      fontWeight="bold"
                      fill="#64748b"
                      letterSpacing="0.1em"
                    >
                      ORIGINAL HOMEOSTASIS [GHOST BASELINE]
                    </text>
                  </g>
                )}

                {/* 2. Elevated Cortisol Active Boundary (Shifts from y = 340 to y = 140) */}
                {(() => {
                  const currentY = 340 - 200 * baselineElevationProgress + dynamicSagProgress;
                  return (
                    <g>
                      {/* Left Anchor Pin */}
                      <circle cx="60" cy={currentY} r="10" fill="#090d16" />
                      <circle cx="60" cy={currentY} r="5" fill="#ffffff" />
                      {/* Right Anchor Pin */}
                      <circle cx="780" cy={currentY} r="10" fill="#090d16" />
                      <circle cx="780" cy={currentY} r="5" fill="#ffffff" />

                      {/* Displaced Line */}
                      <line
                        x1="60"
                        y1={currentY}
                        x2="780"
                        y2={currentY}
                        stroke={frame >= 710 ? "#e11d48" : "#090d16"}
                        strokeWidth="6"
                        strokeLinecap="round"
                        style={{
                          filter: "drop-shadow(0px 8px 12px rgba(225, 29, 72, 0.25))",
                        }}
                      />

                      {/* Live Annotation */}
                      <text
                        x="70"
                        y={currentY - 18}
                        fontFamily="JetBrains Mono, monospace"
                        fontSize="28"
                        fontWeight="900"
                        fill={frame >= 710 ? "#e11d48" : "#090d16"}
                        letterSpacing="0.08em"
                      >
                        {frame >= 710 ? "▲ ELEVATED CORTISOL BASELINE" : "RESTING SYSTEM BASELINE"}
                      </text>
                    </g>
                  );
                })()}
              </svg>

              {/* In-Mechanic Micro Annotation */}
              <div className="absolute bottom-6 left-8 right-8 flex items-center justify-between border-t border-slate-300 pt-4">
                <span className="text-[36px] font-mono font-bold text-slate-600">
                  SYSTEM STATUS:
                </span>
                <span className="text-[36px] font-mono font-black text-rose-600 uppercase">
                  {frame < 700 ? "HOMEOSTASIS STABLE" : "SURVIVAL MODE LOCKED"}
                </span>
              </div>
            </div>

            {/* Bottom Clarification: Stillness vs Laziness */}
            <div className="w-full flex items-center justify-between px-2 mt-2">
              <div className="flex flex-col">
                <span className="text-[36px] font-mono font-bold text-slate-500">
                  BODY:
                </span>
                <span className="text-[48px] font-black text-slate-900">
                  PHYSICAL STILLNESS
                </span>
              </div>

              <div className="flex flex-col items-end">
                <span className="text-[36px] font-mono font-bold text-slate-500">
                  NOT:
                </span>
                <AnimatedSlashStrike
                  startFrame={890}
                  strokeWidth={10}
                  color="rose"
                >
                  <span className="text-[64px] font-black text-slate-950">
                    LAZINESS
                  </span>
                </AnimatedSlashStrike>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SCENE 4: ACTIVE RESTORATION & 3 PROTOCOLS (1060 – 1680)  */}
      {/* ======================================================== */}
      {isScene4 && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-start px-8"
          style={{
            paddingTop: 280,
            opacity: interpolate(s4Spring, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(s4Spring, [0, 1], [30, 0])}px)`,
          }}
        >
          <div className="w-full max-w-[840px] flex flex-col items-center gap-6">
            {/* Editorial Header */}
            <div className="w-full flex items-center justify-between">
              <span className="text-[36px] font-mono font-bold tracking-widest text-slate-500 uppercase">
                REGULATION PROTOCOL
              </span>
              <span className="text-[36px] font-mono font-black text-sky-600 uppercase">
                03 // SOLUTION
              </span>
            </div>

            {/* Main Epiphany Title */}
            <div className="w-full text-center">
              <div className="mb-2">
                <AnimatedSlashStrike
                  startFrame={1120}
                  strokeWidth={7}
                  color="slate"
                >
                  <span className="text-[44px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                    PASSIVE NUMBING
                  </span>
                </AnimatedSlashStrike>
              </div>
              <h2 className="text-[78px] font-black text-sky-600 tracking-tight leading-none">
                ACTIVE RESTORATION
              </h2>
            </div>

            {/* 3 Sequential Protocol Action Bars */}
            <div className="w-full flex flex-col gap-4 mt-2">
              {/* Protocol 01 */}
              <div
                className="w-full flex items-center justify-between bg-white border-[2.5px] border-slate-900 px-6 py-4 rounded-2xl shadow-[0_16px_32px_-8px_rgba(0,0,0,0.12)]"
                style={{
                  opacity: interpolate(proto1Spring, [0, 1], [0, 1]),
                  transform: `translateX(${interpolate(proto1Spring, [0, 1], [-20, 0])}px)`,
                }}
              >
                <div className="flex items-center gap-4">
                  <span className="text-[38px] font-mono font-black text-sky-600">
                    01
                  </span>
                  <span className="text-[42px] font-black text-slate-950">
                    STEP AWAY FROM SCREENS
                  </span>
                </div>
                <span className="text-[36px] font-mono font-bold text-slate-500">
                  DETOX
                </span>
              </div>

              {/* Protocol 02 */}
              <div
                className="w-full flex items-center justify-between bg-white border-[2.5px] border-slate-900 px-6 py-4 rounded-2xl shadow-[0_16px_32px_-8px_rgba(0,0,0,0.12)]"
                style={{
                  opacity: interpolate(proto2Spring, [0, 1], [0, 1]),
                  transform: `translateX(${interpolate(proto2Spring, [0, 1], [-20, 0])}px)`,
                }}
              >
                <div className="flex items-center gap-4">
                  <span className="text-[38px] font-mono font-black text-sky-600">
                    02
                  </span>
                  <span className="text-[42px] font-black text-slate-950">
                    15-MIN OUTDOOR WALK
                  </span>
                </div>
                <span className="text-[36px] font-mono font-bold text-slate-500">
                  OPTIC FLOW
                </span>
              </div>

              {/* Protocol 03 */}
              <div
                className="w-full flex items-center justify-between bg-white border-[2.5px] border-slate-900 px-6 py-4 rounded-2xl shadow-[0_16px_32px_-8px_rgba(0,0,0,0.12)]"
                style={{
                  opacity: interpolate(proto3Spring, [0, 1], [0, 1]),
                  transform: `translateX(${interpolate(proto3Spring, [0, 1], [-20, 0])}px)`,
                }}
              >
                <div className="flex items-center gap-4">
                  <span className="text-[38px] font-mono font-black text-sky-600">
                    03
                  </span>
                  <span className="text-[40px] font-black text-slate-950">
                    PHYSIOLOGICAL SIGH
                  </span>
                </div>
                <span className="text-[36px] font-mono font-bold text-slate-500">
                  VAGUS RESET
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SCENE 5: DECISIVE SOVEREIGN RESOLUTION (1680 – 1961)    */}
      {/* ======================================================== */}
      {isScene5 && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-start px-8"
          style={{
            paddingTop: 280,
            opacity: interpolate(s5Spring, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(s5Spring, [0, 1], [30, 0])}px)`,
          }}
        >
          <div className="w-full max-w-[840px] flex flex-col items-center gap-6">
            {/* Editorial Header */}
            <div className="w-full flex items-center justify-between">
              <span className="text-[36px] font-mono font-bold tracking-widest text-slate-500 uppercase">
                THE TAKEAWAY
              </span>
              <span className="text-[36px] font-mono font-black text-emerald-600 uppercase">
                04 // RESOLUTION
              </span>
            </div>

            {/* Semantic Cutout: Heart and Brain Harmony */}
            <div
              className="relative flex items-center justify-center my-1"
              style={{
                transform: `scale(${interpolate(s5HarmonySpring, [0, 1], [0.85, 1]) * gentlePulse})`,
                opacity: interpolate(s5HarmonySpring, [0, 1], [0, 1]),
              }}
            >
              <Img
                src={staticFile("assets/psychology/heart_and_brain_harmony.png")}
                className="w-[320px] h-[320px] object-contain drop-shadow-[0_24px_36px_rgba(0,0,0,0.18)]"
              />
            </div>

            {/* Massive Hero Resolution Typography */}
            <div className="w-full text-center flex flex-col items-center gap-2">
              <span className="text-[38px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                TRUE BIOLOGICAL RECOVERY
              </span>

              <h1 className="text-[82px] font-black text-slate-950 tracking-tight leading-[1.05]">
                REQUIRES <span className="text-sky-600">EMOTIONAL SAFETY</span>
              </h1>

              {/* Struck Through False Cliché */}
              <div className="mt-2">
                <AnimatedSlashStrike
                  startFrame={1850}
                  strokeWidth={8}
                  color="rose"
                >
                  <span className="text-[44px] font-mono font-bold text-slate-400">
                    NOT JUST SITTING STILL
                  </span>
                </AnimatedSlashStrike>
              </div>

              {/* Compact Sovereign Baseline Status Tag */}
              <div className="mt-4 inline-flex items-center gap-3 bg-white border-[2.5px] border-slate-900 px-6 py-2 rounded-xl shadow-sm">
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-500" />
                <span className="text-[34px] font-mono font-black text-emerald-600 tracking-wide uppercase">
                  HOMEOSTASIS RESTORED
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
