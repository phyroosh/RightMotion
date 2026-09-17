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
import { AnimatedSlashStrike, CameraShake } from "../../components/kinetic_text";
import {
  ThresholdBoundary,
  KineticFurrow,
  MechanismStage,
  CausalActionCoupling,
} from "../../components/primitives";
import { Shield, ArrowDown, AlertTriangle } from "lucide-react";

interface CanvasProps {
  transcript: WordTimestamp[];
}

/**
 * 🎬 RightMotion Bespoke Canvas — WhatYouTolerate (Anti-Cardification Redesign)
 * Topic: "Your Brain Learns What You Repeatedly Tolerate"
 * Channel: Judy Insights (Apple Studio Razor-Sharp Editorial)
 *
 * 📐 Platform-Safe Bounds (Rule 5.9):
 *   - Canvas: 1080x1920 @ 60 FPS
 *   - Safe Text Zone: y: 240px to y: 1340px
 *   - Caption Zone:   y: 1400px to y: 1560px (AppleKineticCaptions)
 *   - Zero percentage padding for vertical layout
 *
 * 🏛️ Frontier Mechanisms Active:
 *   - Scene 1: F7/F4 ThresholdBoundary — Standard Line Viscoelastic Deflection & Ghost Trace
 *   - Scene 2: F7 KineticFurrow — Groove Wear & Low-Resistance Channel Carving
 *   - Scene 3: Open-Stage Dynamic Numerical Threshold Collapse
 *   - Scene 4: Sovereign Boundary Reset with Setting Boundary Hand Cutout
 *
 * 🚫 ZERO CARDS: Open-canvas physical staging. Zero rounded-3xl container walls.
 */
export const WhatYouTolerateCanvas: React.FC<CanvasProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 60 FPS Boundary Triggers
  const fHookEnd = 150; // 2.50s (Judy Intro exits here)
  const fS1End = 390; // 6.50s
  const fS2End = 648; // 10.80s
  const fS3End = 1218; // 20.30s

  const isHookIntro = frame < fHookEnd;
  const isScene1 = frame >= fHookEnd && frame < fS1End;
  const isScene2 = frame >= fS1End && frame < fS2End;
  const isScene3 = frame >= fS2End && frame < fS3End;
  const isScene4 = frame >= fS3End;

  // Scene 1 Micro-beats (from transcript.json):
  const fDisrespect = 160;
  const fPromises = 205;
  const fExcuses = 245;
  const fLogAcceptable = 270;

  // Scene 2 Micro-beats:
  const fNeuroEntry = 395;
  const fMoralitySlash = 460;
  const fFurrowPass1 = 430;
  const fRepetitionSlam = 548;
  const fFurrowPass2 = 550;

  // Scene 3 Micro-beats:
  const fDownwardAdapt = 780;
  const fChaosBaseline = 1060;

  // Scene 4 Micro-beats:
  const fStopWaitSlash = 1250;
  const fDefineStandard = 1380;
  const fRewireEpiphany = 1660;

  return (
    <MechanismStage top={260} bottom={1340}>
      {/* ======================================================== */}
      {/* 1. HOOK INTRO (0s - 2.5s / Frames 0 to 150)              */}
      {/* Bespoke Illustration Card staged alongside Judy           */}
      {/* ======================================================== */}
      {isHookIntro && (() => {
        const spIntro = spring({
          frame,
          fps,
          config: { damping: 14, mass: 0.7, stiffness: 120 },
        });

        return (
          <div
            className="w-full flex flex-col items-center select-none"
            style={{
              opacity: interpolate(spIntro, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(spIntro, [0, 1], [30, 0])}px)`,
            }}
          >
            {/* Top Hook Headline */}
            <div className="w-full text-center px-4">
              <span className="text-slate-500 font-mono text-xl font-bold uppercase tracking-widest">
                NEUROLOGICAL PROTOCOL
              </span>
              <h1 className="text-6xl font-black text-slate-950 tracking-tight leading-tight mt-1">
                YOUR BRAIN LEARNS
              </h1>
            </div>

            {/* Editorial Card framing the bespoke illustration */}
            <div className="w-[840px] rounded-3xl bg-white border-[2.5px] border-slate-900 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.18)] p-6 mt-4 flex flex-col items-center">
              <div className="w-full flex items-center justify-between px-2">
                <span className="text-slate-500 font-mono text-base font-bold uppercase tracking-wider">
                  SYSTEM ARCHITECTURE
                </span>
                <span className="text-rose-600 font-mono text-lg font-bold uppercase tracking-wide">
                  TOLERANCE LOOP
                </span>
              </div>

              <div className="w-full h-[400px] rounded-2xl overflow-hidden relative border border-slate-200 mt-3">
                <Img
                  src={staticFile("what_you_tolerate/assets/scene_illustration.png")}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-x-0 top-0 bg-gradient-to-b from-slate-950/80 via-transparent to-transparent p-5">
                  <span className="text-white text-2xl font-black tracking-tight leading-snug drop-shadow-md">
                    WHAT YOU TOLERATE BECOMES YOUR BASELINE
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ======================================================== */}
      {/* 2. SCENE 1: OPEN-STAGE PHYSICAL BOUNDARY DEFLECTION      */}
      {/* Live ThresholdBoundary sagging under repeated concession */}
      {/* (Anti-Cardification: ZERO CARDS, ZERO PILLS)             */}
      {/* ======================================================== */}
      {isScene1 && (() => {
        const spS1 = spring({
          frame: frame - fHookEnd,
          fps,
          config: { damping: 15, mass: 0.8, stiffness: 130 },
        });

        const showDisrespect = frame >= fDisrespect;
        const showPromises = frame >= fPromises;
        const showExcuses = frame >= fExcuses;
        const isLogged = frame >= fLogAcceptable;

        return (
          <CameraShake
            triggerFrames={[fLogAcceptable]}
            intensity={12}
            className="w-full flex flex-col items-center"
          >
            <div
              className="w-full flex flex-col items-center"
              style={{
                opacity: interpolate(spS1, [0, 1], [0, 1]),
                transform: `translateY(${interpolate(spS1, [0, 1], [20, 0])}px)`,
              }}
            >
              {/* Scene Headline: Large inky typography (no capsule badges) */}
              <div className="w-full text-center mt-2">
                <span className="text-slate-500 font-mono text-xl font-bold uppercase tracking-widest">
                  STAGE 01: SYSTEM RECALIBRATION
                </span>
                <h2 className="text-6xl font-black text-slate-950 tracking-tight mt-1">
                  THE STANDARD DEFLECTS
                </h2>
              </div>

              {/* Dynamic Concession Impulse Markers attached directly above boundary */}
              <div className="w-[880px] flex justify-between items-center px-8 mt-4 h-12">
                <div
                  className="flex items-center gap-2 transition-all"
                  style={{
                    opacity: showDisrespect ? 1 : 0.15,
                    transform: showDisrespect ? "translateY(0)" : "translateY(-8px)",
                  }}
                >
                  <ArrowDown className="w-6 h-6 text-rose-600" />
                  <span className="font-mono text-xl font-black text-slate-900">
                    DISRESPECT
                  </span>
                </div>

                <div
                  className="flex items-center gap-2 transition-all"
                  style={{
                    opacity: showPromises ? 1 : 0.15,
                    transform: showPromises ? "translateY(0)" : "translateY(-8px)",
                  }}
                >
                  <ArrowDown className="w-6 h-6 text-amber-500" />
                  <span className="font-mono text-xl font-black text-slate-900">
                    BROKEN PROMISES
                  </span>
                </div>

                <div
                  className="flex items-center gap-2 transition-all"
                  style={{
                    opacity: showExcuses ? 1 : 0.15,
                    transform: showExcuses ? "translateY(0)" : "translateY(-8px)",
                  }}
                >
                  <ArrowDown className="w-6 h-6 text-slate-500" />
                  <span className="font-mono text-xl font-black text-slate-900">
                    OWN EXCUSES
                  </span>
                </div>
              </div>

              {/* HERO PHYSICAL MECHANISM: ThresholdBoundary */}
              <div className="w-full relative h-[360px] flex items-center justify-center">
                <ThresholdBoundary
                  frame={frame}
                  fps={fps}
                  startX={90}
                  endX={990}
                  initialBaselineY={80}
                  settledBaselineY={240}
                  strokeColor="#090d16"
                  thicknessPx={8}
                  triggerFrame={fLogAcceptable}
                  impulseDurationFrames={45}
                  showGhostTrace={true}
                  ghostOpacity={0.4}
                  label="SOVEREIGN STANDARD"
                  labelColor="#090d16"
                  subLabel="INITIAL BASELINE"
                  showImpulseMarker={true}
                />

                {/* Causal Coupling link between headline demand and boundary deflection */}
                <CausalActionCoupling
                  frame={frame}
                  fps={fps}
                  startX={540}
                  startY={10}
                  endX={540}
                  endY={160}
                  triggerFrame={fLogAcceptable}
                  propagationDurationFrames={20}
                  color="#e11d48"
                  sourceLabel=""
                  targetLabel=""
                  physicalLawLabel=""
                />
              </div>

              {/* Action Consequence Readout: Clean inky mono label (NO card box) */}
              <div className="w-full text-center mt-3">
                <span
                  className="font-mono text-2xl font-black tracking-wider uppercase transition-colors duration-300"
                  style={{
                    color: isLogged ? "#e11d48" : "#64748b",
                  }}
                >
                  {isLogged
                    ? "▼ SILENCE ENCODES THE LOWER BASELINE PERMANENTLY"
                    : "UNCOMPROMISED RIGID STANDARD"}
                </span>
              </div>

              {/* Anchoring 3D Tangled Chaos Cutout (Hero Size) */}
              <div className="w-full flex justify-center items-center mt-2">
                <Img
                  src={staticFile("assets/psychology/tangled_confusion_chaos.png")}
                  className="w-[460px] h-[300px] object-contain drop-shadow-[0_24px_40px_rgba(0,0,0,0.18)]"
                  style={{
                    transform: `translateY(${Math.sin(frame * 0.05) * 6}px)`,
                  }}
                />
              </div>
            </div>
          </CameraShake>
        );
      })()}

      {/* ======================================================== */}
      {/* 3. SCENE 2: OPEN-STAGE KINETIC FURROW & GROOVE WEAR      */}
      {/* KineticFurrow carving habitual pathway across terrain    */}
      {/* (Anti-Cardification: ZERO CARDS, ZERO PILLS)             */}
      {/* ======================================================== */}
      {isScene2 && (() => {
        const spS2 = spring({
          frame: frame - fS1End,
          fps,
          config: { damping: 15, mass: 0.8, stiffness: 130 },
        });

        const showSlash = frame >= fMoralitySlash;
        const showRepetition = frame >= fRepetitionSlam;

        return (
          <div
            className="w-full flex flex-col items-center"
            style={{
              opacity: interpolate(spS2, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(spS2, [0, 1], [20, 0])}px)`,
            }}
          >
            {/* Scene Headline */}
            <div className="w-full text-center mt-2">
              <span className="text-slate-500 font-mono text-xl font-bold uppercase tracking-widest">
                STAGE 02: NEUROPLASTIC REPETITION
              </span>
              <h2 className="text-6xl font-black text-slate-950 tracking-tight mt-1">
                NEUROPLASTICITY
              </h2>
            </div>

            {/* Contradiction: Open blade strike on Moral Judgment (NO card container) */}
            <div className="w-full flex flex-col items-center my-3">
              <span className="font-mono text-lg font-bold text-slate-400 uppercase tracking-wider mb-1">
                THE AUTOMATIC LAW
              </span>
              <div className="relative flex items-center justify-center">
                <AnimatedSlashStrike
                  startFrame={fMoralitySlash}
                  durationFrames={9}
                  preset="blade_slash"
                  color="rose"
                  strokeWidth={9}
                >
                  <span
                    className={`text-5xl font-black tracking-tight transition-colors duration-300 ${
                      showSlash ? "text-slate-400" : "text-slate-950"
                    }`}
                  >
                    MORAL JUDGMENT
                  </span>
                </AnimatedSlashStrike>
              </div>

              {showRepetition && (
                <div className="text-5xl font-black text-rose-600 tracking-tight mt-2 text-center">
                  OPTIMIZES FOR REPETITION
                </div>
              )}
            </div>

            {/* HERO PHYSICAL MECHANISM: KineticFurrow (Pathway Wear & Erosion) */}
            <div className="w-full relative h-[300px] flex items-center justify-center mt-1">
              <KineticFurrow
                frame={frame}
                fps={fps}
                startX={100}
                endX={980}
                y={140}
                initialWidthPx={4}
                carvedWidthPx={16}
                initialColor="#cbd5e1"
                carvedColor="#090d16"
                pass1TriggerFrame={fFurrowPass1}
                pass1DurationFrames={65}
                pass2TriggerFrame={fFurrowPass2}
                pass2DurationFrames={30}
                massSizePx={36}
                massColor="#f43f5e"
                showFrictionStat={true}
                statText="-50% RESISTANCE // ENCODED"
              />
            </div>

            {/* Anchoring 3D Glowing Brain Cutout (Hero Size) */}
            <div className="w-full flex justify-center items-center mt-2">
              <Img
                src={staticFile("assets/psychology/hyperrealistic_3d_glowing_brain.png")}
                className="w-[480px] h-[320px] object-contain drop-shadow-[0_28px_45px_rgba(0,0,0,0.22)]"
                style={{
                  transform: `translateY(${Math.sin(frame * 0.06) * 6}px)`,
                }}
              />
            </div>
          </div>
        );
      })()}

      {/* ======================================================== */}
      {/* 4. SCENE 3: OPEN-STAGE THRESHOLD COLLAPSE (648 to 1218)  */}
      {/* Open deflection scale & live baseline drop (ZERO CARDS)  */}
      {/* ======================================================== */}
      {isScene3 && (() => {
        const spS3 = spring({
          frame: frame - fS2End,
          fps,
          config: { damping: 15, mass: 0.8, stiffness: 130 },
        });

        // Dynamic threshold progress dropping 100% -> 15%
        const thresholdProgress = interpolate(
          frame,
          [fDownwardAdapt, fChaosBaseline],
          [100, 15],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        const isChaos = frame >= fChaosBaseline;

        return (
          <div
            className="w-full flex flex-col items-center"
            style={{
              opacity: interpolate(spS3, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(spS3, [0, 1], [20, 0])}px)`,
            }}
          >
            {/* Header */}
            <div className="w-full text-center mt-2">
              <span className="text-rose-600 font-mono text-xl font-bold uppercase tracking-widest">
                STAGE 03: DOWNWARD ADAPTATION
              </span>
              <h2 className="text-6xl font-black text-slate-950 tracking-tight mt-1">
                THRESHOLD COLLAPSE
              </h2>
            </div>

            {/* Open-Stage Tolerance Readout & Mechanical Gauge Bar (NO CARD BOX) */}
            <div className="w-[880px] flex flex-col gap-3 my-6">
              <div className="w-full flex items-center justify-between">
                <span className="font-mono text-3xl font-black text-slate-900">
                  TOLERANCE THRESHOLD
                </span>
                <span
                  className="font-mono text-5xl font-black transition-colors"
                  style={{
                    color: thresholdProgress < 30 ? "#e11d48" : "#090d16",
                  }}
                >
                  {Math.round(thresholdProgress)}%
                </span>
              </div>

              {/* High-Contrast Mechanical Track */}
              <div className="w-full h-8 rounded-full bg-slate-200 border-2 border-slate-900 p-1 relative overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-100"
                  style={{
                    width: `${thresholdProgress}%`,
                    backgroundColor:
                      thresholdProgress < 30
                        ? "#e11d48"
                        : thresholdProgress < 60
                        ? "#f59e0b"
                        : "#10b981",
                  }}
                />
              </div>

              {/* Dynamic Consequence Callout */}
              <div className="w-full text-center mt-2">
                <span
                  className="font-mono text-2xl font-black tracking-wider uppercase transition-colors"
                  style={{
                    color: isChaos ? "#e11d48" : "#475569",
                  }}
                >
                  {isChaos
                    ? "CHAOS IS NOW THE NEW NORMAL"
                    : "ACTIVE NERVOUS SYSTEM REJECTION"}
                </span>
              </div>
            </div>

            {/* Anchoring 3D Ripple Mind Cutout (Hero Size) */}
            <div className="w-full flex justify-center items-center mt-4">
              <Img
                src={staticFile("assets/burnout/overwhelmed_mind_ripples.png")}
                className="w-[500px] h-[340px] object-contain drop-shadow-[0_24px_40px_rgba(0,0,0,0.20)]"
                style={{
                  transform: `translateY(${Math.sin(frame * 0.05) * 5}px)`,
                }}
              />
            </div>
          </div>
        );
      })()}

      {/* ======================================================== */}
      {/* 5. SCENE 4: THE SOVEREIGN RESET & BOUNDARY (1218 to end) */}
      {/* Stop Hand Cutout + Clean Decisive Standard (ZERO CARDS)  */}
      {/* ======================================================== */}
      {isScene4 && (() => {
        const spS4 = spring({
          frame: frame - fS3End,
          fps,
          config: { damping: 15, mass: 0.8, stiffness: 130 },
        });

        const showStopWait = frame < fDefineStandard;
        const showBoundaryHand = frame >= fDefineStandard && frame < fRewireEpiphany;
        const showEpiphany = frame >= fRewireEpiphany;

        return (
          <div
            className="w-full flex flex-col items-center"
            style={{
              opacity: interpolate(spS4, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(spS4, [0, 1], [20, 0])}px)`,
            }}
          >
            {/* Protocol Header */}
            <div className="w-full text-center mt-2">
              <span className="text-emerald-600 font-mono text-xl font-bold uppercase tracking-widest">
                THE REVERSAL PROTOCOL
              </span>
              <h2 className="text-6xl font-black text-slate-950 tracking-tight mt-1">
                DRAW THE BOUNDARY
              </h2>
            </div>

            {/* Sub-step 1: Slicing Motivation Myth (open blade) */}
            {showStopWait && (
              <div className="w-full flex flex-col items-center my-6">
                <span className="font-mono text-lg font-bold text-slate-400 uppercase tracking-wider mb-2">
                  FATAL HESITATION
                </span>
                <div className="relative my-2">
                  <AnimatedSlashStrike
                    startFrame={fStopWaitSlash}
                    durationFrames={8}
                    preset="blade_slash"
                    color="rose"
                    strokeWidth={8}
                  >
                    <span className="text-5xl font-black tracking-tight text-slate-950">
                      WAITING FOR MOTIVATION
                    </span>
                  </AnimatedSlashStrike>
                </div>
                <span className="font-mono text-2xl font-bold text-rose-600 mt-2">
                  ACTION PRECEDES THE DESIRE
                </span>
              </div>
            )}

            {/* Sub-step 2 & 3: Sovereign Standard Announcement */}
            {(showBoundaryHand || showEpiphany) && (
              <div className="w-full flex flex-col items-center text-center my-4">
                <div className="flex items-center gap-2 text-emerald-600 font-mono text-xl font-bold uppercase mb-2">
                  <Shield className="w-6 h-6 text-emerald-600" />
                  RULE 01: NON-NEGOTIABLE
                </div>
                <div className="text-6xl font-black tracking-tight text-slate-950">
                  DEFINE ONE STANDARD
                </div>
                <p className="text-2xl font-mono font-bold text-slate-600 mt-2">
                  PUSH BACK AT THE VERY FIRST BOUNDARY CROSSING
                </p>
              </div>
            )}

            {/* Anchoring Setting Boundary Stop Hand Cutout (Hero Size) */}
            <div className="w-full flex justify-center items-center mt-4">
              <Img
                src={staticFile("assets/relationships/setting_boundary_stop_hand.png")}
                className="w-[520px] h-[360px] object-contain drop-shadow-[0_28px_45px_rgba(0,0,0,0.22)]"
                style={{
                  transform: `translateY(${Math.sin(frame * 0.05) * 5}px)`,
                }}
              />
            </div>
          </div>
        );
      })()}
    </MechanismStage>
  );
};
