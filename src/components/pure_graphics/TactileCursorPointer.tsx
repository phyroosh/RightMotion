import React from "react";
import { interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

export interface TactileCursorPointerProps {
  x?: number;
  y?: number;
  size?: number; // default: 56
  clickFrame?: number;
  startFrame?: number;
  durationFrames?: number;
  className?: string;
}

/**
 * 👆 TactileCursorPointer
 * Authentic cartoon glove pointer cursor matching high-retention motion design references.
 * Features natural click spring physics and drop shadow.
 */
export const TactileCursorPointer: React.FC<TactileCursorPointerProps> = ({
  x,
  y,
  size = 56,
  clickFrame,
  startFrame = 0,
  durationFrames = 60,
  className = "",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isVisible =
    frame >= startFrame && frame <= startFrame + durationFrames;

  if (!isVisible) return null;

  const isClicking =
    clickFrame !== undefined && frame >= clickFrame && frame <= clickFrame + 8;

  const clickSpring = clickFrame !== undefined
    ? spring({
        frame: Math.max(0, frame - clickFrame),
        fps,
        config: { damping: 10, mass: 0.5, stiffness: 200 },
      })
    : 1;

  const scale = isClicking ? 0.86 : 1.0;

  return (
    <div
      className={`absolute pointer-events-none z-40 transition-transform ${className}`}
      style={{
        left: x !== undefined ? `${x}px` : undefined,
        top: y !== undefined ? `${y}px` : undefined,
        transform: `scale(${scale})`,
      }}
    >
      <img
        src={staticFile("assets/cursor_pointer.png")}
        alt="Hand Cursor"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          filter: "drop-shadow(0 10px 18px rgba(0, 0, 0, 0.75))",
          objectFit: "contain",
        }}
      />
    </div>
  );
};
