import React, { useMemo } from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import lyricsData from "./lyrics.json";
import { Sparkles, Music } from "lucide-react";

export interface PoeticLine {
  id: number;
  hinglish: string;
  hindi: string;
  startMs: number;
  endMs: number;
  scene?: string;
  words: {
    word: string;
    startMs: number;
    endMs: number;
  }[];
}

interface LofiCaptionsProps {
  currentMs: number;
}

export const LofiCaptions: React.FC<LofiCaptionsProps> = ({ currentMs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const timeSec = frame / fps;

  const lines = lyricsData as PoeticLine[];

  // Find active line
  const activeLine = useMemo(() => {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (currentMs >= line.startMs && currentMs <= line.endMs + 350) {
        return line;
      }
      // If between lines, hold previous briefly
      if (i < lines.length - 1 && currentMs > line.endMs && currentMs < lines[i + 1].startMs) {
        if (currentMs < lines[i + 1].startMs - 150) {
          return line;
        }
      }
    }
    return null;
  }, [lines, currentMs]);

  // If in instrumental intro or outro
  const isIntro = currentMs < 13000;
  const isOutro = currentMs > 118400;

  if (!activeLine) {
    if (isIntro || isOutro) {
      return (
        <div className="absolute inset-x-0 bottom-[10%] flex flex-col items-center justify-center pointer-events-none z-40 px-12 select-none">
          <div className="px-8 py-3.5 rounded-full bg-black/50 backdrop-blur-xl border border-rose-500/30 shadow-[0_15px_40px_rgba(255,59,92,0.2)] flex items-center gap-3">
            <Music className="w-4 h-4 text-rose-400 animate-pulse" />
            <span className="text-sm font-mono font-bold text-rose-200/90 tracking-widest uppercase">
              {isIntro ? "♪ Instrumental Intro • Midnight Echoes ♪" : "♪ Midnight Outro • Uski Baatein ♪"}
            </span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
        </div>
      );
    }
    return null;
  }

  const lineStartFrame = Math.floor((activeLine.startMs / 1000) * fps);
  const lineFrameProgress = Math.max(0, frame - lineStartFrame);

  const entrance = spring({
    frame: lineFrameProgress,
    fps,
    config: { damping: 18, mass: 0.7, stiffness: 110 },
  });

  return (
    <div className="absolute inset-x-0 bottom-[9%] flex flex-col items-center justify-center pointer-events-none z-40 px-12 select-none">
      {/* Frosted Dark Crimson Glass Container */}
      <div
        className="max-w-5xl px-10 py-6 rounded-3xl bg-black/55 backdrop-blur-2xl border-2 border-rose-500/30 shadow-[0_25px_80px_rgba(244,63,94,0.25)] flex flex-col items-center gap-3.5 text-center relative overflow-hidden"
        style={{
          transform: `translateY(${(1 - entrance) * 16}px) scale(${0.96 + entrance * 0.04})`,
          opacity: Math.min(1, entrance * 1.8),
        }}
      >
        {/* Subtle Top Glow Line */}
        <div className="absolute top-0 inset-x-12 h-[1.5px] bg-gradient-to-r from-transparent via-rose-500/60 to-transparent" />

        {/* Primary Hinglish Words with Dynamic Word-by-Word Glow */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          {activeLine.words.map((item, idx) => {
            const isActive = currentMs >= item.startMs && currentMs <= item.endMs;
            const isPassed = currentMs > item.endMs;

            return (
              <span
                key={`${item.word}-${idx}`}
                className="relative inline-block font-black tracking-tight"
                style={{
                  fontSize: "clamp(34px, 3.4vw, 46px)",
                  lineHeight: 1.2,
                  color: isActive
                    ? "#ffffff"
                    : isPassed
                    ? "#ffe4e6"
                    : "rgba(254, 205, 211, 0.38)",
                  textShadow: isActive
                    ? "0 0 30px rgba(255,59,92,1), 0 0 15px rgba(251,113,133,0.9), 0 2px 10px rgba(0,0,0,0.9)"
                    : isPassed
                    ? "0 2px 8px rgba(0,0,0,0.6)"
                    : "none",
                  transform: isActive ? "scale(1.12) translateY(-2px)" : "scale(1)",
                  transition: "transform 0.12s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.1s ease-out",
                }}
              >
                {/* Active Neon Text Gradient overlay */}
                {isActive ? (
                  <span className="bg-gradient-to-r from-rose-200 via-rose-400 to-amber-300 bg-clip-text text-transparent">
                    {item.word}
                  </span>
                ) : (
                  item.word
                )}

                {/* Animated Glowing Underline Beam */}
                {isActive && (
                  <span
                    className="absolute -bottom-1 left-0 right-0 h-[4px] bg-gradient-to-r from-rose-500 to-amber-400 rounded-full"
                    style={{
                      boxShadow: "0 0 16px rgba(255,59,92,1)",
                    }}
                  />
                )}
              </span>
            );
          })}
        </div>

        {/* Secondary Hindi Script Subtitle (Authentic Poetic Touch) */}
        <div className="mt-1 px-5 py-1.5 rounded-full bg-rose-950/40 border border-rose-500/20 backdrop-blur-sm">
          <span className="text-base md:text-lg font-serif italic text-rose-200/80 tracking-wider">
            {activeLine.hindi}
          </span>
        </div>
      </div>
    </div>
  );
};
