import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import {
  Film,
  Camera,
  Eye,
  EyeOff,
  DollarSign,
  PartyPopper,
  Plane,
  AlertCircle,
  TrendingUp,
  Award,
  BookOpen,
  Sparkles,
  Layers,
  Flag,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { WordTimestamp } from "../../types";
import {
  MotionKeyframeBox,
  MotionKeyframe,
  interpolateTrack,
} from "../../components/MotionKeyframeBox";

interface CanvasProps {
  transcript: WordTimestamp[];
}

export const ChaptersCanvas: React.FC<CanvasProps> = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const currentMs = (frame / fps) * 1000;

  // Global slow camera push
  const cameraZoom = interpolateTrack(
    currentMs,
    [
      { timeMs: 0, value: 1.0 },
      { timeMs: durationInFrames * (1000 / fps), value: 1.045 },
    ]
  );

  const isBRollActive =
    (currentMs >= 7100 && currentMs < 18600) ||
    (currentMs >= 18400 && currentMs < 28900) ||
    (currentMs >= 37200 && currentMs < 42400);

  if (!isBRollActive) return null;

  return (
    <div
      className="absolute inset-0 w-full h-full pointer-events-none z-20 select-none overflow-hidden"
      style={{ transform: `scale(${cameraZoom})`, transformOrigin: "center center" }}
    >
      {/* ========================================================================= */}
      {/* SCENE 1: The Asymmetric Filter (7.2s - 18.5s)                             */}
      {/* ========================================================================= */}
      {currentMs >= 7100 && currentMs < 18600 && (
        <div className="absolute inset-0 flex flex-col items-center justify-start pt-[220px] px-10">
          {/* 1. Header Pill */}
          <MotionKeyframeBox
            currentMs={currentMs}
            keyframes={[
              { timeMs: 7200, opacity: 0, scale: 0.9, y: -25 },
              { timeMs: 7650, opacity: 1, scale: 1.0, y: 0 },
              { timeMs: 17900, opacity: 1, scale: 1.02, y: -4 },
              { timeMs: 18450, opacity: 0, scale: 0.94, y: -20 },
            ]}
            className="apple-glass px-10 py-4 rounded-full border-[3px] border-amber-200/80 shadow-xl flex items-center gap-4 mb-8"
          >
            <Film className="text-amber-600" style={{ width: 36, height: 36 }} />
            <span className="text-slate-900 font-extrabold tracking-wider uppercase" style={{ fontSize: 32 }}>
              PERSPECTIVE 01 • THE ASYMMETRIC FILTER
            </span>
          </MotionKeyframeBox>

          {/* 2. Highlight Reel vs Behind The Scenes Card */}
          <div className="w-full max-w-[960px] flex flex-col gap-6">
            {/* Top: Someone Else's Highlight Reel */}
            <MotionKeyframeBox
              currentMs={currentMs}
              keyframes={[
                { timeMs: 7500, opacity: 0, scale: 0.93, y: 35 },
                { timeMs: 8000, opacity: 1, scale: 1.0, y: 0 },
                { timeMs: 17900, opacity: 1, scale: 1.015, y: -3 },
                { timeMs: 18450, opacity: 0, scale: 0.94, y: 30 },
              ]}
              className="rounded-[36px] p-8 border-[4px] shadow-2xl bg-white border-amber-300"
              style={{
                boxShadow: "0 25px 60px rgba(245, 158, 11, 0.16)",
              }}
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 font-black text-2xl shadow-inner">
                    <Camera style={{ width: 32, height: 32 }} />
                  </div>
                  <div>
                    <div className="text-slate-950 font-black text-3xl tracking-tight">THEIR HIGHLIGHT REEL</div>
                    <div className="text-amber-600 font-bold text-lg uppercase tracking-wider">
                      Public Wins • Curated Moments
                    </div>
                  </div>
                </div>
                <span className="px-5 py-2 rounded-full bg-amber-500 text-slate-950 font-black text-lg tracking-wider uppercase">
                  VISIBLE
                </span>
              </div>

              {/* 3 Pills: Money, Fun, Vacations */}
              <div className="grid grid-cols-3 gap-4">
                <MotionKeyframeBox
                  currentMs={currentMs}
                  keyframes={[
                    { timeMs: 8000, opacity: 0.5, scale: 0.95 },
                    { timeMs: 15000, opacity: 0.5, scale: 0.95 },
                    { timeMs: 15300, opacity: 1.0, scale: 1.06 },
                    { timeMs: 15600, opacity: 1.0, scale: 1.0 },
                  ]}
                  className="p-4 rounded-2xl border-[3px] flex flex-col items-center gap-2"
                  style={{
                    backgroundColor: currentMs >= 15000 ? "#fef3c7" : "#f8fafc",
                    borderColor: currentMs >= 15000 ? "#f59e0b" : "#e2e8f0",
                  }}
                >
                  <DollarSign className={currentMs >= 15000 ? "text-amber-600" : "text-slate-400"} style={{ width: 36, height: 36 }} />
                  <span className="text-slate-900 font-extrabold text-xl">MONEY</span>
                </MotionKeyframeBox>

                <MotionKeyframeBox
                  currentMs={currentMs}
                  keyframes={[
                    { timeMs: 8000, opacity: 0.5, scale: 0.95 },
                    { timeMs: 15600, opacity: 0.5, scale: 0.95 },
                    { timeMs: 15900, opacity: 1.0, scale: 1.06 },
                    { timeMs: 16200, opacity: 1.0, scale: 1.0 },
                  ]}
                  className="p-4 rounded-2xl border-[3px] flex flex-col items-center gap-2"
                  style={{
                    backgroundColor: currentMs >= 15600 ? "#fef3c7" : "#f8fafc",
                    borderColor: currentMs >= 15600 ? "#f59e0b" : "#e2e8f0",
                  }}
                >
                  <PartyPopper className={currentMs >= 15600 ? "text-amber-600" : "text-slate-400"} style={{ width: 36, height: 36 }} />
                  <span className="text-slate-900 font-extrabold text-xl">FUN</span>
                </MotionKeyframeBox>

                <MotionKeyframeBox
                  currentMs={currentMs}
                  keyframes={[
                    { timeMs: 8000, opacity: 0.5, scale: 0.95 },
                    { timeMs: 16400, opacity: 0.5, scale: 0.95 },
                    { timeMs: 16700, opacity: 1.0, scale: 1.06 },
                    { timeMs: 17000, opacity: 1.0, scale: 1.0 },
                  ]}
                  className="p-4 rounded-2xl border-[3px] flex flex-col items-center gap-2"
                  style={{
                    backgroundColor: currentMs >= 16400 ? "#fef3c7" : "#f8fafc",
                    borderColor: currentMs >= 16400 ? "#f59e0b" : "#e2e8f0",
                  }}
                >
                  <Plane className={currentMs >= 16400 ? "text-amber-600" : "text-slate-400"} style={{ width: 36, height: 36 }} />
                  <span className="text-slate-900 font-extrabold text-xl">VACATIONS</span>
                </MotionKeyframeBox>
              </div>
            </MotionKeyframeBox>

            {/* Bottom: Your Behind The Scenes */}
            <MotionKeyframeBox
              currentMs={currentMs}
              keyframes={[
                { timeMs: 11200, opacity: 0, scale: 0.93, y: 35 },
                { timeMs: 11700, opacity: 1, scale: 1.0, y: 0 },
                { timeMs: 17900, opacity: 1, scale: 1.015, y: -3 },
                { timeMs: 18450, opacity: 0, scale: 0.94, y: 30 },
              ]}
              className="rounded-[36px] p-8 border-[4px] shadow-2xl bg-slate-950 text-white border-sky-400"
              style={{
                boxShadow: "0 25px 60px rgba(14, 165, 233, 0.22)",
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400 font-black text-2xl shadow-inner">
                    <EyeOff style={{ width: 32, height: 32 }} />
                  </div>
                  <div>
                    <div className="font-black text-3xl tracking-tight text-white">YOUR BEHIND-THE-SCENES</div>
                    <div className="text-sky-400 font-bold text-lg uppercase tracking-wider">
                      Daily Calculations • Hidden Grit
                    </div>
                  </div>
                </div>
                <span className="px-5 py-2 rounded-full bg-slate-800 text-sky-300 font-black text-lg tracking-wider uppercase border border-sky-400/40">
                  REAL EFFORT
                </span>
              </div>
            </MotionKeyframeBox>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCENE 2: The Asymmetric Starting Point (18.5s - 28.8s)                    */}
      {/* ========================================================================= */}
      {currentMs >= 18400 && currentMs < 28900 && (
        <div className="absolute inset-0 flex flex-col items-center justify-start pt-[220px] px-10">
          {/* 1. Header Pill */}
          <MotionKeyframeBox
            currentMs={currentMs}
            keyframes={[
              { timeMs: 18500, opacity: 0, scale: 0.9, y: -25 },
              { timeMs: 18950, opacity: 1, scale: 1.0, y: 0 },
              { timeMs: 28200, opacity: 1, scale: 1.02, y: -4 },
              { timeMs: 28700, opacity: 0, scale: 0.94, y: -20 },
            ]}
            className="apple-glass px-10 py-4 rounded-full border-[3px] border-indigo-200/80 shadow-xl flex items-center gap-4 mb-8"
          >
            <Flag className="text-indigo-600" style={{ width: 36, height: 36 }} />
            <span className="text-slate-900 font-extrabold tracking-wider uppercase" style={{ fontSize: 32 }}>
              REALITY 02 • THE STARTING LINE
            </span>
          </MotionKeyframeBox>

          {/* 2. The 3 Staggered Track Lanes */}
          <div className="w-full max-w-[960px] flex flex-col gap-5">
            {/* Lane 1: More Money */}
            <MotionKeyframeBox
              currentMs={currentMs}
              keyframes={[
                { timeMs: 19500, opacity: 0, scale: 0.93, y: 30 },
                { timeMs: 20000, opacity: 1, scale: 1.0, y: 0 },
                { timeMs: 28200, opacity: 1, scale: 1.015, y: -3 },
                { timeMs: 28700, opacity: 0, scale: 0.94, y: 25 },
              ]}
              className="rounded-[32px] p-6 bg-white border-[3px] border-slate-200 shadow-xl flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-black text-xl">
                  01
                </div>
                <div>
                  <div className="text-slate-950 font-black text-2xl">MORE FINANCIAL CAPITAL</div>
                  <div className="text-slate-500 font-bold text-base">Inherent buffer & security</div>
                </div>
              </div>
              <span className="px-4 py-1.5 rounded-xl bg-amber-50 text-amber-700 font-black text-base uppercase">
                ADVANCED START
              </span>
            </MotionKeyframeBox>

            {/* Lane 2: Better Opportunities */}
            <MotionKeyframeBox
              currentMs={currentMs}
              keyframes={[
                { timeMs: 24500, opacity: 0, scale: 0.93, y: 30 },
                { timeMs: 25000, opacity: 1, scale: 1.0, y: 0 },
                { timeMs: 28200, opacity: 1, scale: 1.015, y: -3 },
                { timeMs: 28700, opacity: 0, scale: 0.94, y: 25 },
              ]}
              className="rounded-[32px] p-6 bg-white border-[3px] border-slate-200 shadow-xl flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-black text-xl">
                  02
                </div>
                <div>
                  <div className="text-slate-950 font-black text-2xl">EARLY OPPORTUNITIES</div>
                  <div className="text-slate-500 font-bold text-base">Open doors & connections</div>
                </div>
              </div>
              <span className="px-4 py-1.5 rounded-xl bg-sky-50 text-sky-700 font-black text-base uppercase">
                DIRECT ACCESS
              </span>
            </MotionKeyframeBox>

            {/* Lane 3: Built Resilience */}
            <MotionKeyframeBox
              currentMs={currentMs}
              keyframes={[
                { timeMs: 26000, opacity: 0, scale: 0.93, y: 30 },
                { timeMs: 26500, opacity: 1, scale: 1.0, y: 0 },
                { timeMs: 28200, opacity: 1, scale: 1.015, y: -3 },
                { timeMs: 28700, opacity: 0, scale: 0.94, y: 25 },
              ]}
              className="rounded-[32px] p-6 bg-gradient-to-r from-indigo-900 to-slate-950 text-white border-[3px] border-indigo-400 shadow-2xl flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/30 text-indigo-300 flex items-center justify-center font-black text-xl border border-indigo-400/40">
                  03
                </div>
                <div>
                  <div className="text-white font-black text-2xl">SELF-BUILT RESILIENCE</div>
                  <div className="text-indigo-300 font-bold text-base">True compounding strength</div>
                </div>
              </div>
              <span className="px-4 py-1.5 rounded-xl bg-indigo-500 text-white font-black text-base uppercase">
                YOUR ADVANTAGE
              </span>
            </MotionKeyframeBox>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCENE 3: The Chapter vs Whole Story Horizon (37.3s - 42.3s)                */}
      {/* ========================================================================= */}
      {currentMs >= 37200 && currentMs < 42400 && (
        <div className="absolute inset-0 flex flex-col items-center justify-start pt-[220px] px-10">
          {/* 1. Header Pill */}
          <MotionKeyframeBox
            currentMs={currentMs}
            keyframes={[
              { timeMs: 37300, opacity: 0, scale: 0.9, y: -25 },
              { timeMs: 37700, opacity: 1, scale: 1.0, y: 0 },
              { timeMs: 41800, opacity: 1, scale: 1.02, y: -4 },
              { timeMs: 42300, opacity: 0, scale: 0.94, y: -20 },
            ]}
            className="apple-glass px-10 py-4 rounded-full border-[3px] border-sky-300 shadow-xl flex items-center gap-4 mb-8"
          >
            <BookOpen className="text-sky-600" style={{ width: 36, height: 36 }} />
            <span className="text-slate-900 font-extrabold tracking-wider uppercase" style={{ fontSize: 32 }}>
              PERSPECTIVE 03 • THE UNFINISHED BOOK
            </span>
          </MotionKeyframeBox>

          {/* 2. Hero Chapter Card */}
          <MotionKeyframeBox
            currentMs={currentMs}
            keyframes={[
              { timeMs: 37600, opacity: 0, scale: 0.93, y: 40 },
              { timeMs: 38100, opacity: 1, scale: 1.0, y: 0 },
              { timeMs: 41800, opacity: 1, scale: 1.025, y: -4 },
              { timeMs: 42300, opacity: 0, scale: 0.94, y: 35 },
            ]}
            className="w-full max-w-[960px] apple-card rounded-[44px] p-10 border-[5px] border-slate-200/90 shadow-[0_40px_90px_rgba(0,0,0,0.12)] bg-white/95 flex flex-col items-center text-center"
          >
            <div className="px-6 py-2 rounded-full bg-sky-100 border-[2px] border-sky-300 text-sky-900 font-black text-xl tracking-wider uppercase mb-6 flex items-center gap-3">
              <Sparkles className="text-sky-600" style={{ width: 28, height: 28 }} />
              DIFFICULT CHAPTER IN PROGRESS
            </div>

            <div className="text-slate-950 font-black text-5xl tracking-tight leading-[1.2] mb-8">
              A HARD CHAPTER IS <br />
              <span className="px-4 py-1 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-xl inline-block mt-2">
                NOT THE WHOLE STORY
              </span>
            </div>

            {/* Chapter progress meter */}
            <div className="w-full bg-slate-100 rounded-3xl p-6 border-[3px] border-slate-200 flex flex-col gap-3">
              <div className="flex justify-between items-center text-slate-600 font-extrabold text-lg uppercase tracking-wider">
                <span>Current Volume</span>
                <span className="text-sky-600 font-black">STILL BEING WRITTEN</span>
              </div>
              <div className="w-full h-5 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-sky-500 to-indigo-600 rounded-full w-[65%]" />
              </div>
            </div>
          </MotionKeyframeBox>
        </div>
      )}
    </div>
  );
};
