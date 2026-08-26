import React from "react";
import { Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { AppleBackground } from "../components/AppleBackground";
import { MotionGraphicsCanvas } from "../components/MotionGraphicsCanvas";
import { AppleKineticCaptions } from "../components/AppleKineticCaptions";
import { CharacterAvatar } from "../components/CharacterAvatar";
import rawTranscript from "../transcript.json";
import { WordTimestamp } from "../types";

const transcript = rawTranscript as WordTimestamp[];

export const HabitComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentMs = (frame / fps) * 1000;

  return (
    <div className="relative w-full h-full bg-white overflow-hidden select-none">
      {/* 1. Dynamic Liquid Mesh Gradient Background */}
      <AppleBackground />

      {/* 2. Bespoke Tactile Motion Graphics Canvas */}
      <MotionGraphicsCanvas transcript={transcript} />

      {/* 3. Kinetic Word-by-Word Subtitles */}
      <AppleKineticCaptions transcript={transcript} />

      {/* 4. Presenter Avatar Cutout */}
      <CharacterAvatar currentMs={currentMs} />

      {/* 5. Clean Studio Lighting Vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-40"
        style={{
          boxShadow: "inset 0 0 160px rgba(0,0,0,0.06)",
        }}
      />

      {/* 6. Voiceover Audio Track */}
      <Audio src={staticFile("voiceover.mp3")} volume={1.0} />
    </div>
  );
};
