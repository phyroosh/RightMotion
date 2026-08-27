import React from "react";
import { Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { SolidBackground, getActiveSolidColor } from "../../components/SolidBackground";
import { CameraCanvas } from "../../components/CameraCanvas";
import { NeuroproductivityCanvas } from "./Canvas";
import { NeuroproductivityPresenter } from "./Presenter";
import { NeuroproductivityChapters } from "./Chapters";
import { AppleKineticCaptions } from "../../components/AppleKineticCaptions";
import { SOLID_BACKGROUND_TRACK } from "./backgroundTrack";
import { CAMERA_TRACK } from "./cameraTrack";
import rawTranscript from "./transcript.json";
import { WordTimestamp } from "../../types";
import "../../style.css";

const transcript = rawTranscript as WordTimestamp[];

// Key visual trigger timestamps for tactile click SFX (30fps)
const SFX_FRAMES = [
  0,      // 0.0s: Intro Hook
  135,    // 4.5s: Advice 01
  174,    // 5.8s: Advice 02
  220,    // 7.3s: Advice 03
  336,    // 11.2s: Frustration Strike
  855,    // 28.5s: 4 Brains Matrix
  1785,   // 59.5s: Routine Automatic Loop
  2184,   // 72.8s: 7:00 AM Wall
  2985,   // 99.5s: 5 Dopamine Levers
  3468,   // 115.6s: Autism Predictability
  4230,   // 141.0s: Sensory Load Toolkit
  5280,   // 176.0s: AuDHD Dual Vectors
  6450,   // 215.0s: Break Down Steps
  7167,   // 238.9s: Worst Sentence Challenge
  7593,   // 253.1s: 4-Step Room Sequence
  8532,   // 284.4s: AuDHD Synergy
  9150,   // 305.0s: Time Blindness Calendar
  10590,  // 353.0s: Streak Break Trap
  11640,  // 388.0s: Resilient Recovery Protocol
  12885,  // 429.5s: 4 People Staring
  13950,  // 465.0s: 5 Bottleneck Levers
  15444,  // 514.8s: Golden Reframe
];

export const NeuroproductivityComposition: React.FC = () => {
  const { width, height, fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const currentMs = (frame / fps) * 1000;

  const { theme } = getActiveSolidColor(currentMs, SOLID_BACKGROUND_TRACK);

  return (
    <div
      className="relative w-full h-full text-slate-900 flex flex-col justify-between overflow-hidden select-none font-sans"
      style={{ width, height }}
    >
      {/* 1. Master Voiceover Audio Track (Female Neural, Natural Pace, Boosted +30%) */}
      <Audio src={staticFile("neuroproductivity/voiceover.mp3")} volume={1.3} />

      {/* 2. Tactile Mouse Click SFX for Key Visual Pop/Lock Moments */}
      {SFX_FRAMES.map((f, idx) => (
        <Sequence key={`sfx-${idx}`} from={f} durationInFrames={15}>
          <Audio src={staticFile("audio/sfx/mouse_click.mp3")} volume={0.28} />
        </Sequence>
      ))}

      {/* 3. Solid Color Background Engine (Clean High-Contrast Solids, No Gradients) */}
      <SolidBackground
        currentMs={currentMs}
        keyframes={SOLID_BACKGROUND_TRACK}
        showSubtleGrid={true}
      />

      {/* 4. After Effects 2.5D Camera Rig & Motion Graphics Stage */}
      <CameraCanvas
        currentMs={currentMs}
        keyframes={CAMERA_TRACK}
        width={width}
        height={height}
        enableDrift={true}
        driftIntensity={0.85}
      >
        {/* Widescreen 16:9 B-Roll Motion Graphics Canvas */}
        <NeuroproductivityCanvas currentMs={currentMs} />

        {/* Cinematic A-Roll Hero Presenter with Smart Multi-Pose System */}
        <NeuroproductivityPresenter currentMs={currentMs} />
      </CameraCanvas>

      {/* 5. Minimalist 16:9 Chapter Navigation Bar (Fixed in Screen Space) */}
      <NeuroproductivityChapters currentMs={currentMs} />

      {/* 6. Dynamic Theme-Aware Apple Kinetic Captions (Fixed in Screen Space) */}
      <AppleKineticCaptions transcript={transcript} theme={theme} />
    </div>
  );
};
