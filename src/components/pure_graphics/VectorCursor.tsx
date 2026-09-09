import React from "react";
import { interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

export interface VectorCursorProps {
  startX?: number;
  startY?: number;
  targetX: number;
  targetY: number;
  startFrame: number;
  flightDurationFrames?: number;
  clickFrame?: number;
  cursorType?: "arrow" | "glove";
  size?: number;
  className?: string;
}

/**
 * 🖱️ VectorCursor
 * Recreates the authentic Figma / After Effects vector cursor seen in top motion design references.
 * Features smooth non-linear flight paths, corner handle snapping, and click spring physics.
 */
export const VectorCursor: React.FC<VectorCursorProps> = ({
  startX,
  startY,
  targetX,
  targetY,
  startFrame,
  flightDurationFrames = 18,
  clickFrame,
  cursorType = "arrow",
  size = 46,
  className = "",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < startFrame) return null;

  // Default origin: enters from slightly bottom-right or offset
  const originX = startX ?? (targetX + 140);
  const originY = startY ?? (targetY + 160);

  // Flight progress with smooth spring curve
  const flightSpring = spring({
    frame: Math.max(0, frame - startFrame),
    fps,
    config: { damping: 14, mass: 0.8, stiffness: 120 },
  });

  const currentX = interpolate(flightSpring, [0, 1], [originX, targetX]);
  const currentY = interpolate(flightSpring, [0, 1], [originY, targetY]);

  // Click bounce spring
  const clickAt = clickFrame ?? (startFrame + flightDurationFrames + 4);
  const isClicking = frame >= clickAt && frame <= clickAt + 10;
  const clickSpring = frame >= clickAt
    ? spring({
        frame: Math.max(0, frame - clickAt),
        fps,
        config: { damping: 12, mass: 0.5, stiffness: 220 },
      })
    : 1;

  const clickScale = isClicking ? interpolate(clickSpring, [0, 0.4, 1], [1.0, 0.84, 1.0]) : 1.0;

  // Graceful exit: glide away and fade out after click completes
  const exitStart = clickAt + 16;
  if (frame > exitStart + 25) return null;

  const exitProgress = frame >= exitStart
    ? spring({
        frame: frame - exitStart,
        fps,
        config: { damping: 14, mass: 0.6, stiffness: 120 },
      })
    : 0;

  const exitOpacity = frame >= exitStart ? interpolate(exitProgress, [0, 1], [1, 0]) : 1;
  const exitY = frame >= exitStart ? interpolate(exitProgress, [0, 1], [0, 35]) : 0;

  return (
    <div
      className={`absolute pointer-events-none z-40 ${className}`}
      style={{
        left: `${currentX}px`,
        top: `${currentY + exitY}px`,
        transform: `scale(${clickScale})`,
        opacity: exitOpacity,
        transformOrigin: "top left",
        filter: "drop-shadow(0 12px 20px rgba(0, 0, 0, 0.45))",
      }}
    >
      {cursorType === "arrow" ? (
        // Precision SVG Figma / OS Arrow Cursor with clean white border and dark charcoal fill
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 2L10.5 21L13.8 13.8L21 10.5L3 2Z"
            fill="#0f172a"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        // Authentic tactile glove pointer
        <img
          src={staticFile("assets/cursor_pointer.png")}
          alt="Cursor"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            objectFit: "contain",
          }}
        />
      )}
    </div>
  );
};
