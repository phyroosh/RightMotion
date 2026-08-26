import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

export const BreaksBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Gentle calming drift
  const time = frame / fps;
  const orb1X = Math.sin(time * 0.35) * 60;
  const orb1Y = Math.cos(time * 0.3) * 50;
  const orb2X = Math.cos(time * 0.28) * -60;
  const orb2Y = Math.sin(time * 0.4) * 70;
  const orb3Y = Math.sin(time * 0.45) * 40;

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
      {/* 1. Base Studio Canvas */}
      <div className="absolute inset-0 bg-[#f8fafc]" />

      {/* 2. Top-Center Soft Studio Keylight */}
      <div
        className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[1400px] h-[900px] rounded-full blur-[140px] pointer-events-none opacity-80"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(255,255,255,1) 0%, rgba(240,253,244,0.7) 50%, transparent 80%)",
        }}
      />

      {/* 3. Liquid Mesh Orb 1: Soft Emerald / Sage Serenity */}
      <div
        className="absolute top-[20%] -left-[15%] w-[780px] h-[780px] rounded-full blur-[130px] opacity-40 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(16,185,129,0.65) 0%, rgba(14,165,233,0.3) 60%, transparent 80%)",
          transform: `translate(${orb1X}px, ${orb1Y}px)`,
        }}
      />

      {/* 4. Liquid Mesh Orb 2: Lavender & Sky Blue */}
      <div
        className="absolute top-[50%] -right-[15%] w-[820px] h-[820px] rounded-full blur-[140px] opacity-35 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(168,85,247,0.55) 0%, rgba(56,189,248,0.3) 55%, transparent 80%)",
          transform: `translate(${orb2X}px, ${orb2Y}px)`,
        }}
      />

      {/* 5. Liquid Mesh Orb 3: Warm Sunlight Amber Glow */}
      <div
        className="absolute bottom-[-10%] left-[25%] w-[900px] h-[700px] rounded-full blur-[150px] opacity-30 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(245,158,11,0.5) 0%, rgba(16,185,129,0.25) 60%, transparent 80%)",
          transform: `translateY(${orb3Y}px)`,
        }}
      />

      {/* 6. Subtle Frosted Studio Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-slate-900/[0.03] pointer-events-none" />
    </div>
  );
};
