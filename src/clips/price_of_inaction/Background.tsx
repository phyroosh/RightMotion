import React from "react";
import { useCurrentFrame } from "remotion";
import { UniversalBackground } from "../../components/backgrounds";

export const PriceOfInactionBackground: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#030712]">
      {frame >= 0 && frame < 275 && (
        <UniversalBackground
          assetId="dark_matte_spotlight_01"
          semanticRole="cinematic_surface"
          cropStrategy="center_focal"
          motion="slow_zoom_in"
          motionScaleDelta={1.04}
          opacity={1.0}
          transitionIn={{"type": "fade", "durationFrames": 10}}
          
          sceneStartFrame={0}
          sceneDurationFrames={275}
        />
      )}
      {frame >= 275 && frame < 707 && (
        <UniversalBackground
          assetId="paper_warm_tactile_02"
          semanticRole="tactile_stage"
          cropStrategy="center_focal"
          motion="static"
          motionScaleDelta={1.0}
          opacity={1.0}
          transitionIn={{"type": "dissolve", "durationFrames": 16}}
          
          sceneStartFrame={275}
          sceneDurationFrames={432}
        />
      )}
      {frame >= 707 && frame < 982 && (
        <UniversalBackground
          assetId="dark_matte_spotlight_01"
          semanticRole="cinematic_surface"
          cropStrategy="center_focal"
          motion="slow_zoom_in"
          motionScaleDelta={1.04}
          opacity={1.0}
          transitionIn={{"type": "dissolve", "durationFrames": 16}}
          
          sceneStartFrame={707}
          sceneDurationFrames={275}
        />
      )}
    </div>
  );
};
