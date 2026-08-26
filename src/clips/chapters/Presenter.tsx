import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CharacterKeyframeAnimator, KeyframePoint } from "../../components/CharacterKeyframeAnimator";
import { Scale, Sparkles, Hammer, Heart } from "lucide-react";

interface PresenterProps {
  currentMs: number;
}

export const ChaptersPresenter: React.FC<PresenterProps> = ({ currentMs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1. FULL BODY Keyframes (Intro Hook 0-7.2s & Outro Finale 42.3s-End)
  const fullBodyKeyframes: KeyframePoint[] = [
    // Intro Hook (0s - 7.2s): Full-body pointing — addressing comparison directly
    { timeMs: 0,     pose: "fullbody_pointing", scale: 0.95, y: 80, rotate: -1, opacity: 0 },
    { timeMs: 400,   pose: "fullbody_pointing", scale: 1.0,  y: 0,  rotate: 0,  opacity: 1 },
    { timeMs: 6600,  pose: "fullbody_pointing", scale: 1.035, y: -5, rotate: 1,  opacity: 1 },
    { timeMs: 7200,  pose: "fullbody_pointing", scale: 0.94, y: 90, rotate: 2,  opacity: 0 },

    // Outro Finale (42.3s - End): Full-body open hands — compassionate closing wisdom
    { timeMs: 42300, pose: "fullbody_open", scale: 0.95, y: 80, rotate: -1, opacity: 0 },
    { timeMs: 42900, pose: "fullbody_open", scale: 1.02, y: 0,  rotate: 0,  opacity: 1 },
    { timeMs: 46400, pose: "fullbody_open", scale: 1.05, y: -5, rotate: 0,  opacity: 1 },
  ];

  // 2. BUST CUTOUT Keyframes (Mid-video explanatory interlude 28.8s - 37.3s)
  const bustKeyframes: KeyframePoint[] = [
    // The Reframe (28.8s - 37.3s): Crossed arms — questioning comparison and focusing on building
    { timeMs: 28800, pose: "crossed", scale: 0.94, y: 80, rotate: 2,  opacity: 0 },
    { timeMs: 29400, pose: "crossed", scale: 1.04, y: 0,  rotate: 0,  opacity: 1 },
    { timeMs: 36700, pose: "crossed", scale: 1.065, y: -5, rotate: -1, opacity: 1 },
    { timeMs: 37300, pose: "crossed", scale: 0.94, y: 90, rotate: -2, opacity: 0 },
  ];

  const isIntro = currentMs >= 0 && currentMs < 7200;
  const isInterlude = currentMs >= 28800 && currentMs < 37300;
  const isOutro = currentMs >= 42300;

  const isPresenterActive = isIntro || isInterlude || isOutro;

  const badgeSpring = spring({ frame, fps, config: { damping: 18, mass: 0.8, stiffness: 110 } });

  if (!isPresenterActive) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex flex-col items-center justify-end overflow-hidden">
      {/* 1. Frosted Glass Backdrop Overlay */}
      <div className="absolute inset-0 backdrop-blur-2xl bg-white/35 pointer-events-none transition-all duration-500" />

      {/* 2. Soft Ambient Radial Light Halo behind character */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[850px] h-[850px] rounded-full pointer-events-none blur-[120px]"
        style={{
          background: isIntro
            ? "radial-gradient(circle, rgba(245,158,11,0.28) 0%, rgba(99,102,241,0.2) 60%, transparent 80%)"
            : isInterlude
            ? "radial-gradient(circle, rgba(14,165,233,0.32) 0%, rgba(99,102,241,0.22) 60%, transparent 80%)"
            : "radial-gradient(circle, rgba(16,185,129,0.32) 0%, rgba(245,158,11,0.22) 60%, transparent 80%)",
        }}
      />

      {/* 3. Apple Glass Scene Badges (top-anchored, large typography) */}
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
          <Scale className="text-amber-600" style={{ width: 60, height: 60 }} />
          <span className="text-slate-950 font-black tracking-wider uppercase" style={{ fontSize: 44 }}>
            THE COMPARISON TRAP
          </span>
        </div>
      )}

      {isInterlude && (
        <div
          className="absolute top-[13%] apple-glass flex items-center shadow-[0_30px_70px_rgba(14,165,233,0.26)] border-[5px] border-sky-300 z-40"
          style={{
            transform: `translateY(${(1 - badgeSpring) * -20}px) scale(${0.96 + badgeSpring * 0.04})`,
            padding: "26px 60px",
            borderRadius: 48,
            gap: 24,
          }}
        >
          <Hammer className="text-sky-600" style={{ width: 60, height: 60 }} />
          <span className="text-slate-950 font-black tracking-wider uppercase" style={{ fontSize: 44 }}>
            WHAT CAN YOU BUILD?
          </span>
        </div>
      )}

      {isOutro && (
        <div
          className="absolute top-[13%] apple-glass flex items-center shadow-[0_30px_70px_rgba(16,185,129,0.28)] border-[5px] border-emerald-300 z-40"
          style={{
            transform: `translateY(${(1 - badgeSpring) * -20}px) scale(${0.96 + badgeSpring * 0.04})`,
            padding: "26px 60px",
            borderRadius: 48,
            gap: 24,
          }}
        >
          <Heart className="text-emerald-600 animate-pulse" style={{ width: 60, height: 60 }} />
          <span className="text-slate-950 font-black tracking-wider uppercase" style={{ fontSize: 44 }}>
            WORTH LIVING
          </span>
        </div>
      )}

      {/* 4. Character Animation: Full Body for Intro/Outro, Bust for Interlude with organic eye blinks */}
      {(isIntro || isOutro) && (
        <CharacterKeyframeAnimator
          currentMs={currentMs}
          keyframes={fullBodyKeyframes}
          baseWidth={860}
          baseHeight={1550}
          className="-mb-8"
        />
      )}

      {isInterlude && (
        <CharacterKeyframeAnimator
          currentMs={currentMs}
          keyframes={bustKeyframes}
          baseWidth={780}
          baseHeight={1200}
          className="-mb-6"
        />
      )}
    </div>
  );
};
