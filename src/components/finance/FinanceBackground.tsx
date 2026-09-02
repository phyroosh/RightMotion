import React from "react";
import { useCurrentFrame } from "remotion";
import { DocumentaryTexture } from "../collage/DocumentaryTexture";

export interface FinanceBackgroundProps {
  orbColor1?: string;
  orbColor2?: string;
  gridOpacity?: number;
}

/**
 * 💹 FinanceBackground
 * Ultra-rich dark obsidian carbon background with cyber-gold and liquid emerald ambient lighting,
 * technical grid, and subtle documentary texture.
 */
export const FinanceBackground: React.FC<FinanceBackgroundProps> = ({
  orbColor1 = "rgba(16, 185, 129, 0.14)", // Liquid Emerald
  orbColor2 = "rgba(245, 158, 11, 0.12)", // Cyber Gold
  gridOpacity = 0.05,
}) => {
  const frame = useCurrentFrame();

  // Floating ambient lighting coordinates
  const orb1X = 25 + Math.sin(frame * 0.02) * 8;
  const orb1Y = 30 + Math.cos(frame * 0.025) * 8;

  const orb2X = 75 + Math.cos(frame * 0.018) * 8;
  const orb2Y = 65 + Math.sin(frame * 0.022) * 8;

  return (
    <div className="absolute inset-0 w-full h-full bg-[#030712] overflow-hidden pointer-events-none select-none">
      {/* 1. Deep Carbon Gradient */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          background: "radial-gradient(ellipse at 50% 30%, #0b0f19 0%, #030712 100%)",
        }}
      />

      {/* 2. Floating Liquid Emerald Ambient Orb */}
      <div
        className="absolute rounded-full blur-[140px] pointer-events-none transition-transform"
        style={{
          width: "900px",
          height: "900px",
          left: `${orb1X}%`,
          top: `${orb1Y}%`,
          transform: "translate(-50%, -50%)",
          backgroundColor: orbColor1,
        }}
      />

      {/* 3. Floating Cyber Gold Ambient Orb */}
      <div
        className="absolute rounded-full blur-[150px] pointer-events-none transition-transform"
        style={{
          width: "950px",
          height: "950px",
          left: `${orb2X}%`,
          top: `${orb2Y}%`,
          transform: "translate(-50%, -50%)",
          backgroundColor: orbColor2,
        }}
      />

      {/* 4. Financial Technical Grid */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          opacity: gridOpacity,
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.25) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.25) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* 5. Documentary Grain Finish */}
      <DocumentaryTexture opacity={0.03} enableVignette={true} />
    </div>
  );
};
