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
import { AnimatedSlashStrike } from "../../components/kinetic_text";
import { Sun, Moon, Zap, CheckCircle2 } from "lucide-react";

interface CanvasProps {
  transcript: WordTimestamp[];
}

/**
 * 🎬 RightMotion Canvas — HowCortisolWorks
 * Topic: "How cortisol actually works"
 *
 * 📐 Platform-Safe Bounds (Rule 5.9):
 *   - Canvas: 1080x1920 @ 60 FPS
 *   - Safe Text Zone: y: 220px to y: 1340px
 *   - Caption Zone:   y: 1380px to y: 1560px (AppleKineticCaptions)
 *   - Max width: 820px centered in px-8 (clears right engagement rail x: 910-1080px)
 *   - Zero percentage padding for vertical heights!
 *
 * ⏱️ 60 FPS Dynamic Spoken Timestamps:
 *   - Hook Intro:         0ms to 2500ms   (Frames 0 to 150)
 *   - Scene 1 Awakening:  2500ms to 5940ms (Frames 150 to 356)
 *   - Scene 2 Conductor:  5940ms to 14200ms (Frames 356 to 852)
 *   - Scene 3 The Leak:   14200ms to 23000ms (Frames 852 to 1380)
 *   - Scene 4 Protocol:   23000ms to end   (Frames 1380 to 1953)
 */
export const HowCortisolWorksCanvas: React.FC<CanvasProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Helper for 60fps frame calculations from ms
  const toFrame = (ms: number) => Math.floor((ms / 1000) * fps);

  // Scene triggers
  const fHookEnd = toFrame(2500); // frame 150
  const fS1End = toFrame(5940);   // frame 356
  const fS2End = toFrame(14200);  // frame 852
  const fS3End = toFrame(23000);  // frame 1380

  const isHookIntro = frame < fHookEnd;
  const isScene1Awakening = frame >= fHookEnd && frame < fS1End;
  const isScene2 = frame >= fS1End && frame < fS2End;
  const isScene3 = frame >= fS2End && frame < fS3End;
  const isScene4 = frame >= fS3End;

  // Scene 2 Progressive Timestamps
  const fRow1 = toFrame(10000); // "mobilizes glucose" (~600)
  const fRow2 = toFrame(11460); // "sharpens alertness" (~688)
  const fRow3 = toFrame(12580); // "regulates blood pressure" (~755)

  // Scene 3 In-Scene Mutation Timestamps
  const fSlashSpike = toFrame(14950); // "isn't the spike" (~897)
  const fLeakSlam = toFrame(16120);   // "It's the leak" (~967)
  const fReceptorDrop = toFrame(18460); // "receptors desensitize" (~1108)
  const fDopamineCrash = toFrame(21000); // "crushing dopamine" (~1260)
  const fSleepBreak = toFrame(22080);   // "wrecking sleep" (~1325)

  // Scene 4 Protocol Timestamps
  const fStep1 = toFrame(25500); // "morning sunlight within 20 min" (~1530)
  const fStep2 = toFrame(28440); // "delay caffeine 90 min" (~1706)
  const fSeal = toFrame(30400);  // "natural peak does its job" (~1824)

  return (
    <div
      className="absolute inset-x-0 flex flex-col items-center select-none pointer-events-none"
      style={{
        top: 240,
        height: 1080,
        maxWidth: 820,
        left: "50%",
        transform: "translateX(-50%)",
      }}
    >
      {/* ======================================================== */}
      {/* 1. HOOK INTRO (0s - 2.5s / Frames 0 to 150)              */}
      {/* Editorial Card placed above Judy (baseHeight: 1160)      */}
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
            {/* Editorial Card sized to fit cleanly above Judy */}
            <div className="w-[740px] bg-white rounded-[28px] border-[2.5px] border-slate-900 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.18)] overflow-hidden flex flex-col">
              {/* Header Bar */}
              <div className="px-6 py-2.5 bg-[#090d16] text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-lg font-mono font-bold tracking-wider text-amber-300 uppercase">
                    BIOLOGICAL PARADOX
                  </span>
                </div>
                <span className="text-base font-mono text-slate-400 font-bold uppercase tracking-widest">
                  AM PULSE
                </span>
              </div>

              {/* Bespoke AI Illustration with soft Ken Burns pan */}
              <div className="relative w-full h-[260px] overflow-hidden bg-slate-100">
                <Img
                  src={staticFile("how_cortisol_works/assets/scene_illustration.png")}
                  className="w-full h-full object-cover"
                  style={{
                    transform: `scale(${interpolate(frame, [0, fHookEnd], [1.0, 1.05])})`,
                  }}
                  alt="Awakening Illustration"
                />
              </div>

              {/* Card Footer Callout */}
              <div className="px-6 py-3 bg-slate-50 border-t-2 border-slate-200 flex items-center justify-between">
                <span className="text-xl font-black text-[#090d16] uppercase tracking-tight">
                  THE COMMON MYTH:
                </span>
                <span className="px-3 py-1 rounded-xl bg-rose-100 border-2 border-rose-500 text-lg font-mono font-black text-rose-700 uppercase">
                  "TOXIC HORMONE"
                </span>
              </div>
            </div>

            {/* Sub-pill on spoken "toxic stress hormone" (~f76 at 60fps) */}
            {frame >= 76 && (() => {
              const spMyth = spring({
                frame: frame - 76,
                fps,
                config: { damping: 13, stiffness: 180 },
              });
              return (
                <div
                  className="mt-3 px-6 py-2.5 rounded-2xl bg-[#090d16] border-[2.5px] border-slate-900 shadow-xl flex items-center gap-3"
                  style={{
                    opacity: interpolate(spMyth, [0, 1], [0, 1]),
                    transform: `scale(${interpolate(spMyth, [0, 1], [0.85, 1])})`,
                  }}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                  <span className="text-xl font-black text-white uppercase tracking-wider">
                    RETHINK THE ASSUMPTION
                  </span>
                </div>
              );
            })()}
          </div>
        );
      })()}

      {/* ======================================================== */}
      {/* 2. SCENE 1 AWAKENING: WITHOUT IT (Frames 150 to 356)     */}
      {/* "Without it, you literally couldn't wake up"             */}
      {/* ======================================================== */}
      {isScene1Awakening && (() => {
        const rel = frame - fHookEnd;
        const spEnter = spring({
          frame: rel,
          fps,
          config: { damping: 15, mass: 0.85, stiffness: 150 },
        });

        return (
          <div
            className="w-full flex flex-col items-center gap-6"
            style={{
              opacity: interpolate(spEnter, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(spEnter, [0, 1], [35, 0])}px) scale(${interpolate(spEnter, [0, 1], [0.95, 1])})`,
            }}
          >
            {/* Top Paradox Card */}
            <div className="w-full p-6 rounded-3xl bg-white border-[2.5px] border-slate-900 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.16)] flex flex-col items-center text-center gap-2">
              <span className="text-xl font-mono font-bold text-slate-500 uppercase tracking-widest">
                CIRCADIAN AWAKENING RESPONSE (CAR)
              </span>
              <div className="flex items-center gap-3">
                <span className="text-4xl font-black text-[#090d16] uppercase">
                  WITHOUT CORTISOL:
                </span>
                <span className="px-3.5 py-1 rounded-xl bg-rose-600 text-white font-mono font-black text-2xl uppercase border-2 border-slate-900">
                  CRITICAL FAIL
                </span>
              </div>
              <span className="text-5xl font-black text-rose-600 uppercase tracking-tight">
                CANNOT WAKE UP
              </span>
            </div>

            {/* Semantic Cutout: 3D Glowing Neural Brain */}
            <div className="relative flex items-center justify-center my-2">
              <div
                className="absolute w-[440px] h-[440px] rounded-full blur-[70px] pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle, rgba(245, 158, 11, 0.28) 0%, rgba(244, 63, 94, 0.12) 60%, transparent 80%)",
                }}
              />
              <img
                src={staticFile("assets/psychology/hyperrealistic_3d_glowing_brain.png")}
                alt="Neural Brain Cutout"
                className="w-[440px] h-auto object-contain drop-shadow-[0_28px_45px_rgba(0,0,0,0.22)]"
                style={{
                  transform: `scale(${1 + Math.sin(rel * 0.08) * 0.02})`,
                }}
              />
            </div>

            {/* Live Biological Clock Status */}
            <div className="w-full p-5 rounded-2xl bg-[#090d16] border-[2.5px] border-slate-900 shadow-xl flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <Sun className="w-7 h-7 text-amber-400" />
                <span className="text-2xl font-black uppercase">
                  07:30 AM SURGE
                </span>
              </div>
              <span className="text-2xl font-mono font-black text-amber-300">
                +50% CORTISOL REQUIRED
              </span>
            </div>
          </div>
        );
      })()}

      {/* ======================================================== */}
      {/* 3. SCENE 2: BIOLOGICAL STEERING WHEEL (Frames 356 to 852) */}
      {/* "Energy steering wheel... glucose, alertness, pressure"   */}
      {/* ======================================================== */}
      {isScene2 && (() => {
        const rel = frame - fS1End;
        const spEnter = spring({
          frame: rel,
          fps,
          config: { damping: 15, mass: 0.85, stiffness: 150 },
        });

        return (
          <div
            className="w-full flex flex-col items-center gap-5"
            style={{
              opacity: interpolate(spEnter, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(spEnter, [0, 1], [30, 0])}px) scale(${interpolate(spEnter, [0, 1], [0.95, 1])})`,
            }}
          >
            {/* Top Conductor Banner */}
            <div className="w-full p-6 rounded-3xl bg-[#090d16] border-[2.5px] border-slate-900 shadow-2xl flex flex-col gap-1 text-white">
              <div className="flex items-center justify-between">
                <span className="text-xl font-mono font-bold text-amber-400 uppercase tracking-widest">
                  NOT YOUR ENEMY
                </span>
                <span className="px-3 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 font-mono font-bold text-sm uppercase border border-emerald-500/40">
                  ESSENTIAL SURVIVAL
                </span>
              </div>
              <span className="text-5xl font-black uppercase tracking-tight text-white leading-none">
                ENERGY STEERING WHEEL
              </span>
            </div>

            {/* 3 Progressive Micro-Choreography Command Rows */}
            <div className="w-full flex flex-col gap-4">
              {/* Row 1: Spoken "mobilizes glucose" (f >= fRow1) */}
              {frame >= fRow1 && (() => {
                const sp1 = spring({
                  frame: frame - fRow1,
                  fps,
                  config: { damping: 14, stiffness: 160 },
                });
                return (
                  <div
                    className="w-full p-5 rounded-2xl bg-white border-[2.5px] border-slate-900 shadow-[0_16px_32px_-8px_rgba(0,0,0,0.12)] flex items-center justify-between"
                    style={{
                      opacity: interpolate(sp1, [0, 1], [0, 1]),
                      transform: `translateX(${interpolate(sp1, [0, 1], [-25, 0])}px) scale(${interpolate(sp1, [0, 1], [0.94, 1])})`,
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-3.5 h-3.5 rounded-full bg-amber-500" />
                      <span className="text-3xl font-black text-[#090d16] uppercase">
                        01 // MOBILIZES GLUCOSE
                      </span>
                    </div>
                    <span className="px-4 py-1 rounded-xl bg-amber-300 text-slate-950 font-mono font-black text-xl uppercase border-2 border-slate-900">
                      CELLULAR FUEL
                    </span>
                  </div>
                );
              })()}

              {/* Row 2: Spoken "sharpens alertness" (f >= fRow2) */}
              {frame >= fRow2 && (() => {
                const sp2 = spring({
                  frame: frame - fRow2,
                  fps,
                  config: { damping: 14, stiffness: 160 },
                });
                return (
                  <div
                    className="w-full p-5 rounded-2xl bg-white border-[2.5px] border-slate-900 shadow-[0_16px_32px_-8px_rgba(0,0,0,0.12)] flex items-center justify-between"
                    style={{
                      opacity: interpolate(sp2, [0, 1], [0, 1]),
                      transform: `translateX(${interpolate(sp2, [0, 1], [25, 0])}px) scale(${interpolate(sp2, [0, 1], [0.94, 1])})`,
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-3.5 h-3.5 rounded-full bg-sky-500" />
                      <span className="text-3xl font-black text-[#090d16] uppercase">
                        02 // SHARPENS ALERTNESS
                      </span>
                    </div>
                    <span className="px-4 py-1 rounded-xl bg-sky-300 text-slate-950 font-mono font-black text-xl uppercase border-2 border-slate-900">
                      NEURAL FOCUS
                    </span>
                  </div>
                );
              })()}

              {/* Row 3: Spoken "regulates blood pressure" (f >= fRow3) */}
              {frame >= fRow3 && (() => {
                const sp3 = spring({
                  frame: frame - fRow3,
                  fps,
                  config: { damping: 14, stiffness: 160 },
                });
                return (
                  <div
                    className="w-full p-5 rounded-2xl bg-white border-[2.5px] border-slate-900 shadow-[0_16px_32px_-8px_rgba(0,0,0,0.12)] flex items-center justify-between"
                    style={{
                      opacity: interpolate(sp3, [0, 1], [0, 1]),
                      transform: `translateX(${interpolate(sp3, [0, 1], [-25, 0])}px) scale(${interpolate(sp3, [0, 1], [0.94, 1])})`,
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-3.5 h-3.5 rounded-full bg-emerald-500" />
                      <span className="text-3xl font-black text-[#090d16] uppercase">
                        03 // REGULATES PRESSURE
                      </span>
                    </div>
                    <span className="px-4 py-1 rounded-xl bg-emerald-300 text-slate-950 font-mono font-black text-xl uppercase border-2 border-slate-900">
                      VASCULAR DRIVE
                    </span>
                  </div>
                );
              })()}
            </div>

            {/* Semantic Cutout: Neurotransmitter Molecule Head */}
            <div className="relative flex items-center justify-center mt-2">
              <img
                src={staticFile("assets/psychology/neurotransmitter_molecule_head.png")}
                alt="Neurotransmitter Molecule Cutout"
                className="w-[360px] h-auto object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.18)]"
              />
            </div>
          </div>
        );
      })()}

      {/* ======================================================== */}
      {/* 4. SCENE 3: THE SPIKE VS THE LEAK (Frames 852 to 1380)   */}
      {/* In-scene mutation: Real-time blade slash on "SPIKE"      */}
      {/* Desensitization cascade & Dramatic Breath Hold           */}
      {/* ======================================================== */}
      {isScene3 && (() => {
        const rel = frame - fS2End;
        const spEnter = spring({
          frame: rel,
          fps,
          config: { damping: 15, mass: 0.85, stiffness: 150 },
        });

        return (
          <div
            className="w-full flex flex-col items-center gap-5"
            style={{
              opacity: interpolate(spEnter, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(spEnter, [0, 1], [25, 0])}px)`,
            }}
          >
            {/* Top Diagnostic Title */}
            <div className="w-full flex items-center justify-between px-2">
              <span className="text-2xl font-mono font-black text-slate-700 uppercase tracking-widest">
                THE ROOT CAUSE OF DAMAGE
              </span>
              <span className="text-lg font-mono font-bold text-rose-600 uppercase">
                CRITICAL MISCONCEPTION
              </span>
            </div>

            {/* Card 1: Spoken contradiction with Live Action Slash */}
            <div className="w-full p-6 rounded-3xl bg-white border-[2.5px] border-slate-900 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.14)] flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-lg font-mono font-bold text-slate-500 uppercase tracking-wider">
                  SUSPECT 01
                </span>
                <AnimatedSlashStrike
                  startFrame={fSlashSpike}
                  durationFrames={12}
                  preset="blade_slash"
                  color="rose"
                  strokeWidth={8}
                >
                  <span className="text-5xl font-black text-[#090d16] uppercase tracking-tight">
                    THE MORNING SPIKE
                  </span>
                </AnimatedSlashStrike>
              </div>

              {frame >= fSlashSpike + 6 && (
                <span className="px-3.5 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 font-mono font-black text-lg uppercase border-2 border-emerald-500">
                  NOT THE CAUSE
                </span>
              )}
            </div>

            {/* Card 2: Spoken "It's the leak" (frame >= fLeakSlam) */}
            {frame >= fLeakSlam && (() => {
              const spLeak = spring({
                frame: frame - fLeakSlam,
                fps,
                config: { damping: 13, mass: 0.9, stiffness: 180 },
              });

              return (
                <div
                  className="w-full p-6 rounded-3xl bg-[#090d16] border-[3px] border-rose-600 shadow-[0_25px_50px_rgba(225,29,72,0.28)] flex flex-col gap-2 text-white"
                  style={{
                    opacity: interpolate(spLeak, [0, 1], [0, 1]),
                    transform: `scale(${interpolate(spLeak, [0, 1], [0.9, 1])}) translateY(${interpolate(spLeak, [0, 1], [18, 0])}px)`,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-mono font-black text-rose-400 uppercase tracking-widest">
                      THE REAL THREAT
                    </span>
                    <span className="px-3 py-1 rounded-xl bg-rose-600 text-white font-mono font-bold text-sm uppercase">
                      ALL-DAY ACTIVE
                    </span>
                  </div>
                  <span className="text-5xl font-black text-white uppercase tracking-tight leading-none">
                    THE CHRONIC LEAK
                  </span>
                </div>
              );
            })()}

            {/* Cascade Breakdown: Receptor Desensitization (f >= fReceptorDrop) */}
            {frame >= fReceptorDrop && (
              <div className="w-full flex flex-col gap-3">
                <div className="w-full p-4 rounded-2xl bg-slate-100 border-[2px] border-slate-900 flex items-center justify-between">
                  <span className="text-2xl font-black text-[#090d16] uppercase">
                    CORTISOL RECEPTORS:
                  </span>
                  <span className="px-3.5 py-1 rounded-xl bg-slate-900 text-amber-400 font-mono font-black text-lg uppercase">
                    DESENSITIZED
                  </span>
                </div>

                {/* Crashes Dopamine (f >= fDopamineCrash) */}
                {frame >= fDopamineCrash && (
                  <div className="w-full p-4 rounded-2xl bg-rose-50 border-[2.5px] border-rose-600 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="w-6 h-6 text-rose-600" />
                      <span className="text-2xl font-black text-rose-950 uppercase">
                        DOPAMINE TRANSMISSION
                      </span>
                    </div>
                    <span className="px-3.5 py-1 rounded-xl bg-rose-600 text-white font-mono font-black text-xl uppercase">
                      CRUSHED (-70%)
                    </span>
                  </div>
                )}

                {/* Wrecks Sleep (f >= fSleepBreak) */}
                {frame >= fSleepBreak && (
                  <div className="w-full p-4 rounded-2xl bg-slate-900 border-[2.5px] border-slate-950 flex items-center justify-between text-white">
                    <div className="flex items-center gap-2">
                      <Moon className="w-6 h-6 text-sky-400" />
                      <span className="text-2xl font-black uppercase">
                        SLEEP ARCHITECTURE
                      </span>
                    </div>
                    <span className="px-3.5 py-1 rounded-xl bg-slate-800 text-rose-400 font-mono font-black text-xl uppercase">
                      DESTROYED
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Semantic Cutout: Burnout Empty Battery Head */}
            <div className="relative flex items-center justify-center mt-1">
              <img
                src={staticFile("assets/burnout/head_battery_empty.png")}
                alt="Head Battery Depleted Cutout"
                className="w-[360px] h-auto object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.22)]"
              />
            </div>
          </div>
        );
      })()}

      {/* ======================================================== */}
      {/* 5. SCENE 4: ANCHOR THE RHYTHM PROTOCOL (Frames 1380+)    */}
      {/* Solution: Morning Sunlight (20m) & Delay Caffeine (90m)  */}
      {/* ======================================================== */}
      {isScene4 && (() => {
        const rel = frame - fS3End;
        const spEnter = spring({
          frame: rel,
          fps,
          config: { damping: 15, mass: 0.85, stiffness: 150 },
        });

        return (
          <div
            className="w-full flex flex-col items-center gap-5"
            style={{
              opacity: interpolate(spEnter, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(spEnter, [0, 1], [25, 0])}px) scale(${interpolate(spEnter, [0, 1], [0.95, 1])})`,
            }}
          >
            {/* Top Epiphany Protocol Header */}
            <div className="w-full p-6 rounded-3xl bg-[#090d16] border-[2.5px] border-emerald-500 shadow-2xl flex flex-col gap-1 text-white">
              <div className="flex items-center justify-between">
                <span className="text-xl font-mono font-bold text-emerald-400 uppercase tracking-widest">
                  DON'T SUPPRESS CORTISOL
                </span>
                <span className="px-3 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 font-mono font-bold text-sm uppercase border border-emerald-500/40">
                  EVIDENCE-BASED
                </span>
              </div>
              <span className="text-5xl font-black uppercase tracking-tight text-white leading-none">
                ANCHOR ITS RHYTHM
              </span>
            </div>

            {/* Protocol Step 1: Morning Sunlight (f >= fStep1) */}
            {frame >= fStep1 && (() => {
              const sp1 = spring({
                frame: frame - fStep1,
                fps,
                config: { damping: 14, stiffness: 160 },
              });

              return (
                <div
                  className="w-full p-6 rounded-3xl bg-white border-[2.5px] border-slate-900 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.14)] flex items-center justify-between gap-4"
                  style={{
                    opacity: interpolate(sp1, [0, 1], [0, 1]),
                    transform: `translateX(${interpolate(sp1, [0, 1], [-20, 0])}px)`,
                  }}
                >
                  <div className="flex flex-col">
                    <span className="text-lg font-mono font-bold text-slate-500 uppercase tracking-wider">
                      STEP 01 // UPON WAKING
                    </span>
                    <span className="text-4xl font-black text-[#090d16] uppercase tracking-tight">
                      MORNING SUNLIGHT
                    </span>
                    <span className="text-xl font-mono font-bold text-emerald-700 mt-1 uppercase">
                      LOCKS CORTISOL PEAK EARLY
                    </span>
                  </div>

                  <div className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-amber-50 border-2 border-amber-500 shrink-0">
                    <span className="text-5xl font-mono font-black text-amber-600 leading-none">
                      20
                    </span>
                    <span className="text-sm font-mono font-bold text-amber-800 uppercase tracking-wider">
                      MINUTES
                    </span>
                  </div>
                </div>
              );
            })()}

            {/* Protocol Step 2: Delay Caffeine (f >= fStep2) */}
            {frame >= fStep2 && (() => {
              const sp2 = spring({
                frame: frame - fStep2,
                fps,
                config: { damping: 14, stiffness: 160 },
              });

              return (
                <div
                  className="w-full p-6 rounded-3xl bg-white border-[2.5px] border-slate-900 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.14)] flex items-center justify-between gap-4"
                  style={{
                    opacity: interpolate(sp2, [0, 1], [0, 1]),
                    transform: `translateX(${interpolate(sp2, [0, 1], [20, 0])}px)`,
                  }}
                >
                  <div className="flex flex-col">
                    <span className="text-lg font-mono font-bold text-slate-500 uppercase tracking-wider">
                      STEP 02 // DELAY INTAKE
                    </span>
                    <span className="text-4xl font-black text-[#090d16] uppercase tracking-tight">
                      DELAY CAFFEINE
                    </span>
                    <span className="text-xl font-mono font-bold text-sky-800 mt-1 uppercase">
                      ADENOSINE CLEARS NATURALLY
                    </span>
                  </div>

                  <div className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-sky-50 border-2 border-sky-500 shrink-0">
                    <span className="text-5xl font-mono font-black text-sky-600 leading-none">
                      90
                    </span>
                    <span className="text-sm font-mono font-bold text-sky-800 uppercase tracking-wider">
                      MINUTES
                    </span>
                  </div>
                </div>
              );
            })()}

            {/* Decisive Protocol Seal (f >= fSeal) */}
            {frame >= fSeal && (() => {
              const spSeal = spring({
                frame: frame - fSeal,
                fps,
                config: { damping: 12, stiffness: 180 },
              });

              return (
                <div
                  className="w-full p-4 rounded-2xl bg-emerald-50 border-[2.5px] border-emerald-600 flex items-center justify-center gap-3 shadow-lg"
                  style={{
                    opacity: interpolate(spSeal, [0, 1], [0, 1]),
                    transform: `scale(${interpolate(spSeal, [0, 1], [0.92, 1])})`,
                  }}
                >
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
                  <span className="text-3xl font-black text-emerald-950 uppercase tracking-wide">
                    NATURAL PEAK RESTORED
                  </span>
                </div>
              );
            })()}

            {/* Semantic Cutout: Enlightened Mind Insight */}
            <div className="relative flex items-center justify-center mt-1">
              <img
                src={staticFile("assets/psychology/enlightened_mind_insight.png")}
                alt="Enlightened Mind Insight Cutout"
                className="w-[340px] h-auto object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.18)]"
              />
            </div>
          </div>
        );
      })()}
    </div>
  );
};
