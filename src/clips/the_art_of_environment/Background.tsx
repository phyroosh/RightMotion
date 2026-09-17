import React from "react";
import { useCurrentFrame } from "remotion";
import { UniversalBackground } from "../../components/backgrounds";

export const TheArtOfEnvironmentBackground: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#030712]">
      {frame >= 0 && frame < 472 && (
        <UniversalBackground
          assetId="dark_matte_spotlight_01"
          semanticRole="cinematic_surface"
          cropStrategy="center_focal"
          motion="slow_zoom_in"
          motionScaleDelta={1.04}
          opacity={1.0}
          transitionIn={{"type": "fade", "durationFrames": 10}}
          
          sceneStartFrame={0}
          sceneDurationFrames={472}
        />
      )}
      {frame >= 472 && frame < 1214 && (
        <UniversalBackground
          assetId="dark_matte_spotlight_01"
          semanticRole="cinematic_surface"
          cropStrategy="center_focal"
          motion="static"
          motionScaleDelta={1.0}
          opacity={1.0}
          
          
          sceneStartFrame={472}
          sceneDurationFrames={742}
        />
      )}
      {frame >= 1214 && frame < 1686 && (
        <UniversalBackground
          assetId="paper_warm_tactile_02"
          semanticRole="tactile_stage"
          cropStrategy="center_focal"
          motion="slow_zoom_in"
          motionScaleDelta={1.04}
          opacity={1.0}
          transitionIn={{"type": "dissolve", "durationFrames": 16}}
          
          sceneStartFrame={1214}
          sceneDurationFrames={472}
        />
      )}
    </div>
  );
};
