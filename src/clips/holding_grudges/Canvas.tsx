import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { ProCutout } from "../../components/ProCutout";
import { PropComparison } from "../../components/PropComparison";
import { KineticScene } from "../../components/KineticScene";
import { KineticCascadeItem } from "../../components/KineticCascade";
import { WordTimestamp } from "../../types";
import { AlertCircle, ShieldAlert } from "lucide-react";

interface CanvasProps {
  transcript: WordTimestamp[];
}

export const HoldingGrudgesCanvas: React.FC<CanvasProps> = () => {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-20 select-none overflow-hidden">
      {/* ─────────────────────────────────────────────────────────────
          SCENE 1: THE ROOT FRICTION • UNFINISHED EXPERIENCES (5300ms - 17000ms)
          Pro CapCut-grade entrance, living hold drift, and cinematic exit
      ───────────────────────────────────────────────────────────── */}
      <KineticScene
        startMs={5300}
        endMs={17000}
        inTransition="snap_up"
        outTransition="zoom_out"
        inDurationMs={420}
        outDurationMs={320}
        livingDrift={true}
      >
        <div className="w-full max-w-[1000px] flex flex-col items-center gap-7 px-6 relative">
          {/* Ghost Headline with downward glide */}
          <KineticCascadeItem delayMs={5300} durationMs={360} direction="down" distance={20}>
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 text-[260px] font-black text-slate-900/[0.04] leading-none tracking-tighter uppercase pointer-events-none select-none">
              LOOP
            </div>
          </KineticCascadeItem>

          {/* Topic Badge with snappy pop */}
          <KineticCascadeItem delayMs={5360} durationMs={380} direction="up" distance={25}>
            <div className="px-10 py-3.5 rounded-full bg-slate-950 text-rose-400 font-mono text-[22px] font-black uppercase tracking-widest flex items-center gap-3.5 shadow-2xl border-2 border-rose-500/30">
              <AlertCircle className="w-7 h-7 text-rose-500" />
              STAGE 01 • UNFINISHED BUSINESS
            </div>
          </KineticCascadeItem>

          {/* Main Diagnostic Card with Cutout */}
          <KineticCascadeItem delayMs={5460} durationMs={450} direction="up" distance={45}>
            <div className="w-full rounded-[52px] p-10 bg-white/95 backdrop-blur-2xl border-[4px] border-rose-200/80 shadow-2xl flex items-center gap-8">
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
          </KineticCascadeItem>
        </div>
      </KineticScene>

      {/* ─────────────────────────────────────────────────────────────
          SCENE 2: THE GRUDGE PARADOX • ILLUSION VS REALITY (16850ms - 26000ms)
          Seamless whip-in overlap with Scene 1's exit blur
      ───────────────────────────────────────────────────────────── */}
      <KineticScene
        startMs={16850}
        endMs={26000}
        inTransition="whip_right"
        outTransition="snap_up"
        inDurationMs={440}
        outDurationMs={320}
        livingDrift={true}
      >
        <div className="w-full max-w-[1020px] flex flex-col items-center gap-6 px-6 relative">
          {/* Ghost Headline */}
          <KineticCascadeItem delayMs={16850} durationMs={360} direction="down" distance={20}>
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 text-[260px] font-black text-slate-900/[0.04] leading-none tracking-tighter uppercase pointer-events-none select-none">
              BURDEN
            </div>
          </KineticCascadeItem>

          {/* Topic Badge */}
          <KineticCascadeItem delayMs={16900} durationMs={380} direction="up" distance={25}>
            <div className="px-10 py-3.5 rounded-full bg-slate-950 text-sky-400 font-mono text-[22px] font-black uppercase tracking-widest flex items-center gap-3.5 shadow-2xl border-2 border-sky-500/30">
              <ShieldAlert className="w-7 h-7 text-sky-400" />
              STAGE 02 • THE GRUDGE PARADOX
            </div>
          </KineticCascadeItem>

          {/* Side-by-Side Comparison Card */}
          <KineticCascadeItem delayMs={17000} durationMs={450} direction="up" distance={40}>
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
          </KineticCascadeItem>
        </div>
      </KineticScene>
    </div>
  );
};
