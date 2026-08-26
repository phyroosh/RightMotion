import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CharacterKeyframeAnimator, KeyframePoint } from "../../components/CharacterKeyframeAnimator";
import { Sparkles, Brain, HeartHandshake, ShieldAlert } from "lucide-react";

interface PresenterProps {
  currentMs: number;
}

export const ComparisonPresenter: React.FC<PresenterProps> = ({ currentMs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Multi-pose keyframe tracks for Comparison Shorts (51.84s total)
  const keyframes: KeyframePoint[] = [
    // 1. Intro Hook (0s - 7.5s): Pointing to grab attention
    { timeMs: 0, pose: "pointing", scale: 0.94, y: 80, rotate: -2, opacity: 0 },
    { timeMs: 400, pose: "pointing", scale: 1.0, y: 0, rotate: 0, opacity: 1 },
    { timeMs: 6500, pose: "pointing", scale: 1.02, y: -5, rotate: 1, opacity: 1 },
    { timeMs: 7500, pose: "pointing", scale: 0.95, y: 100, rotate: 2, opacity: 0 },

    // 2. Reality Check / The Trap (24s - 30s): Arms Crossed (Skeptical / Analytical)
    { timeMs: 23800, pose: "crossed", scale: 0.94, y: 90, rotate: 2, opacity: 0 },
    { timeMs: 24400, pose: "crossed", scale: 1.04, y: 0, rotate: 0, opacity: 1 },
    { timeMs: 29000, pose: "crossed", scale: 1.06, y: -6, rotate: -1, opacity: 1 },
    { timeMs: 30000, pose: "crossed", scale: 0.95, y: 90, rotate: -2, opacity: 0 },

    // 3. The Mindset Shift Punchline (36s - 43s): Open Palms (Empathetic / Reframe)
    { timeMs: 35800, pose: "open", scale: 0.94, y: 80, rotate: -2, opacity: 0 },
    { timeMs: 36500, pose: "open", scale: 1.06, y: 0, rotate: 0, opacity: 1 },
    { timeMs: 42000, pose: "open", scale: 1.08, y: -6, rotate: 1, opacity: 1 },
    { timeMs: 43000, pose: "open", scale: 0.95, y: 80, rotate: 2, opacity: 0 },

    // 4. Finale & Closing Takeaway (46s - End): Open Palms (Warm wisdom)
    { timeMs: 45500, pose: "open", scale: 0.95, y: 70, rotate: 1, opacity: 0 },
    { timeMs: 46200, pose: "open", scale: 1.05, y: 0, rotate: 0, opacity: 1 },
    { timeMs: 52000, pose: "open", scale: 1.07, y: -4, rotate: 0, opacity: 1 },
  ];

  const isIntro = currentMs >= 0 && currentMs < 7500;
  const isTrap = currentMs >= 23800 && currentMs < 30000;
  const isShift = currentMs >= 35800 && currentMs < 43000;
  const isFinale = currentMs >= 45500;

  const isPresenterActive = isIntro || isTrap || isShift || isFinale;

  const fastSpringConfig = { damping: 18, mass: 0.8, stiffness: 110 };
  const badgeSpring = spring({ frame, fps, config: fastSpringConfig });

  if (!isPresenterActive) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex flex-col items-center justify-end overflow-hidden">
      {/* 1. Frosted Glass Backdrop Overlay */}
      <div className="absolute inset-0 backdrop-blur-2xl bg-white/35 pointer-events-none transition-all duration-500" />

      {/* 2. Soft Ambient Radial Light Halo */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[850px] h-[850px] rounded-full pointer-events-none blur-[120px]"
        style={{
          background: isFinale
            ? "radial-gradient(circle, rgba(16,185,129,0.3) 0%, rgba(14,165,233,0.2) 60%, transparent 80%)"
            : isTrap
            ? "radial-gradient(circle, rgba(244,63,94,0.3) 0%, rgba(99,102,241,0.2) 60%, transparent 80%)"
            : "radial-gradient(circle, rgba(0,113,227,0.32) 0%, rgba(99,102,241,0.18) 60%, transparent 80%)",
        }}
      />

      {/* 3. Floating Apple Glass Badge (Enlarged 2x for Mobile/480p High Contrast) */}
      {isIntro && (
        <div
          className="absolute top-[13%] apple-glass flex items-center shadow-[0_30px_70px_rgba(0,113,227,0.22)] border-[5px] border-white z-40"
          style={{
            transform: `translateY(${(1 - badgeSpring) * -20}px) scale(${0.96 + badgeSpring * 0.04})`,
            padding: "26px 60px",
            borderRadius: 48,
            gap: 24,
          }}
        >
          <Sparkles className="text-sky-500 animate-spin" style={{ width: 60, height: 60, animationDuration: "8s" }} />
          <span className="text-slate-950 font-black tracking-wider uppercase" style={{ fontSize: 44 }}>
            THE COMPARISON TRAP
          </span>
        </div>
      )}

      {isTrap && (
        <div
          className="absolute top-[13%] apple-glass flex items-center shadow-[0_30px_70px_rgba(244,63,94,0.22)] border-[5px] border-rose-300 z-40"
          style={{
            transform: `translateY(${(1 - badgeSpring) * -20}px) scale(${0.96 + badgeSpring * 0.04})`,
            padding: "26px 60px",
            borderRadius: 48,
            gap: 24,
          }}
        >
          <ShieldAlert className="text-rose-500" style={{ width: 60, height: 60 }} />
          <span className="text-slate-950 font-black tracking-wider uppercase" style={{ fontSize: 44 }}>
            THE FINISH LINE KEEPS MOVING
          </span>
        </div>
      )}

      {isShift && (
        <div
          className="absolute top-[13%] apple-glass flex items-center shadow-[0_30px_70px_rgba(0,113,227,0.22)] border-[5px] border-[#0071e3] z-40"
          style={{
            transform: `translateY(${(1 - badgeSpring) * -20}px) scale(${0.96 + badgeSpring * 0.04})`,
            padding: "26px 60px",
            borderRadius: 48,
            gap: 24,
          }}
        >
          <Brain className="text-[#0071e3] animate-pulse" style={{ width: 60, height: 60 }} />
          <span className="text-slate-950 font-black tracking-wider uppercase" style={{ fontSize: 44 }}>
            THE INTERNAL RACE
          </span>
        </div>
      )}

      {isFinale && (
        <div
          className="absolute top-[13%] apple-glass flex items-center shadow-[0_30px_70px_rgba(16,185,129,0.22)] border-[5px] border-emerald-400 z-40"
          style={{
            transform: `translateY(${(1 - badgeSpring) * -20}px) scale(${0.96 + badgeSpring * 0.04})`,
            padding: "26px 60px",
            borderRadius: 48,
            gap: 24,
          }}
        >
          <HeartHandshake className="text-emerald-500 animate-bounce" style={{ width: 60, height: 60 }} />
          <span className="text-slate-950 font-black tracking-wider uppercase" style={{ fontSize: 44 }}>
            YOURS IS ENOUGH
          </span>
        </div>
      )}

      {/* 4. Animated Character with Keyframe Engine */}
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
