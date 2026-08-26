import React from "react";
import { Audio, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { StrengthBackground } from "./Background";
import { StrengthCanvas } from "./Canvas";
import { StrengthPresenter } from "./Presenter";
import { AppleProgressBar } from "../../components/AppleProgressBar";
import { AppleKineticCaptions } from "../../components/AppleKineticCaptions";
import rawTranscript from "./transcript.json";
import { WordTimestamp } from "../../types";
import "../../style.css";

const transcript = rawTranscript as WordTimestamp[];

// Key visual trigger timestamps for gentle tactile click SFX (30fps)
const SFX_FRAMES = [
  0,    // 0.0s: Intro Hook Badge
  105,  // 3.5s: The Emotional Containment & Pressure Chamber
  273,  // 9.1s: Strategic Intelligence & Real Strength Reframe
  462,  // 15.4s: Tactical Honesty Matrix
  514,  // 17.1s: "I'm Not Okay" tactile pop
  696,  // 23.2s: The 3-Step Resolution Protocol
  750,  // 25.0s: Step 1 Talk to someone trusted
  804,  // 26.8s: Step 2 Think with calm clarity
  834,  // 27.8s: Step 3 Deal with problem
  903,  // 30.1s: Unburden Yourself Presenter
  1008, // 33.6s: The Courage Crucible Finale
  1074, // 35.8s: "Courage to face reality" trigger
];

export const StrengthComposition: React.FC = () => {
  const { width, height, fps, durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();

  return (
    <div
      className="relative w-full h-full bg-[#f8fafc] text-slate-900 flex flex-col justify-between overflow-hidden select-none font-sans"
      style={{ width, height }}
    >
      {/* 1. Voiceover Audio Track (Female Neural, Natural Rate +0%, Boosted +30%, Silence-Compressed) */}
      <Audio src={staticFile("strength/voiceover.mp3")} volume={1.3} />

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
      <StrengthBackground />

      {/* 6. B-Roll Motion Graphics Canvas */}
      <StrengthCanvas transcript={transcript} />

      {/* 7. A-Roll Hero Presenter with Keyframe Animation & Multi-Pose Switching */}
      <StrengthPresenter transcript={transcript} />

      {/* 8. Central Kinetic Typography with Apple Blue Glow */}
      <AppleKineticCaptions transcript={transcript} />
    </div>
  );
};
