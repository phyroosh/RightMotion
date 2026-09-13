import React from "react";
import { Audio, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { DopamineRealityBackground } from "./Background";
import { DopamineRealityCanvas } from "./Canvas";
import { DopamineRealityPresenter } from "./Presenter";
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
  { frame: 150, type: "whoosh_fast", volume: 0.32 },
  { frame: 258, type: "impact_hit", volume: 0.28 },
  { frame: 329, type: "whoosh_fast", volume: 0.32 },
  { frame: 350, type: "click", volume: 0.26 },
  { frame: 416, type: "whoosh_sparkle", volume: 0.34 },
  { frame: 554, type: "click", volume: 0.26 },
  { frame: 714, type: "whoosh_fast", volume: 0.32 },
  { frame: 780, type: "click", volume: 0.26 },
  { frame: 924, type: "click", volume: 0.26 },
  { frame: 1013, type: "impact_hit", volume: 0.26 },
  { frame: 1228, type: "whoosh_deep", volume: 0.30 },
  { frame: 1260, type: "impact_hit", volume: 0.28 },
  { frame: 1370, type: "click", volume: 0.28 },
  { frame: 1616, type: "click", volume: 0.28 },
  { frame: 1703, type: "whoosh_sparkle", volume: 0.34 },
  { frame: 1820, type: "impact_hit", volume: 0.26 },
];

export const DopamineRealityComposition: React.FC = () => {
  const { width, height, fps, durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();
  const currentMs = (frame / fps) * 1000;

  return (
    <div
      className="relative w-full h-full bg-[#fbfbfd] text-slate-900 flex flex-col justify-between overflow-hidden select-none font-sans"
      style={{ width, height }}
    >
      {/* 1. Voiceover Audio Track */}
      <Audio src={staticFile("dopamine_reality/voiceover.mp3")} volume={1.3} />

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
      <DopamineRealityBackground />

      {/* 6. Speech-Synchronized Progressive Reveal Canvas */}
      <DopamineRealityCanvas transcript={transcript} />

      {/* 7. Multi-Pose Character Presenter */}
      <DopamineRealityPresenter currentMs={currentMs} />

      {/* 8. Kinetic Captions with Neon Apple Glow */}
      <AppleKineticCaptions transcript={transcript} />

      {/* 9. Grounded Finishing Texture (Zero dirty grain on light mode) */}
      <GroundedTextureEngine grainOpacity={0} />
    </div>
  );
};
