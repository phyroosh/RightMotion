import React from "react";
import { Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { PushingAwayBackground } from "./Background";
import { PushingAwayCanvas } from "./Canvas";
import { PushingAwayPresenter } from "./Presenter";
import { AppleProgressBar } from "../../components/AppleProgressBar";
import { AppleKineticCaptions } from "../../components/AppleKineticCaptions";
import { SoundDesignEngine, SfxCue } from "../../components/SoundDesignEngine";
import { CameraShake } from "../../components/kinetic_text/CameraShake";
import { PushingAwayThumbnail } from "../../thumbnails";
import rawTranscript from "./transcript.json";
import { WordTimestamp } from "../../types";

const transcript: WordTimestamp[] = (rawTranscript as any[]).map((t) => ({
  word: t.word,
  start: t.start,
  end: t.end,
  startMs: t.startMs ?? t.start,
  endMs: t.endMs ?? t.end,
}));

// Synchronized Multi-SFX suite including tactile foley cues
const SFX_CUES: SfxCue[] = [
  { frame: 0,    type: "whoosh_deep",      volume: 0.32 }, // 0.0s: Judy intro entrance
  { frame: 3,    type: "tape_snap",        volume: 0.30 }, // 0.1s: Masking tape snap
  { frame: 45,   type: "marker_scribble",  volume: 0.34 }, // 1.5s: Hand-drawn doodle circle
  { frame: 129,  type: "whoosh_fast",      volume: 0.18 }, // 4.3s: 3-step retreat entrance
  { frame: 141,  type: "click",            volume: 0.26 }, // 4.7s: Step 1 lock
  { frame: 192,  type: "impact_hit",       volume: 0.24 }, // 6.4s: Step 3 glitch impact
  { frame: 258,  type: "whoosh_fast",      volume: 0.18 }, // 8.6s: Isometric 3D card
  { frame: 285,  type: "marker_scribble",  volume: 0.32 }, // 9.5s: Highlighter glide
  { frame: 366,  type: "whoosh_deep",      volume: 0.34 }, // 12.2s: 3D Virtual Camera swoop
  { frame: 384,  type: "impact_hit",       volume: 0.26 }, // 12.8s: Vulnerable fracture
  { frame: 525,  type: "whoosh_fast",      volume: 0.18 }, // 17.5s: Leave First card
  { frame: 672,  type: "marker_scribble",  volume: 0.34 }, // 22.4s: X scratch-out doodle
  { frame: 738,  type: "whoosh_fast",      volume: 0.18 }, // 24.6s: Fear card entrance
  { frame: 765,  type: "impact_hit",       volume: 0.26 }, // 25.5s: Gravity drop thud
  { frame: 840,  type: "whoosh_fast",      volume: 0.18 }, // 28.0s: PropComparison entrance
  { frame: 906,  type: "click",            volume: 0.26 }, // 30.2s: Honesty card reveal
  { frame: 987,  type: "whoosh_sparkle",   volume: 0.35 }, // 32.9s: Finale closure radiant
  { frame: 1026, type: "marker_scribble",  volume: 0.32 }, // 34.2s: Underline doodle
];

// Screen trauma impact frames
const SHAKE_FRAMES = [192, 384, 765];

export const PushingAwayComposition: React.FC = () => {
  const { width, height, fps, durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();
  const currentMs = (frame / fps) * 1000;

  return (
    <div
      className="relative overflow-hidden bg-[#f8fafc] select-none"
      style={{ width, height, fontFamily: "system-ui, -apple-system, sans-serif" }}
    >
      {/* 0. High-Converting 4K Thumbnail First-Frame (Captured by YouTube Shorts) */}
      {frame === 0 && (
        <div className="absolute inset-0 w-full h-full z-50 pointer-events-none">
          <PushingAwayThumbnail />
        </div>
      )}

      {/* 1. Camera Trauma Wrapper (Shakes screen subtly on impact hits) */}
      <CameraShake triggerFrames={SHAKE_FRAMES} intensity={7}>
        {/* 2. Living Studio Background & Documentary Grain */}
        <PushingAwayBackground />

        {/* 3. Motion Canvas with 3D Camera, Isometric Cards, Doodles & Physics */}
        <PushingAwayCanvas transcript={transcript} />

        {/* 4. Presenter (Judy multi-pose animations) */}
        <PushingAwayPresenter currentMs={currentMs} />

        {/* 5. Central Kinetic Captions */}
        <AppleKineticCaptions
          transcript={transcript}
          currentMs={currentMs}
          maxWordsPerGroup={2}
          theme="light"
          activeColor="#0071e3"
        />
      </CameraShake>

      {/* 6. Apple Studio Progress Bar */}
      <AppleProgressBar accentColor="#f43f5e" />

      {/* 7. Neural Voiceover Audio (+30% volume boost) */}
      <Audio
        src={staticFile("pushing_away/voiceover.mp3")}
        volume={1.3}
      />

      {/* 8. Subtle Documentary Ambient BGM */}
      <Audio
        src={staticFile("audio/bgm/monume-documentary-documentary-music-547923.mp3")}
        volume={0.12}
      />

      {/* 9. Event-driven Layered SFX Suite */}
      <SoundDesignEngine cues={SFX_CUES} />
    </div>
  );
};
