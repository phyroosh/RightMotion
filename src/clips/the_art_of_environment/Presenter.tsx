import React from "react";
import { GlossyJudyIntro } from "../../components/pure_graphics";

interface PresenterProps {
  currentMs: number;
}

/**
 * 🎬 TheArtOfEnvironmentPresenter
 * Mounts the mandatory Judy Intro pop-up during the opening problem hook (first ~2.5s / Frames 0 - 150 @ 60fps).
 * Framed close-up and intimate to connect with viewers on small mobile screens.
 */
export const TheArtOfEnvironmentPresenter: React.FC<PresenterProps> = () => {
  return (
    <GlossyJudyIntro
      startFrame={0}
      exitFrame={150}
      glowColor="rgba(56, 189, 248, 0.22)"
      pose="character_pointing.png"
      reflectionOpacity={0.36}
      baseHeight={1300}
      position="right"
    />
  );
};
