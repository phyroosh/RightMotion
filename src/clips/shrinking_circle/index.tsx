import React from "react";
import { Audio, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ShrinkingCircleBackground } from "./Background";
import { ShrinkingCircleCanvas } from "./Canvas";
import { ShrinkingCirclePresenter } from "./Presenter";
import { AppleProgressBar } from "../../components/AppleProgressBar";
import { AppleKineticCaptions } from "../../components/AppleKineticCaptions";
import { SoundDesignEngine, SfxCue } from "../../components/SoundDesignEngine";
import { ShrinkingCircleThumbnail } from "../../thumbnails";
import rawTranscript from "./transcript.json";
import { WordTimestamp } from "../../types";
import "../../style.css";

const transcript: WordTimestamp[] = (rawTranscript as any[]).map((t) => ({
  word: t.word,
  startMs: t.startMs ?? t.start,
  endMs: t.endMs ?? t.end,
}));

// SFX audio cues reduced by 50% for studio-balanced documentary sound design
const SFX_CUES: SfxCue[] = [
  { frame: 0,   type: "whoosh_deep",    volume: 0.16 }, // 0.0s: Intro Presenter entrance
  { frame: 12,  type: "click",          volume: 0.12 }, // 0.4s: Topic badge pop
  { frame: 156, type: "whoosh_fast",    volume: 0.15 }, // 5.2s: Scene 1 3-Pillars Card entrance
  { frame: 318, type: "click",          volume: 0.12 }, // 10.6s: Pillar 1 Respect stamp
  { frame: 354, type: "click",          volume: 0.12 }, // 11.8s: Pillar 2 Support stamp
  { frame: 402, type: "whoosh_sparkle", volume: 0.15 }, // 13.4s: Pillar 3 Growth stamp
  { frame: 444, type: "whoosh_fast",    volume: 0.15 }, // 14.8s: Scene 2 Fake friends contrast
  { frame: 504, type: "impact_hit",     volume: 0.12 }, // 16.8s: Warning chip stamp
  { frame: 576, type: "whoosh_fast",    volume: 0.15 }, // 19.2s: Scene 3 Solitude filter transition
  { frame: 598, type: "impact_hit",     volume: 0.10 }, // 19.9s: Solitude reality hit
  { frame: 744, type: "whoosh_sparkle", volume: 0.16 }, // 24.8s: Scene 4 Peace epiphany reveal
  { frame: 864, type: "whoosh_sparkle", volume: 0.16 }, // 28.8s: Finale Presenter Re-Entry
];

export const ShrinkingCircleComposition: React.FC = () => {
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
          <ShrinkingCircleThumbnail />
        </div>
      )}

      {/* 1. Voiceover Audio Track (Locked Voice: en-US-AvaMultilingualNeural) */}
      <Audio src={staticFile("shrinking_circle/voiceover.mp3")} volume={1.3} />

      {/* 2. Ducked Background Ambient Music */}
      <Audio
        src={staticFile("audio/bgm/monume-documentary-documentary-music-547923.mp3")}
        volume={(f) =>
          interpolate(
            f,
            [0, 25, durationInFrames - 35, durationInFrames],
            [0, 0.09, 0.09, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          )
        }
        loop
      />

      {/* 3. Layered Subtle Sound Design Suite */}
      <SoundDesignEngine cues={SFX_CUES} />

      {/* 4. Top Apple Progress Bar */}
      <AppleProgressBar />

      {/* 5. Apple Studio Mesh Background with Drifting Ambient Energy */}
      <ShrinkingCircleBackground />

      {/* 6. Motion Graphics Storyboard Canvas with Progressive 3-Pillar & Contrast Storytelling */}
      <ShrinkingCircleCanvas transcript={transcript} />

      {/* 7. Multi-Pose Character Presenter */}
      <ShrinkingCirclePresenter currentMs={currentMs} />

      {/* 8. Kinetic Captions with Neon Apple Glow */}
      <AppleKineticCaptions transcript={transcript} />
    </div>
  );
};
