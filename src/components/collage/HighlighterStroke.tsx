import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export type HighlighterColor = "yellow" | "rose" | "emerald" | "sky";

export interface HighlighterStrokeProps {
  children: React.ReactNode;
  startMs?: number;
  durationMs?: number;
  color?: HighlighterColor;
  className?: string;
}

const HIGHLIGHTER_COLORS: Record<HighlighterColor, { bg: string; border: string }> = {
  yellow: {
    bg: "rgba(253, 224, 71, 0.45)",
    border: "rgba(250, 204, 21, 0.6)",
  },
  rose: {
    bg: "rgba(251, 113, 133, 0.35)",
    border: "rgba(244, 63, 94, 0.5)",
  },
  emerald: {
    bg: "rgba(110, 231, 183, 0.38)",
    border: "rgba(52, 211, 153, 0.55)",
  },
  sky: {
    bg: "rgba(125, 211, 252, 0.40)",
    border: "rgba(56, 189, 248, 0.55)",
  },
};

/**
 * 🖍️ HighlighterStroke
 * Translucent marker stroke that smoothly glides across text with organic edge bleeding.
 */
export const HighlighterStroke: React.FC<HighlighterStrokeProps> = ({
  children,
  startMs = 0,
  durationMs = 380,
  color = "yellow",
  className = "",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const startFrame = Math.floor((startMs / 1000) * fps);
  const durationFrames = Math.max(1, Math.floor((durationMs / 1000) * fps));
  const relFrame = Math.max(0, frame - startFrame);

  const progress = interpolate(
    relFrame,
    [0, durationFrames],
    [0, 100],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const palette = HIGHLIGHTER_COLORS[color];

  return (
    <span className={`relative inline-block ${className}`}>
      {/* Translucent highlighter background strip */}
      <span
        className="absolute left-0 bottom-1 h-[75%] rounded-md pointer-events-none -z-10 transition-all"
        style={{
          width: `${progress}%`,
          backgroundColor: palette.bg,
          boxShadow: `0 0 12px ${palette.bg}`,
          transform: "rotate(-0.5deg) skewX(-4deg)",
        }}
      />
      {children}
    </span>
  );
};
