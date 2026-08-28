import React from "react";
import { Audio, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { BoundariesBackground } from "./Background";
import { BoundariesCanvas } from "./Canvas";
import { BoundariesPresenter } from "./Presenter";
import { AppleProgressBar } from "../../components/AppleProgressBar";
import { AppleKineticCaptions } from "../../components/AppleKineticCaptions";
import { BoundariesThumbnail } from "../../thumbnails";
import rawTranscript from "./transcript.json";
import { WordTimestamp } from "../../types";
import "../../style.css";

const transcript: WordTimestamp[] = (rawTranscript as any[]).map((t) => ({
  word: t.word,
  startMs: t.startMs ?? t.start,
  endMs: t.endMs ?? t.end,
}));

export const BoundariesComposition: React.FC = () => {
  const { width, height, fps, durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();
  const currentMs = (frame / fps) * 1000;

  return (
    <div
      className="relative w-full h-full bg-[#fbfbfd] text-slate-900 flex flex-col justify-between overflow-hidden select-none font-sans"
      style={{ width, height }}
    >
      {/* 0. High-Converting 4K Thumbnail First-Frame (Captured automatically by YouTube Shorts) */}
      {frame === 0 && (
        <div className="absolute inset-0 w-full h-full z-50 pointer-events-none">
          <BoundariesThumbnail />
        </div>
      )}
      <Audio src={staticFile("boundaries/voiceover.mp3")} volume={1.3} />
      <Audio
        src={staticFile("audio/bgm/monume-documentary-documentary-music-547923.mp3")}
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
      {/* Sound Design: Tactile clicks at each visual phase transition */}
      <Sequence from={0} durationInFrames={15}>
        <Audio src={staticFile("audio/sfx/mouse_click.mp3")} volume={0.32} />
      </Sequence>
      <Sequence from={230} durationInFrames={15}>
        <Audio src={staticFile("audio/sfx/mouse_click.mp3")} volume={0.3} />
      </Sequence>
      <Sequence from={430} durationInFrames={15}>
        <Audio src={staticFile("audio/sfx/mouse_click.mp3")} volume={0.3} />
      </Sequence>
      <Sequence from={612} durationInFrames={15}>
        <Audio src={staticFile("audio/sfx/mouse_click.mp3")} volume={0.3} />
      </Sequence>
      <Sequence from={765} durationInFrames={15}>
        <Audio src={staticFile("audio/sfx/mouse_click.mp3")} volume={0.32} />
      </Sequence>

      <AppleProgressBar />
      <BoundariesBackground />
      <BoundariesCanvas transcript={transcript} />
      <BoundariesPresenter currentMs={currentMs} />
      <AppleKineticCaptions transcript={transcript} />
    </div>
  );
};
