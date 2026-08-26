import React, { useMemo } from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { WordChunk, WordTimestamp } from "../types";

interface KineticCaptionsProps {
  transcript: WordTimestamp[];
}

export const AppleKineticCaptions: React.FC<KineticCaptionsProps> = ({ transcript }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const currentMs = (frame / fps) * 1000;

  const isWidescreen = width > 1200; // 1920x1080 widescreen mode

  // Build clean 2-3 word chunks with natural sentence holds
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
      const isGroupFull = currentGroup.length >= (isWidescreen ? 4 : 3);

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
  }, [transcript, isWidescreen]);

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
    config: { damping: 24, mass: 0.9, stiffness: 85 },
  });

  const bottomClass = isWidescreen ? "bottom-[10%]" : "bottom-[16%]";
  const maxWidthClass = isWidescreen ? "max-w-[1200px]" : "max-w-[800px]";
  const fontSize = isWidescreen ? "clamp(36px, 3.2vw, 48px)" : "clamp(48px, 9.5vw, 68px)";

  return (
    <div className={`absolute inset-x-0 ${bottomClass} flex items-end justify-center pointer-events-none z-40 px-10`}>
      <div
        className={`flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-center ${maxWidthClass} px-6 py-2`}
        style={{
          transform: `translateY(${(1 - appear) * 12}px)`,
          opacity: Math.min(1, appear * 1.8),
        }}
      >
        {activeChunk.words.map((item, idx) => {
          const isActive = currentMs >= item.startMs && currentMs <= item.endMs;
          const isPassed = currentMs > item.endMs;

          return (
            <span
              key={`${item.word}-${idx}`}
              className="relative inline-block font-black uppercase"
              style={{
                fontSize,
                letterSpacing: "-0.025em",
                lineHeight: 1.1,
                color: isActive ? "#0071e3" : isPassed ? "#0f172a" : "rgba(15,23,42,0.32)",
                textShadow: isActive
                  ? "0 0 35px rgba(0,113,227,0.5), 0 2px 8px rgba(0,0,0,0.08)"
                  : "0 2px 6px rgba(0,0,0,0.04)",
                transform: isActive ? "scale(1.04)" : "scale(1)",
                transition: "transform 0.1s ease-out, color 0.08s ease-out",
              }}
            >
              {item.word}
              {isActive && (
                <span
                  className="absolute -bottom-1.5 left-0 right-0 h-[4px] bg-[#0071e3] rounded-full"
                  style={{ boxShadow: "0 0 16px rgba(0,113,227,0.9)" }}
                />
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
};
