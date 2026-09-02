import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { evaluateCurve, MotionCurves } from "./MotionGraph";

export interface KineticCascadeItemProps {
  delayMs: number;
  durationMs?: number;
  curve?: (t: number) => number;
  direction?: "up" | "down" | "left" | "right" | "zoom" | "pop";
  distance?: number;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

/**
 * 🎬 KineticCascadeItem
 * Applies staggered motion graph speed curves to individual UI elements.
 */
export const KineticCascadeItem: React.FC<KineticCascadeItemProps> = ({
  delayMs,
  durationMs = 420,
  curve = MotionCurves.snapSettle,
  direction = "up",
  distance = 35,
  className = "",
  style = {},
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const startFrame = Math.floor((delayMs / 1000) * fps);
  const durationFrames = Math.max(1, Math.floor((durationMs / 1000) * fps));

  const progress = evaluateCurve(frame, startFrame, durationFrames, curve);

  let translateX = 0;
  let translateY = 0;
  let scale = 1.0;

  switch (direction) {
    case "up":
      translateY = (1 - progress) * distance;
      break;
    case "down":
      translateY = (1 - progress) * -distance;
      break;
    case "left":
      translateX = (1 - progress) * distance;
      break;
    case "right":
      translateX = (1 - progress) * -distance;
      break;
    case "zoom":
      scale = 0.88 + progress * 0.12;
      break;
    case "pop":
      scale = progress < 1 ? 0.75 + progress * 0.3 : 1.0;
      break;
  }

  const opacity = Math.min(1, progress * 1.6);
  const blur = progress < 0.95 ? (1 - progress) * 4 : 0;

  return (
    <div
      className={className}
      style={{
        ...style,
        transform: `translate3d(${translateX}px, ${translateY}px, 0px) scale(${scale})`,
        opacity,
        filter: blur > 0.4 ? `blur(${blur.toFixed(1)}px)` : undefined,
        willChange: "transform, opacity",
      }}
    >
      {children}
    </div>
  );
};
