import React from "react";
import { useCurrentFrame } from "remotion";
import { GlossyJudyIntro } from "../../components/pure_graphics";

interface PresenterProps {
  currentMs: number;
}

/**
 * 🎬 SmallCompromisesPresenter
 * Grounded Judy presenter:
 * 1. Opening hook intro (0 to 75): intimate close-up alongside hero illustration
 * 2. Decisive closing resolution (742 to 884): grounded authoritative stance delivering the final takeaway
 */
export const SmallCompromisesPresenter: React.FC<PresenterProps> = () => {
  const frame = useCurrentFrame();

  return (
    <>
      {frame < 165 && (
        <GlossyJudyIntro
          startFrame={0}
          exitFrame={150}
          glowColor="rgba(244, 63, 94, 0.22)"
          pose="character_pointing.png"
          reflectionOpacity={0.36}
          baseHeight={1320}
          position="right"
        />
      )}

      {frame >= 1470 && (
        <GlossyJudyIntro
          startFrame={1480}
          exitFrame={1816}
          glowColor="rgba(16, 185, 129, 0.22)"
          pose="character_crossed.png"
          reflectionOpacity={0.36}
          baseHeight={1180}
          position="right"
        />
      )}
    </>
  );
};

