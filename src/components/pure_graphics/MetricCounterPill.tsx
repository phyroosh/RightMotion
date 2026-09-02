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
  const currentMs = (frame / fps) * 1000;

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
      badgeText: "#e11d48",
      border: "rgba(244, 63, 94, 0.25)",
      glow: "rgba(244, 63, 94, 0.25)",
    },
    amber: {
      accent: "#f59e0b",
      badgeBg: "rgba(245, 158, 11, 0.12)",
      badgeText: "#d97706",
      border: "rgba(245, 158, 11, 0.25)",
      glow: "rgba(245, 158, 11, 0.25)",
    },
    sky: {
      accent: "#0071e3",
      badgeBg: "rgba(0, 113, 227, 0.12)",
      badgeText: "#0071e3",
      border: "rgba(0, 113, 227, 0.25)",
      glow: "rgba(0, 113, 227, 0.25)",
    },
    emerald: {
      accent: "#10b981",
      badgeBg: "rgba(16, 185, 129, 0.12)",
      badgeText: "#059669",
      border: "rgba(16, 185, 129, 0.25)",
      glow: "rgba(16, 185, 129, 0.25)",
    },
  }[accentColor];

  return (
    <div
      className="w-full max-w-[960px] rounded-[44px] p-8 bg-white/95 backdrop-blur-2xl shadow-[0_25px_60px_rgba(15,23,42,0.10)] flex flex-col items-center gap-6"
      style={{ border: `3px solid ${colorStyles.border}` }}
    >
      {/* Top Header Badge */}
      <div className="flex items-center justify-between w-full px-2">
        <div
          className="px-6 py-2 rounded-full font-mono font-black text-lg uppercase tracking-widest flex items-center gap-2"
          style={{ background: colorStyles.badgeBg, color: colorStyles.badgeText }}
        >
          <Zap className="w-5 h-5" />
          {badge}
        </div>
        <div className="flex items-center gap-2 text-slate-400 font-mono font-bold text-base">
          <RotateCw
            className="w-5 h-5 text-rose-500"
            style={{ transform: `rotate(${spinDeg}deg)` }}
          />
          CONTINUOUS BACKGROUND DRAIN
        </div>
      </div>

      {/* Hero Counter Display */}
      <div className="flex items-baseline gap-4">
        <span
          className="text-8xl font-black tracking-tight"
          style={{
            color: colorStyles.accent,
            fontVariantNumeric: "tabular-nums",
            textShadow: `0 8px 30px ${colorStyles.glow}`,
          }}
        >
          #{displayCount}
        </span>
        <span className="text-3xl font-black text-slate-400 uppercase tracking-wider">
          {unit}
        </span>
      </div>

      {/* Description Label */}
      <div className="text-2xl font-bold text-slate-700 text-center max-w-[700px] leading-snug">
        {label}
      </div>
    </div>
  );
};
