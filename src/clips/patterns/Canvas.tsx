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
  Scissors,
  Activity,
  Infinity as InfinityIcon,
  ArrowRight,
} from "lucide-react";
import { WordTimestamp } from "../../types";

interface CanvasProps {
  transcript: WordTimestamp[];
}

export const PatternsCanvas: React.FC<CanvasProps> = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const currentMs = (frame / fps) * 1000;

  // Cinematic slow camera push
  const cameraZoom = interpolate(frame, [0, durationInFrames], [1.0, 1.05], {
    extrapolateRight: "clamp",
  });

  const ambientFloat = Math.sin(frame * 0.03) * 4;

  // Snappy spring helper
  const sp = (delayMs: number, d = 20, s = 95, m = 0.85) => {
    const df = Math.floor((delayMs / 1000) * fps);
    return spring({
      frame: Math.max(0, frame - df),
      fps,
      config: { damping: d, stiffness: s, mass: m },
    });
  };

  // Scene time ranges
  const isScene2 = currentMs >= 5800 && currentMs < 9100;
  const isScene3 = currentMs >= 9100 && currentMs < 13800;
  const isScene4 = currentMs >= 13800 && currentMs < 18500;
  const isScene5 = currentMs >= 18500 && currentMs < 23200;
  const isScene6 = currentMs >= 23200 && currentMs < 27800;

  const isCanvasActive = isScene2 || isScene3 || isScene4 || isScene5 || isScene6;
  if (!isCanvasActive) return null;

  return (
    <div
      className="absolute inset-0 w-full h-full pointer-events-none z-20 select-none overflow-hidden"
      style={{ transform: `scale(${cameraZoom})`, transformOrigin: "center center" }}
    >
      {/* ===================================================================
          SCENE 2: THE OVERLOAD GAUGE (5,800 - 9,100ms)
      =================================================================== */}
      {isScene2 && (() => {
        const sCard = sp(5800);
        const sMeter = sp(6400, 15, 120, 0.7);

        const needleRotation = interpolate(sMeter, [0, 1], [-70, 75]);
        const shake = sMeter > 0.8 ? Math.sin(frame * 1.5) * 3 : 0;

        return (
          <div className="absolute inset-x-0 top-[46%] -translate-y-1/2 flex flex-col items-center justify-center px-6">
            <div
              className="relative w-full max-w-[1000px] flex flex-col items-center"
              style={{
                transform: `translateY(${(1 - sCard) * 50 + ambientFloat + shake}px)`,
                opacity: Math.min(1, sCard * 1.5),
              }}
            >
              {/* Category Pill */}
              <div className="mb-6 px-10 py-4 rounded-full bg-slate-950 text-rose-300 font-mono text-2xl font-black uppercase tracking-widest flex items-center gap-4 shadow-2xl border-2 border-rose-500/50">
                <AlertTriangle className="w-9 h-9 text-rose-400 animate-pulse" />
                SYSTEM OVERLOAD WARNING
              </div>

              {/* Main Visual Glass Card */}
              <div className="w-full rounded-[56px] p-11 bg-white/98 border-[5px] border-rose-200 shadow-2xl flex flex-col items-center text-center gap-9">
                <div className="text-5xl sm:text-6xl font-black text-slate-950 leading-tight">
                  Trying To Change The Whole Pattern At Once
                </div>

                {/* Overload Gauge Visual */}
                <div className="relative w-full max-w-[640px] h-[250px] flex flex-col items-center justify-end overflow-hidden pb-4">
                  <svg className="w-full h-full" viewBox="0 0 400 200">
                    <path
                      d="M 50 180 A 150 150 0 0 1 350 180"
                      fill="none"
                      stroke="#f1f5f9"
                      strokeWidth="34"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 50 180 A 150 150 0 0 1 150 65"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="34"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 150 65 A 150 150 0 0 1 250 65"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="34"
                    />
                    <path
                      d="M 250 65 A 150 150 0 0 1 350 180"
                      fill="none"
                      stroke="#f43f5e"
                      strokeWidth="34"
                      strokeLinecap="round"
                    />
                  </svg>

                  {/* Needle Center & Arm */}
                  <div
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 w-5 h-40 origin-bottom rounded-full bg-slate-950 shadow-2xl transition-transform"
                    style={{ transform: `translateX(-50%) rotate(${needleRotation}deg)` }}
                  >
                    <div className="w-5 h-5 rounded-full bg-rose-500 shadow-[0_0_15px_#f43f5e] mx-auto -mt-2" />
                  </div>
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-slate-950 border-4 border-white shadow-xl" />
                </div>

                {/* Overload Metric Badge */}
                <div className="w-full py-6 rounded-3xl bg-rose-50 border-3 border-rose-300 flex items-center justify-center gap-4 text-rose-700 font-mono font-black text-2xl sm:text-3xl tracking-wide">
                  <Flame className="w-9 h-9 text-rose-500 animate-bounce" />
                  <span>100% OVERHAUL = IMMEDIATE BRAIN CRASH</span>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ===================================================================
          SCENE 3: THE INFINITE ORBIT LOOP (9,100 - 13,800ms)
      =================================================================== */}
      {isScene3 && (() => {
        const sCard = sp(9100);

        const isStep1 = currentMs >= 9100 && currentMs < 10200;
        const isStep2 = currentMs >= 10200 && currentMs < 11000;
        const isStep3 = currentMs >= 11000 && currentMs < 12400;
        const isStep4 = currentMs >= 12400;

        return (
          <div className="absolute inset-x-0 top-[46%] -translate-y-1/2 flex flex-col items-center justify-center px-6">
            <div
              className="relative w-full max-w-[1000px] flex flex-col items-center"
              style={{
                transform: `translateY(${(1 - sCard) * 50 + ambientFloat}px)`,
                opacity: Math.min(1, sCard * 1.5),
              }}
            >
              {/* Header Badge */}
              <div className="mb-6 px-10 py-4 rounded-full bg-slate-950 text-amber-300 font-mono text-2xl font-black uppercase tracking-widest flex items-center gap-4 shadow-2xl border-2 border-amber-500/50">
                <RotateCcw className="w-9 h-9 text-amber-400 animate-spin" style={{ animationDuration: "6s" }} />
                THE INFINITE HABIT LOOP
              </div>

              {/* Orbital Canvas Card */}
              <div className="w-full rounded-[56px] p-9 bg-white/98 border-[5px] border-amber-200 shadow-2xl flex flex-col items-center gap-7">
                <div className="relative w-[540px] h-[540px] flex items-center justify-center">
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 540 540">
                    <circle cx="270" cy="270" r="200" fill="none" stroke="#f1f5f9" strokeWidth="20" />
                    <circle
                      cx="270"
                      cy="270"
                      r="200"
                      fill="none"
                      stroke="#fbbf24"
                      strokeWidth="8"
                      strokeDasharray="14 14"
                      className="animate-spin"
                      style={{ animationDuration: "20s", transformOrigin: "center" }}
                    />
                  </svg>

                  {/* Center Infinite Badge */}
                  <div className="w-40 h-40 rounded-full bg-slate-950 text-white flex flex-col items-center justify-center shadow-2xl border-4 border-amber-400/50 z-10">
                    <InfinityIcon className="w-14 h-14 text-amber-400" />
                    <span className="text-sm font-mono font-black tracking-widest text-amber-200 mt-1">TRAP LOOP</span>
                  </div>

                  {/* STATION 1: TOP-LEFT • MESS UP */}
                  <div
                    className={`absolute top-2 left-2 p-6 rounded-3xl border-3 flex items-center gap-4 transition-all duration-300 shadow-xl ${
                      isStep1
                        ? "bg-rose-500 text-white border-rose-300 scale-110 shadow-[0_0_35px_rgba(244,63,94,0.4)]"
                        : "bg-white text-slate-800 border-slate-200"
                    }`}
                  >
                    <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-black text-xl">
                      01
                    </div>
                    <span className="text-3xl font-black">MESS UP</span>
                  </div>

                  {/* STATION 2: TOP-RIGHT • FEEL GUILTY */}
                  <div
                    className={`absolute top-2 right-2 p-6 rounded-3xl border-3 flex items-center gap-4 transition-all duration-300 shadow-xl ${
                      isStep2
                        ? "bg-amber-500 text-white border-amber-300 scale-110 shadow-[0_0_35px_rgba(245,158,11,0.4)]"
                        : "bg-white text-slate-800 border-slate-200"
                    }`}
                  >
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-black text-xl">
                      02
                    </div>
                    <span className="text-3xl font-black">FEEL GUILTY</span>
                  </div>

                  {/* STATION 3: BOTTOM-RIGHT • PROMISE BIG */}
                  <div
                    className={`absolute bottom-2 right-2 p-6 rounded-3xl border-3 flex items-center gap-4 transition-all duration-300 shadow-xl ${
                      isStep3
                        ? "bg-sky-500 text-white border-sky-300 scale-110 shadow-[0_0_35px_rgba(14,165,233,0.4)]"
                        : "bg-white text-slate-800 border-slate-200"
                    }`}
                  >
                    <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center font-black text-xl">
                      03
                    </div>
                    <span className="text-3xl font-black">PROMISE BIG</span>
                  </div>

                  {/* STATION 4: BOTTOM-LEFT • REPEAT IT */}
                  <div
                    className={`absolute bottom-2 left-2 p-6 rounded-3xl border-3 flex items-center gap-4 transition-all duration-300 shadow-xl ${
                      isStep4
                        ? "bg-purple-600 text-white border-purple-300 scale-110 shadow-[0_0_35px_rgba(147,51,234,0.4)]"
                        : "bg-white text-slate-800 border-slate-200"
                    }`}
                  >
                    <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center font-black text-xl">
                      04
                    </div>
                    <span className="text-3xl font-black">REPEAT</span>
                  </div>
                </div>

                <div className="w-full py-5 rounded-3xl bg-slate-900 text-amber-300 font-mono font-black text-2xl flex items-center justify-center gap-4 shadow-inner">
                  <Activity className="w-7 h-7 text-amber-400 animate-pulse" />
                  <span>ENERGY CYCLES BACK TO STEP 01 AUTOMATICALLY</span>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ===================================================================
          SCENE 4: THE LASER SLICE / BREAK POINT (13,800 - 18,500ms)
      =================================================================== */}
      {isScene4 && (() => {
        const sCard = sp(13800);
        const sCut = sp(14800, 16, 110, 0.75);

        return (
          <div className="absolute inset-x-0 top-[46%] -translate-y-1/2 flex flex-col items-center justify-center px-6">
            <div
              className="relative w-full max-w-[1000px] flex flex-col items-center"
              style={{
                transform: `translateY(${(1 - sCard) * 50 + ambientFloat}px)`,
                opacity: Math.min(1, sCard * 1.5),
              }}
            >
              {/* Header Badge */}
              <div className="mb-6 px-10 py-4 rounded-full bg-slate-950 text-emerald-300 font-mono text-2xl font-black uppercase tracking-widest flex items-center gap-4 shadow-2xl border-2 border-emerald-500/50">
                <Scissors className="w-9 h-9 text-emerald-400" />
                THE INTERRUPT PROTOCOL
              </div>

              {/* Main Card */}
              <div className="w-full rounded-[56px] p-11 bg-white/98 border-[5px] border-emerald-300 shadow-2xl flex flex-col items-center text-center gap-9">
                <div className="text-5xl sm:text-6xl font-black text-slate-950 leading-tight">
                  Break The Loop At The Smallest Point
                </div>

                {/* Sliced Chain / Loop Graphic */}
                <div className="relative w-full max-w-[680px] h-[180px] rounded-3xl bg-slate-950 border-2 border-emerald-500/40 flex items-center justify-around px-8 overflow-hidden shadow-2xl">
                  <div className="flex items-center gap-4 text-slate-400 font-mono font-black text-2xl">
                    <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-white">
                      01
                    </div>
                    <span>OLD HABIT</span>
                  </div>

                  {/* Animated Laser Slice Spark in Center */}
                  <div
                    className="relative flex flex-col items-center justify-center"
                    style={{
                      transform: `scale(${0.8 + sCut * 0.4})`,
                      opacity: Math.min(1, sCut * 1.5),
                    }}
                  >
                    <div className="w-24 h-24 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-[0_0_45px_#10b981] animate-bounce">
                      <Zap className="w-13 h-13 fill-current" />
                    </div>
                    <span className="text-emerald-400 font-mono font-black text-sm tracking-widest uppercase mt-2">
                      MICRO-CUT
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-slate-400 font-mono font-black text-2xl opacity-40">
                    <span>REPEAT</span>
                    <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-white">
                      04
                    </div>
                  </div>
                </div>

                {/* Big Visual Contrast Badges */}
                <div className="grid grid-cols-2 gap-6 w-full">
                  <div className="py-7 px-5 rounded-3xl bg-rose-50 border-3 border-rose-200 flex items-center justify-center gap-4 text-rose-700 font-black text-2xl sm:text-3xl">
                    <XCircle className="w-9 h-9 text-rose-500 shrink-0" />
                    <span>DON'T FIX ALL TOMORROW</span>
                  </div>
                  <div className="py-7 px-5 rounded-3xl bg-emerald-50 border-3 border-emerald-300 flex items-center justify-center gap-4 text-emerald-800 font-black text-2xl sm:text-3xl shadow-sm">
                    <CheckCircle2 className="w-9 h-9 text-emerald-600 shrink-0" />
                    <span>CUT 1 SECOND TODAY</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ===================================================================
          SCENE 5: THE 5-SECOND THRESHOLD & 3 TACTILE SWITCHES (18,500 - 23,200ms)
      =================================================================== */}
      {isScene5 && (() => {
        const sCard = sp(18500);
        const sSwitches = sp(20200);

        return (
          <div className="absolute inset-x-0 top-[46%] -translate-y-1/2 flex flex-col items-center justify-center px-6">
            <div
              className="relative w-full max-w-[1000px] flex flex-col items-center"
              style={{
                transform: `translateY(${(1 - sCard) * 50 + ambientFloat}px)`,
                opacity: Math.min(1, sCard * 1.5),
              }}
            >
              {/* Header Badge */}
              <div className="mb-6 px-10 py-4 rounded-full bg-slate-950 text-amber-300 font-mono text-2xl font-black uppercase tracking-widest flex items-center gap-4 shadow-2xl border-2 border-amber-500/50">
                <Clock className="w-9 h-9 text-amber-400 animate-pulse" />
                THE CRUCIAL 5-SECOND THRESHOLD
              </div>

              {/* Main Card */}
              <div className="w-full rounded-[56px] p-11 bg-white/98 border-[5px] border-amber-200 shadow-2xl flex flex-col items-center text-center gap-9">
                <div className="text-5xl sm:text-6xl font-black text-slate-950 leading-tight">
                  The Exact Moment You Usually Give Up
                </div>

                {/* 3 Giant Tactical Action Cards */}
                <div className="grid grid-cols-3 gap-5 w-full">
                  {/* Switch 1: 10s Pause */}
                  <div
                    className="p-8 rounded-[36px] bg-slate-950 text-white flex flex-col items-center justify-center gap-4 shadow-2xl border-2 border-emerald-500/40 min-h-[220px]"
                    style={{
                      transform: `scale(${0.92 + sSwitches * 0.08})`,
                      opacity: Math.min(1, sSwitches * 1.5),
                    }}
                  >
                    <div className="w-18 h-18 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center shadow-lg p-3">
                      <Clock className="w-11 h-11 stroke-[2.5]" />
                    </div>
                    <div className="text-3xl font-black tracking-wide">10s PAUSE</div>
                    <div className="px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-base font-mono font-black">
                      STOPS IMPULSE
                    </div>
                  </div>

                  {/* Switch 2: 1 Breath */}
                  <div
                    className="p-8 rounded-[36px] bg-slate-950 text-white flex flex-col items-center justify-center gap-4 shadow-2xl border-2 border-sky-500/40 min-h-[220px]"
                    style={{
                      transform: `scale(${0.92 + sSwitches * 0.08})`,
                      opacity: Math.min(1, sSwitches * 1.5),
                    }}
                  >
                    <div className="w-18 h-18 rounded-2xl bg-sky-500 text-slate-950 flex items-center justify-center shadow-lg p-3">
                      <Flame className="w-11 h-11 stroke-[2.5]" />
                    </div>
                    <div className="text-3xl font-black tracking-wide">1 BREATH</div>
                    <div className="px-4 py-1.5 rounded-full bg-sky-500/20 text-sky-300 text-base font-mono font-black">
                      CALMS AMYGDALA
                    </div>
                  </div>

                  {/* Switch 3: Step Away */}
                  <div
                    className="p-8 rounded-[36px] bg-slate-950 text-white flex flex-col items-center justify-center gap-4 shadow-2xl border-2 border-purple-500/40 min-h-[220px]"
                    style={{
                      transform: `scale(${0.92 + sSwitches * 0.08})`,
                      opacity: Math.min(1, sSwitches * 1.5),
                    }}
                  >
                    <div className="w-18 h-18 rounded-2xl bg-purple-500 text-white flex items-center justify-center shadow-lg p-3">
                      <ArrowRight className="w-11 h-11 stroke-[2.5]" />
                    </div>
                    <div className="text-3xl font-black tracking-wide">STEP AWAY</div>
                    <div className="px-4 py-1.5 rounded-full bg-purple-500/20 text-purple-300 text-base font-mono font-black">
                      PHYSICAL RESET
                    </div>
                  </div>
                </div>

                {/* Hero Callout Banner */}
                <div className="w-full py-6 rounded-3xl bg-emerald-500 text-slate-950 font-black text-3xl flex items-center justify-center gap-4 shadow-xl">
                  <Sparkles className="w-8 h-8 fill-current" />
                  <span>JUST ONE SMALL INTERRUPTION</span>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ===================================================================
          SCENE 6: NEURAL PATHWAY REWIRING (23,200 - 27,800ms)
      =================================================================== */}
      {isScene6 && (() => {
        const sCard = sp(23200);
        const sPathway = sp(24500);

        return (
          <div className="absolute inset-x-0 top-[46%] -translate-y-1/2 flex flex-col items-center justify-center px-6">
            <div
              className="relative w-full max-w-[1000px] flex flex-col items-center"
              style={{
                transform: `translateY(${(1 - sCard) * 50 + ambientFloat}px)`,
                opacity: Math.min(1, sCard * 1.5),
              }}
            >
              {/* Header Badge */}
              <div className="mb-6 px-10 py-4 rounded-full bg-slate-950 text-emerald-300 font-mono text-2xl font-black uppercase tracking-widest flex items-center gap-4 shadow-2xl border-2 border-emerald-500/50">
                <Brain className="w-9 h-9 text-emerald-400 animate-pulse" />
                NEUROPLASTICITY IN ACTION
              </div>

              {/* Main Card */}
              <div className="w-full rounded-[56px] p-11 bg-white/98 border-[5px] border-emerald-300 shadow-2xl flex flex-col items-center text-center gap-9">
                <div className="text-4xl sm:text-5xl font-black text-slate-950 leading-relaxed px-4">
                  "Wait… maybe we don’t have to do this the same way anymore."
                </div>

                {/* Dual Neural Tracks SVG Graphic */}
                <div className="w-full max-w-[760px] p-7 rounded-3xl bg-slate-950 border-2 border-slate-800 flex flex-col gap-5 shadow-2xl">
                  {/* Track 1: Old Rut */}
                  <div className="w-full p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between opacity-40">
                    <div className="flex items-center gap-4">
                      <XCircle className="w-9 h-9 text-rose-500" />
                      <span className="text-slate-400 font-mono font-bold text-2xl">OLD AUTOMATIC RUT</span>
                    </div>
                    <span className="px-4 py-1.5 rounded-xl bg-rose-500/20 text-rose-400 text-lg font-mono font-black">
                      DISCONNECTING
                    </span>
                  </div>

                  {/* Track 2: New Pathway */}
                  <div
                    className="w-full p-6 rounded-2xl bg-emerald-950/60 border-2 border-emerald-500 flex items-center justify-between shadow-[0_0_35px_rgba(16,185,129,0.35)]"
                    style={{
                      transform: `scale(${0.96 + sPathway * 0.04})`,
                      opacity: Math.min(1, sPathway * 1.5),
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <Sparkles className="w-9 h-9 text-emerald-400 animate-spin" style={{ animationDuration: "8s" }} />
                      <span className="text-white font-mono font-black text-2xl">NEW NEURAL PATHWAY</span>
                    </div>
                    <span className="px-5 py-2 rounded-full bg-emerald-500 text-slate-950 text-xl font-mono font-black shadow-lg">
                      ACTIVATING NOW
                    </span>
                  </div>
                </div>

                <div className="w-full py-6 rounded-3xl bg-slate-100 border-2 border-slate-300 text-slate-900 font-black text-3xl flex items-center justify-center gap-4">
                  <CheckCircle2 className="w-9 h-9 text-emerald-600" />
                  <span>ONE DIFFERENT MOVE TODAY</span>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
