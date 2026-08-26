import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  Brain,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Layers,
  HeartHandshake,
  CheckCircle2,
  Hourglass,
  Calendar,
} from "lucide-react";
import { WordTimestamp } from "../../types";

interface CanvasProps {
  transcript: WordTimestamp[];
}

export const MaturityCanvas: React.FC<CanvasProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentMs = (frame / fps) * 1000;

  const sp = (delayMs: number, d = 18, s = 120, m = 0.8) => {
    const df = Math.floor((delayMs / 1000) * fps);
    return spring({
      frame: Math.max(0, frame - df),
      fps,
      config: { damping: d, stiffness: s, mass: m },
    });
  };

  // A-Roll Presenter is active during:
  // (0-7s), (11.8-18s), (27.8-33s), (38.8s-end)
  const isARoll =
    (currentMs >= 0 && currentMs < 7000) ||
    (currentMs >= 11800 && currentMs < 18000) ||
    (currentMs >= 27800 && currentMs < 33000) ||
    currentMs >= 38800;

  if (isARoll) return null;

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-20 select-none overflow-hidden flex flex-col items-center justify-center p-8">
      {/* ===================================================================
          1. THE MATURITY EQUATION (7,000 - 11,800ms)
          Editor Mindset: Redefining age vs experience
      =================================================================== */}
      {currentMs >= 7000 && currentMs < 11800 && (() => {
        const s = sp(7000);
        return (
          <div
            className="w-full max-w-[900px] p-8 rounded-[36px] apple-glass border-3 border-indigo-200 shadow-2xl flex flex-col items-center gap-6"
            style={{
              transform: `scale(${0.92 + s * 0.08})`,
              opacity: Math.min(1, s * 1.5),
            }}
          >
            <span className="font-mono text-xs font-black text-indigo-600 uppercase tracking-widest">
              THE CORE REALITY
            </span>

            <div className="flex items-center gap-4 text-3xl font-black text-slate-400 line-through">
              <span>AGE</span>
              <span className="text-rose-500 font-bold">≠</span>
              <span>MATURITY</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/95 border-3 border-indigo-500 shadow-lg flex items-center gap-3 text-2xl font-black text-slate-950">
              <span className="text-indigo-600">MATURITY</span>
              <span>=</span>
              <span className="text-emerald-600">WHAT YOU LEARN TO HANDLE</span>
            </div>

            <span className="font-serif italic text-xl font-black text-sky-600">
              ✍️ "Consequences build character, not years"
            </span>
          </div>
        );
      })()}

      {/* ===================================================================
          2. TWO DEVELOPMENTAL PATHS (18,000 - 27,800ms)
          Editor Mindset: Early Responsibility vs Avoiding Consequences
      =================================================================== */}
      {currentMs >= 18000 && currentMs < 27800 && (() => {
        const s = sp(18000);
        return (
          <div
            className="w-full max-w-[950px] flex flex-col gap-4"
            style={{
              transform: `translateY(${(1 - s) * 25}px)`,
              opacity: Math.min(1, s * 1.5),
            }}
          >
            {/* Path 1 */}
            <div className="p-6 rounded-[30px] bg-white/98 border-3 border-emerald-400 shadow-xl flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-black shrink-0">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="flex flex-col">
                <span className="text-emerald-600 font-mono text-[10px] font-black uppercase">
                  EARLY RESPONSIBILITY & CONSEQUENCES
                </span>
                <span className="text-slate-950 font-black text-xl uppercase">
                  Learns to think ahead & regulate emotions
                </span>
              </div>
            </div>

            {/* Path 2 */}
            <div className="p-6 rounded-[30px] apple-glass border-2 border-rose-200 opacity-80 flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/15 text-rose-600 flex items-center justify-center font-black shrink-0">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <div className="flex flex-col">
                <span className="text-rose-600 font-mono text-[10px] font-black uppercase">
                  AVOIDS UNCOMFORTABLE CONSEQUENCES
                </span>
                <span className="text-slate-900 font-bold text-xl">
                  Can be 40 and still act like a teenager
                </span>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ===================================================================
          3. THE HEURISTIC (33,000 - 38,800ms)
          Editor Mindset: Birthdays crossed out
      =================================================================== */}
      {currentMs >= 33000 && currentMs < 38800 && (() => {
        const s = sp(33000);
        return (
          <div
            className="w-full max-w-[900px] p-8 rounded-[36px] bg-slate-950 text-white border-4 border-amber-400 shadow-[0_25px_70px_rgba(245,158,11,0.25)] flex flex-col items-center gap-5"
            style={{
              transform: `scale(${0.92 + s * 0.08})`,
              opacity: Math.min(1, s * 1.5),
            }}
          >
            <div className="px-4 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-mono text-xs font-black uppercase tracking-widest">
              THE TRUE METRIC
            </div>

            <div className="flex items-center gap-4 text-2xl font-bold text-slate-500 line-through">
              <Calendar className="w-7 h-7 text-slate-500" />
              <span>How Many Birthdays You've Had</span>
            </div>

            <div className="flex items-center gap-3 text-3xl font-black text-amber-300">
              <Sparkles className="w-8 h-8 text-amber-400" />
              <span>How Much You've Learned To Handle</span>
            </div>

            <span className="font-serif italic text-xl font-black text-sky-400">
              ✍️ "Depth comes from what you've carried"
            </span>
          </div>
        );
      })()}
    </div>
  );
};
