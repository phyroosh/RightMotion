import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export type ArrowPreset = "loop_down" | "loop_up" | "curved_down" | "swoop_right" | "direct_down";

export interface HandwrittenArrowProps {
  preset?: ArrowPreset;
  entranceFrame?: number;
  durationFrames?: number;
  color?: string;
  strokeWidth?: number;
  width?: number;
  height?: number;
  rotation?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * ✍️ HandwrittenArrow
 * Self-drawing SVG handwritten annotation arrows matching high-end editorial motion design.
 * Features realistic ink flow, bezier loops, and dynamic arrowhead reveal.
 */
export const HandwrittenArrow: React.FC<HandwrittenArrowProps> = ({
  preset = "loop_down",
  entranceFrame = 0,
  durationFrames = 22,
  color = "#374151",
  strokeWidth = 3,
  width = 140,
  height = 160,
  rotation = 0,
  className = "",
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < entranceFrame) {
    return null;
  }

  const relFrame = frame - entranceFrame;

  // Fluid smooth drawing curve
  const drawProgress = interpolate(
    relFrame,
    [0, durationFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Arrowhead pop spring once the stem is almost done
  const headSpring = spring({
    frame: Math.max(0, relFrame - durationFrames * 0.75),
    fps,
    config: { damping: 12, stiffness: 220 },
  });

  if (preset === "loop_down") {
    // Signature looping arrow as seen in reference frame 18 & 22
    const pathLen = 420;
    const dashOffset = pathLen * (1 - drawProgress);

    return (
      <div
        className={`pointer-events-none select-none relative ${className}`}
        style={{
          width,
          height,
          transform: `rotate(${rotation}deg)`,
          ...style,
        }}
      >
        <svg
          viewBox="0 0 160 200"
          fill="none"
          className="w-full h-full overflow-visible"
        >
          {/* Looping stem */}
          <path
            d="M 50 15 C 80 15, 100 55, 75 85 C 50 115, 20 85, 55 60 C 90 35, 125 110, 105 175"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={pathLen}
            strokeDashoffset={dashOffset}
          />
          {/* Arrowhead */}
          {drawProgress > 0.75 && (
            <path
              d="M 88 152 L 105 176 L 126 158"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                opacity: Math.min(1, headSpring * 1.5),
                transformOrigin: "105px 176px",
                transform: `scale(${interpolate(headSpring, [0, 1], [0.4, 1])})`,
              }}
            />
          )}
        </svg>
      </div>
    );
  }

  if (preset === "curved_down") {
    const pathLen = 260;
    const dashOffset = pathLen * (1 - drawProgress);

    return (
      <div
        className={`pointer-events-none select-none relative ${className}`}
        style={{
          width,
          height,
          transform: `rotate(${rotation}deg)`,
          ...style,
        }}
      >
        <svg
          viewBox="0 0 140 160"
          fill="none"
          className="w-full h-full overflow-visible"
        >
          <path
            d="M 25 20 C 65 25, 115 65, 100 140"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={pathLen}
            strokeDashoffset={dashOffset}
          />
          {drawProgress > 0.75 && (
            <path
              d="M 78 120 L 100 142 L 118 116"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                opacity: Math.min(1, headSpring * 1.5),
                transformOrigin: "100px 142px",
                transform: `scale(${interpolate(headSpring, [0, 1], [0.4, 1])})`,
              }}
            />
          )}
        </svg>
      </div>
    );
  }

  if (preset === "swoop_right") {
    const pathLen = 280;
    const dashOffset = pathLen * (1 - drawProgress);

    return (
      <div
        className={`pointer-events-none select-none relative ${className}`}
        style={{
          width,
          height,
          transform: `rotate(${rotation}deg)`,
          ...style,
        }}
      >
        <svg
          viewBox="0 0 180 120"
          fill="none"
          className="w-full h-full overflow-visible"
        >
          <path
            d="M 20 70 C 50 15, 110 20, 160 65"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={pathLen}
            strokeDashoffset={dashOffset}
          />
          {drawProgress > 0.75 && (
            <path
              d="M 135 50 L 162 67 L 140 85"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                opacity: Math.min(1, headSpring * 1.5),
                transformOrigin: "162px 67px",
                transform: `scale(${interpolate(headSpring, [0, 1], [0.4, 1])})`,
              }}
            />
          )}
        </svg>
      </div>
    );
  }

  // Fallback direct down
  const pathLen = 180;
  const dashOffset = pathLen * (1 - drawProgress);
  return (
    <div
      className={`pointer-events-none select-none relative ${className}`}
      style={{
        width,
        height,
        transform: `rotate(${rotation}deg)`,
        ...style,
      }}
    >
      <svg
        viewBox="0 0 100 160"
        fill="none"
        className="w-full h-full overflow-visible"
      >
        <path
          d="M 50 15 L 50 135"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={pathLen}
          strokeDashoffset={dashOffset}
        />
        {drawProgress > 0.75 && (
          <path
            d="M 32 115 L 50 137 L 68 115"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              opacity: Math.min(1, headSpring * 1.5),
              transformOrigin: "50px 137px",
              transform: `scale(${interpolate(headSpring, [0, 1], [0.4, 1])})`,
            }}
          />
        )}
      </svg>
    </div>
  );
};
