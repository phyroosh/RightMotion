import React from "react";

export interface ArchivalPaperCanvasProps {
  className?: string;
  paperToothOpacity?: number;
  warmth?: "warm_editorial" | "apple_studio" | "neutral_obsidian";
  showBorderDeboss?: boolean;
}

/**
 * 📜 ArchivalPaperCanvas
 * Ultra-fine linen/canvas micro-grain substrate.
 * Matches reference: dense, isotropic, cool-neutral fine-grain texture —
 * like a freshly primed artist's linen canvas or premium 300gsm mould-made paper.
 * - Dual-layer stochastic SVG noise (fine primary 0.72 + ultra-fine secondary 0.85)
 * - Cool-neutral flat base (#f0f1f2) — no warm cream, no gradient, pure physical surface
 * - Full-surface uniform grain coverage, zero directional weave, zero dot grid
 */
export const ArchivalPaperCanvas: React.FC<ArchivalPaperCanvasProps> = ({
  className = "",
  paperToothOpacity = 0.52,
  warmth = "warm_editorial",
  showBorderDeboss = false,
}) => {
  const baseBackground =
    warmth === "warm_editorial"
      ? "#f0f1f2"
      : warmth === "neutral_obsidian"
      ? "radial-gradient(ellipse at 50% 0%, #0d1117 0%, #080b10 60%, #030712 100%)"
      : "#f2f3f4";

  return (
    <div
      className={`absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden ${className}`}
      style={{ background: baseBackground }}
    >
      {/* 1. PRIMARY — Fine-grain uniform canvas noise (matches reference density) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          opacity: paperToothOpacity,
          mixBlendMode: warmth === "neutral_obsidian" ? "screen" : "multiply",
        }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter
            id="paper-grain-primary"
            x="0%" y="0%" width="100%" height="100%"
            colorInterpolationFilters="sRGB"
          >
            {/* High baseFrequency = ultra-fine grain density matching reference */}
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.72 0.74"
              numOctaves="6"
              seed="42"
              stitchTiles="stitch"
              result="noise"
            />
            {/* Cool stone-grey grain — neutral, no warm brown, no blue tint */}
            <feColorMatrix
              in="noise"
              type="matrix"
              values="0 0 0 0 0.56
                      0 0 0 0 0.57
                      0 0 0 0 0.59
                      0 0 0 0.55 0"
            />
          </filter>
        </defs>
        <rect width="100%" height="100%" filter="url(#paper-grain-primary)" />
      </svg>

      {/* 2. SECONDARY — Ultra-fine micro-noise overlay for linen depth */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          opacity: paperToothOpacity * 0.45,
          mixBlendMode: warmth === "neutral_obsidian" ? "screen" : "overlay",
        }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter
            id="paper-grain-secondary"
            x="0%" y="0%" width="100%" height="100%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.85 0.88"
              numOctaves="4"
              seed="17"
              stitchTiles="stitch"
              result="noise2"
            />
            <feColorMatrix
              in="noise2"
              type="matrix"
              values="0 0 0 0 0.62
                      0 0 0 0 0.63
                      0 0 0 0 0.64
                      0 0 0 0.30 0"
            />
          </filter>
        </defs>
        <rect width="100%" height="100%" filter="url(#paper-grain-secondary)" />
      </svg>

      {/* 3. Optional Outer Debossed Border Edge */}
      {showBorderDeboss && (
        <div
          className="absolute inset-3 rounded-2xl pointer-events-none"
          style={{
            border: "1px solid rgba(0, 0, 0, 0.04)",
            boxShadow:
              "inset 0 1px 2px rgba(0, 0, 0, 0.03), inset 0 -1px 2px rgba(255, 255, 255, 0.6)",
          }}
        />
      )}
    </div>
  );
};
