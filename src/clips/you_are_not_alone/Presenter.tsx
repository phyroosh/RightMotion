import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CharacterKeyframeAnimator, KeyframePoint } from "../../components/CharacterKeyframeAnimator";
import { Compass, HeartHandshake } from "lucide-react";

interface PresenterProps {
  currentMs: number;
}

export const YouAreNotAlonePresenter: React.FC<PresenterProps> = ({ currentMs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Keyframe tracks for A-Roll Presenter (Judy)
  const keyframes: KeyframePoint[] = [
    // 1. Opening Hook (0ms - 3,500ms): Questioning, compassionate open palms
    { timeMs: 0, pose: "fullbody_open", scale: 0.96, y: 80, rotate: -1, opacity: 0 },
    { timeMs: 320, pose: "fullbody_open", scale: 1.0, y: 0, rotate: 0, opacity: 1 },
    { timeMs: 2900, pose: "fullbody_open", scale: 1.02, y: -4, rotate: 0, opacity: 1 },
    { timeMs: 3500, pose: "fullbody_open", scale: 0.95, y: 90, rotate: 1, opacity: 0 },

    // 2. Outro Finale (25,400ms - End): Grounding, hopeful re-entry
    { timeMs: 25400, pose: "fullbody_open", scale: 0.95, y: 80, rotate: -1, opacity: 0 },
    { timeMs: 25800, pose: "fullbody_open", scale: 1.0, y: 0, rotate: 0, opacity: 1 },
    { timeMs: 27700, pose: "fullbody_open", scale: 1.03, y: -4, rotate: 0, opacity: 1 },
  ];

  const isIntro = currentMs >= 0 && currentMs < 3500;
  const isFinale = currentMs >= 25400;
  const isPresenterActive = isIntro || isFinale;

  const badgeSpring = spring({ frame, fps, config: { damping: 18, mass: 0.8, stiffness: 110 } });

  if (!isPresenterActive) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex flex-col items-center justify-end overflow-hidden">
      {/* Frosted Glass Backdrop Overlay */}
      <div className="absolute inset-0 backdrop-blur-2xl bg-white/30 pointer-events-none transition-all duration-500" />

      {/* Soft Ambient Radial Light Halo */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[850px] h-[850px] rounded-full pointer-events-none blur-[120px]"
        style={{
          background: isFinale
            ? "radial-gradient(circle, rgba(16,185,129,0.30) 0%, rgba(14,165,233,0.18) 60%, transparent 80%)"
            : "radial-gradient(circle, rgba(245,158,11,0.28) 0%, rgba(99,102,241,0.16) 60%, transparent 80%)",
        }}
      />

      {/* Floating Apple Glass Badges */}
      {isIntro && (
        <div
          className="absolute top-[13%] apple-glass flex items-center shadow-[0_30px_70px_rgba(245,158,11,0.25)] border-[5px] border-white z-40"
          style={{
            transform: `translateY(${(1 - badgeSpring) * -20}px) scale(${0.96 + badgeSpring * 0.04})`,
            padding: "24px 52px",
            borderRadius: 48,
            gap: 20,
          }}
        >
          <Compass className="text-amber-500 shrink-0" style={{ width: 56, height: 56 }} />
          <span className="text-slate-950 font-black tracking-wider uppercase" style={{ fontSize: 40 }}>
            WHEN LIFE FEELS HEAVY
          </span>
        </div>
      )}

      {isFinale && (
        <div
          className="absolute top-[13%] apple-glass flex items-center shadow-[0_30px_70px_rgba(16,185,129,0.25)] border-[5px] border-emerald-300 z-40"
          style={{
            transform: `translateY(${(1 - badgeSpring) * -20}px) scale(${0.96 + badgeSpring * 0.04})`,
            padding: "24px 52px",
            borderRadius: 48,
            gap: 20,
          }}
        >
          <HeartHandshake className="text-emerald-500 shrink-0" style={{ width: 56, height: 56 }} />
          <span className="text-slate-950 font-black tracking-wider uppercase" style={{ fontSize: 40 }}>
            YOU ARE NOT ALONE
          </span>
        </div>
      )}

      {/* Character Presenter */}
      <CharacterKeyframeAnimator keyframes={keyframes} currentMs={currentMs} baseHeight={1550} />
    </div>
  );
};
