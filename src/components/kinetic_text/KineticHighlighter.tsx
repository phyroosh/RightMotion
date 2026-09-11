import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export type HighlighterColor = "yellow" | "cyan" | "lime" | "rose" | "amber" | "violet";

export interface KineticHighlighterProps {
  children: React.ReactNode;
  /** Frame when the highlight stroke begins */
  startFrame: number;
  /** Duration of the drawing stroke in frames (default: 7) */
  durationFrames?: number;
  /** Color theme or custom hex code */
  color?: HighlighterColor | string;
  /** Opacity of the highlighter ink (default: 0.85) */
  opacity?: number;
  /** Slight organic rotation tilt in degrees (default: -0.6) */
  tiltAngle?: number;
  /** Thickness of the highlight bar relative to text height (default: "62%") */
  heightPercentage?: string;
  /** Custom class name */
  className?: string;
  /** Custom container style */
  style?: React.CSSProperties;
}

const HIGHLIGHT_PALETTE: Record<HighlighterColor, string> = {
  yellow: "#fef08a", // High-visibility fluorescent lemon
  cyan: "#a5f3fc",   // Editorial electric cyan
  lime: "#bbf7d0",   // Mint / fresh lime
  rose: "#fecdd3",   // High-contrast marker coral
  amber: "#fed7aa",  // Warm architectural amber
  violet: "#e9d5ff", // Soft editorial lavender
};

/**
 * 🖊️ KineticHighlighter
 * Broadcast-grade editorial text highlighter.
 * Fluidly draws dynamic fluorescent marker ink across text on exact spoken syllables
 * with natural edge geometry, ink bleed dynamics, and organic tilt.
 */
export const KineticHighlighter: React.FC<KineticHighlighterProps> = ({
  children,
  startFrame,
  durationFrames = 7,
  color = "yellow",
  opacity = 0.88,
  tiltAngle = -0.6,
  heightPercentage = "58%",
  className = "",
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relFrame = Math.max(0, frame - startFrame);
  const isStarted = frame >= startFrame;

  // Snappy spring-accelerated draw progress (0 to 1)
  const drawProgress = isStarted
    ? interpolate(
        relFrame,
        [0, durationFrames],
        [0, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      )
    : 0;

  // Spring overshoot for natural physical marker inertia
  const spOvershoot = isStarted
    ? spring({
        frame: relFrame,
        fps,
        config: { damping: 13, stiffness: 140, mass: 0.7 },
      })
    : 0;

  const hexColor = HIGHLIGHT_PALETTE[color as HighlighterColor] || color;

  return (
    <span
      className={`relative inline-block ${className}`}
      style={{
        ...style,
      }}
    >
      {/* Background SVG / Canvas Fluid Marker Stroke */}
      <span
        className="absolute left-0 bottom-1 pointer-events-none rounded-md z-0"
        style={{
          height: heightPercentage,
          backgroundColor: hexColor,
          opacity: isStarted ? opacity : 0,
          width: "100%",
          transformOrigin: "left center",
          transform: `scaleX(${drawProgress}) rotate(${tiltAngle}deg) scaleY(${isStarted ? interpolate(spOvershoot, [0, 1], [0.85, 1]) : 0.85})`,
          mixBlendMode: "multiply",
          filter: "blur(0.25px)",
          willChange: "transform, opacity",
        }}
      />

      {/* Primary Foreground Text (elevated above the ink layer) */}
      <span className="relative z-10">{children}</span>
    </span>
  );
};
