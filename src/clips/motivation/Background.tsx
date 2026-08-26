import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export const MotivationBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const blob1Y = interpolate(
    Math.sin((frame / fps) * 0.8),
    [-1, 1],
    [-20, 30]
  );
  const blob1X = interpolate(
    Math.cos((frame / fps) * 0.6),
    [-1, 1],
    [-20, 20]
  );

  const blob2Y = interpolate(
    Math.cos((frame / fps) * 0.7),
    [-1, 1],
    [20, -30]
  );
  const blob2X = interpolate(
    Math.sin((frame / fps) * 0.5),
    [-1, 1],
    [25, -25]
  );

  const gradientShift = interpolate(
    frame,
    [0, durationInFrames],
    [0, 15]
  );

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0 bg-[#f8fafc]">
      {/* Studio Pure Light Gradient */}
      <div
        className="absolute inset-0 w-full h-full opacity-90"
        style={{
          background: `radial-gradient(120% 120% at 50% ${15 + gradientShift}%, #ffffff 0%, #f1f5f9 60%, #e2e8f0 100%)`,
        }}
      />

      {/* Dynamic Animated Liquid Mesh Orbs */}
      <div
        className="absolute -top-[10%] left-[10%] w-[550px] h-[550px] rounded-full blur-[110px] opacity-45 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(14,165,233,0.6) 0%, rgba(99,102,241,0.25) 70%, transparent 100%)",
          transform: `translate(${blob1X}px, ${blob1Y}px)`,
        }}
      />

      <div
        className="absolute top-[40%] -right-[15%] w-[600px] h-[600px] rounded-full blur-[130px] opacity-40 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(0,113,227,0.5) 0%, rgba(56,189,248,0.2) 70%, transparent 100%)",
          transform: `translate(${blob2X}px, ${blob2Y}px)`,
        }}
      />

      {/* Subtle Noise Texture Overlay */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
};
