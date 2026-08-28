import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CharacterKeyframeAnimator, KeyframePoint } from "../../components/CharacterKeyframeAnimator";
import { Sparkles, Brain, ShieldCheck, HeartHandshake, Compass } from "lucide-react";

interface PresenterProps {
  currentMs: number;
}

export const TeenagePresenter: React.FC<PresenterProps> = ({ currentMs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Full-body keyframes for Intro (0s - 5.2s)
  const fullBodyIntroKeyframes: KeyframePoint[] = [
    { timeMs: 0, pose: "fullbody_pointing", scale: 0.94, y: 80, rotate: -2, opacity: 0 },
    { timeMs: 400, pose: "fullbody_pointing", scale: 1.0, y: 0, rotate: 0, opacity: 1 },
    { timeMs: 4400, pose: "fullbody_pointing", scale: 1.03, y: -5, rotate: 1, opacity: 1 },
    { timeMs: 5200, pose: "fullbody_pointing", scale: 0.95, y: 100, rotate: 2, opacity: 0 },
  ];

  // Mid-video explanatory bust cutout for Reality Check (22.4s - 27.1s)
  const bustMidKeyframes: KeyframePoint[] = [
    { timeMs: 22400, pose: "crossed", scale: 0.94, y: 90, rotate: 2, opacity: 0 },
    { timeMs: 22900, pose: "crossed", scale: 1.04, y: 0, rotate: 0, opacity: 1 },
    { timeMs: 26300, pose: "crossed", scale: 1.06, y: -4, rotate: -1, opacity: 1 },
    { timeMs: 27120, pose: "crossed", scale: 0.95, y: 90, rotate: -2, opacity: 0 },
  ];

  // Full-body keyframes for Emotional Finale (32.0s - 38.3s)
  const fullBodyFinaleKeyframes: KeyframePoint[] = [
    { timeMs: 32000, pose: "fullbody_open", scale: 0.94, y: 80, rotate: -2, opacity: 0 },
    { timeMs: 32600, pose: "fullbody_open", scale: 1.04, y: 0, rotate: 0, opacity: 1 },
    { timeMs: 37500, pose: "fullbody_open", scale: 1.08, y: -6, rotate: 0, opacity: 1 },
    { timeMs: 38300, pose: "fullbody_open", scale: 1.08, y: -6, rotate: 0, opacity: 1 },
  ];

  const isIntro = currentMs >= 0 && currentMs < 5200;
  const isMidReality = currentMs >= 22400 && currentMs < 27120;
  const isFinale = currentMs >= 32000;

  const isPresenterActive = isIntro || isMidReality || isFinale;

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
            ? "radial-gradient(circle, rgba(16,185,129,0.32) 0%, rgba(14,165,233,0.2) 60%, transparent 80%)"
            : isMidReality
            ? "radial-gradient(circle, rgba(244,63,94,0.32) 0%, rgba(168,85,247,0.2) 60%, transparent 80%)"
            : "radial-gradient(circle, rgba(99,102,241,0.32) 0%, rgba(14,165,233,0.2) 60%, transparent 80%)",
        }}
      />

      {/* 3. Floating Apple Glass Badge */}
      {isIntro && (
        <div
          className="absolute top-[13%] apple-glass flex items-center shadow-[0_30px_70px_rgba(99,102,241,0.25)] border-[5px] border-indigo-400 z-40"
          style={{
            transform: `translateY(${(1 - badgeSpring) * -20}px) scale(${0.96 + badgeSpring * 0.04})`,
            padding: "26px 60px",
            borderRadius: 48,
            gap: 24,
          }}
        >
          <Sparkles className="text-indigo-500 animate-spin" style={{ width: 60, height: 60, animationDuration: "8s" }} />
          <span className="text-slate-950 font-black tracking-wider uppercase" style={{ fontSize: 44 }}>
            THE TEENAGE BRAIN
          </span>
        </div>
      )}

      {isMidReality && (
        <div
          className="absolute top-[13%] apple-glass flex items-center shadow-[0_30px_70px_rgba(244,63,94,0.25)] border-[5px] border-rose-400 z-40"
          style={{
            transform: `translateY(${(1 - badgeSpring) * -20}px) scale(${0.96 + badgeSpring * 0.04})`,
            padding: "26px 60px",
            borderRadius: 48,
            gap: 24,
          }}
        >
          <ShieldCheck className="text-rose-500" style={{ width: 60, height: 60 }} />
          <span className="text-slate-950 font-black tracking-wider uppercase" style={{ fontSize: 44 }}>
            NORMAL HUMAN BIOLOGY
          </span>
        </div>
      )}

      {isFinale && (
        <div
          className="absolute top-[13%] apple-glass flex items-center shadow-[0_30px_70px_rgba(16,185,129,0.25)] border-[5px] border-emerald-400 z-40"
          style={{
            transform: `translateY(${(1 - badgeSpring) * -20}px) scale(${0.96 + badgeSpring * 0.04})`,
            padding: "26px 60px",
            borderRadius: 48,
            gap: 24,
          }}
        >
          <HeartHandshake className="text-emerald-500 animate-bounce" style={{ width: 60, height: 60 }} />
          <span className="text-slate-950 font-black tracking-wider uppercase" style={{ fontSize: 44 }}>
            YOU'RE STILL BECOMING YOU
          </span>
        </div>
      )}

      {/* 4. Animated Character: Full Body for Intro & Finale, Bust for Mid-Video */}
      {isIntro && (
        <CharacterKeyframeAnimator
          currentMs={currentMs}
          keyframes={fullBodyIntroKeyframes}
          baseWidth={900}
          baseHeight={1550}
          className="-mb-8"
        />
      )}

      {isMidReality && (
        <CharacterKeyframeAnimator
          currentMs={currentMs}
          keyframes={bustMidKeyframes}
          baseWidth={780}
          baseHeight={1200}
          className="-mb-6"
        />
      )}

      {isFinale && (
        <CharacterKeyframeAnimator
          currentMs={currentMs}
          keyframes={fullBodyFinaleKeyframes}
          baseWidth={900}
          baseHeight={1550}
          className="-mb-8"
        />
      )}
    </div>
  );
};
