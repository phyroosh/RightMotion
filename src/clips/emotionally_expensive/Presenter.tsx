import React from "react";
import { useVideoConfig } from "remotion";
import { GlossyJudyIntro } from "../../components/pure_graphics";

interface PresenterProps {
  currentMs: number;
}

/**
 * 🎬 EmotionallyExpensivePresenter
 * Mounts the mandatory Judy Intro pop-up during the opening problem hook (first ~2.5s / Frames 0 - 150 at 60fps).
 * Framed close-up and intimate to connect with viewers on small mobile screens.
 */
export const EmotionallyExpensivePresenter: React.FC<PresenterProps> = () => {
  const { fps } = useVideoConfig();
  const exitFrame = Math.round(fps * 2.5);

  return (
    <GlossyJudyIntro
      startFrame={0}
      exitFrame={exitFrame}
      glowColor="rgba(244, 63, 94, 0.18)"
      pose="character_pointing.png"
      reflectionOpacity={0.28}
      baseHeight={1280}
      position="right"
    />
  );
};
