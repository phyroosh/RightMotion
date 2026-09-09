import React from "react";
import { Audio, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { TheCortisolInversionBackground } from "./Background";
import { TheCortisolInversionCanvas } from "./Canvas";
import { TheCortisolInversionPresenter } from "./Presenter";
import { AppleProgressBar } from "../../components/AppleProgressBar";
import { AppleKineticCaptions } from "../../components/AppleKineticCaptions";
import { SoundDesignEngine, SfxCue } from "../../components/SoundDesignEngine";
import { GroundedTextureEngine } from "../../components/texture";
import { TheCortisolInversionThumbnail } from "../../thumbnails";
import { FontLoader } from "../../components/FontLoader";
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
    frame: 0,
    type: "whoosh_deep",
    volume: 0.32,
  },
  {
    frame: 15,
    type: "whoosh_fast",
    volume: 0.28,
  },
  {
    frame: 70,
    type: "click",
    volume: 0.22,
  },
  {
    frame: 145,
    type: "whoosh_deep",
    volume: 0.30,
  },
  {
    frame: 180,
    type: "click",
    volume: 0.28,
  },
  {
    frame: 220,
    type: "click",
    volume: 0.28,
  },
  {
    frame: 250,
    type: "click",
    volume: 0.28,
  },
  {
    frame: 295,
    type: "whoosh_sparkle",
    volume: 0.32,
  },
  {
    frame: 360,
    type: "whoosh_fast",
    volume: 0.28,
  },
  {
    frame: 505,
    type: "whoosh_deep",
    volume: 0.32,
  },
  {
    frame: 537,
    type: "click",
    volume: 0.24,
  },
  {
    frame: 569,
    type: "click",
    volume: 0.24,
  },
  {
    frame: 601,
    type: "click",
    volume: 0.24,
  },
  {
    frame: 633,
    type: "whoosh_sparkle",
    volume: 0.35,
  },
];

export const TheCortisolInversionComposition: React.FC = () => {
  const { width, height, fps, durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();
  const currentMs = (frame / fps) * 1000;

  return (
    <div
      className="relative w-full h-full bg-black text-white flex flex-col justify-between overflow-hidden select-none font-display"
      style={{ width, height }}
    >
      {/* Font Loader for offline + online typography */}
      <FontLoader />

      {/* 0. High-Converting 4K Thumbnail First-Frame */}
      {frame === 0 && (
        <div className="absolute inset-0 w-full h-full z-50 pointer-events-none">
          <TheCortisolInversionThumbnail />
        </div>
      )}

      {/* 1. Voiceover Audio Track */}
      <Audio src={staticFile("the_cortisol_inversion/voiceover.mp3")} volume={1.3} />

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
      <AppleProgressBar accentColor="#38bdf8" />

      {/* 5. Deep Obsidian Void Background */}
      <TheCortisolInversionBackground />

      {/* 6. Pure 10/10 Motion Graphics Suite Canvas */}
      <TheCortisolInversionCanvas transcript={transcript} />

      {/* 7. Presenter Layer */}
      <TheCortisolInversionPresenter currentMs={currentMs} />

      {/* 8. Kinetic Captions with Neon Apple Glow */}
      <AppleKineticCaptions
        transcript={transcript}
        theme="dark"
        activeColor="#38bdf8"
        maxWordsPerGroup={3}
      />

      {/* 9. Grounded Finishing Texture (35mm Living Grain + Halation + Vignette) */}
      <GroundedTextureEngine grainOpacity={0.035} />
    </div>
  );
};
