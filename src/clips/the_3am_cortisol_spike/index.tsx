import React from "react";
import { Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { The3amCortisolSpikeBackground } from "./Background";
import { The3amCortisolSpikeCanvas } from "./Canvas";
import { The3amCortisolSpikePresenter } from "./Presenter";
import { AppleProgressBar } from "../../components/AppleProgressBar";
import { AppleKineticCaptions } from "../../components/AppleKineticCaptions";
import { SoundDesignEngine, SfxCue } from "../../components/SoundDesignEngine";
import { CameraShake } from "../../components/kinetic_text/CameraShake";
import { The3amCortisolSpikeThumbnail } from "../../thumbnails";
import rawTranscript from "./transcript.json";
import { WordTimestamp } from "../../types";

const transcript: WordTimestamp[] = (rawTranscript as any[]).map((t) => ({
  word: t.word,
  start: t.start,
  end: t.end,
  startMs: t.startMs ?? t.start,
  endMs: t.endMs ?? t.end,
}));

// 🫀 Health BioMatrix SFX Suite
// Clinical: heartbeat pulses, digital telemetry beeps, synaptic sparks
const SFX_CUES: SfxCue[] = [
  { frame: 0,   type: "whoosh_deep",    volume: 0.32 }, // 0.0s:  Scene 1 clinical entry
  { frame: 30,  type: "click",          volume: 0.26 }, // 1.0s:  Biometric badge lock
  { frame: 60,  type: "whoosh_sparkle", volume: 0.30 }, // 2.0s:  Circadian ring glow
  { frame: 120, type: "impact_hit",     volume: 0.24 }, // 4.0s:  Scene 2 — not insomnia reveal
  { frame: 126, type: "impact_hit",     volume: 0.28 }, // 4.2s:  SemanticWord fracture
  { frame: 180, type: "click",          volume: 0.26 }, // 6.0s:  CircadianClock tick
  { frame: 255, type: "whoosh_deep",    volume: 0.34 }, // 8.5s:  Scene 3 isometric shelf
  { frame: 264, type: "whoosh_sparkle", volume: 0.32 }, // 8.8s:  BiometricRing reveal
  { frame: 380, type: "impact_hit",     volume: 0.26 }, // 12.7s: Critical liver glycogen ring
  { frame: 420, type: "whoosh_fast",    volume: 0.18 }, // 14.0s: Scene 4 — cortisol dump
  { frame: 433, type: "whoosh_sparkle", volume: 0.30 }, // 14.4s: CortisolSpikeGraph draw
  { frame: 510, type: "impact_hit",     volume: 0.26 }, // 17.0s: Adrenal gland bullet
  { frame: 600, type: "whoosh_fast",    volume: 0.18 }, // 20.0s: Scene 5 physical symptoms
  { frame: 615, type: "impact_hit",     volume: 0.24 }, // 20.5s: Heart rate spike card
  { frame: 645, type: "impact_hit",     volume: 0.22 }, // 21.5s: Eyes snap card
  { frame: 675, type: "impact_hit",     volume: 0.22 }, // 22.5s: Brain threat card
  { frame: 780, type: "whoosh_fast",    volume: 0.18 }, // 26.0s: Scene 6 — reframe
  { frame: 792, type: "marker_scribble",volume: 0.32 }, // 26.4s: Scribble cross over anxiety
  { frame: 870, type: "whoosh_sparkle", volume: 0.34 }, // 29.0s: Emerald reframe reveal
  { frame: 930, type: "whoosh_deep",    volume: 0.34 }, // 31.0s: Scene 7 solution
  { frame: 945, type: "whoosh_sparkle", volume: 0.35 }, // 31.5s: MetabolicStatusCard glow
  { frame: 990, type: "click",          volume: 0.26 }, // 33.0s: Protocol badge
];

// Trauma on the big metabolic crash moments
const SHAKE_FRAMES = [126, 380, 615];

export const The3amCortisolSpikeComposition: React.FC = () => {
  const { width, height, fps, durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();
  const currentMs = (frame / fps) * 1000;

  return (
    <div
      className="relative overflow-hidden bg-[#060913] select-none"
      style={{ width, height, fontFamily: "system-ui, -apple-system, sans-serif" }}
    >
      {/* 0. High-Converting 4K Thumbnail First-Frame */}
      {frame === 0 && (
        <div className="absolute inset-0 w-full h-full z-50 pointer-events-none">
          <The3amCortisolSpikeThumbnail />
        </div>
      )}

      {/* 1. Camera Trauma Wrapper */}
      <CameraShake triggerFrames={SHAKE_FRAMES} intensity={7}>
        {/* 2. Deep Bio-Tech Navy Background with Cellular Aura */}
        <The3amCortisolSpikeBackground />

        {/* 3. Clinical Biometric Telemetry Motion Canvas */}
        <The3amCortisolSpikeCanvas />

        {/* 4. Health channel has no presenter character */}
        <The3amCortisolSpikePresenter currentMs={currentMs} />

        {/* 5. Central Kinetic Captions with Electric Cyan active glow */}
        <AppleKineticCaptions
          transcript={transcript}
          currentMs={currentMs}
          maxWordsPerGroup={2}
          theme="dark"
          activeColor="#06b6d4"
        />
      </CameraShake>

      {/* 6. Cyan Bio-Pulse Progress Bar */}
      <AppleProgressBar accentColor="#06b6d4" />

      {/* 7. Authoritative Clinical Voiceover (+30% volume) */}
      <Audio
        src={staticFile("the_3am_cortisol_spike/voiceover.mp3")}
        volume={1.3}
      />

      {/* 8. Deep Ambient Biological Drone BGM */}
      <Audio
        src={staticFile("audio/bgm/monume-documentary-documentary-music-547923.mp3")}
        volume={0.09}
      />

      {/* 9. Event-Driven Health SFX Suite */}
      <SoundDesignEngine cues={SFX_CUES} />
    </div>
  );
};
