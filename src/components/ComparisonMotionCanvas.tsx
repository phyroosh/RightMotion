import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  XCircle,
  CheckCircle2,
  Trophy,
  Flag,
  Target,
  Zap,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Dumbbell,
  Coins,
  Crown,
  Eye,
  Crosshair,
  UserCheck,
  Scale,
  Activity,
  Milestone,
} from "lucide-react";
import { WordTimestamp } from "../types";

interface MotionGraphicsCanvasProps {
  transcript: WordTimestamp[];
}

export const ComparisonMotionCanvas: React.FC<MotionGraphicsCanvasProps> = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const currentMs = (frame / fps) * 1000;

  // Cinematic slow camera push across entire video
  const cameraZoom = interpolate(frame, [0, durationInFrames], [1.0, 1.05], {
    extrapolateRight: "clamp",
  });

  // Slow buttery spring helper per editing rules (damping: 24, mass: 1.0, stiffness: 75)
  const sp = (delayMs: number, d = 24, s = 75, m = 1.0) => {
    const df = Math.floor((delayMs / 1000) * fps);
    return spring({
      frame: Math.max(0, frame - df),
      fps,
      config: { damping: d, stiffness: s, mass: m },
    });
  };

  // Subtle continuous breathing pulse for hero elements
  const pulse = Math.sin(frame * 0.08) * 0.5 + 0.5;

  // Scene timing thresholds based on precise Whisper transcript:
  let scene = 1;
  if (currentMs >= 41000) scene = 7;
  else if (currentMs >= 34800) scene = 6;
  else if (currentMs >= 24200) scene = 5;
  else if (currentMs >= 20200) scene = 4;
  else if (currentMs >= 8600) scene = 3;
  else if (currentMs >= 3600) scene = 2;

  return (
    <div
      className="absolute inset-0 w-full h-full pointer-events-none z-20 select-none overflow-hidden"
      style={{ transform: `scale(${cameraZoom})`, transformOrigin: "center center" }}
    >
      {/* ===================================================================
          SCENE 1: THE HOOK (0 - 3,600ms)
          "You know why comparing yourself to other people never really stops?"
      =================================================================== */}
      {scene === 1 && (() => {
        const sEnter = sp(0);
        const sSub = sp(1200);

        return (
          <div className="absolute inset-x-0 top-[42%] -translate-y-1/2 flex items-center justify-center px-8">
            <div
              className="absolute -top-32 -left-10 text-[280px] font-black text-slate-900/[0.06] leading-none tracking-tighter select-none pointer-events-none"
              style={{ transform: `translateX(${(1 - sEnter) * -40}px)` }}
            >
              WHY
            </div>

            <div
              className="relative w-full max-w-[940px] rounded-[44px] p-10 apple-glass border-2 border-white/90 shadow-2xl flex flex-col gap-6"
              style={{
                transform: `translateY(${(1 - sEnter) * 70}px) rotate(-1.5deg) scale(${0.92 + sEnter * 0.08})`,
                opacity: Math.min(1, sEnter * 1.5),
              }}
            >
              <div className="flex items-center justify-between border-b border-black/5 pb-5">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-rose-500 animate-ping" />
                  <span className="font-mono text-sm font-black uppercase tracking-widest text-slate-500">
                    PSYCHOLOGICAL PATTERN • 01
                  </span>
                </div>
                <span className="px-5 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 font-mono font-black text-xs uppercase tracking-wider">
                  INFINITE LOOP
                </span>
              </div>

              <div className="flex items-center gap-7">
                <div
                  className="rounded-3xl bg-gradient-to-br from-indigo-500 to-sky-500 flex items-center justify-center flex-shrink-0 text-white shadow-lg"
                  style={{ width: 110, height: 110 }}
                >
                  <Scale className="w-16 h-16" />
                </div>
                <div className="flex-1">
                  <div className="text-slate-400 font-mono text-base font-black tracking-wider uppercase">
                    SOCIAL COMPARISON
                  </div>
                  <div className="text-slate-950 font-black text-5xl uppercase tracking-tight leading-tight mt-1">
                    Never Really Stops
                  </div>
                </div>
              </div>

              <div
                className="relative mt-2 p-5 rounded-2xl bg-sky-50/80 border border-sky-200 flex items-center justify-between"
                style={{
                  opacity: Math.min(1, sSub * 1.5),
                  transform: `translateY(${(1 - sSub) * 20}px)`,
                }}
              >
                <div className="flex items-center gap-3">
                  <Activity className="w-6 h-6 text-[#0071e3]" />
                  <span className="text-slate-800 text-xl font-bold tracking-tight">
                    Always searching for the next benchmark
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <svg className="w-8 h-8 text-[#0071e3]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 17l9.2-9.2M17 17V8H8" />
                  </svg>
                  <span className="font-serif italic text-2xl font-black text-[#0071e3] tracking-wide transform -rotate-3">
                    perpetual trap!
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ===================================================================
          SCENE 2: THE CORE MECHANISM (3,600 - 8,600ms)
          "Because every time you become better… your brain just finds someone new to compare you to."
      =================================================================== */}
      {scene === 2 && (() => {
        const sLevelUp = sp(3600);
        const sTarget = sp(5800);

        const levelUpY = interpolate(sTarget, [0, 1], [0, -250]);
        const levelUpScale = interpolate(sTarget, [0, 1], [1, 0.88]);
        const levelUpOpacity = interpolate(sTarget, [0, 1], [1, 0.45]);

        return (
          <div className="absolute inset-x-0 top-[42%] -translate-y-1/2 flex flex-col items-center justify-center px-8">
            <div className="absolute -top-32 -right-6 text-[270px] font-black text-slate-900/[0.05] leading-none tracking-tighter select-none pointer-events-none">
              CYCLE
            </div>

            <div
              className="w-full max-w-[940px] rounded-[40px] p-8 apple-glass border-2 border-emerald-300/80 shadow-2xl flex items-center gap-7"
              style={{
                transform: `translateY(${levelUpY + (1 - sLevelUp) * 50}px) scale(${levelUpScale})`,
                opacity: levelUpOpacity * Math.min(1, sLevelUp * 1.5),
              }}
            >
              <div
                className="rounded-3xl bg-emerald-500 flex items-center justify-center flex-shrink-0 text-white shadow-lg"
                style={{ width: 95, height: 95 }}
              >
                <TrendingUp className="w-13 h-13" />
              </div>
              <div className="flex-1">
                <div className="text-emerald-600 font-mono text-sm font-black uppercase tracking-wider">
                  MILESTONE REACHED
                </div>
                <div className="text-slate-950 font-black text-4xl uppercase tracking-tight mt-0.5">
                  You Become Better
                </div>
              </div>
              <div className="px-6 py-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono font-black text-sm uppercase">
                LEVEL UP +1
              </div>
            </div>

            {currentMs >= 5600 && (
              <div
                className="w-full max-w-[940px] rounded-[44px] p-9 bg-white/98 border-4 border-[#0071e3] shadow-[0_25px_70px_rgba(0,113,227,0.3)] mt-6 flex flex-col gap-5"
                style={{
                  transform: `translateY(${(1 - sTarget) * 80}px) scale(${0.92 + sTarget * 0.08})`,
                  opacity: Math.min(1, sTarget * 1.6),
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <div
                      className="rounded-3xl bg-gradient-to-br from-[#0071e3] to-[#4f46e5] flex items-center justify-center text-white shadow-lg"
                      style={{ width: 95, height: 95 }}
                    >
                      <Crosshair className="w-14 h-14 animate-spin" style={{ animationDuration: "12s" }} />
                    </div>
                    <div>
                      <div className="text-[#0071e3] font-mono text-base font-black uppercase tracking-wider flex items-center gap-2">
                        <span className="w-3.5 h-3.5 rounded-full bg-[#0071e3] animate-ping" />
                        TARGET RE-LOCKED
                      </div>
                      <div className="text-slate-950 font-black text-4xl uppercase tracking-tight mt-0.5">
                        Someone New
                      </div>
                    </div>
                  </div>
                  <div className="px-7 py-3 rounded-2xl bg-[#0071e3] text-white font-mono font-black text-base shadow-md">
                    NEW RIVAL
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <span className="text-slate-600 font-bold text-lg">
                    Brain auto-resets the baseline instantly.
                  </span>
                  <span className="font-serif italic text-2xl font-black text-[#0071e3] transform rotate-1">
                    ✍️ moves the goalpost!
                  </span>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* ===================================================================
          SCENE 3: THE 3 RAPID COMPARISONS (8,600 - 20,200ms)
      =================================================================== */}
      {scene === 3 && (() => {
        const isFit = currentMs < 11600;
        const isMoney = currentMs >= 11600 && currentMs < 15200;
        const isConfidence = currentMs >= 15200;

        const sFitEnter = sp(8600);
        const sFitRival = sp(9800);

        const sMoneyEnter = sp(11600);
        const sMoneyRival = sp(13200);

        const sConfEnter = sp(15200);
        const sConfRival = sp(17200);

        return (
          <div className="absolute inset-x-0 top-[42%] -translate-y-1/2 flex flex-col items-center justify-center px-8">
            {/* 3A: FITNESS */}
            {isFit && (
              <div
                className="relative w-full max-w-[940px] flex flex-col items-center"
                style={{
                  transform: `translateY(${(1 - sFitEnter) * 50}px)`,
                  opacity: Math.min(1, sFitEnter * 1.5),
                }}
              >
                <div className="mb-6 px-7 py-3 rounded-2xl bg-slate-900 text-white font-mono text-sm font-black uppercase tracking-widest flex items-center gap-2 shadow-lg">
                  <Dumbbell className="w-5 h-5 text-sky-400" />
                  CASE 01 • PHYSICAL FITNESS
                </div>

                <div className="relative w-full">
                  <div
                    className="w-full rounded-[40px] p-8 bg-slate-900 text-white border-2 border-slate-700 shadow-2xl flex items-center justify-between"
                    style={{
                      transform: `translateY(${interpolate(sFitRival, [0, 1], [40, -45])}px) scale(0.94)`,
                      opacity: currentMs >= 9800 ? 1 : 0.4,
                    }}
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-18 h-18 rounded-2xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400">
                        <Crown className="w-10 h-10" />
                      </div>
                      <div>
                        <div className="text-sky-400 font-mono text-xs font-black uppercase tracking-wider">
                          HIGHER STANDARD
                        </div>
                        <div className="text-white font-black text-3xl uppercase tracking-tight">
                          Someone Fitter
                        </div>
                      </div>
                    </div>
                    <div className="px-6 py-2.5 rounded-xl bg-sky-500 text-slate-950 font-mono font-black text-sm uppercase">
                      TOP 1%
                    </div>
                  </div>

                  <div
                    className="relative z-10 w-full rounded-[40px] p-9 bg-white/98 border-3 border-sky-300 shadow-2xl flex items-center justify-between"
                    style={{
                      transform: `translateY(${interpolate(sFitRival, [0, 1], [0, 15])}px)`,
                    }}
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 rounded-3xl bg-sky-500 flex items-center justify-center text-white shadow-lg">
                        <Dumbbell className="w-12 h-12" />
                      </div>
                      <div>
                        <div className="text-sky-600 font-mono text-sm font-black uppercase tracking-wider">
                          YOUR ACHIEVEMENT
                        </div>
                        <div className="text-slate-950 font-black text-4xl uppercase tracking-tight">
                          You Get Fit
                        </div>
                      </div>
                    </div>
                    <div className="px-6 py-3 rounded-2xl bg-sky-50 border border-sky-200 text-sky-700 font-mono font-black text-sm">
                      YOUR PROGRESS
                    </div>
                  </div>
                </div>

                {currentMs >= 10000 && (
                  <div className="mt-8 flex items-center gap-3 text-center">
                    <span className="font-serif italic text-2xl font-black text-[#0071e3]">
                      ✍️ "Now you notice them instantly"
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* 3B: WEALTH */}
            {isMoney && (
              <div
                className="relative w-full max-w-[940px] flex flex-col items-center"
                style={{
                  transform: `translateY(${(1 - sMoneyEnter) * 50}px)`,
                  opacity: Math.min(1, sMoneyEnter * 1.5),
                }}
              >
                <div className="mb-6 px-7 py-3 rounded-2xl bg-slate-900 text-white font-mono text-sm font-black uppercase tracking-widest flex items-center gap-2 shadow-lg">
                  <Coins className="w-5 h-5 text-amber-400" />
                  CASE 02 • WEALTH & INCOME
                </div>

                <div className="relative w-full">
                  <div
                    className="w-full rounded-[40px] p-8 bg-slate-900 text-white border-2 border-slate-700 shadow-2xl flex items-center justify-between"
                    style={{
                      transform: `translateY(${interpolate(sMoneyRival, [0, 1], [40, -45])}px) scale(0.94)`,
                      opacity: currentMs >= 13200 ? 1 : 0.4,
                    }}
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-18 h-18 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
                        <Crown className="w-10 h-10" />
                      </div>
                      <div>
                        <div className="text-amber-400 font-mono text-xs font-black uppercase tracking-wider">
                          HIGHER TIER
                        </div>
                        <div className="text-white font-black text-3xl uppercase tracking-tight">
                          Someone Richer
                        </div>
                      </div>
                    </div>
                    <div className="px-6 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-mono font-black text-sm uppercase">
                      10X TIER
                    </div>
                  </div>

                  <div
                    className="relative z-10 w-full rounded-[40px] p-9 bg-white/98 border-3 border-amber-300 shadow-2xl flex items-center justify-between"
                    style={{
                      transform: `translateY(${interpolate(sMoneyRival, [0, 1], [0, 15])}px)`,
                    }}
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 rounded-3xl bg-amber-500 flex items-center justify-center text-white shadow-lg">
                        <Coins className="w-12 h-12" />
                      </div>
                      <div>
                        <div className="text-amber-600 font-mono text-sm font-black uppercase tracking-wider">
                          YOUR ACHIEVEMENT
                        </div>
                        <div className="text-slate-950 font-black text-4xl uppercase tracking-tight">
                          Make More Money
                        </div>
                      </div>
                    </div>
                    <div className="px-6 py-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 font-mono font-black text-sm">
                      INCOME +$
                    </div>
                  </div>
                </div>

                {currentMs >= 13400 && (
                  <div className="mt-8 flex items-center gap-3 text-center">
                    <span className="font-serif italic text-2xl font-black text-[#0071e3]">
                      ✍️ "Suddenly looking upward again"
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* 3C: CONFIDENCE */}
            {isConfidence && (
              <div
                className="relative w-full max-w-[940px] flex flex-col items-center"
                style={{
                  transform: `translateY(${(1 - sConfEnter) * 50}px)`,
                  opacity: Math.min(1, sConfEnter * 1.5),
                }}
              >
                <div className="mb-6 px-7 py-3 rounded-2xl bg-slate-900 text-white font-mono text-sm font-black uppercase tracking-widest flex items-center gap-2 shadow-lg">
                  <Sparkles className="w-5 h-5 text-indigo-400" />
                  CASE 03 • CONFIDENCE & CHARISMA
                </div>

                <div className="relative w-full">
                  <div
                    className="w-full rounded-[40px] p-8 bg-slate-900 text-white border-2 border-slate-700 shadow-2xl flex items-center justify-between"
                    style={{
                      transform: `translateY(${interpolate(sConfRival, [0, 1], [40, -45])}px) scale(0.94)`,
                      opacity: currentMs >= 17200 ? 1 : 0.4,
                    }}
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-18 h-18 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-400">
                        <Sparkles className="w-10 h-10" />
                      </div>
                      <div>
                        <div className="text-indigo-400 font-mono text-xs font-black uppercase tracking-wider">
                          EFFORTLESS AURA
                        </div>
                        <div className="text-white font-black text-3xl uppercase tracking-tight">
                          Effortlessly Confident
                        </div>
                      </div>
                    </div>
                    <div className="px-6 py-2.5 rounded-xl bg-indigo-400 text-slate-950 font-mono font-black text-sm uppercase">
                      NATURAL
                    </div>
                  </div>

                  <div
                    className="relative z-10 w-full rounded-[40px] p-9 bg-white/98 border-3 border-indigo-300 shadow-2xl flex items-center justify-between"
                    style={{
                      transform: `translateY(${interpolate(sConfRival, [0, 1], [0, 15])}px)`,
                    }}
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 rounded-3xl bg-indigo-600 flex items-center justify-center text-white shadow-lg">
                        <UserCheck className="w-12 h-12" />
                      </div>
                      <div>
                        <div className="text-indigo-600 font-mono text-sm font-black uppercase tracking-wider">
                          YOUR ACHIEVEMENT
                        </div>
                        <div className="text-slate-950 font-black text-4xl uppercase tracking-tight">
                          Finally Confident
                        </div>
                      </div>
                    </div>
                    <div className="px-6 py-3 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 font-mono font-black text-sm">
                      HARD WON
                    </div>
                  </div>
                </div>

                {currentMs >= 17500 && (
                  <div className="mt-8 flex items-center gap-3 text-center">
                    <span className="font-serif italic text-2xl font-black text-[#0071e3]">
                      ✍️ "and the doubts creep back in"
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })()}

      {/* ===================================================================
          SCENE 4: MOVING FINISH LINE & THE TRAP (20,200 - 24,200ms)
      =================================================================== */}
      {scene === 4 && (() => {
        const sLine = sp(20200);
        const sTrap = sp(22700);

        const distProgress = interpolate(currentMs, [20400, 22400], [100, 1000], {
          extrapolateRight: "clamp",
        });

        return (
          <div className="absolute inset-x-0 top-[42%] -translate-y-1/2 flex flex-col items-center justify-center px-8">
            <div className="absolute -top-32 -right-4 text-[280px] font-black text-rose-500/[0.07] leading-none tracking-tighter select-none pointer-events-none">
              TRAP
            </div>

            <div
              className="w-full max-w-[940px] rounded-[44px] p-9 bg-white/95 border-3 border-amber-300 shadow-2xl flex flex-col gap-6"
              style={{
                transform: `translateY(${interpolate(sTrap, [0, 1], [0, -220]) + (1 - sLine) * 60}px) scale(${interpolate(sTrap, [0, 1], [1, 0.88])})`,
                opacity: (1 - sTrap * 0.5) * Math.min(1, sLine * 1.5),
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-md">
                    <Milestone className="w-10 h-10" />
                  </div>
                  <div>
                    <div className="text-amber-600 font-mono text-sm font-black uppercase tracking-wider">
                      THE ILLUSION
                    </div>
                    <div className="text-slate-950 font-black text-4xl uppercase tracking-tight">
                      Moving Finish Line
                    </div>
                  </div>
                </div>

                <div className="font-mono font-black text-4xl text-amber-600 flex items-center gap-2">
                  <span>{Math.floor(distProgress)}m</span>
                  <ArrowRight className="w-7 h-7 animate-pulse text-amber-500" />
                  <span className="text-rose-500">∞</span>
                </div>
              </div>

              <div className="w-full h-4 rounded-full bg-slate-100 overflow-hidden relative border border-slate-200">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 via-rose-400 to-rose-600 relative"
                  style={{ width: `${Math.min(95, (distProgress / 1000) * 85 + 10)}%` }}
                >
                  <div className="absolute right-0 top-0 bottom-0 w-3 bg-white animate-ping" />
                </div>
              </div>
            </div>

            {currentMs >= 22600 && (
              <div
                className="w-full max-w-[940px] rounded-[44px] p-10 bg-slate-950 text-white border-4 border-rose-500 shadow-[0_25px_80px_rgba(244,63,94,0.4)] flex items-center justify-between mt-6"
                style={{
                  transform: `translateY(${(1 - sTrap) * 70}px) scale(${0.92 + sTrap * 0.08})`,
                  opacity: Math.min(1, sTrap * 1.6),
                }}
              >
                <div className="flex items-center gap-6">
                  <div className="w-22 h-22 rounded-3xl bg-rose-600 flex items-center justify-center text-white shadow-xl flex-shrink-0">
                    <ShieldAlert className="w-14 h-14 animate-bounce" />
                  </div>
                  <div>
                    <div className="text-rose-400 font-mono text-base font-black uppercase tracking-widest flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded-full bg-rose-500 animate-ping" />
                      PSYCHOLOGICAL DEAD END
                    </div>
                    <div className="text-white font-black text-5xl uppercase tracking-tight mt-1">
                      That's The Trap.
                    </div>
                  </div>
                </div>

                <div className="px-7 py-4 rounded-2xl bg-rose-500/20 border-2 border-rose-400 text-rose-300 font-mono font-black text-lg">
                  UNWINNABLE
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* ===================================================================
          SCENE 5: LOOKING SIDEWAYS VS LOOKING INWARD (24,200 - 34,800ms)
      =================================================================== */}
      {scene === 5 && (() => {
        const sEnter = sp(24200);
        const sSideways = sp(30600);

        return (
          <div className="absolute inset-x-0 top-[42%] -translate-y-1/2 flex flex-col items-center justify-center px-8 gap-6">
            <div className="absolute -top-32 -left-8 text-[280px] font-black text-slate-900/[0.05] leading-none tracking-tighter select-none pointer-events-none">
              GAZE
            </div>

            <div
              className="text-center"
              style={{
                opacity: Math.min(1, sEnter * 1.5),
                transform: `translateY(${(1 - sEnter) * -20}px)`,
              }}
            >
              <span className="px-8 py-3.5 rounded-2xl bg-slate-900 text-white font-mono text-sm font-black tracking-widest uppercase inline-flex items-center gap-3 shadow-lg">
                <Eye className="w-5 h-5 text-sky-400" />
                THE HABITUAL REFLEX
              </span>
            </div>

            <div
              className="w-full max-w-[940px] rounded-[44px] p-9 bg-white/98 border-3 border-slate-200/90 shadow-2xl flex flex-col gap-6"
              style={{
                transform: `translateY(${(1 - sEnter) * 50}px) scale(${0.95 + sEnter * 0.05})`,
                opacity: Math.min(1, sEnter * 1.5),
              }}
            >
              <div
                className="p-7 rounded-3xl border-2 border-rose-200 bg-rose-50/70 flex items-center justify-between"
                style={{
                  opacity: currentMs >= 30600 ? 0.55 : 1,
                }}
              >
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-rose-500/15 border border-rose-300 flex items-center justify-center text-rose-600">
                    <XCircle className="w-10 h-10" />
                  </div>
                  <div>
                    <div className="text-rose-500 font-mono text-xs font-black uppercase tracking-wider">
                      DEFAULT REFLEX
                    </div>
                    <div className="text-slate-900 font-black text-3xl uppercase tracking-tight">
                      Looking Sideways
                    </div>
                  </div>
                </div>
                <div className="px-6 py-2.5 rounded-xl bg-rose-500 text-white font-mono font-black text-xs uppercase">
                  AT OTHERS ⇄
                </div>
              </div>

              <div
                className="p-8 rounded-3xl border-3 border-[#0071e3] bg-[#0071e3]/5 flex items-center justify-between shadow-lg"
                style={{
                  transform: `scale(${currentMs >= 33000 ? 1.02 : 1})`,
                  boxShadow: currentMs >= 33000 ? "0 15px 40px rgba(0,113,227,0.25)" : "none",
                }}
              >
                <div className="flex items-center gap-5">
                  <div className="w-18 h-18 rounded-2xl bg-[#0071e3] flex items-center justify-center text-white shadow-md">
                    <Target className="w-11 h-11" />
                  </div>
                  <div>
                    <div className="text-[#0071e3] font-mono text-xs font-black uppercase tracking-wider flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#0071e3] animate-ping" />
                      THE TRUE METRIC
                    </div>
                    <div className="text-slate-950 font-black text-4xl uppercase tracking-tight">
                      Looking At You
                    </div>
                  </div>
                </div>
                <div className="px-7 py-3 rounded-2xl bg-[#0071e3] text-white font-mono font-black text-sm uppercase shadow-sm">
                  YOUR PATH ◉
                </div>
              </div>

              {currentMs >= 32800 && (
                <div
                  className="flex items-center justify-between pt-2"
                  style={{
                    opacity: Math.min(1, sSideways * 1.5),
                  }}
                >
                  <span className="text-slate-600 font-bold text-lg">
                    Re-orient your gaze inward before you judge where you stand.
                  </span>
                  <span className="font-serif italic text-2xl font-black text-[#0071e3]">
                    ✍️ "look here first"
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* ===================================================================
          SCENE 6: THE MINDSET SHIFT — THE TRUE BENCHMARK (34,800 - 41,000ms)
      =================================================================== */}
      {scene === 6 && (() => {
        const sWrong = sp(34800);
        const sRight = sp(37900);

        return (
          <div className="absolute inset-x-0 top-[40%] -translate-y-1/2 flex flex-col items-center justify-center px-8 gap-5">
            <div className="absolute -top-32 -right-4 text-[280px] font-black text-[#0071e3]/[0.06] leading-none tracking-tighter select-none pointer-events-none">
              SHIFT
            </div>

            <div
              className="w-full max-w-[940px] rounded-3xl p-6 bg-white/85 border-2 border-slate-200 flex items-center justify-between shadow-md"
              style={{
                transform: `translateY(${interpolate(sRight, [0, 1], [0, -10]) + (1 - sWrong) * -30}px) scale(${interpolate(sRight, [0, 1], [1, 0.9])})`,
                opacity: currentMs >= 37900 ? 0.45 : Math.min(1, sWrong * 1.5),
              }}
            >
              <div className="relative flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center text-rose-500 font-black">
                  <XCircle className="w-7 h-7" />
                </div>
                <div>
                  <div className="text-rose-500 font-mono text-xs font-black uppercase">
                    DONT ASK THIS
                  </div>
                  <div className="text-slate-700 font-black text-2xl uppercase tracking-tight">
                    "Am I doing better than them?"
                  </div>
                </div>
              </div>
              <div className="px-5 py-2 rounded-xl bg-rose-50 text-rose-600 font-mono font-black text-xs">
                WRONG QUESTION ✖
              </div>
            </div>

            {currentMs >= 37600 && (
              <div
                className="relative w-full max-w-[940px] flex flex-col items-center"
                style={{
                  transform: `translateY(${(1 - sRight) * 50}px)`,
                  opacity: Math.min(1, sRight * 1.6),
                }}
              >
                <div
                  className="w-full rounded-[40px] p-7 bg-slate-900 text-white border-2 border-slate-700 shadow-xl flex items-center justify-between"
                  style={{
                    transform: `translateY(-25px) scale(0.92) rotate(-1deg)`,
                  }}
                >
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400">
                      <Milestone className="w-9 h-9" />
                    </div>
                    <div>
                      <div className="text-slate-400 font-mono text-xs font-black uppercase tracking-wider">
                        STARTING LINE
                      </div>
                      <div className="text-white font-black text-3xl uppercase tracking-tight">
                        Day 1 Version of You
                      </div>
                    </div>
                  </div>
                  <div className="px-6 py-2 rounded-xl bg-slate-800 text-slate-300 font-mono font-black text-xs uppercase">
                    WHERE YOU STARTED
                  </div>
                </div>

                <div
                  className="relative z-10 w-full -mt-4 rounded-[44px] p-9 bg-white/98 border-4 border-[#0071e3] shadow-[0_25px_70px_rgba(0,113,227,0.35)] flex flex-col gap-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 rounded-3xl bg-[#0071e3] flex items-center justify-center text-white shadow-lg">
                        <TrendingUp className="w-12 h-12" />
                      </div>
                      <div>
                        <div className="text-[#0071e3] font-mono text-sm font-black uppercase tracking-wider flex items-center gap-2">
                          <Sparkles className="w-4 h-4" />
                          THE TRUE QUESTION
                        </div>
                        <div className="text-slate-950 font-black text-4xl uppercase tracking-tight">
                          "Better than who started?"
                        </div>
                      </div>
                    </div>
                    <div className="px-7 py-3 rounded-2xl bg-[#0071e3] text-white font-mono font-black text-sm uppercase shadow-md">
                      THE REAL BENCHMARK
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <span className="text-slate-700 font-bold text-lg">
                      Compare only against your own previous chapters.
                    </span>
                    <span className="font-serif italic text-2xl font-black text-[#0071e3]">
                      ✍️ "Your only real race"
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* ===================================================================
          SCENE 7: THE FINISH LINE & FINALE (41,000ms+)
      =================================================================== */}
      {scene === 7 && (() => {
        const sRace = sp(41000);
        const sEnough = sp(43600);

        return (
          <div className="absolute inset-x-0 top-[38%] -translate-y-1/2 flex flex-col items-center justify-center px-8 gap-6">
            <div className="absolute -top-32 -left-6 text-[250px] font-black text-emerald-500/[0.07] leading-none tracking-tighter select-none pointer-events-none">
              ENOUGH
            </div>

            <div
              className="w-full max-w-[940px] rounded-3xl p-6 bg-emerald-50 border-2 border-emerald-300 flex items-center justify-between shadow-lg"
              style={{
                transform: `translateY(${(1 - sRace) * -30}px)`,
                opacity: Math.min(1, sRace * 1.5),
              }}
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-md">
                  <Flag className="w-8 h-8" />
                </div>
                <div>
                  <div className="text-emerald-700 font-mono text-xs font-black uppercase tracking-wider">
                    ACHIEVABLE VICTORY
                  </div>
                  <div className="text-slate-950 font-black text-3xl uppercase tracking-tight">
                    A Race You Can Actually Finish
                  </div>
                </div>
              </div>
              <div className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-mono font-black text-sm uppercase shadow-sm">
                FINISH LINE ✓
              </div>
            </div>

            <div
              className="w-full max-w-[940px] rounded-[48px] p-9 bg-white/98 border-4 border-emerald-400 shadow-[0_25px_80px_rgba(16,185,129,0.3)] flex flex-col items-center text-center gap-6"
              style={{
                transform: `scale(${0.92 + sEnough * 0.08})`,
                opacity: Math.min(1, sEnough * 1.6),
              }}
            >
              <div
                className="rounded-[36px] bg-gradient-to-br from-emerald-400 via-teal-500 to-[#0071e3] flex items-center justify-center text-white shadow-[0_15px_40px_rgba(16,185,129,0.45)]"
                style={{
                  width: 105,
                  height: 105,
                  transform: `scale(${1 + pulse * 0.05})`,
                }}
              >
                <Trophy className="w-16 h-16" />
              </div>

              <div>
                <div className="text-emerald-600 font-mono text-lg tracking-widest uppercase font-black mb-1 flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  THE ULTIMATE SHIFT
                  <Sparkles className="w-5 h-5 text-amber-400" />
                </div>
                <div className="text-slate-950 font-black text-5xl uppercase tracking-tight leading-tight">
                  Yours Is Enough.
                </div>
                <div className="text-slate-600 font-bold text-xl mt-1.5">
                  You don't need to win someone else's life.
                </div>
              </div>

              <div className="w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-600 to-[#0071e3] text-white font-mono text-base font-black tracking-wider uppercase flex items-center justify-center gap-3 shadow-xl">
                <CheckCircle2 className="w-6 h-6 text-emerald-200" />
                OWN YOUR LANE • RUN YOUR RACE
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
