import React from "react";
import { Audio, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { TrueRelationshipsBackground } from "./Background";
import { TrueRelationshipsCanvas } from "./Canvas";
import { TrueRelationshipsPresenter } from "./Presenter";
import { AppleProgressBar } from "../../components/AppleProgressBar";
import { AppleKineticCaptions } from "../../components/AppleKineticCaptions";
import { SoundDesignEngine, SfxCue } from "../../components/SoundDesignEngine";
import { TrueRelationshipsThumbnail } from "../../thumbnails";
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
    "frame": 144,
    "type": "whoosh_fast",
    "volume": 0.32
  },
  {
    "frame": 217,
    "type": "whoosh_fast",
    "volume": 0.34
  },
  {
    "frame": 0,
    "type": "whoosh_deep",
    "volume": 0.32
  },
  {
    "frame": 44,
    "type": "click",
    "volume": 0.22
  },
  {
    "frame": 471,
    "type": "click",
    "volume": 0.28
  },
  {
    "frame": 292,
    "type": "whoosh_sparkle",
    "volume": 0.24
  },
  {
    "frame": 91,
    "type": "whoosh_fast",
    "volume": 0.28
  },
  {
    "frame": 91,
    "type": "click",
    "volume": 0.24
  },
  {
    "frame": 164,
    "type": "whoosh_deep",
    "volume": 0.28
  },
  {
    "frame": 292,
    "type": "click",
    "volume": 0.26
  },
  {
    "frame": 403,
    "type": "click",
    "volume": 0.26
  },
  {
    "frame": 527,
    "type": "whoosh_sparkle",
    "volume": 0.32
  },
  {
    "frame": 660,
    "type": "click",
    "volume": 0.32
  }
];

export const TrueRelationshipsComposition: React.FC = () => {
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
          <TrueRelationshipsThumbnail />
        </div>
      )}

      {/* 1. Voiceover Audio Track */}
      <Audio src={staticFile("true_relationships/voiceover.mp3")} volume={1.3} />

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
      <TrueRelationshipsBackground />

      {/* 6. Speech-Synchronized Progressive Reveal Canvas */}
      <TrueRelationshipsCanvas transcript={transcript} />

      {/* 7. Multi-Pose Character Presenter */}
      <TrueRelationshipsPresenter currentMs={currentMs} />

      {/* 8. Kinetic Captions with Neon Apple Glow */}
      <AppleKineticCaptions transcript={transcript} />
    </div>
  );
};
