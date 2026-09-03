import React from "react";
import { Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { TeenageMentalHealthBackground } from "./Background";
import { TeenageMentalHealthCanvas } from "./Canvas";
import { TeenageMentalHealthPresenter } from "./Presenter";
import { AppleProgressBar } from "../../components/AppleProgressBar";
import { AppleKineticCaptions } from "../../components/AppleKineticCaptions";
import { SoundDesignEngine, SfxCue } from "../../components/SoundDesignEngine";
import { CameraShake } from "../../components/kinetic_text/CameraShake";
import { TeenageMentalHealthThumbnail } from "../../thumbnails";
import rawTranscript from "./transcript.json";
import { WordTimestamp } from "../../types";

const transcript: WordTimestamp[] = (rawTranscript as any[]).map((t) => ({
  word: t.word,
  start: t.start,
  end: t.end,
  startMs: t.startMs ?? t.start,
  endMs: t.endMs ?? t.end,
}));

// 🫀 BioMatrix {Health} Foley & SFX Suite (Earbud-comfort softened frequencies, speech-locked)
const SFX_CUES: SfxCue[] = [
  { frame: 0,   type: "whoosh_deep",    volume: 0.30 }, // 0.0s:  Scene 1 clinical hook entry
  { frame: 28,  type: "click",          volume: 0.24 }, // 0.9s:  Mood swing indicator drop
  { frame: 105, type: "whoosh_deep",    volume: 0.28 }, // 3.5s:  Scene 2 matrix container enters
  { frame: 199, type: "whoosh_sparkle", volume: 0.32 }, // 6.6s:  "brain," 3D glass brain slams
  { frame: 215, type: "click",          volume: 0.24 }, // 7.1s:  "hormones," Hormonal surge card pops
  { frame: 230, type: "click",          volume: 0.24 }, // 7.6s:  "sleep," Circadian delay card pops
  { frame: 257, type: "click",          volume: 0.24 }, // 8.5s:  "school," Synaptic pruning card pops
  { frame: 279, type: "click",          volume: 0.24 }, // 9.3s:  "friendships," Social overload card pops
  { frame: 380, type: "whoosh_fast",    volume: 0.16 }, // 12.7s: Scene 3 contrast entry
  { frame: 395, type: "impact_hit",     volume: 0.22 }, // 13.1s: Depleted brain cutout impact
  { frame: 528, type: "impact_hit",     volume: 0.24 }, // 17.6s: Scene 4 red flag warning container
  { frame: 529, type: "click",          volume: 0.24 }, // 17.6s: "losing interest" Flag 1
  { frame: 540, type: "marker_scribble",volume: 0.30 }, // 18.0s: Diagnostic circle doodle
  { frame: 602, type: "click",          volume: 0.24 }, // 20.0s: "feeling hopeless" Flag 2
  { frame: 637, type: "click",          volume: 0.24 }, // 21.2s: "struggling to function" Flag 3
  { frame: 681, type: "click",          volume: 0.24 }, // 22.7s: "nothing will get better" Flag 4
  { frame: 742, type: "whoosh_fast",    volume: 0.16 }, // 24.7s: "dramatic" Anti-stigma reframe banner
  { frame: 807, type: "whoosh_deep",    volume: 0.30 }, // 26.9s: Scene 5 support network
  { frame: 808, type: "whoosh_sparkle", volume: 0.34 }, // 26.9s: Support cutout stamp
  { frame: 861, type: "click",          volume: 0.24 }, // 28.7s: "parent," Support channel 1
  { frame: 876, type: "click",          volume: 0.24 }, // 29.2s: "counselor," Support channel 2
  { frame: 898, type: "click",          volume: 0.24 }, // 29.9s: "teacher," Support channel 3
  { frame: 920, type: "click",          volume: 0.24 }, // 30.6s: "doctor." Support channel 4
  { frame: 945, type: "whoosh_sparkle", volume: 0.34 }, // 31.5s: Scene 6 finale affirmation
  { frame: 960, type: "click",          volume: 0.26 }, // 32.0s: Protocol lock badge
];

const SHAKE_FRAMES = [395, 528];

export const TeenageMentalHealthComposition: React.FC = () => {
  const { width, height, fps } = useVideoConfig();
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
          <TeenageMentalHealthThumbnail />
        </div>
      )}

      {/* 1. Camera Trauma Wrapper */}
      <CameraShake triggerFrames={SHAKE_FRAMES} intensity={6}>
        {/* 2. Deep Bio-Tech Navy Background with Cellular Aura */}
        <TeenageMentalHealthBackground />

        {/* 3. Clinical Biometric Telemetry Motion Canvas */}
        <TeenageMentalHealthCanvas />

        {/* 4. Health channel has no presenter character */}
        <TeenageMentalHealthPresenter currentMs={currentMs} />

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

      {/* 7. Authoritative Clinical Voiceover */}
      <Audio
        src={staticFile("teenage_mental_health/voiceover.mp3")}
        volume={1.25}
      />

      {/* 8. Deep Ambient Biological Drone BGM */}
      <Audio
        src={staticFile("audio/bgm/monume-documentary-documentary-music-547923.mp3")}
        volume={0.10}
      />

      {/* 9. Softened Sound Design Engine */}
      <SoundDesignEngine cues={SFX_CUES} />
    </div>
  );
};
