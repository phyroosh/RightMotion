import React from "react";
import { Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { CortisolAwakeningBackground } from "./Background";
import { CortisolAwakeningCanvas } from "./Canvas";
import { CortisolAwakeningPresenter } from "./Presenter";
import { AppleProgressBar } from "../../components/AppleProgressBar";
import { AppleKineticCaptions } from "../../components/AppleKineticCaptions";
import { SoundDesignEngine, SfxCue } from "../../components/SoundDesignEngine";
import { CameraShake } from "../../components/kinetic_text/CameraShake";
import { CortisolAwakeningRoutineThumbnail } from "../../thumbnails";
import rawTranscript from "./transcript.json";

const transcript = rawTranscript.map((t: any) => ({
  word: t.word,
  start: t.start,
  end: t.end,
  startMs: t.startMs ?? t.start,
  endMs: t.endMs ?? t.end,
}));

// 🫀 BioMatrix {Health} Foley & SFX Suite (Earbud-comfort softened frequencies, speech-locked)
const SFX_CUES: SfxCue[] = [
  { frame: 0,   type: "whoosh_deep",    volume: 0.28 }, // Scene 1 entry
  { frame: 22,  type: "impact_hit",     volume: 0.22 }, // Exhausted cutout stamp
  { frame: 140, type: "whoosh_fast",    volume: 0.16 }, // Scene 2 in
  { frame: 148, type: "click",          volume: 0.24 }, // Anti-laziness banner
  { frame: 188, type: "impact_hit",     volume: 0.24 }, // 3D brain slam
  { frame: 207, type: "click",          volume: 0.24 }, // CAR HUD badge pops
  { frame: 280, type: "whoosh_deep",    volume: 0.28 }, // Scene 3 in
  { frame: 403, type: "click",          volume: 0.26 }, // Switch 1 Adenosine
  { frame: 523, type: "click",          volume: 0.26 }, // Switch 2 Cortisol
  { frame: 655, type: "click",          volume: 0.26 }, // Switch 3 Body Temp
  { frame: 760, type: "impact_hit",     volume: 0.22 }, // Scene 4 Saboteurs in
  { frame: 797, type: "click",          volume: 0.24 }, // Trap 1 Phone in Dark
  { frame: 840, type: "click",          volume: 0.24 }, // Trap 2 Caffeine
  { frame: 904, type: "click",          volume: 0.24 }, // Trap 3 Deep Sleep alarm
  { frame: 992, type: "impact_hit",     volume: 0.24 }, // Brain Paralyzed banner
  { frame: 1050, type: "whoosh_fast",   volume: 0.16 }, // Scene 5 Protocol in
  { frame: 1090, type: "click",         volume: 0.24 }, // Step 1 Sunlight
  { frame: 1146, type: "click",         volume: 0.24 }, // Step 2 Caffeine delay
  { frame: 1216, type: "click",         volume: 0.24 }, // Step 3 Hydration
  { frame: 1280, type: "whoosh_sparkle",volume: 0.32 }, // Scene 6 Finale
  { frame: 1300, type: "impact_hit",    volume: 0.22 }, // Biology affirmation stamp
];

const SHAKE_FRAMES = [22, 188, 760, 992];

export const CortisolAwakeningRoutineComposition: React.FC = () => {
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
          <CortisolAwakeningRoutineThumbnail />
        </div>
      )}

      {/* 1. Camera Trauma Wrapper on impact events */}
      <CameraShake triggerFrames={SHAKE_FRAMES} intensity={6}>
        {/* 2. Deep Bio-Tech Background */}
        <CortisolAwakeningBackground />

        {/* 3. Word-Synchronized Motion Graphics Storyboard */}
        <CortisolAwakeningCanvas />

        {/* 4. Health channel presenter (null) */}
        <CortisolAwakeningPresenter currentMs={currentMs} />

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

      {/* 7. Neural Voiceover Audio */}
      <Audio
        src={staticFile("cortisol_awakening_routine/voiceover.mp3")}
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
