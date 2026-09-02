import React from "react";

export interface DocumentaryTextureProps {
  opacity?: number;
  enableVignette?: boolean;
}

/**
 * 📜 DocumentaryTexture
 * Ultra-lightweight SVG noise and documentary grain filter that unifies digital graphics
 * into an authentic high-end documentary film look.
 */
export const DocumentaryTexture: React.FC<DocumentaryTextureProps> = ({
  opacity = 0.035,
  enableVignette = true,
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
      {/* SVG Procedural Fractal Grain */}
      <svg className="absolute inset-0 w-full h-full" style={{ opacity }}>
        <filter id="documentary-noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#documentary-noise)" />
      </svg>

      {/* Subtle Studio Corner Vignette */}
      {enableVignette && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(circle at 50% 50%, transparent 65%, rgba(15, 23, 42, 0.04) 100%)",
          }}
        />
      )}
    </div>
  );
};
