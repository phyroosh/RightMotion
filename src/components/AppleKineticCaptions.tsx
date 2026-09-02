import React, { useMemo } from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { WordChunk, WordTimestamp } from "../types";

interface KineticCaptionsProps {
  transcript: WordTimestamp[];
  theme?: "light" | "dark";
  activeColor?: string;   // Override the active word highlight color (e.g. "#10b981" for Finance, "#06b6d4" for Health)
  currentMs?: number;     // Optional external currentMs override (falls back to internal frame-based calculation)
  maxWordsPerGroup?: number; // Max words per caption group (default: 3 for 9:16, 4 for 16:9)
  className?: string;     // Optional wrapper class override
}

export const AppleKineticCaptions: React.FC<KineticCaptionsProps> = ({
  transcript,
  theme = "light",
  activeColor: activeColorProp,
  currentMs: currentMsProp,
  maxWordsPerGroup,
  className,
}) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const currentMs = currentMsProp ?? (frame / fps) * 1000;

  const isWidescreen = width > 1200; // 1920x1080 widescreen mode
  const isDark = theme === "dark";

  // Build clean 2-4 word chunks with natural sentence holds
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
      const isGroupFull = currentGroup.length >= (maxWordsPerGroup ?? (isWidescreen ? 4 : 3));

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

  const bottomClass = isWidescreen ? "bottom-[10%]" : "bottom-[19%]";
  const maxWidthClass = isWidescreen ? "max-w-[1200px]" : "max-w-[840px]";
  const fontSize = isWidescreen ? "clamp(34px, 3.0vw, 46px)" : "clamp(46px, 9vw, 64px)";

  const passedColor = isDark ? "#ffffff" : "#09090b";
  const inactiveColor = isDark ? "rgba(255, 255, 255, 0.42)" : "rgba(15, 23, 42, 0.38)";
  const activeColor = activeColorProp ?? (isDark ? "#38bdf8" : "#0071e3");
  const glowShadow = isDark
    ? `0 0 30px ${activeColor}cc, 0 2px 12px rgba(0,0,0,0.8)`
    : `0 0 30px ${activeColor}88, 0 2px 10px rgba(255,255,255,0.9)`;

  return (
    <div className={`absolute inset-x-0 ${bottomClass} flex items-end justify-center pointer-events-none z-40 px-8 ${className ?? ""}`}>
      <div
        className={`flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-center ${maxWidthClass} px-6 py-2.5 rounded-3xl ${
          isDark ? "bg-slate-950/70 border border-white/10 backdrop-blur-md shadow-2xl" : "bg-white/80 border border-slate-200/80 backdrop-blur-md shadow-xl"
        }`}
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
              className="relative inline-block font-black uppercase tracking-tight"
              style={{
                fontSize,
                letterSpacing: "-0.025em",
                lineHeight: 1.15,
                backgroundColor: isActive
                  ? isDark
                    ? activeColor
                    : `${activeColor}22`
                  : "transparent",
                color: isActive && isDark ? "#030712" : isActive ? activeColor : isPassed ? passedColor : inactiveColor,
                padding: isActive ? "2px 14px" : "2px 4px",
                borderRadius: "14px",
                boxShadow: isActive
                  ? `0 0 25px ${activeColor}aa, 0 4px 12px rgba(0,0,0,0.4)`
                  : "none",
                transform: isActive ? "scale(1.08)" : "scale(1)",
                transition: "transform 0.08s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.08s ease-out, color 0.08s ease-out",
              }}
            >
              {item.word}
            </span>
          );
        })}
      </div>
    </div>
  );
};
