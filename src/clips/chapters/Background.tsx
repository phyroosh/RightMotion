import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export const ChaptersBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Gentle studio liquid breathing motions
  const orb1Y = interpolate(Math.sin(frame / 40), [-1, 1], [-25, 25]);
  const orb2X = interpolate(Math.cos(frame / 48), [-1, 1], [-30, 30]);
  const orb3Scale = interpolate(Math.sin(frame / 54), [-1, 1], [0.94, 1.07]);

  return (
    <div className="absolute inset-0 w-full h-full bg-[#f8fafc] overflow-hidden select-none">
      {/* 1. Studio Ambient Liquid Glow Orbs (Deep Blue & Warm Amber / Gold Palette) */}
      <div
        className="absolute -top-[12%] -left-[18%] w-[760px] h-[760px] rounded-full bg-gradient-to-br from-amber-200/40 via-sky-200/35 to-transparent blur-[135px] pointer-events-none"
        style={{ transform: `translateY(${orb1Y}px)` }}
      />
      <div
        className="absolute top-[34%] -right-[18%] w-[720px] h-[720px] rounded-full bg-gradient-to-bl from-indigo-200/45 via-amber-100/35 to-transparent blur-[145px] pointer-events-none"
        style={{ transform: `translateX(${orb2X}px)` }}
      />
      <div
        className="absolute -bottom-[12%] left-[12%] w-[820px] h-[820px] rounded-full bg-gradient-to-t from-slate-200/65 via-sky-100/40 to-transparent blur-[150px] pointer-events-none"
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
