import React from "react";
import { Audio, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { PromisesBackground } from "./Background";
import { PromisesCanvas } from "./Canvas";
import { PromisesPresenter } from "./Presenter";
import { AppleProgressBar } from "../../components/AppleProgressBar";
import { AppleKineticCaptions } from "../../components/AppleKineticCaptions";
import rawTranscript from "./transcript.json";
import { WordTimestamp } from "../../types";
import "../../style.css";

const transcript: WordTimestamp[] = (rawTranscript as any[]).map((t) => ({
  word: t.word,
  startMs: t.startMs ?? t.start,
  endMs: t.endMs ?? t.end,
}));

// Key visual trigger timestamps for gentle tactile click SFX (30fps)
const SFX_FRAMES = [
  0,    // 0.0s: Self-Trust Paradox Intro Badge
  135,  // 4.5s: Tomorrow Illusion Card Pop
  264,  // 8.8s: Trust Erosion Meter Gauge
  390,  // 13.0s: Conditioned Brain Reframe
  588,  // 19.6s: Overwhelm Warning Card
  690,  // 23.0s: Micro-Promise Blueprint
  825,  // 27.5s: Unshakable Self-Trust Finale
];

export const PromisesComposition: React.FC = () => {
  const { width, height, fps, durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();
  const currentMs = (frame / fps) * 1000;

  return (
    <div
      className="relative w-full h-full bg-[#fbfbfd] text-slate-900 flex flex-col justify-between overflow-hidden select-none font-sans"
      style={{ width, height }}
    >
      {/* 1. Voiceover Audio Track */}
      <Audio src={staticFile("promises/voiceover.mp3")} volume={1.3} />

      {/* 2. Background Ambient Music */}
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

      {/* 3. Gentle Tactile Mouse Click SFX */}
      {SFX_FRAMES.map((f, idx) => (
        <Sequence key={`sfx-${idx}`} from={f} durationInFrames={15}>
          <Audio src={staticFile("audio/sfx/mouse_click.mp3")} volume={0.28} />
        </Sequence>
      ))}

      {/* 4. Top Apple Sleek Progress Bar */}
      <AppleProgressBar />

      {/* 5. Apple Studio Mesh Background */}
      <PromisesBackground />

      {/* 6. Motion Graphics Storyboard Canvas */}
      <PromisesCanvas transcript={transcript} />

      {/* 7. Multi-Pose Character Presenter */}
      <PromisesPresenter currentMs={currentMs} />

      {/* 8. Kinetic Captions with Neon Apple Glow */}
      <AppleKineticCaptions transcript={transcript} />
    </div>
  );
};
