import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Repeat,
  HeartHandshake,
  Users,
  Lock,
  ArrowRight,
  Zap,
} from "lucide-react";
import { WordTimestamp } from "../../types";

interface CanvasProps {
  transcript: WordTimestamp[];
}

export const SayingNoCanvas: React.FC<CanvasProps> = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const currentMs = (frame / fps) * 1000;

  // Mass-Spring-Damper Physics (Clean Enter & Rock-Solid Stationary Lock)
  const sp = (delayMs: number, d = 20, s = 95, m = 0.85) => {
    const df = Math.floor((delayMs / 1000) * fps);
    return spring({
      frame: Math.max(0, frame - df),
      fps,
      config: { damping: d, stiffness: s, mass: m },
    });
  };

  // Scene Timings matching transcript audio:
  // Scene 1 (5,200ms - 13,800ms): The Zero-Explanation Protocol & 2 Clean Scripts
  // Scene 2 (13,800ms - 18,800ms): The Calm Repetition Shield
  // Scene 3 (18,800ms - 24,000ms): The Boundary Filter & True Allies
  const isScene1 = currentMs >= 5200 && currentMs < 13800;
  const isScene2 = currentMs >= 13800 && currentMs < 18800;
  const isScene3 = currentMs >= 18800 && currentMs < 24000;

  const isCanvasActive = isScene1 || isScene2 || isScene3;
  if (!isCanvasActive) return null;

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-20 select-none overflow-hidden">
      {/* ===================================================================
          SCENE 1: THE ZERO-EXPLANATION PROTOCOL (5,200 - 13,800ms)
          "You don’t need some huge explanation. Try, 'Nah, I’m gonna pass, but thanks for asking.' Or, 'I can’t do that, hope you get it.'"
      =================================================================== */}
      {isScene1 && (() => {
        const sEnter = sp(5200);
        const sScript1 = sp(8100);
        const sScript2 = sp(11400);

        const isScript1Active = currentMs >= 8100;
        const isScript2Active = currentMs >= 11400;

        return (
          <div className="absolute inset-x-0 top-[38%] -translate-y-1/2 flex flex-col items-center justify-center px-8">
            {/* Ghost Editorial Typography */}
            <div className="absolute -top-36 -right-6 text-[260px] font-black text-slate-900/[0.04] leading-none tracking-tighter select-none pointer-events-none">
              SCRIPTS
            </div>

            {/* Large Category Header Badge */}
            <div
              className="mb-8 px-12 py-5 rounded-[28px] bg-slate-950 text-white font-mono text-[24px] font-black uppercase tracking-widest flex items-center gap-4 shadow-2xl border-[3px] border-slate-700"
              style={{
                transform: `translateY(${(1 - sEnter) * -30}px)`,
                opacity: Math.min(1, sEnter * 1.5),
              }}
            >
              <ShieldAlert className="w-9 h-9 text-rose-400" />
              CASE 01 • ZERO-EXPLANATION BLUEPRINT
            </div>

            {/* Hero Main Glass Card */}
            <div
              className="w-full max-w-[980px] rounded-[52px] p-10 bg-white/95 backdrop-blur-2xl border-[4px] border-slate-200/90 shadow-[0_25px_60px_rgba(0,0,0,0.08)] flex flex-col gap-7"
              style={{
                transform: `translateY(${(1 - sEnter) * 50}px) scale(${0.93 + sEnter * 0.07})`,
                opacity: Math.min(1, sEnter * 1.5),
              }}
            >
              {/* Top Warning Contrast Pill */}
              <div className="px-6 py-3.5 rounded-2xl bg-rose-50 border-2 border-rose-200 text-rose-950 font-black text-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <XCircle className="w-8 h-8 text-rose-600 shrink-0" />
                  <span>THE OVER-EXPLANATION TRAP:</span>
                </div>
                <span className="font-mono text-xl text-rose-700 uppercase tracking-wide">
                  NO ESSAYS NEEDED
                </span>
              </div>

              {/* Script A Card */}
              <div
                className={`p-7 rounded-[32px] border-[3px] flex items-center justify-between transition-all ${
                  isScript1Active
                    ? "bg-slate-950 text-white border-emerald-400 shadow-xl"
                    : "bg-slate-50 text-slate-400 border-slate-200 opacity-40"
                }`}
                style={{
                  transform: `translateX(${(1 - sScript1) * -30}px)`,
                }}
              >
                <div className="flex items-center gap-5">
                  <div
                    className={`w-16 h-16 rounded-2xl ${
                      isScript1Active ? "bg-emerald-500 text-slate-950" : "bg-slate-300 text-white"
                    } font-black text-2xl flex items-center justify-center shadow-lg shrink-0`}
                  >
                    01
                  </div>
                  <div>
                    <div className="font-mono text-base font-black text-emerald-400 uppercase tracking-wider">
                      FRIENDLY & CASUAL
                    </div>
                    <div className="text-3xl font-black tracking-tight leading-snug text-white mt-1">
                      “Nah, I’m gonna pass, but thanks for asking.”
                    </div>
                  </div>
                </div>
                <MessageSquare className={`w-9 h-9 ${isScript1Active ? "text-emerald-400" : "text-slate-400"} shrink-0`} />
              </div>

              {/* Script B Card */}
              <div
                className={`p-7 rounded-[32px] border-[3px] flex items-center justify-between transition-all ${
                  isScript2Active
                    ? "bg-gradient-to-r from-slate-900 to-indigo-950 text-white border-sky-400 shadow-xl"
                    : "bg-slate-50 text-slate-400 border-slate-200 opacity-40"
                }`}
                style={{
                  transform: `translateX(${(1 - sScript2) * 30}px)`,
                }}
              >
                <div className="flex items-center gap-5">
                  <div
                    className={`w-16 h-16 rounded-2xl ${
                      isScript2Active ? "bg-sky-500 text-slate-950" : "bg-slate-300 text-white"
                    } font-black text-2xl flex items-center justify-center shadow-lg shrink-0`}
                  >
                    02
                  </div>
                  <div>
                    <div className="font-mono text-base font-black text-sky-300 uppercase tracking-wider">
                      DIRECT & RESPECTFUL
                    </div>
                    <div className="text-3xl font-black tracking-tight leading-snug text-white mt-1">
                      “I can’t do that, hope you get it.”
                    </div>
                  </div>
                </div>
                <CheckCircle2 className={`w-9 h-9 ${isScript2Active ? "text-sky-400" : "text-slate-400"} shrink-0`} />
              </div>

              {/* Bottom Insight Callout */}
              <div className="flex items-center justify-between pt-2 border-t-2 border-slate-100">
                <span className="text-slate-700 font-bold text-2xl">
                  Short answers leave no room for debates.
                </span>
                <span className="font-serif italic text-3xl font-black text-[#0071e3]">
                  ✍️ "Clear is kind"
                </span>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ===================================================================
          SCENE 2: THE CALM REPETITION SHIELD (13,800 - 18,800ms)
          "And if they keep pushing? Just calmly repeat yourself. You don’t have to argue."
      =================================================================== */}
      {isScene2 && (() => {
        const sShield = sp(13800);
        const sCalm = sp(15500);

        return (
          <div className="absolute inset-x-0 top-[38%] -translate-y-1/2 flex flex-col items-center justify-center px-8">
            {/* Ghost Editorial Typography */}
            <div className="absolute -top-36 -left-6 text-[260px] font-black text-slate-900/[0.04] leading-none tracking-tighter select-none pointer-events-none">
              SHIELD
            </div>

            {/* Large Category Header Badge */}
            <div
              className="mb-8 px-12 py-5 rounded-[28px] bg-slate-950 text-white font-mono text-[24px] font-black uppercase tracking-widest flex items-center gap-4 shadow-2xl border-[3px] border-amber-400"
              style={{
                transform: `translateY(${(1 - sShield) * -30}px)`,
                opacity: Math.min(1, sShield * 1.5),
              }}
            >
              <Repeat className="w-9 h-9 text-amber-400 animate-spin" style={{ animationDuration: "12s" }} />
              CASE 02 • THE CALM REPETITION SHIELD
            </div>

            {/* Hero Glass Card */}
            <div
              className="w-full max-w-[980px] rounded-[52px] p-10 bg-white/95 backdrop-blur-2xl border-[4px] border-amber-200 shadow-[0_30px_90px_rgba(245,158,11,0.18)] flex flex-col gap-8"
              style={{
                transform: `translateY(${(1 - sShield) * 50}px) scale(${0.93 + sShield * 0.07})`,
                opacity: Math.min(1, sShield * 1.5),
              }}
            >
              {/* Highlight Center Slate */}
              <div
                className="p-8 rounded-[36px] bg-slate-950 text-white border-[3px] border-amber-400/90 shadow-2xl flex flex-col items-center text-center gap-4 relative overflow-hidden"
                style={{
                  transform: `scale(${0.96 + sCalm * 0.04})`,
                }}
              >
                <div className="px-6 py-2 rounded-full bg-amber-500/20 text-amber-300 font-mono text-sm font-black uppercase tracking-widest border border-amber-400/40">
                  THE BROKEN RECORD RULE
                </div>
                <div className="text-5xl font-black uppercase tracking-tight text-white mt-1 drop-shadow-md">
                  “CALMLY REPEAT YOURSELF.”
                </div>
                <div className="px-8 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-slate-300 font-black text-2xl uppercase">
                  ⚡ YOU DO NOT HAVE TO ARGUE
                </div>
              </div>

              {/* Contrast Sub-cards */}
              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 rounded-[28px] bg-rose-50 border-2 border-rose-200 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-rose-500/15 text-rose-600 flex items-center justify-center font-black text-2xl shrink-0">
                    ✕
                  </div>
                  <div>
                    <div className="text-rose-950 font-mono text-xs font-black uppercase">
                      ARGUING / DEFENDING
                    </div>
                    <div className="text-slate-700 text-lg font-bold">
                      Implies boundary is negotiable
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-[28px] bg-emerald-50 border-2 border-emerald-300 flex items-center gap-4">
                  <CheckCircle2 className="w-14 h-14 text-emerald-600 shrink-0" />
                  <div>
                    <div className="text-emerald-950 font-mono text-xs font-black uppercase">
                      CALM CONSISTENCY
                    </div>
                    <div className="text-slate-900 text-lg font-bold">
                      Stands firm like a solid wall
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Insight Callout */}
              <div className="flex items-center justify-between pt-3 border-t-2 border-slate-100">
                <span className="text-slate-700 font-bold text-2xl">
                  Persistence does not obligate compliance.
                </span>
                <span className="font-serif italic text-3xl font-black text-[#0071e3]">
                  ✍️ "Repetition wins over drama"
                </span>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ===================================================================
          SCENE 3: THE BOUNDARY FILTER & TRUE FRIENDS (18,800 - 24,000ms)
          "The people worth keeping around won’t need you to betray your own boundaries just to stay friends."
      =================================================================== */}
      {isScene3 && (() => {
        const sFilter = sp(18800);
        const sAlliance = sp(20800);

        return (
          <div className="absolute inset-x-0 top-[38%] -translate-y-1/2 flex flex-col items-center justify-center px-8">
            {/* Ghost Editorial Typography */}
            <div className="absolute -top-36 -right-6 text-[260px] font-black text-slate-900/[0.04] leading-none tracking-tighter select-none pointer-events-none">
              RESPECT
            </div>

            {/* Large Category Header Badge */}
            <div
              className="mb-8 px-12 py-5 rounded-[28px] bg-slate-950 text-white font-mono text-[24px] font-black uppercase tracking-widest flex items-center gap-4 shadow-2xl border-[3px] border-indigo-400"
              style={{
                transform: `translateY(${(1 - sFilter) * -30}px)`,
                opacity: Math.min(1, sFilter * 1.5),
              }}
            >
              <Users className="w-9 h-9 text-indigo-400" />
              CASE 03 • THE REAL RELATIONSHIP FILTER
            </div>

            {/* Hero Glass Card */}
            <div
              className="w-full max-w-[980px] rounded-[52px] p-10 bg-white/95 backdrop-blur-2xl border-[4px] border-indigo-200 shadow-2xl flex flex-col gap-8"
              style={{
                transform: `translateY(${(1 - sFilter) * 50}px) scale(${0.93 + sFilter * 0.07})`,
                opacity: Math.min(1, sFilter * 1.5),
              }}
            >
              {/* 2 Contrasting Pillars */}
              <div className="grid grid-cols-2 gap-7">
                {/* Left: Fragile Connections */}
                <div className="p-8 rounded-[36px] bg-slate-50 border-[3px] border-slate-200 flex flex-col justify-between h-[280px]">
                  <div className="flex items-center justify-between">
                    <span className="text-rose-600 font-mono text-sm font-black uppercase tracking-wider flex items-center gap-2">
                      <Lock className="w-4 h-4 text-rose-500" />
                      CONDITIONAL BONDS
                    </span>
                    <span className="px-3.5 py-1 rounded-lg bg-rose-100 text-rose-700 font-mono text-xs font-black uppercase">
                      FRAGILE
                    </span>
                  </div>

                  <div>
                    <div className="text-slate-900 font-black text-3xl uppercase tracking-tight leading-snug">
                      Require Self-Betrayal
                    </div>
                    <div className="text-slate-500 text-base font-bold mt-2">
                      Force you to cross your limits just to keep them happy.
                    </div>
                  </div>

                  <div className="px-4 py-2 rounded-2xl bg-white border border-slate-200 text-rose-600 font-mono font-black text-xs uppercase flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    DRAINS YOUR ENERGY
                  </div>
                </div>

                {/* Right: People Worth Keeping */}
                <div
                  className="p-8 rounded-[36px] bg-slate-950 text-white border-[4px] border-emerald-400/90 flex flex-col justify-between h-[280px] shadow-2xl relative overflow-hidden"
                  style={{
                    transform: `scale(${0.96 + sAlliance * 0.04})`,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-400 font-mono text-sm font-black uppercase tracking-wider flex items-center gap-2">
                      <HeartHandshake className="w-5 h-5 text-emerald-400" />
                      GENUINE ALLIES
                    </span>
                    <span className="px-3.5 py-1 rounded-lg bg-emerald-500 text-slate-950 font-mono text-xs font-black uppercase">
                      WORTH KEEPING
                    </span>
                  </div>

                  <div>
                    <div className="text-white font-black text-3xl uppercase tracking-tight leading-snug">
                      Respect Your Boundaries
                    </div>
                    <div className="text-emerald-300 text-base font-bold mt-2">
                      Never ask you to abandon yourself to stay connected.
                    </div>
                  </div>

                  <div className="text-emerald-400 font-mono text-xs font-black uppercase flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    MUTUAL RESPECT & SECURITY
                  </div>
                </div>
              </div>

              {/* Bottom Insight Callout */}
              <div className="flex items-center justify-between pt-2 border-t-2 border-slate-100">
                <span className="text-slate-700 font-bold text-2xl">
                  Real friends value your honesty, not your compliance.
                </span>
                <span className="font-serif italic text-3xl font-black text-[#0071e3]">
                  ✍️ "Respect beats pleasing"
                </span>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
