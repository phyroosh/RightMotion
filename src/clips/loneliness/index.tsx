import React from "react";
import { Audio, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { LonelinessBackground } from "./Background";
import { LonelinessCanvas } from "./Canvas";
import { LonelinessPresenter } from "./Presenter";
import { AppleProgressBar } from "../../components/AppleProgressBar";
import { AppleKineticCaptions } from "../../components/AppleKineticCaptions";
import { SoundDesignEngine, SfxCue } from "../../components/SoundDesignEngine";
import { LonelinessThumbnail } from "../../thumbnails";
import rawTranscript from "./transcript.json";
import { WordTimestamp } from "../../types";
import "../../style.css";

const transcript: WordTimestamp[] = (rawTranscript as any[]).map((t) => ({
  word: t.word,
  startMs: t.startMs ?? t.start,
  endMs: t.endMs ?? t.end,
}));

// Rich multi-SFX sound design cues tied 1:1 to visual entrances
const SFX_CUES: SfxCue[] = [
  { frame: 0,   type: "whoosh_deep",    volume: 0.32 }, // 0.0s: Intro Presenter entrance
  { frame: 12,  type: "click",          volume: 0.26 }, // 0.4s: Topic badge spring pop
  { frame: 156, type: "whoosh_fast",    volume: 0.34 }, // 5.2s: Scene 1 Connection vs Closeness
  { frame: 186, type: "click",          volume: 0.26 }, // 6.2s: Emotional intimacy contrast
  { frame: 300, type: "whoosh_fast",    volume: 0.34 }, // 10.0s: Scene 2 Interaction audit
  { frame: 320, type: "click",          volume: 0.24 }, // 10.6s: Watch life chip
  { frame: 354, type: "click",          volume: 0.24 }, // 11.8s: Like post chip
  { frame: 390, type: "click",          volume: 0.24 }, // 13.0s: Reply story chip
  { frame: 450, type: "impact_hit",     volume: 0.22 }, // 15.0s: "I'm not okay" sanctuary hit
  { frame: 558, type: "whoosh_fast",    volume: 0.34 }, // 18.6s: Scene 3 Highlight reel distortion
  { frame: 690, type: "impact_hit",     volume: 0.22 }, // 23.0s: Isolation illusion diagnostic hit
  { frame: 786, type: "whoosh_fast",    volume: 0.34 }, // 26.2s: Scene 4 Screen saturation shift
  { frame: 840, type: "whoosh_sparkle", volume: 0.32 }, // 28.0s: 1 Real person breakthrough
  { frame: 966, type: "whoosh_sparkle", volume: 0.35 }, // 32.2s: Finale Presenter Re-Entry
];

export const LonelinessComposition: React.FC = () => {
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
          <LonelinessThumbnail />
        </div>
      )}

      {/* 1. Voiceover Audio Track */}
      <Audio src={staticFile("loneliness/voiceover.mp3")} volume={1.3} />

      {/* 2. Ducked Background Ambient Music */}
      <Audio
        src={staticFile("audio/bgm/the_mountain-piano-documentary-567436.mp3")}
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
      <LonelinessBackground />

      {/* 6. Motion Graphics Storyboard Canvas */}
      <LonelinessCanvas transcript={transcript} />

      {/* 7. Multi-Pose Character Presenter */}
      <LonelinessPresenter currentMs={currentMs} />

      {/* 8. Kinetic Captions with Neon Apple Glow */}
      <AppleKineticCaptions transcript={transcript} />
    </div>
  );
};
