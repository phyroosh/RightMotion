import React from "react";
import { Audio, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { SmallCompromisesBackground } from "./Background";
import { SmallCompromisesCanvas } from "./Canvas";
import { SmallCompromisesPresenter } from "./Presenter";
import { AppleProgressBar } from "../../components/AppleProgressBar";
import { AppleKineticCaptions } from "../../components/AppleKineticCaptions";
import { SoundDesignEngine, SfxCue } from "../../components/SoundDesignEngine";
import { GroundedTextureEngine } from "../../components/texture";
import { SmallCompromisesThumbnail } from "../../thumbnails";
import rawTranscript from "./transcript.json";
import { WordTimestamp } from "../../types";
import "../../style.css";

const transcript: WordTimestamp[] = (rawTranscript as any[]).map((t) => ({
  word: t.word,
  startMs: t.startMs ?? t.start,
  endMs: t.endMs ?? t.end,
  speaker: t.speaker,
}));

// Multi-SFX audio cues synchronized with progressive visual reveals (60fps)
const SFX_CUES: SfxCue[] = [
  { frame: 0, type: "whoosh_deep", volume: 0.30 },
  { frame: 80, type: "click", volume: 0.24 },
  { frame: 155, type: "whoosh_fast", volume: 0.30 },
  { frame: 300, type: "click", volume: 0.26 },
  { frame: 425, type: "whoosh_deep", volume: 0.32 },
  { frame: 510, type: "whoosh_fast", volume: 0.34 },
  { frame: 575, type: "impact_hit", volume: 0.24 },
  { frame: 640, type: "whoosh_fast", volume: 0.28 },
  { frame: 870, type: "impact_hit", volume: 0.24 },
  { frame: 955, type: "whoosh_fast", volume: 0.30 },
  { frame: 1040, type: "click", volume: 0.26 },
  { frame: 1170, type: "click", volume: 0.24 },
  { frame: 1315, type: "whoosh_fast", volume: 0.32 },
  { frame: 1340, type: "whoosh_fast", volume: 0.30 },
  { frame: 1410, type: "impact_hit", volume: 0.26 },
  { frame: 1480, type: "whoosh_sparkle", volume: 0.32 },
  { frame: 1650, type: "click", volume: 0.26 },
  { frame: 1720, type: "impact_hit", volume: 0.26 },
];

export const SmallCompromisesComposition: React.FC = () => {
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
          <SmallCompromisesThumbnail />
        </div>
      )}

      {/* 1. Voiceover Audio Track */}
      <Audio src={staticFile("small_compromises/voiceover.mp3")} volume={1.3} />

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
      <SmallCompromisesBackground />

      {/* 6. Speech-Synchronized Progressive Reveal Canvas */}
      <SmallCompromisesCanvas transcript={transcript} />

      {/* 7. Multi-Pose Character Presenter */}
      <SmallCompromisesPresenter currentMs={currentMs} />

      {/* 8. Kinetic Captions with Neon Apple Glow */}
      <AppleKineticCaptions transcript={transcript} />

      {/* 9. Grounded Finishing Texture (Clean luminous ground: grain set to 0 for pristine sharpness) */}
      <GroundedTextureEngine grainOpacity={0} />
    </div>
  );
};
