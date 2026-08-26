import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  Zap,
  ArrowRight,
  Sparkles,
  Flame,
  CheckCircle2,
  Hourglass,
  Layers,
  Timer,
} from "lucide-react";
import { WordTimestamp } from "../../types";

interface CanvasProps {
  transcript: WordTimestamp[];
}

export const MotivationCanvas: React.FC<CanvasProps> = () => {
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
  // (0-6s), (10.8-17s), (21.8-27.5s), (34.8s-end)
  const isARoll =
    (currentMs >= 0 && currentMs < 6000) ||
    (currentMs >= 10800 && currentMs < 17000) ||
    (currentMs >= 21800 && currentMs < 27500) ||
    currentMs >= 34800;

  if (isARoll) return null;

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-20 select-none overflow-hidden flex flex-col items-center justify-center p-8">
      {/* ===================================================================
          1. THE FALSE EQUATION (6,000 - 10,800ms)
          Editor Mindset: Red cross-out of false belief + corrected equation
      =================================================================== */}
      {currentMs >= 6000 && currentMs < 10800 && (() => {
        const s = sp(6000);
        return (
          <div
            className="w-full max-w-[900px] p-8 rounded-[36px] apple-glass border-3 border-rose-300 shadow-2xl flex flex-col items-center gap-6"
            style={{
              transform: `scale(${0.92 + s * 0.08})`,
              opacity: Math.min(1, s * 1.5),
            }}
          >
            <span className="font-mono text-xs font-black text-rose-500 uppercase tracking-widest">
              THE COMMON MYTH
            </span>

            <div className="flex items-center gap-4 text-3xl font-black text-slate-400 line-through">
              <span>MOTIVATION</span>
              <ArrowRight className="w-8 h-8 text-rose-400" />
              <span>ACTION</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/95 border-3 border-[#0071e3] shadow-lg flex items-center gap-4 text-3xl font-black text-slate-950">
              <span className="text-[#0071e3]">ACTION</span>
              <ArrowRight className="w-8 h-8 text-[#0071e3]" />
              <span className="text-emerald-600">MOTIVATION</span>
            </div>

            <span className="font-serif italic text-xl font-black text-sky-600">
              ✍️ "Waiting for motivation is the trap"
            </span>
          </div>
        );
      })()}

      {/* ===================================================================
          2. THE NEURAL FLIP TRIGGER (17,000 - 21,800ms)
          Editor Mindset: Tiny Action Spark Lights Up Brain
      =================================================================== */}
      {currentMs >= 17000 && currentMs < 21800 && (() => {
        const s = sp(17000);
        return (
          <div
            className="w-full max-w-[900px] p-8 rounded-[36px] bg-slate-950 text-white border-4 border-amber-400 shadow-[0_25px_70px_rgba(245,158,11,0.25)] flex items-center gap-6"
            style={{
              transform: `scale(${0.92 + s * 0.08})`,
              opacity: Math.min(1, s * 1.5),
            }}
          >
            <div className="w-20 h-20 rounded-3xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0">
              <Zap className="w-12 h-12 animate-bounce" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-amber-400 font-mono text-xs font-black uppercase tracking-widest">
                THE NEURAL SHIFT
              </span>
              <span className="font-black text-2xl uppercase tracking-tight text-white">
                "Oh. We're actually doing this."
              </span>
              <span className="text-xs text-slate-300 font-medium">
                Momentum sparks only after physical movement begins.
              </span>
            </div>
          </div>
        );
      })()}

      {/* ===================================================================
          3. THE MICRO QUESTION (27,500 - 34,800ms)
          Editor Mindset: Clean diagnostic micro-action card
      =================================================================== */}
      {currentMs >= 27500 && currentMs < 34800 && (() => {
        const s = sp(27500);
        return (
          <div
            className="w-full max-w-[900px] p-8 rounded-[36px] bg-white/98 border-4 border-emerald-400 shadow-[0_25px_70px_rgba(16,185,129,0.25)] flex flex-col items-center gap-5"
            style={{
              transform: `scale(${0.92 + s * 0.08})`,
              opacity: Math.min(1, s * 1.5),
            }}
          >
            <div className="px-4 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 font-mono text-xs font-black uppercase tracking-widest">
              THE 1-STEP HEURISTIC
            </div>

            <h3 className="text-3xl font-black text-slate-950 text-center uppercase tracking-tight">
              "What is the smallest thing I can do right now?"
            </h3>

            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 font-bold text-xs flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Open 1 document</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 font-bold text-xs flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Write 1 sentence</span>
              </div>
            </div>

            <span className="font-serif italic text-xl font-black text-[#0071e3]">
              ✍️ "Make starting feel frictionless"
            </span>
          </div>
        );
      })()}
    </div>
  );
};
