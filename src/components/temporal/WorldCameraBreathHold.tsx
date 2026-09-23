import React from "react";
import { useCurrentFrame } from "remotion";

export interface WorldCameraBreathHoldProps {
  children: React.ReactNode;
  startFrame: number;
  durationFrames?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * ⏱️ WorldCameraBreathHold — Frontier #6 Dramatic Breath Hold Primitive
 * Halts visual drift and provides an intentional stillness window before cognitive payoff.
 */
export const WorldCameraBreathHold: React.FC<WorldCameraBreathHoldProps> = ({
  children,
  startFrame,
  durationFrames = 22,
  className = "",
  style = {},
}) => {
  const frame = useCurrentFrame();
  const isHolding = frame >= startFrame && frame < startFrame + durationFrames;
  const holdScale = isHolding ? 0.985 : 1.0;

  return (
    <div
      className={`relative w-full h-full transition-transform ${className}`}
      style={{
        transform: `scale(${holdScale})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
