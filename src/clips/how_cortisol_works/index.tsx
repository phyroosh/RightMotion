import React from "react";
import { Audio, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { HowCortisolWorksBackground } from "./Background";
import { HowCortisolWorksCanvas } from "./Canvas";
import { HowCortisolWorksPresenter } from "./Presenter";
import { AppleProgressBar } from "../../components/AppleProgressBar";
import { AppleKineticCaptions } from "../../components/AppleKineticCaptions";
import { SoundDesignEngine, SfxCue } from "../../components/SoundDesignEngine";
import { GroundedTextureEngine } from "../../components/texture";
import rawTranscript from "./transcript.json";
import { WordTimestamp } from "../../types";
import "../../style.css";

const transcript: WordTimestamp[] = (rawTranscript as any[]).map((t) => ({
  word: t.word,
  startMs: t.startMs ?? t.start,
  endMs: t.endMs ?? t.end,
  speaker: t.speaker,
}));

// Multi-SFX audio cues synchronized with progressive visual reveals (at 60fps)
const SFX_CUES: SfxCue[] = [
  { frame: 0, type: "whoosh_deep", volume: 0.32 },
  { frame: 208, type: "whoosh_fast", volume: 0.32 },
  { frame: 316, type: "impact_hit", volume: 0.26 },
  { frame: 356, type: "whoosh_fast", volume: 0.34 },
  { frame: 600, type: "click", volume: 0.28 },
  { frame: 688, type: "click", volume: 0.28 },
  { frame: 755, type: "click", volume: 0.28 },
  { frame: 852, type: "whoosh_deep", volume: 0.30 },
  { frame: 904, type: "impact_hit", volume: 0.28 },
  { frame: 972, type: "impact_hit", volume: 0.26 },
  { frame: 1110, type: "click", volume: 0.26 },
  { frame: 1260, type: "impact_hit", volume: 0.26 },
  { frame: 1324, type: "impact_hit", volume: 0.26 },
  { frame: 1460, type: "whoosh_sparkle", volume: 0.34 },
  { frame: 1549, type: "click", volume: 0.28 },
  { frame: 1706, type: "click", volume: 0.28 },
  { frame: 1825, type: "whoosh_sparkle", volume: 0.32 },
];

export const HowCortisolWorksComposition: React.FC = () => {
  const { width, height, fps, durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();
  const currentMs = (frame / fps) * 1000;

  return (
    <div
      className="relative w-full h-full bg-[#fbfbfd] text-slate-900 flex flex-col justify-between overflow-hidden select-none font-sans"
      style={{ width, height }}
    >
      {/* 1. Voiceover Audio Track */}
      <Audio src={staticFile("how_cortisol_works/voiceover.mp3")} volume={1.3} />

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
      <HowCortisolWorksBackground />

      {/* 6. Speech-Synchronized Progressive Reveal Canvas */}
      <HowCortisolWorksCanvas transcript={transcript} />

      {/* 7. Multi-Pose Character Presenter */}
      <HowCortisolWorksPresenter currentMs={currentMs} />

      {/* 8. Kinetic Captions with Neon Apple Glow */}
      <AppleKineticCaptions transcript={transcript} />

      {/* 9. Grounded Finishing Texture (Zero dirty grain on light mode) */}
      <GroundedTextureEngine grainOpacity={0} />
    </div>
  );
};
