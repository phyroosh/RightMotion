import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  Brain,
  Zap,
  MessageSquare,
  TrendingUp,
  Activity,
  ArrowRight,
  Eye,
  Lock,
  Award,
} from "lucide-react";
import { WordTimestamp } from "../../types";

interface CanvasProps {
  transcript: WordTimestamp[];
}

export const StrengthCanvas: React.FC<CanvasProps> = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const currentMs = (frame / fps) * 1000;

  // Cinematic slow camera push across video
  const cameraZoom = interpolate(frame, [0, durationInFrames], [1.0, 1.05], {
    extrapolateRight: "clamp",
  });

  // Smooth spring helper
  const sp = (delayMs: number, d = 18, s = 110, m = 0.8) => {
    const df = Math.floor((delayMs / 1000) * fps);
    return spring({
      frame: Math.max(0, frame - df),
      fps,
      config: { damping: d, stiffness: s, mass: m },
    });
  };

  // B-Roll Scenes Active Timings:
  // Scene 1: 3,500 - 9,100ms (The Emotional Pressure Chamber & False Armor)
  // Scene 2: 15,400 - 23,200ms (Tactical Honesty & Self-Awareness Matrix)
  // Scene 3: 23,200 - 30,100ms (The 3-Step De-escalation Protocol)
  // Scene 4: 33,600 - 38,800ms (The Courage Crucible & True Strength Finale)
  const isScene1 = currentMs >= 3500 && currentMs < 9100;
  const isScene2 = currentMs >= 15400 && currentMs < 23200;
  const isScene3 = currentMs >= 23200 && currentMs < 30100;
  const isScene4 = currentMs >= 33600 && currentMs <= 38800;

  const isBRollActive = isScene1 || isScene2 || isScene3 || isScene4;
  if (!isBRollActive) return null;

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-20 select-none overflow-hidden">
      {/* ===================================================================
          SCENE 1: THE EMOTIONAL CONTAINMENT TRAP (3,500 - 9,100ms)
          "You keep everything inside. You act like nothing bothers you. Because somehow, opening up feels weak."
      =================================================================== */}
      {isScene1 && (() => {
        const sEnter = sp(3500);
        const sPressure = sp(4800);

        // Internal pressure gauge dynamically rising from 32% to 96%
        const pressureVal = Math.min(
          96,
          Math.floor(
            interpolate(currentMs, [4800, 8500], [32, 96], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })
          )
        );

        return (
          <div className="absolute inset-x-0 top-[38%] -translate-y-1/2 flex flex-col items-center justify-center px-8">
            {/* Ghost Editorial Typography */}
            <div className="absolute -top-36 -right-6 text-[260px] font-black text-slate-900/[0.04] leading-none tracking-tighter select-none pointer-events-none">
              PRESSURE
            </div>

            {/* Large Category Header Badge */}
            <div
              className="mb-8 px-12 py-5 rounded-[28px] bg-slate-950 text-white font-mono text-[24px] font-black uppercase tracking-widest flex items-center gap-4 shadow-2xl border-[3px] border-slate-700"
              style={{
                transform: `translateY(${(1 - sEnter) * -30}px)`,
                opacity: Math.min(1, sEnter * 1.5),
              }}
            >
              <ShieldAlert className="w-9 h-9 text-rose-400 animate-pulse" />
              CASE 01 • THE EMOTIONAL ARMOR TRAP
            </div>

            {/* Hero Dual Container Card */}
            <div
              className="w-full max-w-[980px] rounded-[52px] p-10 bg-white/95 backdrop-blur-2xl border-[4px] border-slate-200/90 shadow-[0_25px_60px_rgba(0,0,0,0.08)] flex flex-col gap-8"
              style={{
                transform: `translateY(${(1 - sEnter) * 60}px) scale(${0.92 + sEnter * 0.08})`,
                opacity: Math.min(1, sEnter * 1.5),
              }}
            >
              <div className="grid grid-cols-2 gap-7">
                {/* Left: The External Mask */}
                <div className="p-8 rounded-[36px] bg-slate-50 border-[3px] border-slate-200 flex flex-col justify-between h-[300px]">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-mono text-sm font-black uppercase tracking-wider flex items-center gap-2">
                      <Lock className="w-4 h-4 text-slate-400" />
                      EXTERNAL FACADE
                    </span>
                    <span className="px-3.5 py-1 rounded-lg bg-slate-200 text-slate-700 font-mono text-xs font-black uppercase">
                      FAUX STOIC
                    </span>
                  </div>

                  <div>
                    <div className="text-slate-900 font-black text-3xl uppercase tracking-tight leading-snug">
                      "I'm Completely Fine"
                    </div>
                    <div className="text-slate-500 text-base font-bold mt-2">
                      Acting like nothing bothers you.
                    </div>
                  </div>

                  <div className="px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-600 font-mono font-black text-xs uppercase flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                    SUPPRESSING FEELINGS
                  </div>
                </div>

                {/* Right: Internal Stress Gauge */}
                <div
                  className="p-8 rounded-[36px] bg-slate-950 text-white border-[4px] border-rose-500/90 flex flex-col justify-between h-[300px] shadow-2xl relative overflow-hidden"
                  style={{
                    transform: `scale(${0.95 + sPressure * 0.05})`,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-rose-400 font-mono text-sm font-black uppercase tracking-wider flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-rose-400 animate-bounce" />
                      INTERNAL LOAD
                    </span>
                    <span className="px-4 py-1.5 rounded-xl bg-rose-500 text-white font-mono font-black text-sm shadow-md">
                      {pressureVal}% LOAD
                    </span>
                  </div>

                  <div>
                    <div className="text-white font-black text-3xl uppercase tracking-tight">
                      Bottled Pressure
                    </div>
                    <div className="w-full h-5 rounded-full bg-slate-800 mt-3 overflow-hidden border border-slate-700 p-0.5">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-600 transition-all duration-300 shadow-[0_0_12px_rgba(244,63,94,0.8)]"
                        style={{ width: `${pressureVal}%` }}
                      />
                    </div>
                  </div>

                  <div className="text-rose-300 font-mono text-xs font-black uppercase flex items-center gap-2">
                    <Activity className="w-4 h-4 text-rose-400 animate-pulse" />
                    CRITICAL CONTAINMENT OVERLOAD
                  </div>
                </div>
              </div>

              {/* Bottom Insight Callout */}
              <div className="flex items-center justify-between pt-3 border-t-2 border-slate-100">
                <span className="text-slate-700 font-bold text-2xl">
                  Silence isn't peace — it's compounding pressure.
                </span>
                <span className="font-serif italic text-3xl font-black text-[#0071e3]">
                  ✍️ "Opening up isn't weak"
                </span>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ===================================================================
          SCENE 2: TACTICAL HONESTY MATRIX (15,400 - 23,200ms)
          "A man who can calmly say, “I’m not okay,” isn’t less masculine. He’s self-aware. He knows that ignoring a problem doesn’t make it disappear."
      =================================================================== */}
      {isScene2 && (() => {
        const sShift = sp(15400);
        const sCalm = sp(16800);

        return (
          <div className="absolute inset-x-0 top-[38%] -translate-y-1/2 flex flex-col items-center justify-center px-8">
            {/* Ghost Editorial Typography */}
            <div className="absolute -top-36 -left-6 text-[260px] font-black text-slate-900/[0.04] leading-none tracking-tighter select-none pointer-events-none">
              AWARENESS
            </div>

            {/* Category Header Badge */}
            <div
              className="mb-8 px-12 py-5 rounded-[28px] bg-slate-950 text-white font-mono text-[24px] font-black uppercase tracking-widest flex items-center gap-4 shadow-2xl border-[3px] border-sky-400"
              style={{
                transform: `translateY(${(1 - sShift) * -30}px)`,
                opacity: Math.min(1, sShift * 1.5),
              }}
            >
              <Eye className="w-9 h-9 text-sky-400" />
              CASE 02 • THE TACTICAL HONESTY MATRIX
            </div>

            {/* Hero Glass Card */}
            <div
              className="w-full max-w-[980px] rounded-[52px] p-10 bg-white/95 backdrop-blur-2xl border-[4px] border-sky-200 shadow-[0_30px_90px_rgba(0,113,227,0.18)] flex flex-col gap-8"
              style={{
                transform: `translateY(${(1 - sShift) * 60}px) scale(${0.92 + sShift * 0.08})`,
                opacity: Math.min(1, sShift * 1.5),
              }}
            >
              {/* Highlight Slate */}
              <div
                className="p-8 rounded-[36px] bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white border-[3px] border-sky-400/90 shadow-2xl flex flex-col items-center text-center gap-3 relative overflow-hidden"
                style={{
                  transform: `scale(${0.95 + sCalm * 0.05})`,
                }}
              >
                <div className="px-6 py-2 rounded-full bg-sky-500/20 text-sky-300 font-mono text-xs font-black uppercase tracking-widest border border-sky-400/40">
                  CALM ADMISSION • ZERO EGO
                </div>
                <div className="text-5xl font-black uppercase tracking-tight text-white mt-1 drop-shadow-md">
                  “I’M NOT OKAY.”
                </div>
                <p className="text-slate-300 text-lg font-medium max-w-xl">
                  Calm honesty is not a loss of masculinity — it is the highest form of emotional sovereignty.
                </p>
              </div>

              {/* Contrast Sub-cards */}
              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 rounded-[28px] bg-rose-50 border-2 border-rose-200 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/15 text-rose-600 flex items-center justify-center font-black text-xl shrink-0">
                    ✕
                  </div>
                  <div>
                    <div className="text-rose-950 font-mono text-xs font-black uppercase">
                      IGNORING THE ISSUE
                    </div>
                    <div className="text-slate-700 text-base font-bold">
                      Does not make it disappear
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-[28px] bg-emerald-50 border-2 border-emerald-300 flex items-center gap-4">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 shrink-0" />
                  <div>
                    <div className="text-emerald-950 font-mono text-xs font-black uppercase">
                      SELF-AWARE CLARITY
                    </div>
                    <div className="text-slate-900 text-base font-bold">
                      Faces reality & solves it
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Insight Callout */}
              <div className="flex items-center justify-between pt-3 border-t-2 border-slate-100">
                <span className="text-slate-700 font-bold text-2xl">
                  Knowing when you need support is strategic power.
                </span>
                <span className="font-serif italic text-3xl font-black text-[#0071e3]">
                  ✍️ "Denial is not endurance"
                </span>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ===================================================================
          SCENE 3: THE 3-STEP ACTION PROTOCOL (23,200 - 30,100ms)
          "Sometimes the strongest thing you can do is talk to someone you trust, think clearly, and deal with the problem instead of hiding it."
      =================================================================== */}
      {isScene3 && (() => {
        const sProtocol = sp(23200);
        const sStep1 = sp(25000);
        const sStep2 = sp(26800);
        const sStep3 = sp(27800);

        const isStep1Active = currentMs >= 25000;
        const isStep2Active = currentMs >= 26800;
        const isStep3Active = currentMs >= 27800;

        return (
          <div className="absolute inset-x-0 top-[38%] -translate-y-1/2 flex flex-col items-center justify-center px-8">
            {/* Ghost Editorial Typography */}
            <div className="absolute -top-36 -right-6 text-[260px] font-black text-slate-900/[0.04] leading-none tracking-tighter select-none pointer-events-none">
              ACTION
            </div>

            {/* Category Header Badge */}
            <div
              className="mb-8 px-12 py-5 rounded-[28px] bg-slate-950 text-white font-mono text-[24px] font-black uppercase tracking-widest flex items-center gap-4 shadow-2xl border-[3px] border-indigo-400"
              style={{
                transform: `translateY(${(1 - sProtocol) * -30}px)`,
                opacity: Math.min(1, sProtocol * 1.5),
              }}
            >
              <TrendingUp className="w-9 h-9 text-indigo-400" />
              THE RESOLUTION PROTOCOL • 3 STEPS
            </div>

            {/* 3 Steps Stack Card */}
            <div
              className="w-full max-w-[980px] rounded-[52px] p-10 bg-white/95 backdrop-blur-2xl border-[4px] border-indigo-200 shadow-2xl flex flex-col gap-6"
              style={{
                transform: `translateY(${(1 - sProtocol) * 60}px) scale(${0.92 + sProtocol * 0.08})`,
                opacity: Math.min(1, sProtocol * 1.5),
              }}
            >
              {/* Step 1: Talk */}
              <div
                className={`p-6 rounded-[28px] border-2 flex items-center justify-between transition-all ${
                  isStep1Active
                    ? "bg-indigo-50/80 border-indigo-300 shadow-md"
                    : "bg-slate-50 border-slate-200 opacity-40"
                }`}
                style={{
                  transform: `translateX(${(1 - sStep1) * -30}px)`,
                }}
              >
                <div className="flex items-center gap-5">
                  <div className={`w-14 h-14 rounded-2xl ${isStep1Active ? "bg-indigo-600" : "bg-slate-400"} text-white font-black text-2xl flex items-center justify-center shadow-lg`}>
                    01
                  </div>
                  <div>
                    <div className="text-slate-950 font-black text-2xl uppercase tracking-tight">
                      Talk To Someone You Trust
                    </div>
                    <div className="text-slate-600 text-base font-medium mt-0.5">
                      Break the silent isolation and speak reality out loud.
                    </div>
                  </div>
                </div>
                <MessageSquare className={`w-8 h-8 ${isStep1Active ? "text-indigo-600" : "text-slate-400"} shrink-0`} />
              </div>

              {/* Step 2: Think Clearly */}
              <div
                className={`p-6 rounded-[28px] border-2 flex items-center justify-between transition-all ${
                  isStep2Active
                    ? "bg-sky-50/80 border-sky-300 shadow-md"
                    : "bg-slate-50 border-slate-200 opacity-40"
                }`}
                style={{
                  transform: `translateX(${(1 - sStep2) * 30}px)`,
                }}
              >
                <div className="flex items-center gap-5">
                  <div className={`w-14 h-14 rounded-2xl ${isStep2Active ? "bg-sky-600" : "bg-slate-400"} text-white font-black text-2xl flex items-center justify-center shadow-lg`}>
                    02
                  </div>
                  <div>
                    <div className="text-slate-950 font-black text-2xl uppercase tracking-tight">
                      Think With Calm Clarity
                    </div>
                    <div className="text-slate-600 text-base font-medium mt-0.5">
                      Separate objective facts from panic and dread.
                    </div>
                  </div>
                </div>
                <Brain className={`w-8 h-8 ${isStep2Active ? "text-sky-600" : "text-slate-400"} shrink-0`} />
              </div>

              {/* Step 3: Deal with It */}
              <div
                className={`p-6 rounded-[28px] border-[3px] flex items-center justify-between transition-all ${
                  isStep3Active
                    ? "bg-slate-950 text-white border-emerald-400 shadow-xl"
                    : "bg-slate-50 text-slate-400 border-slate-200 opacity-40"
                }`}
                style={{
                  transform: `translateX(${(1 - sStep3) * -30}px)`,
                }}
              >
                <div className="flex items-center gap-5">
                  <div className={`w-14 h-14 rounded-2xl ${isStep3Active ? "bg-emerald-500 text-slate-950" : "bg-slate-400 text-white"} font-black text-2xl flex items-center justify-center shadow-lg`}>
                    03
                  </div>
                  <div>
                    <div className={`${isStep3Active ? "text-white" : "text-slate-700"} font-black text-2xl uppercase tracking-tight`}>
                      Deal With The Problem
                    </div>
                    <div className={`${isStep3Active ? "text-emerald-300" : "text-slate-500"} text-base font-medium mt-0.5`}>
                      Execute direct solutions instead of hiding from them.
                    </div>
                  </div>
                </div>
                <Zap className={`w-8 h-8 ${isStep3Active ? "text-emerald-400" : "text-slate-400"} shrink-0`} />
              </div>

              {/* Bottom Insight Callout */}
              <div className="flex items-center justify-between pt-2 border-t-2 border-slate-100">
                <span className="text-slate-700 font-bold text-2xl">
                  Decisive action solves what worrying prolongs.
                </span>
                <span className="font-serif italic text-3xl font-black text-[#0071e3]">
                  ✍️ "Clarity comes from communication"
                </span>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ===================================================================
          SCENE 4: TRUE STRENGTH MASTER DEFINITION (33,600 - 38,800ms)
          "Real strength isn’t having no weakness. It’s having the courage to face what’s actually there."
      =================================================================== */}
      {isScene4 && (() => {
        const sFinale = sp(33600);
        const sCourage = sp(35800);

        return (
          <div className="absolute inset-x-0 top-[38%] -translate-y-1/2 flex flex-col items-center justify-center px-8">
            {/* Ghost Editorial Typography */}
            <div className="absolute -top-36 -left-6 text-[260px] font-black text-slate-900/[0.04] leading-none tracking-tighter select-none pointer-events-none">
              COURAGE
            </div>

            {/* Category Header Badge */}
            <div
              className="mb-8 px-12 py-5 rounded-[28px] bg-slate-950 text-white font-mono text-[24px] font-black uppercase tracking-widest flex items-center gap-4 shadow-2xl border-[3px] border-sky-400"
              style={{
                transform: `translateY(${(1 - sFinale) * -30}px)`,
                opacity: Math.min(1, sFinale * 1.5),
              }}
            >
              <Sparkles className="w-9 h-9 text-sky-400 animate-spin" />
              THE DEFINITION OF TRUE STRENGTH
            </div>

            {/* Grand Finale Card */}
            <div
              className="w-full max-w-[980px] rounded-[52px] p-12 bg-slate-950 text-white border-[4px] border-sky-400 shadow-[0_30px_90px_rgba(0,113,227,0.35)] flex flex-col items-center text-center gap-8 relative overflow-hidden"
              style={{
                transform: `scale(${0.92 + sFinale * 0.08})`,
                opacity: Math.min(1, sFinale * 1.5),
              }}
            >
              <div className="flex items-center gap-4">
                <div className="px-6 py-3 rounded-2xl bg-slate-900 text-slate-400 font-mono text-sm font-black uppercase line-through border border-slate-800">
                  ZERO WEAKNESS = FANTASY
                </div>
                <div className="px-6 py-3 rounded-2xl bg-sky-500/20 text-sky-300 font-mono text-sm font-black uppercase border border-sky-400/40">
                  FACING REALITY = TRUE POWER
                </div>
              </div>

              <div
                className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-white leading-tight"
                style={{
                  transform: `scale(${0.96 + sCourage * 0.04})`,
                }}
              >
                “It’s Having The Courage To Face What’s Actually There.”
              </div>

              <div className="font-serif italic text-3xl font-black text-sky-300 pt-3 border-t border-slate-800 w-full">
                ✍️ "Drop the armor. You don't have to carry it alone."
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
