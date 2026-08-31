import React from "react";
import { Audio, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { SayingNoBackground } from "./Background";
import { SayingNoCanvas } from "./Canvas";
import { SayingNoPresenter } from "./Presenter";
import { AppleProgressBar } from "../../components/AppleProgressBar";
import { AppleKineticCaptions } from "../../components/AppleKineticCaptions";
import { SoundDesignEngine, SfxCue } from "../../components/SoundDesignEngine";
import { SayingNoThumbnail } from "../../thumbnails";
import rawTranscript from "./transcript.json";
import { WordTimestamp } from "../../types";
import "../../style.css";

const transcript: WordTimestamp[] = (rawTranscript as any[]).map((t) => ({
  word: t.word,
  startMs: t.startMs ?? t.start,
  endMs: t.endMs ?? t.end,
}));

// Rich multi-SFX audio triggers — tied strictly to actual visual card & presenter entrances
const SFX_CUES: SfxCue[] = [
  { frame: 0,   type: "whoosh_deep",    volume: 0.32 }, // 0.0s: Intro Presenter entrance
  { frame: 12,  type: "click",          volume: 0.26 }, // 0.4s: Topic badge spring pop
  { frame: 156, type: "whoosh_fast",    volume: 0.34 }, // 5.2s: Scene 1 Storyboard card entrance
  { frame: 243, type: "click",          volume: 0.28 }, // 8.1s: Script 1 spring pop
  { frame: 342, type: "click",          volume: 0.28 }, // 11.4s: Script 2 spring pop
  { frame: 414, type: "whoosh_fast",    volume: 0.34 }, // 13.8s: Scene 2 Calm Shield entrance
  { frame: 465, type: "impact_hit",     volume: 0.22 }, // 15.5s: "Calmly Repeat" diagnostic hit
  { frame: 564, type: "whoosh_fast",    volume: 0.34 }, // 18.8s: Scene 3 Boundary Filter entrance
  { frame: 624, type: "whoosh_sparkle", volume: 0.30 }, // 20.8s: Real Allies revelation
  { frame: 720, type: "whoosh_sparkle", volume: 0.35 }, // 24.0s: Finale Presenter Re-Entry
];

export const SayingNoComposition: React.FC = () => {
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
          <SayingNoThumbnail />
        </div>
      )}

      {/* 1. Voiceover Audio Track */}
      <Audio src={staticFile("saying_no/voiceover.mp3")} volume={1.3} />

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

      {/* 3. Rich Layered Sound Design Engine (Whooshes, Hits, Sparkles & Tactile Clicks) */}
      <SoundDesignEngine cues={SFX_CUES} />

      {/* 4. Top Apple Sleek Progress Bar */}
      <AppleProgressBar />

      {/* 5. Apple Studio Mesh Background */}
      <SayingNoBackground />

      {/* 6. Motion Graphics Storyboard Canvas */}
      <SayingNoCanvas transcript={transcript} />

      {/* 7. Multi-Pose Character Presenter */}
      <SayingNoPresenter currentMs={currentMs} />

      {/* 8. Kinetic Captions with Neon Apple Glow */}
      <AppleKineticCaptions transcript={transcript} />
    </div>
  );
};
