import React from "react";
import { Audio, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ChaptersBackground } from "./Background";
import { ChaptersCanvas } from "./Canvas";
import { ChaptersPresenter } from "./Presenter";
import { AppleProgressBar } from "../../components/AppleProgressBar";
import { AppleKineticCaptions } from "../../components/AppleKineticCaptions";
import { SoundDesignEngine, SfxCue } from "../../components/SoundDesignEngine";
import rawTranscript from "./transcript.json";
import { WordTimestamp } from "../../types";
import "../../style.css";

const transcript = rawTranscript as WordTimestamp[];

// Layered SFX Cues utilizing the newly expanded SFX library
const SFX_CUES: SfxCue[] = [
  { frame: 0,    type: "whoosh_deep",      volume: 0.32 }, // 0.0s: Intro Full-Body Presenter entrance
  { frame: 12,   type: "click",            volume: 0.28 }, // 0.4s: Badge pop
  { frame: 216,  type: "whoosh_fast",      volume: 0.34 }, // 7.2s: Scene 1 Highlight Reel entrance
  { frame: 339,  type: "impact_hit",       volume: 0.22 }, // 11.3s: "Behind-the-scenes" card slam
  { frame: 450,  type: "click",            volume: 0.26 }, // 15.0s: "Money" chip
  { frame: 468,  type: "click",            volume: 0.26 }, // 15.6s: "Fun" chip
  { frame: 492,  type: "click",            volume: 0.26 }, // 16.4s: "Vacations" chip
  { frame: 510,  type: "whoosh_sparkle",   volume: 0.30 }, // 17.0s: "You don't see their problems"
  { frame: 555,  type: "whoosh_deep",      volume: 0.32 }, // 18.5s: Scene 2 Starting Line entrance
  { frame: 585,  type: "click",            volume: 0.26 }, // 19.5s: Lane 1 Money
  { frame: 735,  type: "click",            volume: 0.26 }, // 24.5s: Lane 2 Opportunities
  { frame: 780,  type: "impact_hit",       volume: 0.22 }, // 26.0s: Lane 3 Built Resilience
  { frame: 864,  type: "whoosh_fast",      volume: 0.34 }, // 28.8s: Interlude Bust Presenter entrance
  { frame: 966,  type: "whoosh_sparkle",   volume: 0.32 }, // 32.2s: "What can I build with what I have?"
  { frame: 1119, type: "whoosh_cinematic", volume: 0.35 }, // 37.3s: Scene 3 Unfinished Book entrance
  { frame: 1206, type: "impact_hit",       volume: 0.22 }, // 40.2s: "A difficult chapter isn't the whole story"
  { frame: 1269, type: "whoosh_sparkle",   volume: 0.35 }, // 42.3s: Outro Full-Body Presenter entrance
];

export const ChaptersComposition: React.FC = () => {
  const { width, height, fps, durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();
  const currentMs = (frame / fps) * 1000;

  return (
    <div
      className="relative w-full h-full bg-[#f8fafc] text-slate-900 flex flex-col justify-between overflow-hidden select-none font-sans"
      style={{ width, height }}
    >
      {/* 1. Voiceover Audio Track (Natural Female Neural +0% speed, +30% boost, silence-compressed) */}
      <Audio src={staticFile("chapters/voiceover.mp3")} volume={1.3} />

      {/* 2. Permanent Shorts Background Music (Ambient mix with smooth fade) */}
      <Audio
        src={staticFile("audio/bgm/the_mountain-piano-documentary-567436.mp3")}
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

      {/* 3. Layered Sound Design Engine (Whooshes, Hits, Sparkles & Tactile Clicks) */}
      <SoundDesignEngine cues={SFX_CUES} />

      {/* 4. Top-edge Apple Progress Bar */}
      <AppleProgressBar />

      {/* 5. Pure Apple Studio Light Background with Liquid Mesh Gradient Orbs */}
      <ChaptersBackground />

      {/* 6. B-Roll Motion Graphics Canvas */}
      <ChaptersCanvas transcript={transcript} />

      {/* 7. A-Roll Hero Presenter with Judy Eye Blink & Full-Body Intro/Outro */}
      <ChaptersPresenter currentMs={currentMs} />

      {/* 8. Central Kinetic Typography with Apple Blue Glow */}
      <AppleKineticCaptions transcript={transcript} />
    </div>
  );
};
