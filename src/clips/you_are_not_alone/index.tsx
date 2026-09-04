import React from "react";
import { Audio, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { YouAreNotAloneBackground } from "./Background";
import { YouAreNotAloneCanvas } from "./Canvas";
import { YouAreNotAlonePresenter } from "./Presenter";
import { AppleProgressBar } from "../../components/AppleProgressBar";
import { AppleKineticCaptions } from "../../components/AppleKineticCaptions";
import { SoundDesignEngine, SfxCue } from "../../components/SoundDesignEngine";
import { YouAreNotAloneThumbnail } from "../../thumbnails";
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
  { frame: 0,   type: "whoosh_deep",    volume: 0.30 }, // 0.0s: Judy Intro A-Roll
  { frame: 35,  type: "click",          volume: 0.24 }, // 1.2s: Apple glass badge lock
  { frame: 105, type: "whoosh_fast",    volume: 0.18 }, // 3.5s: Scene 1 Card Drop
  { frame: 112, type: "whoosh_sparkle", volume: 0.30 }, // 3.7s: Mindful gratitude cutout stamp
  { frame: 205, type: "impact_hit",     volume: 0.22 }, // 6.8s: Reality box pop
  { frame: 251, type: "click",          volume: 0.26 }, // 8.4s: Shift box pop
  { frame: 306, type: "whoosh_fast",    volume: 0.18 }, // 10.2s: Scene 2 Card Drop
  { frame: 310, type: "click",          volume: 0.26 }, // 10.3s: Gift 01: Meaning
  { frame: 365, type: "click",          volume: 0.26 }, // 12.1s: Gift 02: Hope
  { frame: 379, type: "click",          volume: 0.26 }, // 12.6s: Gift 03: Support
  { frame: 391, type: "whoosh_sparkle", volume: 0.30 }, // 13.0s: Status bar lock
  { frame: 450, type: "whoosh_fast",    volume: 0.18 }, // 15.0s: Scene 3 Card Drop
  { frame: 452, type: "impact_hit",     volume: 0.22 }, // 15.1s: Old isolation thought
  { frame: 538, type: "whoosh_sparkle", volume: 0.32 }, // 17.9s: Faith reframe
  { frame: 636, type: "whoosh_fast",    volume: 0.18 }, // 21.2s: Scene 4 Card Drop
  { frame: 640, type: "whoosh_sparkle", volume: 0.30 }, // 21.3s: Enlightened cutout
  { frame: 711, type: "click",          volume: 0.26 }, // 23.7s: Next step action pill
  { frame: 762, type: "whoosh_deep",    volume: 0.30 }, // 25.4s: Judy Finale re-entry
  { frame: 768, type: "impact_hit",     volume: 0.24 }, // 25.6s: Closing truth punch
];

export const YouAreNotAloneComposition: React.FC = () => {
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
          <YouAreNotAloneThumbnail />
        </div>
      )}

      {/* 1. Voiceover Audio Track */}
      <Audio src={staticFile("you_are_not_alone/voiceover.mp3")} volume={1.3} />

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
      <YouAreNotAloneBackground />

      {/* 6. Speech-Synchronized Progressive Reveal Canvas */}
      <YouAreNotAloneCanvas transcript={transcript} />

      {/* 7. Multi-Pose Character Presenter */}
      <YouAreNotAlonePresenter currentMs={currentMs} />

      {/* 8. Kinetic Captions with Neon Apple Glow */}
      <AppleKineticCaptions transcript={transcript} />
    </div>
  );
};
