import React from "react";
import { useCurrentFrame } from "remotion";
import { UniversalBackground } from "../../components/backgrounds";

export const TheFocusParadoxBackground: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#030712]">
      {frame >= 0 && frame < 410 && (
        <UniversalBackground
          assetId="dark_matte_spotlight_01"
          semanticRole="cinematic_surface"
          cropStrategy="center_focal"
          motion="subtle_drift"
          motionScaleDelta={1.03}
          opacity={1.0}
          transitionIn={{"type": "fade", "durationFrames": 10}}
          
          sceneStartFrame={0}
          sceneDurationFrames={410}
        />
      )}
      {frame >= 410 && frame < 1054 && (
        <UniversalBackground
          assetId="universal_texture_41"
          semanticRole="cinematic_surface"
          cropStrategy="center_focal"
          motion="static"
          motionScaleDelta={1.0}
          opacity={1.0}
          transitionIn={{"type": "dissolve", "durationFrames": 16}}
          
          sceneStartFrame={410}
          sceneDurationFrames={644}
        />
      )}
      {frame >= 1054 && frame < 1464 && (
        <UniversalBackground
          assetId="paper_warm_tactile_02"
          semanticRole="tactile_stage"
          cropStrategy="center_focal"
          motion="slow_zoom_in"
          motionScaleDelta={1.04}
          opacity={1.0}
          transitionIn={{"type": "dissolve", "durationFrames": 16}}
          
          sceneStartFrame={1054}
          sceneDurationFrames={410}
        />
      )}
    </div>
  );
};
