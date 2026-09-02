import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

export interface GlitchTextProps {
  children: React.ReactNode;
  startMs?: number;
  durationMs?: number;
  shiftPx?: number; // default 4px
  className?: string;
  style?: React.CSSProperties;
}

/**
 * ⚡ GlitchText
 * RGB channel-splitting chromatic aberration micro-flash for cognitive dissonance or warning moments.
 */
export const GlitchText: React.FC<GlitchTextProps> = ({
  children,
  startMs = 0,
  durationMs = 280,
  shiftPx = 4,
  className = "",
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const startFrame = Math.floor((startMs / 1000) * fps);
  const durationFrames = Math.max(1, Math.floor((durationMs / 1000) * fps));
  const relFrame = Math.max(0, frame - startFrame);

  const isActive = relFrame >= 0 && relFrame <= durationFrames;
  // High-frequency jitter during active window
  const shift = isActive ? Math.sin(relFrame * 2.5) * shiftPx : 0;

  return (
    <span className={`relative inline-block select-none ${className}`} style={style}>
      {/* Cyan channel shift */}
      {isActive && (
        <span
          className="absolute inset-0 pointer-events-none text-cyan-500 opacity-70 mix-blend-screen select-none"
          style={{
            transform: `translate(${-shift}px, ${shift * 0.4}px)`,
          }}
          aria-hidden="true"
        >
          {children}
        </span>
      )}

      {/* Red channel shift */}
      {isActive && (
        <span
          className="absolute inset-0 pointer-events-none text-rose-500 opacity-70 mix-blend-screen select-none"
          style={{
            transform: `translate(${shift}px, ${-shift * 0.4}px)`,
          }}
          aria-hidden="true"
        >
          {children}
        </span>
      )}

      {/* Main Base Text */}
      <span className="relative z-10">{children}</span>
    </span>
  );
};
