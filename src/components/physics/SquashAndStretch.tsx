import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { calcSquashStretchFactors } from "./PhysicsSprings";

export interface SquashAndStretchProps {
  startMs: number;
  durationMs?: number;
  maxSquash?: number;
  decayRate?: number;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

/**
 * 💥 SquashAndStretch
 * Applies non-linear volumetric elastic deformation when elements impact the canvas.
 * Preserves visual area: scaleX * scaleY ≈ 1.0.
 */
export const SquashAndStretch: React.FC<SquashAndStretchProps> = ({
  startMs,
  maxSquash = 0.18,
  decayRate = 6.0,
  className = "",
  style = {},
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const startFrame = Math.floor((startMs / 1000) * fps);
  const relFrame = frame - startFrame;

  const { scaleX, scaleY } = calcSquashStretchFactors(relFrame, fps, maxSquash, decayRate);

  return (
    <div
      className={`relative inline-block ${className}`}
      style={{
        transform: `scale(${scaleX}, ${scaleY})`,
        transformOrigin: "center bottom",
        willChange: "transform",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
