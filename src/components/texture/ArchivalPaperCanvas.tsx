import React from "react";

export interface ArchivalPaperCanvasProps {
  className?: string;
  paperToothOpacity?: number;
  warmth?: "warm_editorial" | "apple_studio" | "neutral_obsidian";
  showBorderDeboss?: boolean;
}

/**
 * 📜 ArchivalPaperCanvas
 * 300gsm Archival Cotton Paper Tooth substrate.
 * Replaces sterile plastic digital vector backgrounds with organic, tactile editorial paper:
 * - Natural 300gsm cotton rag tooth via deterministic SVG fractal micro-noise
 * - Warm editorial off-white base tint (#faf8f5 / #fcfbf9)
 * - Eliminates sterile SaaS advertisement gloss
 */
export const ArchivalPaperCanvas: React.FC<ArchivalPaperCanvasProps> = ({
  className = "",
  paperToothOpacity = 0.38,
  warmth = "warm_editorial",
  showBorderDeboss = false,
}) => {
  // Palette calibration
  const baseBackground =
    warmth === "warm_editorial"
      ? "radial-gradient(ellipse at 50% 0%, #ffffff 0%, #faf8f5 55%, #f4f0e8 100%)"
      : warmth === "neutral_obsidian"
      ? "radial-gradient(ellipse at 50% 0%, #0d1117 0%, #080b10 60%, #030712 100%)"
      : "radial-gradient(ellipse at 50% 0%, #ffffff 0%, #f8fafc 55%, #f1f5f9 100%)";

  return (
    <div
      className={`absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden ${className}`}
      style={{
        background: baseBackground,
      }}
    >
      {/* 1. Procedural 300gsm Archival Cotton Paper Tooth (Deterministic SVG) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          opacity: paperToothOpacity,
          mixBlendMode: warmth === "neutral_obsidian" ? "screen" : "multiply",
        }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="archival-paper-tooth" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.68"
            numOctaves="4"
            result="noise"
            stitchTiles="stitch"
          />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.94  0 0 0 0 0.92  0 0 0 0 0.88  0 0 0 0.40 0"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#archival-paper-tooth)" />
      </svg>

      {/* 2. Delicate Micro-Fiber Texture Overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.12,
          backgroundImage:
            "radial-gradient(rgba(148, 120, 90, 0.3) 1px, transparent 1px), radial-gradient(rgba(90, 110, 130, 0.2) 1px, transparent 1px)",
          backgroundSize: "28px 28px, 44px 44px",
          backgroundPosition: "0 0, 14px 22px",
          mixBlendMode: "multiply",
        }}
      />

      {/* 3. Subtle Studio Contact Light Gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            warmth === "neutral_obsidian"
              ? "radial-gradient(ellipse at 50% 10%, rgba(255, 255, 255, 0.03) 0%, transparent 70%)"
              : "radial-gradient(ellipse at 50% 0%, rgba(255, 253, 248, 0.8) 0%, transparent 65%)",
        }}
      />

      {/* 4. Optional Outer Debossed Border Edge */}
      {showBorderDeboss && (
        <div
          className="absolute inset-3 rounded-2xl pointer-events-none"
          style={{
            border: "1px solid rgba(0, 0, 0, 0.04)",
            boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.03), inset 0 -1px 2px rgba(255, 255, 255, 0.6)",
          }}
        />
      )}
    </div>
  );
};
