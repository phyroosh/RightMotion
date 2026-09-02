import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export type SemanticPhysics =
  | "fracture"        // Word visibly cracks into 2 angled shards
  | "gravity_drop"    // Heavy mass falls from above, thuds and bounces
  | "elastic_expand"  // Word inflates outward with bouncy spring tension
  | "heartbeat";      // Rhythmic double-beat pulse

export interface SemanticWordProps {
  word?: string;
  children?: React.ReactNode;
  physics: SemanticPhysics;
  startMs?: number;
  durationMs?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * 💥 SemanticWord
 * Physical animated typography where the motion embodies the psychological meaning of the word.
 * Strictly bounded to prevent caption collisions.
 */
export const SemanticWord: React.FC<SemanticWordProps> = ({
  word: wordProp,
  children,
  physics,
  startMs = 0,
  durationMs = 600,
  className = "",
  style = {},
}) => {
  const word =
    wordProp ??
    (typeof children === "string"
      ? children
      : React.Children.toArray(children).join(""));
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const startFrame = Math.floor((startMs / 1000) * fps);
  const relFrame = Math.max(0, frame - startFrame);

  if (physics === "fracture") {
    // Splits the word into two angled shards that drift slightly apart
    const sp = spring({
      frame: relFrame,
      fps,
      config: { damping: 14, mass: 0.7, stiffness: 140 },
    });

    const split = word.length > 3 ? Math.floor(word.length / 2) : 1;
    const partA = word.slice(0, split);
    const partB = word.slice(split);

    const shiftA = interpolate(sp, [0, 1], [0, -8]);
    const rotA = interpolate(sp, [0, 1], [0, -3.5]);

    const shiftB = interpolate(sp, [0, 1], [0, 10]);
    const rotB = interpolate(sp, [0, 1], [0, 4]);

    return (
      <span className={`inline-flex items-center select-none ${className}`} style={style}>
        <span
          className="inline-block origin-bottom-right transition-transform"
          style={{
            transform: `translateX(${shiftA}px) rotate(${rotA}deg)`,
          }}
        >
          {partA}
        </span>
        <span
          className="inline-block origin-bottom-left transition-transform"
          style={{
            transform: `translateX(${shiftB}px) translateY(${sp * 3}px) rotate(${rotB}deg)`,
          }}
        >
          {partB}
        </span>
      </span>
    );
  }

  if (physics === "gravity_drop") {
    // Drops from above with heavy mass and subtle floor bounce
    const sp = spring({
      frame: relFrame,
      fps,
      config: { damping: 12, mass: 1.2, stiffness: 160 },
    });

    const translateY = interpolate(sp, [0, 1], [-90, 0]);
    const rotate = interpolate(sp, [0, 0.8, 1], [-8, 2, 0]);
    const scaleY = interpolate(sp, [0.8, 0.95, 1], [1.2, 0.85, 1.0]);

    return (
      <span
        className={`inline-block select-none origin-bottom ${className}`}
        style={{
          transform: `translateY(${translateY}px) rotate(${rotate}deg) scaleY(${scaleY})`,
          ...style,
        }}
      >
        {word}
      </span>
    );
  }

  if (physics === "elastic_expand") {
    // Balloons outward with rubber-band spring elasticity
    const sp = spring({
      frame: relFrame,
      fps,
      config: { damping: 8, mass: 0.6, stiffness: 180 },
    });

    const scale = interpolate(sp, [0, 1], [0.3, 1.0]);

    return (
      <span
        className={`inline-block select-none origin-center ${className}`}
        style={{
          transform: `scale(${scale})`,
          ...style,
        }}
      >
        {word}
      </span>
    );
  }

  if (physics === "heartbeat") {
    // Rhythmic double-beat pulse
    const cycle = (relFrame % 30) / 30;
    let pulseScale = 1.0;
    if (cycle < 0.15) {
      pulseScale = 1.0 + Math.sin((cycle / 0.15) * Math.PI) * 0.16;
    } else if (cycle > 0.25 && cycle < 0.45) {
      pulseScale = 1.0 + Math.sin(((cycle - 0.25) / 0.20) * Math.PI) * 0.10;
    }

    return (
      <span
        className={`inline-block select-none origin-center ${className}`}
        style={{
          transform: `scale(${pulseScale})`,
          ...style,
        }}
      >
        {word}
      </span>
    );
  }

  return <span className={className} style={style}>{word}</span>;
};
