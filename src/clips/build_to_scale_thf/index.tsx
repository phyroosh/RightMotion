import React from "react";
import { Audio, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { BuildToScaleTHFFacecamLayer } from "./FacecamLayer";
import { BuildToScaleTHFCanvas } from "./Canvas";
import { FacecamCaptions } from "../../components/facecam/FacecamCaptions";
import { AppleProgressBar } from "../../components/AppleProgressBar";
import { SoundDesignEngine, SfxCue } from "../../components/SoundDesignEngine";
import { BuildToScaleTHFThumbnail } from "../../thumbnails/BuildToScaleTHFThumbnail";
import rawTranscript from "./transcript.json";
import { WordTimestamp } from "../../types";
import "../../style.css";

const transcript: WordTimestamp[] = (rawTranscript as any[]).map((t) => ({
  word: t.word,
  startMs: t.startMs ?? t.start,
  endMs: t.endMs ?? t.end,
}));

// Synchronized SFX suite for dynamic punch-ins & pro-editor graphic stamps
const SFX_CUES: SfxCue[] = [
  { frame: 0,    type: "whoosh_fast",    volume: 0.18 }, // Opening punch-in
  { frame: 12,   type: "click",          volume: 0.24 }, // Top tag reveals
  { frame: 95,   type: "click",          volume: 0.24 }, // Status badge
  { frame: 205,  type: "impact_hit",     volume: 0.26 }, // ₹131 CRORE stamp!
  { frame: 265,  type: "whoosh_fast",    volume: 0.18 }, // Camera zoom reset
  { frame: 275,  type: "click",          volume: 0.24 }, // Series HUD badge
  { frame: 370,  type: "click",          volume: 0.24 }, // Growth vs Failure
  { frame: 485,  type: "impact_hit",     volume: 0.24 }, // Hazelnut Factory card
  { frame: 540,  type: "whoosh_fast",    volume: 0.18 }, // Zoom punch-in for Gap story
  { frame: 635,  type: "click",          volume: 0.26 }, // Item 1 Mithai
  { frame: 680,  type: "click",          volume: 0.26 }, // Item 2 Coffee
  { frame: 725,  type: "click",          volume: 0.26 }, // Item 3 Bakery
  { frame: 765,  type: "whoosh_sparkle", volume: 0.32 }, // 3-in-1 Solution reveal!
  { frame: 825,  type: "whoosh_fast",    volume: 0.18 }, // Scale camera shift
  { frame: 865,  type: "click",          volume: 0.24 }, // 2019 1st shop
  { frame: 940,  type: "click",          volume: 0.26 }, // 2026 23 outlets
  { frame: 1025, type: "impact_hit",     volume: 0.26 }, // ₹250 CRORE stamp!
  { frame: 1085, type: "whoosh_fast",    volume: 0.18 }, // Punch-in for golden rule
  { frame: 1205, type: "whoosh_sparkle", volume: 0.32 }, // Breakthrough secret
  { frame: 1280, type: "click",          volume: 0.26 }, // Final CTA badge
];

export const BuildToScaleTHFComposition: React.FC = () => {
  const { width, height, durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();

  return (
    <div
      className="relative w-full h-full bg-[#030712] text-white overflow-hidden select-none font-sans"
      style={{ width, height }}
    >
      {/* 0. 4K High-Converting Thumbnail First-Frame */}
      {frame === 0 && (
        <div className="absolute inset-0 w-full h-full z-50 pointer-events-none">
          <BuildToScaleTHFThumbnail />
        </div>
      )}

      {/* 1. Master Native Voice Audio */}
      <Audio
        src={staticFile("build_to_scale_thf/voiceover.mp3")}
        volume={1.35}
      />

      {/* 2. Ducked Background Music (Fast, motivational documentary pulse) */}
      <Audio
        src={staticFile("audio/bgm/monume-documentary-documentary-music-547923.mp3")}
        volume={(f) =>
          interpolate(
            f,
            [0, 20, durationInFrames - 30, durationInFrames],
            [0, 0.11, 0.11, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          )
        }
        loop
      />

      {/* 3. Layered Multi-SFX Foley Suite */}
      <SoundDesignEngine cues={SFX_CUES} />

      {/* 4. Real Creator Facecam Stream with Dynamic Camera Punch-Ins */}
      <BuildToScaleTHFFacecamLayer />

      {/* 5. Speech-Synchronized Progressive Reveal Motion Graphics */}
      <BuildToScaleTHFCanvas />

      {/* 6. High-Visibility Lower-Third Kinetic Captions */}
      <FacecamCaptions
        transcript={transcript}
        activeColor="#fbbf24"
        maxWordsPerGroup={3}
      />

      {/* 7. Cyber-Gold Progress Bar */}
      <AppleProgressBar accentColor="#fbbf24" />
    </div>
  );
};
