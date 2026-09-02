import React from "react";
import { Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { TheCompoundingTrapBackground } from "./Background";
import { TheCompoundingTrapCanvas } from "./Canvas";
import { TheCompoundingTrapPresenter } from "./Presenter";
import { AppleProgressBar } from "../../components/AppleProgressBar";
import { AppleKineticCaptions } from "../../components/AppleKineticCaptions";
import { SoundDesignEngine, SfxCue } from "../../components/SoundDesignEngine";
import { CameraShake } from "../../components/kinetic_text/CameraShake";
import { TheCompoundingTrapThumbnail } from "../../thumbnails";
import rawTranscript from "./transcript.json";
import { WordTimestamp } from "../../types";

const transcript: WordTimestamp[] = (rawTranscript as any[]).map((t) => ({
  word: t.word,
  start: t.start,
  end: t.end,
  startMs: t.startMs ?? t.start,
  endMs: t.endMs ?? t.end,
}));

// 💹 Finance Apex Wealth SFX Suite
// Fast-cut: cash thuds, ticker chimes, cinematic sub-bass drops
const SFX_CUES: SfxCue[] = [
  { frame: 0,   type: "whoosh_deep",    volume: 0.34 }, // 0.0s:  Scene 1 explosive entry
  { frame: 30,  type: "impact_hit",     volume: 0.24 }, // 1.0s:  Ticker badge stamp
  { frame: 60,  type: "click",          volume: 0.26 }, // 2.0s:  Isometric card lock
  { frame: 135, type: "whoosh_fast",    volume: 0.18 }, // 4.5s:  Scene 2 whip-left cut
  { frame: 138, type: "impact_hit",     volume: 0.24 }, // 4.6s:  GlitchText: CASH IS NOT SAFE
  { frame: 210, type: "click",          volume: 0.26 }, // 7.0s:  Badge stamp
  { frame: 264, type: "whoosh_deep",    volume: 0.34 }, // 8.8s:  Scene 3 isometric shelf
  { frame: 285, type: "click",          volume: 0.26 }, // 9.5s:  Inflation bars
  { frame: 315, type: "impact_hit",     volume: 0.24 }, // 10.5s: Bar 1
  { frame: 345, type: "impact_hit",     volume: 0.24 }, // 11.5s: Bar 2
  { frame: 375, type: "impact_hit",     volume: 0.26 }, // 12.5s: Bar 3 critical
  { frame: 420, type: "whoosh_fast",    volume: 0.18 }, // 14.0s: Scene 4 — gravity drop
  { frame: 426, type: "impact_hit",     volume: 0.28 }, // 14.2s: SemanticWord gravity thud
  { frame: 500, type: "click",          volume: 0.26 }, // 16.7s: WealthMultiplierMeter lock
  { frame: 600, type: "whoosh_deep",    volume: 0.34 }, // 20.0s: Scene 5 VirtualCamera swoop
  { frame: 615, type: "whoosh_sparkle", volume: 0.32 }, // 20.5s: CompoundGrowthChart reveal
  { frame: 780, type: "whoosh_fast",    volume: 0.18 }, // 26.0s: Scene 6 whip-left
  { frame: 786, type: "impact_hit",     volume: 0.28 }, // 26.2s: SemanticWord fracture
  { frame: 840, type: "tape_snap",      volume: 0.30 }, // 28.0s: CashFlowSankeyCard tap
  { frame: 930, type: "whoosh_deep",    volume: 0.34 }, // 31.0s: Scene 7 finale
  { frame: 945, type: "whoosh_sparkle", volume: 0.35 }, // 31.5s: GlitchText: PLAYING IT SAFE
  { frame: 990, type: "impact_hit",     volume: 0.26 }, // 33.0s: Final badge stamp
];

// Screen trauma on fast-cut impact moments
const SHAKE_FRAMES = [138, 426, 786];

export const TheCompoundingTrapComposition: React.FC = () => {
  const { width, height, fps, durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();
  const currentMs = (frame / fps) * 1000;

  return (
    <div
      className="relative overflow-hidden bg-[#030712] select-none"
      style={{ width, height, fontFamily: "system-ui, -apple-system, sans-serif" }}
    >
      {/* 0. High-Converting 4K Thumbnail First-Frame (Captured by YouTube Shorts) */}
      {frame === 0 && (
        <div className="absolute inset-0 w-full h-full z-50 pointer-events-none">
          <TheCompoundingTrapThumbnail />
        </div>
      )}

      {/* 1. Camera Trauma Wrapper */}
      <CameraShake triggerFrames={SHAKE_FRAMES} intensity={8}>
        {/* 2. Deep Obsidian Carbon Background with Cyber Grid */}
        <TheCompoundingTrapBackground />

        {/* 3. High-Velocity Dark Luxury Motion Canvas */}
        <TheCompoundingTrapCanvas />

        {/* 4. Finance channel has no presenter character */}
        <TheCompoundingTrapPresenter currentMs={currentMs} />

        {/* 5. Central Kinetic Captions with Emerald active glow */}
        <AppleKineticCaptions
          transcript={transcript}
          currentMs={currentMs}
          maxWordsPerGroup={2}
          theme="dark"
          activeColor="#10b981"
        />
      </CameraShake>

      {/* 6. Finance Green Progress Bar */}
      <AppleProgressBar accentColor="#10b981" />

      {/* 7. High-Velocity Financial Voiceover (+30% volume) */}
      <Audio
        src={staticFile("the_compounding_trap/voiceover.mp3")}
        volume={1.3}
      />

      {/* 8. Driving Dark Synth BGM */}
      <Audio
        src={staticFile("audio/bgm/monume-documentary-documentary-music-547923.mp3")}
        volume={0.10}
      />

      {/* 9. Event-Driven Financial SFX Suite */}
      <SoundDesignEngine cues={SFX_CUES} />
    </div>
  );
};
