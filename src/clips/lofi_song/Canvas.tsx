import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Moon, Heart, Sparkles } from "lucide-react";

interface CanvasProps {
  currentMs: number;
}

export const LofiCanvas: React.FC<CanvasProps> = ({ currentMs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const timeSec = frame / fps;

  // Floating embers / dust particles
  const particles = Array.from({ length: 32 }).map((_, i) => {
    const seed = i * 137.5;
    const x = (seed * 19) % 1920;
    const speed = 0.35 + (i % 6) * 0.12;
    const y = 1080 - (((timeSec * speed * 55) + seed * 22) % 1180);
    const size = 2 + (i % 4) * 2.0;
    const opacity = 0.25 + 0.35 * Math.sin(timeSec * 2.2 + i * 0.8);

    return (
      <div
        key={`p-${i}`}
        className="absolute rounded-full pointer-events-none bg-rose-400"
        style={{
          left: `${x}px`,
          top: `${y}px`,
          width: `${size}px`,
          height: `${size}px`,
          opacity,
          boxShadow: `0 0 ${size * 3.5}px rgba(255, 59, 92, 0.9)`,
        }}
      />
    );
  });

  // Dynamic float offset for the central smartphone
  const floatY = Math.sin(timeSec * 1.6) * 6;
  const floatRotate = Math.sin(timeSec * 1.2) * 0.4;

  // Waveform bars configuration (15 reactive bars)
  const barHeights = [14, 24, 38, 22, 44, 32, 52, 36, 48, 28, 42, 20, 36, 22, 14];

  return (
    <div className="absolute inset-0 pointer-events-none z-10 w-full h-full overflow-hidden select-none">
      {/* 1. Ambient Background Embers & Star Dust */}
      {particles}

      {/* 2. Soft Midnight City Silhouette in Lower Background */}
      <div className="absolute bottom-0 inset-x-0 h-[260px] pointer-events-none opacity-25 flex items-end justify-between px-12">
        <div className="w-28 h-48 bg-rose-950/80 rounded-t-lg relative">
          <div className="absolute top-4 left-3 grid grid-cols-2 gap-2 opacity-50">
            <span className="w-2 h-3 bg-amber-400 rounded-sm" />
            <span className="w-2 h-3 bg-rose-400 rounded-sm" />
            <span className="w-2 h-3 bg-transparent rounded-sm" />
            <span className="w-2 h-3 bg-amber-400 rounded-sm" />
          </div>
        </div>
        <div className="w-36 h-64 bg-rose-950/90 rounded-t-lg relative">
          <div className="absolute top-6 left-4 grid grid-cols-3 gap-2.5 opacity-60">
            <span className="w-2 h-3 bg-rose-400 rounded-sm" />
            <span className="w-2 h-3 bg-amber-300 rounded-sm" />
            <span className="w-2 h-3 bg-rose-400 rounded-sm" />
          </div>
        </div>
        <div className="w-24 h-40 bg-rose-950/70 rounded-t-lg" />
        <div className="w-44 h-56 bg-rose-950/85 rounded-t-lg" />
        <div className="w-32 h-44 bg-rose-950/75 rounded-t-lg" />
      </div>

      {/* 3. Ambient Radial Red Glow Behind Phone */}
      <div
        className="absolute top-[22%] left-1/2 -translate-x-1/2 w-[800px] h-[550px] rounded-full pointer-events-none blur-[140px]"
        style={{
          background: "radial-gradient(circle, rgba(244,63,94,0.35) 0%, rgba(159,18,57,0.18) 50%, transparent 75%)",
          transform: `translate(-50%, ${floatY * 0.5}px)`,
        }}
      />

      {/* ========================================================= */}
      {/* MASTER MOTION GRAPHIC: GLOWING MIDNIGHT SMARTPHONE HUD    */}
      {/* ========================================================= */}
      <div
        className="absolute top-[16%] left-[33%] w-[34%] flex flex-col items-center"
        style={{
          transform: `translateY(${floatY}px) rotate(${floatRotate}deg)`,
          transition: "transform 0.05s linear",
        }}
      >
        {/* Glowing Smartphone Mockup */}
        <div className="w-full bg-gradient-to-b from-zinc-950 via-zinc-900 to-black rounded-[42px] p-7 border-2 border-rose-500/40 shadow-[0_30px_90px_rgba(255,59,92,0.30)] flex flex-col gap-5 relative overflow-hidden backdrop-blur-2xl">
          {/* Subtle Screen Highlight Gloss */}
          <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-rose-500/10 to-transparent pointer-events-none rounded-t-[40px]" />

          {/* Top Notch & Clock */}
          <div className="flex items-center justify-between px-2 text-rose-300/80">
            <span className="text-xs font-mono font-bold tracking-wider">02:47 AM</span>
            <div className="w-20 h-3.5 bg-zinc-800/90 rounded-full flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-900" />
            </div>
            <div className="flex items-center gap-1.5">
              <Moon className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            </div>
          </div>

          {/* Incoming Notification: HER NAME */}
          <div className="p-4.5 rounded-2xl bg-rose-950/60 border border-rose-500/40 backdrop-blur-md flex items-center gap-4 shadow-lg relative overflow-hidden">
            <div
              className="w-12 h-12 rounded-full bg-rose-600/30 border border-rose-400 flex items-center justify-center text-rose-300 shrink-0 shadow-[0_0_18px_rgba(255,59,92,0.8)]"
              style={{
                transform: `scale(${1 + 0.06 * Math.sin(timeSec * 3.5)})`,
              }}
            >
              <Heart className="w-6 h-6 text-rose-400 fill-rose-500" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-rose-100 tracking-tight">Uski Baatein</span>
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
              </div>
              <span className="text-xs text-rose-300/85 font-medium tracking-wide">
                Bas uska naam tha...
              </span>
            </div>
          </div>

          {/* Glowing Waveform Bars */}
          <div className="flex items-center justify-center gap-2 py-3">
            {barHeights.map((h, idx) => {
              const pulse = Math.sin(timeSec * 4.5 + idx * 0.55);
              const dynamicH = Math.max(10, h * (0.55 + 0.45 * pulse));

              return (
                <div
                  key={`wave-${idx}`}
                  className="w-1.5 bg-gradient-to-t from-rose-600 via-rose-500 to-amber-400 rounded-full"
                  style={{
                    height: `${dynamicH}px`,
                    boxShadow: "0 0 10px rgba(255,59,92,0.85)",
                    opacity: 0.75 + 0.25 * pulse,
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
