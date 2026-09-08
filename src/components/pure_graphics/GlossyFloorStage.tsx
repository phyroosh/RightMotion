import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

export interface GlossyFloorStageProps {
  children: React.ReactNode;
  /** Ambient backlight color, e.g. "rgba(16, 185, 129, 0.18)" or "rgba(244, 63, 94, 0.15)" */
  glowColor?: string;
  /** Glow intensity multiplier (default: 1.0) */
  glowIntensity?: number;
  /** Glow center Y percentage (default: 42) */
  glowCenterY?: number;
  /** Whether to render external floor reflection on children (default: false since components have their own precise reflections) */
  showReflection?: boolean;
  /** Reflection opacity (default: 0.38) */
  reflectionOpacity?: number;
  /** Reflection blur in px (default: 2.5) */
  reflectionBlur?: number;
  /** Reflection height percentage fade (default: 65) */
  reflectionFadePercent?: number;
  /** Gap between element and reflection in px (default: 4) */
  reflectionGap?: number;
  className?: string;
}

/**
 * 🎬 GlossyFloorStage
 * Renders an ultra-clean, high-end dark void with atmospheric radial back-glow
 * and provides the dark glossy stage environment.
 */
export const GlossyFloorStage: React.FC<GlossyFloorStageProps> = ({
  children,
  glowColor = "rgba(16, 185, 129, 0.18)",
  glowIntensity = 1.0,
  glowCenterY = 42,
  showReflection = false,
  reflectionOpacity = 0.38,
  reflectionBlur = 2.5,
  reflectionFadePercent = 65,
  reflectionGap = 4,
  className = "",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Subtle breathing pulse in the ambient back-glow
  const pulse = Math.sin((frame / fps) * 1.5) * 0.08 + 1.0;
  const effectiveGlow = glowIntensity * pulse;

  return (
    <div
      className={`relative w-full h-full flex flex-col items-center justify-center select-none overflow-hidden ${className}`}
      style={{
        backgroundColor: "#000000",
      }}
    >
      {/* 1. Atmospheric Radial Ambient Back-Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 750px 550px at 50% ${glowCenterY}%, ${glowColor}, transparent 70%)`,
          opacity: effectiveGlow,
        }}
      />

      {/* 2. Very subtle floor horizon divider line */}
      <div
        className="absolute w-full pointer-events-none"
        style={{
          top: "65%",
          height: "1px",
          background:
            "linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.06) 50%, transparent 95%)",
        }}
      />

      {/* 3. Main Stage Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Main Element */}
        <div className="relative z-20 flex flex-col items-center">{children}</div>

        {/* Optional External Glossy Wet-Floor Downward Mirror Reflection */}
        {showReflection && (
          <div
            className="pointer-events-none select-none origin-top flex flex-col items-center"
            style={{
              marginTop: `${reflectionGap}px`,
              transform: "scaleY(-1)",
              opacity: reflectionOpacity,
              filter: `blur(${reflectionBlur}px)`,
              maskImage: `linear-gradient(to bottom, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 30%, rgba(0,0,0,0) ${reflectionFadePercent}%)`,
              WebkitMaskImage: `linear-gradient(to bottom, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 30%, rgba(0,0,0,0) ${reflectionFadePercent}%)`,
            }}
          >
            {children}
          </div>
        )}
      </div>
    </div>
  );
};
