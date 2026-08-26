import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

export const Background: React.FC = () => {
  const frame = useCurrentFrame();

  // Subtle breathing pulse for the ambient radial glow
  const glowOpacity = interpolate(
    Math.sin(frame * 0.05),
    [-1, 1],
    [0.12, 0.22]
  );

  const glowScale = interpolate(
    Math.sin(frame * 0.03),
    [-1, 1],
    [0.9, 1.1]
  );

  return (
    <div className="absolute inset-0 w-full h-full bg-[#09090b] overflow-hidden select-none">
      {/* Subtle Grid Accent */}
      <div className="absolute inset-0 grid-background opacity-40" />

      {/* Top Ambient Radial Emerald Glow */}
      <div
        className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] rounded-full pointer-events-none blur-[140px]"
        style={{
          background: "radial-gradient(circle, rgba(16, 185, 129, 0.35) 0%, rgba(5, 150, 105, 0.1) 50%, transparent 70%)",
          opacity: glowOpacity,
          transform: `translateX(-50%) scale(${glowScale})`,
        }}
      />

      {/* Bottom Subtle Violet/Slate Fill */}
      <div
        className="absolute -bottom-[20%] left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] rounded-full pointer-events-none blur-[160px]"
        style={{
          background: "radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)",
        }}
      />

      {/* Corner UI Tech Accents */}
      <div className="absolute top-16 left-12 flex items-center space-x-2 text-zinc-500 font-mono text-xl tracking-widest uppercase opacity-70">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
        <span className="text-zinc-400 font-semibold ml-2">SYSTEM.FOCUS // 01</span>
      </div>

      <div className="absolute top-16 right-12 text-zinc-600 font-mono text-xl tracking-widest opacity-60">
        4K_HDR [REC]
      </div>

      {/* Subtle corner crosshairs */}
      <div className="absolute bottom-16 left-12 text-zinc-700 font-mono text-lg tracking-widest">
        + 1080x1920 // 30FPS
      </div>
      <div className="absolute bottom-16 right-12 text-zinc-700 font-mono text-lg tracking-widest">
        RIGHTCLIPS.AI +
      </div>
    </div>
  );
};
