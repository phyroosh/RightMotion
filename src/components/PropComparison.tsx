import React from "react";
import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { CutoutAssetId } from "./CutoutLibrary";
import { ProCutout, GlowColor } from "./ProCutout";
import { XCircle, CheckCircle2 } from "lucide-react";

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
  revealRightMs?: number; // Milliseconds when container expands and right card reveals
  progressive?: boolean;  // Enables progressive horizontal morph expansion
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
  startMs = 0,
  revealRightMs,
  progressive = true,
  className = "",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentMs = (frame / fps) * 1000;

  // 1. Initial Left Entry Spring
  const startFrame = Math.floor((startMs / 1000) * fps);
  const relLeftFrame = Math.max(0, frame - startFrame);

  const spLeft = spring({
    frame: relLeftFrame,
    fps,
    config: { damping: 18, mass: 0.8, stiffness: 100 },
  });

  // 2. Progressive Right Expansion Spring
  const rightMs = revealRightMs ?? (startMs + 3500);
  const rightStartFrame = Math.floor((rightMs / 1000) * fps);
  const relRightFrame = Math.max(0, frame - rightStartFrame);

  const spExpand = progressive
    ? spring({
        frame: relRightFrame,
        fps,
        config: { damping: 20, mass: 0.85, stiffness: 90 },
      })
    : 1;

  const spRight = progressive
    ? spring({
        frame: Math.max(0, relRightFrame - 2),
        fps,
        config: { damping: 18, mass: 0.8, stiffness: 110 },
      })
    : spring({
        frame: Math.max(0, relLeftFrame - 8),
        fps,
        config: { damping: 18, mass: 0.8, stiffness: 100 },
      });

  const spDivider = progressive
    ? spring({
        frame: Math.max(0, relRightFrame - 1),
        fps,
        config: { damping: 16, mass: 0.7, stiffness: 120 },
      })
    : spRight;

  const isRightActive = !progressive || currentMs >= rightMs - 50;

  // Container width smoothly morphs from 540px to 1020px
  const containerWidth = progressive
    ? interpolate(spExpand, [0, 1], [540, 1020], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 1020;

  return (
    <div
      className={`relative rounded-[52px] p-7 bg-white/95 backdrop-blur-2xl border-[4px] border-slate-200 shadow-[0_30px_90px_rgba(0,0,0,0.12)] flex items-center justify-between gap-6 select-none overflow-hidden ${className}`}
      style={{
        width: `${containerWidth}px`,
        maxWidth: "1020px",
      }}
    >
      {/* Left Problem Card */}
      <div
        className="flex-1 min-w-[360px] rounded-[44px] p-7 bg-rose-50/90 border-[3px] border-rose-200 flex flex-col items-center text-center gap-5 relative overflow-hidden shadow-md"
        style={{
          transform: `translateY(${(1 - spLeft) * 30}px) scale(${0.92 + spLeft * 0.08})`,
          opacity: Math.min(1, spLeft * 1.5),
        }}
      >
        <div className="px-6 py-2.5 rounded-full bg-rose-600 text-white font-mono text-[22px] font-black uppercase tracking-wider flex items-center gap-2.5 shadow-sm">
          <XCircle className="w-6 h-6 text-white shrink-0" />
          {leftBadge}
        </div>

        <div className="w-52 h-52 my-1">
          <ProCutout
            assetId={leftAssetId}
            glowColor={leftGlow}
            animation="punch_in"
            width="100%"
            height="100%"
          />
        </div>

        <div className="text-4xl font-black text-rose-950 uppercase tracking-tight">
          {leftTitle}
        </div>
        {leftSubtitle && (
          <div className="text-2xl font-bold text-rose-900 leading-snug">
            {leftSubtitle}
          </div>
        )}
      </div>

      {/* Center Dynamic Pill Divider (Spins & Pops on expansion) */}
      {isRightActive && (
        <div
          className="flex flex-col items-center justify-center shrink-0 z-20"
          style={{
            transform: `scale(${spDivider}) rotate(${(1 - spDivider) * -180}deg)`,
            opacity: Math.min(1, spDivider * 1.8),
          }}
        >
          <div className="w-16 h-16 rounded-full bg-slate-950 text-amber-300 font-mono font-black text-2xl flex items-center justify-center shadow-xl border-2 border-amber-400">
            {centerDividerText}
          </div>
        </div>
      )}

      {/* Right Solution Card (Appears smoothly during expansion) */}
      {isRightActive && (
        <div
          className="flex-1 min-w-[360px] rounded-[44px] p-7 bg-emerald-50/90 border-[3px] border-emerald-200 flex flex-col items-center text-center gap-5 relative overflow-hidden shadow-md"
          style={{
            transform: `translateY(${(1 - spRight) * 35}px) scale(${0.88 + spRight * 0.12})`,
            opacity: Math.min(1, spRight * 1.5),
          }}
        >
          <div className="px-6 py-2.5 rounded-full bg-emerald-600 text-white font-mono text-[22px] font-black uppercase tracking-wider flex items-center gap-2.5 shadow-sm">
            <CheckCircle2 className="w-6 h-6 text-white shrink-0" />
            {rightBadge}
          </div>

          <div className="w-52 h-52 my-1">
            <ProCutout
              assetId={rightAssetId}
              glowColor={rightGlow}
              animation="stamp_impact"
              width="100%"
              height="100%"
            />
          </div>

          <div className="text-4xl font-black text-emerald-950 uppercase tracking-tight">
            {rightTitle}
          </div>
          {rightSubtitle && (
            <div className="text-2xl font-bold text-emerald-900 leading-snug">
              {rightSubtitle}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
