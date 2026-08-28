import React from "react";
import { Audio, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { TeenageBackground } from "./Background";
import { TeenageCanvas } from "./Canvas";
import { TeenagePresenter } from "./Presenter";
import { AppleProgressBar } from "../../components/AppleProgressBar";
import { AppleKineticCaptions } from "../../components/AppleKineticCaptions";
import { SoundDesignEngine, SfxCue } from "../../components/SoundDesignEngine";
import { TeenageThumbnail } from "../../thumbnails";
import rawTranscript from "./transcript.json";
import { WordTimestamp } from "../../types";
import "../../style.css";

const transcript: WordTimestamp[] = (rawTranscript as any[]).map((t) => ({
  word: t.word,
  startMs: t.startMs ?? t.start,
  endMs: t.endMs ?? t.end,
}));

// Rich layered SFX audio cues — strictly synchronized with visual element entrances
const SFX_CUES: SfxCue[] = [
  { frame: 0,    type: "whoosh_deep",    volume: 0.32 }, // 0.0s: Intro Presenter Full-Body entrance
  { frame: 12,   type: "click",          volume: 0.26 }, // 0.4s: Topic badge spring pop
  { frame: 156,  type: "whoosh_fast",    volume: 0.34 }, // 5.2s: Scene 2 Neural Mismatch Storyboard entrance
  { frame: 175,  type: "impact_hit",     volume: 0.22 }, // 5.8s: Brain meter & demand diagnostic hit
  { frame: 337,  type: "whoosh_fast",    volume: 0.34 }, // 11.2s: Scene 3 Tug-of-War Card entrance
  { frame: 350,  type: "click",          volume: 0.26 }, // 11.6s: Social Mirror pop
  { frame: 402,  type: "click",          volume: 0.26 }, // 13.4s: Inner Drive pop
  { frame: 480,  type: "whoosh_fast",    volume: 0.34 }, // 16.0s: Scene 4 5-Axis Storm Matrix entrance
  { frame: 516,  type: "click",          volume: 0.24 }, // 17.2s: Friendships chip pop
  { frame: 570,  type: "click",          volume: 0.24 }, // 19.0s: Family expectations chip pop
  { frame: 672,  type: "whoosh_deep",    volume: 0.32 }, // 22.4s: Scene 5 Presenter Judy reality check entrance
  { frame: 813,  type: "whoosh_fast",    volume: 0.34 }, // 27.1s: Scene 6 Identity Sandbox entrance
  { frame: 894,  type: "whoosh_sparkle", volume: 0.32 }, // 29.8s: Version 3.0 "Becoming" sparkle reveal
  { frame: 960,  type: "whoosh_deep",    volume: 0.35 }, // 32.0s: Scene 7 Presenter Judy Full Body Finale entrance
  { frame: 1000, type: "whoosh_sparkle", volume: 0.35 }, // 33.3s: "You're still becoming you" insight
];

export const TeenageComposition: React.FC = () => {
  const { width, height, fps, durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();
  const currentMs = (frame / fps) * 1000;

  return (
    <div
      className="relative w-full h-full bg-[#f8fafc] text-slate-900 flex flex-col justify-between overflow-hidden select-none font-sans"
      style={{ width, height }}
    >
      {/* 0. High-Converting 4K Thumbnail First-Frame (Captured automatically by YouTube Shorts) */}
      {frame === 0 && (
        <div className="absolute inset-0 w-full h-full z-50 pointer-events-none">
          <TeenageThumbnail />
        </div>
      )}

      {/* 1. Voiceover Audio Track (High clarity volume 1.3) */}
      <Audio src={staticFile("teenage/voiceover.mp3")} volume={1.3} />

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

      {/* 4. Top Apple Sleek Progress Bar */}
      <AppleProgressBar />

      {/* 5. Apple Studio Mesh Background */}
      <TeenageBackground />

      {/* 6. Motion Graphics Storyboard Canvas */}
      <TeenageCanvas transcript={transcript} />

      {/* 7. Multi-Pose Character Presenter */}
      <TeenagePresenter currentMs={currentMs} />

      {/* 8. Kinetic Captions with Neon Apple Glow */}
      <AppleKineticCaptions transcript={transcript} />
    </div>
  );
};
