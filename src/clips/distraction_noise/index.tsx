import React from "react";
import { Audio, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { DistractionNoiseBackground } from "./Background";
import { DistractionNoiseCanvas } from "./Canvas";
import { DistractionNoisePresenter } from "./Presenter";
import { AppleProgressBar } from "../../components/AppleProgressBar";
import { AppleKineticCaptions } from "../../components/AppleKineticCaptions";
import { SoundDesignEngine, SfxCue } from "../../components/SoundDesignEngine";
import { GroundedTextureEngine } from "../../components/texture";
import rawTranscript from "./transcript.json";
import { WordTimestamp } from "../../types";
import "../../style.css";

const transcript: WordTimestamp[] = (rawTranscript as any[]).map((t) => ({
  word: t.word,
  startMs: t.startMs ?? t.start,
  endMs: t.endMs ?? t.end,
  speaker: t.speaker,
}));

// Multi-SFX audio cues synchronized with progressive visual reveals
const SFX_CUES: SfxCue[] = [
  {
    "frame": 0,
    "type": "whoosh_deep",
    "volume": 0.32
  },
  {
    "frame": 89,
    "type": "whoosh_fast",
    "volume": 0.32
  },
  {
    "frame": 184,
    "type": "whoosh_fast",
    "volume": 0.34
  },
  {
    "frame": 458,
    "type": "click",
    "volume": 0.28
  },
  {
    "frame": 259,
    "type": "whoosh_sparkle",
    "volume": 0.24
  },
  {
    "frame": 89,
    "type": "whoosh_fast",
    "volume": 0.28
  },
  {
    "frame": 89,
    "type": "click",
    "volume": 0.24
  },
  {
    "frame": 144,
    "type": "whoosh_deep",
    "volume": 0.28
  },
  {
    "frame": 259,
    "type": "click",
    "volume": 0.26
  },
  {
    "frame": 268,
    "type": "click",
    "volume": 0.26
  },
  {
    "frame": 335,
    "type": "click",
    "volume": 0.26
  },
  {
    "frame": 373,
    "type": "click",
    "volume": 0.26
  },
  {
    "frame": 446,
    "type": "click",
    "volume": 0.26
  },
  {
    "frame": 532,
    "type": "whoosh_sparkle",
    "volume": 0.32
  },
  {
    "frame": 595,
    "type": "click",
    "volume": 0.32
  }
];

export const DistractionNoiseComposition: React.FC = () => {
  const { width, height, fps, durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();
  const currentMs = (frame / fps) * 1000;

  return (
    <div
      className="relative w-full h-full bg-[#fbfbfd] text-slate-900 flex flex-col justify-between overflow-hidden select-none font-sans"
      style={{ width, height }}
    >
      {/* 1. Voiceover Audio Track */}
      <Audio src={staticFile("distraction_noise/voiceover.mp3")} volume={1.3} />

      {/* 2. Ducked Background Ambient Music */}
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

      {/* 3. Rich Layered Sound Design Engine */}
      <SoundDesignEngine cues={SFX_CUES} />

      {/* 4. Top Apple Progress Bar */}
      <AppleProgressBar />

      {/* 5. Niche Living Background */}
      <DistractionNoiseBackground />

      {/* 6. Speech-Synchronized Progressive Reveal Canvas */}
      <DistractionNoiseCanvas transcript={transcript} />

      {/* 7. Multi-Pose Character Presenter */}
      <DistractionNoisePresenter currentMs={currentMs} />

      {/* 8. Kinetic Captions with Neon Apple Glow */}
      <AppleKineticCaptions transcript={transcript} />

      {/* 9. Grounded Finishing Texture (Pristine luminous studio, 0 grain) */}
      <GroundedTextureEngine theme="light" grainOpacity={0} />
    </div>
  );
};
