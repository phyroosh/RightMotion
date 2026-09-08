import React from "react";
import { Audio, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { TheTruthAboutSleepBackground } from "./Background";
import { TheTruthAboutSleepCanvas } from "./Canvas";
import { TheTruthAboutSleepPresenter } from "./Presenter";
import { AppleProgressBar } from "../../components/AppleProgressBar";
import { AppleKineticCaptions } from "../../components/AppleKineticCaptions";
import { SoundDesignEngine, SfxCue } from "../../components/SoundDesignEngine";
import { GroundedTextureEngine } from "../../components/texture";
import { TheTruthAboutSleepThumbnail } from "../../thumbnails";
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
    "type": "whoosh_sparkle",
    "volume": 0.32
  },
  {
    "frame": 25,
    "type": "click",
    "volume": 0.26
  },
  {
    "frame": 210,
    "type": "whoosh_deep",
    "volume": 0.3
  },
  {
    "frame": 234,
    "type": "click",
    "volume": 0.28
  },
  {
    "frame": 254,
    "type": "click",
    "volume": 0.28
  },
  {
    "frame": 435,
    "type": "whoosh_deep",
    "volume": 0.3
  },
  {
    "frame": 453,
    "type": "click",
    "volume": 0.32
  },
  {
    "frame": 660,
    "type": "whoosh_deep",
    "volume": 0.32
  },
  {
    "frame": 680,
    "type": "click",
    "volume": 0.24
  },
  {
    "frame": 700,
    "type": "click",
    "volume": 0.24
  },
  {
    "frame": 720,
    "type": "whoosh_sparkle",
    "volume": 0.35
  },
  {
    "frame": 0,
    "type": "whoosh_deep",
    "volume": 0.32
  },
  {
    "frame": 42,
    "type": "click",
    "volume": 0.22
  },
  {
    "frame": 185,
    "type": "click",
    "volume": 0.26
  },
  {
    "frame": 741,
    "type": "click",
    "volume": 0.28
  },
  {
    "frame": 225,
    "type": "whoosh_sparkle",
    "volume": 0.24
  },
  {
    "frame": 63,
    "type": "whoosh_fast",
    "volume": 0.28
  },
  {
    "frame": 63,
    "type": "click",
    "volume": 0.24
  },
  {
    "frame": 113,
    "type": "whoosh_deep",
    "volume": 0.28
  },
  {
    "frame": 225,
    "type": "click",
    "volume": 0.26
  },
  {
    "frame": 293,
    "type": "click",
    "volume": 0.26
  },
  {
    "frame": 640,
    "type": "click",
    "volume": 0.26
  },
  {
    "frame": 917,
    "type": "click",
    "volume": 0.26
  },
  {
    "frame": 965,
    "type": "whoosh_sparkle",
    "volume": 0.32
  },
  {
    "frame": 965,
    "type": "click",
    "volume": 0.32
  }
];

export const TheTruthAboutSleepComposition: React.FC = () => {
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
          <TheTruthAboutSleepThumbnail />
        </div>
      )}

      {/* 1. Voiceover Audio Track */}
      <Audio src={staticFile("the_truth_about_sleep/voiceover.mp3")} volume={1.3} />

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
      <TheTruthAboutSleepBackground />

      {/* 6. Speech-Synchronized Progressive Reveal Canvas */}
      <TheTruthAboutSleepCanvas transcript={transcript} />

      {/* 7. Multi-Pose Character Presenter */}
      <TheTruthAboutSleepPresenter currentMs={currentMs} />

      {/* 8. Kinetic Captions with Neon Apple Glow */}
      <AppleKineticCaptions transcript={transcript} />

      {/* 9. Grounded Finishing Texture (35mm Living Grain + Halation + Vignette) */}
      <GroundedTextureEngine grainOpacity={0.042} />
    </div>
  );
};
