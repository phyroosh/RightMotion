import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CharacterKeyframeAnimator, KeyframePoint } from "../../components/CharacterKeyframeAnimator";
import { Brain, Sparkles } from "lucide-react";

interface PresenterProps {
  currentMs: number;
}

export const HoldingGrudgesPresenter: React.FC<PresenterProps> = ({ currentMs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const keyframes: KeyframePoint[] = [
    { timeMs: 0, pose: "fullbody_pointing", scale: 1.0, y: 80, rotate: -1, opacity: 0 },
    { timeMs: 350, pose: "fullbody_pointing", scale: 1.0, y: 0, rotate: 0, opacity: 1 },
    { timeMs: 4600, pose: "fullbody_pointing", scale: 1.03, y: -4, rotate: 0, opacity: 1 },
    { timeMs: 5300, pose: "fullbody_pointing", scale: 0.96, y: 90, rotate: 1, opacity: 0 },
    { timeMs: 26000, pose: "fullbody_open", scale: 0.96, y: 80, rotate: -1, opacity: 0 },
    { timeMs: 26600, pose: "fullbody_open", scale: 1.0, y: 0, rotate: 0, opacity: 1 },
    { timeMs: 34200, pose: "fullbody_open", scale: 1.04, y: -6, rotate: 0, opacity: 1 },
  ];

  const isIntro = currentMs >= 0 && currentMs < 5300;
  const isFinale = currentMs >= 26000;
  const isPresenterActive = isIntro || isFinale;

  const badgeSpring = spring({ frame, fps, config: { damping: 18, mass: 0.8, stiffness: 110 } });
  if (!isPresenterActive) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex flex-col items-center justify-end overflow-hidden">
      <div className="absolute inset-0 backdrop-blur-2xl bg-white/35 pointer-events-none" />
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[850px] h-[850px] rounded-full pointer-events-none blur-[120px]"
        style={{
          background: isFinale
            ? "radial-gradient(circle, rgba(16,185,129,0.35) 0%, rgba(14,165,233,0.2) 60%, transparent 80%)"
            : "radial-gradient(circle, rgba(244,63,94,0.35) 0%, rgba(99,102,241,0.2) 60%, transparent 80%)",
        }}
      />
      {isIntro && (
        <div
          className="absolute top-[13%] apple-glass flex items-center shadow-[0_30px_70px_rgba(0,113,227,0.18)] border-[5px] border-white z-40"
          style={{
            transform: `translateY(${(1 - badgeSpring) * -20}px) scale(${0.96 + badgeSpring * 0.04})`,
            padding: "24px 54px",
            borderRadius: 44,
            gap: 20,
          }}
        >
          <Brain className="text-[#0071e3]" style={{ width: 52, height: 52 }} />
          <span className="text-slate-950 font-black tracking-wider uppercase" style={{ fontSize: 38 }}>
            THE REPLAY LOOP
          </span>
        </div>
      )}
      <CharacterKeyframeAnimator keyframes={keyframes} currentMs={currentMs} baseHeight={1550} />
    </div>
  );
};
