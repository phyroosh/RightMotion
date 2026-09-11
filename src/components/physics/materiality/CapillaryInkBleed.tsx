import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export interface CapillaryInkBleedProps {
  /** Start frame when ink begins penetrating the surface */
  startFrame: number;
  /** Inscription duration in frames (default: 18) */
  durationFrames?: number;
  /** Text content or vector mark to inscribe */
  text: string;
  /** Typography styling */
  fontSize?: number;
  textColor?: string;
  glowColor?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * 🖋️ CapillaryInkBleed
 * Low-level materiality capability modeling fluid pigment penetrating porous matter.
 * Features directional capillary bleed, drying luster shift (wet sheen -> permanent deboss).
 */
export const CapillaryInkBleed: React.FC<CapillaryInkBleedProps> = ({
  startFrame,
  durationFrames = 18,
  text,
  fontSize = 54,
  textColor = "#ffffff",
  glowColor = "rgba(16, 185, 129, 0.4)",
  className = "",
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < startFrame) {
    return null;
  }

  const relFrame = frame - startFrame;
  const sp = spring({
    frame: relFrame,
    fps,
    config: { damping: 14, stiffness: 125, mass: 0.6 },
  });

  // 1. Inscription reveal progress (0% -> 100% clip reveal)
  const clipWidth = interpolate(sp, [0, 1], [0, 100]);

  // 2. Liquid wetness luster settling (intense wet luster settles to deep matte)
  const wetSheenOpacity = interpolate(relFrame, [0, 8, 25], [0, 0.8, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 3. Tactile deboss depth (carved into the matter)
  const debossDepth = interpolate(sp, [0, 1], [0, 2]);

  return (
    <div
      className={`relative inline-block select-none ${className}`}
      style={{
        ...style,
      }}
    >
      {/* Background Carved Deboss Channel */}
      <div
        className="font-sans font-black uppercase tracking-tight relative overflow-hidden"
        style={{
          fontSize: `${fontSize}px`,
          color: textColor,
          clipPath: `inset(0 ${100 - clipWidth}% 0 0)`,
          textShadow: `0 ${debossDepth}px 2px rgba(0, 0, 0, 0.8), 0 -1px 1px rgba(255, 255, 255, 0.15)`,
          filter: `drop-shadow(0 2px 6px ${glowColor})`,
        }}
      >
        {text}

        {/* Wet Glistening Specular Sheen during initial fluid stroke */}
        {wetSheenOpacity > 0 && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              opacity: wetSheenOpacity,
              background: `linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.7) ${clipWidth}%, transparent ${clipWidth + 8}%)`,
              mixBlendMode: "overlay",
            }}
          />
        )}
      </div>
    </div>
  );
};
