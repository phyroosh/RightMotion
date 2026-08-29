import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export const EnvironmentBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Subtle breathing animation for organic Apple Studio background
  const floatOrb1 = Math.sin(frame * 0.02) * 25;
  const floatOrb2 = Math.cos(frame * 0.025) * 30;
  const floatOrb3 = Math.sin(frame * 0.018 + 2) * 20;

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden bg-[#f8fafc]">
      {/* 1. Base Studio Mesh Radial Gradients */}
      <div
        className="absolute inset-0 opacity-90"
        style={{
          background:
            "radial-gradient(circle at 50% 18%, #f8fafc 0%, #f1f5f9 45%, #e2e8f0 100%)",
        }}
      />

      {/* 2. Top-Center Ambient Amber/Gold Energy Orb */}
      <div
        className="absolute -top-[120px] left-1/2 -translate-x-1/2 w-[900px] h-[750px] rounded-full blur-[140px] opacity-45 pointer-events-none"
        style={{
          background: "radial-gradient(circle, #f59e0b 0%, #fbbf24 40%, transparent 70%)",
          transform: `translateX(-50%) translateY(${floatOrb1}px)`,
        }}
      />

      {/* 3. Mid-Right Emerald Atmosphere Orb (Growth & Neural Alignment) */}
      <div
        className="absolute top-[38%] -right-[150px] w-[750px] h-[750px] rounded-full blur-[150px] opacity-35 pointer-events-none"
        style={{
          background: "radial-gradient(circle, #10b981 0%, #34d399 40%, transparent 70%)",
          transform: `translateY(${floatOrb2}px)`,
        }}
      />

      {/* 4. Mid-Left Indigo Atmosphere Orb (Cognitive Depth) */}
      <div
        className="absolute top-[52%] -left-[160px] w-[780px] h-[780px] rounded-full blur-[160px] opacity-35 pointer-events-none"
        style={{
          background: "radial-gradient(circle, #6366f1 0%, #818cf8 40%, transparent 70%)",
          transform: `translateY(${floatOrb3}px)`,
        }}
      />

      {/* 5. Apple Studio Subtle Tech Dot Grid */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(#0f172a 1.8px, transparent 1.8px)",
          backgroundSize: "36px 36px",
        }}
      />

      {/* 6. Soft Studio Vignette Frame */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: "inset 0 0 160px rgba(15, 23, 42, 0.06)",
        }}
      />
    </div>
  );
};
