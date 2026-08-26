import React from "react";
import { Audio, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ADHDBackground } from "./Background";
import { ADHDCanvas } from "./Canvas";
import { ADHDPresenter } from "./Presenter";
import { AppleProgressBar } from "../../components/AppleProgressBar";
import { AppleKineticCaptions } from "../../components/AppleKineticCaptions";
import rawTranscript from "./transcript.json";
import { WordTimestamp } from "../../types";
import "../../style.css";

const transcript = rawTranscript as WordTimestamp[];

// Key visual trigger timestamps for gentle tactile click SFX (30fps)
const SFX_FRAMES = [
  0,    // 0.0s: Intro Hook Badge
  69,   // 2.3s: Phone Micro-trigger Card
  125,  // 4.1s: 20-Minute Time Warp
  195,  // 6.5s: Beyond Simple Distraction Badge
  426,  // 14.2s: Dual-Tone Split Brain Card Enter
  460,  // 15.3s: Task Paralysis Trim Arrow
  690,  // 23.0s: Hyperfocus Trim Arrow
  855,  // 28.5s: The Attention Paradox Badge
  1020, // 34.0s: Steering Cockpit Card
  1185, // 39.5s: Not Lazy Finale Presenter
];

export const ADHDComposition: React.FC = () => {
  const { width, height, fps, durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();
  const currentMs = (frame / fps) * 1000;

  return (
    <div
      className="relative w-full h-full bg-[#fbfbfd] text-slate-900 flex flex-col justify-between overflow-hidden select-none font-sans"
      style={{ width, height }}
    >
      {/* 1. Voiceover Audio Track (Female Neural, Fast-Paced, Boosted +30%) */}
      <Audio src={staticFile("adhd/voiceover.mp3")} volume={1.3} />

      {/* 2. Permanent Shorts Background Music (Subtle ambient mix with smooth fade) */}
      <Audio
        src={staticFile("audio/bgm/monume-documentary-documentary-music-547923.mp3")}
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
      <ADHDBackground />

      {/* 6. B-Roll Motion Graphics Canvas (Single-concept progressive pacing) */}
      <ADHDCanvas transcript={transcript} />

      {/* 7. A-Roll Hero Presenter with Keyframe Animation & Multi-Pose Switching */}
      <ADHDPresenter currentMs={currentMs} />

      {/* 8. Central Kinetic Typography with Apple Blue Glow */}
      <AppleKineticCaptions transcript={transcript} />
    </div>
  );
};
