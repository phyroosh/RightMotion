import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  XCircle,
  CheckCircle2,
  Brain,
  Zap,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  Smartphone,
  Briefcase,
  UserX,
  RotateCcw,
  Scale,
  Split,
  BatteryCharging,
  Flame,
  Moon,
  HeartHandshake,
  Key,
  Layers,
  HelpCircle,
  Compass,
} from "lucide-react";
import { WordTimestamp } from "../types";

interface MotionGraphicsCanvasProps {
  transcript: WordTimestamp[];
}

export const MotionGraphicsCanvas: React.FC<MotionGraphicsCanvasProps> = () => {
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
  if (currentMs >= 41500) scene = 7;
  else if (currentMs >= 34200) scene = 6;
  else if (currentMs >= 27200) scene = 5;
  else if (currentMs >= 19200) scene = 4;
  else if (currentMs >= 15200) scene = 3;
  else if (currentMs >= 5000) scene = 2;

  return (
    <div
      className="absolute inset-0 w-full h-full pointer-events-none z-20 select-none overflow-hidden"
      style={{ transform: `scale(${cameraZoom})`, transformOrigin: "center center" }}
    >
      {/* ===================================================================
          SCENE 1: THE PARADOX HOOK (0 - 5,000ms)
          "You know what's weird? You can know a habit is bad for you… and still do it again tonight."
      =================================================================== */}
      {scene === 1 && (() => {
        const sEnter = sp(0);
        const sAction = sp(3200);

        return (
          <div className="absolute inset-x-0 top-[42%] -translate-y-1/2 flex items-center justify-center px-8">
            {/* Ghost Typography */}
            <div
              className="absolute -top-32 -left-10 text-[270px] font-black text-slate-900/[0.06] leading-none tracking-tighter select-none pointer-events-none"
              style={{ transform: `translateX(${(1 - sEnter) * -40}px)` }}
            >
              WEIRD
            </div>

            {/* Hero Prop: Cognitive Dissonance Card */}
            <div
              className="relative w-full max-w-[940px] rounded-[44px] p-10 apple-glass border-2 border-white/90 shadow-2xl flex flex-col gap-6"
              style={{
                transform: `translateY(${(1 - sEnter) * 70}px) rotate(-1.5deg) scale(${0.92 + sEnter * 0.08})`,
                opacity: Math.min(1, sEnter * 1.5),
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-black/5 pb-5">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-amber-500 animate-ping" />
                  <span className="font-mono text-sm font-black uppercase tracking-widest text-slate-500">
                    HUMAN PARADOX • 01
                  </span>
                </div>
                <span className="px-5 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 font-mono font-black text-xs uppercase tracking-wider">
                  COGNITIVE GAP
                </span>
              </div>

              {/* Body */}
              <div className="flex items-center gap-7">
                <div
                  className="rounded-3xl bg-gradient-to-br from-amber-500 to-indigo-600 flex items-center justify-center flex-shrink-0 text-white shadow-lg"
                  style={{ width: 110, height: 110 }}
                >
                  <Brain className="w-16 h-16" />
                </div>
                <div className="flex-1">
                  <div className="text-slate-400 font-mono text-base font-black tracking-wider uppercase">
                    {currentMs >= 3200 ? "NIGHTLY IMPULSE" : "INTELLECTUAL AWARENESS"}
                  </div>
                  <div className="text-slate-950 font-black text-5xl uppercase tracking-tight leading-tight mt-1">
                    {currentMs >= 3200 ? "Still Do It Tonight" : "Know It's Bad For You"}
                  </div>
                </div>
              </div>

              {/* Hand Annotation Callout */}
              <div
                className="relative mt-2 p-5 rounded-2xl bg-sky-50/80 border border-sky-200 flex items-center justify-between"
                style={{
                  opacity: Math.min(1, (currentMs >= 1500 ? sp(1500) : sEnter) * 1.5),
                }}
              >
                <div className="flex items-center gap-3">
                  <Moon className="w-6 h-6 text-[#0071e3]" />
                  <span className="text-slate-800 text-xl font-bold tracking-tight">
                    {currentMs >= 3200 ? "Awareness alone doesn't stop the reflex" : "The rational mind understands perfectly"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <svg className="w-8 h-8 text-[#0071e3]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 17l9.2-9.2M17 17V8H8" />
                  </svg>
                  <span className="font-serif italic text-2xl font-black text-[#0071e3] tracking-wide transform -rotate-2">
                    the knowing gap!
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ===================================================================
          SCENE 2: THE 3 FAMILIAR TRAPS (5,000 - 15,200ms)
      =================================================================== */}
      {scene === 2 && (() => {
        const isScroll = currentMs < 8200;
        const isWork = currentMs >= 8200 && currentMs < 10800;
        const isPerson = currentMs >= 10800;

        const sScroll = sp(5000);
        const sWork = sp(8200);
        const sPerson = sp(10800);
        const sGoBack = sp(13400);

        return (
          <div className="absolute inset-x-0 top-[42%] -translate-y-1/2 flex flex-col items-center justify-center px-8">
            {/* ---------------- 2A: SCROLLING FOR HOURS ---------------- */}
            {isScroll && (
              <div
                className="relative w-full max-w-[940px] flex flex-col items-center"
                style={{
                  transform: `translateY(${(1 - sScroll) * 50}px)`,
                  opacity: Math.min(1, sScroll * 1.5),
                }}
              >
                <div className="mb-6 px-7 py-3 rounded-2xl bg-slate-900 text-white font-mono text-sm font-black uppercase tracking-widest flex items-center gap-2 shadow-lg">
                  <Smartphone className="w-5 h-5 text-indigo-400" />
                  TRAP 01 • DIGITAL COMPULSION
                </div>

                <div className="w-full rounded-[44px] p-9 bg-white/98 border-3 border-indigo-200 shadow-2xl flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="w-22 h-22 rounded-3xl bg-indigo-500 flex items-center justify-center text-white shadow-lg">
                        <Smartphone className="w-13 h-13" />
                      </div>
                      <div>
                        <div className="text-indigo-600 font-mono text-sm font-black uppercase tracking-wider">
                          NIGHTLY AUTO-PILOT
                        </div>
                        <div className="text-slate-950 font-black text-4xl uppercase tracking-tight">
                          Scrolling For Hours
                        </div>
                      </div>
                    </div>
                    <div className="px-6 py-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 font-mono font-black text-sm">
                      FEELS WORSE
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-between">
                    <span className="text-slate-700 font-bold text-lg">
                      Clear intellectual awareness: 0% real rest gained.
                    </span>
                    <span className="font-serif italic text-2xl font-black text-[#0071e3]">
                      ✍️ "midnight scroll"
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* ---------------- 2B: SKIPPING WORK ---------------- */}
            {isWork && (
              <div
                className="relative w-full max-w-[940px] flex flex-col items-center"
                style={{
                  transform: `translateY(${(1 - sWork) * 50}px)`,
                  opacity: Math.min(1, sWork * 1.5),
                }}
              >
                <div className="mb-6 px-7 py-3 rounded-2xl bg-slate-900 text-white font-mono text-sm font-black uppercase tracking-widest flex items-center gap-2 shadow-lg">
                  <Briefcase className="w-5 h-5 text-amber-400" />
                  TRAP 02 • AVOIDANCE BEHAVIOR
                </div>

                <div className="w-full rounded-[44px] p-9 bg-white/98 border-3 border-amber-200 shadow-2xl flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="w-22 h-22 rounded-3xl bg-amber-500 flex items-center justify-center text-white shadow-lg">
                        <Briefcase className="w-13 h-13" />
                      </div>
                      <div>
                        <div className="text-amber-600 font-mono text-sm font-black uppercase tracking-wider">
                          TEMPORARY RELIEF
                        </div>
                        <div className="text-slate-950 font-black text-4xl uppercase tracking-tight">
                          Skipping The Work
                        </div>
                      </div>
                    </div>
                    <div className="px-6 py-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 font-mono font-black text-sm">
                      MORE STRESS
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-100 flex items-center justify-between">
                    <span className="text-slate-700 font-bold text-lg">
                      Short-term escape trades for heavy compound tension.
                    </span>
                    <span className="font-serif italic text-2xl font-black text-[#0071e3]">
                      ✍️ "tomorrow's problem"
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* ---------------- 2C: THE WRONG PERSON & YET GO BACK ---------------- */}
            {isPerson && (
              <div
                className="relative w-full max-w-[940px] flex flex-col items-center"
                style={{
                  transform: `translateY(${(1 - sPerson) * 50}px)`,
                  opacity: Math.min(1, sPerson * 1.5),
                }}
              >
                <div className="mb-6 px-7 py-3 rounded-2xl bg-slate-900 text-white font-mono text-sm font-black uppercase tracking-widest flex items-center gap-2 shadow-lg">
                  <UserX className="w-5 h-5 text-rose-400" />
                  TRAP 03 • RELATIONAL GRAVITY
                </div>

                <div className="w-full rounded-[44px] p-9 bg-white/98 border-3 border-rose-200 shadow-2xl flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="w-22 h-22 rounded-3xl bg-rose-500 flex items-center justify-center text-white shadow-lg">
                        <UserX className="w-13 h-13" />
                      </div>
                      <div>
                        <div className="text-rose-600 font-mono text-sm font-black uppercase tracking-wider">
                          KNOWN TOXICITY
                        </div>
                        <div className="text-slate-950 font-black text-4xl uppercase tracking-tight">
                          That One Person
                        </div>
                      </div>
                    </div>
                    <div className="px-6 py-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 font-mono font-black text-sm">
                      NOT GOOD FOR YOU
                    </div>
                  </div>

                  {currentMs >= 13200 && (
                    <div
                      className="p-6 rounded-3xl bg-slate-950 text-white border-2 border-rose-500 flex items-center justify-between shadow-xl"
                      style={{
                        transform: `scale(${0.95 + sGoBack * 0.05})`,
                        opacity: Math.min(1, sGoBack * 1.6),
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <RotateCcw className="w-9 h-9 text-rose-400 animate-spin" style={{ animationDuration: "8s" }} />
                        <span className="font-black text-3xl uppercase tracking-tight">
                          And Yet… You Go Back.
                        </span>
                      </div>
                      <span className="font-serif italic text-2xl font-black text-sky-400">
                        ✍️ "compulsive pull"
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* ===================================================================
          SCENE 3: THE CORE DISTINCTION (15,200 - 19,200ms)
      =================================================================== */}
      {scene === 3 && (() => {
        const sEnter = sp(15200);
        const sSplit = sp(17000);

        return (
          <div className="absolute inset-x-0 top-[42%] -translate-y-1/2 flex flex-col items-center justify-center px-8 gap-6">
            <div className="absolute -top-32 -right-4 text-[270px] font-black text-slate-900/[0.05] leading-none tracking-tighter select-none pointer-events-none">
              DIVIDE
            </div>

            <div
              className="text-center"
              style={{
                opacity: Math.min(1, sEnter * 1.5),
                transform: `translateY(${(1 - sEnter) * -20}px)`,
              }}
            >
              <span className="px-8 py-3.5 rounded-2xl bg-slate-900 text-white font-mono text-sm font-black tracking-widest uppercase inline-flex items-center gap-3 shadow-lg">
                <Split className="w-5 h-5 text-sky-400" />
                THE NEURAL REALITY
              </span>
            </div>

            <div
              className="w-full max-w-[940px] grid grid-cols-2 gap-6"
              style={{
                transform: `translateY(${(1 - sEnter) * 50}px) scale(${0.95 + sEnter * 0.05})`,
                opacity: Math.min(1, sEnter * 1.5),
              }}
            >
              <div className="rounded-[40px] p-8 apple-glass border-2 border-slate-200 flex flex-col items-center text-center gap-4 shadow-xl">
                <div className="w-18 h-18 rounded-2xl bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-600">
                  <Brain className="w-11 h-11" />
                </div>
                <div>
                  <div className="text-slate-400 font-mono text-xs font-black uppercase">
                    SYSTEM 01 • INTELLECT
                  </div>
                  <div className="text-slate-900 font-black text-3xl uppercase tracking-tight mt-0.5">
                    Knowing Better
                  </div>
                </div>
                <div className="px-5 py-2 rounded-xl bg-slate-100 text-slate-700 font-mono font-black text-xs uppercase">
                  INFORMATION ONLY
                </div>
              </div>

              <div
                className="rounded-[40px] p-8 bg-white/98 border-4 border-[#0071e3] flex flex-col items-center text-center gap-4 shadow-[0_20px_60px_rgba(0,113,227,0.3)]"
                style={{
                  transform: `scale(${currentMs >= 17000 ? 1.03 : 1})`,
                  transition: "transform 0.3s ease",
                }}
              >
                <div className="w-18 h-18 rounded-2xl bg-[#0071e3] flex items-center justify-center text-white shadow-md">
                  <Zap className="w-11 h-11" />
                </div>
                <div>
                  <div className="text-[#0071e3] font-mono text-xs font-black uppercase">
                    SYSTEM 02 • NERVOUS SYSTEM
                  </div>
                  <div className="text-slate-950 font-black text-3xl uppercase tracking-tight mt-0.5">
                    Changing
                  </div>
                </div>
                <div className="px-5 py-2 rounded-xl bg-[#0071e3] text-white font-mono font-black text-xs uppercase shadow-sm">
                  EMOTIONAL DRIVER
                </div>
              </div>
            </div>

            {currentMs >= 17500 && (
              <div
                className="text-center"
                style={{ opacity: Math.min(1, sSplit * 1.6) }}
              >
                <span className="font-serif italic text-2xl font-black text-[#0071e3]">
                  ✍️ "Two completely different circuits in the brain"
                </span>
              </div>
            )}
          </div>
        );
      })()}

      {/* ===================================================================
          SCENE 4: THE BRAIN'S 3 FILTERS (19,200 - 27,200ms)
      =================================================================== */}
      {scene === 4 && (() => {
        const sEnter = sp(19200);

        return (
          <div className="absolute inset-x-0 top-[42%] -translate-y-1/2 flex flex-col items-center justify-center px-8 gap-5">
            <div className="absolute -top-32 -left-8 text-[270px] font-black text-slate-900/[0.05] leading-none tracking-tighter select-none pointer-events-none">
              DEFAULT
            </div>

            <div
              className="text-center"
              style={{
                opacity: Math.min(1, sEnter * 1.5),
                transform: `translateY(${(1 - sEnter) * -20}px)`,
              }}
            >
              <span className="px-8 py-3.5 rounded-2xl bg-slate-900 text-white font-mono text-sm font-black tracking-widest uppercase inline-flex items-center gap-3 shadow-lg">
                <Compass className="w-5 h-5 text-amber-400" />
                THE SURVIVAL BRAIN'S 3 DEFAULTS
              </span>
            </div>

            <div
              className="w-full max-w-[940px] flex flex-col gap-4"
              style={{
                transform: `translateY(${(1 - sEnter) * 40}px)`,
                opacity: Math.min(1, sEnter * 1.5),
              }}
            >
              <div
                className="w-full rounded-3xl p-6 bg-white/95 border-2 border-indigo-200 flex items-center justify-between shadow-lg"
                style={{
                  transform: `scale(${currentMs >= 23000 ? 1.02 : 1})`,
                  borderColor: currentMs >= 23000 ? "#6366f1" : "rgba(226,232,240,0.8)",
                  transition: "all 0.3s ease",
                }}
              >
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-500/15 text-indigo-600 flex items-center justify-center font-black text-xl">
                    01
                  </div>
                  <div>
                    <div className="text-indigo-600 font-mono text-xs font-black uppercase">
                      PRIORITY ONE
                    </div>
                    <div className="text-slate-950 font-black text-3xl uppercase tracking-tight">
                      Familiar
                    </div>
                  </div>
                </div>
                <div className="px-6 py-2 rounded-xl bg-indigo-50 text-indigo-700 font-mono font-black text-xs uppercase">
                  ZERO SURPRISES
                </div>
              </div>

              <div
                className="w-full rounded-3xl p-6 bg-white/95 border-2 border-amber-200 flex items-center justify-between shadow-lg"
                style={{
                  transform: `scale(${currentMs >= 24500 ? 1.02 : 1})`,
                  borderColor: currentMs >= 24500 ? "#f59e0b" : "rgba(226,232,240,0.8)",
                  transition: "all 0.3s ease",
                }}
              >
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/15 text-amber-600 flex items-center justify-center font-black text-xl">
                    02
                  </div>
                  <div>
                    <div className="text-amber-600 font-mono text-xs font-black uppercase">
                      PRIORITY TWO
                    </div>
                    <div className="text-slate-950 font-black text-3xl uppercase tracking-tight">
                      Easy
                    </div>
                  </div>
                </div>
                <div className="px-6 py-2 rounded-xl bg-amber-50 text-amber-700 font-mono font-black text-xs uppercase">
                  LOWEST ENERGY
                </div>
              </div>

              <div
                className="w-full rounded-3xl p-6 bg-white/98 border-3 border-[#0071e3] flex items-center justify-between shadow-[0_15px_40px_rgba(0,113,227,0.2)]"
                style={{
                  transform: `scale(${currentMs >= 25500 ? 1.03 : 1})`,
                  transition: "all 0.3s ease",
                }}
              >
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-[#0071e3] text-white flex items-center justify-center font-black text-xl shadow-md">
                    03
                  </div>
                  <div>
                    <div className="text-[#0071e3] font-mono text-xs font-black uppercase">
                      PRIORITY THREE
                    </div>
                    <div className="text-slate-950 font-black text-3xl uppercase tracking-tight">
                      Comforting In The Moment
                    </div>
                  </div>
                </div>
                <div className="px-6 py-2 rounded-xl bg-[#0071e3] text-white font-mono font-black text-xs uppercase shadow-sm">
                  INSTANT RELIEF
                </div>
              </div>
            </div>

            {currentMs >= 25800 && (
              <div className="text-center pt-2">
                <span className="font-serif italic text-2xl font-black text-[#0071e3]">
                  ✍️ "safety now over health later"
                </span>
              </div>
            )}
          </div>
        );
      })()}

      {/* ===================================================================
          SCENE 5: THE SURVIVAL LOGIC (27,200 - 34,200ms)
      =================================================================== */}
      {scene === 5 && (() => {
        const sEnter = sp(27200);
        const sQuote = sp(30600);

        return (
          <div className="absolute inset-x-0 top-[42%] -translate-y-1/2 flex flex-col items-center justify-center px-8 gap-6">
            <div className="absolute -top-32 -right-4 text-[270px] font-black text-rose-500/[0.06] leading-none tracking-tighter select-none pointer-events-none">
              STATES
            </div>

            <div
              className="w-full max-w-[940px] grid grid-cols-3 gap-4"
              style={{
                transform: `translateY(${(1 - sEnter) * -30}px)`,
                opacity: Math.min(1, sEnter * 1.5),
              }}
            >
              <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-200 flex items-center justify-center gap-2 text-amber-700 font-mono font-black text-sm uppercase shadow-sm">
                <BatteryCharging className="w-5 h-5 text-amber-500" />
                TIRED
              </div>
              <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-200 flex items-center justify-center gap-2 text-rose-700 font-mono font-black text-sm uppercase shadow-sm">
                <Flame className="w-5 h-5 text-rose-500" />
                STRESSED
              </div>
              <div className="p-4 rounded-2xl bg-indigo-50 border-2 border-indigo-200 flex items-center justify-center gap-2 text-indigo-700 font-mono font-black text-sm uppercase shadow-sm">
                <Moon className="w-5 h-5 text-indigo-500" />
                LONELY
              </div>
            </div>

            {currentMs >= 30200 && (
              <div
                className="w-full max-w-[940px] rounded-[44px] p-9 bg-slate-950 text-white border-4 border-amber-400 shadow-[0_25px_80px_rgba(245,158,11,0.35)] flex flex-col gap-5"
                style={{
                  transform: `scale(${0.92 + sQuote * 0.08})`,
                  opacity: Math.min(1, sQuote * 1.6),
                }}
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <Brain className="w-6 h-6 text-amber-400 animate-pulse" />
                    <span className="font-mono text-xs font-black uppercase tracking-widest text-amber-300">
                      INTERNAL JUSTIFICATION
                    </span>
                  </div>
                  <span className="px-5 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-mono font-black text-xs uppercase">
                    COPING CODE
                  </span>
                </div>

                <div className="text-3xl font-black uppercase tracking-tight leading-snug text-slate-100">
                  "Yeah, I know this isn't great… <span className="text-amber-400 underline decoration-amber-400 decoration-4">but it worked last time.</span>"
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-900">
                  <span className="text-slate-400 font-bold text-base">
                    Survival shortcut: familiarity equals temporary safety.
                  </span>
                  <span className="font-serif italic text-2xl font-black text-sky-400">
                    ✍️ "survival logic"
                  </span>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* ===================================================================
          SCENE 6: GUILT VS UNDERSTANDING (34,200 - 41,500ms)
      =================================================================== */}
      {scene === 6 && (() => {
        const sGuilt = sp(34200);
        const sNeed = sp(38600);

        return (
          <div className="absolute inset-x-0 top-[40%] -translate-y-1/2 flex flex-col items-center justify-center px-8 gap-5">
            <div className="absolute -top-32 -left-6 text-[260px] font-black text-[#0071e3]/[0.06] leading-none tracking-tighter select-none pointer-events-none">
              FUNCTION
            </div>

            <div
              className="w-full max-w-[940px] rounded-3xl p-6 bg-white/85 border-2 border-slate-200 flex items-center justify-between shadow-md"
              style={{
                transform: `translateY(${interpolate(sNeed, [0, 1], [0, -10]) + (1 - sGuilt) * -30}px) scale(${interpolate(sNeed, [0, 1], [1, 0.9])})`,
                opacity: currentMs >= 38600 ? 0.45 : Math.min(1, sGuilt * 1.5),
              }}
            >
              <div className="relative flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center text-rose-500 font-black">
                  <XCircle className="w-7 h-7" />
                </div>
                <div>
                  <div className="text-rose-500 font-mono text-xs font-black uppercase">
                    INEFFECTIVE LEVER
                  </div>
                  <div className="text-slate-700 font-black text-2xl uppercase tracking-tight">
                    More Guilt & Shame
                  </div>
                </div>
              </div>
              <div className="px-5 py-2 rounded-xl bg-rose-50 text-rose-600 font-mono font-black text-xs">
                DOESN'T WORK ✖
              </div>
            </div>

            {currentMs >= 38200 && (
              <div
                className="w-full max-w-[940px] rounded-[44px] p-9 bg-white/98 border-4 border-[#0071e3] shadow-[0_25px_70px_rgba(0,113,227,0.35)] flex flex-col gap-4"
                style={{
                  transform: `translateY(${(1 - sNeed) * 50}px)`,
                  opacity: Math.min(1, sNeed * 1.6),
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-3xl bg-[#0071e3] flex items-center justify-center text-white shadow-lg">
                      <Key className="w-12 h-12" />
                    </div>
                    <div>
                      <div className="text-[#0071e3] font-mono text-sm font-black uppercase tracking-wider flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        THE ROOT QUESTION
                      </div>
                      <div className="text-slate-950 font-black text-4xl uppercase tracking-tight">
                        What It's Doing For You
                      </div>
                    </div>
                  </div>
                  <div className="px-7 py-3 rounded-2xl bg-[#0071e3] text-white font-mono font-black text-sm uppercase shadow-md">
                    REAL FUNCTION
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <span className="text-slate-700 font-bold text-lg">
                    Every destructive habit is solving a real emotional need.
                  </span>
                  <span className="font-serif italic text-2xl font-black text-[#0071e3]">
                    ✍️ "find the payoff"
                  </span>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* ===================================================================
          SCENE 7: INNER PEACE FINALE (41,500ms+)
      =================================================================== */}
      {scene === 7 && (() => {
        const sPeace = sp(41500);

        return (
          <div className="absolute inset-x-0 top-[38%] -translate-y-1/2 flex flex-col items-center justify-center px-8 gap-6">
            <div className="absolute -top-32 -left-6 text-[260px] font-black text-emerald-500/[0.07] leading-none tracking-tighter select-none pointer-events-none">
              PEACE
            </div>

            <div
              className="w-full max-w-[940px] rounded-[48px] p-10 bg-white/98 border-4 border-emerald-400 shadow-[0_25px_80px_rgba(16,185,129,0.3)] flex flex-col items-center text-center gap-7"
              style={{
                transform: `scale(${0.92 + sPeace * 0.08})`,
                opacity: Math.min(1, sPeace * 1.6),
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
                <HeartHandshake className="w-14 h-14" />
              </div>

              <div>
                <div className="text-emerald-600 font-mono text-lg tracking-widest uppercase font-black mb-1 flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  THE REAL BREAKTHROUGH
                  <Sparkles className="w-5 h-5 text-amber-400" />
                </div>
                <div className="text-slate-950 font-black text-5xl uppercase tracking-tight leading-tight">
                  Stop Fighting Yourself.
                </div>
                <div className="text-slate-600 font-bold text-2xl mt-2">
                  Understand the need. Change the outlet.
                </div>
              </div>

              <div className="w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-600 to-[#0071e3] text-white font-mono text-base font-black tracking-wider uppercase flex items-center justify-center gap-3 shadow-xl">
                <CheckCircle2 className="w-6 h-6 text-emerald-200" />
                NO MORE GUILT • WORK WITH YOUR BRAIN
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
