import React from "react";
import { Audio, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { TheLawOfStructuralLoadBackground } from "./Background";
import { TheLawOfStructuralLoadCanvas } from "./Canvas";
import { TheLawOfStructuralLoadPresenter } from "./Presenter";
import { AppleProgressBar } from "../../components/AppleProgressBar";
import { AppleKineticCaptions } from "../../components/AppleKineticCaptions";
import { SoundDesignEngine, SfxCue } from "../../components/SoundDesignEngine";
import { GroundedTextureEngine } from "../../components/texture";
import { TheLawOfStructuralLoadThumbnail } from "../../thumbnails";
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
  {
    "frame": 0,
    "type": "whoosh_deep",
    "volume": 0.32
  },
  {
    "frame": 65,
    "type": "whoosh_fast",
    "volume": 0.32
  },
  {
    "frame": 151,
    "type": "whoosh_fast",
    "volume": 0.34
  },
  {
    "frame": 497,
    "type": "click",
    "volume": 0.28
  },
  {
    "frame": 226,
    "type": "whoosh_sparkle",
    "volume": 0.24
  },
  {
    "frame": 226,
    "type": "click",
    "volume": 0.26
  },
  {
    "frame": 282,
    "type": "click",
    "volume": 0.26
  },
  {
    "frame": 357,
    "type": "click",
    "volume": 0.26
  },
  {
    "frame": 445,
    "type": "click",
    "volume": 0.26
  },
  {
    "frame": 476,
    "type": "whoosh_sparkle",
    "volume": 0.32
  },
  {
    "frame": 566,
    "type": "click",
    "volume": 0.32
  }
];

export const TheLawOfStructuralLoadComposition: React.FC = () => {
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
          <TheLawOfStructuralLoadThumbnail />
        </div>
      )}

      {/* 1. Voiceover Audio Track */}
      <Audio src={staticFile("the_law_of_structural_load/voiceover.mp3")} volume={1.3} />

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
      <TheLawOfStructuralLoadBackground />

      {/* 6. Speech-Synchronized Progressive Reveal Canvas */}
      <TheLawOfStructuralLoadCanvas transcript={transcript} />

      {/* 7. Multi-Pose Character Presenter */}
      <TheLawOfStructuralLoadPresenter currentMs={currentMs} />

      {/* 8. Kinetic Captions with Neon Apple Glow */}
      <AppleKineticCaptions transcript={transcript} />

      {/* 9. Grounded Finishing Texture (Halation + Vignette, pristine light canvas) */}
      <GroundedTextureEngine />
    </div>
  );
};
