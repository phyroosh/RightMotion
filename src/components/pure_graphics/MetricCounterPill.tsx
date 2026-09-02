import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { RotateCw, Zap } from "lucide-react";

export interface MetricCounterPillProps {
  startMs: number;
  endMs: number;
  targetCount: number;
  label: string;
  badge?: string;
  unit?: string;
  accentColor?: "rose" | "amber" | "sky" | "emerald";
}

export const MetricCounterPill: React.FC<MetricCounterPillProps> = ({
  startMs,
  endMs,
  targetCount,
  label,
  badge = "REPLAY LOOP",
  unit = "REPLAYS",
  accentColor = "rose",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const startFrame = Math.floor((startMs / 1000) * fps);
  const durationFrames = Math.max(1, Math.floor(((endMs - startMs) / 1000) * fps));

  // Ticker progress
  const countProgress = interpolate(
    frame,
    [startFrame, startFrame + durationFrames * 0.75],
    [1, targetCount],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const displayCount = Math.floor(countProgress);
  const spinDeg = (frame - startFrame) * 8;

  const colorStyles = {
    rose: {
      accent: "#f43f5e",
      badgeBg: "rgba(244, 63, 94, 0.12)",
      badgeText: "#be123c",
      border: "rgba(244, 63, 94, 0.35)",
      glow: "rgba(244, 63, 94, 0.35)",
    },
    amber: {
      accent: "#f59e0b",
      badgeBg: "rgba(245, 158, 11, 0.12)",
      badgeText: "#b45309",
      border: "rgba(245, 158, 11, 0.35)",
      glow: "rgba(245, 158, 11, 0.35)",
    },
    sky: {
      accent: "#0071e3",
      badgeBg: "rgba(0, 113, 227, 0.12)",
      badgeText: "#0071e3",
      border: "rgba(0, 113, 227, 0.35)",
      glow: "rgba(0, 113, 227, 0.35)",
    },
    emerald: {
      accent: "#10b981",
      badgeBg: "rgba(16, 185, 129, 0.12)",
      badgeText: "#047857",
      border: "rgba(16, 185, 129, 0.35)",
      glow: "rgba(16, 185, 129, 0.35)",
    },
  }[accentColor];

  return (
    <div
      className="w-full max-w-[1000px] rounded-[52px] p-12 bg-white/95 backdrop-blur-2xl shadow-[0_30px_70px_rgba(15,23,42,0.12)] flex flex-col items-center gap-7 text-center"
      style={{ border: `4px solid ${colorStyles.border}` }}
    >
      {/* Top Header Badge */}
      <div className="flex items-center justify-between w-full">
        <div
          className="px-8 py-3 rounded-full font-mono font-black text-2xl uppercase tracking-widest flex items-center gap-3 border-2"
          style={{ background: colorStyles.badgeBg, color: colorStyles.badgeText, borderColor: colorStyles.border }}
        >
          <Zap className="w-6 h-6" />
          {badge}
        </div>
        <div className="flex items-center gap-3 text-rose-700 font-mono font-black text-xl">
          <RotateCw
            className="w-6 h-6 text-rose-600"
            style={{ transform: `rotate(${spinDeg}deg)` }}
          />
          LOOPING IN HEAD
        </div>
      </div>

      {/* Hero Counter Display */}
      <div className="flex items-baseline gap-5 my-2">
        <span
          className="text-9xl font-black tracking-tight"
          style={{
            color: colorStyles.accent,
            fontVariantNumeric: "tabular-nums",
            textShadow: `0 10px 40px ${colorStyles.glow}`,
          }}
        >
          #{displayCount}
        </span>
        <span className="text-4xl font-black text-slate-400 uppercase tracking-wider">
          {unit}
        </span>
      </div>

      {/* Description Label */}
      <div className="text-3xl md:text-4xl font-black text-slate-900 text-center max-w-[820px] leading-tight">
        {label}
      </div>
    </div>
  );
};
