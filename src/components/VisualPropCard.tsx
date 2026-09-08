import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig, staticFile, Img } from "remotion";
import { getCutoutPath } from "./CutoutLibrary";

export type StampTheme = "trusted_red" | "verified_blue" | "warning_amber" | "matrix_emerald";

export interface VisualPropCardProps {
  imageSrc?: string;
  cutoutId?: string;
  entranceFrame?: number;
  durationFrames?: number;
  width?: number;
  height?: number;
  tiltX?: number;
  tiltY?: number;
  stampText?: string;
  stampSubtext?: string;
  stampFrame?: number;
  stampTheme?: StampTheme;
  ghostEcho?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * 🎨 VisualPropCard
 * Replaces SaaS UI cards with high-fashion floating editorial visual props.
 * Clean squircles, physical drop-shadows, 3D cutout support, and tactile scalloped stamps.
 */
export const VisualPropCard: React.FC<VisualPropCardProps> = ({
  imageSrc,
  cutoutId,
  entranceFrame = 0,
  durationFrames,
  width = 680,
  height = 420,
  tiltX = 2,
  tiltY = -2,
  stampText,
  stampSubtext,
  stampFrame,
  stampTheme = "trusted_red",
  ghostEcho,
  className = "",
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < entranceFrame) {
    return null;
  }

  if (durationFrames && frame > entranceFrame + durationFrames) {
    return null;
  }

  const relFrame = frame - entranceFrame;

  // Snappy yet smooth physical drop-in spring
  const enterSpring = spring({
    frame: relFrame,
    fps,
    config: { damping: 14, stiffness: 140, mass: 0.9 },
  });

  const enterScale = interpolate(enterSpring, [0, 1], [0.88, 1]);
  const enterY = interpolate(enterSpring, [0, 1], [45, 0]);
  const enterOpacity = Math.min(1, enterSpring * 1.5);

  // Subtle 2.5D Ken Burns zoom (1.00 -> 1.05 over 180 frames)
  const kenBurns = interpolate(relFrame, [0, 200], [1.0, 1.05], {
    extrapolateRight: "clamp",
  });

  // Stamp entrance spring
  const sFrame = stampFrame !== undefined ? stampFrame : entranceFrame + 25;
  const stampSpring = spring({
    frame: Math.max(0, frame - sFrame),
    fps,
    config: { damping: 10, stiffness: 190, mass: 0.7 },
  });

  const rawPath = imageSrc || (cutoutId ? getCutoutPath(cutoutId) : "");
  const assetSrc = rawPath
    ? rawPath.startsWith("http://") || rawPath.startsWith("https://") || rawPath.startsWith("data:")
      ? rawPath
      : staticFile(rawPath.replace(/^\//, ""))
    : "";

  return (
    <div
      className={`relative flex items-center justify-center pointer-events-none select-none ${className}`}
      style={{
        ...style,
      }}
    >
      {/* 1. Ghost Typography Echo Behind Card */}
      {ghostEcho && (
        <div
          className="absolute text-slate-900/[0.045] font-serif font-black italic select-none pointer-events-none text-center whitespace-nowrap z-0"
          style={{
            fontSize: "clamp(120px, 18vw, 240px)",
            transform: `translateY(${interpolate(enterSpring, [0, 1], [20, 0])}px) scale(${enterScale})`,
            letterSpacing: "-0.04em",
          }}
        >
          {ghostEcho}
        </div>
      )}

      {/* 2. Main Visual Prop Card */}
      <div
        className="relative z-10"
        style={{
          width,
          height: cutoutId && !height ? "auto" : height,
          opacity: enterOpacity,
          transform: `perspective(1200px) translateY(${enterY}px) scale(${enterScale}) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
        }}
      >
        {cutoutId && !imageSrc ? (
          /* Transparent 3D Cutout mode (e.g. Brain, Smartphone, Character) */
          <div className="w-full h-full flex items-center justify-center">
            <Img
              src={assetSrc}
              alt="Visual Cutout"
              className="max-w-full max-h-full object-contain"
              style={{
                filter:
                  "drop-shadow(0 25px 35px rgba(0,0,0,0.18)) drop-shadow(0 8px 16px rgba(0,0,0,0.12))",
                transform: `scale(${kenBurns})`,
              }}
            />
          </div>
        ) : (
          /* High-Fashion Editorial Photo/Illustration Card */
          <div
            className="w-full h-full rounded-[44px] overflow-hidden bg-white"
            style={{
              boxShadow:
                "0 30px 80px -15px rgba(0,0,0,0.22), 0 10px 30px -10px rgba(0,0,0,0.10), inset 0 1.5px 2px rgba(255,255,255,0.9)",
            }}
          >
            <Img
              src={assetSrc}
              alt="Editorial Scene Illustration"
              className="w-full h-full object-cover"
              style={{
                transform: `scale(${kenBurns})`,
                transformOrigin: "center center",
              }}
            />
            {/* Subtle photographic vignette edge falloff */}
            <div
              className="absolute inset-0 pointer-events-none rounded-[44px]"
              style={{
                boxShadow: "inset 0 0 40px rgba(0,0,0,0.06)",
                border: "1px solid rgba(255,255,255,0.6)",
              }}
            />
          </div>
        )}

        {/* 3. Scalloped Tactical Stamp (Red "TRUSTED" seal from reference frame 10) */}
        {stampText && frame >= sFrame && (
          <div
            className="absolute -bottom-6 -right-6 z-20 flex flex-col items-center justify-center text-center select-none"
            style={{
              width: 150,
              height: 150,
              opacity: Math.min(1, stampSpring * 1.5),
              transform: `scale(${interpolate(stampSpring, [0, 1], [0.3, 1])}) rotate(${interpolate(stampSpring, [0, 1], [-25, 8])}deg)`,
              filter: "drop-shadow(0 14px 25px rgba(225,29,72,0.35))",
            }}
          >
            {/* Scalloped Stamp SVG */}
            <svg
              viewBox="0 0 160 160"
              className="absolute inset-0 w-full h-full"
            >
              <defs>
                <filter id="stamp-roughness">
                  <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" result="noise" />
                  <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.5" xChannelSelector="R" yChannelSelector="G" />
                </filter>
              </defs>
              <path
                d="M 80 8 
                   C 86 8, 92 11, 97 15 C 103 12, 110 12, 115 17 C 121 16, 128 19, 131 25 C 137 26, 142 31, 144 38 C 149 41, 153 47, 153 54 C 157 59, 159 66, 157 73 C 160 79, 160 86, 157 92 C 158 99, 156 106, 152 111 C 152 118, 148 124, 143 128 C 141 135, 136 140, 130 142 C 127 148, 120 151, 114 151 C 109 156, 102 157, 96 154 C 91 158, 84 158, 79 154 C 73 157, 66 156, 61 151 C 55 151, 48 148, 45 142 C 39 140, 34 135, 32 128 C 27 124, 23 118, 23 111 C 19 106, 17 99, 18 92 C 15 86, 15 79, 18 73 C 16 66, 18 59, 22 54 C 22 47, 26 41, 31 38 C 33 31, 38 26, 44 25 C 47 19, 54 16, 60 17 C 65 12, 72 12, 78 15 Z"
                fill={stampTheme === "trusted_red" ? "#dc2626" : stampTheme === "verified_blue" ? "#0284c7" : stampTheme === "matrix_emerald" ? "#059669" : "#d97706"}
                filter="url(#stamp-roughness)"
              />
              {/* Inner ring */}
              <circle
                cx="80"
                cy="80"
                r="62"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeDasharray="5 3"
                opacity="0.8"
              />
            </svg>

            {/* Stamp Content */}
            <div className="relative z-10 flex flex-col items-center justify-center text-white px-2">
              {/* 3 Stars */}
              <div className="flex items-center gap-1 mb-0.5 text-white/90 text-sm">
                <span>★</span>
                <span className="text-base font-bold">★</span>
                <span>★</span>
              </div>
              <div className="font-black text-lg tracking-wider uppercase leading-none font-mono">
                {stampText}
              </div>
              {stampSubtext && (
                <div className="text-[10px] tracking-widest uppercase font-mono mt-0.5 opacity-90">
                  {stampSubtext}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
