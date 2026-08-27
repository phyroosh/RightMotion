import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Disc3, Heart, Radio, Sparkles } from "lucide-react";

export const LofiHeader: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const totalProgress = (frame / durationInFrames) * 100;
  const timeSec = frame / fps;

  // Blinking REC dot
  const isRecBlink = Math.sin(timeSec * 3) > 0;

  return (
    <div className="absolute inset-x-0 top-0 pointer-events-none z-40 select-none">
      {/* Top Red Neon Progress Line */}
      <div className="w-full h-1 bg-rose-950/40 relative overflow-hidden backdrop-blur-md">
        <div
          className="h-full bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 transition-all duration-100 ease-linear shadow-[0_0_12px_rgba(244,63,94,0.8)]"
          style={{ width: `${totalProgress}%` }}
        />
      </div>

      {/* Top Header Bar */}
      <div className="p-8 flex items-center justify-between">
        {/* Left: Vintage Cassette / REC HUD */}
        <div className="px-6 py-2.5 rounded-2xl bg-black/40 backdrop-blur-xl border border-rose-500/30 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex items-center gap-3.5">
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,1)]"
              style={{ opacity: isRecBlink ? 1 : 0.2 }}
            />
            <span className="text-[11px] font-mono font-black text-rose-400 uppercase tracking-widest">
              REC • 02:47 AM
            </span>
          </div>

          <div className="h-4 w-[1px] bg-rose-500/30" />

          <div className="flex items-center gap-2">
            <Disc3
              className="w-4 h-4 text-rose-400 animate-spin"
              style={{ animationDuration: "4s" }}
            />
            <span className="text-xs font-black text-rose-100 tracking-wider uppercase">
              USKI BAATEIN
            </span>
          </div>
        </div>

        {/* Right: Vibe Badge */}
        <div className="px-5 py-2 rounded-2xl bg-black/35 backdrop-blur-xl border border-rose-500/20 shadow-lg flex items-center gap-2 text-rose-300/80">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[11px] font-mono font-black uppercase tracking-widest">
            MIDNIGHT LOFI ESSAY
          </span>
        </div>
      </div>
    </div>
  );
};
