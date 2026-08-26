import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Target, Zap, ShieldCheck, Sun, Lock, Award, Cpu } from "lucide-react";
import { WordTimestamp } from "../types";

interface MotionCardProps {
  transcript: WordTimestamp[];
}

export const MotionCard: React.FC<MotionCardProps> = ({ transcript }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const currentMs = (frame / fps) * 1000;

  // Exact milestones matching the speech timing
  // Phase 0: "Your attention is your greatest currency" (0 - 3000ms)
  // Phase 1: "Most people give it away to algorithms..." (3000ms - 7800ms)
  // Phase 2: "Win morning, protect focus, master craft" (7800ms+)
  let activePhase = 0;
  if (currentMs >= 7800) {
    activePhase = 2;
  } else if (currentMs >= 3000) {
    activePhase = 1;
  }

  // Springs for smooth transitions
  const spring1 = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.7, stiffness: 140 },
  });

  const spring2 = spring({
    frame: Math.max(0, frame - Math.floor((3000 / 1000) * fps)),
    fps,
    config: { damping: 14, mass: 0.7, stiffness: 140 },
  });

  const spring3 = spring({
    frame: Math.max(0, frame - Math.floor((7800 / 1000) * fps)),
    fps,
    config: { damping: 14, mass: 0.7, stiffness: 140 },
  });

  // Staggered springs for each pillar in Phase 3
  const springPillar1 = spring({
    frame: Math.max(0, frame - Math.floor((8000 / 1000) * fps)),
    fps,
    config: { damping: 12, mass: 0.6, stiffness: 180 },
  });

  const springPillar2 = spring({
    frame: Math.max(0, frame - Math.floor((9600 / 1000) * fps)),
    fps,
    config: { damping: 12, mass: 0.6, stiffness: 180 },
  });

  const springPillar3 = spring({
    frame: Math.max(0, frame - Math.floor((11600 / 1000) * fps)),
    fps,
    config: { damping: 12, mass: 0.6, stiffness: 180 },
  });

  return (
    <div className="absolute inset-x-8 top-[32%] -translate-y-1/2 flex items-center justify-center pointer-events-none z-30">
      {/* PHASE 1: TARGET / ATTENTION CURRENCY RETICLE */}
      {activePhase === 0 && (
        <div
          className="relative w-[520px] h-[520px] flex items-center justify-center"
          style={{
            transform: `scale(${spring1}) rotate(${(1 - spring1) * -15}deg)`,
            opacity: spring1,
          }}
        >
          {/* Concentric Rotating Outer Ring */}
          <div
            className="absolute inset-0 rounded-full border border-emerald-500/20 border-dashed"
            style={{
              transform: `rotate(${frame * 0.8}deg)`,
            }}
          />

          {/* Glowing Inner Radar Ring */}
          <div
            className="absolute inset-8 rounded-full border-2 border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.2)]"
            style={{
              transform: `scale(${1 + Math.sin(frame * 0.08) * 0.04})`,
            }}
          />

          {/* Central Glassmorphic Card */}
          <div className="relative w-80 h-80 rounded-3xl bg-zinc-900/90 border border-emerald-500/50 box-glow-emerald backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center">
            {/* Pulsing Icon */}
            <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 border border-emerald-400/40 flex items-center justify-center mb-4 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)]">
              <Target className="w-10 h-10 animate-spin-slow" />
            </div>

            <div className="text-zinc-400 font-mono text-xs tracking-widest uppercase mb-1">
              FOCUS PROTOCOL
            </div>
            <div className="text-white font-black text-2xl tracking-tight uppercase">
              ATTENTION CURRENCY
            </div>

            {/* Dynamic Metric Bar */}
            <div className="w-full mt-4 bg-zinc-800/80 rounded-full h-2.5 overflow-hidden p-0.5 border border-zinc-700">
              <div
                className="h-full bg-emerald-400 rounded-full shadow-[0_0_10px_#10b981]"
                style={{
                  width: `${interpolate(frame, [0, 45], [20, 100], {
                    extrapolateRight: "clamp",
                  })}%`,
                }}
              />
            </div>
            <div className="flex justify-between w-full text-[10px] font-mono text-emerald-400 mt-1.5 px-1">
              <span>VALUE: MAXIMUM</span>
              <span>100% PRIORITY</span>
            </div>
          </div>
        </div>
      )}

      {/* PHASE 2: ALGORITHM DEFENSE / SHIELD CARD */}
      {activePhase === 1 && (
        <div
          className="relative w-[540px] flex flex-col items-center justify-center"
          style={{
            transform: `scale(${spring2}) translateY(${(1 - spring2) * 30}px)`,
            opacity: spring2,
          }}
        >
          <div className="w-full rounded-3xl bg-zinc-900/90 border border-zinc-700/80 box-glow-subtle backdrop-blur-2xl p-8 flex flex-col items-center text-center relative overflow-hidden">
            {/* Scanning Laser Line */}
            <div
              className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981]"
              style={{
                top: `${interpolate(
                  (frame * 2.5) % 100,
                  [0, 100],
                  [0, 100]
                )}%`,
              }}
            />

            <div className="w-20 h-20 rounded-2xl bg-zinc-800/90 border border-emerald-500/40 flex items-center justify-center mb-5 text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.3)]">
              <Cpu className="w-10 h-10" />
            </div>

            <div className="text-emerald-400 font-mono text-sm tracking-widest uppercase mb-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              SHIELD STATUS: ACTIVE
            </div>

            <div className="text-white font-black text-3xl tracking-tight uppercase mb-3">
              ALGORITHM DEFENSE
            </div>

            <div className="text-zinc-400 text-sm font-medium leading-relaxed max-w-sm mb-4">
              Block low-value digital noise. Reclaim dopamine baseline.
            </div>

            {/* Status Tags */}
            <div className="grid grid-cols-2 gap-3 w-full mt-2">
              <div className="bg-zinc-800/60 rounded-xl p-2.5 border border-zinc-700/50 text-left">
                <div className="text-zinc-500 text-[10px] font-mono">FEED DISTRACTION</div>
                <div className="text-red-400 font-bold text-xs">MUTED (0%)</div>
              </div>
              <div className="bg-zinc-800/60 rounded-xl p-2.5 border border-emerald-500/30 text-left">
                <div className="text-zinc-500 text-[10px] font-mono">FUTURE COMPOUND</div>
                <div className="text-emerald-400 font-bold text-xs">ACTIVE (+10X)</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PHASE 3: 3-PILLARS OF MASTERY */}
      {activePhase === 2 && (
        <div
          className="relative w-[560px] flex flex-col items-center gap-4"
          style={{
            transform: `scale(${spring3})`,
            opacity: spring3,
          }}
        >
          {/* Top Badge */}
          <div className="px-5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-400 font-mono text-xs tracking-widest uppercase shadow-[0_0_20px_rgba(16,185,129,0.25)] flex items-center gap-2">
            <Award className="w-4 h-4" />
            TOP 1% PROTOCOL
          </div>

          {/* 3 Staggered Metric Cards */}
          <div className="w-full flex flex-col gap-3">
            {/* Pillar 1: Win Morning */}
            <div
              className="w-full rounded-2xl bg-zinc-900/90 border border-emerald-500/40 p-4 flex items-center justify-between shadow-[0_0_20px_rgba(16,185,129,0.15)] backdrop-blur-xl transition-all"
              style={{
                transform: `scale(${springPillar1}) translateX(${(1 - springPillar1) * -40}px)`,
                opacity: springPillar1,
              }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
                  <Sun className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-zinc-400 font-mono text-[10px] tracking-wider">PILLAR 01</div>
                  <div className="text-white font-bold text-lg tracking-tight uppercase">WIN THE MORNING</div>
                </div>
              </div>
              <div className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold">
                05:00 AM
              </div>
            </div>

            {/* Pillar 2: Protect Focus */}
            <div
              className="w-full rounded-2xl bg-zinc-900/90 border border-emerald-500/40 p-4 flex items-center justify-between shadow-[0_0_20px_rgba(16,185,129,0.15)] backdrop-blur-xl transition-all"
              style={{
                transform: `scale(${springPillar2}) translateX(${(1 - springPillar2) * 40}px)`,
                opacity: springPillar2,
              }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-zinc-400 font-mono text-[10px] tracking-wider">PILLAR 02</div>
                  <div className="text-white font-bold text-lg tracking-tight uppercase">PROTECT YOUR FOCUS</div>
                </div>
              </div>
              <div className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold">
                DEEP WORK
              </div>
            </div>

            {/* Pillar 3: Master Craft */}
            <div
              className="w-full rounded-2xl bg-zinc-900/90 border border-emerald-500/40 p-4 flex items-center justify-between shadow-[0_0_20px_rgba(16,185,129,0.15)] backdrop-blur-xl transition-all"
              style={{
                transform: `scale(${springPillar3}) translateX(${(1 - springPillar3) * -40}px)`,
                opacity: springPillar3,
              }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-zinc-400 font-mono text-[10px] tracking-wider">PILLAR 03</div>
                  <div className="text-white font-bold text-lg tracking-tight uppercase">MASTER YOUR CRAFT</div>
                </div>
              </div>
              <div className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold">
                DAILY +1%
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
