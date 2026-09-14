import React from "react";
import { Audio, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { WhatYouTolerateBackground } from "./Background";
import { WhatYouTolerateCanvas } from "./Canvas";
import { WhatYouToleratePresenter } from "./Presenter";
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

// Multi-SFX audio cues synchronized with progressive visual reveals
const SFX_CUES: SfxCue[] = [
  { frame: 0, type: "whoosh_deep", volume: 0.32 },
  { frame: 150, type: "whoosh_fast", volume: 0.32 },
  { frame: 190, type: "click", volume: 0.26 },
  { frame: 230, type: "click", volume: 0.26 },
  { frame: 270, type: "piano_hit", volume: 0.24 },
  { frame: 400, type: "whoosh_fast", volume: 0.30 },
  { frame: 460, type: "whoosh_fast", volume: 0.28 },
  { frame: 550, type: "impact_hit", volume: 0.26 },
  { frame: 650, type: "whoosh_deep", volume: 0.30 },
  { frame: 800, type: "click", volume: 0.24 },
  { frame: 922, type: "click", volume: 0.28 },
  { frame: 1072, type: "piano_hit", volume: 0.25 },
  { frame: 1224, type: "whoosh_fast", volume: 0.30 },
  { frame: 1381, type: "whoosh_sparkle", volume: 0.32 },
  { frame: 1525, type: "impact_hit", volume: 0.26 },
  { frame: 1669, type: "whoosh_sparkle", volume: 0.34 },
];

export const WhatYouTolerateComposition: React.FC = () => {
  const { width, height, fps, durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();
  const currentMs = (frame / fps) * 1000;

  return (
    <div
      className="relative w-full h-full bg-[#fbfbfd] text-slate-900 flex flex-col justify-between overflow-hidden select-none font-sans"
      style={{ width, height }}
    >
      {/* 1. Voiceover Audio Track */}
      <Audio src={staticFile("what_you_tolerate/voiceover.mp3")} volume={1.3} />

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
      <WhatYouTolerateBackground />

      {/* 6. Speech-Synchronized Progressive Reveal Canvas */}
      <WhatYouTolerateCanvas transcript={transcript} />

      {/* 7. Multi-Pose Character Presenter */}
      <WhatYouToleratePresenter currentMs={currentMs} />

      {/* 8. Kinetic Captions with Neon Apple Glow */}
      <AppleKineticCaptions transcript={transcript} />

      {/* 9. Grounded Finishing Texture (Zero dirty grain on light mode) */}
      <GroundedTextureEngine grainOpacity={0} />
    </div>
  );
};
