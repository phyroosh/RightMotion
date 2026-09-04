import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { CharacterKeyframeAnimator, KeyframePoint } from "../../components/CharacterKeyframeAnimator";

interface PresenterProps {
  currentMs: number;
}

export const DiagramYourLoopPresenter: React.FC<PresenterProps> = ({ currentMs }) => {
  const keyframes: KeyframePoint[] = [
    // Intro: Judy Fullbody Pointing asking the hook (0 - 3950ms)
    { timeMs: 0, pose: "fullbody_pointing", scale: 0.96, y: 70, rotate: -1, opacity: 0 },
    { timeMs: 300, pose: "fullbody_pointing", scale: 1.0, y: 0, rotate: 0, opacity: 1 },
    { timeMs: 3500, pose: "fullbody_pointing", scale: 1.03, y: -4, rotate: 0, opacity: 1 },
    { timeMs: 3950, pose: "fullbody_pointing", scale: 0.96, y: 80, rotate: 1, opacity: 0 },

    // Outro Finale: Judy Fullbody Open delivering the physical anchor (25200ms - 28200ms)
    { timeMs: 25200, pose: "fullbody_open", scale: 0.96, y: 70, rotate: -1, opacity: 0 },
    { timeMs: 25600, pose: "fullbody_open", scale: 1.0, y: 0, rotate: 0, opacity: 1 },
    { timeMs: 28200, pose: "fullbody_open", scale: 1.03, y: -6, rotate: 0, opacity: 1 },
  ];

  const isIntro = currentMs >= 0 && currentMs < 3950;
  const isFinale = currentMs >= 25200;
  const isPresenterActive = isIntro || isFinale;

  if (!isPresenterActive) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex flex-col items-center justify-end overflow-hidden">
      <CharacterKeyframeAnimator keyframes={keyframes} currentMs={currentMs} baseHeight={1550} />
    </div>
  );
};
