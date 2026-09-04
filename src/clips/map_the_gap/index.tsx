import React from "react";
import { Audio, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { MapTheGapBackground } from "./Background";
import { MapTheGapCanvas } from "./Canvas";
import { MapTheGapPresenter } from "./Presenter";
import { AppleProgressBar } from "../../components/AppleProgressBar";
import { AppleKineticCaptions } from "../../components/AppleKineticCaptions";
import { SoundDesignEngine, SfxCue } from "../../components/SoundDesignEngine";
import { MapTheGapThumbnail } from "../../thumbnails";
import rawTranscript from "./transcript.json";
import { WordTimestamp } from "../../types";
import "../../style.css";

const transcript: WordTimestamp[] = (rawTranscript as any[]).map((t) => ({
  word: t.word,
  startMs: t.startMs ?? t.start,
  endMs: t.endMs ?? t.end,
}));

// Multi-SFX audio cues synchronized with progressive visual reveals
const SFX_CUES: SfxCue[] = [
  { frame: 0, type: "whoosh_deep", volume: 0.20 },
  { frame: 125, type: "whoosh_fast", volume: 0.16 },
  { frame: 193, type: "impact_hit", volume: 0.24 },
  { frame: 235, type: "click", volume: 0.24 },
  { frame: 255, type: "whoosh_fast", volume: 0.16 },
  { frame: 306, type: "click", volume: 0.24 },
  { frame: 373, type: "whoosh_sparkle", volume: 0.28 },
  { frame: 403, type: "impact_hit", volume: 0.24 },
  { frame: 425, type: "whoosh_fast", volume: 0.16 },
  { frame: 480, type: "click", volume: 0.24 },
  { frame: 496, type: "click", volume: 0.24 },
  { frame: 517, type: "click", volume: 0.24 },
  { frame: 550, type: "click", volume: 0.24 },
  { frame: 573, type: "click", volume: 0.24 },
  { frame: 607, type: "whoosh_sparkle", volume: 0.30 },
  { frame: 645, type: "whoosh_sparkle", volume: 0.32 },
  { frame: 655, type: "click", volume: 0.24 },
  { frame: 740, type: "whoosh_deep", volume: 0.20 },
  { frame: 755, type: "whoosh_sparkle", volume: 0.30 },
];

export const MapTheGapComposition: React.FC = () => {
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
          <MapTheGapThumbnail />
        </div>
      )}

      {/* 1. Voiceover Audio Track */}
      <Audio src={staticFile("map_the_gap/voiceover.mp3")} volume={1.3} />

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
      <MapTheGapBackground />

      {/* 6. Speech-Synchronized Progressive Reveal Canvas */}
      <MapTheGapCanvas transcript={transcript} />

      {/* 7. Multi-Pose Character Presenter */}
      <MapTheGapPresenter currentMs={currentMs} />

      {/* 8. Kinetic Captions with Neon Apple Glow */}
      <AppleKineticCaptions transcript={transcript} />
    </div>
  );
};
