import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ProCutout } from "../../components/ProCutout";
import { PropComparison } from "../../components/PropComparison";
import { WordTimestamp } from "../../types";
import { AlertCircle, Brain, Sparkles, ShieldAlert } from "lucide-react";

interface CanvasProps {
  transcript: WordTimestamp[];
}

export const HoldingGrudgesCanvas: React.FC<CanvasProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentMs = (frame / fps) * 1000;

  // Scene Timings:
  // Scene 1 (The Open Loop Diagnostic): 5300ms - 17000ms
  // Scene 2 (The Grudge Paradox - Illusion vs Reality): 17000ms - 26000ms
  const isScene1 = currentMs >= 5300 && currentMs < 17000;
  const isScene2 = currentMs >= 17000 && currentMs < 26000;

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
          SCENE 1: THE ROOT FRICTION • UNFINISHED EXPERIENCES
      ───────────────────────────────────────────────────────────── */}
      {isScene1 && (() => {
        const sCard = sp(5300);

        return (
          <div className="w-full max-w-[1000px] flex flex-col items-center gap-7">
            {/* Ghost Headline */}
            <div className="absolute -top-32 text-[260px] font-black text-slate-900/[0.04] leading-none tracking-tighter uppercase pointer-events-none select-none">
              LOOP
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
              STAGE 01 • UNFINISHED BUSINESS
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
                  assetId="tangled_confusion_chaos"
                  glowColor="rose"
                  animation="punch_in"
                  annotation="RACING THOUGHTS"
                  annotationPosition="top-right"
                  width="100%"
                  height="100%"
                />
              </div>

              <div className="flex-1 flex flex-col gap-4">
                <div className="text-4xl font-black text-slate-950 uppercase tracking-tight leading-tight">
                  Brain Hates Open Loops
                </div>
                <div className="p-5 rounded-2xl bg-rose-50 border-2 border-rose-200/80 text-rose-950 font-black text-2xl flex items-center gap-3">
                  <span className="w-3.5 h-3.5 rounded-full bg-rose-500 shrink-0" />
                  <span>Replaying the past to solve what cannot be undone</span>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ─────────────────────────────────────────────────────────────
          SCENE 2: THE GRUDGE PARADOX • ILLUSION VS REALITY
      ───────────────────────────────────────────────────────────── */}
      {isScene2 && (
        <div className="w-full max-w-[1020px] flex flex-col items-center gap-6">
          {/* Ghost Headline */}
          <div className="absolute -top-32 text-[260px] font-black text-slate-900/[0.04] leading-none tracking-tighter uppercase pointer-events-none select-none">
            BURDEN
          </div>

          {/* Topic Badge */}
          <div className="px-10 py-3.5 rounded-full bg-slate-950 text-sky-400 font-mono text-[22px] font-black uppercase tracking-widest flex items-center gap-3.5 shadow-2xl border-2 border-sky-500/30">
            <ShieldAlert className="w-7 h-7 text-sky-400" />
            STAGE 02 • THE GRUDGE PARADOX
          </div>

          {/* Side-by-Side Comparison Card */}
          <PropComparison
            leftAssetId="setting_boundary_stop_hand"
            leftTitle="The Illusion"
            leftSubtitle="Feels like armor & self-protection"
            leftBadge="WHAT IT FEELS LIKE"
            leftGlow="sky"

            rightAssetId="slumped_anxiety_scribble"
            rightTitle="The Reality"
            rightSubtitle="Carrying them rent-free in your own head"
            rightBadge="WHAT IT ACTUALLY IS"
            rightGlow="rose"

            centerDividerText="VS"
            startMs={17000}
            revealRightMs={21200}
            progressive={true}
          />
        </div>
      )}
    </div>
  );
};
