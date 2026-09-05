import React, { useMemo } from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { CharacterPose } from "./CharacterKeyframeAnimator";

export interface DuoSpeakerSegment {
  speaker: "judy" | "andrew";
  startMs: number;
  endMs: number;
  text?: string;
}

export interface DuoPresenterProps {
  currentMs: number;
  segments?: DuoSpeakerSegment[];
  baseHeight?: number;
  showBadge?: boolean;
  className?: string;
}

export const DuoPresenter: React.FC<DuoPresenterProps> = ({
  currentMs,
  segments = [],
  baseHeight = 1350,
  showBadge = true,
  className = "",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Determine who is currently speaking
  const activeSpeaker: "judy" | "andrew" = useMemo(() => {
    if (!segments || segments.length === 0) return "judy";
    const found = segments.find((s) => currentMs >= s.startMs && currentMs < s.endMs);
    if (found) return found.speaker;

    // If between segments, hold the speaker who spoke last
    const past = segments.filter((s) => s.endMs <= currentMs);
    if (past.length > 0) {
      return past[past.length - 1].speaker;
    }
    return segments[0].speaker;
  }, [segments, currentMs]);

  // Find the exact frame when activeSpeaker changed
  const lastSwitchMs = useMemo(() => {
    if (!segments || segments.length === 0) return 0;
    for (let i = 0; i < segments.length; i++) {
      if (currentMs >= segments[i].startMs && currentMs < segments[i].endMs) {
        return segments[i].startMs;
      }
    }
    return 0;
  }, [segments, currentMs]);

  const switchFrame = Math.floor((lastSwitchMs / 1000) * fps);
  const switchProgress = spring({
    frame: frame - switchFrame,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
  });

  const isJudySpeaking = activeSpeaker === "judy";

  // Micro-movements (breathing, subtle organic presence)
  const t = frame / fps;
  const breathY = Math.sin(t * 2.6) * 3;
  const breathScale = 1 + Math.sin(t * 2.6) * 0.0025;
  const microSway = Math.cos(t * 1.6) * 0.4;

  // Staging Interpolations (Intimate 9:16 mobile waist-up positioning)
  // When Judy speaks: Judy is center-left (x: -80), scale: 1.08, opacity: 1.0.
  // When Andrew speaks: Judy retreats to side (x: -220), scale: 0.92, opacity: 0.78.
  const judyX = isJudySpeaking
    ? interpolate(switchProgress, [0, 1], [-200, -80])
    : interpolate(switchProgress, [0, 1], [-80, -220]);

  const judyScale = isJudySpeaking
    ? interpolate(switchProgress, [0, 1], [0.92, 1.08])
    : interpolate(switchProgress, [0, 1], [1.08, 0.92]);

  const judyY = isJudySpeaking
    ? interpolate(switchProgress, [0, 1], [40, 0])
    : interpolate(switchProgress, [0, 1], [0, 40]);

  const judyOpacity = isJudySpeaking
    ? interpolate(switchProgress, [0, 1], [0.78, 1.0])
    : interpolate(switchProgress, [0, 1], [1.0, 0.78]);

  // When Andrew speaks: Andrew is center-right (x: 80), scale: 1.08, opacity: 1.0.
  // When Judy speaks: Andrew retreats to side (x: 220), scale: 0.92, opacity: 0.78.
  const andrewX = !isJudySpeaking
    ? interpolate(switchProgress, [0, 1], [200, 80])
    : interpolate(switchProgress, [0, 1], [80, 220]);

  const andrewScale = !isJudySpeaking
    ? interpolate(switchProgress, [0, 1], [0.92, 1.08])
    : interpolate(switchProgress, [0, 1], [1.08, 0.92]);

  const andrewY = !isJudySpeaking
    ? interpolate(switchProgress, [0, 1], [40, 0])
    : interpolate(switchProgress, [0, 1], [0, 40]);

  const andrewOpacity = !isJudySpeaking
    ? interpolate(switchProgress, [0, 1], [0.78, 1.0])
    : interpolate(switchProgress, [0, 1], [1.0, 0.78]);

  // Poses:
  // When Judy speaks: Judy points or opens palms, Andrew listens with hand on chin.
  // When Andrew speaks: Andrew arms crossed questioning, Judy smirks arms crossed.
  const judyPoseSrc = isJudySpeaking
    ? staticFile("character_pointing.png")
    : staticFile("character_crossed.png");

  const andrewPoseSrc = !isJudySpeaking
    ? staticFile("andrew_crossed.png")
    : staticFile("andrew_thinking.png");

  return (
    <div className={`absolute inset-0 pointer-events-none z-30 flex flex-col items-center justify-end overflow-hidden ${className}`}>
      
      {/* 1. Andrew (Male Counterpart / Inquisitive Voice) */}
      <div
        className="absolute bottom-0 flex items-end justify-center pointer-events-none select-none transition-all"
        style={{
          width: "900px",
          height: `${baseHeight}px`,
          opacity: andrewOpacity,
          zIndex: !isJudySpeaking ? 25 : 15,
          transform: `translate(${andrewX}px, ${andrewY + breathY}px) scale(${andrewScale * breathScale}) rotate(${-microSway}deg)`,
          transformOrigin: "bottom center",
          filter: !isJudySpeaking ? "drop-shadow(0 20px 40px rgba(245, 158, 11, 0.25))" : "none",
        }}
      >
        <Img
          src={andrewPoseSrc}
          className="w-full h-full object-contain object-bottom drop-shadow-[0_25px_50px_rgba(0,0,0,0.3)]"
          alt="Andrew Character"
        />
      </div>

      {/* 2. Judy (Hero Host / Psychological Guide) */}
      <div
        className="absolute bottom-0 flex items-end justify-center pointer-events-none select-none transition-all"
        style={{
          width: "900px",
          height: `${baseHeight}px`,
          opacity: judyOpacity,
          zIndex: isJudySpeaking ? 25 : 15,
          transform: `translate(${judyX}px, ${judyY + breathY}px) scale(${judyScale * breathScale}) rotate(${microSway}deg)`,
          transformOrigin: "bottom center",
          filter: isJudySpeaking ? "drop-shadow(0 20px 40px rgba(56, 189, 248, 0.25))" : "none",
        }}
      >
        <Img
          src={judyPoseSrc}
          className="w-full h-full object-contain object-bottom drop-shadow-[0_25px_50px_rgba(0,0,0,0.25)]"
          alt="Judy Character"
        />
      </div>

      {/* 3. Sleek Active Speaker HUD Badge */}
      {showBadge && (
        <div
          className="absolute top-[5.5%] left-1/2 -translate-x-1/2 z-40 pointer-events-none transition-all duration-300"
        >
          <div
            style={{
              backgroundColor: isJudySpeaking ? "rgba(7, 19, 30, 0.88)" : "rgba(20, 14, 8, 0.88)",
              border: `1.5px solid ${isJudySpeaking ? "rgba(56, 189, 248, 0.6)" : "rgba(245, 158, 11, 0.6)"}`,
              boxShadow: `0 8px 25px ${isJudySpeaking ? "rgba(56, 189, 248, 0.3)" : "rgba(245, 158, 11, 0.3)"}`,
            }}
            className="px-4 py-1.5 rounded-full backdrop-blur-xl flex items-center gap-2"
          >
            <div
              style={{
                backgroundColor: isJudySpeaking ? "#38bdf8" : "#fbbf24",
              }}
              className="w-2 h-2 rounded-full animate-ping"
            />
            <span
              style={{
                color: isJudySpeaking ? "#7dd3fc" : "#fcd34d",
              }}
              className="text-xs font-mono font-black tracking-widest uppercase"
            >
              {isJudySpeaking ? "JUDY • INSIGHTS" : "ANDREW • QUESTION"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
