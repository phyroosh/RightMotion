import React from "react";
import { CharacterKeyframeAnimator, KeyframePoint } from "../../components/CharacterKeyframeAnimator";

interface PresenterProps {
  currentMs: number;
}

export const PushingAwayPresenter: React.FC<PresenterProps> = ({ currentMs }) => {
  const keyframes: KeyframePoint[] = [
    // Intro Hook: 0ms - 4300ms
    { timeMs: 0, pose: "fullbody_pointing", scale: 1.0, y: 70, rotate: -1, opacity: 0 },
    { timeMs: 250, pose: "fullbody_pointing", scale: 1.0, y: 0, rotate: 0, opacity: 1 },
    { timeMs: 3800, pose: "fullbody_pointing", scale: 1.02, y: -2, rotate: 0, opacity: 1 },
    { timeMs: 4300, pose: "fullbody_pointing", scale: 0.96, y: 80, rotate: 1, opacity: 0 },

    // Finale Closure: 32900ms - 36700ms
    { timeMs: 32900, pose: "fullbody_open", scale: 0.96, y: 70, rotate: -1, opacity: 0 },
    { timeMs: 33300, pose: "fullbody_open", scale: 1.0, y: 0, rotate: 0, opacity: 1 },
    { timeMs: 36400, pose: "fullbody_open", scale: 1.03, y: -3, rotate: 0, opacity: 1 },
  ];

  const isIntro = currentMs >= 0 && currentMs < 4300;
  const isFinale = currentMs >= 32900;
  const isPresenterActive = isIntro || isFinale;

  if (!isPresenterActive) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex flex-col items-center justify-end overflow-hidden">
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[850px] h-[850px] rounded-full pointer-events-none blur-[120px]"
        style={{
          background: isFinale
            ? "radial-gradient(circle, rgba(245,158,11,0.24) 0%, rgba(16,185,129,0.18) 60%, transparent 80%)"
            : "radial-gradient(circle, rgba(244,63,94,0.22) 0%, rgba(0,113,227,0.18) 60%, transparent 80%)",
        }}
      />
      <CharacterKeyframeAnimator keyframes={keyframes} currentMs={currentMs} baseHeight={1480} />
    </div>
  );
};
