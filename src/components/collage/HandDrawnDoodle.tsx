import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export type DoodlePreset = "circle" | "arrow" | "underline" | "scribble_cross";
export type DoodleColor = "rose" | "sky" | "amber" | "emerald" | "slate" | "white";

export interface HandDrawnDoodleProps {
  preset: DoodlePreset;
  startMs?: number;
  durationMs?: number;
  color?: DoodleColor;
  strokeWidth?: number;
  width?: number | string;
  height?: number | string;
  rotation?: number;
  className?: string;
  style?: React.CSSProperties;
}

const COLOR_MAP: Record<DoodleColor, string> = {
  rose: "#e11d48",
  sky: "#0071e3",
  amber: "#f59e0b",
  emerald: "#059669",
  slate: "#0f172a",
  white: "#ffffff",
};

/**
 * ✏️ HandDrawnDoodle
 * Animated SVG hand-drawn documentary annotations that dynamically draw themselves
 * in sync with speech.
 */
export const HandDrawnDoodle: React.FC<HandDrawnDoodleProps> = ({
  preset,
  startMs = 0,
  durationMs = 400,
  color = "rose",
  strokeWidth = 6,
  width = "100%",
  height = "100%",
  rotation = 0,
  className = "",
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const startFrame = Math.floor((startMs / 1000) * fps);
  const durationFrames = Math.max(1, Math.floor((durationMs / 1000) * fps));
  const relFrame = Math.max(0, frame - startFrame);

  // Smooth drawing progress (0 to 1)
  const drawProgress = interpolate(
    relFrame,
    [0, durationFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const strokeColor = COLOR_MAP[color];

  // Render SVG paths based on preset
  if (preset === "circle") {
    // Imperfect double-loop hand-drawn oval
    const pathLen = 620;
    const dashOffset = pathLen * (1 - drawProgress);

    return (
      <div
        className={`pointer-events-none select-none ${className}`}
        style={{
          width,
          height,
          transform: `rotate(${rotation}deg)`,
          ...style,
        }}
      >
        <svg viewBox="0 0 320 100" fill="none" preserveAspectRatio="none" className="w-full h-full overflow-visible">
          <path
            d="M 28 16 C 65 4, 255 4, 292 16 C 316 28, 316 72, 292 84 C 255 96, 65 96, 28 84 C 4 72, 4 28, 28 16 C 65 6, 245 6, 285 20"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={pathLen}
            strokeDashoffset={dashOffset}
            style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.12))" }}
          />
        </svg>
      </div>
    );
  }

  if (preset === "arrow") {
    // Hand-drawn curving arrow pointing downward-right
    const pathLen = 320;
    const dashOffset = pathLen * (1 - drawProgress);

    return (
      <div
        className={`pointer-events-none select-none ${className}`}
        style={{
          width,
          height,
          transform: `rotate(${rotation}deg)`,
          ...style,
        }}
      >
        <svg viewBox="0 0 200 160" fill="none" className="w-full h-full overflow-visible">
          {/* Shaft curve */}
          <path
            d="M 25 35 C 70 20, 130 50, 155 110"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={pathLen}
            strokeDashoffset={dashOffset}
          />
          {/* Arrowhead (reveals in last 25% of animation) */}
          {drawProgress > 0.75 && (
            <path
              d="M 125 102 L 158 114 L 152 80"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                opacity: (drawProgress - 0.75) * 4,
              }}
            />
          )}
        </svg>
      </div>
    );
  }

  if (preset === "underline") {
    // Double energetic marker underline
    const pathLen = 380;
    const dashOffset = pathLen * (1 - drawProgress);

    return (
      <div
        className={`pointer-events-none select-none ${className}`}
        style={{
          width,
          height,
          transform: `rotate(${rotation}deg)`,
          ...style,
        }}
      >
        <svg viewBox="0 0 300 50" fill="none" className="w-full h-full overflow-visible">
          <path
            d="M 10 20 Q 80 12, 160 22 T 290 18 M 25 36 Q 110 30, 195 38 T 275 32"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={pathLen}
            strokeDashoffset={dashOffset}
          />
        </svg>
      </div>
    );
  }

  if (preset === "scribble_cross") {
    // Energetic hand-drawn X mark
    const pathLen = 220;
    const dashOffset = pathLen * (1 - drawProgress);

    return (
      <div
        className={`pointer-events-none select-none ${className}`}
        style={{
          width,
          height,
          transform: `rotate(${rotation}deg)`,
          ...style,
        }}
      >
        <svg viewBox="0 0 120 120" fill="none" className="w-full h-full overflow-visible">
          <path
            d="M 20 25 L 100 95 M 100 25 L 20 95"
            stroke={strokeColor}
            strokeWidth={strokeWidth + 2}
            strokeLinecap="round"
            strokeDasharray={pathLen}
            strokeDashoffset={dashOffset}
          />
        </svg>
      </div>
    );
  }

  return null;
};
