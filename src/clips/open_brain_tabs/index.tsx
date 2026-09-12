import React from "react";
import { Audio, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { OpenBrainTabsBackground } from "./Background";
import { OpenBrainTabsCanvas } from "./Canvas";
import { OpenBrainTabsPresenter } from "./Presenter";
import { AppleProgressBar } from "../../components/AppleProgressBar";
import { AppleKineticCaptions } from "../../components/AppleKineticCaptions";
import { SoundDesignEngine, SfxCue } from "../../components/SoundDesignEngine";
import { GroundedTextureEngine } from "../../components/texture";
import { PlatformSafeOverlay } from "../../components/safe_area";
import { OpenBrainTabsThumbnail } from "../../thumbnails";
import rawTranscript from "./transcript.json";
import { WordTimestamp } from "../../types";
import "../../style.css";

const transcript: WordTimestamp[] = (rawTranscript as any[]).map((t) => ({
  word: t.word,
  startMs: t.startMs ?? t.start,
  endMs: t.endMs ?? t.end,
  speaker: t.speaker,
}));

// Multi-SFX audio cues synchronized with progressive visual reveals (60 FPS)
const SFX_CUES: SfxCue[] = [
  { frame: 0, type: "whoosh_deep", volume: 0.32 },
  { frame: 150, type: "whoosh_fast", volume: 0.28 },
  { frame: 165, type: "click", volume: 0.26 },
  { frame: 210, type: "click", volume: 0.26 },
  { frame: 252, type: "click", volume: 0.26 },
  { frame: 314, type: "impact_hit", volume: 0.24 },
  { frame: 378, type: "whoosh_fast", volume: 0.32 },
  { frame: 654, type: "impact_hit", volume: 0.28 },
  { frame: 826, type: "click", volume: 0.26 },
  { frame: 972, type: "whoosh_fast", volume: 0.28 },
  { frame: 1240, type: "impact_hit", volume: 0.26 },
  { frame: 1260, type: "whoosh_fast", volume: 0.30 },
  { frame: 1342, type: "whoosh_sparkle", volume: 0.34 },
  { frame: 1466, type: "click", volume: 0.28 },
  { frame: 1618, type: "click", volume: 0.28 },
  { frame: 1706, type: "impact_hit", volume: 0.26 },
  { frame: 1888, type: "click", volume: 0.32 },
  { frame: 1920, type: "whoosh_sparkle", volume: 0.34 },
];

export const OpenBrainTabsComposition: React.FC = () => {
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
          <OpenBrainTabsThumbnail />
        </div>
      )}

      {/* 1. Voiceover Audio Track */}
      <Audio src={staticFile("open_brain_tabs/voiceover.mp3")} volume={1.3} />

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
      <OpenBrainTabsBackground />

      {/* 6. Speech-Synchronized Progressive Reveal Canvas */}
      <OpenBrainTabsCanvas transcript={transcript} />

      {/* 7. Multi-Pose Character Presenter */}
      <OpenBrainTabsPresenter currentMs={currentMs} />

      {/* 8. Kinetic Captions with Neon Apple Glow */}
      <AppleKineticCaptions transcript={transcript} />

      {/* 9. Grounded Finishing Texture (35mm Living Grain + Halation + Vignette) */}
      <GroundedTextureEngine grainOpacity={0.042} />

      {/* 10. Platform Safe Area Composition Guide (Toggled via REMOTION_SAFE_OVERLAY=1 or prop) */}
      <PlatformSafeOverlay platform="YOUTUBE_SHORTS" visible={false} />
    </div>
  );
};
