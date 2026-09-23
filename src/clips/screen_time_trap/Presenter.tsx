import React from "react";
import { GlossyJudyIntro } from "../../components/pure_graphics";

interface PresenterProps {
  currentMs: number;
}

/**
 * 🎬 ScreenTimeTrapPresenter
 * Mounts the mandatory Judy Intro pop-up during the opening problem hook (first ~2.5s / Frames 0 - 75).
 * Framed close-up and intimate to connect with viewers on small mobile screens.
 */
export const ScreenTimeTrapPresenter: React.FC<PresenterProps> = () => {
  return (
    <GlossyJudyIntro
      startFrame={0}
      exitFrame={75}
      glowColor="rgba(2, 132, 199, 0.22)"
      pose="character_pointing.png"
      reflectionOpacity={0.36}
      baseHeight={1280}
      position="right"
    />
  );
};
