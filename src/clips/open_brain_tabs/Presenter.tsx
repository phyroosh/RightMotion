import React from "react";
import { useVideoConfig } from "remotion";
import { GlossyJudyIntro } from "../../components/pure_graphics";

interface PresenterProps {
  currentMs: number;
}

/**
 * 🎬 OpenBrainTabsPresenter
 * Mounts the mandatory Judy Intro pop-up during the opening problem hook (first ~2.5s).
 * Framed close-up and intimate to connect with viewers on small mobile screens.
 */
export const OpenBrainTabsPresenter: React.FC<PresenterProps> = () => {
  const { fps } = useVideoConfig();
  const exitFrame = Math.round(2.5 * fps);

  return (
    <GlossyJudyIntro
      startFrame={0}
      exitFrame={exitFrame}
      glowColor="rgba(244, 63, 94, 0.22)"
      pose="character_pointing.png"
      reflectionOpacity={0.36}
      baseHeight={1280}
      position="right"
    />
  );
};
