import React from "react";
import { GlossyJudyIntro } from "../../components/pure_graphics";

interface PresenterProps {
  currentMs: number;
}

/**
 * 🎬 TrainYourBrainPresenter
 * Mounts the mandatory Judy Intro pop-up during the opening problem hook (0.0s - 3.8s / Frames 0 - 110).
 * Backed by an atmospheric radial aura and wet-floor mirror reflection, then gently glides out.
 */
export const TrainYourBrainPresenter: React.FC<PresenterProps> = () => {
  return (
    <GlossyJudyIntro
      startFrame={0}
      exitFrame={95}
      glowColor="rgba(245, 158, 11, 0.25)"
      pose="character_crossed.png"
      baseHeight={1480}
      theme="light"
    />
  );
};
