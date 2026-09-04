import React, { useMemo } from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { WordChunk, WordTimestamp } from "../../types";

export interface FacecamCaptionsProps {
  transcript: WordTimestamp[];
  activeColor?: string; // e.g. "#fbbf24" (Cyber Gold) or "#22d3ee" (Cyan) or "#10b981" (Emerald)
  currentMs?: number;
  maxWordsPerGroup?: number;
  className?: string;
}

export const FacecamCaptions: React.FC<FacecamCaptionsProps> = ({
  transcript,
  activeColor = "#fbbf24",
  currentMs: currentMsProp,
  maxWordsPerGroup = 3,
  className = "",
}) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const currentMs = currentMsProp ?? (frame / fps) * 1000;

  // Build clean 2-3 word chunks with natural pauses
  const chunks: WordChunk[] = useMemo(() => {
    if (!transcript || transcript.length === 0) return [];
    const result: WordChunk[] = [];
    let currentGroup: WordTimestamp[] = [];

    transcript.forEach((item, index) => {
      currentGroup.push(item);

      const hasPunctuation = /[.!?,;]$/.test(item.word);
      const isNextLongPause =
        index < transcript.length - 1 &&
        transcript[index + 1].startMs - item.endMs > 250;
      const isGroupFull = currentGroup.length >= maxWordsPerGroup;

      if (hasPunctuation || isNextLongPause || isGroupFull || index === transcript.length - 1) {
        result.push({
          words: [...currentGroup],
          startMs: currentGroup[0].startMs,
          endMs: currentGroup[currentGroup.length - 1].endMs + 180,
        });
        currentGroup = [];
      }
    });
    return result;
  }, [transcript, maxWordsPerGroup]);

  const activeChunk = useMemo(() => {
    if (!chunks.length) return null;
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const nextChunk = chunks[i + 1];
      if (currentMs >= chunk.startMs && currentMs <= chunk.endMs) return chunk;
      if (nextChunk && currentMs > chunk.endMs && currentMs < nextChunk.startMs) {
        return currentMs < nextChunk.startMs - 80 ? chunk : nextChunk;
      }
      if (i === chunks.length - 1 && currentMs > chunk.endMs) return chunk;
    }
    return chunks[0];
  }, [chunks, currentMs]);

  if (!activeChunk) return null;

  const chunkStartFrame = Math.floor((activeChunk.startMs / 1000) * fps);
  const chunkFrameProgress = Math.max(0, frame - chunkStartFrame);

  const appear = spring({
    frame: chunkFrameProgress,
    fps,
    config: { damping: 20, mass: 0.8, stiffness: 120 },
  });

  return (
    <div
      className={`absolute inset-x-0 bottom-[18%] flex items-end justify-center pointer-events-none z-40 px-6 ${className}`}
    >
      <div
        className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-center max-w-[920px] px-8 py-3.5 rounded-3xl bg-black/85 border-2 border-white/20 backdrop-blur-xl shadow-[0_15px_35px_rgba(0,0,0,0.85)]"
        style={{
          transform: `translateY(${(1 - appear) * 14}px) scale(${0.96 + appear * 0.04})`,
          opacity: Math.min(1, appear * 1.5),
        }}
      >
        {activeChunk.words.map((w, idx) => {
          const isActive = currentMs >= w.startMs && currentMs <= w.endMs;
          const isPassed = currentMs > w.endMs;

          const wordStartFrame = Math.floor((w.startMs / 1000) * fps);
          const wordPop = spring({
            frame: Math.max(0, frame - wordStartFrame),
            fps,
            config: { damping: 14, stiffness: 180 },
          });

          return (
            <span
              key={`${w.word}-${idx}`}
              className="inline-block transition-all duration-75 uppercase tracking-tight font-black"
              style={{
                fontSize: "clamp(38px, 6.2vw, 54px)",
                lineHeight: "1.15",
                color: isActive
                  ? activeColor
                  : isPassed
                  ? "#ffffff"
                  : "rgba(255, 255, 255, 0.45)",
                transform: isActive
                  ? `scale(${1.0 + wordPop * 0.12}) translateY(-2px)`
                  : "scale(1.0)",
                textShadow: isActive
                  ? `0 0 24px ${activeColor}bb, 0 3px 10px rgba(0,0,0,0.9)`
                  : "0 2px 8px rgba(0,0,0,0.8)",
              }}
            >
              {w.word}
            </span>
          );
        })}
      </div>
    </div>
  );
};
