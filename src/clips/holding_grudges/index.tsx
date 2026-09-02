import React from "react";
import { Audio, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { HoldingGrudgesBackground } from "./Background";
import { HoldingGrudgesCanvas } from "./Canvas";
import { HoldingGrudgesPresenter } from "./Presenter";
import { AppleProgressBar } from "../../components/AppleProgressBar";
import { AppleKineticCaptions } from "../../components/AppleKineticCaptions";
import { SoundDesignEngine, SfxCue } from "../../components/SoundDesignEngine";
import { HoldingGrudgesThumbnail } from "../../thumbnails";
import rawTranscript from "./transcript.json";
import { WordTimestamp } from "../../types";
import "../../style.css";

const transcript: WordTimestamp[] = (rawTranscript as any[]).map((t) => ({
  word: t.word,
  startMs: t.startMs ?? t.start,
  endMs: t.endMs ?? t.end,
}));

// Multi-SFX audio cues synchronized with visual card & cutout entrances
const SFX_CUES: SfxCue[] = [
  { frame: 0,   type: "whoosh_deep",    volume: 0.32 }, // 0.0s: Intro Presenter entrance
  { frame: 12,  type: "click",          volume: 0.26 }, // 0.4s: Topic badge pop
  { frame: 159, type: "whoosh_fast",    volume: 0.34 }, // 5.3s: Scene 1 Card entrance
  { frame: 172, type: "impact_hit",     volume: 0.24 }, // 5.7s: Open loops cutout stamp
  { frame: 510, type: "whoosh_fast",    volume: 0.32 }, // 17.0s: PropComparison entrance
  { frame: 525, type: "click",          volume: 0.26 }, // 17.5s: Left card lock
  { frame: 636, type: "impact_hit",     volume: 0.25 }, // 21.2s: Reality card reveal
  { frame: 780, type: "whoosh_sparkle", volume: 0.35 }, // 26.0s: Finale Presenter re-entry
];

export const HoldingGrudgesComposition: React.FC = () => {
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
          <HoldingGrudgesThumbnail />
        </div>
      )}

      {/* 1. Voiceover Audio Track */}
      <Audio src={staticFile("holding_grudges/voiceover.mp3")} volume={1.3} />

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

      {/* 5. Apple Studio Mesh Background */}
      <HoldingGrudgesBackground />

      {/* 6. Motion Graphics Storyboard Canvas with Pro Cutouts */}
      <HoldingGrudgesCanvas transcript={transcript} />

      {/* 7. Multi-Pose Character Presenter */}
      <HoldingGrudgesPresenter currentMs={currentMs} />

      {/* 8. Kinetic Captions with Neon Apple Glow */}
      <AppleKineticCaptions transcript={transcript} />
    </div>
  );
};
