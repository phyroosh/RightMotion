import React, { useMemo } from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { WordChunk, WordTimestamp } from "../types";

interface KineticCaptionsProps {
  transcript: WordTimestamp[];
}

export const KineticCaptions: React.FC<KineticCaptionsProps> = ({ transcript }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentMs = (frame / fps) * 1000;

  // Build intelligent 2-4 word chunks
  const chunks: WordChunk[] = useMemo(() => {
    if (!transcript || transcript.length === 0) return [];

    const result: WordChunk[] = [];
    let currentGroup: WordTimestamp[] = [];

    transcript.forEach((item, index) => {
      currentGroup.push(item);

      const hasPunctuation = /[.!?]$/.test(item.word);
      const isNextLongPause =
        index < transcript.length - 1 &&
        transcript[index + 1].startMs - item.endMs > 350;
      const isGroupFull = currentGroup.length >= 3;

      if (hasPunctuation || isNextLongPause || isGroupFull || index === transcript.length - 1) {
        result.push({
          words: [...currentGroup],
          startMs: currentGroup[0].startMs,
          // extend endMs slightly so captions linger cleanly across tiny gaps
          endMs: currentGroup[currentGroup.length - 1].endMs + 180,
        });
        currentGroup = [];
      }
    });

    return result;
  }, [transcript]);

  // Find active chunk with natural pause holding
  const activeChunk = useMemo(() => {
    if (!chunks.length) return null;

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const nextChunk = chunks[i + 1];

      // Inside current chunk active playback
      if (currentMs >= chunk.startMs && currentMs <= chunk.endMs) {
        return chunk;
      }

      // In the gap before next chunk: keep current chunk until ~100ms before next chunk
      if (nextChunk && currentMs > chunk.endMs && currentMs < nextChunk.startMs) {
        if (currentMs < nextChunk.startMs - 100) {
          return chunk;
        } else {
          return nextChunk;
        }
      }

      // Past the last chunk
      if (i === chunks.length - 1 && currentMs > chunk.endMs) {
        return chunk;
      }
    }

    return chunks[0];
  }, [chunks, currentMs]);

  if (!activeChunk) return null;

  // Spring animation for chunk appearance
  const chunkStartFrame = Math.floor((activeChunk.startMs / 1000) * fps);
  const chunkFrameProgress = Math.max(0, frame - chunkStartFrame);

  const chunkSpring = spring({
    frame: chunkFrameProgress,
    fps,
    config: {
      damping: 14,
      mass: 0.6,
      stiffness: 180,
    },
  });

  return (
    <div className="absolute inset-x-8 top-[68%] -translate-y-1/2 flex flex-col items-center justify-center pointer-events-none z-40">
      <div
        className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4 max-w-[960px] text-center px-6 py-6"
        style={{
          transform: `scale(${0.9 + chunkSpring * 0.1}) translateY(${(1 - chunkSpring) * 18}px)`,
          opacity: Math.min(1, chunkSpring * 1.5),
        }}
      >
        {activeChunk.words.map((item, idx) => {
          const isActive = currentMs >= item.startMs && currentMs <= item.endMs;
          const isPassed = currentMs > item.endMs;

          // Word specific pop spring
          const wordStartFrame = Math.floor((item.startMs / 1000) * fps);
          const wordProgress = Math.max(0, frame - wordStartFrame);
          const wordPop = spring({
            frame: wordProgress,
            fps,
            config: {
              damping: 12,
              mass: 0.5,
              stiffness: 220,
            },
          });

          return (
            <span
              key={`${item.word}-${idx}`}
              className={`relative inline-block text-6xl md:text-7xl font-black uppercase tracking-normal transition-all duration-75 mx-2 my-1 ${
                isActive
                  ? "text-emerald-400 scale-105 z-10"
                  : isPassed
                  ? "text-white opacity-95"
                  : "text-zinc-500 opacity-40"
              }`}
              style={{
                textShadow: isActive
                  ? "0 0 35px rgba(16, 185, 129, 0.95), 0 0 70px rgba(16, 185, 129, 0.5), 0 4px 12px rgba(0, 0, 0, 0.9)"
                  : "0 4px 12px rgba(0, 0, 0, 0.8)",
                transform: isActive
                  ? `scale(${1.06 + wordPop * 0.06}) translateY(-2px)`
                  : "scale(1)",
              }}
            >
              {item.word}

              {/* Glowing highlight under active word */}
              {isActive && (
                <span
                  className="absolute -bottom-2 left-0 right-0 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_15px_#10b981]"
                  style={{
                    transform: `scaleX(${wordPop})`,
                  }}
                />
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
};
