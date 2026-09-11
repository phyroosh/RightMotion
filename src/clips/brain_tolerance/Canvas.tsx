import React from "react";
import { Easing, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { WordTimestamp } from "../../types";
import { AnimatedSlashStrike } from "../../components/kinetic_text/AnimatedSlashStrike";
import { KineticHighlighter } from "../../components/kinetic_text/KineticHighlighter";
import { CinematicParallaxRig } from "../../components/camera3d/CinematicParallaxRig";
import {
  AlertTriangle,
  ArrowRight,
  Brain,
  CheckCircle2,
  Lock,
  MinusCircle,
  Shield,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";

interface CanvasProps {
  transcript: WordTimestamp[];
}

/**
 * 🎬 BrainToleranceCanvas — 100% Bespoke Motion Graphics
 * Topic: "Your Brain Learns Tolerance" {Self Improvement}
 * Channel: Judy Insights (Apple Studio Razor-Sharp Editorial)
 *
 * 📐 Safe Zones:
 * - Primary graphics strictly between top: 6% and top: 68% (y: 115px to 1300px)
 * - Kinetic Captions reserved: top: 73% to top: 81% (y: 1400px to 1555px)
 * - ZERO OVERLAP with captions!
 *
 * 💎 Visual Standard (Ultra-High Contrast & Razor-Sharp):
 * - Clean Luminous Ground: #fbfbfd / #f8fafc with vector grid. Zero dirty grain.
 * - Deep Inky Contrast: #090d16 or #000000 text (min 7:1 contrast).
 * - Razor-Sharp Edge Geometry: Solid #ffffff cards, 2.5px-3px dark borders, crisp drop shadows.
 * - PHYSICAL CUTOUTS: Anchored by high-res semantic cutouts and hero illustration.
 * - Progressive Micro-Choreography: Elements enter sequentially on exact spoken timestamps.
 * - In-Scene Mutation: Real-time blade slash strike over "WAITING FOR MOTIVATION".
 * - Dramatic Breath Hold at frame 648 before the epiphany.
 */
export const BrainToleranceCanvas: React.FC<CanvasProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <CinematicParallaxRig
      punchIns={[
        { frame: 80, zoom: 1.04, durationFrames: 12, targetY: -15 },
        { frame: 561, zoom: 1.05, durationFrames: 10, targetY: -20 },
        { frame: 664, zoom: 1.06, durationFrames: 12, targetY: -15 },
        { frame: 923, zoom: 1.06, durationFrames: 10, targetY: -10 },
      ]}
      breathHolds={[
        { startFrame: 648, durationFrames: 16 },
      ]}
      impacts={[
        { frame: 594, intensity: 10, durationFrames: 8 },
      ]}
      className="w-full h-full select-none font-sans"
    >
      <div className="absolute inset-0 w-full h-full">
        {/* ======================================================== */}
        {/* SCENE 1: HOOK & THE TOLERANCE TRUTH (Frames 0 → 135)      */}
        {/* "Your brain doesn't just learn from what you pursue..."   */}
        {/* "it learns from what you repeatedly tolerate."           */}
        {/* ======================================================== */}
        {frame >= 0 && frame < 135 && (() => {
          const cam1 = interpolate(frame, [0, 135], [1.0, 1.03], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          });

          // Part 1A: 0 -> 75 (Mandatory 2.5s Hero Illustration Intro)
          const hookOpacity = interpolate(frame, [65, 75], [1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          const heroSpring = spring({
            frame,
            fps,
            config: { damping: 14, mass: 0.7, stiffness: 120 },
          });

          // Part 1B: 75 -> 135 (The Tolerance Epiphany & Contrast)
          const part1BOpacity = interpolate(frame, [72, 82], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          const brainSpring = spring({
            frame: Math.max(0, frame - 75),
            fps,
            config: { damping: 13, mass: 0.6, stiffness: 130 },
          });

          return (
            <div
              className="absolute inset-0 flex flex-col items-center"
              style={{ transform: `scale(${cam1})`, transformOrigin: "50% 34%" }}
            >
              {/* PART 1A: 2.5s Hook with Created Illustration & Close-up Judy (Frames 0 -> 75) */}
              {frame < 78 && (
                <div
                  className="absolute flex flex-col items-center text-center px-8 w-full"
                  style={{
                    top: "8%",
                    opacity: hookOpacity,
                    transform: `translateY(${interpolate(hookOpacity, [0, 1], [-25, 0])}px)`,
                  }}
                >
                  <span className="font-mono text-[36px] font-black tracking-[0.25em] text-indigo-600 uppercase mb-2">
                    THE HIDDEN REWIRING
                  </span>

                  <h1 className="font-sans font-black text-[78px] leading-[1.05] tracking-tight text-slate-950 mb-5">
                    YOUR BRAIN
                  </h1>

                  {/* Hero Created Illustration Card */}
                  <div
                    className="relative w-[920px] bg-white border-[3px] border-slate-950 rounded-[36px] p-3.5 shadow-[0_26px_50px_-10px_rgba(0,0,0,0.22)] overflow-hidden"
                    style={{ transform: `scale(${heroSpring})` }}
                  >
                    <div className="relative w-full h-[520px] rounded-[24px] overflow-hidden border-[1.5px] border-slate-200">
                      <img
                        src={staticFile("brain_tolerance/assets/scene_illustration.png")}
                        alt="Your Brain Learns Tolerance"
                        className="w-full h-full object-cover"
                        style={{
                          transform: `scale(${interpolate(frame, [0, 75], [1.0, 1.05])})`,
                          transformOrigin: "center center",
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* PART 1B: The Tolerance Epiphany & 3D Brain Cutout (Frames 72 -> 135) */}
              {frame >= 72 && (
                <div
                  className="absolute flex flex-col items-center text-center px-8 w-full"
                  style={{
                    top: "8%",
                    opacity: part1BOpacity,
                    transform: `translateY(${interpolate(part1BOpacity, [0, 1], [30, 0])}px)`,
                  }}
                >
                  <span className="font-mono text-[36px] font-black tracking-[0.25em] text-slate-500 uppercase mb-2">
                    THE BIOLOGICAL REALITY
                  </span>

                  {/* Strikethrough Pursue */}
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-sans font-bold text-[40px] text-slate-400 line-through decoration-rose-500 decoration-[4px]">
                      NOT WHAT YOU PURSUE
                    </span>
                  </div>

                  {/* Headline Slam */}
                  <h1 className="font-sans font-black text-[76px] leading-[1.05] tracking-tight text-slate-950 mb-6">
                    WHAT YOU <KineticHighlighter startFrame={85} color="yellow">REPEATEDLY TOLERATE</KineticHighlighter>
                  </h1>

                  {/* Main Card with 3D Glowing Brain Cutout */}
                  <div className="relative w-[920px] bg-white border-[3px] border-slate-950 rounded-[38px] p-7 shadow-[0_26px_50px_-10px_rgba(0,0,0,0.20)] flex items-center justify-between overflow-hidden">
                    <div className="flex flex-col text-left max-w-[460px]">
                      <span className="font-mono text-[36px] font-bold text-indigo-600 uppercase tracking-wider mb-2">
                        NEURAL RULE
                      </span>
                      <h2 className="font-sans font-black text-[50px] text-slate-950 leading-tight">
                        PERMITTED IS
                        <br />
                        PRACTICED.
                      </h2>
                      <p className="font-mono text-[36px] font-semibold text-slate-500 mt-3">
                        Repetition sets the baseline.
                      </p>
                    </div>

                    {/* High-Resolution Semantic Brain Cutout */}
                    <div
                      className="relative w-[360px] h-[360px] flex items-center justify-center"
                      style={{ transform: `scale(${brainSpring})` }}
                    >
                      <img
                        src={staticFile("assets/psychology/hyperrealistic_3d_glowing_brain.png")}
                        alt="3D Glowing Neural Brain"
                        className="w-full h-full object-contain drop-shadow-[0_22px_32px_rgba(0,0,0,0.24)]"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* ======================================================== */}
        {/* SCENE 2: 3 SILENT REPETITIONS & BASELINE (135 → 365)       */}
        {/* "Every ignored distraction, unfinished task..."          */}
        {/* "gives your nervous system another repetition..."        */}
        {/* ======================================================== */}
        {frame >= 135 && frame < 365 && (() => {
          const cam2 = interpolate(frame, [135, 365], [1.0, 1.04], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          });

          // Sequential card entrances
          const card1Spring = spring({
            frame: Math.max(0, frame - 136),
            fps,
            config: { damping: 13, mass: 0.6, stiffness: 140 },
          });

          const card2Spring = spring({
            frame: Math.max(0, frame - 185),
            fps,
            config: { damping: 13, mass: 0.6, stiffness: 140 },
          });

          const card3Spring = spring({
            frame: Math.max(0, frame - 224),
            fps,
            config: { damping: 13, mass: 0.6, stiffness: 140 },
          });

          const baselineResultSpring = spring({
            frame: Math.max(0, frame - 265),
            fps,
            config: { damping: 12, mass: 0.6, stiffness: 130 },
          });

          return (
            <div
              className="absolute inset-0 flex flex-col items-center"
              style={{ transform: `scale(${cam2})`, transformOrigin: "50% 36%" }}
            >
              <div className="absolute flex flex-col items-center text-center px-8 w-full" style={{ top: "8%" }}>
                <span className="font-mono text-[36px] font-black tracking-[0.25em] text-rose-600 uppercase mb-2">
                  3 SILENT REPETITIONS
                </span>

                <h1 className="font-sans font-black text-[72px] leading-[1.05] tracking-tight text-slate-950 mb-5">
                  NERVOUS SYSTEM REHEARSAL
                </h1>

                {/* 3 Sequential Progressive Cards */}
                <div className="w-[920px] flex flex-col gap-4">
                  {/* Item 1: Ignored Distraction (frame 136) */}
                  {frame >= 136 && (
                    <div
                      className="w-full bg-white border-[2.5px] border-slate-950 rounded-[24px] p-5 shadow-[0_16px_32px_-8px_rgba(0,0,0,0.12)] flex items-center justify-between"
                      style={{ transform: `scale(${card1Spring})` }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-rose-100 border-2 border-rose-600 flex items-center justify-center">
                          <MinusCircle className="w-7 h-7 text-rose-600" />
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="font-sans font-black text-[42px] text-slate-950 leading-tight">
                            IGNORED DISTRACTION
                          </span>
                          <span className="font-mono text-[36px] text-slate-500">
                            Focus becomes optional
                          </span>
                        </div>
                      </div>
                      <span className="font-mono text-[36px] font-black text-rose-600 uppercase">
                        REP +1
                      </span>
                    </div>
                  )}

                  {/* Item 2: Unfinished Task (frame 185) */}
                  {frame >= 185 && (
                    <div
                      className="w-full bg-white border-[2.5px] border-slate-950 rounded-[24px] p-5 shadow-[0_16px_32px_-8px_rgba(0,0,0,0.12)] flex items-center justify-between"
                      style={{ transform: `scale(${card2Spring})` }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-amber-100 border-2 border-amber-600 flex items-center justify-center">
                          <AlertTriangle className="w-7 h-7 text-amber-600" />
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="font-sans font-black text-[42px] text-slate-950 leading-tight">
                            UNFINISHED TASK
                          </span>
                          <span className="font-mono text-[36px] text-slate-500">
                            Completion is non-essential
                          </span>
                        </div>
                      </div>
                      <span className="font-mono text-[36px] font-black text-amber-600 uppercase">
                        REP +1
                      </span>
                    </div>
                  )}

                  {/* Item 3: Broken Promise (frame 224) */}
                  {frame >= 224 && (
                    <div
                      className="w-full bg-white border-[2.5px] border-slate-950 rounded-[24px] p-5 shadow-[0_16px_32px_-8px_rgba(0,0,0,0.12)] flex items-center justify-between"
                      style={{ transform: `scale(${card3Spring})` }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-red-100 border-2 border-red-600 flex items-center justify-center">
                          <Shield className="w-7 h-7 text-red-600" />
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="font-sans font-black text-[42px] text-slate-950 leading-tight">
                            BROKEN PROMISE
                          </span>
                          <span className="font-mono text-[36px] text-slate-500">
                            Self-trust is negotiable
                          </span>
                        </div>
                      </div>
                      <span className="font-mono text-[36px] font-black text-red-600 uppercase">
                        REP +1
                      </span>
                    </div>
                  )}

                  {/* Compounding Baseline Payoff (frame 265) */}
                  {frame >= 265 && (
                    <div
                      className="w-full mt-2 bg-slate-950 text-white rounded-[28px] p-6 border-[2.5px] border-slate-900 shadow-2xl flex items-center justify-between"
                      style={{ transform: `scale(${baselineResultSpring})` }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center">
                          <Zap className="w-8 h-8 text-rose-400" />
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="font-mono text-[36px] font-bold text-slate-400 uppercase">
                            CUMULATIVE RESULT
                          </span>
                          <span className="font-sans font-black text-[44px] text-white leading-tight">
                            SAME BASELINE REPEATED
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col text-right">
                        <span className="font-mono text-[36px] font-black text-rose-400">
                          CALIBRATED
                        </span>
                        <span className="font-mono text-[36px] font-bold text-slate-400">
                          AS NORMAL
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })()}

        {/* ======================================================== */}
        {/* SCENE 3: NEUROPLASTICITY & MOTIVATION TRAP (365 → 662)     */}
        {/* "Through neuroplasticity and reinforcement..."            */}
        {/* "familiar behavior becomes easier to repeat..."          */}
        {/* "That's why waiting to feel motivated keeps cycle alive."*/}
        {/* ======================================================== */}
        {frame >= 365 && frame < 662 && (() => {
          const cam3 = interpolate(frame, [365, 662], [1.0, 1.04], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          });

          // Part 3A: 365 -> 555 (Neuroplastic groove)
          const isPart3A = frame < 555;
          const part3ASpring = spring({
            frame: Math.max(0, frame - 367),
            fps,
            config: { damping: 13, mass: 0.6, stiffness: 130 },
          });

          // Part 3B: 555 -> 662 (The Motivation Trap & Live Slash Strike)
          const isPart3B = frame >= 550;
          const trapCardSpring = spring({
            frame: Math.max(0, frame - 555),
            fps,
            config: { damping: 12, mass: 0.6, stiffness: 140 },
          });

          const stampSpring = spring({
            frame: Math.max(0, frame - 602),
            fps,
            config: { damping: 10, mass: 0.5, stiffness: 170 },
          });

          return (
            <div
              className="absolute inset-0 flex flex-col items-center"
              style={{ transform: `scale(${cam3})`, transformOrigin: "50% 35%" }}
            >
              {/* PART 3A: NEUROPLASTIC REINFORCEMENT (365 -> 555) */}
              {isPart3A && (
                <div className="absolute flex flex-col items-center text-center px-8 w-full" style={{ top: "8%" }}>
                  <span className="font-mono text-[36px] font-black tracking-[0.25em] text-indigo-600 uppercase mb-2">
                    BIOLOGICAL AUTOMATION
                  </span>

                  <h1 className="font-sans font-black text-[72px] leading-[1.05] tracking-tight text-slate-950 mb-5">
                    NEUROPLASTIC GROOVE
                  </h1>

                  {/* Split Tension Card with Dopamine Head Cutout */}
                  <div
                    className="relative w-[920px] bg-white border-[3px] border-slate-950 rounded-[38px] p-7 shadow-[0_26px_50px_-10px_rgba(0,0,0,0.18)] flex items-center justify-between mb-5"
                    style={{ transform: `scale(${part3ASpring})` }}
                  >
                    <div className="flex flex-col text-left max-w-[480px]">
                      <span className="font-mono text-[36px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                        SYNAPTIC WIRING
                      </span>
                      <h2 className="font-sans font-black text-[48px] text-slate-950 leading-tight">
                        EASIER TO REPEAT.
                      </h2>
                      <p className="font-mono text-[36px] font-bold text-indigo-600 mt-2">
                        Reinforced on every repetition.
                      </p>
                    </div>

                    {/* Semantic Cutout: Dopamine Head Circuit */}
                    <div className="relative w-[340px] h-[340px] flex items-center justify-center">
                      <img
                        src={staticFile("assets/psychology/dopamine_head_circuit.png")}
                        alt="Dopamine Circuit Head"
                        className="w-full h-full object-contain drop-shadow-[0_22px_32px_rgba(0,0,0,0.22)]"
                      />
                    </div>
                  </div>

                  {/* Even when you hate the result (frame 515) */}
                  {frame >= 515 && (
                    <div
                      className="w-[920px] bg-rose-50 border-[2.5px] border-rose-950 rounded-[28px] p-6 shadow-xl flex items-center justify-between"
                      style={{
                        transform: `scale(${spring({
                          frame: Math.max(0, frame - 515),
                          fps,
                          config: { damping: 12, mass: 0.6, stiffness: 140 },
                        })})`,
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <AlertTriangle className="w-10 h-10 text-rose-600" />
                        <span className="font-sans font-black text-[44px] text-rose-950 tracking-tight">
                          EVEN WHEN YOU HATE THE RESULT
                        </span>
                      </div>
                      <span className="font-mono text-[36px] font-black text-rose-700 uppercase">
                        BIOLOGY WINS
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* PART 3B: THE MOTIVATION TRAP & REAL-TIME SLASH (550 -> 662) */}
              {isPart3B && (
                <div
                  className="absolute flex flex-col items-center text-center px-8 w-full"
                  style={{
                    top: "8%",
                    opacity: interpolate(frame, [550, 560], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                  }}
                >
                  <span className="font-mono text-[36px] font-black tracking-[0.25em] text-rose-600 uppercase mb-2">
                    THE FATAL TRAP
                  </span>

                  <h1 className="font-sans font-black text-[72px] leading-[1.05] tracking-tight text-slate-950 mb-6">
                    WAITING FOR EMOTION
                  </h1>

                  {/* Massive Card with Real-Time Blade Slash Strike */}
                  <div
                    className="relative w-[920px] bg-white border-[3px] border-slate-950 rounded-[38px] p-10 shadow-[0_26px_50px_-10px_rgba(0,0,0,0.22)] flex flex-col items-center justify-center overflow-hidden"
                    style={{ transform: `scale(${trapCardSpring})` }}
                  >
                    <span className="font-mono text-[36px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                      THE FALSE PREMISE
                    </span>

                    {/* LIVE MUTATION: Real-time blade slash cutting across text */}
                    <div className="relative py-2">
                      <AnimatedSlashStrike
                        startFrame={590}
                        durationFrames={8}
                        preset="blade_slash"
                        color="rose"
                        strokeWidth={10}
                      >
                        <h2 className="font-sans font-black text-[76px] text-slate-950 tracking-tight">
                          "FEEL MOTIVATED"
                        </h2>
                      </AnimatedSlashStrike>
                    </div>

                    {/* Violent Stamp Impact */}
                    {frame >= 602 && (
                      <div
                        className="mt-6 bg-rose-600 text-white font-mono text-[42px] font-black uppercase px-8 py-3 rounded-2xl shadow-xl border-2 border-rose-800"
                        style={{
                          transform: `scale(${stampSpring}) rotate(-2deg)`,
                        }}
                      >
                        KEEPS THE CYCLE ALIVE
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* ======================================================== */}
        {/* SCENE 4: ZERO-TOLERANCE RESET PROTOCOL (662 → 920)         */}
        {/* "Use a zero-tolerance reset: identify one behavior..."    */}
        {/* "remove its easiest trigger, enforce one tiny standard..."*/}
        {/* ======================================================== */}
        {frame >= 662 && frame < 920 && (() => {
          const cam4 = interpolate(frame, [662, 920], [1.0, 1.04], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          });

          const step1Spring = spring({
            frame: Math.max(0, frame - 716),
            fps,
            config: { damping: 13, mass: 0.6, stiffness: 140 },
          });

          const step2Spring = spring({
            frame: Math.max(0, frame - 784),
            fps,
            config: { damping: 13, mass: 0.6, stiffness: 140 },
          });

          const step3Spring = spring({
            frame: Math.max(0, frame - 838),
            fps,
            config: { damping: 12, mass: 0.6, stiffness: 140 },
          });

          return (
            <div
              className="absolute inset-0 flex flex-col items-center"
              style={{ transform: `scale(${cam4})`, transformOrigin: "50% 36%" }}
            >
              <div className="absolute flex flex-col items-center text-center px-8 w-full" style={{ top: "8%" }}>
                <span className="font-mono text-[36px] font-black tracking-[0.25em] text-emerald-600 uppercase mb-2">
                  THE SOVEREIGN PROTOCOL
                </span>

                <h1 className="font-sans font-black text-[72px] leading-[1.05] tracking-tight text-slate-950 mb-5">
                  <KineticHighlighter startFrame={675} color="lime">ZERO-TOLERANCE</KineticHighlighter> RESET
                </h1>

                {/* 3 Progressive Step Protocol Cards */}
                <div className="w-[920px] flex flex-col gap-4">
                  {/* Step 1: Identify normalized behavior (frame 716) */}
                  {frame >= 716 && (
                    <div
                      className="w-full bg-white border-[2.5px] border-slate-950 rounded-[24px] p-5 shadow-[0_16px_32px_-8px_rgba(0,0,0,0.12)] flex items-center justify-between"
                      style={{ transform: `scale(${step1Spring})` }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 border-2 border-slate-900 flex items-center justify-center font-mono font-black text-2xl text-slate-950">
                          01
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="font-sans font-black text-[42px] text-slate-950 leading-tight">
                            IDENTIFY 1 NORMALIZED HABIT
                          </span>
                          <span className="font-mono text-[36px] text-slate-500">
                            The compromise you stopped questioning
                          </span>
                        </div>
                      </div>
                      <span className="font-mono text-[36px] font-bold text-slate-400">
                        AUDIT
                      </span>
                    </div>
                  )}

                  {/* Step 2: Remove easiest trigger (frame 784) */}
                  {frame >= 784 && (
                    <div
                      className="w-full bg-white border-[2.5px] border-slate-950 rounded-[24px] p-5 shadow-[0_16px_32px_-8px_rgba(0,0,0,0.12)] flex items-center justify-between"
                      style={{ transform: `scale(${step2Spring})` }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-rose-100 border-2 border-rose-600 flex items-center justify-center font-mono font-black text-2xl text-rose-600">
                          02
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="font-sans font-black text-[42px] text-slate-950 leading-tight">
                            REMOVE EASIEST TRIGGER
                          </span>
                          <span className="font-mono text-[36px] text-slate-500">
                            Eliminate the default entry path
                          </span>
                        </div>
                      </div>
                      <span className="font-mono text-[36px] font-black text-rose-600">
                        CUT
                      </span>
                    </div>
                  )}

                  {/* Step 3: Enforce tiny standard daily (frame 838) */}
                  {frame >= 838 && (
                    <div
                      className="w-full bg-emerald-50 border-[2.5px] border-emerald-950 rounded-[24px] p-5 shadow-xl flex items-center justify-between"
                      style={{ transform: `scale(${step3Spring})` }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-mono font-black text-2xl">
                          03
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="font-sans font-black text-[42px] text-emerald-950 leading-tight">
                            ENFORCE 1 TINY STANDARD
                          </span>
                          <span className="font-mono text-[36px] font-bold text-emerald-700">
                            Non-negotiable daily floor
                          </span>
                        </div>
                      </div>
                      <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })()}

        {/* ======================================================== */}
        {/* SCENE 5: DECISIVE TAKEAWAY & BASELINE SHIFT (920 → 986)    */}
        {/* "Your baseline changes when your tolerance changes."       */}
        {/* ======================================================== */}
        {frame >= 920 && (() => {
          const cam5 = interpolate(frame, [920, 986], [1.0, 1.05], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          });

          const slamSpring = spring({
            frame: Math.max(0, frame - 923),
            fps,
            config: { damping: 12, mass: 0.6, stiffness: 140 },
          });

          const badgeSpring = spring({
            frame: Math.max(0, frame - 945),
            fps,
            config: { damping: 11, mass: 0.5, stiffness: 160 },
          });

          return (
            <div
              className="absolute inset-0 flex flex-col items-center"
              style={{ transform: `scale(${cam5})`, transformOrigin: "50% 36%" }}
            >
              <div
                className="absolute flex flex-col items-center text-center px-8 w-full"
                style={{ top: "9%" }}
              >
                <span className="font-mono text-[36px] font-black tracking-[0.25em] text-emerald-600 uppercase mb-4">
                  THE DECISIVE LAW
                </span>

                <div
                  className="w-[920px] bg-white border-[3px] border-slate-950 rounded-[40px] p-10 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.22)] flex flex-col items-center justify-center text-center"
                  style={{ transform: `scale(${slamSpring})` }}
                >
                  <h2 className="font-sans font-black text-[64px] leading-tight text-slate-950 tracking-tight mb-2">
                    YOUR BASELINE CHANGES
                  </h2>

                  <span className="font-sans font-bold text-[46px] text-slate-400 uppercase tracking-widest my-2">
                    WHEN YOUR
                  </span>

                  <h1 className="font-sans font-black text-[80px] leading-tight text-slate-950 tracking-tight">
                    <KineticHighlighter startFrame={935} color="yellow">TOLERANCE CHANGES</KineticHighlighter>
                  </h1>

                  {/* Sovereign Final Seal */}
                  {frame >= 945 && (
                    <div
                      className="mt-8 bg-slate-950 text-white rounded-[24px] px-8 py-4 border-[2px] border-slate-800 shadow-2xl flex items-center gap-4"
                      style={{ transform: `scale(${badgeSpring})` }}
                    >
                      <Sparkles className="w-8 h-8 text-emerald-400" />
                      <span className="font-mono text-[38px] font-black uppercase tracking-wider text-emerald-400">
                        NEW BASELINE LOCKED
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </CinematicParallaxRig>
  );
};
