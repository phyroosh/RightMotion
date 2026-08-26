import React from "react";
import { useCurrentFrame } from "remotion";

export const ProcrastinationBackground: React.FC = () => {
  const frame = useCurrentFrame();

  // Subtle organic liquid drifting math
  const t = frame * 0.015;
  const x1 = Math.sin(t * 0.7) * 80;
  const y1 = Math.cos(t * 0.5) * 60;
  const x2 = Math.cos(t * 0.6) * 90;
  const y2 = Math.sin(t * 0.8) * 70;
  const x3 = Math.sin(t * 0.4) * 100;
  const y3 = Math.cos(t * 0.9) * 80;

  return (
    <div className="absolute inset-0 w-full h-full bg-[#f8fafc] overflow-hidden pointer-events-none z-0 select-none">
      {/* 1. Base Studio Ambient Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#ffffff] via-[#f1f5f9] to-[#e2e8f0]/60" />

      {/* 2. Liquid Floating Mesh Blobs (16:9 Widescreen Orbs) */}
      {/* Cool Apple Sky Blue Orb */}
      <div
        className="absolute w-[900px] h-[750px] rounded-full blur-[140px] opacity-45 pointer-events-none mix-blend-multiply"
        style={{
          background: "radial-gradient(circle, #38bdf8 0%, #0071e3 60%, transparent 80%)",
          left: `calc(15% + ${x1}px)`,
          top: `calc(10% + ${y1}px)`,
        }}
      />

      {/* Indigo / Purple Focus Orb */}
      <div
        className="absolute w-[850px] h-[700px] rounded-full blur-[150px] opacity-35 pointer-events-none mix-blend-multiply"
        style={{
          background: "radial-gradient(circle, #818cf8 0%, #4f46e5 60%, transparent 80%)",
          right: `calc(10% + ${x2}px)`,
          bottom: `calc(15% + ${y2}px)`,
        }}
      />

      {/* Emerald Clarity Orb */}
      <div
        className="absolute w-[700px] h-[600px] rounded-full blur-[130px] opacity-30 pointer-events-none mix-blend-multiply"
        style={{
          background: "radial-gradient(circle, #34d399 0%, #059669 60%, transparent 80%)",
          left: `calc(45% + ${x3}px)`,
          top: `calc(40% + ${y3}px)`,
        }}
      />

      {/* 3. Subtle Cinema Studio Grid / Noise Texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#0f172a 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* 4. Cinematic Studio Vignette */}
      <div className="absolute inset-0 bg-radial from-transparent via-transparent to-slate-900/10 pointer-events-none" />
    </div>
  );
};
