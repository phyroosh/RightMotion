import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { evaluateCurve, MotionCurves } from "./MotionGraph";

export type SceneInType = "snap_up" | "zoom_in" | "whip_right" | "whip_left" | "fade";
export type SceneOutType = "snap_up" | "zoom_out" | "whip_left" | "whip_right" | "fade";

export interface KineticSceneProps {
  startMs: number;
  endMs: number;
  inTransition?: SceneInType;
  outTransition?: SceneOutType;
  inDurationMs?: number;
  outDurationMs?: number;
  livingDrift?: boolean;
  currentMs?: number;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

/**
 * 🎬 KineticScene
 * Pro After Effects & CapCut-grade scene container.
 * Eliminates amateur hard cuts between scenes by handling:
 * 1. Explosive Speed-Graph In-Animation (snap, whip, or zoom)
 * 2. Organic Living Drift during hold (sub-pixel scale to stay alive)
 * 3. Smooth Cinematic Out-Animation before next scene enters
 */
export const KineticScene: React.FC<KineticSceneProps> = ({
  startMs,
  endMs,
  inTransition = "snap_up",
  outTransition = "zoom_out",
  inDurationMs = 400,
  outDurationMs = 280,
  livingDrift = true,
  className = "",
  style = {},
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentMs = (frame / fps) * 1000;

  // Window bounds with 1-frame grace
  if (currentMs < startMs || currentMs > endMs) {
    return null;
  }

  const startFrame = Math.floor((startMs / 1000) * fps);
  const endFrame = Math.floor((endMs / 1000) * fps);
  const inFrames = Math.max(1, Math.floor((inDurationMs / 1000) * fps));
  const outFrames = Math.max(1, Math.floor((outDurationMs / 1000) * fps));
  const outStartFrame = Math.max(startFrame + inFrames, endFrame - outFrames);

  // 1. In-Animation Progress (0 to 1) via Pro Snap-Settle Curve
  const inProgress = evaluateCurve(frame, startFrame, inFrames, MotionCurves.snapSettle);

  // 2. Out-Animation Progress (0 to 1) via Quick-Dismiss Curve
  const isExiting = frame >= outStartFrame;
  const outProgress = isExiting
    ? evaluateCurve(frame, outStartFrame, outFrames, MotionCurves.quickDismiss)
    : 0;

  // 3. Living Drift (Sub-pixel push during hold state)
  const driftProgress = interpolate(
    frame,
    [startFrame + inFrames, outStartFrame],
    [1.0, livingDrift ? 1.02 : 1.0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Calculate transforms
  let translateY = 0;
  let translateX = 0;
  let scale = 1.0;
  let opacity = 1.0;
  let blurPx = 0;

  // Compute In-Transform
  if (!isExiting) {
    opacity = Math.min(1, inProgress * 1.5);
    scale = (0.92 + inProgress * 0.08) * driftProgress;

    switch (inTransition) {
      case "snap_up":
        translateY = (1 - inProgress) * 45;
        blurPx = (1 - inProgress) * 6;
        break;
      case "zoom_in":
        scale = (0.84 + inProgress * 0.16) * driftProgress;
        blurPx = (1 - inProgress) * 8;
        break;
      case "whip_right":
        translateX = (1 - inProgress) * -80;
        blurPx = (1 - inProgress) * 10;
        break;
      case "whip_left":
        translateX = (1 - inProgress) * 80;
        blurPx = (1 - inProgress) * 10;
        break;
      case "fade":
        blurPx = (1 - inProgress) * 4;
        break;
    }
  } else {
    // Compute Out-Transform
    opacity = 1 - outProgress;
    scale = driftProgress * (1 - outProgress * 0.05);

    switch (outTransition) {
      case "zoom_out":
        scale = driftProgress * (1 - outProgress * 0.08);
        translateY = outProgress * -25;
        blurPx = outProgress * 8;
        break;
      case "snap_up":
        translateY = outProgress * -45;
        blurPx = outProgress * 6;
        break;
      case "whip_left":
        translateX = outProgress * -90;
        blurPx = outProgress * 12;
        break;
      case "whip_right":
        translateX = outProgress * 90;
        blurPx = outProgress * 12;
        break;
      case "fade":
        blurPx = outProgress * 6;
        break;
    }
  }

  return (
    <div
      className={`absolute inset-0 w-full h-full flex flex-col items-center justify-center pointer-events-none select-none ${className}`}
      style={{
        ...style,
        transform: `translate3d(${translateX}px, ${translateY}px, 0px) scale(${scale})`,
        opacity,
        filter: blurPx > 0.5 ? `blur(${blurPx.toFixed(1)}px)` : undefined,
        willChange: "transform, opacity, filter",
      }}
    >
      {children}
    </div>
  );
};
