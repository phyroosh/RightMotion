import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export const TeenageBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Subtle floating background orbs
  const orb1Y = Math.sin(frame * 0.02) * 20;
  const orb2X = Math.cos(frame * 0.025) * 25;
  const orb3Y = Math.sin(frame * 0.018 + 1) * 15;

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden bg-[#f8fafc]">
      {/* Studio radial vignette gradient */}
      <div
        className="absolute inset-0 opacity-90"
        style={{
          background: "radial-gradient(circle at 50% 25%, #ffffff 0%, #f1f5f9 50%, #e2e8f0 100%)",
        }}
      />

      {/* Ambient Orb 1: Soft Electric Indigo (Top Left) */}
      <div
        className="absolute w-[700px] h-[700px] rounded-full blur-[140px] opacity-30"
        style={{
          background: "radial-gradient(circle, #6366f1 0%, #a855f7 100%)",
          top: "-10%",
          left: "-15%",
          transform: `translateY(${orb1Y}px)`,
        }}
      />

      {/* Ambient Orb 2: Warm Rose & Amber (Middle Right) */}
      <div
        className="absolute w-[650px] h-[650px] rounded-full blur-[150px] opacity-25"
        style={{
          background: "radial-gradient(circle, #f43f5e 0%, #fb923c 100%)",
          top: "35%",
          right: "-15%",
          transform: `translateX(${orb2X}px)`,
        }}
      />

      {/* Ambient Orb 3: Apple Sky & Emerald (Bottom Center) */}
      <div
        className="absolute w-[800px] h-[800px] rounded-full blur-[160px] opacity-25"
        style={{
          background: "radial-gradient(circle, #0ea5e9 0%, #10b981 100%)",
          bottom: "-15%",
          left: "10%",
          transform: `translateY(${orb3Y}px)`,
        }}
      />

      {/* Apple Studio Micro-Dot Grid */}
      <div
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage: "radial-gradient(rgba(15, 23, 42, 0.4) 1.5px, transparent 1.5px)",
          backgroundSize: "36px 36px",
        }}
      />
    </div>
  );
};
