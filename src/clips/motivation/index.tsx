import React from "react";
import { Audio, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { MotivationBackground } from "./Background";
import { MotivationCanvas } from "./Canvas";
import { MotivationPresenter } from "./Presenter";
import { AppleProgressBar } from "../../components/AppleProgressBar";
import { AppleKineticCaptions } from "../../components/AppleKineticCaptions";
import rawTranscript from "./transcript.json";
import { WordTimestamp } from "../../types";
import "../../style.css";

const transcript = rawTranscript as WordTimestamp[];

// Key visual trigger timestamps for gentle tactile click SFX (30fps)
const SFX_FRAMES = [
  0,    // 0.0s: Motivation Myth Intro Badge
  180,  // 6.0s: False Equation Card
  330,  // 11.0s: Waiting Trap Presenter
  510,  // 17.0s: Neural Spark Card
  660,  // 22.0s: Action Creates Motivation Presenter
  825,  // 27.5s: Micro Question Card
  1050, // 35.0s: Start Really Small Finale Presenter
];

export const MotivationComposition: React.FC = () => {
  const { width, height, fps, durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();
  const currentMs = (frame / fps) * 1000;

  return (
    <div
      className="relative w-full h-full bg-[#fbfbfd] text-slate-900 flex flex-col justify-between overflow-hidden select-none font-sans"
      style={{ width, height }}
    >
      {/* 1. Voiceover Audio Track (Female Neural, Fast-Paced, Boosted +30%) */}
      <Audio src={staticFile("motivation/voiceover.mp3")} volume={1.3} />

      {/* 2. Permanent Shorts Background Music (Subtle ambient mix with smooth fade) */}
      <Audio
        src={staticFile("audio/bgm/the_mountain-piano-documentary-567436.mp3")}
        volume={(f) =>
          interpolate(
            f,
            [0, 25, durationInFrames - 35, durationInFrames],
            [0, 0.12, 0.12, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          )
        }
        loop
      />

      {/* 3. Gentle Tactile Mouse Click SFX for Key Visual Pop/Lock Moments */}
      {SFX_FRAMES.map((f, idx) => (
        <Sequence key={`sfx-${idx}`} from={f} durationInFrames={15}>
          <Audio src={staticFile("audio/sfx/mouse_click.mp3")} volume={0.28} />
        </Sequence>
      ))}

      {/* 4. Top-edge Apple Sleek Progress Bar */}
      <AppleProgressBar />

      {/* 5. Pure Apple Studio Light Background with Liquid Mesh Blobs */}
      <MotivationBackground />

      {/* 6. B-Roll Motion Graphics Canvas (Single-concept progressive pacing) */}
      <MotivationCanvas transcript={transcript} />

      {/* 7. A-Roll Hero Presenter with Keyframe Animation & Multi-Pose Switching */}
      <MotivationPresenter currentMs={currentMs} />

      {/* 8. Central Kinetic Typography with Apple Blue Glow */}
      <AppleKineticCaptions transcript={transcript} />
    </div>
  );
};
