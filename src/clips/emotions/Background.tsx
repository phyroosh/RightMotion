import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export const EmotionsBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Subtle breathing gradient motion
  const orb1Y = interpolate(Math.sin(frame / 38), [-1, 1], [-25, 25]);
  const orb2X = interpolate(Math.cos(frame / 46), [-1, 1], [-30, 30]);
  const orb3Scale = interpolate(Math.sin(frame / 52), [-1, 1], [0.95, 1.08]);

  return (
    <div className="absolute inset-0 w-full h-full bg-[#f8fafc] overflow-hidden select-none">
      {/* 1. Studio Ambient Liquid Glow Orbs (Calming Rose/Indigo/Sky Palette) */}
      <div
        className="absolute -top-[10%] -left-[16%] w-[740px] h-[740px] rounded-full bg-gradient-to-br from-rose-200/45 via-indigo-100/35 to-transparent blur-[130px] pointer-events-none"
        style={{ transform: `translateY(${orb1Y}px)` }}
      />
      <div
        className="absolute top-[35%] -right-[15%] w-[700px] h-[700px] rounded-full bg-gradient-to-bl from-sky-200/50 via-indigo-100/40 to-transparent blur-[140px] pointer-events-none"
        style={{ transform: `translateX(${orb2X}px)` }}
      />
      <div
        className="absolute -bottom-[10%] left-[10%] w-[800px] h-[800px] rounded-full bg-gradient-to-t from-slate-200/60 via-indigo-100/40 to-transparent blur-[150px] pointer-events-none"
        style={{ transform: `scale(${orb3Scale})` }}
      />

      {/* 2. Apple Studio Texture Matrix */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#0f172a 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />
    </div>
  );
};
