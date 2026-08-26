import React from "react";
import { Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ProcrastinationBackground } from "./Background";
import { ProcrastinationCanvas } from "./Canvas";
import { ProcrastinationPresenter } from "./Presenter";
import { ProcrastinationChapters } from "./Chapters";
import { AppleKineticCaptions } from "../../components/AppleKineticCaptions";
import rawTranscript from "./transcript.json";
import { WordTimestamp } from "../../types";
import "../../style.css";

const transcript = rawTranscript as WordTimestamp[];

// Key visual trigger timestamps for gentle tactile click SFX (30fps)
const SFX_FRAMES = [
  0,     // 0.0s: Intro Hook Badge
  360,   // 12.0s: Cleaning Room
  480,   // 16.0s: Phone Magnet
  600,   // 20.0s: One Video
  720,   // 24.0s: Folder Organizing
  840,   // 28.0s: Time Slip
  1260,  // 42.0s: Core Revelation Presenter
  1710,  // 57.0s: Anticipation Trap
  2850,  // 95.0s: 2 Choices
  4252,  // 141.8s: Avoidance Loop Circuit
  5974,  // 199.1s: Threat to Competence
  8040,  // 268.0s: 11:47 PM Clock
  9272,  // 309.1s: 7-Stage Flowchart
  10305, // 343.5s: Diagnostic Question Matrix
  12240, // 408.0s: 5-Minute Rule
  13050, // 435.0s: 5-Minute Presenter
  14368, // 479.0s: Identity Reframe
  15450, // 515.0s: Finale Presenter Shot
];

export const ProcrastinationComposition: React.FC = () => {
  const { width, height, fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const currentMs = (frame / fps) * 1000;

  return (
    <div
      className="relative w-full h-full bg-[#f8fafc] text-slate-900 flex flex-col justify-between overflow-hidden select-none font-sans"
      style={{ width, height }}
    >
      {/* 1. Voiceover Audio Track (Female Neural, Fast-Paced, Boosted +30%) */}
      <Audio src={staticFile("procrastination/voiceover.mp3")} volume={1.3} />

      {/* Note: BGM is omitted per editorial instructions unless requested */}

      {/* 2. Gentle Tactile Mouse Click SFX for Key Visual Pop/Lock Moments */}
      {SFX_FRAMES.map((f, idx) => (
        <Sequence key={`sfx-${idx}`} from={f} durationInFrames={15}>
          <Audio src={staticFile("audio/sfx/mouse_click.mp3")} volume={0.28} />
        </Sequence>
      ))}

      {/* 3. Pure Studio Light Background with Widescreen Liquid Mesh */}
      <ProcrastinationBackground />

      {/* 4. 16:9 Widescreen Motion Graphics B-Roll Canvas (Single-concept pacing) */}
      <ProcrastinationCanvas transcript={transcript} />

      {/* 5. 16:9 Cinematic A-Roll Hero Presenter with Smart Multi-Pose Switching */}
      <ProcrastinationPresenter currentMs={currentMs} />

      {/* 6. Widescreen Chapter Progress & Top-Left Badge */}
      <ProcrastinationChapters currentMs={currentMs} />

      {/* 7. Responsive Kinetic Typography with Apple Blue Glow */}
      <AppleKineticCaptions transcript={transcript} />
    </div>
  );
};
