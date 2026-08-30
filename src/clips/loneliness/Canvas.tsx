import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  Wifi,
  Heart,
  HeartHandshake,
  ShieldAlert,
  AlertTriangle,
  Sparkles,
  Eye,
  MessageCircle,
  ThumbsUp,
  Brain,
  Zap,
  LockKeyholeOpen,
  XCircle,
  CheckCircle2,
  Users,
  Compass,
} from "lucide-react";
import { WordTimestamp } from "../../types";

interface CanvasProps {
  transcript: WordTimestamp[];
}

export const LonelinessCanvas: React.FC<CanvasProps> = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const currentMs = (frame / fps) * 1000;

  // Snappy spring helper (Clean Enter & Rock-Solid Stationary Lock)
  const sp = (delayMs: number, d = 20, s = 95, m = 0.85) => {
    const df = Math.floor((delayMs / 1000) * fps);
    return spring({
      frame: Math.max(0, frame - df),
      fps,
      config: { damping: d, stiffness: s, mass: m },
    });
  };

  // Scene time ranges
  const isScene1 = currentMs >= 5200 && currentMs < 10000;
  const isScene2 = currentMs >= 10000 && currentMs < 18600;
  const isScene3 = currentMs >= 18600 && currentMs < 26200;
  const isScene4 = currentMs >= 26200 && currentMs < 32200;

  const isCanvasActive = isScene1 || isScene2 || isScene3 || isScene4;
  if (!isCanvasActive) return null;

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-20 select-none overflow-hidden">
      {/* ===================================================================
          SCENE 1: THE CONNECTION VS CLOSENESS PARADOX (5,200 - 10,000ms)
      =================================================================== */}
      {isScene1 && (() => {
        const sCard = sp(5200);
        const sRight = sp(6200);

        return (
          <div className="absolute inset-x-0 top-[46%] -translate-y-1/2 flex flex-col items-center justify-center px-6">
            <div
              className="relative w-full max-w-[1000px] flex flex-col items-center"
              style={{
                transform: `translateY(${(1 - sCard) * 50}px)`,
                opacity: Math.min(1, sCard * 1.5),
              }}
            >
              {/* Category Pill */}
              <div className="mb-6 px-10 py-4 rounded-full bg-slate-950 text-indigo-300 font-mono text-2xl font-black uppercase tracking-widest flex items-center gap-4 shadow-2xl border-2 border-indigo-500/50">
                <Wifi className="w-9 h-9 text-indigo-400" />
                THE SOCIAL MEDIA PARADOX
              </div>

              {/* Main Visual Glass Card */}
              <div className="w-full rounded-[56px] p-11 bg-white/98 border-[5px] border-indigo-200 shadow-2xl flex flex-col gap-8">
                <div className="text-5xl font-black text-slate-950 text-center leading-tight">
                  Connection <span className="text-rose-600">≠</span> Closeness
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {/* Left: Digital Connection */}
                  <div className="p-8 rounded-[36px] bg-slate-50 border-3 border-slate-200 flex flex-col gap-4 min-h-[240px] justify-center">
                    <div className="text-lg font-mono font-black text-slate-500 uppercase flex items-center gap-2">
                      <Users className="w-6 h-6 text-slate-400" /> DIGITAL NETWORK
                    </div>
                    <div className="text-3xl sm:text-4xl font-black text-slate-950">
                      10,000 Followers & Feeds
                    </div>
                    <div className="mt-1 text-lg font-bold text-slate-700 bg-slate-200/90 px-4 py-2 rounded-2xl w-fit border border-slate-300">
                      High Volume • 0% Depth
                    </div>
                  </div>

                  {/* Right: Genuine Closeness */}
                  <div
                    className="p-8 rounded-[36px] bg-rose-50 border-3 border-rose-300 flex flex-col gap-4 min-h-[240px] justify-center transition"
                    style={{
                      transform: `scale(${0.95 + sRight * 0.05})`,
                      opacity: Math.min(1, sRight * 1.5),
                    }}
                  >
                    <div className="text-lg font-mono font-black text-rose-600 uppercase flex items-center gap-2">
                      <HeartHandshake className="w-6 h-6 text-rose-500" /> EMOTIONAL INTIMACY
                    </div>
                    <div className="text-3xl sm:text-4xl font-black text-rose-950">
                      Vulnerability & Real Safety
                    </div>
                    <div className="mt-1 text-lg font-black text-rose-800 bg-rose-200 px-4 py-2 rounded-2xl w-fit flex items-center gap-2 border border-rose-300">
                      <XCircle className="w-6 h-6 text-rose-600" /> Missing In The Feed
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-3xl bg-indigo-500/10 border-2 border-indigo-500/30 flex items-center justify-between text-xl font-mono font-black text-indigo-950">
                  <span>Reality: Infinite scroll broadcasts noise, not emotional safety</span>
                  <span className="text-indigo-600 font-extrabold uppercase">SURFACE BIAS</span>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ===================================================================
          SCENE 2: SURFACE SIGNALS VS THE "I'M NOT OKAY" SANCTUARY (10,000 - 18,600ms)
      =================================================================== */}
      {isScene2 && (() => {
        const sCard = sp(10000);
        const sChip1 = sp(10600);
        const sChip2 = sp(11800);
        const sChip3 = sp(13000);
        const sSanctuary = sp(15000, 16, 110, 0.8);

        return (
          <div className="absolute inset-x-0 top-[46%] -translate-y-1/2 flex flex-col items-center justify-center px-6">
            <div
              className="relative w-full max-w-[1000px] flex flex-col items-center"
              style={{
                transform: `translateY(${(1 - sCard) * 50}px)`,
                opacity: Math.min(1, sCard * 1.5),
              }}
            >
              {/* Category Pill */}
              <div className="mb-6 px-10 py-4 rounded-full bg-slate-950 text-rose-300 font-mono text-2xl font-black uppercase tracking-widest flex items-center gap-4 shadow-2xl border-2 border-rose-500/50">
                <ShieldAlert className="w-9 h-9 text-rose-400" />
                THE INTERACTION AUDIT
              </div>

              {/* Main Visual Glass Card */}
              <div className="w-full rounded-[56px] p-11 bg-white/98 border-[5px] border-rose-200 shadow-2xl flex flex-col gap-7">
                {/* 3 Surface Actions */}
                <div className="text-2xl font-mono font-black text-slate-500 uppercase tracking-wider text-center">
                  SURFACE-LEVEL ONLINE ACTIONS
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {/* Action 1 */}
                  <div
                    className="p-5 rounded-3xl bg-slate-50 border-3 border-slate-200 flex flex-col items-center text-center gap-3"
                    style={{
                      transform: `scale(${0.92 + sChip1 * 0.08})`,
                      opacity: Math.min(1, sChip1 * 1.5),
                    }}
                  >
                    <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center">
                      <Eye className="w-8 h-8 text-indigo-600" />
                    </div>
                    <span className="text-2xl font-black text-slate-900 leading-tight">
                      Watch Life
                    </span>
                  </div>

                  {/* Action 2 */}
                  <div
                    className="p-5 rounded-3xl bg-slate-50 border-3 border-slate-200 flex flex-col items-center text-center gap-3"
                    style={{
                      transform: `scale(${0.92 + sChip2 * 0.08})`,
                      opacity: Math.min(1, sChip2 * 1.5),
                    }}
                  >
                    <div className="w-14 h-14 rounded-2xl bg-rose-100 flex items-center justify-center">
                      <ThumbsUp className="w-8 h-8 text-rose-600" />
                    </div>
                    <span className="text-2xl font-black text-slate-900 leading-tight">
                      Like Post
                    </span>
                  </div>

                  {/* Action 3 */}
                  <div
                    className="p-5 rounded-3xl bg-slate-50 border-3 border-slate-200 flex flex-col items-center text-center gap-3"
                    style={{
                      transform: `scale(${0.92 + sChip3 * 0.08})`,
                      opacity: Math.min(1, sChip3 * 1.5),
                    }}
                  >
                    <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center">
                      <MessageCircle className="w-8 h-8 text-amber-600" />
                    </div>
                    <span className="text-2xl font-black text-slate-900 leading-tight">
                      Reply Story
                    </span>
                  </div>
                </div>

                {/* The Missing Sanctuary Card */}
                <div
                  className="mt-2 p-8 rounded-[40px] bg-gradient-to-br from-slate-950 to-slate-900 border-4 border-rose-500/50 shadow-2xl flex flex-col items-center text-center gap-5 text-white"
                  style={{
                    transform: `scale(${0.94 + sSanctuary * 0.06}) translateY(${(1 - sSanctuary) * 20}px)`,
                    opacity: Math.min(1, sSanctuary * 1.5),
                  }}
                >
                  <div className="flex items-center gap-3 px-6 py-2 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-lg font-mono font-black uppercase">
                    <LockKeyholeOpen className="w-6 h-6 text-rose-400" />
                    THE MISSING SANCTUARY
                  </div>

                  <div className="text-5xl sm:text-6xl font-serif italic font-black text-rose-200">
                    “I’m not okay.”
                  </div>

                  <div className="text-2xl font-bold text-slate-300">
                    Never having that <span className="text-white font-black underline decoration-rose-400 decoration-4">one person</span> you can actually sit with
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ===================================================================
          SCENE 3: THE HIGHLIGHT REEL DISTORTION (18,600 - 26,200ms)
      =================================================================== */}
      {isScene3 && (() => {
        const sCard = sp(18600);
        const sStep1 = sp(19200);
        const sStep2 = sp(20400);
        const sStep3 = sp(21600);
        const sWarning = sp(23000, 16, 120, 0.7);

        return (
          <div className="absolute inset-x-0 top-[46%] -translate-y-1/2 flex flex-col items-center justify-center px-6">
            <div
              className="relative w-full max-w-[1000px] flex flex-col items-center"
              style={{
                transform: `translateY(${(1 - sCard) * 50}px)`,
                opacity: Math.min(1, sCard * 1.5),
              }}
            >
              {/* Category Pill */}
              <div className="mb-6 px-10 py-4 rounded-full bg-slate-950 text-amber-300 font-mono text-2xl font-black uppercase tracking-widest flex items-center gap-4 shadow-2xl border-2 border-amber-500/50">
                <Eye className="w-9 h-9 text-amber-400" />
                THE HIGHLIGHT REEL DISTORTION
              </div>

              {/* Main Visual Glass Card */}
              <div className="w-full rounded-[56px] p-11 bg-white/98 border-[5px] border-amber-200 shadow-2xl flex flex-col gap-6">
                <div className="text-4xl font-black text-slate-950 text-center">
                  How Everyone Else Looks Online:
                </div>

                {/* 3 Velocity Pillars */}
                <div className="grid grid-cols-3 gap-4">
                  <div
                    className="p-6 rounded-3xl bg-amber-50 border-3 border-amber-200 flex flex-col items-center text-center gap-2"
                    style={{
                      transform: `scale(${0.92 + sStep1 * 0.08})`,
                      opacity: Math.min(1, sStep1 * 1.5),
                    }}
                  >
                    <span className="text-lg font-mono font-black text-amber-700">STAGE 1</span>
                    <span className="text-2xl font-black text-slate-950">Doing Something</span>
                    <span className="text-sm font-bold text-amber-900 bg-amber-200/80 px-3 py-1 rounded-xl">Constant Action</span>
                  </div>

                  <div
                    className="p-6 rounded-3xl bg-amber-50 border-3 border-amber-200 flex flex-col items-center text-center gap-2"
                    style={{
                      transform: `scale(${0.92 + sStep2 * 0.08})`,
                      opacity: Math.min(1, sStep2 * 1.5),
                    }}
                  >
                    <span className="text-lg font-mono font-black text-amber-700">STAGE 2</span>
                    <span className="text-2xl font-black text-slate-950">Going Somewhere</span>
                    <span className="text-sm font-bold text-amber-900 bg-amber-200/80 px-3 py-1 rounded-xl">Visible Progress</span>
                  </div>

                  <div
                    className="p-6 rounded-3xl bg-amber-50 border-3 border-amber-200 flex flex-col items-center text-center gap-2"
                    style={{
                      transform: `scale(${0.92 + sStep3 * 0.08})`,
                      opacity: Math.min(1, sStep3 * 1.5),
                    }}
                  >
                    <span className="text-lg font-mono font-black text-amber-700">STAGE 3</span>
                    <span className="text-2xl font-black text-slate-950">Becoming Someone</span>
                    <span className="text-sm font-bold text-amber-900 bg-amber-200/80 px-3 py-1 rounded-xl">Curated Peak</span>
                  </div>
                </div>

                {/* The Silent Psychological Trap */}
                <div
                  className="p-7 rounded-3xl bg-rose-500/15 border-3 border-rose-500/40 flex flex-col items-center text-center gap-3 text-rose-950"
                  style={{
                    transform: `scale(${0.95 + sWarning * 0.05})`,
                    opacity: Math.min(1, sWarning * 1.5),
                  }}
                >
                  <div className="flex items-center gap-3 text-rose-700 font-mono font-black text-xl uppercase">
                    <AlertTriangle className="w-7 h-7 text-rose-600 animate-pulse" />
                    THE ISOLATION ILLUSION
                  </div>
                  <div className="text-3xl sm:text-4xl font-black text-rose-950 leading-snug">
                    “You start feeling like you’re the only one who’s lost.”
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ===================================================================
          SCENE 4: THE SCREEN OVERLOAD SHIFT (26,200 - 32,200ms)
      =================================================================== */}
      {isScene4 && (() => {
        const sCard = sp(26200);
        const sSolution = sp(28000);

        return (
          <div className="absolute inset-x-0 top-[46%] -translate-y-1/2 flex flex-col items-center justify-center px-6">
            <div
              className="relative w-full max-w-[1000px] flex flex-col items-center"
              style={{
                transform: `translateY(${(1 - sCard) * 50}px)`,
                opacity: Math.min(1, sCard * 1.5),
              }}
            >
              {/* Category Pill */}
              <div className="mb-6 px-10 py-4 rounded-full bg-slate-950 text-emerald-300 font-mono text-2xl font-black uppercase tracking-widest flex items-center gap-4 shadow-2xl border-2 border-emerald-500/50">
                <Brain className="w-9 h-9 text-emerald-400" />
                NEURAL GROUNDING REFRAME
              </div>

              {/* Main Visual Glass Card */}
              <div className="w-full rounded-[56px] p-11 bg-white/98 border-[5px] border-emerald-200 shadow-2xl flex flex-col gap-8">
                <div className="text-5xl font-black text-slate-950 text-center leading-tight">
                  What You Actually Need
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {/* Left: Screentime Overload */}
                  <div className="p-8 rounded-[36px] bg-rose-50 border-3 border-rose-200 flex flex-col gap-4 min-h-[220px] justify-center">
                    <div className="text-lg font-mono font-black text-rose-600 uppercase flex items-center gap-2">
                      <XCircle className="w-6 h-6 text-rose-500" /> SCREEN ADDICTION
                    </div>
                    <div className="text-3xl sm:text-4xl font-black text-slate-950">
                      More People On A Screen
                    </div>
                    <div className="text-lg font-bold text-rose-800 bg-rose-200/90 px-4 py-2 rounded-2xl w-fit border border-rose-300">
                      Endless Scroll • Empty Dopamine
                    </div>
                  </div>

                  {/* Right: Real Psychological Safety */}
                  <div
                    className="p-8 rounded-[36px] bg-emerald-50 border-3 border-emerald-300 flex flex-col gap-4 min-h-[220px] justify-center transition"
                    style={{
                      transform: `scale(${0.95 + sSolution * 0.05})`,
                      opacity: Math.min(1, sSolution * 1.5),
                    }}
                  >
                    <div className="text-lg font-mono font-black text-emerald-600 uppercase flex items-center gap-2">
                      <CheckCircle2 className="w-6 h-6 text-emerald-500" /> REAL CONNECTION
                    </div>
                    <div className="text-3xl sm:text-4xl font-black text-emerald-950">
                      One Real Person
                    </div>
                    <div className="text-lg font-black text-emerald-800 bg-emerald-200 px-4 py-2 rounded-2xl w-fit flex items-center gap-2 border border-emerald-300">
                      <Heart className="w-6 h-6 text-emerald-600" /> Safe Enough To Be Yourself
                    </div>
                  </div>
                </div>

                <div className="w-full py-6 rounded-3xl bg-emerald-500/15 border-2 border-emerald-500/40 text-emerald-950 font-mono font-black text-2xl flex items-center justify-center gap-4">
                  <Sparkles className="w-8 h-8 text-emerald-600" />
                  <span>1 REAL HUMAN ANCHOR HEALS DIGITAL ISOLATION</span>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
