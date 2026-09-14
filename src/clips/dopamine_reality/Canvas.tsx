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
import { Zap, ShieldAlert, Sparkles, Clock, ArrowRight, CheckCircle2 } from "lucide-react";

interface CanvasProps {
  transcript: WordTimestamp[];
}

/**
 * 🎬 RightMotion Canvas — DopamineReality
 * Topic: "Dopamine: Reality vs Internet Larp"
 *
 * 📐 Platform-Safe Bounds (Rule 5.9):
 *   - Canvas: 1080x1920 @ 60 FPS
 *   - Safe Text Zone: y: 220px to y: 1340px
 *   - Caption Zone:   y: 1380px to y: 1560px (AppleKineticCaptions)
 *   - Max width: 840px centered
 *   - Zero percentage padding for vertical heights!
 *
 * ⏱️ 60 FPS Dynamic Spoken Timestamps:
 *   - Hook Intro:             0ms to 2500ms   (Frames 0 to 150)
 *   - Scene 1 Fuel Tank Myth: 2500ms to 5250ms (Frames 150 to 315)
 *   - Scene 2 Anticipation:   5250ms to 11660ms (Frames 315 to 700)
 *   - Scene 3 Threshold Gap:  11660ms to 20300ms (Frames 700 to 1220)
 *   - Scene 4 Protocol Reset: 20300ms to end     (Frames 1220 to 1952)
 */
export const DopamineRealityCanvas: React.FC<CanvasProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Helper for 60fps frame calculations from ms
  const toFrame = (ms: number) => Math.floor((ms / 1000) * fps);

  // Key frame boundary triggers
  const fHookEnd = toFrame(2500);  // Frame 150
  const fS1End = toFrame(5250);    // Frame 315
  const fS2End = toFrame(11660);   // Frame 700
  const fS3End = toFrame(20300);   // Frame 1220

  const isHookIntro = frame < fHookEnd;
  const isScene1 = frame >= fHookEnd && frame < fS1End;
  const isScene2 = frame >= fS1End && frame < fS2End;
  const isScene3 = frame >= fS2End && frame < fS3End;
  const isScene4 = frame >= fS3End;

  // Scene 1 Myth Timestamps
  const fFictionStrike = toFrame(4280); // Frame 256: "That is pure fiction."

  // Scene 2 Mechanism Timestamps
  const fPleasureSlash = toFrame(5740); // Frame 344: "isn't pleasure"
  const fAnticipation = toFrame(6940);  // Frame 416: "molecule of anticipation"
  const fPoolReadout = toFrame(9240);   // Frame 554: "brain isn't out of dopamine"

  // Scene 3 Threshold Timestamps
  const fNoveltySpike = toFrame(11900); // Frame 714: "artificially raised"
  const fMotivationHold = toFrame(15400); // Frame 924: "didn't lose motivation"
  const fNoveltyGap = toFrame(16880);   // Frame 1013: "ordinary reality cannot compete"

  // Scene 4 Protocol Timestamps
  const fDetoxSlash = toFrame(20460);   // Frame 1228: "Stop extreme 7-day detoxes"
  const fProtocol1 = toFrame(22840);    // Frame 1370: "delay 60 minutes"
  const fProtocol2 = toFrame(26940);    // Frame 1616: "bundle effort before reward"
  const fResetEpiphany = toFrame(28380); // Frame 1703: "Lower the threshold, deep focus returns"

  return (
    <div
      className="absolute inset-x-0 flex flex-col items-center select-none pointer-events-none"
      style={{
        top: 230,
        height: 1100,
        maxWidth: 840,
        left: "50%",
        transform: "translateX(-50%)",
      }}
    >
      {/* ======================================================== */}
      {/* 1. HOOK INTRO (0s - 2.5s / Frames 0 to 150)              */}
      {/* Editorial Card placed above Judy (baseHeight: 1240)      */}
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
            {/* Top Minimal Editorial Badge */}
            <div className="flex items-center gap-3 px-5 py-2 rounded-full bg-slate-900 text-white shadow-md mb-4">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span className="text-xl font-mono font-bold tracking-wider uppercase">
                NEUROSCIENCE VS LARP
              </span>
            </div>

            {/* Editorial Card with Generated Scene Illustration */}
            <div className="w-full rounded-3xl bg-white border-[2.5px] border-slate-900 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.18)] p-4 flex flex-col items-center overflow-hidden">
              <div className="w-full h-[400px] rounded-2xl overflow-hidden relative border border-slate-200">
                <Img
                  src={staticFile("dopamine_reality/assets/scene_illustration.png")}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent flex items-end p-6">
                  <span className="text-white text-3xl font-black tracking-tight leading-none drop-shadow-md">
                    CIRCADIAN PRESENCE VS DIGITAL ENTRAPMENT
                  </span>
                </div>
              </div>

              <div className="w-full pt-4 pb-2 px-2 flex justify-between items-center">
                <span className="text-slate-950 text-2xl font-black tracking-tight">
                  THE FUEL TANK ILLUSION
                </span>
                <span className="text-slate-500 font-mono text-xl font-bold uppercase">
                  POP-PSYCHOLOGY MYTH
                </span>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ======================================================== */}
      {/* 2. SCENE 1: THE FUEL TANK MYTH (Frames 150 to 315)       */}
      {/* Visualizing the false mental model & live fiction strike */}
      {/* ======================================================== */}
      {isScene1 && (() => {
        const spS1 = spring({
          frame: frame - fHookEnd,
          fps,
          config: { damping: 14, mass: 0.7, stiffness: 130 },
        });

        const isFictionFired = frame >= fFictionStrike;

        return (
          <CameraShake triggerFrames={[fFictionStrike]} intensity={14} decayRate={0.82}>
            <div
              className="w-full flex flex-col items-center"
              style={{
                opacity: interpolate(spS1, [0, 1], [0, 1]),
                transform: `scale(${interpolate(spS1, [0, 1], [0.92, 1])})`,
              }}
            >
              {/* Header */}
              <div className="w-full flex flex-col items-center text-center mb-6">
                <span className="text-slate-500 font-mono text-2xl font-bold uppercase tracking-wider">
                  FALSE MENTAL MODEL
                </span>
                <span className="text-6xl font-black text-slate-950 tracking-tight mt-1">
                  THE FUEL TANK MYTH
                </span>
              </div>

              {/* Physical Cutout: Brain Battery Depleted */}
              <div className="relative w-full flex flex-col items-center justify-center my-4">
                <Img
                  src={staticFile("assets/burnout/brain_battery_depleted.png")}
                  className="w-[500px] h-auto object-contain drop-shadow-[0_28px_45px_rgba(0,0,0,0.20)]"
                  style={{
                    transform: isFictionFired ? "scale(0.96) rotate(-2deg)" : "scale(1)",
                    transition: "transform 0.2s ease-out",
                  }}
                />

                {/* Battery Status Label */}
                <div className="mt-4 px-6 py-2 rounded-2xl bg-rose-50 border-[2px] border-rose-300 shadow-sm flex items-center gap-3">
                  <ShieldAlert className="w-6 h-6 text-rose-600" />
                  <span className="text-rose-700 font-mono text-2xl font-bold tracking-tight">
                    INTERNET CLAIM: "DOPAMINE = 0%"
                  </span>
                </div>

                {/* Slashed Stamp when Fiction hits at frame 256 */}
                {isFictionFired && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div
                      className="px-8 py-4 rounded-3xl bg-rose-600 text-white border-4 border-white shadow-[0_25px_50px_rgba(225,29,72,0.5)] transform -rotate-12"
                      style={{
                        animation: "pop-in 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                      }}
                    >
                      <span className="text-6xl font-black tracking-widest uppercase">
                        PURE FICTION
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CameraShake>
        );
      })()}

      {/* ======================================================== */}
      {/* 3. SCENE 2: NEUROCHEMICAL MECHANISM (Frames 315 to 700)   */}
      {/* Anticipation vs Pleasure & Neurotransmitter Pool Readout */}
      {/* ======================================================== */}
      {isScene2 && (() => {
        const spS2 = spring({
          frame: frame - fS1End,
          fps,
          config: { damping: 15, mass: 0.7, stiffness: 130 },
        });

        const showAnticipation = frame >= fAnticipation;
        const showPool = frame >= fPoolReadout;

        return (
          <div
            className="w-full flex flex-col items-center"
            style={{
              opacity: interpolate(spS2, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(spS2, [0, 1], [30, 0])}px)`,
            }}
          >
            {/* Top Category Tag */}
            <div className="flex items-center gap-2 px-5 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 shadow-sm mb-3">
              <Zap className="w-5 h-5 text-emerald-600 fill-emerald-600" />
              <span className="text-xl font-mono font-bold tracking-wider uppercase">
                NEUROCHEMICAL FACT
              </span>
            </div>

            {/* Split Comparison Cards: Pleasure vs Anticipation */}
            <div className="w-full grid grid-cols-2 gap-4 mb-4">
              {/* Card 1: PLEASURE (Rejected) */}
              <div className="relative p-5 rounded-3xl bg-white border-[2.5px] border-slate-900 shadow-lg flex flex-col items-center text-center overflow-hidden">
                <span className="text-slate-400 font-mono text-lg font-bold uppercase mb-1">
                  NOT THIS
                </span>
                <AnimatedSlashStrike
                  startFrame={fPleasureSlash}
                  durationFrames={8}
                  color="rose"
                  strokeWidth={7}
                  preset="blade_slash"
                >
                  <span className="text-4xl font-black text-slate-950 uppercase tracking-tight">
                    PLEASURE
                  </span>
                </AnimatedSlashStrike>
                <span className="text-slate-500 text-lg font-semibold mt-2">
                  (Endorphins / Opioids)
                </span>
              </div>

              {/* Card 2: ANTICIPATION (True Nature) */}
              <div
                className="p-5 rounded-3xl border-[2.5px] shadow-lg flex flex-col items-center text-center transition-all duration-300"
                style={{
                  backgroundColor: showAnticipation ? "#090d16" : "#ffffff",
                  borderColor: showAnticipation ? "#10b981" : "#0f172a",
                  color: showAnticipation ? "#ffffff" : "#090d16",
                  transform: showAnticipation ? "scale(1.04)" : "scale(1)",
                }}
              >
                <span
                  className="font-mono text-lg font-bold uppercase mb-1"
                  style={{ color: showAnticipation ? "#34d399" : "#64748b" }}
                >
                  ACTUAL MOLECULE
                </span>
                <span
                  className="text-4xl font-black uppercase tracking-tight"
                  style={{ color: showAnticipation ? "#ffffff" : "#090d16" }}
                >
                  ANTICIPATION
                </span>
                <span
                  className="text-lg font-semibold mt-2"
                  style={{ color: showAnticipation ? "#94a3b8" : "#64748b" }}
                >
                  (Drive / Pursuit)
                </span>
              </div>
            </div>

            {/* Anchoring 3D Transparent Cutout: Dopamine Head Circuit */}
            <div className="relative w-full flex justify-center my-2">
              <Img
                src={staticFile("assets/psychology/dopamine_head_circuit.png")}
                className="w-[380px] h-auto object-contain drop-shadow-[0_24px_40px_rgba(0,0,0,0.18)]"
              />
            </div>

            {/* Spoken Reveal at 9240ms: Brain isn't out of dopamine */}
            {showPool && (() => {
              const spPool = spring({
                frame: frame - fPoolReadout,
                fps,
                config: { damping: 14, stiffness: 140 },
              });

              return (
                <div
                  className="w-full p-5 rounded-3xl bg-slate-950 text-white border-[2.5px] border-emerald-500 shadow-2xl flex items-center justify-between mt-2"
                  style={{
                    opacity: interpolate(spPool, [0, 1], [0, 1]),
                    transform: `translateY(${interpolate(spPool, [0, 1], [20, 0])}px)`,
                  }}
                >
                  <div className="flex flex-col">
                    <span className="text-emerald-400 font-mono text-xl font-bold uppercase tracking-wider">
                      NEUROTRANSMITTER RESERVES
                    </span>
                    <span className="text-3xl font-black tracking-tight">
                      DOPAMINE IS NOT DEPLETED
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-950/80 border border-emerald-500 text-emerald-300 font-mono font-black text-3xl">
                    100%
                  </div>
                </div>
              );
            })()}
          </div>
        );
      })()}

      {/* ======================================================== */}
      {/* 4. SCENE 3: THE ARTIFICIAL THRESHOLD (Frames 700 to 1220) */}
      {/* Novelty Velocity vs Ordinary Reality & Threshold Gap    */}
      {/* ======================================================== */}
      {isScene3 && (() => {
        const spS3 = spring({
          frame: frame - fS2End,
          fps,
          config: { damping: 15, mass: 0.7, stiffness: 130 },
        });

        const showMotivation = frame >= fMotivationHold;
        const showGap = frame >= fNoveltyGap;

        // Dynamic threshold value rising
        const thresholdRise = interpolate(
          frame,
          [fNoveltySpike, fNoveltySpike + 50],
          [100, 360],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        return (
          <div
            className="w-full flex flex-col items-center"
            style={{
              opacity: interpolate(spS3, [0, 1], [0, 1]),
              transform: `scale(${interpolate(spS3, [0, 1], [0.93, 1])})`,
            }}
          >
            {/* Headline */}
            <div className="w-full text-center mb-4">
              <span className="text-rose-600 font-mono text-2xl font-bold uppercase tracking-wider">
                THE ALGORITHMIC HIJACK
              </span>
              <span className="text-5xl font-black text-slate-950 block mt-1">
                ARTIFICIAL THRESHOLD
              </span>
            </div>

            {/* Threshold Elevation Graphic */}
            <div className="w-full p-6 rounded-3xl bg-white border-[2.5px] border-slate-900 shadow-xl flex flex-col gap-4 mb-4">
              {/* Row 1: High Velocity Novelty Bar */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-black text-rose-600 uppercase flex items-center gap-2">
                    <Zap className="w-6 h-6 fill-rose-600 text-rose-600" />
                    ALGORITHMIC FEED
                  </span>
                  <span className="font-mono text-2xl font-bold text-rose-600">
                    +{Math.round(thresholdRise)}% STIMULATION
                  </span>
                </div>
                <div className="w-full h-8 rounded-full bg-slate-100 border border-slate-300 p-1 overflow-hidden flex">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-rose-500 to-amber-500"
                    style={{
                      width: `${interpolate(thresholdRise, [100, 360], [30, 96])}%`,
                    }}
                  />
                </div>
              </div>

              {/* Threshold Divider Line */}
              <div className="relative w-full flex items-center justify-center my-1">
                <div className="w-full border-t-2 border-dashed border-rose-400" />
                <span className="absolute px-4 py-1 rounded-full bg-rose-600 text-white font-mono text-lg font-bold tracking-wider uppercase">
                  CALIBRATED REWARD THRESHOLD
                </span>
              </div>

              {/* Row 2: Ordinary Reality Bar */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-black text-slate-700 uppercase">
                    ORDINARY REALITY (FOCUS & WORK)
                  </span>
                  <span className="font-mono text-2xl font-bold text-slate-500">
                    100% BASELINE
                  </span>
                </div>
                <div className="w-full h-8 rounded-full bg-slate-100 border border-slate-300 p-1 overflow-hidden flex">
                  <div className="h-full w-[28%] rounded-full bg-slate-400" />
                </div>
              </div>
            </div>

            {/* Middle Section: Phone Overload Cutout + Progressive Insights */}
            <div className="w-full flex items-center justify-between gap-6">
              <Img
                src={staticFile("assets/devices/phone_dopamine_overload.png")}
                className="w-[320px] h-auto object-contain drop-shadow-[0_24px_45px_rgba(0,0,0,0.18)]"
              />

              <div className="flex-1 flex flex-col gap-3">
                <div className="p-4 rounded-2xl bg-slate-900 text-white border-2 border-slate-900 shadow-md">
                  <span className="font-mono text-amber-300 text-lg font-bold uppercase block">
                    {showMotivation ? "PARADOX RESOLVED" : "NEUROLOGICAL TRAP"}
                  </span>
                  <span className="text-2xl font-black block mt-0.5">
                    {showMotivation ? "YOU DIDN'T LOSE MOTIVATION" : "REWARD THRESHOLD ESCALATION"}
                  </span>
                </div>

                {showGap ? (
                  <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-950 shadow-md">
                    <span className="font-mono text-rose-600 text-lg font-bold uppercase block">
                      THE BOTTLENECK
                    </span>
                    <span className="text-2xl font-black leading-tight block mt-0.5">
                      REALITY CANNOT COMPETE WITH INFINITE NOVELTY
                    </span>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-slate-100 border-2 border-slate-300 text-slate-700 shadow-sm">
                    <span className="font-mono text-slate-500 text-lg font-bold uppercase block">
                      INPUT VELOCITY
                    </span>
                    <span className="text-2xl font-black block mt-0.5">
                      400 MILLISECOND NOVELTY LOOPS
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* ======================================================== */}
      {/* 5. SCENE 4: SOVEREIGN RECALIBRATION (Frames 1220 to End)  */}
      {/* 2-Step Protocol, Threshold Reset & Decisive Clarity      */}
      {/* ======================================================== */}
      {isScene4 && (() => {
        const spS4 = spring({
          frame: frame - fS3End,
          fps,
          config: { damping: 15, mass: 0.7, stiffness: 130 },
        });

        const showP1 = frame >= fProtocol1;
        const showP2 = frame >= fProtocol2;
        const showEpiphany = frame >= fResetEpiphany;

        return (
          <div
            className="w-full flex flex-col items-center"
            style={{
              opacity: interpolate(spS4, [0, 1], [0, 1]),
              transform: `scale(${interpolate(spS4, [0, 1], [0.94, 1])})`,
            }}
          >
            {/* Beat 1 (Frames 1220-1370): Rejecting Extreme 7-Day Detox */}
            {!showEpiphany ? (
              <div className="w-full flex flex-col items-center">
                {/* 7-Day Monk Detox Slash */}
                <div className="w-full p-5 rounded-3xl bg-white border-[2.5px] border-slate-900 shadow-lg flex items-center justify-between mb-4">
                  <AnimatedSlashStrike
                    startFrame={fDetoxSlash}
                    durationFrames={8}
                    color="rose"
                    strokeWidth={7}
                    preset="blade_slash"
                  >
                    <span className="text-3xl font-black text-slate-950 uppercase">
                      EXTREME 7-DAY DETOXES
                    </span>
                  </AnimatedSlashStrike>
                  <span className="px-4 py-1.5 rounded-full bg-rose-100 text-rose-700 font-mono text-xl font-bold uppercase">
                    UNREALISTIC
                  </span>
                </div>

                {/* Protocol Header */}
                <div className="text-center mb-3">
                  <span className="text-emerald-600 font-mono text-2xl font-bold uppercase tracking-wider">
                    CALIBRATION ARCHITECTURE
                  </span>
                  <span className="text-5xl font-black text-slate-950 block">
                    THE TWO PROTOCOLS
                  </span>
                </div>

                {/* Protocol 1: 60-Min Delay */}
                {showP1 && (() => {
                  const spP1 = spring({
                    frame: frame - fProtocol1,
                    fps,
                    config: { damping: 14, stiffness: 140 },
                  });

                  return (
                    <div
                      className="w-full p-5 rounded-3xl bg-white border-[2.5px] border-slate-900 shadow-md flex items-center gap-5 mb-4"
                      style={{
                        opacity: interpolate(spP1, [0, 1], [0, 1]),
                        transform: `translateX(${interpolate(spP1, [0, 1], [-25, 0])}px)`,
                      }}
                    >
                      <div className="w-16 h-16 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0">
                        <Clock className="w-9 h-9 text-amber-600" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-amber-600 font-mono text-lg font-bold uppercase">
                          PROTOCOL 01 // FIRST 60 MINUTES
                        </span>
                        <span className="text-3xl font-black text-slate-950 leading-tight">
                          DELAY HIGH-STIMULATION APPS
                        </span>
                      </div>
                    </div>
                  );
                })()}

                {/* Protocol 2: Effort Before Reward */}
                {showP2 && (() => {
                  const spP2 = spring({
                    frame: frame - fProtocol2,
                    fps,
                    config: { damping: 14, stiffness: 140 },
                  });

                  return (
                    <div
                      className="w-full p-5 rounded-3xl bg-white border-[2.5px] border-slate-900 shadow-md flex items-center gap-5"
                      style={{
                        opacity: interpolate(spP2, [0, 1], [0, 1]),
                        transform: `translateX(${interpolate(spP2, [0, 1], [25, 0])}px)`,
                      }}
                    >
                      <div className="w-16 h-16 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center shrink-0">
                        <ArrowRight className="w-9 h-9 text-emerald-600" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-emerald-600 font-mono text-lg font-bold uppercase">
                          PROTOCOL 02 // REWARD SEQUENCING
                        </span>
                        <span className="text-3xl font-black text-slate-950 leading-tight">
                          BUNDLE EFFORT BEFORE REWARD
                        </span>
                      </div>
                    </div>
                  );
                })()}
                {/* Visual Anchor Cutout: Silent Phone Hand */}
                {showP1 && (() => {
                  const spPhone = spring({
                    frame: frame - fProtocol1,
                    fps,
                    config: { damping: 14, stiffness: 130 },
                  });

                  return (
                    <div
                      className="mt-4 flex justify-center"
                      style={{
                        opacity: interpolate(spPhone, [0, 1], [0, 1]),
                        transform: `scale(${interpolate(spPhone, [0, 1], [0.88, 1])})`,
                      }}
                    >
                      <Img
                        src={staticFile("assets/devices/phone_silent_notifications.png")}
                        className="w-[240px] h-auto object-contain drop-shadow-[0_24px_45px_rgba(0,0,0,0.16)]"
                      />
                    </div>
                  );
                })()}
              </div>
            ) : (
              /* Grand Epiphany Release (Frame 1703 to End) */
              <div className="w-full flex flex-col items-center text-center">
                {/* Hero Enlightened Mind Cutout */}
                <div className="relative w-full flex justify-center mb-4">
                  <Img
                    src={staticFile("assets/psychology/enlightened_mind_insight.png")}
                    className="w-[460px] h-auto object-contain drop-shadow-[0_32px_55px_rgba(16,185,129,0.28)]"
                    style={{
                      transform: `scale(${interpolate(
                        frame - fResetEpiphany,
                        [0, 30],
                        [0.85, 1],
                        { extrapolateRight: "clamp" }
                      )})`,
                    }}
                  />
                </div>

                {/* Sovereign Resolution Card */}
                <div className="w-full p-6 rounded-3xl bg-slate-950 text-white border-[2.5px] border-emerald-400 shadow-2xl flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span className="font-mono text-xl font-bold uppercase tracking-wider">
                      THRESHOLD RE-CALIBRATED
                    </span>
                  </div>

                  <span className="text-5xl font-black tracking-tight leading-tight mt-1 text-white">
                    LOWER THE THRESHOLD
                  </span>

                  <span className="text-3xl font-mono font-bold text-emerald-400 uppercase tracking-wide">
                    DEEP FOCUS RETURNS INSTANTLY
                  </span>
                </div>
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
};
