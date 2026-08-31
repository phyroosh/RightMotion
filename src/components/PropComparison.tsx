import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CutoutAssetId } from "./CutoutLibrary";
import { ProCutout, GlowColor } from "./ProCutout";
import { ArrowRight, XCircle, CheckCircle2 } from "lucide-react";

export interface PropComparisonProps {
  leftAssetId: CutoutAssetId | string;
  leftTitle: string;
  leftSubtitle?: string;
  leftBadge?: string;
  leftGlow?: GlowColor;

  rightAssetId: CutoutAssetId | string;
  rightTitle: string;
  rightSubtitle?: string;
  rightBadge?: string;
  rightGlow?: GlowColor;

  centerDividerText?: string;
  currentMs?: number;
  startMs?: number;
  className?: string;
}

export const PropComparison: React.FC<PropComparisonProps> = ({
  leftAssetId,
  leftTitle,
  leftSubtitle,
  leftBadge = "BEFORE / PROBLEM",
  leftGlow = "rose",

  rightAssetId,
  rightTitle,
  rightSubtitle,
  rightBadge = "AFTER / SOLUTION",
  rightGlow = "emerald",

  centerDividerText = "VS",
  currentMs,
  startMs = 0,
  className = "",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const startFrame = Math.floor((startMs / 1000) * fps);
  const relFrame = Math.max(0, frame - startFrame);

  const spLeft = spring({
    frame: relFrame,
    fps,
    config: { damping: 18, mass: 0.8, stiffness: 100 },
  });

  const spRight = spring({
    frame: Math.max(0, relFrame - 8),
    fps,
    config: { damping: 18, mass: 0.8, stiffness: 100 },
  });

  return (
    <div
      className={`relative w-full max-w-[1020px] rounded-[52px] p-8 bg-white/95 backdrop-blur-2xl border-[4px] border-slate-200 shadow-2xl flex items-center justify-between gap-6 select-none ${className}`}
    >
      {/* Left Problem Card */}
      <div
        className="flex-1 rounded-[38px] p-6 bg-rose-50/70 border-[3px] border-rose-200/80 flex flex-col items-center text-center gap-4 relative overflow-hidden"
        style={{
          transform: `translateY(${(1 - spLeft) * 30}px) scale(${0.92 + spLeft * 0.08})`,
          opacity: Math.min(1, spLeft * 1.5),
        }}
      >
        <div className="px-5 py-1.5 rounded-full bg-rose-600 text-white font-mono text-[16px] font-black uppercase tracking-wider flex items-center gap-2 shadow-sm">
          <XCircle className="w-5 h-5 text-white" />
          {leftBadge}
        </div>

        <div className="w-48 h-48 my-2">
          <ProCutout
            assetId={leftAssetId}
            glowColor={leftGlow}
            animation="punch_in"
            width="100%"
            height="100%"
          />
        </div>

        <div className="text-3xl font-black text-rose-950 uppercase tracking-tight">
          {leftTitle}
        </div>
        {leftSubtitle && (
          <div className="text-lg font-medium text-rose-800 leading-snug">
            {leftSubtitle}
          </div>
        )}
      </div>

      {/* Center Dynamic Pill Divider */}
      <div className="flex flex-col items-center justify-center shrink-0 z-20">
        <div className="w-14 h-14 rounded-full bg-slate-950 text-amber-300 font-mono font-black text-xl flex items-center justify-center shadow-xl border-2 border-amber-400">
          {centerDividerText}
        </div>
      </div>

      {/* Right Solution Card */}
      <div
        className="flex-1 rounded-[38px] p-6 bg-emerald-50/70 border-[3px] border-emerald-200/80 flex flex-col items-center text-center gap-4 relative overflow-hidden"
        style={{
          transform: `translateY(${(1 - spRight) * 30}px) scale(${0.92 + spRight * 0.08})`,
          opacity: Math.min(1, spRight * 1.5),
        }}
      >
        <div className="px-5 py-1.5 rounded-full bg-emerald-600 text-white font-mono text-[16px] font-black uppercase tracking-wider flex items-center gap-2 shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-white" />
          {rightBadge}
        </div>

        <div className="w-48 h-48 my-2">
          <ProCutout
            assetId={rightAssetId}
            glowColor={rightGlow}
            animation="stamp_impact"
            width="100%"
            height="100%"
          />
        </div>

        <div className="text-3xl font-black text-emerald-950 uppercase tracking-tight">
          {rightTitle}
        </div>
        {rightSubtitle && (
          <div className="text-lg font-medium text-emerald-800 leading-snug">
            {rightSubtitle}
          </div>
        )}
      </div>
    </div>
  );
};
