import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export type StrikePreset = "blade_slash" | "strikethrough" | "cross_reject";
export type StrikeColor = "rose" | "amber" | "emerald" | "sky" | "slate" | "white";

export interface AnimatedSlashStrikeProps {
  children?: React.ReactNode;
  startFrame: number;
  durationFrames?: number;
  preset?: StrikePreset;
  color?: StrikeColor | string;
  strokeWidth?: number;
  angle?: number; // Tilt angle in degrees (e.g. -14deg for a sharp dynamic slice)
  className?: string;
  style?: React.CSSProperties;
  enableImpactShake?: boolean;
}

const PRESET_COLORS: Record<StrikeColor, string> = {
  rose: "#e11d48",
  amber: "#f59e0b",
  emerald: "#059669",
  sky: "#0071e3",
  slate: "#0f172a",
  white: "#ffffff",
};

/**
 * ⚔️ AnimatedSlashStrike
 * Executes a dynamic, real-time cutting blade, laser slash, or marker strikethrough
 * across text or elements. Synchronized with speech to execute a live visual mutation.
 */
export const AnimatedSlashStrike: React.FC<AnimatedSlashStrikeProps> = ({
  children,
  startFrame,
  durationFrames = 7,
  preset = "blade_slash",
  color = "rose",
  strokeWidth = 6,
  angle = -12,
  className = "",
  style = {},
  enableImpactShake = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relFrame = Math.max(0, frame - startFrame);
  const isStarted = frame >= startFrame;

  // Snappy non-linear drawing progress (0 to 1)
  const drawProgress = interpolate(
    relFrame,
    [0, durationFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Micro impact shake when strike hits halfway
  const shakeProgress = spring({
    frame: Math.max(0, frame - (startFrame + Math.floor(durationFrames * 0.4))),
    fps,
    config: { damping: 10, mass: 0.3, stiffness: 220 },
  });

  const shakeOffset =
    enableImpactShake && isStarted && relFrame < durationFrames + 8
      ? Math.sin(shakeProgress * Math.PI * 3) * (1 - shakeProgress) * 4
      : 0;

  const resolvedColor =
    color in PRESET_COLORS
      ? PRESET_COLORS[color as StrikeColor]
      : color;

  if (preset === "blade_slash") {
    // Dynamic diagonal razor/laser cut with glowing tip
    const pathLength = 520;
    const dashOffset = pathLength * (1 - drawProgress);

    return (
      <span
        className={`relative inline-flex items-center justify-center ${className}`}
        style={{
          transform: `translateY(${shakeOffset}px)`,
          ...style,
        }}
      >
        {children}

        {isStarted && (
          <svg
            className="absolute inset-0 w-[112%] h-[120%] -left-[6%] -top-[10%] pointer-events-none overflow-visible z-20"
            viewBox="0 0 400 100"
            preserveAspectRatio="none"
          >
            {/* Soft luminous underglow */}
            <line
              x1="0"
              y1="75"
              x2="400"
              y2="25"
              stroke={resolvedColor}
              strokeWidth={strokeWidth * 2.6}
              strokeOpacity={0.35 * drawProgress}
              strokeLinecap="round"
              strokeDasharray={pathLength}
              strokeDashoffset={dashOffset}
              style={{ filter: "blur(6px)" }}
            />

            {/* Sharp core cutting blade */}
            <line
              x1="0"
              y1="75"
              x2="400"
              y2="25"
              stroke={resolvedColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={pathLength}
              strokeDashoffset={dashOffset}
              style={{
                filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.3))",
              }}
            />

            {/* Spark flash at the cutting tip */}
            {drawProgress > 0.05 && drawProgress < 0.98 && (
              <circle
                cx={drawProgress * 400}
                cy={75 - drawProgress * 50}
                r={strokeWidth * 1.5}
                fill="#ffffff"
                style={{
                  filter: `drop-shadow(0 0 8px ${resolvedColor})`,
                }}
              />
            )}
          </svg>
        )}
      </span>
    );
  }

  if (preset === "strikethrough") {
    // Horizontal ink/marker slice with natural slight tilt
    const pathLength = 460;
    const dashOffset = pathLength * (1 - drawProgress);

    return (
      <span
        className={`relative inline-flex items-center justify-center ${className}`}
        style={{
          transform: `translateY(${shakeOffset}px)`,
          ...style,
        }}
      >
        {children}

        {isStarted && (
          <svg
            className="absolute inset-x-0 top-1/2 w-[108%] h-8 -left-[4%] -translate-y-1/2 pointer-events-none overflow-visible z-20"
            viewBox="0 0 400 30"
            preserveAspectRatio="none"
            style={{ transform: `rotate(${angle}deg)` }}
          >
            <path
              d="M 5 16 Q 100 12, 200 16 T 395 14"
              stroke={resolvedColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={pathLength}
              strokeDashoffset={dashOffset}
              fill="none"
              style={{
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.25))",
              }}
            />
          </svg>
        )}
      </span>
    );
  }

  if (preset === "cross_reject") {
    // Double diagonal X reject cut
    const pLen = 280;
    const progress1 = Math.min(1, drawProgress * 1.7);
    const progress2 = Math.max(0, (drawProgress - 0.35) * 1.54);

    return (
      <span
        className={`relative inline-flex items-center justify-center ${className}`}
        style={{
          transform: `translateY(${shakeOffset}px)`,
          ...style,
        }}
      >
        {children}

        {isStarted && (
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-20"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {/* Stroke 1: Top-Left to Bottom-Right */}
            <line
              x1="5"
              y1="10"
              x2="95"
              y2="90"
              stroke={resolvedColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={pLen}
              strokeDashoffset={pLen * (1 - progress1)}
            />
            {/* Stroke 2: Top-Right to Bottom-Left */}
            {progress2 > 0 && (
              <line
                x1="95"
                y1="10"
                x2="5"
                y2="90"
                stroke={resolvedColor}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={pLen}
                strokeDashoffset={pLen * (1 - progress2)}
              />
            )}
          </svg>
        )}
      </span>
    );
  }

  return <>{children}</>;
};
