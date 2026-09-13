import React from "react";
import { interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { WordTimestamp } from "../../types";
import { AnimatedSlashStrike, KineticHighlighter } from "../../components/kinetic_text";
import { CinematicIllustrationCard } from "../../components/CinematicIllustrationCard";

interface CanvasProps {
  transcript: WordTimestamp[];
}

/**
 * 🎬 RightMotion Canvas — SmokeTestFrontierS
 * Topic: "How One Small Compromise Becomes a Habit Before You Notice"
 *
 * 📐 Safe Zones:
 *   - Primary graphics: top: 6% to top: 68% (y: 115px to 1320px)
 *   - Captions:         top: 73% to top: 81%
 *   - Zero overlap with captions!
 *
 * 🎭 Physical Cutout Assets & Presenter Grounding (Zero Memes Policy):
 *   - Opening Hero Illustration (0–75): staticFile("scene_illustration.png") staged in CinematicIllustrationCard
 *   - Problem Cutout (75–289): staticFile("assets/burnout/brain_trapped_in_cage.png") (400–750px, crisp shadow)
 *   - Solution Cutout (686–1073): staticFile("assets/psychology/hyperrealistic_3d_glowing_brain.png") (400–750px, crisp shadow)
 *   - Presenter Judy: Handled in Presenter.tsx (GlossyJudyIntro 0–75, baseHeight: 1280px).
 *     *CRITICAL*: Never place floating, severed Judy torsos in Canvas.tsx.
 *
 * ⏱️ Progressive Micro-Choreography & Timing:
 *   - Scene 1 (Hook / Problem): frames 0 → 289 (Hero illustration 0–75, Cutout 75–289)
 *   - Scene 2 (Logic / Breakdown): frames 289 → 686 (Sequential block reveals + real-time AnimatedSlashStrike)
 *   - Scene 3 (Solution / Shift): frames 686 → 1073 (Solution cutout + sovereign realization)
 *
 * 💎 Visual Standard (Ultra-High Contrast & Razor-Sharp):
 *   - Pure white (#ffffff) cards with inky black (#090d16) text (min 7:1 contrast).
 *   - Razor-sharp dark borders: border-[2.5px] border-slate-900.
 *   - Deep drop shadows: shadow-[0_24px_48px_-12px_rgba(0,0,0,0.16)].
 *   - Zero dirty film grain, gray haze, or washed-out blur boxes.
 */
export const SmokeTestFrontierSCanvas: React.FC<CanvasProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  void fps;

  // Scene triggers
  const isScene1 = frame >= 0 && frame < 289;
  const isHookIntro = frame < 75;

  const isScene2 = frame >= 289 && frame < 686;
  const fB1 = 309;
  const fB2 = 339;
  const fSlash = 364;
  const fInsight = 379;

  const isScene3 = frame >= 686 && frame < 1073;

  return (
    <div className="absolute inset-0 overflow-hidden select-none">
      {/* ======================================================== */}
      {/* SCENE 1: HOOK & THE PROBLEM (Frames 0 to 289)           */}
      {/* ======================================================== */}
      {isScene1 && (
        <div className="absolute inset-0 flex flex-col items-center justify-start pt-[12%] px-8">
          {isHookIntro ? (
            /* Mandatory ~2.5s Hook Intro: bespoke illustration inside editorial card */
            <div className="w-full max-w-[940px] flex flex-col items-center">
              <CinematicIllustrationCard
                imageSrc={staticFile("scene_illustration.png")}
                width={920}
                height={520}
              />
            </div>
          ) : (
            /* High-definition physical cutout anchor (450–700px, crisp shadow) */
            <div className="w-full max-w-[940px] flex flex-col items-center justify-center mt-8">
              <img
                src={staticFile("assets/burnout/brain_trapped_in_cage.png")}
                alt="Problem Cutout"
                className="w-[520px] h-auto object-contain drop-shadow-[0_28px_45px_rgba(0,0,0,0.22)]"
              />
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* SCENE 2: PROGRESSIVE MICRO-CHOREOGRAPHY & REAL-TIME SLASH */}
      {/* ======================================================== */}
      {isScene2 && (
        <div className="absolute inset-0 flex flex-col items-center justify-start pt-[14%] px-8">
          <div className="w-full max-w-[920px] flex flex-col gap-6">
            {/* Block 1: Appears on audio cue */}
            {frame >= fB1 && (
              <div className="w-full p-6 rounded-3xl bg-white border-[2.5px] border-slate-900 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.14)] flex items-center justify-between">
                <span className="text-4xl font-black text-[#090d16] uppercase">FAMILIAR PATTERN</span>
                <span className="text-2xl font-mono font-bold text-slate-500 uppercase">STATE 01</span>
              </div>
            )}

            {/* Block 2: Appears on audio cue, then gets slashed in real-time on spoken contradiction */}
            {frame >= fB2 && (
              <div className="relative w-full p-6 rounded-3xl bg-white border-[2.5px] border-slate-900 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.14)] flex items-center justify-between overflow-hidden">
                <AnimatedSlashStrike
                  startFrame={fSlash}
                  durationFrames={7}
                  preset="blade_slash"
                  color="rose"
                  strokeWidth={7}
                >
                  <span className="text-4xl font-black text-[#090d16] uppercase">NOT YOUR VALUES</span>
                </AnimatedSlashStrike>
                <span className="text-2xl font-mono font-bold text-rose-600 uppercase">REJECT</span>
              </div>
            )}

            {/* Core Insight: Slams down after the slash */}
            {frame >= fInsight && (
              <div className="w-full p-6 rounded-3xl bg-[#090d16] border-[2.5px] border-slate-900 shadow-2xl flex flex-col gap-2 text-white">
                <div className="text-2xl font-mono text-emerald-400 font-bold uppercase tracking-wider">CORE INSIGHT</div>
                <div className="text-4xl font-black leading-tight">COMFORT IS NOT CONVICTION</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SCENE 3: THE RESOLUTION / SOVEREIGN PROTOCOL             */}
      {/* ======================================================== */}
      {isScene3 && (
        <div className="absolute inset-0 flex flex-col items-center justify-start pt-[12%] px-8">
          <div className="w-full max-w-[920px] flex flex-col items-center justify-center">
            <img
              src={staticFile("assets/psychology/hyperrealistic_3d_glowing_brain.png")}
              alt="Solution Cutout"
              className="w-[560px] h-auto object-contain drop-shadow-[0_28px_45px_rgba(0,0,0,0.20)]"
            />
          </div>
        </div>
      )}
    </div>
  );
};
