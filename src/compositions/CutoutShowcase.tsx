import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { ProCutout } from "../components/ProCutout";
import { CUTOUT_REGISTRY, CutoutMetadata } from "../components/CutoutLibrary";
import { Sparkles, Layers } from "lucide-react";
import "../style.css";

export const CutoutShowcase: React.FC = () => {
  const { width, height } = useVideoConfig();
  const frame = useCurrentFrame();

  const items: CutoutMetadata[] = Object.values(CUTOUT_REGISTRY);
  // Display top 12 featured cutouts
  const featured = items.slice(0, 12);

  return (
    <div
      className="relative w-full h-full bg-[#f8fafc] text-slate-900 flex flex-col p-12 overflow-hidden select-none font-sans"
      style={{ width, height }}
    >
      {/* Ambient background mesh */}
      <div
        className="absolute inset-0 opacity-90 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 20%, #f1f5f9 0%, #e2e8f0 45%, #cbd5e1 100%)",
        }}
      />
      <div
        className="absolute w-[800px] h-[800px] rounded-full blur-[140px] opacity-20 pointer-events-none"
        style={{
          background: "radial-gradient(circle, #38bdf8 0%, #6366f1 100%)",
          top: "5%",
          left: "5%",
        }}
      />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between mb-8">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-3xl bg-slate-950 text-amber-300 flex items-center justify-center shadow-xl border-2 border-amber-400">
            <Layers className="w-9 h-9 text-amber-400" />
          </div>
          <div>
            <div className="text-4xl font-black text-slate-950 tracking-tight flex items-center gap-3">
              RightClips Cutout Asset Engine
              <Sparkles className="w-8 h-8 text-rose-500" />
            </div>
            <div className="text-xl font-mono font-bold text-slate-500">
              45 High-Impact Cutouts Indexed & Ready for Autonomous AI Agents
            </div>
          </div>
        </div>

        <div className="px-6 py-3 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-300 font-mono text-sm font-black text-slate-800 shadow-sm">
          public/assets/registry.json
        </div>
      </div>

      {/* Grid of Featured Cutouts */}
      <div className="relative z-10 grid grid-cols-4 gap-6 flex-1 items-stretch">
        {featured.map((item, idx) => {
          const glowColors: Array<"rose" | "emerald" | "amber" | "sky" | "indigo" | "purple"> = [
            "rose",
            "sky",
            "emerald",
            "amber",
            "indigo",
            "purple",
          ];
          const glow = glowColors[idx % glowColors.length];

          return (
            <div
              key={item.id}
              className="rounded-[36px] p-5 bg-white/90 backdrop-blur-xl border-2 border-white shadow-xl flex flex-col items-center justify-between text-center"
            >
              <div className="self-start px-3.5 py-1 rounded-full bg-slate-950 text-white font-mono text-xs font-black uppercase tracking-wider">
                {item.category}
              </div>

              <div className="w-40 h-40 my-auto flex items-center justify-center">
                <ProCutout
                  assetId={item.id}
                  glowColor={glow}
                  animation="none"
                  width="100%"
                  height="100%"
                />
              </div>

              <div className="w-full">
                <div className="text-lg font-black text-slate-950 truncate">
                  {item.title}
                </div>
                <div className="text-xs font-mono font-bold text-sky-600 mt-1 truncate">
                  {item.id}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
