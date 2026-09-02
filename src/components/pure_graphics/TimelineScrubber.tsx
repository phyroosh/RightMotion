import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Rewind, Activity } from "lucide-react";

export interface TimelineScrubberProps {
  startMs: number;
  endMs: number;
  label?: string;
  sublabel?: string;
}

export const TimelineScrubber: React.FC<TimelineScrubberProps> = ({
  startMs,
  endMs,
  label = "MENTAL DVR • AUTO-REWIND",
  sublabel = "Your brain endlessly replays the memory searching for closure",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const startFrame = Math.floor((startMs / 1000) * fps);
  const durationFrames = Math.max(1, Math.floor(((endMs - startMs) / 1000) * fps));

  // Scrubber percentage from 95% to 15%
  const scrubPct = interpolate(
    frame,
    [startFrame, startFrame + durationFrames],
    [95, 15],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div className="w-full max-w-[1000px] rounded-[52px] p-12 bg-white/95 backdrop-blur-2xl shadow-[0_30px_70px_rgba(15,23,42,0.12)] border-[4px] border-sky-300/90 flex flex-col gap-8 text-center">
      {/* Top Header Badge */}
      <div className="flex items-center justify-between w-full">
        <div className="px-8 py-3 rounded-full bg-sky-50 border-2 border-sky-300 text-[#0071e3] font-mono font-black text-2xl uppercase tracking-widest flex items-center gap-3">
          <Rewind className="w-7 h-7 animate-pulse" />
          {label}
        </div>
        <div className="px-6 py-2.5 rounded-full bg-slate-900 text-sky-400 font-mono font-black text-xl flex items-center gap-2.5">
          <Activity className="w-5 h-5 text-sky-400" />
          ACTIVE LOOP
        </div>
      </div>

      {/* Main Track & Scrubber Bar */}
      <div className="relative w-full h-20 bg-slate-100/90 rounded-3xl overflow-hidden p-2.5 flex items-center border border-slate-200 shadow-inner">
        {/* Animated frequency ticks */}
        <div className="absolute inset-0 flex items-center justify-around px-6 opacity-40">
          {Array.from({ length: 28 }).map((_, i) => (
            <div
              key={i}
              className="w-2 bg-sky-500 rounded-full"
              style={{
                height: `${28 + Math.sin((frame * 0.25) + i * 0.9) * 22}px`,
              }}
            />
          ))}
        </div>

        {/* Progress Fill */}
        <div
          className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-sky-400/40 to-sky-500/60 rounded-3xl transition-all"
          style={{ width: `${scrubPct}%` }}
        />

        {/* Large Scrubber Head Pin */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-10 h-16 bg-[#0071e3] rounded-2xl shadow-xl border-3 border-white flex items-center justify-center -translate-x-1/2"
          style={{ left: `${scrubPct}%` }}
        >
          <div className="w-1.5 h-8 bg-white rounded-full" />
        </div>
      </div>

      {/* Status Line */}
      <div className="text-4xl md:text-5xl font-black text-slate-950 tracking-tight leading-tight">
        Replaying What Happened
      </div>

      {/* Subtitle explanation */}
      <div className="text-2xl md:text-3xl font-bold text-slate-600 max-w-[850px] mx-auto leading-snug">
        {sublabel}
      </div>
    </div>
  );
};
