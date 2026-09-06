import React from "react";
import { Audio, Sequence, staticFile } from "remotion";

export type SfxType =
  | "click"
  | "whoosh_fast"
  | "whoosh_deep"
  | "whoosh_sparkle"
  | "impact_hit"
  | "whoosh_cinematic"
  | "marker_scribble"
  | "tape_snap";

export interface SfxCue {
  frame: number;
  type: SfxType;
  volume?: number;
}

const SFX_CONFIG: Record<SfxType, { src: string; defaultVolume: number; durationFrames: number }> = {
  click: {
    src: "audio/sfx/mouse_click.mp3",
    defaultVolume: 0.28,
    durationFrames: 15,
  },
  whoosh_fast: {
    src: "audio/sfx/whoosh_fast.wav",
    defaultVolume: 0.18,
    durationFrames: 25,
  },
  whoosh_deep: {
    src: "audio/sfx/whoosh_deep.wav",
    defaultVolume: 0.30,
    durationFrames: 45,
  },
  whoosh_sparkle: {
    src: "audio/sfx/whoosh_sparkle.wav",
    defaultVolume: 0.32,
    durationFrames: 40,
  },
  impact_hit: {
    src: "audio/sfx/impact_hit.wav",
    defaultVolume: 0.18,
    durationFrames: 30,
  },
  whoosh_cinematic: {
    src: "audio/sfx/whoosh_cinematic.wav",
    defaultVolume: 0.35,
    durationFrames: 60,
  },
  marker_scribble: {
    src: "audio/sfx/marker_scribble.wav",
    defaultVolume: 0.32,
    durationFrames: 20,
  },
  tape_snap: {
    src: "audio/sfx/tape_snap.wav",
    defaultVolume: 0.30,
    durationFrames: 15,
  },
};

export interface SoundDesignEngineProps {
  cues?: SfxCue[];
  currentMs?: number;
}

/**
 * Universal Sound Design Engine for RightClips
 * Renders layered cinematic sound effects synced to exact frames.
 */
export const SoundDesignEngine: React.FC<SoundDesignEngineProps> = ({ cues = [] }) => {
  return (
    <>
      {cues.map((cue, idx) => {
        const config = SFX_CONFIG[cue.type] || SFX_CONFIG.click;
        const volume = cue.volume !== undefined ? cue.volume : config.defaultVolume;

        return (
          <Sequence
            key={`sfx-${cue.type}-${cue.frame}-${idx}`}
            from={cue.frame}
            durationInFrames={config.durationFrames}
          >
            <Audio src={staticFile(config.src)} volume={volume} />
          </Sequence>
        );
      })}
    </>
  );
};
