import React from "react";
import {
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { WordTimestamp } from "../../types";
import {
  MechanismStage,
  ThresholdBoundary,
  CausalActionCoupling,
  PersistentMemoryStage,
} from "../../components/primitives";
import { ViscoelasticDeformation } from "../../components/physics/materiality";
import { SemanticMassNode } from "../../components/physics/consequence";
import { AnimatedSlashStrike, KineticHighlighter } from "../../components/kinetic_text";
import { PersistentTrace } from "../../compiler/ast.types";
import { CheckCircle2 } from "lucide-react";

interface CanvasProps {
  transcript: WordTimestamp[];
}

/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  🎬 RIGHTMOTION CREATIVE MISSION — TheToleranceTrapCanvas
 * ║  Topic: "Your brain learns what you repeatedly tolerate!"
 * ║  Primary Visual Mechanism: DISPLACEMENT & MATERIAL STRAIN
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * 📖 CANONICAL BRIEF: Read src/clips/the_tolerance_trap/creative_brief.json
 *    Contains authoritative shot-by-shot directives, camera tracks, and 5-question state changes.
 *
 * 🎯 CORE STORY IDEA:
 *    "Every boundary you refuse to defend quietly becomes your brain's new baseline."
 *
 * 🔄 CENTRAL TRANSFORMATION:
 *    CONSCIOUS_AGENCY -> UNNOTICED_EROSION -> NORMALIZED_TOLERANCE -> HARDENED_AUTOMATICITY
 *
 * 📐 Platform-Safe Bounds (Rule 5.9):
 *    - Canvas: 1080x1920 @ 60 FPS
 *    - Safe Text Zone: y: 280px to y: 1340px
 *    - Captions Zone:   y: 1380px to y: 1560px
 */
export const TheToleranceTrapCanvas: React.FC<CanvasProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ═══ FRAME BOUNDARIES (from transcript.json timing) ═══
  // Hook:        frames 0    → 250 (0s - 4.17s)
  // Mechanism:   frames 250  → 740 (4.17s - 12.33s)
  // Escalation:  frames 740  → 1230 (12.33s - 20.50s)
  // Resolution:  frames 1230 → 1950 (20.50s - 32.50s)

  const isHook = frame < 250;
  const isMechanism = frame >= 250 && frame < 740;
  const isEscalation = frame >= 740 && frame < 1230;
  const isResolution = frame >= 1230;

  // Persistent visual memory traces inherited across scenes
  const memoryTraces: PersistentTrace[] = [
    {
      traceId: "ghost_initial_standard",
      originatingActorId: "threshold_boundary",
      originatingSceneId: "mechanism_scene",
      appearance: "dashed_ghost_line",
      coordinates: { y: 440, startX: 90, endX: 990 },
      opacity: 0.35,
      persistsUntilEnd: true,
      semanticMeaning: "Initial uncompromised standard boundary",
    },
  ];

  return (
    <MechanismStage top={280} bottom={1340}>
      {/* ════════════════════════════════════════════════════════════
       * 1. HOOK INTRO (Frames 0 → 250 / 0s - 4.17s)
       * COMMUNICATE: Every boundary you refuse to defend quietly becomes your brain's new baseline.
       * Staged alongside Judy presenter (frames 0 to 75)
       * Legitimate story object: evidence_contract physical_document
       * ════════════════════════════════════════════════════════════ */}
      {isHook && (() => {
        const spIntro = spring({
          frame,
          fps,
          config: { damping: 14, mass: 0.7, stiffness: 120 },
        });

        return (
          <div
            className="w-full flex flex-col items-center select-none"
            data-story-object="evidence_contract physical_document"
            style={{
              opacity: interpolate(spIntro, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(spIntro, [0, 1], [24, 0])}px)`,
            }}
          >
            {/* Editorial Card with Headline ABOVE image to avoid presenter occlusion */}
            <div className="relative w-[860px] bg-white rounded-[32px] p-7 border-[2.5px] border-slate-900 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.18)] flex flex-col items-center">
              <div className="w-full text-center mb-3">
                <span className="font-mono font-black uppercase text-sky-600 tracking-wider text-[36px]">
                  NEURAL BASELINE DRIFT
                </span>
                <h1 className="font-display font-black text-slate-950 text-[64px] leading-tight tracking-tight uppercase mt-1">
                  THE TOLERANCE TRAP
                </h1>
              </div>

              <div className="w-full h-[440px] rounded-[22px] overflow-hidden border-[1.5px] border-slate-800/20 relative shadow-inner">
                <Img
                  src={staticFile("the_tolerance_trap/assets/scene_illustration.png")}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="w-full mt-4 text-center">
                <div className="font-display font-bold text-slate-600 text-[36px]">
                  Every conceded boundary becomes your baseline.
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ════════════════════════════════════════════════════════════
       * 2. MECHANISM: LIVE BOUNDARY SAG & DISPLACEMENT (Frames 250 → 740)
       * COMMUNICATE: Neuroplasticity isn't moral; it is purely mechanical.
       * When you repeatedly tolerate late starts, disorganized spaces, or chronic disrespect...
       * PRIMARY MECHANISMS: ThresholdBoundary (F7) + ViscoelasticDeformation (F2) + SemanticMassNode (F4)
       * ════════════════════════════════════════════════════════════ */}
      {isMechanism && (() => {
        const spMech = spring({
          frame: frame - 250,
          fps,
          config: { damping: 14, stiffness: 120 },
        });

        // Viscoelastic compressive load begins ramping when "tolerate" is spoken (f: 501)
        const loadProgress = interpolate(
          frame,
          [501, 560],
          [0, 0.85],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        return (
          <div
            className="w-full h-full flex flex-col items-center select-none relative"
            style={{
              opacity: interpolate(spMech, [0, 1], [0, 1]),
            }}
          >
            {/* Top Kinetic Display Headlines */}
            <div className="text-center z-10">
              <span className="font-mono font-black uppercase text-sky-600 tracking-widest text-[36px]">
                PHYSICAL REWIRING
              </span>
              <h2 className="font-display font-black text-slate-950 tracking-tight text-[64px] uppercase mt-1">
                NEUROPLASTICITY IS MECHANICAL
              </h2>
            </div>

            {/* Semantic Cutout with F2 Viscoelastic Strain */}
            <ViscoelasticDeformation load={loadProgress} impactFrame={501}>
              <div
                className="w-[380px] h-[310px] flex items-center justify-center my-1 relative z-0"
                style={{
                  transform: `scale(${interpolate(spMech, [0, 1], [0.85, 1])})`,
                }}
              >
                <Img
                  src={staticFile("assets/psychology/hyperrealistic_3d_glowing_brain.png")}
                  className="w-full h-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.18)]"
                />
              </div>
            </ViscoelasticDeformation>

            {/* Primary Physical Mechanism: ThresholdBoundary Deflection */}
            <div className="w-full h-[360px] relative mt-1">
              <ThresholdBoundary
                frame={frame}
                fps={fps}
                startX={90}
                endX={990}
                initialBaselineY={70}
                settledBaselineY={250}
                strokeColor="#090d16"
                thicknessPx={7}
                triggerFrame={501}
                impulseDurationFrames={48}
                showGhostTrace={true}
                ghostOpacity={0.45}
                label="INTERNAL STANDARD"
                labelColor="#090d16"
              />
            </div>

            {/* Micro-reveals: 3 weight tags entering with F4 SemanticMass inertia */}
            <div className="flex items-center gap-6 mt-4 z-10">
              {frame >= 525 && (
                <SemanticMassNode
                  mass={1.4}
                  enterFrame={525}
                  impulses={[{ frame: 525, forceY: 12, durationFrames: 18 }]}
                >
                  <div
                    className="bg-white border-[2.5px] border-slate-900 shadow-md px-6 py-3"
                    style={{ borderRadius: 16 }}
                  >
                    <span className="font-mono text-[36px] font-black text-slate-900 uppercase">
                      LATE STARTS
                    </span>
                  </div>
                </SemanticMassNode>
              )}

              {frame >= 585 && (
                <SemanticMassNode
                  mass={1.8}
                  enterFrame={585}
                  impulses={[{ frame: 585, forceY: 15, durationFrames: 20 }]}
                >
                  <div
                    className="bg-white border-[2.5px] border-slate-900 shadow-md px-6 py-3"
                    style={{ borderRadius: 16 }}
                  >
                    <span className="font-mono text-[36px] font-black text-slate-900 uppercase">
                      CHAOTIC SPACES
                    </span>
                  </div>
                </SemanticMassNode>
              )}

              {frame >= 666 && (
                <SemanticMassNode
                  mass={2.6}
                  enterFrame={666}
                  impulses={[{ frame: 666, forceY: 22, durationFrames: 24 }]}
                >
                  <div
                    className="bg-rose-50 border-[2.5px] border-rose-900 shadow-md px-6 py-3"
                    style={{ borderRadius: 16 }}
                  >
                    <span className="font-mono text-[36px] font-black text-rose-700 uppercase">
                      DISRESPECT
                    </span>
                  </div>
                </SemanticMassNode>
              )}
            </div>
          </div>
        );
      })()}

      {/* ════════════════════════════════════════════════════════════
       * 3. ESCALATION: ERROR SIGNALS SILENCED (Frames 740 → 1230)
       * COMMUNICATE: ...your brain stops firing error signals.
       * What originally triggered tension gets re-coded as normal, silently lowering your internal standards.
       * CAUSAL MECHANISMS: CausalActionCoupling (F7) + AnimatedSlashStrike + PersistentMemoryStage
       * ════════════════════════════════════════════════════════════ */}
      {isEscalation && (() => {
        const spEsc = spring({
          frame: frame - 740,
          fps,
          config: { damping: 14, stiffness: 130 },
        });

        const isSilenced = frame >= 815;

        return (
          <div
            className="w-full h-full flex flex-col items-center select-none relative"
            style={{
              opacity: interpolate(spEsc, [0, 1], [0, 1]),
            }}
          >
            {/* Persistent Historical Memory Trace of the Compromised Standard */}
            <PersistentMemoryStage frame={frame} traces={memoryTraces} />

            {/* Top Display Headlines */}
            <div className="text-center z-10 mb-4">
              <span className="font-mono font-black uppercase text-rose-600 tracking-widest text-[36px]">
                ALLOSTATIC DAMPENING
              </span>
              <h2 className="font-display font-black text-slate-950 tracking-tight text-[64px] uppercase mt-1">
                ERROR SIGNALS MUTED
              </h2>
            </div>

            {/* Causal Action Conduit: Impulse transmits to silence error alarms */}
            <div className="w-full h-[280px] relative my-2">
              <CausalActionCoupling
                frame={frame}
                fps={fps}
                startX={180}
                startY={80}
                endX={880}
                endY={80}
                triggerFrame={780}
                propagationDurationFrames={22}
                impactDurationFrames={26}
                color="#e11d48"
                sourceLabel="REPEATED CONCESSION"
                targetLabel="ERROR SENSORS"
                physicalLawLabel="SYNAPTIC SUPPRESSION IMPULSE"
                thicknessPx={5}
              />

              {/* Target Reactor Node: Shockwave cut across Error Alarms */}
              <div
                className="absolute"
                style={{
                  top: 140,
                  left: 630,
                }}
              >
                <AnimatedSlashStrike
                  startFrame={810}
                  color="rose"
                  preset="blade_slash"
                  strokeWidth={8}
                >
                  <div
                    className={`px-8 py-4 border-[3px] shadow-xl font-mono text-[36px] font-black uppercase transition-colors duration-300 ${
                      isSilenced
                        ? "bg-slate-100 border-slate-400 text-slate-400"
                        : "bg-rose-50 border-rose-600 text-rose-600"
                    }`}
                    style={{ borderRadius: 18 }}
                  >
                    {isSilenced ? "ALARM SILENCED" : "⚡ ERROR ALARM"}
                  </div>
                </AnimatedSlashStrike>
              </div>
            </div>

            {/* Cognitive Mutation Block: Re-coded as Normal */}
            <div className="flex flex-col items-center gap-4 mt-6 z-10">
              <span className="font-mono font-bold uppercase text-slate-500 tracking-wider text-[36px]">
                NEURAL BASELINE SHIFT
              </span>
              <div
                className="bg-slate-950 text-white px-10 py-5 shadow-2xl"
                style={{ borderRadius: 18 }}
              >
                <h3 className="font-display font-extrabold text-[44px] uppercase tracking-tight text-center">
                  ABNORMAL → CODED AS NORMAL
                </h3>
              </div>
              <div className="font-display font-bold text-slate-700 text-[36px] text-center mt-2">
                Internal standards silently ratchet downward.
              </div>
            </div>
          </div>
        );
      })()}

      {/* ════════════════════════════════════════════════════════════
       * 4. RESOLUTION: SOVEREIGN NON-NEGOTIABLE FLOOR (Frames 1230 → 1950)
       * COMMUNICATE: To reverse this drift, establish an uncompromising non-negotiable floor:
       * refuse to tolerate one micro-compromise the exact second it surfaces.
       * Defend the boundary instantly, and your neural filter recalibrates.
       * ════════════════════════════════════════════════════════════ */}
      {isResolution && (() => {
        const spRes = spring({
          frame: frame - 1230,
          fps,
          config: { damping: 14, stiffness: 120 },
        });

        const spCutout = spring({
          frame: Math.max(0, frame - 1250),
          fps,
          config: { damping: 13, stiffness: 130 },
        });

        // Bedrock floor locking spring at frame 1680
        const isFloorLocked = frame >= 1680;
        const spFloor = spring({
          frame: Math.max(0, frame - 1680),
          fps,
          config: { damping: 11, stiffness: 150 },
        });

        return (
          <div
            className="w-full h-full flex flex-col items-center select-none relative"
            style={{
              opacity: interpolate(spRes, [0, 1], [0, 1]),
            }}
          >
            {/* Top Display Headlines */}
            <div className="text-center z-10 mb-2">
              <span className="font-mono font-black uppercase text-sky-600 tracking-widest text-[36px]">
                RECALIBRATION PROTOCOL
              </span>
              <h2 className="font-display font-black text-slate-950 tracking-tight text-[64px] uppercase mt-1">
                LOCK THE BEDROCK FLOOR
              </h2>
            </div>

            {/* Semantic Cutout: Assertive Stop Hand Boundary */}
            <div
              className="w-[420px] h-[340px] flex items-center justify-center my-2 relative z-0"
              style={{
                opacity: interpolate(spCutout, [0, 1], [0, 1]),
                transform: `scale(${interpolate(spCutout, [0, 1], [0.85, 1])})`,
              }}
            >
              <Img
                src={staticFile("assets/relationships/setting_boundary_stop_hand.png")}
                className="w-full h-full object-contain drop-shadow-[0_24px_45px_rgba(0,0,0,0.22)]"
              />
            </div>

            {/* In-scene Micro-compromise Rejection */}
            <div className="my-2 z-10">
              <AnimatedSlashStrike
                startFrame={1560}
                color="rose"
                preset="cross_reject"
                strokeWidth={8}
              >
                <div
                  className="bg-rose-50 border-[2.5px] border-rose-900 px-8 py-3 shadow-md"
                  style={{ borderRadius: 18 }}
                >
                  <span className="font-mono text-[36px] font-black text-rose-800 uppercase">
                    MICRO-COMPROMISE
                  </span>
                </div>
              </AnimatedSlashStrike>
            </div>

            {/* Rigid Bedrock Sovereign Floor */}
            {isFloorLocked && (
              <div
                className="w-[920px] my-4 flex flex-col items-center relative z-10"
                style={{
                  transform: `scaleY(${interpolate(spFloor, [0, 1], [0.2, 1])})`,
                  opacity: interpolate(spFloor, [0, 1], [0, 1]),
                }}
              >
                <div className="w-full h-[8px] bg-slate-950 rounded-full shadow-[0_0_24px_rgba(2,132,199,0.45)] relative" />
                <span className="font-mono text-[36px] font-black text-sky-600 uppercase tracking-widest mt-2">
                  NON-NEGOTIABLE FLOOR: LOCKED
                </span>
              </div>
            )}

            {/* Climax Action: Defend Boundary Instantly */}
            <div className="mt-4 text-center z-10">
              <KineticHighlighter
                startFrame={1718}
                color="cyan"
                durationFrames={14}
              >
                <h1 className="font-display font-black text-slate-950 text-[64px] uppercase tracking-tight leading-tight">
                  DEFEND INSTANTLY
                </h1>
              </KineticHighlighter>
            </div>

            {/* Decisive Sovereign Takeaway */}
            {frame >= 1840 && (
              <div
                className="mt-6 flex items-center gap-4 bg-white border-[2.5px] border-slate-900 px-8 py-4 shadow-xl z-10"
                style={{ borderRadius: 18 }}
              >
                <CheckCircle2 className="w-10 h-10 text-sky-600 shrink-0" />
                <span className="font-mono text-[36px] font-black text-slate-950 uppercase tracking-wide">
                  NEURAL FILTER RECALIBRATED
                </span>
              </div>
            )}
          </div>
        );
      })()}
    </MechanismStage>
  );
};


