import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { 
  Sparkles, 
  EyeOff, 
  Flame, 
  Compass, 
  CheckCircle2, 
  AlertTriangle, 
  MessageSquareHeart, 
  Send,
  Timer,
  ArrowRight,
  TrendingUp
} from "lucide-react";
import { WordTimestamp } from "../types";

interface AppleMotionCardsProps {
  transcript: WordTimestamp[];
}

export const AppleMotionCards: React.FC<AppleMotionCardsProps> = ({ transcript }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentMs = (frame / fps) * 1000;

  // Scene timing intervals (in ms)
  // Scene 0 (Hook): 0 - 3200
  // Scene 1 (Highlight vs Reality): 3200 - 15500
  // Scene 2 (Finish Line Myth): 15500 - 32500
  // Scene 3 (Freeze Alert): 32500 - 45500
  // Scene 4 (One True Thing): 45500 - 58000
  // Scene 5 (CTA): 58000+
  let activeScene = 0;
  if (currentMs >= 58000) activeScene = 5;
  else if (currentMs >= 45500) activeScene = 4;
  else if (currentMs >= 32500) activeScene = 3;
  else if (currentMs >= 15500) activeScene = 2;
  else if (currentMs >= 3200) activeScene = 1;

  // Slow, smooth, minimal Apple spring physics
  const springConfig = { damping: 24, mass: 1.0, stiffness: 75 };

  const s0 = spring({ frame, fps, config: springConfig });
  const s1 = spring({ frame: Math.max(0, frame - Math.floor((3200 / 1000) * fps)), fps, config: springConfig });
  const s2 = spring({ frame: Math.max(0, frame - Math.floor((15500 / 1000) * fps)), fps, config: springConfig });
  const s3 = spring({ frame: Math.max(0, frame - Math.floor((32500 / 1000) * fps)), fps, config: springConfig });
  const s4 = spring({ frame: Math.max(0, frame - Math.floor((45500 / 1000) * fps)), fps, config: springConfig });
  const s5 = spring({ frame: Math.max(0, frame - Math.floor((58000 / 1000) * fps)), fps, config: springConfig });

  // Sub-springs for Scene 2 (Chips) - smooth stagger
  const chip1 = spring({ frame: Math.max(0, frame - Math.floor((18500 / 1000) * fps)), fps, config: springConfig });
  const chip2 = spring({ frame: Math.max(0, frame - Math.floor((20000 / 1000) * fps)), fps, config: springConfig });
  const chip3 = spring({ frame: Math.max(0, frame - Math.floor((21500 / 1000) * fps)), fps, config: springConfig });
  const chip4 = spring({ frame: Math.max(0, frame - Math.floor((23000 / 1000) * fps)), fps, config: springConfig });

  // Sub-springs for Scene 4 (One True Thing) - smooth stagger
  const tag1 = spring({ frame: Math.max(0, frame - Math.floor((47500 / 1000) * fps)), fps, config: springConfig });
  const tag2 = spring({ frame: Math.max(0, frame - Math.floor((50000 / 1000) * fps)), fps, config: springConfig });
  const tag3 = spring({ frame: Math.max(0, frame - Math.floor((52500 / 1000) * fps)), fps, config: springConfig });

  return (
    <div className="absolute inset-x-0 top-[28%] -translate-y-1/2 flex items-center justify-center pointer-events-none z-30 px-12">
      
      {/* SCENE 0: HOOK - RECALIBRATING COMPARISON */}
      {activeScene === 0 && (
        <div
          className="relative w-full max-w-[920px] flex flex-col items-center"
          style={{
            transform: `scale(${0.96 + s0 * 0.04}) translateY(${(1 - s0) * -20}px)`,
            opacity: Math.min(1, s0 * 1.5),
          }}
        >
          <div className="w-full rounded-[36px] apple-glass p-10 flex flex-col items-center text-center relative overflow-hidden shadow-apple-glass">
            {/* Header Icon */}
            <div className="w-20 h-20 rounded-3xl bg-sky-500/15 border border-sky-400/40 flex items-center justify-center mb-5 text-sky-600 shadow-apple-glow-cyan">
              <Sparkles className="w-10 h-10" />
            </div>

            <div className="text-sky-600 font-mono text-sm font-bold tracking-widest uppercase mb-2">
              MINDSET CALIBRATION
            </div>
            <div className="text-slate-900 font-black text-4xl md:text-5xl tracking-tight mb-6">
              YOU'RE NOT BEHIND
            </div>

            {/* Apple Glass Toggle Pill */}
            <div className="w-full bg-slate-200/50 rounded-2xl p-2 flex items-center gap-3 border border-white/80">
              <div className="flex-1 py-4 rounded-xl bg-slate-300/40 text-slate-400 font-bold text-base line-through text-center">
                "BEHIND"
              </div>
              <div className="flex-1 py-4 rounded-xl bg-white shadow-md text-sky-600 font-black text-base border border-sky-100 flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                YOUR OWN TIMELINE
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SCENE 1: HIGHLIGHT REEL VS UNSEEN REALITY */}
      {activeScene === 1 && (
        <div
          className="relative w-full max-w-[920px] flex flex-col gap-6"
          style={{
            transform: `scale(${0.96 + s1 * 0.04}) translateY(${(1 - s1) * 20}px)`,
            opacity: Math.min(1, s1 * 1.5),
          }}
        >
          {/* Highlight Card */}
          <div className="w-full rounded-[32px] apple-glass p-7 flex items-center justify-between border-l-8 border-l-amber-500 shadow-apple-glass">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/15 flex items-center justify-center text-amber-600">
                <Flame className="w-8 h-8" />
              </div>
              <div className="text-left">
                <div className="text-slate-400 font-mono text-xs uppercase font-bold tracking-wider">
                  WHAT YOU SEE (1% OF THE STORY)
                </div>
                <div className="text-slate-900 font-black text-2xl md:text-3xl mt-0.5">
                  4-SECOND HIGHLIGHT REEL
                </div>
                <div className="text-slate-500 text-sm md:text-base mt-1 font-medium">
                  Launch • College • Body • Money
                </div>
              </div>
            </div>
            <span className="px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-600 font-mono text-xs font-bold border border-amber-500/20">
              PUBLIC
            </span>
          </div>

          {/* Unseen Reality Card */}
          <div className="w-full rounded-[32px] apple-glass p-7 flex items-center justify-between border-l-8 border-l-sky-500 shadow-apple-glass">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-sky-500/15 flex items-center justify-center text-sky-600">
                <EyeOff className="w-8 h-8" />
              </div>
              <div className="text-left">
                <div className="text-slate-400 font-mono text-xs uppercase font-bold tracking-wider">
                  WHAT'S HIDDEN (99% OF THE JOURNEY)
                </div>
                <div className="text-slate-900 font-black text-2xl md:text-3xl mt-0.5">
                  4 AM DOUBTS & 11 QUITS
                </div>
                <div className="text-slate-500 text-sm md:text-base mt-1 font-medium">
                  Years of silent effort before anything worked
                </div>
              </div>
            </div>
            <span className="px-4 py-1.5 rounded-full bg-sky-500/10 text-sky-600 font-mono text-xs font-bold border border-sky-500/20">
              REALITY
            </span>
          </div>
        </div>
      )}

      {/* SCENE 2: THE MYTHICAL FINISH LINE */}
      {activeScene === 2 && (
        <div
          className="relative w-full max-w-[920px] flex flex-col items-center gap-5"
          style={{
            transform: `scale(${0.96 + s2 * 0.04})`,
            opacity: Math.min(1, s2 * 1.5),
          }}
        >
          {/* Header Banner */}
          <div className="px-8 py-3 rounded-full apple-glass text-slate-800 font-mono text-sm font-bold uppercase tracking-wider flex items-center gap-3 shadow-sm">
            <Timer className="w-5 h-5 text-rose-500" />
            UNIVERSAL FINISH LINE: DOES NOT EXIST
          </div>

          {/* 4 Staggered Variable Starting Point Chips */}
          <div className="grid grid-cols-2 gap-4 w-full">
            <div
              className="rounded-3xl apple-glass p-6 text-left shadow-apple-glass transition-all"
              style={{ transform: `scale(${0.95 + chip1 * 0.05})`, opacity: Math.min(1, chip1 * 1.5) }}
            >
              <div className="text-sky-600 font-mono text-xs font-bold">START POINT 01</div>
              <div className="text-slate-900 font-black text-xl mt-1">DIFFERENT FAMILY</div>
              <div className="text-slate-500 text-sm mt-1">Unique environment & upbringing</div>
            </div>

            <div
              className="rounded-3xl apple-glass p-6 text-left shadow-apple-glass transition-all"
              style={{ transform: `scale(${0.95 + chip2 * 0.05})`, opacity: Math.min(1, chip2 * 1.5) }}
            >
              <div className="text-indigo-600 font-mono text-xs font-bold">START POINT 02</div>
              <div className="text-slate-900 font-black text-xl mt-1">RESOURCES</div>
              <div className="text-slate-500 text-sm mt-1">Variable starting opportunities</div>
            </div>

            <div
              className="rounded-3xl apple-glass p-6 text-left shadow-apple-glass transition-all"
              style={{ transform: `scale(${0.95 + chip3 * 0.05})`, opacity: Math.min(1, chip3 * 1.5) }}
            >
              <div className="text-purple-600 font-mono text-xs font-bold">START POINT 03</div>
              <div className="text-slate-900 font-black text-xl mt-1">ASYMMETRIC LUCK</div>
              <div className="text-slate-500 text-sm mt-1">Random timing & encounters</div>
            </div>

            <div
              className="rounded-3xl apple-glass p-6 text-left shadow-apple-glass transition-all"
              style={{ transform: `scale(${0.95 + chip4 * 0.05})`, opacity: Math.min(1, chip4 * 1.5) }}
            >
              <div className="text-emerald-600 font-mono text-xs font-bold">START POINT 04</div>
              <div className="text-slate-900 font-black text-xl mt-1">DIFFERENT TIMING</div>
              <div className="text-slate-500 text-sm mt-1">Your own personal biological clock</div>
            </div>
          </div>
        </div>
      )}

      {/* SCENE 3: FREEZE DANGER ALERT */}
      {activeScene === 3 && (
        <div
          className="relative w-full max-w-[920px] flex flex-col items-center"
          style={{
            transform: `scale(${0.96 + s3 * 0.04}) translateY(${(1 - s3) * 20}px)`,
            opacity: Math.min(1, s3 * 1.5),
          }}
        >
          <div className="w-full rounded-[36px] apple-glass p-9 flex flex-col items-center text-center relative overflow-hidden border-rose-300/60 shadow-apple-glow-rose">
            <div className="w-20 h-20 rounded-3xl bg-rose-500/15 border border-rose-400/30 flex items-center justify-center mb-5 text-rose-500">
              <AlertTriangle className="w-10 h-10" />
            </div>

            <div className="text-rose-600 font-mono text-sm font-bold tracking-widest uppercase mb-2">
              THE REAL HAZARD
            </div>
            <div className="text-slate-900 font-black text-3xl md:text-4xl tracking-tight uppercase mb-4">
              COMPARISON PARALYSIS
            </div>

            <div className="w-full bg-slate-100/90 rounded-2xl p-5 text-slate-700 text-base md:text-lg font-medium leading-relaxed mb-5 border border-slate-200/60">
              Feeling behind makes you <span className="text-rose-600 font-bold">freeze</span> — and stopping is what actually causes delay.
            </div>

            <div className="w-full py-4 rounded-2xl bg-slate-900 text-white font-mono text-sm font-bold tracking-wider uppercase flex items-center justify-center gap-3 shadow-md">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              CORE RULE: KEEP MOVING DAILY
            </div>
          </div>
        </div>
      )}

      {/* SCENE 4: ONE TRUE THING DISCOVERY */}
      {activeScene === 4 && (
        <div
          className="relative w-full max-w-[920px] flex flex-col items-center gap-4"
          style={{
            transform: `scale(${0.96 + s4 * 0.04})`,
            opacity: Math.min(1, s4 * 1.5),
          }}
        >
          <div className="px-8 py-3 rounded-full apple-glass text-slate-800 font-mono text-sm font-bold uppercase tracking-wider flex items-center gap-3 shadow-sm">
            <Compass className="w-5 h-5 text-sky-500" />
            ONE TRUE THING PROTOCOL
          </div>

          <div className="w-full flex flex-col gap-3.5">
            <div
              className="rounded-3xl apple-glass p-5 flex items-center justify-between shadow-apple-glass transition-all"
              style={{ transform: `scale(${0.96 + tag1 * 0.04})`, opacity: Math.min(1, tag1 * 1.5) }}
            >
              <span className="text-slate-900 font-black text-xl flex items-center gap-3">
                <span className="w-3.5 h-3.5 rounded-full bg-sky-500" />
                1. CURIOUS ABOUT
              </span>
              <span className="text-sky-600 font-mono text-xs font-bold px-4 py-1.5 rounded-xl bg-sky-500/10 border border-sky-500/20">
                EXPLORE
              </span>
            </div>

            <div
              className="rounded-3xl apple-glass p-5 flex items-center justify-between shadow-apple-glass transition-all"
              style={{ transform: `scale(${0.96 + tag2 * 0.04})`, opacity: Math.min(1, tag2 * 1.5) }}
            >
              <span className="text-slate-900 font-black text-xl flex items-center gap-3">
                <span className="w-3.5 h-3.5 rounded-full bg-indigo-500" />
                2. NATURALLY GOOD AT
              </span>
              <span className="text-indigo-600 font-mono text-xs font-bold px-4 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                LEVERAGE
              </span>
            </div>

            <div
              className="rounded-3xl apple-glass p-5 flex items-center justify-between shadow-apple-glass transition-all"
              style={{ transform: `scale(${0.96 + tag3 * 0.04})`, opacity: Math.min(1, tag3 * 1.5) }}
            >
              <span className="text-slate-900 font-black text-xl flex items-center gap-3">
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-500" />
                3. DRAWN TOWARDS
              </span>
              <span className="text-emerald-600 font-mono text-xs font-bold px-4 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                ACTIVATE
              </span>
            </div>
          </div>
        </div>
      )}

      {/* SCENE 5: CTA - COMMENT YOUR ONE TRUE THING */}
      {activeScene === 5 && (
        <div
          className="relative w-full max-w-[920px] flex flex-col items-center"
          style={{
            transform: `scale(${0.96 + s5 * 0.04}) translateY(${(1 - s5) * 20}px)`,
            opacity: Math.min(1, s5 * 1.5),
          }}
        >
          <div className="w-full rounded-[36px] apple-glass p-9 flex flex-col items-center text-center relative overflow-hidden shadow-apple-glow-blue">
            <div className="w-20 h-20 rounded-3xl bg-sky-500/15 border border-sky-400/40 flex items-center justify-center mb-4 text-sky-600">
              <MessageSquareHeart className="w-10 h-10" />
            </div>

            <div className="text-sky-600 font-mono text-sm font-bold tracking-widest uppercase mb-2">
              COMMUNITY PROMPT
            </div>
            <div className="text-slate-900 font-black text-3xl md:text-4xl tracking-tight mb-6">
              COMMENT ONE TRUE THING
            </div>

            {/* Apple Message / Comment Input Box */}
            <div className="w-full bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
              <div className="text-slate-400 text-base font-medium flex items-center gap-3">
                <span>"Right now, I am..."</span>
                <span className="w-0.5 h-5 bg-sky-500 animate-pulse" />
              </div>
              <div className="w-11 h-11 rounded-xl bg-sky-500 flex items-center justify-center text-white shadow-sm">
                <Send className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
