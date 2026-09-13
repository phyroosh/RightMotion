import React from "react";
import { Audio, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { SmokeTestFrontierSBackground } from "./Background";
import { SmokeTestFrontierSCanvas } from "./Canvas";
import { SmokeTestFrontierSPresenter } from "./Presenter";
import { AppleProgressBar } from "../../components/AppleProgressBar";
import { AppleKineticCaptions } from "../../components/AppleKineticCaptions";
import { SoundDesignEngine, SfxCue } from "../../components/SoundDesignEngine";
import { GroundedTextureEngine } from "../../components/texture";
import { SmokeTestFrontierSThumbnail } from "../../thumbnails";
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
    "frame": 208,
    "type": "whoosh_fast",
    "volume": 0.32
  },
  {
    "frame": 289,
    "type": "whoosh_fast",
    "volume": 0.34
  },
  {
    "frame": 751,
    "type": "click",
    "volume": 0.28
  },
  {
    "frame": 364,
    "type": "whoosh_sparkle",
    "volume": 0.24
  },
  {
    "frame": 364,
    "type": "click",
    "volume": 0.26
  },
  {
    "frame": 364,
    "type": "click",
    "volume": 0.26
  },
  {
    "frame": 518,
    "type": "click",
    "volume": 0.26
  },
  {
    "frame": 686,
    "type": "whoosh_sparkle",
    "volume": 0.32
  },
  {
    "frame": 913,
    "type": "click",
    "volume": 0.32
  }
];

export const SmokeTestFrontierSComposition: React.FC = () => {
  const { width, height, fps, durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();
  const currentMs = (frame / fps) * 1000;

  return (
    <div
      className="relative w-full h-full bg-[#fbfbfd] text-slate-900 flex flex-col justify-between overflow-hidden select-none font-sans"
      style={{ width, height }}
    >
      {/* 0. High-Converting 4K Thumbnail First-Frame */}
      {frame === 0 && (
        <div className="absolute inset-0 w-full h-full z-50 pointer-events-none">
          <SmokeTestFrontierSThumbnail />
        </div>
      )}

      {/* 1. Voiceover Audio Track */}
      <Audio src={staticFile("smoke_test_frontier_s/voiceover.mp3")} volume={1.3} />

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
      <SmokeTestFrontierSBackground />

      {/* 6. Speech-Synchronized Progressive Reveal Canvas */}
      <SmokeTestFrontierSCanvas transcript={transcript} />

      {/* 7. Multi-Pose Character Presenter */}
      <SmokeTestFrontierSPresenter currentMs={currentMs} />

      {/* 8. Kinetic Captions with Neon Apple Glow */}
      <AppleKineticCaptions transcript={transcript} />

      {/* 9. Grounded Finishing Texture (35mm Living Grain + Halation + Vignette) */}
      <GroundedTextureEngine grainOpacity={0.042} />
    </div>
  );
};
