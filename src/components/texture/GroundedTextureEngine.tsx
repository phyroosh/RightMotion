import React from "react";
import { useCurrentFrame } from "remotion";

export interface GroundedTextureEngineProps {
  className?: string;
  theme?: "light" | "dark";
  grainOpacity?: number; // Defaults: 0 for light (sharp clean studio), 0.035 for dark
  enableHalation?: boolean;
  enableVignette?: boolean;
  vignetteStrength?: number; // Default 0.05
}

/**
 * 🎞️ GroundedTextureEngine
 * Master Editorial Finishing Texture Suite.
 * Provides subtle optical depth without degrading digital sharpness.
 * On light themes, grain is disabled by default to maintain razor-sharp editorial contrast.
 */
export const GroundedTextureEngine: React.FC<GroundedTextureEngineProps> = ({
  className = "",
  theme = "light",
  grainOpacity,
  enableHalation = true,
  enableVignette = true,
  vignetteStrength = 0.05,
}) => {
  const frame = useCurrentFrame();

  const isLight = theme === "light";
  // Zero grain on light canvas to ensure pristine, razor-sharp editorial clarity
  const effectiveGrain = grainOpacity !== undefined ? grainOpacity : (isLight ? 0 : 0.035);

  // Living 35mm celluloid seed flutter: cycles subtly every frame to simulate real film gate jitter
  const grainSeed = (frame % 8) * 19 + 7;

  return (
    <div
      className={`absolute inset-0 w-full h-full pointer-events-none select-none z-50 overflow-hidden ${className}`}
      style={{ willChange: "transform" }}
    >
      {/* 1. 35mm Living Organic Film Grain (Only rendered if grain > 0) */}
      {effectiveGrain > 0 && (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{
            opacity: effectiveGrain,
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
      )}

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
