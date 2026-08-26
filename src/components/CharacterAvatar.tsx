import React from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Sparkles, Target, Trophy, ShieldAlert, HeartHandshake, Brain } from "lucide-react";

interface CharacterAvatarProps {
  currentMs: number;
}

export const CharacterAvatar: React.FC<CharacterAvatarProps> = ({ currentMs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Character presence schedule for 46.2s Habit Psychology script:
  // 1. Hook intro: 0 to 5,000ms
  // 2. Survival Dialogue: 27,200 to 34,200ms
  // 3. Root Function Shift: 34,200 to 41,500ms
  // 4. Finale / Peace: 41,500ms to end
  const isHook = currentMs >= 0 && currentMs < 5000;
  const isSurvival = currentMs >= 27200 && currentMs < 34200;
  const isFunction = currentMs >= 34200 && currentMs < 41500;
  const isFinale = currentMs >= 41500;

  const isVisible = isHook || isSurvival || isFunction || isFinale;

  // Smooth spring physics with soft Apple ease per editing rules
  const springConfig = { damping: 24, mass: 1.0, stiffness: 75 };

  const hookSpring = spring({ frame, fps, config: springConfig });
  const survivalSpring = spring({
    frame: Math.max(0, frame - Math.floor((27200 / 1000) * fps)),
    fps,
    config: springConfig,
  });
  const functionSpring = spring({
    frame: Math.max(0, frame - Math.floor((34200 / 1000) * fps)),
    fps,
    config: springConfig,
  });
  const finaleSpring = spring({
    frame: Math.max(0, frame - Math.floor((41500 / 1000) * fps)),
    fps,
    config: springConfig,
  });

  let currentSpring = 0;
  if (isFinale) currentSpring = finaleSpring;
  else if (isFunction) currentSpring = functionSpring;
  else if (isSurvival) currentSpring = survivalSpring;
  else if (isHook) currentSpring = hookSpring;

  if (!isVisible && currentSpring < 0.01) return null;

  // Gentle breathing float
  const idleFloatY = Math.sin(frame * 0.03) * 6;
  const idleTilt = Math.cos(frame * 0.025) * 0.8;

  return (
    <div
      className="absolute z-30 pointer-events-none bottom-[-30px] -right-14 w-[470px] h-[760px]"
      style={{
        transform: `translateY(${(1 - currentSpring) * 140 + idleFloatY}px) rotate(${idleTilt}deg)`,
        opacity: Math.min(1, currentSpring * 1.5),
      }}
    >
      {/* Soft Ambient Light Halo */}
      <div className="absolute inset-x-10 top-24 bottom-0 rounded-[48px] bg-gradient-to-t from-white/80 via-sky-400/15 to-transparent blur-3xl pointer-events-none" />

      {/* Badge in Hook Scene */}
      {isHook && (
        <div
          className="absolute top-2 right-14 px-5 py-2.5 rounded-2xl apple-glass flex items-center gap-2 shadow-apple-glass z-40 border border-white"
          style={{ transform: `scale(${0.95 + hookSpring * 0.05})` }}
        >
          <Sparkles className="w-5 h-5 text-amber-500" />
          <span className="text-slate-900 font-bold text-sm tracking-tight">THE PARADOX</span>
        </div>
      )}

      {/* Badge in Survival Scene */}
      {isSurvival && (
        <div
          className="absolute top-2 right-14 px-6 py-2.5 rounded-2xl apple-glass flex items-center gap-2.5 shadow-apple-glass z-40 border border-white"
          style={{ transform: `scale(${0.95 + survivalSpring * 0.05})` }}
        >
          <Brain className="w-5 h-5 text-amber-500" />
          <span className="text-slate-900 font-bold text-sm tracking-tight">SURVIVAL LOGIC</span>
        </div>
      )}

      {/* Badge in Function Scene */}
      {isFunction && (
        <div
          className="absolute top-2 right-14 px-6 py-2.5 rounded-2xl apple-glass flex items-center gap-2.5 shadow-apple-glass z-40 border border-white"
          style={{ transform: `scale(${0.95 + functionSpring * 0.05})` }}
        >
          <Target className="w-5 h-5 text-[#0071e3]" />
          <span className="text-slate-900 font-bold text-sm tracking-tight">FIND THE PAYOFF</span>
        </div>
      )}

      {/* Badge in Finale Scene */}
      {isFinale && (
        <div
          className="absolute top-2 right-14 px-6 py-2.5 rounded-2xl apple-glass flex items-center gap-2.5 shadow-apple-glass z-40 border border-white"
          style={{ transform: `scale(${0.95 + finaleSpring * 0.05})` }}
        >
          <HeartHandshake className="w-5 h-5 text-emerald-500" />
          <span className="text-slate-900 font-bold text-sm tracking-tight">SELF COMPASSION</span>
        </div>
      )}

      {/* Main Character Cutout Image */}
      <Img
        src={staticFile("character.png")}
        className="w-full h-full object-contain object-bottom drop-shadow-[0_25px_35px_rgba(0,0,0,0.15)]"
        alt="Presenter Avatar"
      />
    </div>
  );
};
