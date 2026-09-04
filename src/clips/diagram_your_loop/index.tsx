import React from "react";
import { Audio, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { DiagramYourLoopBackground } from "./Background";
import { DiagramYourLoopCanvas } from "./Canvas";
import { DiagramYourLoopPresenter } from "./Presenter";
import { AppleProgressBar } from "../../components/AppleProgressBar";
import { AppleKineticCaptions } from "../../components/AppleKineticCaptions";
import { SoundDesignEngine, SfxCue } from "../../components/SoundDesignEngine";
import { DiagramYourLoopThumbnail } from "../../thumbnails";
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
  { frame: 34, type: "impact_hit", volume: 0.24 },
  { frame: 79, type: "click", volume: 0.24 },
  { frame: 125, type: "whoosh_fast", volume: 0.16 },
  { frame: 190, type: "whoosh_sparkle", volume: 0.30 },
  { frame: 215, type: "click", volume: 0.24 },
  { frame: 239, type: "click", volume: 0.24 },
  { frame: 293, type: "click", volume: 0.24 },
  { frame: 365, type: "whoosh_fast", volume: 0.16 },
  { frame: 378, type: "click", volume: 0.24 },
  { frame: 457, type: "click", volume: 0.24 },
  { frame: 499, type: "impact_hit", volume: 0.22 },
  { frame: 560, type: "whoosh_fast", volume: 0.16 },
  { frame: 571, type: "impact_hit", volume: 0.24 },
  { frame: 650, type: "whoosh_sparkle", volume: 0.32 },
  { frame: 760, type: "whoosh_deep", volume: 0.20 },
  { frame: 765, type: "whoosh_sparkle", volume: 0.30 },
];

export const DiagramYourLoopComposition: React.FC = () => {
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
          <DiagramYourLoopThumbnail />
        </div>
      )}

      {/* 1. Voiceover Audio Track */}
      <Audio src={staticFile("diagram_your_loop/voiceover.mp3")} volume={1.3} />

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
      <DiagramYourLoopBackground />

      {/* 6. Speech-Synchronized Progressive Reveal Canvas */}
      <DiagramYourLoopCanvas transcript={transcript} />

      {/* 7. Multi-Pose Character Presenter */}
      <DiagramYourLoopPresenter currentMs={currentMs} />

      {/* 8. Kinetic Captions with Neon Apple Glow */}
      <AppleKineticCaptions transcript={transcript} />
    </div>
  );
};
