import React, { useMemo } from "react";
import { Video, spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

export interface ZoomBeat {
  startFrame: number;
  endFrame: number;
  scale: number;
  originX?: number; // percentage, e.g. 50 (center)
  originY?: number; // percentage, e.g. 35 (eyes/face)
}

export interface SlideBeat {
  startFrame: number;
  endFrame: number;
  offsetY?: number; // default 340px downward translation
  scale?: number;   // optional scale during slide, e.g. 0.96
}

export interface FacecamFrameProps {
  videoSrc: string;
  zoomBeats?: ZoomBeat[];
  slideDownBeats?: SlideBeat[];
  vignette?: boolean;
  className?: string;
  rounded?: boolean;
  border?: boolean;
  borderColor?: string;
}

export const FacecamFrame: React.FC<FacecamFrameProps> = ({
  videoSrc,
  zoomBeats = [],
  slideDownBeats = [],
  vignette = true,
  className = "",
  rounded = false,
  border = false,
  borderColor = "rgba(255, 255, 255, 0.15)",
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Find active zoom beat
  const currentBeat = useMemo(() => {
    for (const b of zoomBeats) {
      if (frame >= b.startFrame && frame < b.endFrame) {
        return b;
      }
    }
    return null;
  }, [zoomBeats, frame]);

  // Find active slide beat or recently ended slide beat for smooth return
  const { activeSlideBeat, lastSlideBeat } = useMemo(() => {
    let active: SlideBeat | null = null;
    let last: SlideBeat | null = null;

    for (const s of slideDownBeats) {
      if (frame >= s.startFrame && frame < s.endFrame) {
        active = s;
        break;
      }
      if (frame >= s.endFrame && frame < s.endFrame + 25) {
        last = s;
      }
    }
    return { activeSlideBeat: active, lastSlideBeat: last };
  }, [slideDownBeats, frame]);

  // Target scale & origin
  const targetScale = currentBeat ? currentBeat.scale : 1.0;
  const originX = currentBeat?.originX ?? 50;
  const originY = currentBeat?.originY ?? 38; // Default to upper third (face/eyes level)

  // Spring physics for punch-in transition
  const beatStartFrame = currentBeat ? currentBeat.startFrame : 0;
  const zoomProgress = spring({
    frame: frame - beatStartFrame,
    fps,
    config: { damping: 18, stiffness: 120, mass: 0.8 },
  });

  const currentScale = currentBeat
    ? interpolate(zoomProgress, [0, 1], [1.0, targetScale], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1.0;

  // Spring physics for host sliding motion
  let currentOffsetY = 0;
  if (activeSlideBeat) {
    const targetY = activeSlideBeat.offsetY ?? 340;
    const spEnter = spring({
      frame: frame - activeSlideBeat.startFrame,
      fps,
      config: { damping: 16, stiffness: 125 },
    });
    currentOffsetY = interpolate(spEnter, [0, 1], [0, targetY], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  } else if (lastSlideBeat) {
    const fromY = lastSlideBeat.offsetY ?? 340;
    const spExit = spring({
      frame: frame - lastSlideBeat.endFrame,
      fps,
      config: { damping: 16, stiffness: 125 },
    });
    currentOffsetY = interpolate(spExit, [0, 1], [fromY, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }

  return (
    <div
      className={`absolute inset-0 w-full h-full overflow-hidden select-none ${
        rounded ? "rounded-[32px]" : ""
      } ${border ? "border-4" : ""} ${className}`}
      style={{
        width,
        height,
        borderColor: border ? borderColor : "transparent",
      }}
    >
      {/* 1. Master Video Stream */}
      <div
        className="w-full h-full will-change-transform"
        style={{
          transform: `translateY(${currentOffsetY}px) scale(${currentScale})`,
          transformOrigin: `${originX}% ${originY}%`,
        }}
      >
        <Video
          src={videoSrc}
          className="w-full h-full object-cover"
        />
      </div>

      {/* 2. Cinematic Vignette (Subtle perimeter shadow focusing eyes to center face) */}
      {vignette && (
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background:
              "radial-gradient(ellipse at 50% 40%, rgba(0,0,0,0) 50%, rgba(3, 7, 18, 0.48) 85%, rgba(3, 7, 18, 0.82) 100%)",
          }}
        />
      )}

      {/* 3. Subtle Ambient Studio Glow Top/Bottom gradient */}
      <div
        className="absolute inset-x-0 top-0 h-44 pointer-events-none z-10"
        style={{
          background: "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%)",
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-72 pointer-events-none z-10"
        style={{
          background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)",
        }}
      />
    </div>
  );
};
