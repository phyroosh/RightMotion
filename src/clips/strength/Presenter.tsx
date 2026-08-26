import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CharacterKeyframeAnimator, KeyframePoint } from "../../components/CharacterKeyframeAnimator";
import { HelpCircle, Sparkles, Feather } from "lucide-react";

interface PresenterProps {
  currentMs: number;
}

export const StrengthPresenter: React.FC<PresenterProps> = ({ currentMs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // A-Roll keyframe tracks (character slides in/out from bottom)
  // A-Roll Intervals:
  // 1. 0 - 3,500ms: Intro Hook (pointing pose)
  // 2. 9,100 - 15,400ms: Real Strength Reframe (open palms)
  // 3. 30,100 - 33,600ms: Carry Alone / Unburden (crossed)
  const keyframes: KeyframePoint[] = [
    // 1. Intro Hook (0s - 3.5s): Pointing — directing attention
    { timeMs: 0,    pose: "pointing", scale: 0.94, y: 80, rotate: -2, opacity: 0 },
    { timeMs: 300,  pose: "pointing", scale: 1.0,  y: 0,  rotate: 0,  opacity: 1 },
    { timeMs: 3000, pose: "pointing", scale: 1.02, y: -4, rotate: 1,  opacity: 1 },
    { timeMs: 3500, pose: "pointing", scale: 0.94, y: 90, rotate: 2,  opacity: 0 },

    // 2. Real Strength Reframe (9.1s - 15.4s): Open palms — compassionate reframe
    { timeMs: 9100,  pose: "open", scale: 0.94, y: 80, rotate: -2, opacity: 0 },
    { timeMs: 9700,  pose: "open", scale: 1.04, y: 0,  rotate: 0,  opacity: 1 },
    { timeMs: 14800, pose: "open", scale: 1.06, y: -5, rotate: 1,  opacity: 1 },
    { timeMs: 15400, pose: "open", scale: 0.94, y: 90, rotate: 2,  opacity: 0 },

    // 3. Unburden Yourself (30.1s - 33.6s): Crossed — analytical skepticism of the alone-myth
    { timeMs: 30100, pose: "crossed", scale: 0.94, y: 90, rotate: 2,  opacity: 0 },
    { timeMs: 30700, pose: "crossed", scale: 1.05, y: 0,  rotate: 0,  opacity: 1 },
    { timeMs: 33000, pose: "crossed", scale: 1.07, y: -5, rotate: -1, opacity: 1 },
    { timeMs: 33600, pose: "crossed", scale: 0.94, y: 90, rotate: -2, opacity: 0 },
  ];

  const isIntro     = currentMs >= 0      && currentMs < 3500;
  const isReframe   = currentMs >= 9100   && currentMs < 15400;
  const isUnburden  = currentMs >= 30100  && currentMs < 33600;
  const isPresenterActive = isIntro || isReframe || isUnburden;

  const badgeSpring = spring({ frame, fps, config: { damping: 18, mass: 0.8, stiffness: 110 } });

  if (!isPresenterActive) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex flex-col items-center justify-end overflow-hidden">
      {/* 1. Frosted Glass Backdrop Overlay */}
      <div className="absolute inset-0 backdrop-blur-2xl bg-white/35 pointer-events-none transition-all duration-500" />

      {/* 2. Soft Ambient Radial Light Halo (anchored at bottom behind character) */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[850px] h-[850px] rounded-full pointer-events-none blur-[120px]"
        style={{
          background: isReframe
            ? "radial-gradient(circle, rgba(0,113,227,0.32) 0%, rgba(99,102,241,0.2) 60%, transparent 80%)"
            : isUnburden
            ? "radial-gradient(circle, rgba(99,102,241,0.3) 0%, rgba(244,63,94,0.2) 60%, transparent 80%)"
            : "radial-gradient(circle, rgba(245,158,11,0.35) 0%, rgba(0,113,227,0.2) 60%, transparent 80%)",
        }}
      />

      {/* 3. Apple Glass Scene Badge (top-anchored, large text, high contrast for mobile/480p) */}
      {isIntro && (
        <div
          className="absolute top-[13%] apple-glass flex items-center shadow-[0_30px_70px_rgba(245,158,11,0.24)] border-[5px] border-amber-300 z-40"
          style={{
            transform: `translateY(${(1 - badgeSpring) * -20}px) scale(${0.96 + badgeSpring * 0.04})`,
            padding: "26px 60px",
            borderRadius: 48,
            gap: 24,
          }}
        >
          <HelpCircle className="text-indigo-600" style={{ width: 60, height: 60 }} />
          <span className="text-slate-950 font-black tracking-wider uppercase" style={{ fontSize: 44 }}>
            THE SILENT STRUGGLE
          </span>
        </div>
      )}

      {isReframe && (
        <div
          className="absolute top-[13%] apple-glass flex items-center shadow-[0_30px_70px_rgba(0,113,227,0.24)] border-[5px] border-sky-300 z-40"
          style={{
            transform: `translateY(${(1 - badgeSpring) * -20}px) scale(${0.96 + badgeSpring * 0.04})`,
            padding: "26px 60px",
            borderRadius: 48,
            gap: 24,
          }}
        >
          <Sparkles className="text-sky-600 animate-spin" style={{ width: 60, height: 60 }} />
          <span className="text-slate-950 font-black tracking-wider uppercase" style={{ fontSize: 44 }}>
            REAL STRENGTH REFRAME
          </span>
        </div>
      )}

      {isUnburden && (
        <div
          className="absolute top-[13%] apple-glass flex items-center shadow-[0_30px_70px_rgba(99,102,241,0.24)] border-[5px] border-indigo-300 z-40"
          style={{
            transform: `translateY(${(1 - badgeSpring) * -20}px) scale(${0.96 + badgeSpring * 0.04})`,
            padding: "26px 60px",
            borderRadius: 48,
            gap: 24,
          }}
        >
          <Feather className="text-indigo-600" style={{ width: 60, height: 60 }} />
          <span className="text-slate-950 font-black tracking-wider uppercase" style={{ fontSize: 44 }}>
            UNBURDEN YOURSELF
          </span>
        </div>
      )}

      {/* 4. Animated Character — bottom-anchored, grows upward from the floor */}
      <CharacterKeyframeAnimator
        currentMs={currentMs}
        keyframes={keyframes}
        baseWidth={780}
        baseHeight={1200}
        className="-mb-6"
      />
    </div>
  );
};
