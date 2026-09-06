import React from "react";
import { AbsoluteFill, Audio, useCurrentFrame, useVideoConfig } from "remotion";
import { AppleKineticCaptions } from "../../components/AppleKineticCaptions";
import { AppleProgressBar } from "../../components/AppleProgressBar";
import { SoundDesignEngine } from "../../components/SoundDesignEngine";
import { TheIllusionOfOwnershipBackground } from "./Background";
import { TheIllusionOfOwnershipCanvas } from "./Canvas";
import { TheIllusionOfOwnershipPresenter } from "./Presenter";
import { TheIllusionOfOwnershipThumbnail } from "../../thumbnails";
import rawTranscript from "./transcript.json";
import { WordTimestamp } from "../../types";

const transcript: WordTimestamp[] = (rawTranscript as any[]).map((t) => ({
  word: t.word,
  startMs: t.startMs ?? (t.start < 1000 ? Math.round(t.start * 1000) : t.start),
  endMs: t.endMs ?? (t.end < 1000 ? Math.round(t.end * 1000) : t.end),
  speaker: t.speaker,
}));

export const TheIllusionOfOwnershipComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentMs = (frame / fps) * 1000;

  return (
    <AbsoluteFill className="bg-[#030712]">
      <Audio src="/audio/bgm/monume-documentary-documentary-music-547923.mp3" volume={0.08} />
      <Audio src="/the_illusion_of_ownership/voiceover.mp3" volume={1} />
      
      {frame === 0 && (
        <div className="absolute inset-0 w-full h-full z-50 pointer-events-none">
          <TheIllusionOfOwnershipThumbnail />
        </div>
      )}

      <TheIllusionOfOwnershipBackground />
      <TheIllusionOfOwnershipPresenter frame={frame} />
      <TheIllusionOfOwnershipCanvas frame={frame} fps={fps} currentMs={currentMs} />

      <div className="absolute bottom-[8%] w-full px-8 z-40">
        <AppleKineticCaptions transcript={transcript} currentMs={currentMs} activeColor="#10b981" maxWordsPerGroup={5} />
      </div>

      <AppleProgressBar accentColor="#10b981" />
      <SoundDesignEngine currentMs={currentMs} />
    </AbsoluteFill>
  );
};