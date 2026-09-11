import React from "react";
import { Audio, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { BrainToleranceBackground } from "./Background";
import { BrainToleranceCanvas } from "./Canvas";
import { BrainTolerancePresenter } from "./Presenter";
import { AppleProgressBar } from "../../components/AppleProgressBar";
import { AppleKineticCaptions } from "../../components/AppleKineticCaptions";
import { SoundDesignEngine, SfxCue } from "../../components/SoundDesignEngine";
import { GroundedTextureEngine } from "../../components/texture";
import { BrainToleranceThumbnail } from "../../thumbnails";
import rawTranscript from "./transcript.json";
import { WordTimestamp } from "../../types";
import "../../style.css";

const transcript: WordTimestamp[] = (rawTranscript as any[]).map((t) => ({
  word: t.word,
  startMs: t.startMs ?? t.start,
  endMs: t.endMs ?? t.end,
  speaker: t.speaker,
}));

// Multi-SFX audio cues synchronized with progressive visual reveals
const SFX_CUES: SfxCue[] = [
  { frame: 0, type: "whoosh_deep", volume: 0.32 },
  { frame: 75, type: "whoosh_fast", volume: 0.28 },
  { frame: 85, type: "marker_scribble", volume: 0.30 },
  { frame: 136, type: "click", volume: 0.28 },
  { frame: 185, type: "click", volume: 0.28 },
  { frame: 224, type: "click", volume: 0.28 },
  { frame: 280, type: "impact_hit", volume: 0.25 },
  { frame: 367, type: "whoosh_sparkle", volume: 0.32 },
  { frame: 517, type: "click", volume: 0.26 },
  { frame: 561, type: "whoosh_fast", volume: 0.26 },
  { frame: 590, type: "whoosh_fast", volume: 0.35 },
  { frame: 594, type: "impact_hit", volume: 0.30 },
  { frame: 664, type: "whoosh_sparkle", volume: 0.35 },
  { frame: 716, type: "click", volume: 0.28 },
  { frame: 784, type: "click", volume: 0.28 },
  { frame: 838, type: "click", volume: 0.28 },
  { frame: 923, type: "whoosh_cinematic", volume: 0.36 },
  { frame: 935, type: "marker_scribble", volume: 0.32 },
];

export const BrainToleranceComposition: React.FC = () => {
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
          <BrainToleranceThumbnail />
        </div>
      )}

      {/* 1. Voiceover Audio Track */}
      <Audio src={staticFile("brain_tolerance/voiceover.mp3")} volume={1.3} />

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
      <BrainToleranceBackground />

      {/* 6. Speech-Synchronized Progressive Reveal Canvas */}
      <BrainToleranceCanvas transcript={transcript} />

      {/* 7. Multi-Pose Character Presenter */}
      <BrainTolerancePresenter currentMs={currentMs} />

      {/* 8. Kinetic Captions with Neon Apple Glow */}
      <AppleKineticCaptions transcript={transcript} />

      {/* 9. Grounded Finishing Texture (Zero dirty grain on light canvas for razor sharpness) */}
      <GroundedTextureEngine theme="light" grainOpacity={0} enableHalation={false} vignetteStrength={0.03} />
    </div>
  );
};
