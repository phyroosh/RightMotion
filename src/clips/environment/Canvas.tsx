import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  Brain,
  Sparkles,
  Zap,
  RotateCcw,
  AlertTriangle,
  Flame,
  CheckCircle2,
  XCircle,
  Clock,
  Activity,
  Compass,
  Eye,
  Users,
  Sliders,
  BatteryCharging,
  BatteryLow,
  ArrowRight,
  ShieldAlert,
  Target,
  Sparkle,
  Layers,
} from "lucide-react";
import { WordTimestamp } from "../../types";

interface CanvasProps {
  transcript: WordTimestamp[];
}

export const EnvironmentCanvas: React.FC<CanvasProps> = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const currentMs = (frame / fps) * 1000;

  // Continuous subtle cinematic slow camera push
  const cameraZoom = interpolate(frame, [0, durationInFrames], [1.0, 1.05], {
    extrapolateRight: "clamp",
  });

  // Soft continuous harmonic floating motion
  const ambientFloat = Math.sin(frame * 0.03) * 4;

  // Snappy spring helper with Apple mass-spring-damper physics
  const sp = (delayMs: number, d = 20, s = 95, m = 0.85) => {
    const df = Math.floor((delayMs / 1000) * fps);
    return spring({
      frame: Math.max(0, frame - df),
      fps,
      config: { damping: d, stiffness: s, mass: m },
    });
  };

  // Scene time windows
  const isScene2 = currentMs >= 7000 && currentMs < 11200;
  const isScene3 = currentMs >= 11200 && currentMs < 19500;
  const isScene4 = currentMs >= 19500 && currentMs < 24800;
  const isScene5 = currentMs >= 24800 && currentMs < 31000;

  const isCanvasActive = isScene2 || isScene3 || isScene4 || isScene5;
  if (!isCanvasActive) return null;

  return (
    <div
      className="absolute inset-0 w-full h-full pointer-events-none z-20 select-none overflow-hidden"
      style={{ transform: `scale(${cameraZoom})`, transformOrigin: "center center" }}
    >
      {/* ===================================================================
          SCENE 2: THE WILLPOWER STACK UNDER FRICTION (7,000 - 11,200ms)
          "You can have discipline, goals, even a really strong mindset..."
      =================================================================== */}
      {isScene2 && (() => {
        const sCard = sp(7000);
        const sDisc = sp(7500);
        const sGoal = sp(8400);
        const sMind = sp(9400);

        return (
          <div className="absolute inset-x-0 top-[45%] -translate-y-1/2 flex flex-col items-center justify-center px-6">
            <div
              className="relative w-full max-w-[1000px] flex flex-col items-center"
              style={{
                transform: `translateY(${(1 - sCard) * 50 + ambientFloat}px)`,
                opacity: Math.min(1, sCard * 1.5),
              }}
            >
              {/* Category Pill */}
              <div className="mb-6 px-9 py-3.5 rounded-full bg-slate-950 text-indigo-300 font-mono text-2xl font-black uppercase tracking-widest flex items-center gap-3.5 shadow-2xl border-2 border-indigo-500/50">
                <Target className="w-8 h-8 text-indigo-400" />
                THE INTENTION STACK
              </div>

              {/* Main Visual Glass Card */}
              <div className="w-full rounded-[56px] p-10 bg-white/98 border-[5px] border-indigo-200 shadow-2xl flex flex-col items-center text-center gap-7">
                <div className="text-5xl font-black text-slate-950 leading-tight">
                  High Discipline & Strong Mindset
                </div>

                {/* 3 Metric Stack Rows */}
                <div className="w-full flex flex-col gap-4">
                  {/* Row 1: Discipline */}
                  <div
                    className="w-full p-5 rounded-3xl bg-indigo-50 border-3 border-indigo-200 flex items-center justify-between shadow-sm"
                    style={{
                      transform: `scale(${0.9 + sDisc * 0.1})`,
                      opacity: Math.min(1, sDisc * 1.5),
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
                        <Zap className="w-8 h-8 text-amber-300" />
                      </div>
                      <span className="text-3xl font-black text-slate-900">Personal Discipline</span>
                    </div>
                    <span className="px-5 py-2 rounded-2xl bg-indigo-600 text-white font-mono text-2xl font-black">
                      100%
                    </span>
                  </div>

                  {/* Row 2: Goals */}
                  <div
                    className="w-full p-5 rounded-3xl bg-sky-50 border-3 border-sky-200 flex items-center justify-between shadow-sm"
                    style={{
                      transform: `scale(${0.9 + sGoal * 0.1})`,
                      opacity: Math.min(1, sGoal * 1.5),
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-sky-600 flex items-center justify-center text-white shadow-md">
                        <Target className="w-8 h-8 text-white" />
                      </div>
                      <span className="text-3xl font-black text-slate-900">Clear Goals</span>
                    </div>
                    <span className="px-5 py-2 rounded-2xl bg-sky-600 text-white font-mono text-2xl font-black">
                      DEFINED
                    </span>
                  </div>

                  {/* Row 3: Strong Mindset */}
                  <div
                    className="w-full p-5 rounded-3xl bg-amber-50 border-3 border-amber-200 flex items-center justify-between shadow-sm"
                    style={{
                      transform: `scale(${0.9 + sMind * 0.1})`,
                      opacity: Math.min(1, sMind * 1.5),
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-md">
                        <Brain className="w-8 h-8 text-white" />
                      </div>
                      <span className="text-3xl font-black text-slate-900">Strong Mindset</span>
                    </div>
                    <span className="px-5 py-2 rounded-2xl bg-amber-500 text-white font-mono text-2xl font-black">
                      PEAK
                    </span>
                  </div>
                </div>

                {/* Subtitle Badge */}
                <div className="text-2xl font-black text-slate-600 italic">
                  "Yet smart people still repeat bad choices..."
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ===================================================================
          SCENE 3: THE SOCIAL GRAVITY WELL & EXHAUSTION (11,200 - 19,500ms)
          "…but if the people around you normalize procrastination, negativity, or unhealthy habits, resisting that every day gets exhausting."
      =================================================================== */}
      {isScene3 && (() => {
        const sCard = sp(11200);
        const sTrap1 = sp(12800);
        const sTrap2 = sp(14300);
        const sTrap3 = sp(15400);
        const sDrain = sp(16800);

        const drainLevel = interpolate(sDrain, [0, 1], [100, 14]);

        return (
          <div className="absolute inset-x-0 top-[45%] -translate-y-1/2 flex flex-col items-center justify-center px-6">
            <div
              className="relative w-full max-w-[1000px] flex flex-col items-center"
              style={{
                transform: `translateY(${(1 - sCard) * 50 + ambientFloat}px)`,
                opacity: Math.min(1, sCard * 1.5),
              }}
            >
              {/* Category Pill */}
              <div className="mb-6 px-9 py-3.5 rounded-full bg-slate-950 text-rose-300 font-mono text-2xl font-black uppercase tracking-widest flex items-center gap-3.5 shadow-2xl border-2 border-rose-500/50">
                <ShieldAlert className="w-8 h-8 text-rose-400 animate-pulse" />
                THE NORMALIZATION TRAP
              </div>

              {/* Main Visual Glass Card */}
              <div className="w-full rounded-[56px] p-9 bg-white/98 border-[5px] border-rose-200 shadow-2xl flex flex-col items-center text-center gap-6">
                <div className="text-5xl font-black text-slate-950 leading-tight">
                  When Your Environment Normalizes:
                </div>

                {/* 3 Normalized Traps */}
                <div className="w-full flex flex-col gap-3.5">
                  {/* Trap 1: Procrastination */}
                  <div
                    className="w-full p-4 rounded-3xl bg-rose-50 border-3 border-rose-200 flex items-center justify-between shadow-sm"
                    style={{
                      transform: `translateX(${(1 - sTrap1) * 40}px)`,
                      opacity: Math.min(1, sTrap1 * 1.5),
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-rose-500 flex items-center justify-center text-white shadow-md">
                        <Clock className="w-8 h-8" />
                      </div>
                      <span className="text-3xl font-black text-slate-900">Procrastination</span>
                    </div>
                    <span className="px-5 py-2 rounded-2xl bg-rose-100 text-rose-800 font-mono text-xl font-black">
                      "DO IT TOMORROW"
                    </span>
                  </div>

                  {/* Trap 2: Negativity */}
                  <div
                    className="w-full p-4 rounded-3xl bg-rose-50 border-3 border-rose-200 flex items-center justify-between shadow-sm"
                    style={{
                      transform: `translateX(${(1 - sTrap2) * 40}px)`,
                      opacity: Math.min(1, sTrap2 * 1.5),
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-rose-600 flex items-center justify-center text-white shadow-md">
                        <AlertTriangle className="w-8 h-8" />
                      </div>
                      <span className="text-3xl font-black text-slate-900">Negativity & Cynicism</span>
                    </div>
                    <span className="px-5 py-2 rounded-2xl bg-rose-100 text-rose-800 font-mono text-xl font-black">
                      "WHY BOTHER?"
                    </span>
                  </div>

                  {/* Trap 3: Unhealthy Habits */}
                  <div
                    className="w-full p-4 rounded-3xl bg-rose-50 border-3 border-rose-200 flex items-center justify-between shadow-sm"
                    style={{
                      transform: `translateX(${(1 - sTrap3) * 40}px)`,
                      opacity: Math.min(1, sTrap3 * 1.5),
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-rose-700 flex items-center justify-center text-white shadow-md">
                        <XCircle className="w-8 h-8" />
                      </div>
                      <span className="text-3xl font-black text-slate-900">Unhealthy Defaults</span>
                    </div>
                    <span className="px-5 py-2 rounded-2xl bg-rose-100 text-rose-800 font-mono text-xl font-black">
                      "JUST THIS ONCE"
                    </span>
                  </div>
                </div>

                {/* Willpower Battery Drain Bar */}
                <div
                  className="w-full p-5 rounded-3xl bg-slate-900 text-white flex flex-col gap-3 shadow-xl"
                  style={{ opacity: Math.min(1, sDrain * 1.5) }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <BatteryLow className="w-8 h-8 text-rose-400 animate-pulse" />
                      <span className="text-2xl font-black tracking-wide">Daily Willpower Reserve:</span>
                    </div>
                    <span className="text-2xl font-mono font-black text-rose-400">
                      {Math.round(drainLevel)}% (EXHAUSTED)
                    </span>
                  </div>
                  <div className="w-full h-5 rounded-full bg-slate-800 overflow-hidden border border-slate-700">
                    <div
                      className="h-full bg-gradient-to-r from-rose-500 to-amber-500 transition-all duration-300"
                      style={{ width: `${drainLevel}%` }}
                    />
                  </div>
                  <span className="text-xl font-bold text-slate-300">
                    Resisting constant social friction every day burns out anyone.
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ===================================================================
          SCENE 4: BRAIN ADAPTS TO NORMALITY (19,500 - 24,800ms)
          "Your brain adapts to what feels normal. So sometimes, you don't need more motivation. You need a different environment."
      =================================================================== */}
      {isScene4 && (() => {
        const sCard = sp(19500);
        const sBrain = sp(20000);
        const sContrast = sp(22200);
        const sSolution = sp(23600);

        return (
          <div className="absolute inset-x-0 top-[45%] -translate-y-1/2 flex flex-col items-center justify-center px-6">
            <div
              className="relative w-full max-w-[1000px] flex flex-col items-center"
              style={{
                transform: `translateY(${(1 - sCard) * 50 + ambientFloat}px)`,
                opacity: Math.min(1, sCard * 1.5),
              }}
            >
              {/* Category Pill */}
              <div className="mb-6 px-9 py-3.5 rounded-full bg-slate-950 text-emerald-300 font-mono text-2xl font-black uppercase tracking-widest flex items-center gap-3.5 shadow-2xl border-2 border-emerald-500/50">
                <Brain className="w-8 h-8 text-emerald-400" />
                NEURAL ADAPTATION PRINCIPLE
              </div>

              {/* Main Visual Glass Card */}
              <div className="w-full rounded-[56px] p-9 bg-white/98 border-[5px] border-emerald-200 shadow-2xl flex flex-col items-center text-center gap-6">
                <div className="text-5xl font-black text-slate-950 leading-tight">
                  Your Brain Adapts To What Feels Normal
                </div>

                {/* Neural Normalization Loop Graphic */}
                <div
                  className="w-full p-6 rounded-3xl bg-slate-50 border-3 border-slate-200 flex items-center justify-around shadow-sm"
                  style={{
                    transform: `scale(${0.92 + sBrain * 0.08})`,
                    opacity: Math.min(1, sBrain * 1.5),
                  }}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
                      <Eye className="w-9 h-9" />
                    </div>
                    <span className="text-2xl font-black text-slate-900">SURROUNDINGS</span>
                    <span className="text-xl font-bold text-slate-500">Repeated Signals</span>
                  </div>

                  <ArrowRight className="w-10 h-10 text-indigo-400 animate-pulse" />

                  <div className="flex flex-col items-center gap-2">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
                      <Brain className="w-9 h-9" />
                    </div>
                    <span className="text-2xl font-black text-slate-900">BASELINE</span>
                    <span className="text-xl font-bold text-slate-500">What Feels Normal</span>
                  </div>

                  <ArrowRight className="w-10 h-10 text-emerald-400 animate-pulse" />

                  <div className="flex flex-col items-center gap-2">
                    <div className="w-16 h-16 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-md">
                      <Zap className="w-9 h-9" />
                    </div>
                    <span className="text-2xl font-black text-slate-900">CHOICES</span>
                    <span className="text-xl font-bold text-slate-500">Automatic Habits</span>
                  </div>
                </div>

                {/* Core Contrast Paradigm */}
                <div className="w-full grid grid-cols-2 gap-4">
                  {/* Left: Wrong Way */}
                  <div
                    className="p-6 rounded-3xl bg-rose-50 border-3 border-rose-200 flex flex-col items-center gap-3 opacity-70"
                    style={{
                      transform: `translateY(${(1 - sContrast) * 30}px)`,
                      opacity: Math.min(0.8, sContrast),
                    }}
                  >
                    <div className="flex items-center gap-2 text-rose-700 font-mono text-xl font-black">
                      <XCircle className="w-6 h-6" />
                      NOT MORE MOTIVATION
                    </div>
                    <span className="text-2xl font-black text-slate-800">Fights Endless Friction</span>
                  </div>

                  {/* Right: The Solution */}
                  <div
                    className="p-6 rounded-3xl bg-emerald-500 text-white border-4 border-emerald-300 flex flex-col items-center gap-3 shadow-xl"
                    style={{
                      transform: `scale(${0.9 + sSolution * 0.1})`,
                      opacity: Math.min(1, sSolution * 1.5),
                    }}
                  >
                    <div className="flex items-center gap-2 text-emerald-100 font-mono text-xl font-black">
                      <CheckCircle2 className="w-7 h-7 text-emerald-200" />
                      DIFFERENT ENVIRONMENT
                    </div>
                    <span className="text-2xl font-black text-white">Makes Right Moves Natural</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ===================================================================
          SCENE 5: THE 3 ARCHITECTURE LEVERS (24,800 - 31,000ms)
          "Change what you see. Who you spend time with. What you make easy."
      =================================================================== */}
      {isScene5 && (() => {
        const sCard = sp(24800);
        const sLev1 = sp(26800);
        const sLev2 = sp(28200);
        const sLev3 = sp(29400);

        return (
          <div className="absolute inset-x-0 top-[45%] -translate-y-1/2 flex flex-col items-center justify-center px-6">
            <div
              className="relative w-full max-w-[1000px] flex flex-col items-center"
              style={{
                transform: `translateY(${(1 - sCard) * 50 + ambientFloat}px)`,
                opacity: Math.min(1, sCard * 1.5),
              }}
            >
              {/* Category Pill */}
              <div className="mb-6 px-9 py-3.5 rounded-full bg-slate-950 text-amber-300 font-mono text-2xl font-black uppercase tracking-widest flex items-center gap-3.5 shadow-2xl border-2 border-amber-500/50">
                <Sliders className="w-8 h-8 text-amber-400" />
                THE 3 ARCHITECTURE LEVERS
              </div>

              {/* Main Visual Glass Card */}
              <div className="w-full rounded-[56px] p-9 bg-white/98 border-[5px] border-amber-200 shadow-2xl flex flex-col items-center text-center gap-5">
                <div className="text-5xl font-black text-slate-950 leading-tight">
                  Design Your New Environment
                </div>

                {/* 3 Levers */}
                <div className="w-full flex flex-col gap-4">
                  {/* Lever 1: What You See */}
                  <div
                    className="w-full p-5 rounded-3xl bg-indigo-50 border-3 border-indigo-200 flex items-center justify-between shadow-sm"
                    style={{
                      transform: `scale(${0.92 + sLev1 * 0.08})`,
                      opacity: Math.min(1, sLev1 * 1.5),
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
                        <Eye className="w-9 h-9" />
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-3xl font-black text-slate-950">1. What You See</span>
                        <span className="text-xl font-bold text-indigo-700">Clear cues & trigger removal</span>
                      </div>
                    </div>
                    <span className="px-5 py-2.5 rounded-2xl bg-indigo-600 text-white font-mono text-xl font-black">
                      VISUAL FIELD
                    </span>
                  </div>

                  {/* Lever 2: Who You Spend Time With */}
                  <div
                    className="w-full p-5 rounded-3xl bg-sky-50 border-3 border-sky-200 flex items-center justify-between shadow-sm"
                    style={{
                      transform: `scale(${0.92 + sLev2 * 0.08})`,
                      opacity: Math.min(1, sLev2 * 1.5),
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-sky-600 flex items-center justify-center text-white shadow-md">
                        <Users className="w-9 h-9" />
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-3xl font-black text-slate-950">2. Who You Spend Time With</span>
                        <span className="text-xl font-bold text-sky-700">People with high positive standards</span>
                      </div>
                    </div>
                    <span className="px-5 py-2.5 rounded-2xl bg-sky-600 text-white font-mono text-xl font-black">
                      SOCIAL GRAVITY
                    </span>
                  </div>

                  {/* Lever 3: What You Make Easy */}
                  <div
                    className="w-full p-5 rounded-3xl bg-emerald-50 border-3 border-emerald-200 flex items-center justify-between shadow-sm"
                    style={{
                      transform: `scale(${0.92 + sLev3 * 0.08})`,
                      opacity: Math.min(1, sLev3 * 1.5),
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
                        <Zap className="w-9 h-9" />
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-3xl font-black text-slate-950">3. What You Make Easy</span>
                        <span className="text-xl font-bold text-emerald-700">Zero-friction path to good choices</span>
                      </div>
                    </div>
                    <span className="px-5 py-2.5 rounded-2xl bg-emerald-600 text-white font-mono text-xl font-black">
                      LOW FRICTION
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
