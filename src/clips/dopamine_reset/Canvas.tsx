import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ProCutout } from "../../components/ProCutout";
import { WordTimestamp } from "../../types";
import { Sparkles, AlertCircle, Target } from "lucide-react";

interface CanvasProps {
  transcript: WordTimestamp[];
}

export const DopamineResetCanvas: React.FC<CanvasProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentMs = (frame / fps) * 1000;

  // Scene Timings:
  // Scene 1 (Diagnostic Problem): 1536ms - 3412ms
  // Scene 2 (Neural Shift / Solution): 3412ms - 5444ms
  const isScene1 = currentMs >= 1536 && currentMs < 3412;
  const isScene2 = currentMs >= 3412 && currentMs < 5444;

  const sp = (delayMs: number, d = 20, s = 90, m = 0.85) => {
    const df = Math.floor((delayMs / 1000) * fps);
    return spring({
      frame: Math.max(0, frame - df),
      fps,
      config: { damping: d, stiffness: s, mass: m },
    });
  };

  if (!isScene1 && !isScene2) return null;

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-20 select-none overflow-hidden flex flex-col items-center justify-center px-6">
      {/* ─────────────────────────────────────────────────────────────
          SCENE 1: THE ROOT FRICTION & DIAGNOSTIC PROBLEM
      ───────────────────────────────────────────────────────────── */}
      {isScene1 && (() => {
        const sCard = sp(1536);

        return (
          <div className="w-full max-w-[1000px] flex flex-col items-center gap-7">
            {/* Ghost Headline */}
            <div className="absolute -top-32 text-[260px] font-black text-slate-900/[0.04] leading-none tracking-tighter uppercase pointer-events-none select-none">
              TRAP
            </div>

            {/* Topic Badge */}
            <div
              className="px-10 py-3.5 rounded-full bg-slate-950 text-rose-400 font-mono text-[22px] font-black uppercase tracking-widest flex items-center gap-3.5 shadow-2xl border-2 border-rose-500/30"
              style={{
                transform: `translateY(${(1 - sCard) * -20}px)`,
                opacity: Math.min(1, sCard * 1.5),
              }}
            >
              <AlertCircle className="w-7 h-7 text-rose-500" />
              STAGE 01 • THE HIDDEN TRAP
            </div>

            {/* Main Diagnostic Card */}
            <div
              className="w-full rounded-[52px] p-10 bg-white/95 backdrop-blur-2xl border-[4px] border-rose-200/80 shadow-2xl flex items-center gap-8"
              style={{
                transform: `translateY(${(1 - sCard) * 45}px) scale(${0.94 + sCard * 0.06})`,
                opacity: Math.min(1, sCard * 1.5),
              }}
            >
              <div className="w-64 h-64 shrink-0">
                <ProCutout
                  assetId="phone_dopamine_overload"
                  glowColor="rose"
                  animation="punch_in"
                  annotation="BURNOUT LOOP"
                  annotationPosition="top-right"
                  width="100%"
                  height="100%"
                />
              </div>

              <div className="flex-1 flex flex-col gap-4">
                <div className="text-4xl font-black text-slate-950 uppercase tracking-tight leading-tight">
                  Neural Circuit Overload
                </div>
                <div className="p-5 rounded-2xl bg-rose-50 border-2 border-rose-200/80 text-rose-950 font-black text-2xl flex items-center gap-3">
                  <span className="w-3.5 h-3.5 rounded-full bg-rose-500 shrink-0" />
                  <span>Draining focus before you even begin</span>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ─────────────────────────────────────────────────────────────
          SCENE 2: THE NEURAL REWIRE & SOLUTION FRAMEWORK
      ───────────────────────────────────────────────────────────── */}
      {isScene2 && (() => {
        const sCard = sp(3412);

        return (
          <div className="w-full max-w-[1000px] flex flex-col items-center gap-7">
            {/* Ghost Headline */}
            <div className="absolute -top-32 text-[260px] font-black text-slate-900/[0.04] leading-none tracking-tighter uppercase pointer-events-none select-none">
              REWIRE
            </div>

            {/* Topic Badge */}
            <div
              className="px-10 py-3.5 rounded-full bg-slate-950 text-emerald-400 font-mono text-[22px] font-black uppercase tracking-widest flex items-center gap-3.5 shadow-2xl border-2 border-emerald-500/30"
              style={{
                transform: `translateY(${(1 - sCard) * -20}px)`,
                opacity: Math.min(1, sCard * 1.5),
              }}
            >
              <Target className="w-7 h-7 text-emerald-400" />
              STAGE 02 • THE PROTOCOL
            </div>

            {/* Solution Hero Card */}
            <div
              className="w-full rounded-[52px] p-10 bg-white/95 backdrop-blur-2xl border-[4px] border-emerald-200/80 shadow-2xl flex items-center gap-8"
              style={{
                transform: `translateY(${(1 - sCard) * 45}px) scale(${0.94 + sCard * 0.06})`,
                opacity: Math.min(1, sCard * 1.5),
              }}
            >
              <div className="w-64 h-64 shrink-0">
                <ProCutout
                  assetId="hyperrealistic_3d_glowing_brain"
                  glowColor="emerald"
                  animation="stamp_impact"
                  annotation="REWIRED"
                  annotationPosition="top-right"
                  width="100%"
                  height="100%"
                />
              </div>

              <div className="flex-1 flex flex-col gap-4">
                <div className="text-4xl font-black text-slate-950 uppercase tracking-tight leading-tight">
                  High-Retention Clarity
                </div>
                <div className="p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-200/80 text-emerald-950 font-black text-2xl flex items-center gap-3">
                  <Sparkles className="w-7 h-7 text-emerald-600 shrink-0" />
                  <span>1 Micro-Shift Transforms The Output</span>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
