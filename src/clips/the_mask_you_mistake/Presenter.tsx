import React from "react";
import { GlossyJudyIntro } from "../../components/pure_graphics";

interface PresenterProps {
  currentMs: number;
}

/**
 * 🎬 TheMaskYouMistakePresenter
 * Mounts the mandatory Judy Intro pop-up during the opening problem hook (0.0s - 3.8s / Frames 0 - 110).
 * Backed by an atmospheric radial aura and wet-floor mirror reflection, then gently glides out.
 */
export const TheMaskYouMistakePresenter: React.FC<PresenterProps> = () => {
  return (
    <GlossyJudyIntro
      startFrame={0}
      exitFrame={110}
      glowColor="rgba(244, 63, 94, 0.22)"
      pose="character_pointing.png"
      reflectionOpacity={0.36}
      baseHeight={1040}
    />
  );
};
