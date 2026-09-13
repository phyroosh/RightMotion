import React from "react";
import { GlossyJudyIntro } from "../../components/pure_graphics";

interface PresenterProps {
  currentMs: number;
}

/**
 * 🎬 HowCortisolWorksPresenter
 * Mounts the mandatory Judy Intro pop-up during the opening problem hook (first ~2.5s / Frames 0 - 75).
 * Framed close-up and intimate to connect with viewers on small mobile screens.
 */
export const HowCortisolWorksPresenter: React.FC<PresenterProps> = () => {
  return (
    <GlossyJudyIntro
      startFrame={0}
      exitFrame={150}
      glowColor="rgba(244, 63, 94, 0.22)"
      pose="character_pointing.png"
      reflectionOpacity={0.36}
      baseHeight={1160}
      position="right"
    />
  );
};
