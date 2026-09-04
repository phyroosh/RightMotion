import React from "react";
import { staticFile } from "remotion";
import { FacecamFrame, ZoomBeat, SlideBeat } from "../../components/facecam";

export const BuildToScaleTHFFacecamLayer: React.FC = () => {
  // 5-Stage Pro-Editor Camera Punch-In Keyframes
  const zoomBeats: ZoomBeat[] = [
    // 1. Hook (0s - 8.8s): Tight 1.15x close-up for high retention hook
    { startFrame: 0, endFrame: 265, scale: 1.14, originX: 50, originY: 30 },
    // 2. Series & Brand (8.8s - 18.0s): 1.0x wide framing to display series branding
    { startFrame: 265, endFrame: 540, scale: 1.0, originX: 50, originY: 34 },
    // 3. Market Gap (18.0s - 27.5s): 1.16x punch-in for story observation
    { startFrame: 540, endFrame: 825, scale: 1.16, originX: 50, originY: 30 },
    // 4. Scaling (27.5s - 36.2s): 1.04x wide -> 1.20x punch-in on ₹250 Cr valuation
    { startFrame: 825, endFrame: 1020, scale: 1.04, originX: 50, originY: 34 },
    { startFrame: 1020, endFrame: 1085, scale: 1.20, originX: 50, originY: 28 },
    // 5. Golden Rule & Outro (36.2s - 44.0s): 1.16x punch-in on core lesson
    { startFrame: 1085, endFrame: 1280, scale: 1.16, originX: 50, originY: 30 },
    { startFrame: 1280, endFrame: 1330, scale: 1.04, originX: 50, originY: 34 },
  ];

  // 7-Stage Host Slide-Down Beats (Host slides down smoothly to make space for top B-roll)
  const slideDownBeats: SlideBeat[] = [
    // 1. Founder Ankit Sahni Reveal
    { startFrame: 30, endFrame: 115, offsetY: 360 },
    // 2. Official Series A ₹131 Crore Bikaji Acquisition News Article
    { startFrame: 155, endFrame: 250, offsetY: 360 },
    // 3. Hazelnut Factory Flagship Store
    { startFrame: 470, endFrame: 535, offsetY: 360 },
    // 4. Lucknow Map
    { startFrame: 550, endFrame: 620, offsetY: 360 },
    // 5. Specialty Coffee Pour-Over Bar
    { startFrame: 645, endFrame: 715, offsetY: 360 },
    // 6. Artisanal Bakery Display
    { startFrame: 720, endFrame: 795, offsetY: 360 },
    // 7. Google AI Overview ₹247 Cr Implied Valuation
    { startFrame: 960, endFrame: 1060, offsetY: 360 },
  ];

  return (
    <FacecamFrame
      videoSrc={staticFile("build_to_scale_thf/facecam.mp4")}
      zoomBeats={zoomBeats}
      slideDownBeats={slideDownBeats}
      vignette={true}
    />
  );
};
