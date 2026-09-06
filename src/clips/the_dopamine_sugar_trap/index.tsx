import React from "react";
import { AbsoluteFill, Audio, useCurrentFrame, useVideoConfig } from "remotion";
import { AppleKineticCaptions } from "../../components/AppleKineticCaptions";
import { AppleProgressBar } from "../../components/AppleProgressBar";
import { SoundDesignEngine } from "../../components/SoundDesignEngine";
import { TheDopamineSugarTrapBackground } from "./Background";
import { TheDopamineSugarTrapCanvas } from "./Canvas";
import { TheDopamineSugarTrapPresenter } from "./Presenter";
import { TheDopamineSugarTrapThumbnail } from "../../thumbnails";
import rawTranscript from "./transcript.json";
import { WordTimestamp } from "../../types";

const transcript: WordTimestamp[] = (rawTranscript as any[]).map((t) => ({
  word: t.word,
  startMs: t.startMs ?? (t.start < 1000 ? Math.round(t.start * 1000) : t.start),
  endMs: t.endMs ?? (t.end < 1000 ? Math.round(t.end * 1000) : t.end),
  speaker: t.speaker,
}));

export const TheDopamineSugarTrapComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentMs = (frame / fps) * 1000;

  return (
    <AbsoluteFill className="bg-[#060913]">
      <Audio src="/audio/bgm/monume-documentary-documentary-music-547923.mp3" volume={0.08} />
      <Audio src="/the_dopamine_sugar_trap/voiceover.mp3" volume={1} />
      
      {frame === 0 && (
        <div className="absolute inset-0 w-full h-full z-50 pointer-events-none">
          <TheDopamineSugarTrapThumbnail />
        </div>
      )}

      <TheDopamineSugarTrapBackground />
      <TheDopamineSugarTrapPresenter frame={frame} />
      <TheDopamineSugarTrapCanvas frame={frame} fps={fps} currentMs={currentMs} />

      <div className="absolute bottom-[8%] w-full px-8 z-40">
        <AppleKineticCaptions transcript={transcript} currentMs={currentMs} activeColor="#06b6d4" maxWordsPerGroup={5} />
      </div>

      <AppleProgressBar accentColor="#06b6d4" />
      <SoundDesignEngine currentMs={currentMs} />
    </AbsoluteFill>
  );
};