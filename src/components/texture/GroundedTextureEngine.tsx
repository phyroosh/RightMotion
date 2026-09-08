import React from "react";
import { useCurrentFrame } from "remotion";

export interface GroundedTextureEngineProps {
  className?: string;
  grainOpacity?: number; // Default 0.042 (4.2% - Subtle Editorial Standard)
  enableHalation?: boolean;
  enableVignette?: boolean;
  vignetteStrength?: number; // Default 0.075
}

/**
 * 🎞️ GroundedTextureEngine
 * Master Editorial Finishing Texture Suite.
 * Replaces the sterile "corporate SaaS commercial / digital ad" look with:
 * 1. 35mm Living Film Grain: Procedural temporal grain flutter (seeded by frame)
 * 2. Warm Optical Halation: Softens razor-sharp digital vector edges with organic warmth
 * 3. Prime Cinema Lens Vignette: Subtle edge density falloff focusing viewer gaze to center
 */
export const GroundedTextureEngine: React.FC<GroundedTextureEngineProps> = ({
  className = "",
  grainOpacity = 0.042,
  enableHalation = true,
  enableVignette = true,
  vignetteStrength = 0.075,
}) => {
  const frame = useCurrentFrame();

  // Living 35mm celluloid seed flutter: cycles subtly every frame to simulate real film gate jitter
  const grainSeed = (frame % 8) * 19 + 7;

  return (
    <div
      className={`absolute inset-0 w-full h-full pointer-events-none select-none z-50 overflow-hidden ${className}`}
      style={{ willChange: "transform" }}
    >
      {/* 1. 35mm Living Organic Film Grain (Frame-Synchronized SVG) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          opacity: grainOpacity,
          mixBlendMode: "overlay",
        }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="living-35mm-grain" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.82"
            numOctaves="3"
            seed={grainSeed}
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#living-35mm-grain)" />
      </svg>

      {/* 2. Warm Optical Halation (Softens harsh vector pixelation with warm editorial film bloom) */}
      {enableHalation && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 50% 40%, rgba(255, 248, 235, 0.05) 0%, rgba(255, 240, 220, 0.02) 60%, transparent 100%)",
            mixBlendMode: "screen",
          }}
        />
      )}

      {/* 3. Prime Cinema Lens Vignette (Grounds mobile focus, eliminates flat ad edges) */}
      {enableVignette && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 48%, transparent 66%, rgba(15, 23, 42, ${vignetteStrength}) 100%)`,
            mixBlendMode: "multiply",
          }}
        />
      )}
    </div>
  );
};
