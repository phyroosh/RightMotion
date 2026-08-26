import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CharacterKeyframeAnimator, KeyframePoint } from "../../components/CharacterKeyframeAnimator";
import { Flame, ShieldCheck, Sparkles, Brain, Award } from "lucide-react";

interface PresenterProps {
  currentMs: number;
}

export const GogginsPresenter: React.FC<PresenterProps> = ({ currentMs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Multi-pose keyframe tracks for Goggins Shorts (47.14s total)
  const keyframes: KeyframePoint[] = [
    // 1. Intro Hook (0s - 3.2s): Pointing Pose
    { timeMs: 0, pose: "pointing", scale: 0.94, y: 80, rotate: -2, opacity: 0 },
    { timeMs: 300, pose: "pointing", scale: 1.0, y: 0, rotate: 0, opacity: 1 },
    { timeMs: 2800, pose: "pointing", scale: 1.02, y: -4, rotate: 1, opacity: 1 },
    { timeMs: 3300, pose: "pointing", scale: 0.95, y: 90, rotate: 2, opacity: 0 },

    // 2. Reality Pivot (9.6s - 12.3s): Arms Crossed (Analytical & Skeptical)
    { timeMs: 9600, pose: "crossed", scale: 0.94, y: 90, rotate: 2, opacity: 0 },
    { timeMs: 10100, pose: "crossed", scale: 1.04, y: 0, rotate: 0, opacity: 1 },
    { timeMs: 11900, pose: "crossed", scale: 1.06, y: -5, rotate: -1, opacity: 1 },
    { timeMs: 12400, pose: "crossed", scale: 0.95, y: 90, rotate: -2, opacity: 0 },

    // 3. Core Evidence Realization (34.9s - 40.7s): Open Palms (Clarity & Perspective)
    { timeMs: 34900, pose: "open", scale: 0.94, y: 80, rotate: -2, opacity: 0 },
    { timeMs: 35500, pose: "open", scale: 1.05, y: 0, rotate: 0, opacity: 1 },
    { timeMs: 40100, pose: "open", scale: 1.07, y: -5, rotate: 1, opacity: 1 },
    { timeMs: 40700, pose: "open", scale: 0.95, y: 80, rotate: 2, opacity: 0 },

    // 4. Empowering Finale (43.4s - End): Open Palms (Deep empathy & victory)
    { timeMs: 43400, pose: "open", scale: 0.95, y: 70, rotate: 1, opacity: 0 },
    { timeMs: 44000, pose: "open", scale: 1.06, y: 0, rotate: 0, opacity: 1 },
    { timeMs: 47200, pose: "open", scale: 1.08, y: -4, rotate: 0, opacity: 1 },
  ];

  const isIntro = currentMs >= 0 && currentMs < 3300;
  const isPivot = currentMs >= 9600 && currentMs < 12400;
  const isEvidence = currentMs >= 34900 && currentMs < 40700;
  const isFinale = currentMs >= 43400;

  const isPresenterActive = isIntro || isPivot || isEvidence || isFinale;

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
            ? "radial-gradient(circle, rgba(245,158,11,0.32) 0%, rgba(16,185,129,0.22) 60%, transparent 80%)"
            : isEvidence
            ? "radial-gradient(circle, rgba(0,113,227,0.32) 0%, rgba(99,102,241,0.2) 60%, transparent 80%)"
            : isPivot
            ? "radial-gradient(circle, rgba(99,102,241,0.3) 0%, rgba(244,63,94,0.2) 60%, transparent 80%)"
            : "radial-gradient(circle, rgba(245,158,11,0.35) 0%, rgba(0,113,227,0.2) 60%, transparent 80%)",
        }}
      />

      {/* 3. Floating Apple Glass Badge (High Contrast for Mobile / 480p) */}
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
          <Flame className="text-amber-500 animate-bounce" style={{ width: 60, height: 60 }} />
          <span className="text-slate-950 font-black tracking-wider uppercase" style={{ fontSize: 44 }}>
            THE ADRENALINE MYTH
          </span>
        </div>
      )}

      {isPivot && (
        <div
          className="absolute top-[13%] apple-glass flex items-center shadow-[0_30px_70px_rgba(99,102,241,0.22)] border-[5px] border-indigo-300 z-40"
          style={{
            transform: `translateY(${(1 - badgeSpring) * -20}px) scale(${0.96 + badgeSpring * 0.04})`,
            padding: "26px 60px",
            borderRadius: 48,
            gap: 24,
          }}
        >
          <Brain className="text-indigo-600 animate-pulse" style={{ width: 60, height: 60 }} />
          <span className="text-slate-950 font-black tracking-wider uppercase" style={{ fontSize: 44 }}>
            THE TRUE PSYCHOLOGY
          </span>
        </div>
      )}

      {isEvidence && (
        <div
          className="absolute top-[13%] apple-glass flex items-center shadow-[0_30px_70px_rgba(0,113,227,0.24)] border-[5px] border-sky-300 z-40"
          style={{
            transform: `translateY(${(1 - badgeSpring) * -20}px) scale(${0.96 + badgeSpring * 0.04})`,
            padding: "26px 60px",
            borderRadius: 48,
            gap: 24,
          }}
        >
          <ShieldCheck className="text-sky-600" style={{ width: 60, height: 60 }} />
          <span className="text-slate-950 font-black tracking-wider uppercase" style={{ fontSize: 44 }}>
            EVIDENCE OVER FEARLESSNESS
          </span>
        </div>
      )}

      {isFinale && (
        <div
          className="absolute top-[13%] apple-glass flex items-center shadow-[0_30px_70px_rgba(245,158,11,0.28)] border-[5px] border-amber-400 z-40"
          style={{
            transform: `translateY(${(1 - badgeSpring) * -20}px) scale(${0.96 + badgeSpring * 0.04})`,
            padding: "26px 60px",
            borderRadius: 48,
            gap: 24,
          }}
        >
          <Award className="text-amber-500 animate-pulse" style={{ width: 60, height: 60 }} />
          <span className="text-slate-950 font-black tracking-wider uppercase" style={{ fontSize: 44 }}>
            YOU CAN HANDLE TODAY
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
