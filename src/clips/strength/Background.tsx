import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export const StrengthBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Subtle breathing gradient motion
  const orb1Y = interpolate(Math.sin(frame / 35), [-1, 1], [-25, 25]);
  const orb2X = interpolate(Math.cos(frame / 45), [-1, 1], [-30, 30]);
  const orb3Scale = interpolate(Math.sin(frame / 50), [-1, 1], [0.94, 1.08]);

  return (
    <div className="absolute inset-0 w-full h-full bg-[#f8fafc] overflow-hidden select-none">
      {/* Studio Ambient Liquid Glow Orbs */}
      <div
        className="absolute -top-[12%] -left-[18%] w-[720px] h-[720px] rounded-full bg-gradient-to-br from-indigo-200/50 via-sky-200/40 to-transparent blur-[130px] pointer-events-none"
        style={{ transform: `translateY(${orb1Y}px)` }}
      />
      <div
        className="absolute top-[32%] -right-[18%] w-[680px] h-[680px] rounded-full bg-gradient-to-bl from-blue-200/50 via-cyan-100/40 to-transparent blur-[140px] pointer-events-none"
        style={{ transform: `translateX(${orb2X}px)` }}
      />
      <div
        className="absolute -bottom-[12%] left-[15%] w-[780px] h-[780px] rounded-full bg-gradient-to-t from-slate-200/70 via-indigo-100/45 to-transparent blur-[150px] pointer-events-none"
        style={{ transform: `scale(${orb3Scale})` }}
      />

      {/* Subtle Studio Texture Grid */}
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
