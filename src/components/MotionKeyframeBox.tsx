import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export interface MotionKeyframe {
  timeMs: number;
  opacity?: number;
  scale?: number;
  x?: number;
  y?: number;
  rotate?: number;
  blur?: number;
}

export interface MotionKeyframeBoxProps {
  currentMs: number;
  keyframes: MotionKeyframe[];
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  enableFloating?: boolean;
  floatingSpeed?: number;
  floatingAmount?: number;
  transformOrigin?: string;
}

/**
 * High-performance Keyframe Interpolation Helper
 * Evaluates smooth bezier curve value at exact currentMs across timeline.
 */
export function interpolateTrack(
  currentMs: number,
  points: { timeMs: number; value: number }[],
  easing = Easing.bezier(0.25, 0.1, 0.25, 1.0)
): number {
  if (!points || points.length === 0) return 0;
  if (points.length === 1) return points[0].value;

  const sorted = [...points].sort((a, b) => a.timeMs - b.timeMs);
  const times = sorted.map((p) => p.timeMs);
  const values = sorted.map((p) => p.value);

  return interpolate(currentMs, times, values, {
    easing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

/**
 * Standard Motion Preset: Slide In -> Subtle Push/Hold -> Slide Out
 */
export function createCardKeyframes(
  enterMs: number,
  exitMs: number,
  enterDuration = 500,
  exitDuration = 450,
  yOffset = 45
): MotionKeyframe[] {
  return [
    { timeMs: enterMs, opacity: 0, scale: 0.93, y: yOffset, rotate: 0 },
    { timeMs: enterMs + enterDuration, opacity: 1, scale: 1.0, y: 0, rotate: 0 },
    { timeMs: exitMs - exitDuration, opacity: 1, scale: 1.025, y: -4, rotate: 0 },
    { timeMs: exitMs, opacity: 0, scale: 0.94, y: yOffset * 0.8, rotate: 0 },
  ];
}

/**
 * Staggered Chip/Pill Keyframe Creator
 */
export function createChipKeyframes(
  enterMs: number,
  exitMs: number,
  enterDuration = 380,
  exitDuration = 350
): MotionKeyframe[] {
  return [
    { timeMs: enterMs, opacity: 0, scale: 0.88, y: 25, rotate: 0 },
    { timeMs: enterMs + enterDuration, opacity: 1, scale: 1.0, y: 0, rotate: 0 },
    { timeMs: exitMs - exitDuration, opacity: 1, scale: 1.015, y: 0, rotate: 0 },
    { timeMs: exitMs, opacity: 0, scale: 0.9, y: 20, rotate: 0 },
  ];
}

/**
 * MotionKeyframeBox:
 * The universal buttery-smooth 60fps-feel motion component for Remotion.
 * Completely replaces unreliable CSS transitions with deterministic mathematical bezier curves.
 */
export const MotionKeyframeBox: React.FC<MotionKeyframeBoxProps> = ({
  currentMs,
  keyframes,
  children,
  className = "",
  style = {},
  enableFloating = false,
  floatingSpeed = 2.2,
  floatingAmount = 3.5,
  transformOrigin = "center center",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (!keyframes || keyframes.length === 0) {
    return <div className={className} style={style}>{children}</div>;
  }

  // Sort keyframes chronologically
  const sorted = [...keyframes].sort((a, b) => a.timeMs - b.timeMs);

  const times = sorted.map((k) => k.timeMs);
  const opacities = sorted.map((k) => k.opacity ?? 1);
  const scales = sorted.map((k) => k.scale ?? 1);
  const xs = sorted.map((k) => k.x ?? 0);
  const ys = sorted.map((k) => k.y ?? 0);
  const rotates = sorted.map((k) => k.rotate ?? 0);
  const blurs = sorted.map((k) => k.blur ?? 0);

  const smoothEasing = Easing.bezier(0.25, 0.1, 0.25, 1.0);

  const targetOpacity = interpolate(currentMs, times, opacities, {
    easing: smoothEasing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const targetScale = interpolate(currentMs, times, scales, {
    easing: smoothEasing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const targetX = interpolate(currentMs, times, xs, {
    easing: smoothEasing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const targetY = interpolate(currentMs, times, ys, {
    easing: smoothEasing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const targetRotate = interpolate(currentMs, times, rotates, {
    easing: smoothEasing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const targetBlur = interpolate(currentMs, times, blurs, {
    easing: smoothEasing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Micro floating and breathing physics for high-end Apple keynote vitality
  const t = frame / fps;
  const floatY = enableFloating ? Math.sin(t * floatingSpeed) * floatingAmount : 0;
  const breathScale = enableFloating ? 1 + Math.sin(t * (floatingSpeed * 0.7)) * 0.003 : 1;

  // If completely transparent, don't render to keep DOM lightweight
  if (targetOpacity <= 0.001) {
    return null;
  }

  return (
    <div
      className={className}
      style={{
        ...style,
        opacity: targetOpacity,
        transform: `translate(${targetX}px, ${targetY + floatY}px) scale(${targetScale * breathScale}) rotate(${targetRotate}deg)`,
        filter: targetBlur > 0.1 ? `blur(${targetBlur}px)` : undefined,
        transformOrigin,
      }}
    >
      {children}
    </div>
  );
};
