import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";

export const ShrinkingCircleBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Subtle floating ambient motion for background orbs (non-distracting background depth)
  const orb1Y = interpolate(Math.sin((frame / fps) * 0.8), [-1, 1], [-25, 25]);
  const orb2Y = interpolate(Math.cos((frame / fps) * 0.7), [-1, 1], [20, -20]);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden bg-[#f8fafc]">
      {/* Studio Radial Foundation */}
      <div
        className="absolute inset-0 opacity-90"
        style={{
          background: "radial-gradient(circle at 50% 25%, #ffffff 0%, #f1f5f9 50%, #e2e8f0 100%)",
        }}
      />

      {/* Floating Cyan/Indigo Ambient Glow */}
      <div
        className="absolute w-[800px] h-[800px] rounded-full blur-[140px] opacity-30"
        style={{
          background: "radial-gradient(circle, #38bdf8 0%, #6366f1 100%)",
          top: "8%",
          left: "-12%",
          transform: `translateY(${orb1Y}px)`,
        }}
      />

      {/* Floating Emerald/Teal Ambient Glow */}
      <div
        className="absolute w-[700px] h-[700px] rounded-full blur-[130px] opacity-25"
        style={{
          background: "radial-gradient(circle, #10b981 0%, #06b6d4 100%)",
          bottom: "12%",
          right: "-10%",
          transform: `translateY(${orb2Y}px)`,
        }}
      />

      {/* Tactile Studio Dot Grid */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: "radial-gradient(rgba(15, 23, 42, 0.35) 1.5px, transparent 1.5px)",
          backgroundSize: "36px 36px",
        }}
      />
    </div>
  );
};
