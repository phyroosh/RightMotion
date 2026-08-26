import React from "react";
import { Img, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Sparkles, Target, Trophy, ShieldAlert } from "lucide-react";

interface AvatarProps {
  currentMs: number;
}

export const ComparisonAvatar: React.FC<AvatarProps> = ({ currentMs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Character presence schedule for 47.8s comparison script:
  const isHook = currentMs >= 0 && currentMs < 3600;
  const isTrap = currentMs >= 20200 && currentMs < 24200;
  const isShift = currentMs >= 34800 && currentMs < 41000;
  const isFinale = currentMs >= 43500;

  const isVisible = isHook || isTrap || isShift || isFinale;

  const springConfig = { damping: 24, mass: 1.0, stiffness: 75 };

  const hookSpring = spring({ frame, fps, config: springConfig });
  const trapSpring = spring({
    frame: Math.max(0, frame - Math.floor((20200 / 1000) * fps)),
    fps,
    config: springConfig,
  });
  const shiftSpring = spring({
    frame: Math.max(0, frame - Math.floor((34800 / 1000) * fps)),
    fps,
    config: springConfig,
  });
  const finaleSpring = spring({
    frame: Math.max(0, frame - Math.floor((43500 / 1000) * fps)),
    fps,
    config: springConfig,
  });

  let currentSpring = 0;
  if (isFinale) currentSpring = finaleSpring;
  else if (isShift) currentSpring = shiftSpring;
  else if (isTrap) currentSpring = trapSpring;
  else if (isHook) currentSpring = hookSpring;

  if (!isVisible && currentSpring < 0.01) return null;

  const idleFloatY = Math.sin(frame * 0.03) * 6;
  const idleTilt = Math.cos(frame * 0.025) * 0.8;

  return (
    <div
      className="absolute z-30 pointer-events-none bottom-[-30px] -right-8 w-[450px] h-[720px]"
      style={{
        transform: `translateY(${(1 - currentSpring) * 140 + idleFloatY}px) rotate(${idleTilt}deg)`,
        opacity: Math.min(1, currentSpring * 1.5),
      }}
    >
      {/* Soft Ambient Light Halo */}
      <div className="absolute inset-x-10 top-24 bottom-0 rounded-[48px] bg-gradient-to-t from-white/80 via-sky-400/15 to-transparent blur-3xl pointer-events-none" />

      {isHook && (
        <div
          className="absolute top-2 right-12 px-5 py-2.5 rounded-2xl apple-glass flex items-center gap-2 shadow-apple-glass z-40 border border-white"
          style={{ transform: `scale(${0.95 + hookSpring * 0.05})` }}
        >
          <Sparkles className="w-5 h-5 text-sky-500" />
          <span className="text-slate-900 font-bold text-sm tracking-tight">THE COMPARISON TRAP</span>
        </div>
      )}

      {isTrap && (
        <div
          className="absolute top-2 right-12 px-6 py-2.5 rounded-2xl apple-glass flex items-center gap-2.5 shadow-apple-glass z-40 border border-white"
          style={{ transform: `scale(${0.95 + trapSpring * 0.05})` }}
        >
          <ShieldAlert className="w-5 h-5 text-rose-500" />
          <span className="text-slate-900 font-bold text-sm tracking-tight">REALITY CHECK</span>
        </div>
      )}

      {isShift && (
        <div
          className="absolute top-2 right-12 px-6 py-2.5 rounded-2xl apple-glass flex items-center gap-2.5 shadow-apple-glass z-40 border border-white"
          style={{ transform: `scale(${0.95 + shiftSpring * 0.05})` }}
        >
          <Target className="w-5 h-5 text-[#0071e3]" />
          <span className="text-slate-900 font-bold text-sm tracking-tight">MINDSET SHIFT</span>
        </div>
      )}

      {isFinale && (
        <div
          className="absolute top-2 right-12 px-6 py-2.5 rounded-2xl apple-glass flex items-center gap-2.5 shadow-apple-glass z-40 border border-white"
          style={{ transform: `scale(${0.95 + finaleSpring * 0.05})` }}
        >
          <Trophy className="w-5 h-5 text-emerald-500" />
          <span className="text-slate-900 font-bold text-sm tracking-tight">YOURS IS ENOUGH</span>
        </div>
      )}

      {/* Main New Character Cutout Image */}
      <Img
        src={staticFile("character.png")}
        className="w-full h-full object-contain object-bottom drop-shadow-[0_25px_35px_rgba(0,0,0,0.18)]"
        alt="Presenter Avatar"
      />
    </div>
  );
};
