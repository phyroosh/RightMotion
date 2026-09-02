import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Rewind, Activity, Cpu } from "lucide-react";

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
  sublabel = "Brain endlessly re-examines past dialogue for missing variables",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const startFrame = Math.floor((startMs / 1000) * fps);
  const durationFrames = Math.max(1, Math.floor(((endMs - startMs) / 1000) * fps));

  // Scrubber percentage from 100% to 20% (rewinding backward!)
  const scrubPct = interpolate(
    frame,
    [startFrame, startFrame + durationFrames],
    [95, 15],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div className="w-full max-w-[980px] rounded-[48px] p-9 bg-white/95 backdrop-blur-2xl shadow-[0_25px_60px_rgba(15,23,42,0.10)] border-[3px] border-sky-200/80 flex flex-col gap-6">
      {/* Top Header */}
      <div className="flex items-center justify-between w-full">
        <div className="px-6 py-2.5 rounded-full bg-sky-50 border border-sky-200 text-[#0071e3] font-mono font-black text-lg uppercase tracking-widest flex items-center gap-2.5">
          <Rewind className="w-6 h-6 animate-pulse" />
          {label}
        </div>
        <div className="px-5 py-2 rounded-full bg-slate-100 text-slate-700 font-mono font-bold text-base flex items-center gap-2">
          <Cpu className="w-4 h-4 text-sky-500" />
          85% COGNITIVE THREAD
        </div>
      </div>

      {/* Main Track & Scrubber Bar */}
      <div className="relative w-full h-16 bg-slate-100/90 rounded-2xl overflow-hidden p-2 flex items-center">
        {/* Animated frequency ticks */}
        <div className="absolute inset-0 flex items-center justify-around px-4 opacity-40">
          {Array.from({ length: 32 }).map((_, i) => (
            <div
              key={i}
              className="w-1.5 bg-sky-400 rounded-full"
              style={{
                height: `${20 + Math.sin((frame * 0.2) + i * 0.8) * 16}px`,
              }}
            />
          ))}
        </div>

        {/* Progress Fill */}
        <div
          className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-sky-400/30 to-sky-500/50 rounded-2xl transition-all"
          style={{ width: `${scrubPct}%` }}
        />

        {/* Scrubber Head Pin */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-8 h-12 bg-[#0071e3] rounded-xl shadow-lg border-2 border-white flex items-center justify-center -translate-x-1/2"
          style={{ left: `${scrubPct}%` }}
        >
          <div className="w-1 h-6 bg-white/80 rounded-full" />
        </div>
      </div>

      {/* Timestamp status line */}
      <div className="flex items-center justify-between font-mono text-xl font-bold">
        <span className="text-rose-500 flex items-center gap-2">
          <Activity className="w-5 h-5 text-rose-500" />
          REPLAYING: "HOW COULD I PREVENT THIS?"
        </span>
        <span className="text-slate-400">
          PAST EVENT • LOCKED
        </span>
      </div>

      {/* Subtitle explanation */}
      <div className="text-2xl font-bold text-slate-800 text-center leading-snug">
        {sublabel}
      </div>
    </div>
  );
};
