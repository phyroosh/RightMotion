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
import {
  ThresholdBoundary,
  MechanismStage,
} from "../../components/primitives";
import { Sparkles, ShieldAlert, CheckCircle2, Crosshair } from "lucide-react";

interface CanvasProps {
  transcript: WordTimestamp[];
}

/**
 * 🎬 RightMotion Bespoke Canvas — TheFocusParadox
 * Topic: "The Focus Paradox"
 * Channel: Judy Insights (Razor-Sharp Ultra-High Contrast)
 *
 * 📐 Platform-Safe Bounds (Rule 5.9):
 *   - Canvas: 1080x1920 @ 60 FPS
 *   - Safe Text Zone: y: 260px to y: 1340px
 *   - Caption Zone:   y: 1400px to y: 1560px
 *
 * 🏛️ Active Frontier Mechanisms:
 *   - Hook (Frames 0 - 150): Intimate Bespoke Illustration Card + Judy Presenter pop-up
 *   - Scene 1 (Frames 150 - 580): Threshold Boundary Deflection (Brute Force vs Aggressive Elimination)
 *   - Scene 2 (Frames 580 - 1080): Neural Deconstruction & Friction Purge (Semantic Brain Cutout)
 *   - Scene 3 (Frames 1080 - 1540): Kinetic Truth Resolution (AnimatedSlashStrike + Focus Crosshair)
 */
export const TheFocusParadoxCanvas: React.FC<CanvasProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 60 FPS Timings from transcript.json
  const fHookEnd = 150;     // 2.50s (Judy Intro exits)
  const fScene1End = 580;   // 9.67s ("act of aggressive elimination")
  const fScene2End = 1080;  // 18.00s ("Clear the room")

  const isHookIntro = frame < fHookEnd;
  const isScene1 = frame >= fHookEnd && frame < fScene1End;
  const isScene2 = frame >= fScene1End && frame < fScene2End;
  const isScene3 = frame >= fScene2End;

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
            {/* Editorial Card with Generated Scene Illustration */}
            <div className="relative w-[860px] bg-white rounded-[32px] p-6 border-[2.5px] border-slate-900 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.18)] flex flex-col items-center">
              <div className="w-full h-[460px] rounded-[22px] overflow-hidden border-[1.5px] border-slate-800/20 relative shadow-inner">
                <Img
                  src={staticFile("the_focus_paradox/assets/scene_illustration.png")}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-slate-950/85 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-sky-400" />
                  <span className="font-mono text-xs font-bold text-white tracking-wider uppercase">
                    STAGE 01 // COGNITIVE BIAS
                  </span>
                </div>
              </div>

              <div className="w-full mt-6 text-center">
                <h1 className="font-display font-black text-slate-950 text-5xl leading-tight tracking-tight uppercase">
                  The Focus Paradox
                </h1>
                <p className="font-sans text-slate-600 text-2xl font-medium mt-2">
                  Stop trying to force attention with sheer willpower.
                </p>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ======================================================== */}
      {/* 2. SCENE 1: WILLPOWER VS ELIMINATION (f: 150 - 580)       */}
      {/* Live Physical Threshold Boundary Deflection on Matte Surface */}
      {/* ======================================================== */}
      {isScene1 && (() => {
        const spS1 = spring({
          frame: frame - fHookEnd,
          fps,
          config: { damping: 13, stiffness: 130 },
        });

        return (
          <div
            className="w-full flex flex-col items-center select-none"
            style={{
              opacity: interpolate(spS1, [0, 1], [0, 1]),
            }}
          >
            <div className="text-center mb-6">
              <span className="font-mono text-base font-bold tracking-widest uppercase text-sky-400">
                STAGE 02: NEURAL RESISTANCE
              </span>
              <h2 className="font-display font-black text-6xl text-white tracking-tight mt-1 uppercase">
                Willpower Fails
              </h2>
            </div>

            {/* Live Physical Threshold Deflection */}
            <div className="w-full max-w-[940px] my-4">
              <ThresholdBoundary
                frame={frame}
                fps={fps}
                startX={120}
                endX={960}
                initialBaselineY={380}
                settledBaselineY={520}
                strokeColor="#ffffff"
                thicknessPx={6}
                triggerFrame={300}
                impulseDurationFrames={45}
                showGhostTrace={true}
                ghostOpacity={0.45}
                label="RESISTANCE THRESHOLD"
                labelColor="#ffffff"
                subLabel="AGGRESSIVE ELIMINATION vs WILLPOWER"
              />
            </div>

            {/* Dual Comparison Blocks */}
            <div className="flex items-center gap-6 mt-10">
              <div className="flex items-center gap-3 bg-rose-950/80 border border-rose-600/40 px-6 py-3 rounded-2xl shadow-lg">
                <ShieldAlert className="w-6 h-6 text-rose-400" />
                <span className="font-mono text-lg font-bold text-rose-200">
                  BRUTE FORCE: HIGH FRICTION
                </span>
              </div>
              <div className="flex items-center gap-3 bg-emerald-950/80 border border-emerald-500/40 px-6 py-3 rounded-2xl shadow-lg">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                <span className="font-mono text-lg font-bold text-emerald-200">
                  ELIMINATION: ZERO DRAG
                </span>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ======================================================== */}
      {/* 3. SCENE 2: NEURAL DECONSTRUCTION (f: 580 - 1080)         */}
      {/* 3D Glowing Brain Cutout with Progressive Noise Elimination*/}
      {/* ======================================================== */}
      {isScene2 && (() => {
        const spS2 = spring({
          frame: frame - fScene1End,
          fps,
          config: { damping: 14, stiffness: 120 },
        });

        const spCutout = spring({
          frame: frame - (fScene1End + 30),
          fps,
          config: { damping: 12, stiffness: 140 },
        });

        // Spoken beats for progressive purge:
        // f=920: "Strip the friction"
        // f=1020: "Close secondary tabs"
        // f=1060: "Clear the room"
        const frictionPurged = frame >= 920;
        const tabsClosed = frame >= 1020;
        const roomCleared = frame >= 1060;

        return (
          <div
            className="w-full flex flex-col items-center select-none"
            style={{
              opacity: interpolate(spS2, [0, 1], [0, 1]),
            }}
          >
            <div className="text-center mb-4">
              <span className="font-mono text-base font-bold tracking-widest uppercase text-amber-400">
                STAGE 03: SIGNAL PURGE
              </span>
              <h2 className="font-display font-black text-6xl text-white tracking-tight mt-1 uppercase">
                Starve The Distraction
              </h2>
            </div>

            {/* Semantic Cutout: Hyperrealistic 3D Glowing Brain */}
            <div
              className="w-[460px] h-[380px] flex items-center justify-center my-2 relative"
              style={{
                opacity: interpolate(spCutout, [0, 1], [0, 1]),
                transform: `scale(${interpolate(spCutout, [0, 1], [0.88, 1])})`,
              }}
            >
              <Img
                src={staticFile("assets/psychology/hyperrealistic_3d_glowing_brain.png")}
                className="w-full h-full object-contain drop-shadow-[0_20px_40px_rgba(56,189,248,0.25)]"
              />
            </div>

            {/* 3 Interactive Distraction Badges Purged on Audio Beats */}
            <div className="flex flex-wrap justify-center gap-4 max-w-[860px] mt-4">
              <div
                className={`px-5 py-2.5 rounded-xl border-2 font-mono text-base font-bold transition-all duration-300 ${
                  frictionPurged
                    ? "bg-emerald-950/60 border-emerald-500 text-emerald-300 line-through opacity-60"
                    : "bg-white text-slate-900 border-slate-900 shadow-md"
                }`}
              >
                1. COGNITIVE FRICTION
              </div>
              <div
                className={`px-5 py-2.5 rounded-xl border-2 font-mono text-base font-bold transition-all duration-300 ${
                  tabsClosed
                    ? "bg-emerald-950/60 border-emerald-500 text-emerald-300 line-through opacity-60"
                    : "bg-white text-slate-900 border-slate-900 shadow-md"
                }`}
              >
                2. SECONDARY TABS
              </div>
              <div
                className={`px-5 py-2.5 rounded-xl border-2 font-mono text-base font-bold transition-all duration-300 ${
                  roomCleared
                    ? "bg-emerald-950/60 border-emerald-500 text-emerald-300 line-through opacity-60"
                    : "bg-white text-slate-900 border-slate-900 shadow-md"
                }`}
              >
                3. ROOM NOISE
              </div>
            </div>

            <div className="bg-slate-900/90 text-white px-8 py-4 rounded-2xl border border-slate-700 shadow-xl text-center max-w-[860px] mt-6">
              <p className="font-display font-bold text-2xl leading-snug text-slate-200">
                Direct resistance feeds attention loops. Elimination dissolves them.
              </p>
            </div>
          </div>
        );
      })()}

      {/* ======================================================== */}
      {/* 4. SCENE 3: KINETIC TRUTH RESOLUTION (f: 1080 - 1540)     */}
      {/* Slash Strike False Belief + Massive Decisive Resolution    */}
      {/* ======================================================== */}
      {isScene3 && (() => {
        const spS3 = spring({
          frame: frame - fScene2End,
          fps,
          config: { damping: 13, stiffness: 140 },
        });

        const fSlash = fScene2End + 40;
        const spInsight = spring({
          frame: frame - (fScene2End + 65),
          fps,
          config: { damping: 12, stiffness: 150 },
        });

        return (
          <div
            className="w-full flex flex-col items-center select-none"
            style={{
              opacity: interpolate(spS3, [0, 1], [0, 1]),
            }}
          >
            <div className="text-center mb-6">
              <span className="font-mono text-base font-bold tracking-widest uppercase text-emerald-600">
                STAGE 04: THE RESOLUTION
              </span>
              <h2 className="font-display font-black text-6xl text-slate-950 tracking-tight mt-1 uppercase">
                The Sovereign Truth
              </h2>
            </div>

            {/* Slashed Myth: "FORCE CONCENTRATION" */}
            <div className="relative my-4 inline-block">
              <AnimatedSlashStrike
                startFrame={fSlash}
                color="rose"
                strokeWidth={8}
                angle={-12}
              >
                <span className="font-display font-black text-slate-500 text-5xl uppercase tracking-wider px-6 py-2">
                  FORCE CONCENTRATION
                </span>
              </AnimatedSlashStrike>
            </div>

            {/* Live Epiphany Payoff */}
            <div
              className="w-full max-w-[880px] bg-white rounded-[32px] p-8 border-[3px] border-slate-900 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] flex flex-col items-center text-center mt-6"
              style={{
                opacity: interpolate(spInsight, [0, 1], [0, 1]),
                transform: `scale(${interpolate(spInsight, [0, 1], [0.92, 1])})`,
              }}
            >
              <div className="w-20 h-20 bg-emerald-50 rounded-full border-2 border-emerald-500/30 flex items-center justify-center mb-4">
                <Crosshair className="w-10 h-10 text-emerald-600" />
              </div>

              <h3 className="font-display font-black text-slate-950 text-5xl uppercase tracking-tight leading-tight">
                Focus Is What Remains
              </h3>
              <p className="font-sans text-slate-700 text-2xl font-bold mt-3 max-w-[700px]">
                When everything secondary is eliminated, concentration happens automatically.
              </p>
            </div>
          </div>
        );
      })()}
    </MechanismStage>
  );
};
