import React from "react";
import { useCurrentFrame } from "remotion";
import { DocumentaryTexture } from "../collage/DocumentaryTexture";

export interface HealthBackgroundProps {
  orbColor1?: string;
  orbColor2?: string;
}

/**
 * 🫀 HealthBackground
 * Deep bio-tech obsidian navy background with glowing cyan and bio-mint cellular auras,
 * subtle rhythmic pulse, and clinical luxury finish.
 */
export const HealthBackground: React.FC<HealthBackgroundProps> = ({
  orbColor1 = "rgba(6, 182, 212, 0.16)",  // Electric Cyan
  orbColor2 = "rgba(16, 185, 129, 0.14)", // Bio Mint
}) => {
  const frame = useCurrentFrame();

  // Subtle biological breathing rhythm
  const bioPulse = 1.0 + Math.sin(frame * 0.04) * 0.04;

  const orb1X = 30 + Math.sin(frame * 0.015) * 6;
  const orb1Y = 35 + Math.cos(frame * 0.02) * 6;

  const orb2X = 70 + Math.cos(frame * 0.018) * 6;
  const orb2Y = 60 + Math.sin(frame * 0.022) * 6;

  return (
    <div className="absolute inset-0 w-full h-full bg-[#060913] overflow-hidden pointer-events-none select-none">
      {/* 1. Deep Bio-Navy Gradient */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          background: "radial-gradient(ellipse at 50% 40%, #0c142b 0%, #060913 100%)",
        }}
      />

      {/* 2. Floating Cyan Bio-Luminescence */}
      <div
        className="absolute rounded-full blur-[140px] pointer-events-none transition-transform"
        style={{
          width: "920px",
          height: "920px",
          left: `${orb1X}%`,
          top: `${orb1Y}%`,
          transform: `translate(-50%, -50%) scale(${bioPulse})`,
          backgroundColor: orbColor1,
        }}
      />

      {/* 3. Floating Bio-Mint Cellular Aura */}
      <div
        className="absolute rounded-full blur-[150px] pointer-events-none transition-transform"
        style={{
          width: "900px",
          height: "900px",
          left: `${orb2X}%`,
          top: `${orb2Y}%`,
          transform: `translate(-50%, -50%) scale(${bioPulse})`,
          backgroundColor: orbColor2,
        }}
      />

      {/* 4. Clinical Telemetry Dot Grid */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.05]"
        style={{
          backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.4) 1.5px, transparent 1.5px)",
          backgroundSize: "36px 36px",
        }}
      />

      {/* 5. Documentary Grain Finish */}
      <DocumentaryTexture opacity={0.03} enableVignette={true} />
    </div>
  );
};
