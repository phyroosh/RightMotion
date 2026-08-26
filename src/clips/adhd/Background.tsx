import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export const ADHDBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // Fluid breathing motion for liquid mesh blobs
  const blob1X = Math.sin(t * 0.45) * 45;
  const blob1Y = Math.cos(t * 0.35) * 40;
  const blob1Scale = 1 + Math.sin(t * 0.5) * 0.08;

  const blob2X = Math.cos(t * 0.38) * 50;
  const blob2Y = Math.sin(t * 0.42) * 45;
  const blob2Scale = 1 + Math.cos(t * 0.55) * 0.09;

  const blob3X = Math.sin(t * 0.32 + 1.5) * 40;
  const blob3Y = Math.cos(t * 0.48 + 1.0) * 50;

  return (
    <div className="absolute inset-0 w-full h-full bg-[#fbfbfd] overflow-hidden pointer-events-none z-0">
      {/* 1. Subtle Radial Vignette for Apple Studio Look */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 85% 65% at 50% 35%, rgba(255,255,255,0.95) 0%, rgba(243,246,251,0.85) 60%, rgba(230,237,247,0.7) 100%)",
        }}
      />

      {/* 2. Liquid Mesh Blob 1: Vibrant Electric Indigo / Cyan */}
      <div
        className="absolute w-[800px] h-[800px] rounded-full blur-[140px] opacity-25"
        style={{
          top: "-15%",
          left: "5%",
          background: "radial-gradient(circle, #6366f1 0%, #0ea5e9 60%, transparent 80%)",
          transform: `translate(${blob1X}px, ${blob1Y}px) scale(${blob1Scale})`,
        }}
      />

      {/* 3. Liquid Mesh Blob 2: Warm Amber / Rose */}
      <div
        className="absolute w-[850px] h-[850px] rounded-full blur-[150px] opacity-20"
        style={{
          bottom: "10%",
          right: "-15%",
          background: "radial-gradient(circle, #f59e0b 0%, #f43f5e 60%, transparent 80%)",
          transform: `translate(${blob2X}px, ${blob2Y}px) scale(${blob2Scale})`,
        }}
      />

      {/* 4. Liquid Mesh Blob 3: Mint Emerald Accent */}
      <div
        className="absolute w-[700px] h-[700px] rounded-full blur-[130px] opacity-20"
        style={{
          top: "45%",
          left: "-18%",
          background: "radial-gradient(circle, #10b981 0%, #06b6d4 70%, transparent 80%)",
          transform: `translate(${blob3X}px, ${blob3Y}px)`,
        }}
      />

      {/* 5. Apple Specular Glass Sheen Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-black/[0.02] pointer-events-none" />
    </div>
  );
};
