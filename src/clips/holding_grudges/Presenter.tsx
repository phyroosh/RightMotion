import React from "react";
import { CharacterKeyframeAnimator, KeyframePoint } from "../../components/CharacterKeyframeAnimator";

interface PresenterProps {
  currentMs: number;
}

export const HoldingGrudgesPresenter: React.FC<PresenterProps> = ({ currentMs }) => {
  const keyframes: KeyframePoint[] = [
    // Intro hook: 0ms - 2100ms
    { timeMs: 0, pose: "fullbody_pointing", scale: 1.0, y: 70, rotate: -1, opacity: 0 },
    { timeMs: 250, pose: "fullbody_pointing", scale: 1.0, y: 0, rotate: 0, opacity: 1 },
    { timeMs: 1800, pose: "fullbody_pointing", scale: 1.02, y: -2, rotate: 0, opacity: 1 },
    { timeMs: 2100, pose: "fullbody_pointing", scale: 0.96, y: 80, rotate: 1, opacity: 0 },

    // Finale closure: 27000ms - 32280ms
    { timeMs: 27000, pose: "fullbody_open", scale: 0.96, y: 70, rotate: -1, opacity: 0 },
    { timeMs: 27350, pose: "fullbody_open", scale: 1.0, y: 0, rotate: 0, opacity: 1 },
    { timeMs: 31800, pose: "fullbody_open", scale: 1.03, y: -4, rotate: 0, opacity: 1 },
  ];

  const isIntro = currentMs >= 0 && currentMs < 2100;
  const isFinale = currentMs >= 27000;
  const isPresenterActive = isIntro || isFinale;

  if (!isPresenterActive) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex flex-col items-center justify-end overflow-hidden">
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[850px] h-[850px] rounded-full pointer-events-none blur-[120px]"
        style={{
          background: isFinale
            ? "radial-gradient(circle, rgba(245,158,11,0.25) 0%, rgba(14,165,233,0.18) 60%, transparent 80%)"
            : "radial-gradient(circle, rgba(244,63,94,0.25) 0%, rgba(99,102,241,0.18) 60%, transparent 80%)",
        }}
      />
      <CharacterKeyframeAnimator keyframes={keyframes} currentMs={currentMs} baseHeight={1480} />
    </div>
  );
};
