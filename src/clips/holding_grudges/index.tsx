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

// Event-driven multi-SFX suite synchronized across all 8 high-retention graphic scenes (+8% tempo)
const SFX_CUES: SfxCue[] = [
  { frame: 0,   type: "whoosh_deep",    volume: 0.32 }, // 0.0s: Intro Presenter entrance
  { frame: 3,   type: "impact_hit",     volume: 0.22 }, // 0.1s: Single Incident card stamp
  { frame: 63,  type: "whoosh_fast",    volume: 0.32 }, // 2.1s: Replay Counter whip-in
  { frame: 72,  type: "click",          volume: 0.26 }, // 2.4s: Counter tick lock
  { frame: 144, type: "whoosh_fast",    volume: 0.34 }, // 4.8s: Open Loops Scene entrance
  { frame: 153, type: "impact_hit",     volume: 0.24 }, // 5.1s: Chaos cutout stamp
  { frame: 273, type: "whoosh_fast",    volume: 0.32 }, // 9.1s: Mental DVR Scrubber entrance
  { frame: 282, type: "click",          volume: 0.26 }, // 9.4s: Memory scrubber lock
  { frame: 366, type: "whoosh_fast",    volume: 0.32 }, // 12.2s: Simulation Tree entrance
  { frame: 375, type: "impact_hit",     volume: 0.24 }, // 12.5s: Reality warning tag
  { frame: 456, type: "whoosh_fast",    volume: 0.34 }, // 15.2s: PropComparison entrance
  { frame: 465, type: "click",          volume: 0.26 }, // 15.5s: Left illusion card lock
  { frame: 564, type: "impact_hit",     volume: 0.25 }, // 18.8s: Right reality card reveal
  { frame: 714, type: "whoosh_fast",    volume: 0.32 }, // 23.8s: Apple Toggle Switch entrance
  { frame: 723, type: "click",          volume: 0.28 }, // 24.1s: Detachment toggle lock
  { frame: 810, type: "whoosh_sparkle", volume: 0.35 }, // 27.0s: Closure card radiant reveal
  { frame: 819, type: "click",          volume: 0.26 }, // 27.3s: Peace restored stamp
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
