import React from "react";
import { Audio, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { EnvironmentBackground } from "./Background";
import { EnvironmentCanvas } from "./Canvas";
import { EnvironmentPresenter } from "./Presenter";
import { AppleProgressBar } from "../../components/AppleProgressBar";
import { AppleKineticCaptions } from "../../components/AppleKineticCaptions";
import { SoundDesignEngine, SfxCue } from "../../components/SoundDesignEngine";
import { EnvironmentThumbnail } from "../../thumbnails";
import rawTranscript from "./transcript.json";
import { WordTimestamp } from "../../types";
import "../../style.css";

const transcript: WordTimestamp[] = (rawTranscript as any[]).map((t) => ({
  word: t.word,
  startMs: t.startMs ?? t.start,
  endMs: t.endMs ?? t.end,
}));

// Professional multi-SFX cues mapped 1-to-1 to visual element motions
const SFX_CUES: SfxCue[] = [
  { frame: 0,   type: "whoosh_deep",      volume: 0.30 }, // 0.0s: Intro Judy Presenter entrance
  { frame: 12,  type: "click",            volume: 0.24 }, // 0.4s: Topic badge spring settle
  { frame: 210, type: "whoosh_fast",      volume: 0.32 }, // 7.0s: Scene 2 Willpower Stack hero card
  { frame: 225, type: "click",            volume: 0.24 }, // 7.5s: Discipline meter spring
  { frame: 252, type: "click",            volume: 0.24 }, // 8.4s: Defined Goals spring
  { frame: 282, type: "click",            volume: 0.24 }, // 9.4s: Strong Mindset spring
  { frame: 336, type: "impact_hit",       volume: 0.22 }, // 11.2s: Scene 3 Normalization Traps entrance
  { frame: 384, type: "click",            volume: 0.24 }, // 12.8s: Trap 1: Procrastination
  { frame: 429, type: "click",            volume: 0.24 }, // 14.3s: Trap 2: Negativity
  { frame: 462, type: "click",            volume: 0.24 }, // 15.4s: Trap 3: Unhealthy Habits
  { frame: 504, type: "impact_hit",       volume: 0.22 }, // 16.8s: Willpower Battery Drain alert
  { frame: 585, type: "whoosh_sparkle",   volume: 0.30 }, // 19.5s: Scene 4 Neural Adaptation Principle
  { frame: 666, type: "click",            volume: 0.24 }, // 22.2s: Not Motivation contrast
  { frame: 708, type: "whoosh_sparkle",   volume: 0.32 }, // 23.6s: Different Environment revelation
  { frame: 744, type: "whoosh_cinematic", volume: 0.32 }, // 24.8s: Scene 5 The 3 Architecture Levers
  { frame: 804, type: "click",            volume: 0.24 }, // 26.8s: Lever 1: What You See
  { frame: 846, type: "click",            volume: 0.24 }, // 28.2s: Lever 2: Who You Spend Time With
  { frame: 882, type: "click",            volume: 0.24 }, // 29.4s: Lever 3: What You Make Easy
  { frame: 930, type: "whoosh_sparkle",   volume: 0.32 }, // 31.0s: Scene 6 Finale Judy Re-entry
];

export const EnvironmentComposition: React.FC = () => {
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
          <EnvironmentThumbnail />
        </div>
      )}

      {/* 1. Voiceover Audio Track */}
      <Audio src={staticFile("environment/voiceover.mp3")} volume={1.3} />

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
      <EnvironmentBackground />

      {/* 6. Motion Graphics Storyboard Canvas */}
      <EnvironmentCanvas transcript={transcript} />

      {/* 7. Multi-Pose Character Presenter */}
      <EnvironmentPresenter currentMs={currentMs} />

      {/* 8. Kinetic Captions with Neon Apple Glow */}
      <AppleKineticCaptions transcript={transcript} />
    </div>
  );
};
