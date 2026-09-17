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
import { Clock, TrendingUp, CheckCircle2 } from "lucide-react";

interface CanvasProps {
  transcript: WordTimestamp[];
}

/**
 * 🎬 RightMotion Bespoke Canvas — PriceOfInaction (Phase 9 Validation Clip)
 * Topic: "The Price of Inaction"
 * Channel: Judy Insights (Razor-Sharp Ultra-High Contrast)
 *
 * 📐 Platform-Safe Bounds (Rule 5.9):
 *   - Canvas: 1080x1920 @ 60 FPS
 *   - Safe Text Zone: y: 260px to y: 1340px
 *   - Caption Zone:   y: 1400px to y: 1560px
 *
 * 🏛️ Frontier Mechanisms Active:
 *   - Hook: Intimate Hero Illustration + Judy Presenter (Frames 0 - 150)
 *   - Scene 1 (Frames 150 - 320): Compound Interest of Delay (Threshold Boundary Deflection on Dark Spotlight)
 *   - Scene 2 (Frames 320 - 680): Foundation Erosion (Tactile Paper Stage with High-Contrast Typography)
 *   - Scene 3 (Frames 680 - 1030): Sovereign Truth (Slash Strike + Insight on Dark Spotlight)
 */
export const PriceOfInactionCanvas: React.FC<CanvasProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 60 FPS Timings from transcript
  const fHookEnd = 150; // 2.50s (Judy Intro exits)
  const fScene1End = 320; // 5.33s ("compound interest in anxiety")
  const fScene2End = 680; // 11.33s ("quietly rots the foundation")

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
                  src={staticFile("price_of_inaction/assets/scene_illustration.png")}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-slate-950/85 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-sky-400" />
                  <span className="font-mono text-xs font-bold text-white tracking-wider uppercase">
                    STAGE 01 // COGNITIVE TAX
                  </span>
                </div>
              </div>

              <div className="w-full mt-6 text-center">
                <h1 className="font-display font-black text-slate-950 text-5xl leading-tight tracking-tight uppercase">
                  The Cost Of Delay
                </h1>
                <p className="font-sans text-slate-600 text-2xl font-medium mt-2">
                  Every postponed conversation earns silent interest.
                </p>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ======================================================== */}
      {/* 2. SCENE 1: THE COMPOUND INTEREST OF ANXIETY (f: 150-320)  */}
      {/* High Contrast White on Dark Matte Surface                 */}
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
                STAGE 02: COMPOUND FRICTION
              </span>
              <h2 className="font-display font-black text-6xl text-white tracking-tight mt-1 uppercase">
                Anxiety Accrues
              </h2>
            </div>

            {/* Live Physical Threshold Deflection */}
            <div className="w-full max-w-[940px] my-6">
              <ThresholdBoundary
                frame={frame}
                fps={fps}
                startX={120}
                endX={960}
                initialBaselineY={400}
                settledBaselineY={540}
                strokeColor="#ffffff"
                thicknessPx={6}
                triggerFrame={210}
                impulseDurationFrames={45}
                showGhostTrace={true}
                ghostOpacity={0.45}
                label="PSYCHOLOGICAL BASELINE"
                labelColor="#ffffff"
                subLabel="ANXIETY LOAD ACCRUAL"
              />
            </div>

            <div className="flex items-center gap-8 mt-12">
              <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl border-2 border-slate-900 shadow-md">
                <TrendingUp className="w-6 h-6 text-rose-500" />
                <span className="font-mono text-xl font-black text-slate-900">
                  +18% DAILY CUMULATIVE LOAD
                </span>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ======================================================== */}
      {/* 3. SCENE 2: ROTTING THE FOUNDATION (f: 320 - 680)         */}
      {/* Warm Tactile Paper Surface — Deep Inky Black Typography   */}
      {/* ======================================================== */}
      {isScene2 && (() => {
        const spS2 = spring({
          frame: frame - fScene1End,
          fps,
          config: { damping: 14, stiffness: 120 },
        });

        const spCutout = spring({
          frame: frame - 380,
          fps,
          config: { damping: 12, stiffness: 140 },
        });

        return (
          <div
            className="w-full flex flex-col items-center select-none"
            style={{
              opacity: interpolate(spS2, [0, 1], [0, 1]),
            }}
          >
            <div className="text-center mb-4">
              <span className="font-mono text-base font-bold tracking-widest uppercase text-rose-600">
                STAGE 03: STRUCTURAL EROSION
              </span>
              <h2 className="font-display font-black text-6xl text-slate-950 tracking-tight mt-1 uppercase">
                Avoidance Rots
              </h2>
            </div>

            {/* Semantic Cutout: Tangled Chaos / Racing Thoughts */}
            <div
              className="w-[480px] h-[400px] flex items-center justify-center my-4 relative"
              style={{
                opacity: interpolate(spCutout, [0, 1], [0, 1]),
                transform: `scale(${interpolate(spCutout, [0, 1], [0.85, 1])})`,
              }}
            >
              <Img
                src={staticFile("assets/psychology/tangled_confusion_chaos.png")}
                className="w-full h-full object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.18)]"
              />
            </div>

            {/* Live Observation Callout */}
            <div className="bg-slate-950 text-white px-8 py-5 rounded-2xl border border-slate-800 shadow-xl text-center max-w-[840px]">
              <p className="font-display font-bold text-3xl leading-snug">
                Temporary comfort today creates permanent structural decay tomorrow.
              </p>
            </div>
          </div>
        );
      })()}

      {/* ======================================================== */}
      {/* 4. SCENE 3: SPEAK THE TRUTH (f: 680 - 1030)              */}
      {/* Dark Spotlight — Inky White + Emerald Sovereign Takeaway   */}
      {/* ======================================================== */}
      {isScene3 && (() => {
        const spS3 = spring({
          frame: frame - fScene2End,
          fps,
          config: { damping: 13, stiffness: 140 },
        });

        const fSlash = fScene2End + 45;
        const spInsight = spring({
          frame: frame - (fScene2End + 60),
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
              <span className="font-mono text-base font-bold tracking-widest uppercase text-emerald-400">
                STAGE 04: THE RESOLUTION
              </span>
              <h2 className="font-display font-black text-6xl text-white tracking-tight mt-1 uppercase">
                The Manageable Truth
              </h2>
            </div>

            {/* Slashed False Assumption */}
            <div className="relative my-4">
              <AnimatedSlashStrike
                startFrame={fSlash}
                preset="blade_slash"
                color="rose"
                strokeWidth={8}
              >
                <h3 className="font-display font-black text-5xl text-slate-300 tracking-wide">
                  WAIT FOR THE RIGHT TIME
                </h3>
              </AnimatedSlashStrike>
            </div>

            {/* Semantic Cutout: Enlightened Insight */}
            <div
              className="w-[420px] h-[340px] flex items-center justify-center my-4"
              style={{
                opacity: interpolate(spInsight, [0, 1], [0, 1]),
                transform: `scale(${interpolate(spInsight, [0, 1], [0.8, 1])})`,
              }}
            >
              <Img
                src={staticFile("assets/psychology/enlightened_mind_insight.png")}
                className="w-full h-full object-contain drop-shadow-[0_0_40px_rgba(56,189,248,0.35)]"
              />
            </div>

            {/* Final Sovereign Takeaway */}
            <div className="bg-emerald-500 text-slate-950 font-display font-black text-4xl px-8 py-4 rounded-2xl shadow-2xl uppercase tracking-tight flex items-center gap-4">
              <CheckCircle2 className="w-8 h-8 text-slate-950" />
              Speak While Stakes Are Small
            </div>
          </div>
        );
      })()}
    </MechanismStage>
  );
};
