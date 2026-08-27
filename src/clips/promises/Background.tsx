import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export const PromisesBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Gentle ambient floating oscillation
  const moveA = Math.sin((frame / fps) * 0.4) * 25;
  const moveB = Math.cos((frame / fps) * 0.3) * 20;

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden bg-[#f8fafc]">
      {/* 1. Subtle warm gradient mesh background */}
      <div
        className="absolute inset-0 opacity-90"
        style={{
          background:
            "radial-gradient(circle at 50% 20%, #f1f5f9 0%, #e2e8f0 45%, #cbd5e1 100%)",
        }}
      />

      {/* 2. Amber Accent Light Orb (Self-Trust Theme) */}
      <div
        className="absolute w-[650px] h-[650px] rounded-full blur-[140px] opacity-25"
        style={{
          background: "radial-gradient(circle, #f59e0b 0%, #d97706 100%)",
          top: `${15 + moveA * 0.1}%`,
          left: `${-10 + moveB * 0.1}%`,
        }}
      />

      {/* 3. Indigo/Sky Ambient Light Orb */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full blur-[130px] opacity-20"
        style={{
          background: "radial-gradient(circle, #6366f1 0%, #3b82f6 100%)",
          bottom: `${10 - moveA * 0.1}%`,
          right: `${-10 - moveB * 0.1}%`,
        }}
      />

      {/* 4. Apple Precision Dot Grid Overlay */}
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage:
            "radial-gradient(rgba(15, 23, 42, 0.3) 1.5px, transparent 1.5px)",
          backgroundSize: "36px 36px",
        }}
      />
    </div>
  );
};
