import React from "react";
import { Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { AppleBackground } from "./components/AppleBackground";
import { AppleProgressBar } from "./components/AppleProgressBar";
import { AppleKineticCaptions } from "./components/AppleKineticCaptions";
import { MotionGraphicsCanvas } from "./components/MotionGraphicsCanvas";
import { CharacterAvatar } from "./components/CharacterAvatar";
import rawTranscript from "./transcript.json";
import { WordTimestamp } from "./types";
import "./style.css";

const transcript = rawTranscript as WordTimestamp[];

export const MainComposition: React.FC = () => {
  const { width, height, fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const currentMs = (frame / fps) * 1000;

  return (
    <div
      className="relative w-full h-full bg-[#fbfbfd] text-slate-900 flex flex-col justify-between overflow-hidden select-none font-sans"
      style={{ width, height }}
    >
      {/* 1. Voiceover Audio */}
      <Audio src={staticFile("voiceover.mp3")} />

      {/* 2. Top-edge Apple Sleek Progress Bar */}
      <AppleProgressBar />

      {/* 3. Pure Apple Studio Light Background with Liquid Mesh Blobs */}
      <AppleBackground />

      {/* 4. After Effects Motion Graphics Canvas (Scene-Synced Visual Metaphors) */}
      <MotionGraphicsCanvas transcript={transcript} />

      {/* 5. Character Presenter Cutout with Smooth Physics */}
      <CharacterAvatar currentMs={currentMs} />

      {/* 6. Central Kinetic Typography with Apple Blue Glow */}
      <AppleKineticCaptions transcript={transcript} />
    </div>
  );
};
