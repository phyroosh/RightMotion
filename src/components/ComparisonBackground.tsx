import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export const ComparisonBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentMs = (frame / fps) * 1000;

  // Organic liquid drift
  const b1x = interpolate(Math.sin(frame * 0.025), [-1, 1], [-60, 60]);
  const b1y = interpolate(Math.cos(frame * 0.03), [-1, 1], [-40, 50]);
  const b1s = interpolate(Math.sin(frame * 0.035), [-1, 1], [0.94, 1.15]);

  const b2x = interpolate(Math.cos(frame * 0.028), [-1, 1], [50, -50]);
  const b2y = interpolate(Math.sin(frame * 0.022), [-1, 1], [-50, 40]);
  const b2s = interpolate(Math.cos(frame * 0.032), [-1, 1], [1.1, 0.9]);

  const b3x = interpolate(Math.sin(frame * 0.04), [-1, 1], [-40, 40]);
  const b3y = interpolate(Math.cos(frame * 0.035), [-1, 1], [30, -30]);

  // Scene timing for Comparison Mindset:
  let scene = 1;
  if (currentMs >= 41000) scene = 7;
  else if (currentMs >= 34800) scene = 6;
  else if (currentMs >= 24200) scene = 5;
  else if (currentMs >= 20200) scene = 4;
  else if (currentMs >= 8600) scene = 3;
  else if (currentMs >= 3600) scene = 2;

  type BlobColor = { orb1: string; orb2: string; orb3: string };
  const scenePalette: Record<number, BlobColor> = {
    1: { orb1: "rgba(14,165,233,0.40)", orb2: "rgba(99,102,241,0.35)", orb3: "rgba(244,63,94,0.22)" },
    2: { orb1: "rgba(16,185,129,0.38)", orb2: "rgba(14,165,233,0.35)", orb3: "rgba(99,102,241,0.28)" },
    3: { orb1: "rgba(251,191,36,0.38)", orb2: "rgba(99,102,241,0.35)", orb3: "rgba(244,63,94,0.28)" },
    4: { orb1: "rgba(244,63,94,0.42)", orb2: "rgba(251,191,36,0.35)", orb3: "rgba(15,23,42,0.30)" },
    5: { orb1: "rgba(14,165,233,0.38)", orb2: "rgba(99,102,241,0.32)", orb3: "rgba(244,63,94,0.25)" },
    6: { orb1: "rgba(0,113,227,0.45)", orb2: "rgba(14,165,233,0.35)", orb3: "rgba(16,185,129,0.30)" },
    7: { orb1: "rgba(16,185,129,0.45)", orb2: "rgba(14,165,233,0.38)", orb3: "rgba(251,191,36,0.30)" },
  };

  const pal = scenePalette[scene];

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden select-none">
      <div className="absolute inset-0 bg-gradient-to-b from-[#ffffff] via-[#f8fafc] to-[#f1f5f9]" />
      <div className="absolute inset-0 dot-pattern opacity-30 pointer-events-none" />

      <div
        className="absolute -top-[10%] -left-[15%] w-[880px] h-[880px] rounded-full pointer-events-none blur-[120px]"
        style={{
          background: `radial-gradient(circle, ${pal.orb1} 0%, ${pal.orb2} 45%, transparent 70%)`,
          transform: `translate(${b1x}px, ${b1y}px) scale(${b1s})`,
          transition: "background 1.5s ease",
        }}
      />

      <div
        className="absolute top-[32%] -right-[20%] w-[920px] h-[920px] rounded-full pointer-events-none blur-[130px]"
        style={{
          background: `radial-gradient(circle, ${pal.orb2} 0%, ${pal.orb3} 50%, transparent 70%)`,
          transform: `translate(${b2x}px, ${b2y}px) scale(${b2s})`,
          transition: "background 1.5s ease",
        }}
      />

      <div
        className="absolute -bottom-[12%] -left-[10%] w-[820px] h-[820px] rounded-full pointer-events-none blur-[125px]"
        style={{
          background: `radial-gradient(circle, ${pal.orb3} 0%, ${pal.orb1} 50%, transparent 70%)`,
          transform: `translate(${b3x}px, ${b3y}px)`,
          transition: "background 1.5s ease",
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(255,255,255,0.8) 0%, transparent 40%, rgba(255,255,255,0.4) 60%, transparent 100%)",
        }}
      />
    </div>
  );
};
