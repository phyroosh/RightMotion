import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  PauseCircle,
  BatteryCharging,
  BatteryWarning,
  Sparkles,
  Flame,
  RotateCcw,
  CheckCircle2,
  AlertOctagon,
  Heart,
  Compass,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { WordTimestamp } from "../../types";

interface CanvasProps {
  transcript: WordTimestamp[];
}

export const BreaksCanvas: React.FC<CanvasProps> = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const currentMs = (frame / fps) * 1000;

  // Cinematic slow camera push across entire video
  const cameraZoom = interpolate(frame, [0, durationInFrames], [1.0, 1.05], {
    extrapolateRight: "clamp",
  });

  // Slow buttery spring helper per editing rules
  const sp = (delayMs: number, d = 20, s = 80, m = 1.0) => {
    const df = Math.floor((delayMs / 1000) * fps);
    return spring({
      frame: Math.max(0, frame - df),
      fps,
      config: { damping: d, stiffness: s, mass: m },
    });
  };

  // B-Roll Scenes Active Timings:
  // Scene 1: 5,660 - 8,260ms (The Pause vs Quit Switch)
  // Scene 2: 12,380 - 19,560ms (The Burnout & Forced Grind Trap)
  // Scene 3: 24,600 - 28,360ms (The Tiny Unextinguished Spark)
  // Scene 4: 28,360 - 38,180ms (The Permission Badges & Waypoint)
  const isScene1 = currentMs >= 5660 && currentMs < 8260;
  const isScene2 = currentMs >= 12380 && currentMs < 19560;
  const isScene3 = currentMs >= 24600 && currentMs < 28360;
  const isScene4 = currentMs >= 28360 && currentMs < 38180;

  const isBRollActive = isScene1 || isScene2 || isScene3 || isScene4;
  if (!isBRollActive) return null;

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-20 select-none overflow-hidden">
      {/* ===================================================================
          SCENE 1: THE PAUSE VS QUIT SWITCH (5,660 - 8,260ms)
          "Just… stepping away for a while."
      =================================================================== */}
      {isScene1 && (() => {
        const sEnter = sp(5660);

        return (
          <div className="absolute inset-x-0 top-[42%] -translate-y-1/2 flex flex-col items-center justify-center px-8">
            <div className="absolute -top-36 -right-6 text-[280px] font-black text-slate-900/[0.05] leading-none tracking-tighter select-none pointer-events-none">
              PAUSE
            </div>

            {/* Category Header Badge */}
            <div
              className="mb-8 px-12 py-5 rounded-[28px] bg-slate-950 text-white font-mono text-[24px] font-black uppercase tracking-widest flex items-center gap-4 shadow-2xl border-2 border-emerald-400"
              style={{
                transform: `translateY(${(1 - sEnter) * -30}px)`,
                opacity: Math.min(1, sEnter * 1.5),
              }}
            >
              <PauseCircle className="w-9 h-9 text-emerald-400" />
              STRATEGIC RECOVERY • PAUSE != QUIT
            </div>

            {/* Tactile Switch Card */}
            <div
              className="w-full max-w-[980px] rounded-[52px] p-12 bg-white/98 border-4 border-emerald-200 shadow-2xl flex flex-col gap-9"
              style={{
                transform: `translateY(${(1 - sEnter) * 60}px) scale(${0.92 + sEnter * 0.08})`,
                opacity: Math.min(1, sEnter * 1.5),
              }}
            >
              <div className="grid grid-cols-2 gap-7">
                {/* 1. Stepping Away (Active Choice) */}
                <div className="p-8 rounded-[36px] bg-emerald-50 border-4 border-emerald-400 shadow-lg flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-700 font-mono text-base font-black uppercase">
                      INTENTIONAL REST
                    </span>
                    <span className="px-4 py-1.5 rounded-xl bg-emerald-500 text-white font-mono text-sm font-black uppercase">
                      HEALTHY
                    </span>
                  </div>
                  <div className="text-slate-950 font-black text-4xl uppercase tracking-tight my-2">
                    Stepping Away
                  </div>
                  <div className="text-emerald-800 text-lg font-bold">
                    Recharging energy for the return.
                  </div>
                </div>

                {/* 2. Quitting (False Equivalent) */}
                <div className="p-8 rounded-[36px] bg-slate-100 border-2 border-slate-300 opacity-60 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-mono text-base font-black uppercase">
                      SURRENDER
                    </span>
                    <span className="px-4 py-1.5 rounded-xl bg-slate-300 text-slate-700 font-mono text-sm font-black uppercase">
                      AVOIDED
                    </span>
                  </div>
                  <div className="text-slate-500 font-black text-4xl uppercase tracking-tight my-2 line-through">
                    Quitting
                  </div>
                  <div className="text-slate-500 text-lg font-bold">
                    Permanently walking away.
                  </div>
                </div>
              </div>

              {/* Bottom Insight Callout */}
              <div className="flex items-center justify-between pt-3 border-t-2 border-slate-100">
                <span className="text-slate-600 font-bold text-2xl">
                  A pause is part of the music, not the end of the song.
                </span>
                <span className="font-serif italic text-4xl font-black text-[#0071e3]">
                  ✍️ "Rest is productive"
                </span>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ===================================================================
          SCENE 2: THE BURNOUT & FORCED GRIND TRAP (12,380 - 19,560ms)
          "And forcing yourself to keep going doesn’t always make you stronger. Sometimes it just makes you hate the thing you once cared about."
      =================================================================== */}
      {isScene2 && (() => {
        const sTrap = sp(12380);
        const sHate = sp(16200);

        return (
          <div className="absolute inset-x-0 top-[42%] -translate-y-1/2 flex flex-col items-center justify-center px-8">
            <div className="absolute -top-36 -left-8 text-[280px] font-black text-slate-900/[0.05] leading-none tracking-tighter select-none pointer-events-none">
              GRIND
            </div>

            {/* Category Header Badge */}
            <div
              className="mb-8 px-12 py-5 rounded-[28px] bg-slate-950 text-white font-mono text-[24px] font-black uppercase tracking-widest flex items-center gap-4 shadow-2xl border-2 border-rose-500"
              style={{
                transform: `translateY(${(1 - sTrap) * -30}px)`,
                opacity: Math.min(1, sTrap * 1.5),
              }}
            >
              <BatteryWarning className="w-9 h-9 text-rose-400" />
              THE FORCED GRIND TRAP
            </div>

            {/* Dual Cost Card */}
            <div
              className="w-full max-w-[980px] rounded-[52px] p-10 bg-white/98 border-4 border-rose-200 shadow-[0_30px_90px_rgba(244,63,94,0.18)] flex flex-col gap-8"
              style={{
                transform: `translateY(${(1 - sTrap) * 60}px) scale(${0.92 + sTrap * 0.08})`,
                opacity: Math.min(1, sTrap * 1.5),
              }}
            >
              <div className="grid grid-cols-2 gap-7">
                {/* 1. Forcing Through Fatigue */}
                <div className="p-8 rounded-[36px] bg-rose-50 border-3 border-rose-300 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-rose-700 font-mono text-sm font-black uppercase">
                      FORCED EXTENSION
                    </span>
                    <AlertOctagon className="w-7 h-7 text-rose-500 animate-bounce" />
                  </div>
                  <div>
                    <div className="text-slate-950 font-black text-3xl uppercase tracking-tight">
                      Forced Grind
                    </div>
                    <div className="text-rose-900 text-lg font-bold mt-1">
                      Does not always make you stronger.
                    </div>
                  </div>
                  <div className="w-full h-4 rounded-full bg-rose-200 overflow-hidden">
                    <div className="w-[8%] h-full bg-rose-600 animate-pulse" />
                  </div>
                </div>

                {/* 2. Resentment Risk */}
                <div
                  className="p-8 rounded-[36px] bg-slate-950 text-white border-4 border-rose-500 shadow-xl flex flex-col justify-between"
                  style={{
                    transform: `scale(${0.94 + sHate * 0.06})`,
                    opacity: Math.min(1, sHate * 1.5),
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-rose-400 font-mono text-sm font-black uppercase flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
                      THE HIDDEN DANGER
                    </span>
                    <Heart className="w-6 h-6 text-rose-400" />
                  </div>

                  <div>
                    <div className="text-white font-black text-3xl uppercase tracking-tight">
                      Loss of Love
                    </div>
                    <div className="text-slate-300 text-lg font-medium mt-1">
                      Hating the thing you once cared deeply about.
                    </div>
                  </div>

                  <div className="px-4 py-2 rounded-xl bg-rose-500/30 border border-rose-400 text-rose-200 font-mono text-xs font-black uppercase">
                    PASSION CORROSION
                  </div>
                </div>
              </div>

              {/* Bottom Insight Script Callout */}
              <div className="flex items-center justify-between pt-3 border-t-2 border-slate-100">
                <span className="text-slate-700 font-bold text-2xl">
                  Protect your love for the craft by resting.
                </span>
                <span className="font-serif italic text-4xl font-black text-[#0071e3]">
                  ✍️ "Don't poison your passion"
                </span>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ===================================================================
          SCENE 3: THE TINY UNBROKEN SPARK (24,600 - 28,360ms)
          "But keep one tiny part of you that still says, 'I’m not done.'"
      =================================================================== */}
      {isScene3 && (() => {
        const sSpark = sp(24600);

        return (
          <div className="absolute inset-x-0 top-[42%] -translate-y-1/2 flex flex-col items-center justify-center px-8">
            <div className="absolute -top-36 -right-6 text-[280px] font-black text-slate-900/[0.05] leading-none tracking-tighter select-none pointer-events-none">
              SPARK
            </div>

            {/* Category Header Badge */}
            <div
              className="mb-8 px-12 py-5 rounded-[28px] bg-slate-950 text-white font-mono text-[24px] font-black uppercase tracking-widest flex items-center gap-4 shadow-2xl border-2 border-amber-400"
              style={{
                transform: `translateY(${(1 - sSpark) * -30}px)`,
                opacity: Math.min(1, sSpark * 1.5),
              }}
            >
              <Flame className="w-9 h-9 text-amber-400 animate-pulse" />
              THE INNER FLAME • SAFE SANCTUARY
            </div>

            {/* Glowing Sanctuary Card */}
            <div
              className="w-full max-w-[980px] rounded-[52px] p-12 bg-slate-950 text-white border-4 border-amber-400 shadow-[0_30px_90px_rgba(245,158,11,0.35)] flex flex-col items-center text-center gap-7"
              style={{
                transform: `scale(${0.92 + sSpark * 0.08})`,
                opacity: Math.min(1, sSpark * 1.5),
              }}
            >
              <div className="w-28 h-28 rounded-full bg-amber-400/20 border-4 border-amber-400 flex items-center justify-center text-amber-300 shadow-[0_0_50px_rgba(245,158,11,0.5)]">
                <Flame className="w-16 h-16 animate-bounce" />
              </div>

              <div className="font-mono text-sm font-black text-amber-300 uppercase tracking-widest">
                THE 1% CORE BELIEF
              </div>

              <div className="text-5xl font-black uppercase tracking-tight text-white leading-tight">
                “I’m Not Done.”
              </div>

              <div className="font-serif italic text-3xl font-black text-amber-300">
                ✍️ "The spark stays alive while you rest"
              </div>
            </div>
          </div>
        );
      })()}

      {/* ===================================================================
          SCENE 4: PERMISSION BADGES & STARTING AGAIN (28,360 - 38,180ms)
          "You can stop for weeks. You can lose momentum. You can even feel like you’ve fallen behind. And when you’re ready, you can start again."
      =================================================================== */}
      {isScene4 && (() => {
        const sPermission = sp(28360);
        const sAgain = sp(35360);

        return (
          <div className="absolute inset-x-0 top-[42%] -translate-y-1/2 flex flex-col items-center justify-center px-8">
            <div className="absolute -top-36 -left-6 text-[280px] font-black text-slate-900/[0.05] leading-none tracking-tighter select-none pointer-events-none">
              RESET
            </div>

            {/* Category Header Badge */}
            <div
              className="mb-8 px-12 py-5 rounded-[28px] bg-slate-950 text-white font-mono text-[24px] font-black uppercase tracking-widest flex items-center gap-4 shadow-2xl border-2 border-emerald-400"
              style={{
                transform: `translateY(${(1 - sPermission) * -30}px)`,
                opacity: Math.min(1, sPermission * 1.5),
              }}
            >
              <ShieldCheck className="w-9 h-9 text-emerald-400" />
              TOTAL PERMISSION GRANTED
            </div>

            {/* 3-Row Permission Card */}
            <div
              className="w-full max-w-[980px] rounded-[52px] p-10 bg-white/98 border-4 border-emerald-300 shadow-2xl flex flex-col gap-6"
              style={{
                transform: `translateY(${(1 - sPermission) * 60}px) scale(${0.92 + sPermission * 0.08})`,
                opacity: Math.min(1, sPermission * 1.5),
              }}
            >
              <div className="flex flex-col gap-4">
                {/* 1. Stop for weeks */}
                <div
                  className="p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-200 flex items-center justify-between shadow-sm"
                  style={{ opacity: currentMs >= 28360 ? 1 : 0.3 }}
                >
                  <div className="flex items-center gap-4">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
                    <span className="text-slate-950 font-black text-2xl uppercase tracking-tight">
                      Stop for weeks
                    </span>
                  </div>
                  <span className="px-4 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 font-mono text-xs font-black uppercase">
                    ALLOWED
                  </span>
                </div>

                {/* 2. Lose momentum */}
                <div
                  className="p-5 rounded-2xl bg-sky-50 border-2 border-sky-200 flex items-center justify-between shadow-sm"
                  style={{ opacity: currentMs >= 30680 ? 1 : 0.3 }}
                >
                  <div className="flex items-center gap-4">
                    <CheckCircle2 className="w-8 h-8 text-sky-600 shrink-0" />
                    <span className="text-slate-950 font-black text-2xl uppercase tracking-tight">
                      Lose momentum
                    </span>
                  </div>
                  <span className="px-4 py-1.5 rounded-xl bg-sky-100 text-sky-800 font-mono text-xs font-black uppercase">
                    REBUILDABLE
                  </span>
                </div>

                {/* 3. Fell behind */}
                <div
                  className="p-5 rounded-2xl bg-purple-50 border-2 border-purple-200 flex items-center justify-between shadow-sm"
                  style={{ opacity: currentMs >= 32520 ? 1 : 0.3 }}
                >
                  <div className="flex items-center gap-4">
                    <CheckCircle2 className="w-8 h-8 text-purple-600 shrink-0" />
                    <span className="text-slate-950 font-black text-2xl uppercase tracking-tight">
                      Feel behind
                    </span>
                  </div>
                  <span className="px-4 py-1.5 rounded-xl bg-purple-100 text-purple-800 font-mono text-xs font-black uppercase">
                    TEMPORARY ILLUSION
                  </span>
                </div>

                {/* Start Again Highlight */}
                {currentMs >= 35360 && (
                  <div
                    className="p-6 rounded-2xl bg-slate-950 text-white border-3 border-emerald-400 flex items-center justify-between shadow-xl"
                    style={{
                      transform: `scale(${0.96 + sAgain * 0.04})`,
                      opacity: Math.min(1, sAgain * 1.5),
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <RotateCcw className="w-9 h-9 text-emerald-400 animate-spin" style={{ animationDuration: "6s" }} />
                      <div>
                        <div className="text-emerald-400 font-mono text-xs font-black uppercase">
                          WHEN YOU ARE READY
                        </div>
                        <div className="text-white font-black text-3xl uppercase tracking-tight">
                          Start Again
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-9 h-9 text-emerald-400 shrink-0" />
                  </div>
                )}
              </div>

              {/* Bottom Insight Script Callout */}
              <div className="flex items-center justify-between pt-2 border-t-2 border-slate-100">
                <span className="text-slate-700 font-bold text-2xl">
                  You never start from scratch — you start from experience.
                </span>
                <span className="font-serif italic text-4xl font-black text-[#0071e3]">
                  ✍️ "Resume on your terms"
                </span>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
