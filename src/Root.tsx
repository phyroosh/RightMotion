import React from "react";
import { Composition, Still } from "remotion";
import { CutoutShowcase } from "./compositions/CutoutShowcase";
import { PlatformSafeShowcase } from "./compositions/PlatformSafeShowcase";
import { PrimitivesShowcase } from "./compositions/PrimitivesShowcase";
import { UniversalBackgroundProof } from "./compositions/UniversalBackgroundProof";
import { MotionStagePlayerShowcase } from "./compositions/MotionStagePlayerShowcase";
import { REGISTERED_CLIPS, calculateDurationInFrames } from "./clips/registry";
import { WordTimestamp } from "./types";
import "./style.css";

/**
 * 🎬 RightMotion — Root Video Architecture
 * 
 * Root composition consuming structured clip registrations from src/clips/registry.ts.
 * Source-text mutation is retired; new clips register via the structured clip registry.
 */
export const RemotionRoot: React.FC = () => {
  const fps = 60;

  return (
    <>
      {/* 1. Core Visual Showcases & Design Proof Compositions */}
      <Composition
        id="CutoutShowcaseVideo"
        component={CutoutShowcase}
        durationInFrames={150}
        fps={fps}
        width={1920}
        height={1080}
      />
      <Still
        id="CutoutShowcase"
        component={CutoutShowcase}
        width={1080}
        height={1920}
      />
      <Composition
        id="PlatformSafeShowcaseVideo"
        component={PlatformSafeShowcase}
        durationInFrames={120}
        fps={fps}
        width={1080}
        height={1920}
      />
      <Composition
        id="PrimitivesShowcase"
        component={PrimitivesShowcase}
        durationInFrames={1500}
        fps={fps}
        width={1080}
        height={1920}
      />
      <Composition
        id="UniversalBackgroundProof"
        component={UniversalBackgroundProof}
        durationInFrames={720}
        fps={fps}
        width={1080}
        height={1920}
      />
      <Composition
        id="MotionStagePlayerShowcase"
        component={MotionStagePlayerShowcase}
        durationInFrames={982}
        fps={fps}
        width={1080}
        height={1920}
      />

      {/* 2. Production Clips Registered in Structured Registry */}
      {REGISTERED_CLIPS.map((clip) => {
        const duration =
          clip.customDurationInFrames ??
          calculateDurationInFrames(clip.transcript as WordTimestamp[], fps);
        const width = clip.width ?? (clip.format === "longform" ? 1920 : 1080);
        const height = clip.height ?? (clip.format === "longform" ? 1080 : 1920);

        return (
          <React.Fragment key={clip.id}>
            <Composition
              id={`${clip.pascalName}Video`}
              component={clip.component}
              durationInFrames={duration}
              fps={clip.fps ?? fps}
              width={width}
              height={height}
            />
            {clip.thumbnailComponent && (
              <Still
                id={`${clip.pascalName}Thumbnail`}
                component={clip.thumbnailComponent}
                width={width}
                height={height}
              />
            )}
          </React.Fragment>
        );
      })}
    </>
  );
};
