import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export const GogginsBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Gentle continuous drift & slow breathing
  const time = frame / fps;
  const orb1X = Math.sin(time * 0.4) * 80;
  const orb1Y = Math.cos(time * 0.35) * 60;
  const orb2X = Math.cos(time * 0.3) * -70;
  const orb2Y = Math.sin(time * 0.45) * 90;
  const orb3Y = Math.sin(time * 0.5) * 50;

  // Background subtle warm-to-cool gradient shift
  const bgOpacity = interpolate(frame, [0, durationInFrames], [0.95, 1.0]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
      {/* 1. Base Studio Canvas */}
      <div className="absolute inset-0 bg-[#f8fafc]" />

      {/* 2. Top-Center Soft Studio Keylight */}
      <div
        className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[1400px] h-[900px] rounded-full blur-[140px] pointer-events-none opacity-80"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(255,255,255,1) 0%, rgba(241,245,249,0.8) 50%, transparent 80%)",
        }}
      />

      {/* 3. Liquid Mesh Orb 1: Apple Electric Blue */}
      <div
        className="absolute top-[18%] -left-[15%] w-[750px] h-[750px] rounded-full blur-[130px] opacity-45 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(0,113,227,0.75) 0%, rgba(56,189,248,0.3) 60%, transparent 80%)",
          transform: `translate(${orb1X}px, ${orb1Y}px)`,
        }}
      />

      {/* 4. Liquid Mesh Orb 2: Electric Indigo & Amber Warmth */}
      <div
        className="absolute top-[48%] -right-[15%] w-[850px] h-[850px] rounded-full blur-[140px] opacity-40 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(99,102,241,0.7) 0%, rgba(245,158,11,0.25) 55%, transparent 80%)",
          transform: `translate(${orb2X}px, ${orb2Y}px)`,
        }}
      />

      {/* 5. Liquid Mesh Orb 3: Soft Bottom Cyan Glow */}
      <div
        className="absolute bottom-[-10%] left-[20%] w-[900px] h-[700px] rounded-full blur-[150px] opacity-35 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(14,165,233,0.6) 0%, rgba(16,185,129,0.25) 60%, transparent 80%)",
          transform: `translateY(${orb3Y}px)`,
        }}
      />

      {/* 6. Subtle Apple Frosted Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-slate-900/[0.03] pointer-events-none" />
    </div>
  );
};
