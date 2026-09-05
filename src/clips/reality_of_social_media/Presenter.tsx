import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CharacterKeyframeAnimator, KeyframePoint } from "../../components/CharacterKeyframeAnimator";
import { Zap } from "lucide-react";

interface PresenterProps {
  currentMs: number;
}

export const RealityOfSocialMediaPresenter: React.FC<PresenterProps> = ({ currentMs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const keyframes: KeyframePoint[] = [
    { timeMs: 0, pose: "fullbody_pointing", scale: 1.0, y: 80, rotate: -1, opacity: 0 },
    { timeMs: 350, pose: "fullbody_pointing", scale: 1.0, y: 0, rotate: 0, opacity: 1 },
    { timeMs: 2900, pose: "fullbody_pointing", scale: 1.03, y: -4, rotate: 0, opacity: 1 },
    { timeMs: 3500, pose: "fullbody_pointing", scale: 0.96, y: 90, rotate: 1, opacity: 0 },
    { timeMs: 24833, pose: "fullbody_open", scale: 0.96, y: 80, rotate: -1, opacity: 0 },
    { timeMs: 25233, pose: "fullbody_open", scale: 1.0, y: 0, rotate: 0, opacity: 1 },
    { timeMs: 27320, pose: "fullbody_open", scale: 1.04, y: -6, rotate: 0, opacity: 1 },
  ];

  const isIntro = false;
  const isFinale = currentMs >= 24833;
  const isPresenterActive = isIntro || isFinale;

  const badgeSpring = spring({ frame, fps, config: { damping: 18, mass: 0.8, stiffness: 110 } });
  if (!isPresenterActive) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex flex-col items-center justify-end overflow-hidden">
      <CharacterKeyframeAnimator keyframes={keyframes} currentMs={currentMs} baseHeight={1550} />
    </div>
  );
};
