import React from "react";
import { ArchivalPaperCanvas } from "./texture/ArchivalPaperCanvas";
import { StudioDepthProps } from "./texture/StudioDepthProps";

export interface LivingStudioBackgroundProps {
  className?: string;
  dotGridOpacity?: number;
  enableBreathing?: boolean;
  orbColor1?: string;
  orbColor2?: string;
  paperToothOpacity?: number;
  enableDepthProps?: boolean;
}

/**
 * 🎬 LivingStudioBackground
 * Grounded Editorial Canvas — reference-matched ultra-fine linen micro-grain.
 * - Ultra-fine dual-layer stochastic SVG grain (ArchivalPaperCanvas)
 * - Cool-neutral flat base (#f0f1f2) — no warm cream, no colour orbs
 * - Single minimal central highlight for subtle depth (no colour contamination)
 * - Orb/dot-grid props retained for API compatibility but not rendered
 */
export const LivingStudioBackground: React.FC<LivingStudioBackgroundProps> = ({
  className = "",
  dotGridOpacity = 0,     // retained for compat, no longer rendered
  enableBreathing = false, // retained for compat, no animation on background
  orbColor1,               // retained for compat
  orbColor2,               // retained for compat
  paperToothOpacity = 0.52,
  enableDepthProps = true,
}) => {
  return (
    <div
      className={`absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none ${className}`}
    >
      {/* 1. Ultra-Fine Linen Micro-Grain Substrate (reference-matched) */}
      <ArchivalPaperCanvas
        paperToothOpacity={paperToothOpacity}
        warmth="warm_editorial"
      />

      {/* 2. Single minimal central highlight — adds depth without colour tint */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 35%, rgba(255,255,255,0.18) 0%, transparent 68%)",
          pointerEvents: "none",
        }}
      />

      {/* 3. Out-of-focus peripheral studio depth props (cinema bokeh stars) */}
      {enableDepthProps && <StudioDepthProps opacity={0.52} />}
    </div>
  );
};
