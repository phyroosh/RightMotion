import React from "react";
import { Audio, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { EmotionsBackground } from "./Background";
import { EmotionsCanvas } from "./Canvas";
import { EmotionsPresenter } from "./Presenter";
import { AppleProgressBar } from "../../components/AppleProgressBar";
import { AppleKineticCaptions } from "../../components/AppleKineticCaptions";
import rawTranscript from "./transcript.json";
import { WordTimestamp } from "../../types";
import "../../style.css";

const transcript = rawTranscript as WordTimestamp[];

// Key visual trigger timestamps for gentle tactile click SFX (30fps)
const SFX_FRAMES = [
  0,    // 0.0s: Intro Hook Full-Body Presenter & Badge Pop
  126,  // 4.2s: B-Roll Scene 1 Dual Processing Matrix reveal
  216,  // 7.2s: "Talking" chip highlight
  225,  // 7.5s: "Connecting" chip highlight
  276,  // 9.2s: "Understanding" chip highlight
  321,  // 10.7s: Containment & Action Card activation
  405,  // 13.5s: "Quiet" chip highlight
  438,  // 14.6s: "Distract" chip highlight
  483,  // 16.1s: "Fix Problem" chip highlight
  525,  // 17.5s: Interlude Bust Presenter (Crossed arms)
  735,  // 24.5s: Scene 2 Decision Guardrail card
  858,  // 28.6s: "Permanent Decision" alarm trigger
  930,  // 31.0s: Scene 3 Clarity Audit reveal
  990,  // 33.0s: Question 1 reveal
  1065, // 35.5s: Question 2 reveal
  1095, // 36.5s: Scene 4 Equilibrium Horizon reveal
  1191, // 39.7s: Outro Full-Body Presenter (Open hands)
];

export const EmotionsComposition: React.FC = () => {
  const { width, height, fps, durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();
  const currentMs = (frame / fps) * 1000;

  return (
    <div
      className="relative w-full h-full bg-[#f8fafc] text-slate-900 flex flex-col justify-between overflow-hidden select-none font-sans"
      style={{ width, height }}
    >
      {/* 1. Voiceover Audio Track (Female Neural, Natural Rate +0%, Boosted +30%, Silence-Compressed) */}
      <Audio src={staticFile("emotions/voiceover.mp3")} volume={1.3} />

      {/* 2. Permanent Shorts Background Music (Ambient mix with smooth fade) */}
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

      {/* 4. Top-edge Apple Progress Bar */}
      <AppleProgressBar />

      {/* 5. Pure Apple Studio Light Background with Liquid Mesh Gradient Orbs */}
      <EmotionsBackground />

      {/* 6. B-Roll Motion Graphics Canvas */}
      <EmotionsCanvas transcript={transcript} />

      {/* 7. A-Roll Hero Presenter with Full-Body Intro/Outro + Bust Interlude */}
      <EmotionsPresenter currentMs={currentMs} />

      {/* 8. Central Kinetic Typography with Apple Blue Glow */}
      <AppleKineticCaptions transcript={transcript} />
    </div>
  );
};
