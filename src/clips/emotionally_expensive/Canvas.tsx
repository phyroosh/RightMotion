import React from "react";
import {
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { WordTimestamp } from "../../types";
import {
  AnimatedSlashStrike,
  KineticHighlighter,
  CameraShake,
} from "../../components/kinetic_text";
import { MechanismStage } from "../../components/primitives/MechanismStage";
import { ThresholdBoundary } from "../../components/primitives/ThresholdBoundary";
import { CausalActionCoupling } from "../../components/primitives/CausalActionCoupling";
import {
  KineticFulcrumBeam,
  BeamLoad,
} from "../../components/physics/consequence/KineticFulcrumBeam";
import { SemanticMassNode } from "../../components/physics/consequence/SemanticMassNode";
import { CinematicIllustrationCard } from "../../components/CinematicIllustrationCard";
import { WorldCameraBreathHold } from "../../components/temporal/WorldCameraBreathHold";

interface CanvasProps {
  transcript: WordTimestamp[];
}

/**
 * 🎬 EmotionallyExpensiveCanvas
 * Topic: "You Say Tomorrow Because Today Feels Emotionally Expensive"
 * Niche: Judy Insights (Self Improvement) — #f8fafc light studio canvas.
 *
 * Visual Strategy:
 * 1. Hook (0-5.8s): Bespoke Hero Illustration Card + Waist-Up Judy (Frames 0-150),
 *    transitioning into the massive "EMOTIONALLY EXPENSIVE" core paradox.
 * 2. Mechanism (5.8-16.8s): Open-canvas Dopamine Reservoir Balance & Live Mutation.
 *    The word "LAZINESS" is slashed in real time, revealing "EMOTIONAL TAX AVOIDANCE".
 * 3. Escalation & Protocol (16.8-25.6s): F6 Dramatic Breath Hold freeze, followed by
 *    ThresholdBoundary deflection and the 90-Second Micro-Exposure Tactical Reticle.
 * 4. Resolution (25.6-28.6s): Perceived threat drops to zero, and the 3D Glowing Brain
 *    erupts with unstoppable kinetic momentum.
 */
export const EmotionallyExpensiveCanvas: React.FC<CanvasProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Helper to map audio milliseconds to exact frame indices
  const toFrame = (ms: number) => Math.round((ms / 1000) * fps);

  // Exact spoken audio landmark frames (from transcript.json)
  const tDiscipline = toFrame(1500); // "discipline" arrives
  const tJudyExit = Math.round(fps * 2.5); // Mandatory ~2.5s intimate intro
  const tStarting = toFrame(3040); // "starting"
  const tExpensive = toFrame(4540); // "emotionally expensive"
  const tNeuro = toFrame(5800); // "Neuroscience reveals"
  const tWithdrawal = toFrame(8940); // "unexpected financial withdrawals"
  const tDopamine = toFrame(10960); // "dopamine reserves"
  const tLaziness = toFrame(13540); // "laziness"
  const tSlash = toFrame(13900); // Live blade strike on laziness
  const tTax = toFrame(15460); // "tax avoidance strategy"
  const tDelay = toFrame(16800); // "You delay the work"
  const tOverwhelm = toFrame(19260); // "cognitive overwhelm"
  const tLower = toFrame(20700); // "Lower the activation fee"
  const tNinety = toFrame(22500); // "ninety seconds"
  const tThreat = toFrame(25640); // "perceived threat drops"
  const tMomentum = toFrame(26800); // "momentum takes over"

  // Scene partitioning
  const isHook = frame < tNeuro;
  const isMechanism = frame >= tNeuro && frame < tDelay;
  const isEscalation = frame >= tDelay && frame < tThreat;
  const isResolution = frame >= tThreat;

  // F6 Dramatic Breath Hold Window: Micro-freeze right at "cognitive overwhelm"
  const isBreathHold = frame >= tOverwhelm && frame < tOverwhelm + 22;
  const breathFreezeScale = isBreathHold ? 0.99 : 1.0;

  // Camera trauma impacts
  const impactTriggerFrames = [tDiscipline, tWithdrawal, tSlash, tLower, tMomentum];

  // =========================================================================
  // SCENE 2 KINETIC FULCRUM LOADS
  // =========================================================================
  const fulcrumLoads: BeamLoad[] = [
    {
      id: "dopamine_reserve",
      arm: "left",
      mass: 1.2,
      distance: 220,
      landFrame: tNeuro,
      label: "DOPAMINE RESERVE",
    },
    {
      id: "unexpected_withdrawal",
      arm: "right",
      mass: 3.4,
      distance: 260,
      landFrame: tWithdrawal,
      label: "WITHDRAWAL",
    },
  ];

  // Liquid dopamine reserve percentage (drops under withdrawal load)
  const dopamineLevel = interpolate(
    frame,
    [tWithdrawal, tWithdrawal + 28],
    [84, 18],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.2, 0.8, 0.2, 1) }
  );

  // 90-Second Countdown progress
  const countdownProgress = interpolate(
    frame,
    [tNinety, tThreat],
    [90, 81],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <CameraShake triggerFrames={impactTriggerFrames} intensity={12}>
      <MechanismStage top={280} bottom={1340} className="font-sans">
        {/* ================================================================= */}
        {/* 1. HOOK SCENE (0.0s - 5.8s / Frames 0 to ~348)                   */}
        {/* ================================================================= */}
        {isHook && (
          <div className="relative w-full h-full flex flex-col items-center justify-between py-6">
            {/* Phase 1A: Opening 2.5s — Editorial Hero Illustration Card + Headline */}
            {frame < tJudyExit ? (
              <div className="w-full flex flex-col items-center gap-6">
                {/* Top Question Headline */}
                <div className="text-center px-4">
                  <span className="font-mono text-3xl font-bold uppercase tracking-widest text-slate-500 block mb-1">
                    THE PROCRASTINATION PARADOX
                  </span>
                  <div className="relative inline-block">
                    {frame >= tDiscipline ? (
                      <AnimatedSlashStrike
                        startFrame={tDiscipline}
                        preset="blade_slash"
                        color="rose"
                        strokeWidth={10}
                        angle={-14}
                        enableImpactShake={true}
                      >
                        <h1 className="font-sans font-black text-7xl text-slate-950 tracking-tight uppercase">
                          LACK OF DISCIPLINE.
                        </h1>
                      </AnimatedSlashStrike>
                    ) : (
                      <h1 className="font-sans font-black text-7xl text-slate-950 tracking-tight uppercase">
                        LACK OF DISCIPLINE.
                      </h1>
                    )}
                  </div>
                </div>

                {/* Bespoke AI Hero Illustration inside Editorial Frame */}
                <div className="w-[720px] h-[420px] max-w-full -translate-x-12 mt-1">
                  <CinematicIllustrationCard
                    imageSrc="emotionally_expensive/assets/scene_illustration.png"
                    entranceFrame={0}
                    accentColor="rose"
                  />
                </div>
              </div>
            ) : (
              /* Phase 1B: 2.5s - 5.8s — Deep Inky Kinetic Reveal of Real Cause */
              <div className="w-full flex flex-col items-center justify-center my-auto text-center px-6">
                <span className="font-mono text-3xl font-bold uppercase tracking-widest text-slate-500 mb-4">
                  STARTING RIGHT NOW
                </span>
                <h1 className="font-sans font-black text-8xl text-slate-950 leading-tight tracking-tight uppercase mb-6 max-w-[840px]">
                  FEELS{" "}
                  <span className="text-rose-600 drop-shadow-sm">
                    EMOTIONALLY
                  </span>{" "}
                  EXPENSIVE.
                </h1>

                {/* Surcharge Barometer Graphic */}
                <div className="w-[760px] p-6 bg-slate-100/90 border-[3px] border-slate-900 rounded-none shadow-[0_20px_40px_rgba(0,0,0,0.08)] flex flex-col gap-3">
                  <div className="flex justify-between items-center font-mono text-2xl font-bold text-slate-700">
                    <span>INITIATION COST:</span>
                    <span className="text-rose-600 font-black">CRITICAL SURCHARGE</span>
                  </div>
                  <div className="w-full h-8 bg-slate-200 border-2 border-slate-900 overflow-hidden relative">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-rose-600 transition-all"
                      style={{
                        width: `${interpolate(frame, [tStarting, tExpensive], [25, 96], {
                          extrapolateLeft: "clamp",
                          extrapolateRight: "clamp",
                        })}%`,
                      }}
                    />
                  </div>
                  <span className="font-mono text-xl text-slate-500 text-left">
                    // PERCEIVED NEURAL THREAT LEVEL: MAXIMUM
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* 2. MECHANISM SCENE (5.8s - 16.8s / Frames ~348 to ~1008)          */}
        {/* ================================================================= */}
        {isMechanism && (
          <div className="relative w-full h-full flex flex-col items-center justify-between py-4">
            {/* Top Kinetic Diagnostic */}
            <div className="text-center">
              <span className="font-mono text-2xl font-bold uppercase tracking-widest text-sky-600 block mb-1">
                NEUROCHEMICAL ACCOUNTING // MECHANISM
              </span>
              <h2 className="font-sans font-black text-6xl text-slate-950 tracking-tight uppercase">
                {frame < tLaziness ? "THE DOPAMINE WITHDRAWAL" : "PROCRASTINATION IS NOT"}
              </h2>
            </div>

            {/* Central Physical Action */}
            {frame < tLaziness ? (
              <div className="relative w-full flex flex-col items-center justify-center my-auto">
                {/* Semantic Cutout: Dopamine Head Circuit */}
                <div className="relative w-[440px] h-[360px] flex items-center justify-center mb-6">
                  <Img
                    src={staticFile("assets/psychology/dopamine_head_circuit.png")}
                    alt="Dopamine Circuit"
                    className="w-full h-full object-contain drop-shadow-[0_24px_36px_rgba(0,0,0,0.14)]"
                  />
                  {/* Dynamic Electrical Sparks indicator */}
                  <div className="absolute bottom-2 font-mono text-2xl font-bold bg-slate-900 text-sky-300 px-4 py-1.5 border border-sky-400/40">
                    RESERVE: {Math.round(dopamineLevel)}%
                  </div>
                </div>

                {/* Frontier #4 Closed-Form Fulcrum Balance Beam */}
                <div className="w-[780px] my-2">
                  <KineticFulcrumBeam
                    width={780}
                    height={16}
                    fulcrumRatio={0.5}
                    maxAngleDeg={14}
                    loads={fulcrumLoads}
                  />
                </div>

                <div className="flex justify-between w-[740px] font-mono text-xl font-bold text-slate-500 mt-3">
                  <span>LEFT: DOPAMINE RESERVES</span>
                  <span className={frame >= tWithdrawal ? "text-rose-600 font-black" : "text-slate-500"}>
                    RIGHT: TASK WITHDRAWAL
                  </span>
                </div>
              </div>
            ) : (
              /* Live Mutation: Slashing "LAZINESS" & Epiphany */
              <div className="w-full flex flex-col items-center justify-center my-auto text-center px-4">
                {/* Crossed Out Word */}
                <div className="relative inline-block mb-8">
                  {frame >= tSlash ? (
                    <AnimatedSlashStrike
                      startFrame={tSlash}
                      preset="blade_slash"
                      color="rose"
                      strokeWidth={14}
                      angle={-14}
                      enableImpactShake={true}
                    >
                      <span className="font-sans font-black text-9xl text-slate-950 tracking-tight uppercase">
                        LAZINESS.
                      </span>
                    </AnimatedSlashStrike>
                  ) : (
                    <span className="font-sans font-black text-9xl text-slate-950 tracking-tight uppercase">
                      LAZINESS.
                    </span>
                  )}
                </div>

                {/* Real Diagnostic Reveal */}
                <div
                  className="flex flex-col items-center transition-all"
                  style={{
                    opacity: interpolate(frame, [tTax - 10, tTax], [0, 1], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    }),
                    transform: `scale(${spring({
                      frame: Math.max(0, frame - tTax),
                      fps,
                      config: { damping: 14, stiffness: 140, mass: 0.8 },
                    })})`,
                  }}
                >
                  <span className="font-mono text-3xl font-bold uppercase tracking-widest text-slate-500 mb-2">
                    IT IS AN EMOTIONAL
                  </span>
                  <div className="relative inline-block px-3 py-1">
                    <KineticHighlighter startFrame={tTax} color="yellow">
                      <h2 className="font-sans font-black text-7xl text-slate-950 tracking-tight uppercase">
                        TAX AVOIDANCE STRATEGY.
                      </h2>
                    </KineticHighlighter>
                  </div>
                  <span className="font-mono text-2xl font-bold text-slate-600 mt-4 max-w-[680px]">
                    // Nervous system delaying work to prevent cognitive deficit.
                  </span>
                </div>
              </div>
            )}

            {/* Bottom Status Readout */}
            <div className="w-full text-center">
              <span className="font-mono text-xl font-bold text-slate-400">
                [RIGHTMOTION BIOLOGICAL PROTOCOL // SOLVER ACTIVE]
              </span>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* 3. ESCALATION & PROTOCOL SCENE (16.8s - 25.6s / Frames ~1008-1538)*/}
        {/* ================================================================= */}
        {isEscalation && (
          <WorldCameraBreathHold startFrame={tOverwhelm} durationFrames={22}>
            <div className="relative w-full h-full flex flex-col items-center justify-between py-4">
              {/* Top Protocol Header */}
              <div className="text-center">
                <span className="font-mono text-2xl font-bold uppercase tracking-widest text-emerald-600 block mb-1">
                  TACTICAL PROTOCOL // STEP 01
                </span>
                <h2 className="font-sans font-black text-7xl text-slate-950 tracking-tight uppercase">
                  {frame < tLower ? "PROTECTING THE NERVOUS SYSTEM" : "LOWER THE ACTIVATION FEE."}
                </h2>
              </div>

              {/* Live Physical Mechanism: Frontier #7 Threshold Boundary Deflection */}
              <div className="relative w-full h-[620px] flex items-center justify-center my-auto">
                <ThresholdBoundary
                  frame={frame}
                  fps={fps}
                  startX={100}
                  endX={860}
                  initialBaselineY={70}
                  settledBaselineY={220}
                  strokeColor="#090d16"
                  thicknessPx={6}
                  triggerFrame={tLower}
                  label="ACTIVATION THRESHOLD"
                  labelColor="#64748b"
                  subLabel="REDUCED ACTIVATION FEE (90s)"
                  showGhostTrace={true}
                  ghostOpacity={0.35}
                />

                {/* Causal Coupling vector from lowered boundary down to timer */}
                {frame >= tLower && (
                  <CausalActionCoupling
                    frame={frame}
                    fps={fps}
                    startX={540}
                    startY={220}
                    endX={540}
                    endY={310}
                    triggerFrame={tLower + 12}
                    propagationDurationFrames={15}
                    impactDurationFrames={20}
                    color="#0284c7"
                    sourceLabel="FEE CUT"
                    targetLabel="MICRO-ACTION"
                    thicknessPx={4}
                  />
                )}

                {/* Tactical Crosshair / 90-Second Focus Ring */}
                <div className="absolute top-[280px] flex flex-col items-center justify-center">
                  <div className="relative w-[300px] h-[300px] flex items-center justify-center">
                    <Img
                      src={staticFile("assets/habits/target_focus_crosshair.png")}
                      alt="Focus Crosshair"
                      className="w-full h-full object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.12)]"
                    />
                    {/* Central 90s Counter */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="font-mono font-black text-7xl text-slate-950">
                        {Math.round(countdownProgress)}s
                      </span>
                      <span className="font-mono text-xl font-bold uppercase tracking-widest text-sky-600 mt-1">
                        EXPOSURE
                      </span>
                    </div>
                  </div>

                  <div className="font-mono text-2xl font-bold bg-slate-950 text-white px-6 py-2 mt-4 tracking-wider">
                    TOUCH TASK FOR 90 SECONDS ONLY
                  </div>
                </div>
              </div>

              {/* Bottom Insight */}
              <div className="text-center font-mono text-xl text-slate-500">
                // Once perceived threat drops, kinetic friction collapses to zero.
              </div>
            </div>
          </WorldCameraBreathHold>
        )}

        {/* ================================================================= */}
        {/* 4. RESOLUTION SCENE (25.6s - 28.6s / Frames ~1538 to 1718)        */}
        {/* ================================================================= */}
        {isResolution && (
          <div className="relative w-full h-full flex flex-col items-center justify-start py-4">
            {/* Top Sovereign Takeaway */}
            <div className="text-center">
              <span className="font-mono text-2xl font-bold uppercase tracking-widest text-slate-500 block mb-1">
                PERCEIVED THREAT: 0% // KINETIC BREAKTHROUGH
              </span>
              <h1 className="font-sans font-black text-8xl text-slate-950 tracking-tight uppercase leading-none">
                MOMENTUM
              </h1>
              <h1 className="font-sans font-black text-8xl text-emerald-600 tracking-tight uppercase leading-tight mb-2">
                TAKES OVER.
              </h1>
              {/* Sovereign Principle Header Tag */}
              <div className="inline-block bg-slate-950 text-white px-6 py-2 shadow-md">
                <span className="font-mono text-xl font-bold tracking-wider uppercase">
                  ACTION PRECEDES NEUROCHEMICAL MOTIVATION
                </span>
              </div>
            </div>

            {/* Central Anchor: 3D Glowing Brain Semantic Cutout */}
            <div className="relative w-[480px] h-[480px] flex items-center justify-center my-auto">
              {/* Radial expanding shockwave waves */}
              <div
                className="absolute inset-0 rounded-full border-4 border-emerald-500/40 pointer-events-none"
                style={{
                  transform: `scale(${interpolate(
                    frame - tMomentum,
                    [0, 45],
                    [0.6, 1.4],
                    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                  )})`,
                  opacity: interpolate(
                    frame - tMomentum,
                    [0, 45],
                    [0.8, 0],
                    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                  ),
                }}
              />
              <Img
                src={staticFile("assets/psychology/hyperrealistic_3d_glowing_brain.png")}
                alt="Glowing Brain"
                className="w-full h-full object-contain drop-shadow-[0_30px_50px_rgba(16,185,129,0.25)]"
                style={{
                  transform: `scale(${spring({
                    frame: Math.max(0, frame - tMomentum),
                    fps,
                    config: { damping: 13, stiffness: 130, mass: 0.7 },
                  })})`,
                }}
              />
            </div>
          </div>
        )}
      </MechanismStage>
    </CameraShake>
  );
};
