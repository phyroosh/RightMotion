import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  Smartphone,
  Clock,
  Zap,
  Lock,
  Compass,
  ArrowRight,
  Flame,
  Gauge,
  RotateCw,
  AlertTriangle,
  Radio,
  CheckCircle2,
  Sparkles,
  Focus,
  Sliders,
} from "lucide-react";
import { WordTimestamp } from "../../types";

interface CanvasProps {
  transcript: WordTimestamp[];
}

export const ADHDCanvas: React.FC<CanvasProps> = () => {
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

  // Only render B-Roll Motion Graphics during explanatory scenes (2.3s to 6.4s, and 14.2s to 39.4s)
  const isScene1 = currentMs >= 2300 && currentMs < 6400;
  const isScene2 = currentMs >= 14200 && currentMs < 28400;
  const isScene3 = currentMs >= 34000 && currentMs < 39400;

  const isBRollActive = isScene1 || isScene2 || isScene3;
  if (!isBRollActive) return null;

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-20 select-none overflow-hidden">
      {/* ===================================================================
          SCENE 1: THE 20-MINUTE TIME WARP (2,300 - 6,400ms)
          "You open your phone for one thing… and somehow twenty minutes disappear."
      =================================================================== */}
      {isScene1 && (() => {
        const sPhone = sp(2300);
        const sMinutes = sp(4300);

        // Minutes counter going rapidly from 0 to 20
        const minutesDisappeared = Math.floor(
          interpolate(currentMs, [4300, 6000], [1, 20], {
            extrapolateRight: "clamp",
          })
        );

        return (
          <div className="absolute inset-x-0 top-[42%] -translate-y-1/2 flex flex-col items-center justify-center px-8">
            <div className="absolute -top-36 -right-6 text-[280px] font-black text-slate-900/[0.05] leading-none tracking-tighter select-none pointer-events-none">
              LOOP
            </div>

            {/* Category Header Badge (Large Mobile Ready) */}
            <div
              className="mb-8 px-12 py-5 rounded-[28px] bg-slate-950 text-white font-mono text-[24px] font-black uppercase tracking-widest flex items-center gap-4 shadow-2xl border-2 border-slate-700"
              style={{
                transform: `translateY(${(1 - sPhone) * -30}px)`,
                opacity: Math.min(1, sPhone * 1.5),
              }}
            >
              <Smartphone className="w-9 h-9 text-indigo-400" />
              CASE 01 • THE MICRO-TRIGGER
            </div>

            {/* Tactile Phone Card */}
            <div
              className="w-full max-w-[960px] rounded-[52px] p-12 bg-white/98 border-4 border-indigo-200/90 shadow-2xl flex flex-col gap-9"
              style={{
                transform: `translateY(${(1 - sPhone) * 60}px) scale(${0.92 + sPhone * 0.08})`,
                opacity: Math.min(1, sPhone * 1.5),
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-7">
                  <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white shadow-xl">
                    <Smartphone className="w-16 h-16" />
                  </div>
                  <div>
                    <div className="text-indigo-600 font-mono text-[22px] font-black uppercase tracking-wider">
                      INTENDED: "ONE QUICK THING"
                    </div>
                    <div className="text-slate-950 font-black text-5xl uppercase tracking-tight mt-1">
                      Open Your Phone
                    </div>
                  </div>
                </div>

                <div className="px-8 py-4 rounded-2xl bg-indigo-50 border-2 border-indigo-200 text-indigo-700 font-mono font-black text-xl uppercase">
                  TRIGGER
                </div>
              </div>

              {/* Time Warp Panel */}
              {currentMs >= 4100 && (
                <div
                  className="p-9 rounded-[36px] bg-slate-950 text-white border-4 border-rose-500 shadow-[0_20px_60px_rgba(244,63,94,0.35)] flex items-center justify-between"
                  style={{
                    transform: `scale(${0.94 + sMinutes * 0.06})`,
                    opacity: Math.min(1, sMinutes * 1.6),
                  }}
                >
                  <div className="flex items-center gap-6">
                    <div className="w-22 h-22 rounded-3xl bg-rose-600/30 border-3 border-rose-400 flex items-center justify-center text-rose-400">
                      <Clock className="w-13 h-13 animate-spin" style={{ animationDuration: "3s" }} />
                    </div>
                    <div>
                      <div className="text-rose-400 font-mono text-base font-black uppercase tracking-widest flex items-center gap-2">
                        <span className="w-3.5 h-3.5 rounded-full bg-rose-500 animate-ping" />
                        TIME BLINDNESS WARP
                      </div>
                      <div className="text-white font-black text-5xl uppercase tracking-tight mt-1">
                        +{minutesDisappeared} Min Vanished
                      </div>
                    </div>
                  </div>

                  <div className="px-9 py-4 rounded-2xl bg-rose-500 text-white font-mono font-black text-2xl shadow-lg">
                    -20:00
                  </div>
                </div>
              )}

              {currentMs >= 5200 && (
                <div className="flex items-center justify-between pt-3 border-t-2 border-slate-100">
                  <span className="text-slate-600 font-bold text-2xl">
                    Attention hijacked before executive filter engages.
                  </span>
                  <span className="font-serif italic text-4xl font-black text-[#0071e3]">
                    ✍️ "20 minutes gone"
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* ===================================================================
          SCENE 2: THE DUAL-TONE SPLIT BRAIN PARADOX (14,200 - 28,400ms)
      =================================================================== */}
      {isScene2 && (() => {
        const sSplitEnter = sp(14200);

        const isLeftFocus = currentMs < 22800;
        const isRightFocus = currentMs >= 22800;

        // Animated SVG arrow trim-path progress (0 to 1)
        const arrowLeftProgress = interpolate(currentMs, [14600, 16000], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const arrowRightProgress = interpolate(currentMs, [23000, 24400], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        return (
          <div className="absolute inset-x-0 top-[42%] -translate-y-1/2 flex flex-col items-center justify-center px-8">
            <div className="absolute -top-36 -left-8 text-[280px] font-black text-slate-900/[0.05] leading-none tracking-tighter select-none pointer-events-none">
              DUAL
            </div>

            {/* Category Header Badge */}
            <div
              className="mb-8 px-12 py-5 rounded-[28px] bg-slate-950 text-white font-mono text-[24px] font-black uppercase tracking-widest flex items-center gap-4 shadow-2xl border-2 border-slate-700"
              style={{
                transform: `translateY(${(1 - sSplitEnter) * -30}px)`,
                opacity: Math.min(1, sSplitEnter * 1.5),
              }}
            >
              <Focus className="w-9 h-9 text-sky-400" />
              THE DUAL-CIRCUIT REALITY
            </div>

            {/* THE DUAL-TONE SPLIT CARD */}
            <div
              className="relative w-full max-w-[980px] h-[580px] rounded-[56px] overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.22)] border-4 border-slate-300 flex"
              style={{
                transform: `translateY(${(1 - sSplitEnter) * 50}px) scale(${0.92 + sSplitEnter * 0.08})`,
                opacity: Math.min(1, sSplitEnter * 1.5),
              }}
            >
              {/* LEFT HALF: Sage Light Muted Green */}
              <div
                className={`w-1/2 h-full p-9 flex flex-col justify-between transition-all duration-700 ${
                  isLeftFocus ? "bg-[#c6d1c4] text-slate-900" : "bg-[#c6d1c4]/75 opacity-60 text-slate-700"
                }`}
              >
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-serif italic font-black text-4xl text-slate-900">
                      Task Paralysis
                    </span>
                  </div>

                  {/* Trim-Path Vector Arrow */}
                  <svg className="w-full h-16 mt-2 overflow-visible" viewBox="0 0 200 60">
                    <path
                      d="M 10 15 Q 110 5, 185 45"
                      fill="none"
                      stroke="#1e293b"
                      strokeWidth="5"
                      strokeDasharray="220"
                      strokeDashoffset={220 * (1 - arrowLeftProgress)}
                      strokeLinecap="round"
                    />
                    {arrowLeftProgress > 0.85 && (
                      <polygon
                        points="185,45 168,40 178,28"
                        fill="#1e293b"
                      />
                    )}
                  </svg>

                  {/* Bullets */}
                  <div className="mt-4 flex flex-col gap-4 font-mono font-black">
                    <div
                      className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-white/90 border-2 border-slate-300 shadow-sm"
                      style={{ opacity: currentMs >= 15200 ? 1 : 0.2 }}
                    >
                      <Lock className="w-8 h-8 text-rose-600 flex-shrink-0" />
                      <span className="text-slate-950 uppercase text-[22px]">Want To Start</span>
                    </div>

                    <div
                      className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-white/90 border-2 border-slate-300 shadow-sm"
                      style={{ opacity: currentMs >= 17000 ? 1 : 0.2 }}
                    >
                      <CheckCircle2 className="w-8 h-8 text-slate-800 flex-shrink-0" />
                      <span className="text-slate-950 uppercase text-[22px]">Know What To Do</span>
                    </div>

                    <div
                      className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-rose-500 text-white shadow-md border-2 border-rose-400"
                      style={{ opacity: currentMs >= 19200 ? 1 : 0.2 }}
                    >
                      <AlertTriangle className="w-8 h-8 text-amber-200 flex-shrink-0 animate-bounce" />
                      <span className="uppercase text-[22px]">Physically Stuck</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t-2 border-slate-400/50 font-serif italic font-black text-[30px] text-slate-950">
                  ✍️ "executive dysfunction"
                </div>
              </div>

              {/* RIGHT HALF: Deep Electric Indigo */}
              <div
                className={`w-1/2 h-full p-9 flex flex-col justify-between transition-all duration-700 ${
                  isRightFocus ? "bg-[#0f172a] text-white" : "bg-[#0f172a]/80 opacity-60 text-slate-300"
                }`}
              >
                <div className="flex flex-col items-end text-right">
                  <div className="flex items-center gap-3">
                    <span className="font-serif italic font-black text-4xl text-sky-400">
                      Hyperfocus Engine
                    </span>
                  </div>

                  {/* Trim-Path Vector Arrow */}
                  <svg className="w-full h-16 mt-2 overflow-visible" viewBox="0 0 200 60">
                    <path
                      d="M 190 15 Q 90 5, 15 45"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="5"
                      strokeDasharray="220"
                      strokeDashoffset={220 * (1 - arrowRightProgress)}
                      strokeLinecap="round"
                    />
                    {arrowRightProgress > 0.85 && (
                      <polygon
                        points="15,45 32,40 22,28"
                        fill="#38bdf8"
                      />
                    )}
                  </svg>

                  {/* Bullets */}
                  <div className="mt-4 flex flex-col gap-4 font-mono font-black w-full items-end">
                    <div
                      className="flex items-center justify-end gap-4 px-6 py-4 rounded-2xl bg-white/15 border border-sky-400/40 text-sky-200 shadow-sm w-full"
                      style={{ opacity: currentMs >= 23200 ? 1 : 0.2 }}
                    >
                      <span className="uppercase text-[22px]">Hours of Deep Flow</span>
                      <Flame className="w-8 h-8 text-amber-400 flex-shrink-0 animate-pulse" />
                    </div>

                    <div
                      className="flex items-center justify-end gap-4 px-6 py-4 rounded-2xl bg-white/15 border border-sky-400/40 text-sky-200 shadow-sm w-full"
                      style={{ opacity: currentMs >= 25200 ? 1 : 0.2 }}
                    >
                      <span className="uppercase text-[22px]">High-Interest Task</span>
                      <Zap className="w-8 h-8 text-sky-400 flex-shrink-0" />
                    </div>

                    <div
                      className="flex items-center justify-end gap-4 px-6 py-4 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-lg w-full"
                      style={{ opacity: currentMs >= 26800 ? 1 : 0.2 }}
                    >
                      <span className="uppercase text-[22px]">Dopamine Floodgate</span>
                      <Sparkles className="w-8 h-8 text-amber-300 flex-shrink-0" />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t-2 border-slate-700/80 font-serif italic font-black text-[30px] text-sky-400 text-right">
                  ✍️ "interest-locked focus"
                </div>
              </div>

              {/* CENTERPIECE HERO 3D CLAY BRAIN */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full flex items-center justify-center pointer-events-none z-30 drop-shadow-[0_25px_40px_rgba(0,0,0,0.55)]"
                style={{
                  transform: `translate(-50%, -50%) scale(${1 + Math.sin((frame / fps) * 3) * 0.04})`,
                }}
              >
                <div className="relative w-40 h-40 rounded-[38px] bg-slate-900 border-4 border-white/90 flex items-center justify-center overflow-hidden shadow-2xl">
                  <div className="w-1/2 h-full bg-slate-400 flex items-center justify-center border-r-2 border-slate-950 relative">
                    <div className="w-12 h-12 rounded-full border-2 border-slate-600/40 flex items-center justify-center">
                      <Lock className="w-7 h-7 text-slate-900" />
                    </div>
                  </div>

                  <div className="w-1/2 h-full bg-indigo-600 flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-sky-400/35 animate-pulse" />
                    <div className="w-12 h-12 rounded-full border-2 border-sky-300/60 flex items-center justify-center relative z-10">
                      <Zap className="w-7 h-7 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ===================================================================
          SCENE 3: THE STEERING COCKPIT (34,000 - 39,400ms)
      =================================================================== */}
      {isScene3 && (() => {
        const sCockpit = sp(34000);
        const sSteer = sp(36000);

        const wheelAngle = Math.sin((frame / fps) * 4) * 22;

        return (
          <div className="absolute inset-x-0 top-[42%] -translate-y-1/2 flex flex-col items-center justify-center px-8">
            <div className="absolute -top-36 -right-6 text-[280px] font-black text-slate-900/[0.05] leading-none tracking-tighter select-none pointer-events-none">
              STEER
            </div>

            {/* Category Header Badge */}
            <div
              className="mb-8 px-12 py-5 rounded-[28px] bg-slate-950 text-white font-mono text-[24px] font-black uppercase tracking-widest flex items-center gap-4 shadow-2xl border-2 border-slate-700"
              style={{
                transform: `translateY(${(1 - sCockpit) * -30}px)`,
                opacity: Math.min(1, sCockpit * 1.5),
              }}
            >
              <Compass className="w-9 h-9 text-amber-400" />
              THE REGULATION MECHANISM
            </div>

            <div
              className="w-full max-w-[980px] rounded-[52px] p-12 bg-white/98 border-4 border-amber-300 shadow-2xl flex flex-col gap-8"
              style={{
                transform: `translateY(${(1 - sCockpit) * 60}px) scale(${0.92 + sCockpit * 0.08})`,
                opacity: Math.min(1, sCockpit * 1.5),
              }}
            >
              <div className="grid grid-cols-2 gap-7">
                {/* 1. ATTENTION TANK */}
                <div className="p-8 rounded-[36px] bg-slate-50 border-3 border-slate-200 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-mono text-[18px] font-black uppercase">
                      FUEL CAPACITY
                    </span>
                    <span className="px-5 py-2 rounded-xl bg-emerald-100 text-emerald-800 font-mono font-black text-[18px]">
                      100% FULL
                    </span>
                  </div>

                  <div className="text-slate-950 font-black text-4xl uppercase tracking-tight">
                    Attention Volume
                  </div>

                  <div className="w-full h-6 rounded-full bg-slate-200 overflow-hidden relative">
                    <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 w-full" />
                  </div>
                  <span className="text-slate-600 text-xl font-bold">
                    Plenty of mental energy available.
                  </span>
                </div>

                {/* 2. STEERING WHEEL HUD */}
                <div
                  className="p-8 rounded-[36px] bg-slate-950 text-white border-4 border-amber-400 flex flex-col justify-between shadow-xl"
                  style={{
                    transform: `scale(${0.95 + sSteer * 0.05})`,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-amber-400 font-mono text-[18px] font-black uppercase flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-amber-400 animate-ping" />
                      THE BOTTLENECK
                    </span>
                    <span className="px-5 py-2 rounded-xl bg-amber-400 text-slate-950 font-mono font-black text-[18px]">
                      STEERING LOCK
                    </span>
                  </div>

                  <div className="flex items-center justify-between my-2">
                    <div>
                      <div className="text-white font-black text-4xl uppercase tracking-tight">
                        Direction Control
                      </div>
                      <div className="text-slate-300 text-xl font-bold mt-1">
                        Hard to steer to low-dopamine tasks
                      </div>
                    </div>

                    <div
                      className="w-20 h-20 rounded-3xl bg-amber-500/20 border-3 border-amber-400 flex items-center justify-center text-amber-400 shadow-md"
                      style={{ transform: `rotate(${wheelAngle}deg)` }}
                    >
                      <RotateCw className="w-12 h-12" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Insight Script Callout */}
              <div className="flex items-center justify-between pt-3 border-t-2 border-slate-100">
                <span className="text-slate-700 font-bold text-2xl">
                  Not a lack of willpower — an executive steering challenge.
                </span>
                <span className="font-serif italic text-4xl font-black text-[#0071e3]">
                  ✍️ "regulation, not deficit"
                </span>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
