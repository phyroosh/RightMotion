import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

export interface CameraShakeProps {
  children: React.ReactNode;
  triggerFrames?: number[]; // Frames when camera trauma triggers
  intensity?: number;       // Pixel displacement (default: 8px)
  decayRate?: number;       // Exponential decay speed (default: 0.35)
  className?: string;
  style?: React.CSSProperties;
}

/**
 * 📳 CameraShake (Screen Trauma Engine)
 * High-impact camera trauma algorithm triggered on impact_hit cues.
 * Delivers visceral weight without dizziness.
 */
export const CameraShake: React.FC<CameraShakeProps> = ({
  children,
  triggerFrames = [],
  intensity = 10,
  decayRate = 0.35,
  className = "",
  style = {},
}) => {
  const frame = useCurrentFrame();

  let totalTraumaX = 0;
  let totalTraumaY = 0;
  let totalTraumaRot = 0;

  for (const trig of triggerFrames) {
    const delta = frame - trig;
    if (delta >= 0 && delta <= 12) {
      const decay = Math.exp(-delta * decayRate);
      // High frequency pseudo-random trauma based on sin/cos
      const x = Math.sin(delta * 2.8) * intensity * decay;
      const y = Math.cos(delta * 3.2) * (intensity * 0.7) * decay;
      const rot = Math.sin(delta * 2.1) * (intensity * 0.12) * decay;

      totalTraumaX += x;
      totalTraumaY += y;
      totalTraumaRot += rot;
    }
  }

  return (
    <div
      className={`w-full h-full ${className}`}
      style={{
        transform: `translate(${totalTraumaX}px, ${totalTraumaY}px) rotate(${totalTraumaRot}deg)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
