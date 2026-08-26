import React from "react";
import { Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ComparisonBackground } from "../components/ComparisonBackground";
import { ComparisonMotionCanvas } from "../components/ComparisonMotionCanvas";
import { AppleKineticCaptions } from "../components/AppleKineticCaptions";
import { ComparisonAvatar } from "../components/ComparisonAvatar";
import rawTranscript from "../transcript_comparison.json";
import { WordTimestamp } from "../types";

const transcript = rawTranscript as WordTimestamp[];

export const ComparisonComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentMs = (frame / fps) * 1000;

  return (
    <div className="relative w-full h-full bg-white overflow-hidden select-none">
      {/* 1. Dynamic Liquid Mesh Gradient Background */}
      <ComparisonBackground />

      {/* 2. Bespoke Tactile Motion Graphics Canvas */}
      <ComparisonMotionCanvas transcript={transcript} />

      {/* 3. Kinetic Word-by-Word Subtitles */}
      <AppleKineticCaptions transcript={transcript} />

      {/* 4. Presenter Avatar Cutout */}
      <ComparisonAvatar currentMs={currentMs} />

      {/* 5. Clean Studio Lighting Vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-40"
        style={{
          boxShadow: "inset 0 0 160px rgba(0,0,0,0.06)",
        }}
      />

      {/* 6. Voiceover Audio Track */}
      <Audio src={staticFile("voiceover_comparison.mp3")} volume={1.0} />
    </div>
  );
};
