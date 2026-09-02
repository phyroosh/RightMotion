import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export interface IsometricCardProps {
  children: React.ReactNode;
  tiltX?: number; // default 8deg
  tiltY?: number; // default -6deg
  tiltZ?: number; // default 1.5deg
  elevation?: number; // default 30px
  enableGlare?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * 🧊 IsometricCard
 * Renders content on an elegant 3D isometric plane with dynamic specular light glare
 * and realistic layered contact shadows.
 */
export const IsometricCard: React.FC<IsometricCardProps> = ({
  children,
  tiltX = 8,
  tiltY = -6,
  tiltZ = 1.5,
  elevation = 30,
  enableGlare = true,
  className = "",
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Dynamic light glare position (sweeps gently across the card)
  const glarePos = interpolate(
    Math.sin(frame * 0.05),
    [-1, 1],
    [-40, 140],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      className={`relative select-none transition-transform ${className}`}
      style={{
        transformStyle: "preserve-3d",
        transform: `
          rotateX(${tiltX}deg)
          rotateY(${tiltY}deg)
          rotateZ(${tiltZ}deg)
          translateZ(${elevation}px)
        `,
        filter: `
          drop-shadow(0 20px 30px rgba(15, 23, 42, 0.10))
          drop-shadow(0 45px 70px rgba(15, 23, 42, 0.08))
        `,
        ...style,
      }}
    >
      {/* Dynamic Specular Light Glare Overlay */}
      {enableGlare && (
        <div
          className="absolute inset-0 rounded-[ inherit ] pointer-events-none z-40 overflow-hidden"
          style={{
            borderRadius: "inherit",
          }}
        >
          <div
            className="absolute -inset-full w-[300%] h-[300%] pointer-events-none opacity-30"
            style={{
              background: `linear-gradient(
                115deg,
                transparent 30%,
                rgba(255, 255, 255, 0.65) 45%,
                rgba(255, 255, 255, 0.9) 50%,
                rgba(255, 255, 255, 0.65) 55%,
                transparent 70%
              )`,
              transform: `translateX(${glarePos}%) translateY(-20%) rotate(15deg)`,
            }}
          />
        </div>
      )}

      {children}
    </div>
  );
};
