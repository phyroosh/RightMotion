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
  ShieldAlert,
  Sparkles,
  AlertTriangle,
  Brain,
  Shield,
  ArrowDown,
  CheckCircle2,
  Lock,
  Zap,
} from "lucide-react";

interface CanvasProps {
  transcript: WordTimestamp[];
}

/**
 * 🎬 RightMotion Bespoke Canvas — WhatYouTolerate
 * Topic: "Your Brain Learns What You Repeatedly Tolerate"
 * Channel: Judy Insights (Apple Studio Razor-Sharp Editorial)
 *
 * 📐 Platform-Safe Bounds (Rule 5.9):
 *   - Canvas: 1080x1920 @ 60 FPS
 *   - Safe Text Zone: y: 240px to y: 1340px
 *   - Caption Zone:   y: 1400px to y: 1560px (AppleKineticCaptions)
 *   - Max width: 840px centered
 *   - Zero percentage padding for vertical layout
 *
 * ⏱️ 60 FPS Dynamic Speech-Synchronized Timestamps:
 *   - Hook Intro:          0ms to 2500ms    (Frames 0 to 150)
 *   - Scene 1 Accumulation: 2500ms to 6500ms (Frames 150 to 390)
 *   - Scene 2 Neuroplasticity: 6500ms to 10800ms (Frames 390 to 648)
 *   - Scene 3 Downward Drift: 10800ms to 20300ms (Frames 648 to 1218)
 *   - Scene 4 Protocol & Rewire: 20300ms to end   (Frames 1218 to 1818)
 */
export const WhatYouTolerateCanvas: React.FC<CanvasProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 60 FPS Boundary Triggers
  const fHookEnd = 150;     // 2.50s (Judy Intro exits here)
  const fS1End = 390;       // 6.50s
  const fS2End = 648;       // 10.80s
  const fS3End = 1218;      // 20.30s

  const isHookIntro = frame < fHookEnd;
  const isScene1 = frame >= fHookEnd && frame < fS1End;
  const isScene2 = frame >= fS1End && frame < fS2End;
  const isScene3 = frame >= fS2End && frame < fS3End;
  const isScene4 = frame >= fS3End;

  // Scene 1 Micro-beats:
  const fCard1 = 150;
  const fCard2 = 190;
  const fCard3 = 230;
  const fLogAcceptable = 270;

  // Scene 2 Micro-beats:
  const fNeuroEntry = 395;
  const fMoralitySlash = 460;
  const fRepetitionSlam = 548;

  // Scene 3 Micro-beats:
  const fDownwardAdapt = 800;
  const fThresholdDrop = 922;
  const fAnxietyNumb = 995;
  const fChaosBaseline = 1072;

  // Scene 4 Micro-beats:
  const fStopWaitSlash = 1250;
  const fDefineStandard = 1381;
  const fPushBack = 1525;
  const fRewireEpiphany = 1669;

  return (
    <div
      className="absolute inset-x-0 flex flex-col items-center select-none pointer-events-none"
      style={{
        top: 240,
        height: 1100,
        maxWidth: 840,
        left: "50%",
        transform: "translateX(-50%)",
      }}
    >
      {/* ======================================================== */}
      {/* 1. HOOK INTRO (0s - 2.5s / Frames 0 to 150)              */}
      {/* Bespoke Illustration Card staged alongside Judy           */}
      {/* ======================================================== */}
      {isHookIntro && (() => {
        const spHook = spring({
          frame,
          fps,
          config: { damping: 16, mass: 0.8, stiffness: 140 },
        });

        return (
          <div
            className="w-full flex flex-col items-center"
            style={{
              opacity: interpolate(spHook, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(spHook, [0, 1], [25, 0])}px) scale(${interpolate(spHook, [0, 1], [0.94, 1])})`,
            }}
          >
            {/* Minimal Editorial Category Badge */}
            <div className="flex items-center gap-3 px-6 py-2 rounded-full bg-slate-900 text-white shadow-md mb-3">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span className="text-xl font-mono font-bold tracking-wider uppercase">
                NEUROLOGICAL BASELINE
              </span>
            </div>

            {/* Editorial Card with Generated Bespoke Illustration */}
            <div className="w-full rounded-3xl bg-white border-[2.5px] border-slate-900 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.18)] p-5 flex flex-col items-center overflow-hidden">
              <div className="w-full pb-3 px-2 flex justify-between items-center border-b border-slate-100">
                <span className="text-slate-950 text-2xl font-black tracking-tight">
                  THE SILENT COMPROMISE
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
      {/* 2. SCENE 1: THE ACCUMULATION (Frames 150 to 390)         */}
      {/* 3 stacked micro-reveals + live "PERMITTED" stamp impact  */}
      {/* ======================================================== */}
      {isScene1 && (() => {
        const spS1 = spring({
          frame: frame - fHookEnd,
          fps,
          config: { damping: 15, mass: 0.8, stiffness: 130 },
        });

        const showCard1 = frame >= fCard1;
        const showCard2 = frame >= fCard2;
        const showCard3 = frame >= fCard3;
        const isLogged = frame >= fLogAcceptable;

        const spLog = spring({
          frame: Math.max(0, frame - fLogAcceptable),
          fps,
          config: { damping: 12, mass: 0.6, stiffness: 200 },
        });

        return (
          <CameraShake
            triggerFrames={[fLogAcceptable]}
            intensity={12}
            className="w-full flex flex-col items-center"
          >
            <div
              className="w-full flex flex-col items-center gap-4"
              style={{
                opacity: interpolate(spS1, [0, 1], [0, 1]),
                transform: `translateY(${interpolate(spS1, [0, 1], [20, 0])}px)`,
              }}
            >
              {/* Scene Headline */}
              <div className="w-full text-center">
                <span className="text-slate-500 font-mono text-xl font-bold uppercase tracking-widest">
                  STAGE 01: THE ACCUMULATION
                </span>
                <h2 className="text-5xl font-black text-slate-950 tracking-tight mt-1">
                  WHAT YOUR BRAIN SEES
                </h2>
              </div>

              {/* 3 Sequential Compromise Cards */}
              <div className="w-full flex flex-col gap-3 mt-1">
                {/* Item 1: Disrespect */}
                {showCard1 && (
                  <div className="w-full px-6 py-4 rounded-2xl bg-white border-[2.5px] border-slate-900 shadow-md flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full bg-rose-500" />
                      <span className="text-3xl font-black text-slate-900 tracking-tight">
                        DISRESPECT
                      </span>
                    </div>
                    <span className="text-xl font-mono font-bold text-rose-600 bg-rose-50 px-3.5 py-1 rounded-lg border border-rose-200">
                      TOLERATED
                    </span>
                  </div>
                )}

                {/* Item 2: Broken Promises */}
                {showCard2 && (
                  <div className="w-full px-6 py-4 rounded-2xl bg-white border-[2.5px] border-slate-900 shadow-md flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full bg-amber-500" />
                      <span className="text-3xl font-black text-slate-900 tracking-tight">
                        BROKEN PROMISES
                      </span>
                    </div>
                    <span className="text-xl font-mono font-bold text-amber-700 bg-amber-50 px-3.5 py-1 rounded-lg border border-amber-200">
                      ACCEPTED
                    </span>
                  </div>
                )}

                {/* Item 3: Your Own Excuses */}
                {showCard3 && (
                  <div className="w-full px-6 py-4 rounded-2xl bg-white border-[2.5px] border-slate-900 shadow-md flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full bg-slate-400" />
                      <span className="text-3xl font-black text-slate-900 tracking-tight">
                        YOUR OWN EXCUSES
                      </span>
                    </div>
                    <span className="text-xl font-mono font-bold text-slate-600 bg-slate-100 px-3.5 py-1 rounded-lg border border-slate-300">
                      NORMALIZED
                    </span>
                  </div>
                )}
              </div>

              {/* Physical Cutout & Live System Log Mutation */}
              {isLogged ? (
                <div
                  className="w-full rounded-3xl bg-slate-950 text-white border-[2.5px] border-slate-900 p-6 flex flex-col items-center shadow-2xl relative overflow-hidden mt-2"
                  style={{
                    transform: `scale(${interpolate(spLog, [0, 1], [0.88, 1])})`,
                    opacity: interpolate(spLog, [0, 1], [0, 1]),
                  }}
                >
                  <div className="absolute top-0 right-0 w-40 h-40 bg-rose-500/20 blur-3xl rounded-full pointer-events-none" />
                  
                  <div className="w-full flex items-center justify-between mb-2">
                    <span className="text-lg font-mono text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      SYSTEM LOGGED
                    </span>
                    <span className="text-sm font-mono text-slate-400">STATUS: ACTIVE</span>
                  </div>

                  <div className="text-4xl font-black tracking-tight text-white text-center">
                    LOGGED AS ACCEPTABLE
                  </div>

                  <p className="text-xl font-sans text-slate-300 mt-2 text-center max-w-[660px]">
                    Silence trains your neurology that this treatment is your default standard.
                  </p>
                </div>
              ) : (
                /* Semantic Physical Cutout representing inner tangle */
                <div className="w-full flex justify-center items-center mt-3">
                  <Img
                    src={staticFile("assets/psychology/tangled_confusion_chaos.png")}
                    className="w-[480px] h-[340px] object-contain drop-shadow-[0_28px_45px_rgba(0,0,0,0.22)]"
                  />
                </div>
              )}
            </div>
          </CameraShake>
        );
      })()}

      {/* ======================================================== */}
      {/* 3. SCENE 2: NEUROPLASTICITY & REPETITION (Frames 390-648)*/}
      {/* Live animated slash on morality + slam on repetition     */}
      {/* ======================================================== */}
      {isScene2 && (() => {
        const spS2 = spring({
          frame: frame - fS1End,
          fps,
          config: { damping: 15, mass: 0.8, stiffness: 130 },
        });

        const showSlash = frame >= fMoralitySlash;
        const showRepetition = frame >= fRepetitionSlam;

        const spRep = spring({
          frame: Math.max(0, frame - fRepetitionSlam),
          fps,
          config: { damping: 12, mass: 0.6, stiffness: 170 },
        });

        return (
          <div
            className="w-full flex flex-col items-center gap-4"
            style={{
              opacity: interpolate(spS2, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(spS2, [0, 1], [20, 0])}px)`,
            }}
          >
            {/* Headline */}
            <div className="w-full text-center">
              <span className="text-slate-500 font-mono text-xl font-bold uppercase tracking-widest">
                NEUROLOGICAL MECHANISM
              </span>
              <h2 className="text-6xl font-black text-slate-950 tracking-tight mt-1">
                NEUROPLASTICITY
              </h2>
            </div>

            {/* Contradiction Block: Does NOT Judge Morality */}
            <div className="w-full rounded-3xl bg-white border-[2.5px] border-slate-900 shadow-[0_18px_36px_-12px_rgba(0,0,0,0.14)] p-6 flex flex-col items-center">
              <span className="text-lg font-mono text-slate-400 font-bold uppercase tracking-wider mb-2">
                ASSUMPTION VS REALITY
              </span>

              <div className="relative flex items-center justify-center my-2">
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

              <span className="text-xl font-mono text-rose-600 font-bold mt-2">
                {showSlash ? "✕ DOES NOT DISTINGUISH GOOD FROM BAD" : "ASSUMED FILTER"}
              </span>
            </div>

            {/* Payoff Block: Optimizes for Repetition */}
            {showRepetition && (
              <div
                className="w-full rounded-3xl bg-slate-950 text-white border-[2.5px] border-slate-900 shadow-2xl p-6 flex flex-col items-center relative overflow-hidden"
                style={{
                  transform: `scale(${interpolate(spRep, [0, 1], [0.92, 1])})`,
                  opacity: interpolate(spRep, [0, 1], [0, 1]),
                }}
              >
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-amber-400/20 blur-3xl rounded-full pointer-events-none" />

                <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 font-mono text-base font-bold uppercase mb-2">
                  <Brain className="w-4 h-4 text-amber-300" />
                  THE ONLY RULE IT FOLLOWS
                </div>

                <div className="text-5xl font-black tracking-tight text-amber-300 text-center">
                  OPTIMIZES FOR REPETITION
                </div>

                <p className="text-xl text-slate-300 mt-2 text-center">
                  Whatever is repeated is reinforced. What is tolerated is encoded.
                </p>
              </div>
            )}

            {/* Anchoring 3D Glowing Brain Cutout (Hero Size) */}
            <div className="w-full flex justify-center items-center mt-1">
              <Img
                src={staticFile("assets/psychology/hyperrealistic_3d_glowing_brain.png")}
                className="w-[480px] h-[340px] object-contain drop-shadow-[0_28px_45px_rgba(0,0,0,0.22)]"
                style={{
                  transform: `translateY(${Math.sin(frame * 0.06) * 6}px)`,
                }}
              />
            </div>
          </div>
        );
      })()}

      {/* ======================================================== */}
      {/* 4. SCENE 3: THE DOWNWARD THRESHOLD COLLAPSE (648-1218)   */}
      {/* Downward threshold slider + numbing alert + chaos baseline*/}
      {/* ======================================================== */}
      {isScene3 && (() => {
        const spS3 = spring({
          frame: frame - fS2End,
          fps,
          config: { damping: 15, mass: 0.8, stiffness: 130 },
        });

        // Dynamic threshold value dropping over time
        const thresholdProgress = interpolate(
          frame,
          [fDownwardAdapt, fChaosBaseline],
          [100, 15],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        const isNumbed = frame >= fAnxietyNumb;
        const isChaos = frame >= fChaosBaseline;

        return (
          <div
            className="w-full flex flex-col items-center gap-4"
            style={{
              opacity: interpolate(spS3, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(spS3, [0, 1], [20, 0])}px)`,
            }}
          >
            {/* Header */}
            <div className="w-full text-center">
              <span className="text-rose-600 font-mono text-xl font-bold uppercase tracking-widest">
                THE DOWNWARD ADAPTATION
              </span>
              <h2 className="text-5xl font-black text-slate-950 tracking-tight mt-1">
                THRESHOLD COLLAPSE
              </h2>
            </div>

            {/* Dynamic Interactive Gauge Card */}
            <div className="w-full rounded-3xl bg-white border-[2.5px] border-slate-900 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.16)] p-6 flex flex-col gap-4">
              <div className="w-full flex items-center justify-between">
                <span className="text-2xl font-mono font-bold text-slate-700">
                  TOLERANCE THRESHOLD
                </span>
                <span
                  className={`text-4xl font-mono font-black ${
                    thresholdProgress < 30 ? "text-rose-600" : "text-slate-950"
                  }`}
                >
                  {Math.round(thresholdProgress)}%
                </span>
              </div>

              {/* Descending Progress Track */}
              <div className="w-full h-9 rounded-full bg-slate-100 border-2 border-slate-900 p-1 relative overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-100 ${
                    thresholdProgress < 30
                      ? "bg-rose-500"
                      : thresholdProgress < 60
                      ? "bg-amber-500"
                      : "bg-emerald-500"
                  }`}
                  style={{ width: `${thresholdProgress}%` }}
                />
              </div>

              {/* Status Indicators */}
              <div className="w-full grid grid-cols-2 gap-3 mt-1">
                <div
                  className={`p-3.5 rounded-xl border flex flex-col items-center text-center transition-colors ${
                    isNumbed
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-slate-50 text-slate-600 border-slate-200"
                  }`}
                >
                  <span className="text-xs font-mono font-bold uppercase">ALARM SYSTEM</span>
                  <span className="text-2xl font-black mt-1">
                    {isNumbed ? "NUMBED" : "ALERTING"}
                  </span>
                </div>

                <div
                  className={`p-3.5 rounded-xl border flex flex-col items-center text-center transition-colors ${
                    isChaos
                      ? "bg-rose-600 text-white border-rose-700 shadow-md"
                      : "bg-slate-50 text-slate-600 border-slate-200"
                  }`}
                >
                  <span className="text-xs font-mono font-bold uppercase">NEW STANDARD</span>
                  <span className="text-2xl font-black mt-1">
                    {isChaos ? "CHAOS ACCEPTED" : "REJECTING"}
                  </span>
                </div>
              </div>
            </div>

            {/* Impact Banner or Cutout (Hero Size) */}
            {isChaos ? (
              <div className="w-full rounded-3xl bg-slate-950 text-white border-[2.5px] border-slate-900 p-6 flex items-center justify-between shadow-xl mt-1">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center">
                    <AlertTriangle className="w-8 h-8 text-rose-400" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-mono text-rose-400 font-bold uppercase">
                      BASELINE DRIFT
                    </span>
                    <span className="text-3xl font-black tracking-tight">
                      CHAOS IS THE NEW NORMAL
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full flex justify-center items-center mt-2">
                <Img
                  src={staticFile("assets/burnout/overwhelmed_mind_ripples.png")}
                  className="w-[460px] h-[340px] object-contain drop-shadow-[0_24px_40px_rgba(0,0,0,0.20)]"
                  style={{
                    transform: `translateY(${Math.sin(frame * 0.05) * 5}px)`,
                  }}
                />
              </div>
            )}
          </div>
        );
      })()}

      {/* ======================================================== */}
      {/* 5. SCENE 4: THE PROTOCOL & REWIRING (1218 to end)        */}
      {/* Slash on motivation + Setting Boundary Hand + Self-worth */}
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

        const spEpiphany = spring({
          frame: Math.max(0, frame - fRewireEpiphany),
          fps,
          config: { damping: 12, mass: 0.6, stiffness: 160 },
        });

        return (
          <div
            className="w-full flex flex-col items-center gap-4"
            style={{
              opacity: interpolate(spS4, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(spS4, [0, 1], [20, 0])}px)`,
            }}
          >
            {/* Pre-Epiphany Stage: The Protocol */}
            {!showEpiphany && (
              <>
                <div className="w-full text-center">
                  <span className="text-emerald-600 font-mono text-xl font-bold uppercase tracking-widest">
                    THE REVERSAL PROTOCOL
                  </span>
                  <h2 className="text-5xl font-black text-slate-950 tracking-tight mt-1">
                    DRAW THE BOUNDARY
                  </h2>
                </div>

                {/* Sub-step 1: Slicing Motivation Myth */}
                {showStopWait && (
                  <div className="w-full rounded-3xl bg-white border-[2.5px] border-slate-900 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.16)] p-6 flex flex-col items-center text-center">
                    <span className="text-base font-mono text-slate-400 font-bold uppercase tracking-wider mb-2">
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
                        <span className="text-4xl font-black tracking-tight text-slate-950">
                          WAITING FOR MOTIVATION
                        </span>
                      </AnimatedSlashStrike>
                    </div>
                    <span className="text-xl font-mono text-rose-600 font-bold mt-2">
                      ACTION PRECEDES THE DESIRE
                    </span>
                  </div>
                )}

                {/* Sub-step 2: Define 1 Non-Negotiable Standard & Physical Hand Cutout (Hero Size) */}
                {showBoundaryHand && (
                  <div className="w-full flex flex-col items-center gap-3">
                    <div className="w-full rounded-3xl bg-slate-950 text-white border-[2.5px] border-slate-900 shadow-2xl p-6 flex flex-col items-center text-center">
                      <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-base font-bold uppercase mb-2">
                        <Shield className="w-4 h-4 text-emerald-300" />
                        RULE 01: NON-NEGOTIABLE
                      </div>
                      <div className="text-4xl font-black tracking-tight text-white">
                        DEFINE ONE STANDARD TODAY
                      </div>
                      <p className="text-lg text-slate-300 mt-2">
                        Draw a hard line against the single biggest drain on your peace.
                      </p>
                    </div>

                    {/* Transparent Semantic Cutout: Setting Boundary Stop Hand (Hero 520px) */}
                    <div className="w-full flex justify-center items-center">
                      <Img
                        src={staticFile("assets/relationships/setting_boundary_stop_hand.png")}
                        className="w-[500px] h-[380px] object-contain drop-shadow-[0_28px_45px_rgba(0,0,0,0.22)]"
                        style={{
                          transform: `translateY(${Math.sin(frame * 0.05) * 5}px)`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Final Sovereign Epiphany */}
            {showEpiphany && (
              <div
                className="w-full flex flex-col items-center gap-4"
                style={{
                  transform: `scale(${interpolate(spEpiphany, [0, 1], [0.9, 1])})`,
                  opacity: interpolate(spEpiphany, [0, 1], [0, 1]),
                }}
              >
                {/* Epiphany Card */}
                <div className="w-full rounded-3xl bg-slate-950 text-white border-[2.5px] border-slate-900 shadow-2xl p-7 flex flex-col items-center text-center relative overflow-hidden">
                  <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/20 blur-3xl rounded-full pointer-events-none" />

                  <div className="flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-base font-bold uppercase mb-3">
                    <Zap className="w-5 h-5 text-emerald-300" />
                    THE NEUROLOGICAL SHIFT
                  </div>

                  <h1 className="text-5xl font-black tracking-tight text-white leading-tight">
                    REWIRED SELF-WORTH
                  </h1>

                  <div className="w-full h-0.5 bg-slate-800 my-4" />

                  <p className="text-2xl font-black tracking-tight text-emerald-400 uppercase leading-snug">
                    WHAT YOU REFUSE TO TOLERATE DEFINES WHO YOU BECOME.
                  </p>
                </div>

                {/* Final Anchor: Enlightened Mind Insight Cutout (Hero 500px) */}
                <div className="w-full flex justify-center items-center">
                  <Img
                    src={staticFile("assets/psychology/enlightened_mind_insight.png")}
                    className="w-[480px] h-[380px] object-contain drop-shadow-[0_30px_48px_rgba(0,0,0,0.24)]"
                    style={{
                      transform: `translateY(${Math.sin(frame * 0.06) * 6}px)`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
};
