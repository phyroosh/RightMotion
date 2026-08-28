import React from "react";
import { Audio, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { PatternsBackground } from "./Background";
import { PatternsCanvas } from "./Canvas";
import { PatternsPresenter } from "./Presenter";
import { AppleProgressBar } from "../../components/AppleProgressBar";
import { AppleKineticCaptions } from "../../components/AppleKineticCaptions";
import { SoundDesignEngine, SfxCue } from "../../components/SoundDesignEngine";
import { PatternsThumbnail } from "../../thumbnails";
import rawTranscript from "./transcript.json";
import { WordTimestamp } from "../../types";
import "../../style.css";

const transcript: WordTimestamp[] = (rawTranscript as any[]).map((t) => ({
  word: t.word,
  startMs: t.startMs ?? t.start,
  endMs: t.endMs ?? t.end,
}));

// Professional, balanced SFX Cues tied 1-to-1 with dynamic visual transitions
const SFX_CUES: SfxCue[] = [
  { frame: 0,   type: "whoosh_deep",      volume: 0.30 }, // 0.0s: Intro Presenter entrance
  { frame: 12,  type: "click",            volume: 0.24 }, // 0.4s: Topic badge spring settle
  { frame: 174, type: "whoosh_fast",      volume: 0.32 }, // 5.8s: Scene 2 Overhaul Fallacy hero card
  { frame: 273, type: "impact_hit",       volume: 0.20 }, // 9.1s: Step 01: You Mess Up
  { frame: 306, type: "click",            volume: 0.24 }, // 10.2s: Step 02: Feel Guilty
  { frame: 330, type: "click",            volume: 0.24 }, // 11.0s: Step 03: Promise Big Changes
  { frame: 372, type: "impact_hit",       volume: 0.20 }, // 12.4s: Step 04: ...Then Repeat It
  { frame: 414, type: "whoosh_cinematic", volume: 0.32 }, // 13.8s: Scene 4a: Break Loop At Smallest Point
  { frame: 495, type: "click",            volume: 0.24 }, // 16.5s: Scene 4b: Don't Fix Life Tomorrow
  { frame: 555, type: "whoosh_fast",      volume: 0.32 }, // 18.5s: Scene 5a: Moment You Usually Give Up
  { frame: 636, type: "click",            volume: 0.24 }, // 21.2s: Scene 5b: Just One Small Interruption
  { frame: 696, type: "whoosh_sparkle",   volume: 0.30 }, // 23.2s: Scene 6: Neuroplasticity Revelation
  { frame: 834, type: "whoosh_sparkle",   volume: 0.32 }, // 27.8s: Finale Presenter Return ("One Different Move")
];

export const PatternsComposition: React.FC = () => {
  const { width, height, fps, durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();
  const currentMs = (frame / fps) * 1000;

  return (
    <div
      className="relative w-full h-full bg-[#fbfbfd] text-slate-900 flex flex-col justify-between overflow-hidden select-none font-sans"
      style={{ width, height }}
    >
      {/* 0. High-Converting 4K Thumbnail First-Frame (Captured automatically by YouTube Shorts) */}
      {frame === 0 && (
        <div className="absolute inset-0 w-full h-full z-50 pointer-events-none">
          <PatternsThumbnail />
        </div>
      )}

      {/* 1. Voiceover Audio Track */}
      <Audio src={staticFile("patterns/voiceover.mp3")} volume={1.3} />

      {/* 2. Ducked Background Ambient Documentary Music */}
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

      {/* 3. Layered Sound Design Engine (Whooshes, Hits, Sparkles & Tactile Clicks) */}
      <SoundDesignEngine cues={SFX_CUES} />

      {/* 4. Top Apple Sleek Progress Bar */}
      <AppleProgressBar />

      {/* 5. Apple Studio Mesh Background */}
      <PatternsBackground />

      {/* 6. Motion Graphics Storyboard Canvas */}
      <PatternsCanvas transcript={transcript} />

      {/* 7. Multi-Pose Character Presenter */}
      <PatternsPresenter currentMs={currentMs} />

      {/* 8. Kinetic Captions with Neon Apple Glow */}
      <AppleKineticCaptions transcript={transcript} />
    </div>
  );
};
