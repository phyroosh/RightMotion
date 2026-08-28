import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CharacterKeyframeAnimator, KeyframePoint } from "../../components/CharacterKeyframeAnimator";
import { Sparkles, Brain, Repeat, Zap, ShieldCheck } from "lucide-react";

interface PresenterProps {
  currentMs: number;
}

export const PatternsPresenter: React.FC<PresenterProps> = ({ currentMs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Full-Body Keyframes (Intro Hook 0-5.8s & Outro Finale 27.8s-End)
  const fullBodyKeyframes: KeyframePoint[] = [
    // Intro Hook (0s - 5.8s): Full-body pointing — Why is it so hard to break a pattern?
    { timeMs: 0, pose: "fullbody_pointing", scale: 0.95, y: 80, rotate: -1, opacity: 0 },
    { timeMs: 380, pose: "fullbody_pointing", scale: 1.0, y: 0, rotate: 0, opacity: 1 },
    { timeMs: 5200, pose: "fullbody_pointing", scale: 1.03, y: -4, rotate: 1, opacity: 1 },
    { timeMs: 5800, pose: "fullbody_pointing", scale: 0.95, y: 90, rotate: 2, opacity: 0 },

    // Outro Finale (27.8s - End): Full-body open palms — One different move today
    { timeMs: 27800, pose: "fullbody_open", scale: 0.94, y: 80, rotate: -1, opacity: 0 },
    { timeMs: 28400, pose: "fullbody_open", scale: 1.02, y: 0, rotate: 0, opacity: 1 },
    { timeMs: 34000, pose: "fullbody_open", scale: 1.05, y: -5, rotate: 0, opacity: 1 },
  ];

  const isIntro = currentMs >= 0 && currentMs < 5800;
  const isFinale = currentMs >= 27800;
  const isPresenterActive = isIntro || isFinale;

  const badgeSpring = spring({ frame, fps, config: { damping: 18, mass: 0.8, stiffness: 110 } });
  if (!isPresenterActive) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex flex-col items-center justify-end overflow-hidden">
      {/* 1. Frosted Glass Backdrop Overlay */}
      <div className="absolute inset-0 backdrop-blur-2xl bg-white/35 pointer-events-none transition-all duration-500" />

      {/* 2. Soft Ambient Radial Light Halo */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[880px] h-[880px] rounded-full pointer-events-none blur-[130px]"
        style={{
          background: isFinale
            ? "radial-gradient(circle, rgba(16,185,129,0.32) 0%, rgba(14,165,233,0.2) 60%, transparent 80%)"
            : "radial-gradient(circle, rgba(245,158,11,0.28) 0%, rgba(244,63,94,0.2) 60%, transparent 80%)",
        }}
      />

      {/* 3. Apple Glass Scene Badge */}
      {isIntro && (
        <div
          className="absolute top-[13%] apple-glass flex items-center shadow-[0_30px_70px_rgba(245,158,11,0.25)] border-[5px] border-amber-300 z-40"
          style={{
            transform: `translateY(${(1 - badgeSpring) * -20}px) scale(${0.96 + badgeSpring * 0.04})`,
            padding: "26px 60px",
            borderRadius: 48,
            gap: 24,
          }}
        >
          <Repeat className="text-amber-500 animate-spin" style={{ width: 60, height: 60, animationDuration: "12s" }} />
          <span className="text-slate-950 font-black tracking-wider uppercase" style={{ fontSize: 44 }}>
            BREAKING PATTERNS
          </span>
        </div>
      )}

      {isFinale && (
        <div
          className="absolute top-[13%] apple-glass flex items-center shadow-[0_30px_70px_rgba(16,185,129,0.25)] border-[5px] border-emerald-300 z-40"
          style={{
            transform: `translateY(${(1 - badgeSpring) * -20}px) scale(${0.96 + badgeSpring * 0.04})`,
            padding: "26px 60px",
            borderRadius: 48,
            gap: 24,
          }}
        >
          <Zap className="text-emerald-500 animate-bounce" style={{ width: 60, height: 60 }} />
          <span className="text-slate-950 font-black tracking-wider uppercase" style={{ fontSize: 44 }}>
            ONE DIFFERENT MOVE
          </span>
        </div>
      )}

      {/* 4. Full-Body Character Animator */}
      <CharacterKeyframeAnimator
        currentMs={currentMs}
        keyframes={fullBodyKeyframes}
        baseWidth={860}
        baseHeight={1550}
        className="-mb-8"
      />
    </div>
  );
};
