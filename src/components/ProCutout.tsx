import React from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { CutoutAssetId, getCutoutMeta, getCutoutPath } from "./CutoutLibrary";

export type CutoutAnimationPreset =
  | "punch_in"
  | "pop_spring"
  | "stamp_impact"
  | "slide_and_lock"
  | "float_ambient"
  | "none";

export type GlowColor = "amber" | "rose" | "emerald" | "sky" | "indigo" | "purple" | "neutral";

export interface ProCutoutProps {
  assetId?: CutoutAssetId | string;
  src?: string;
  currentMs?: number;
  startMs?: number;
  durationMs?: number;
  animation?: CutoutAnimationPreset;
  pedestal?: boolean;
  pedestalLabel?: string;
  pedestalBadge?: string;
  glowColor?: GlowColor;
  ghostText?: string;
  annotation?: string;
  annotationPosition?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  scale?: number;
  tiltDeg?: number;
  className?: string;
  style?: React.CSSProperties;
  width?: number | string;
  height?: number | string;
}

const GLOW_MAP: Record<GlowColor, string> = {
  amber: "radial-gradient(circle, rgba(245,158,11,0.35) 0%, rgba(217,119,6,0.15) 55%, transparent 75%)",
  rose: "radial-gradient(circle, rgba(244,63,94,0.38) 0%, rgba(225,29,72,0.15) 55%, transparent 75%)",
  emerald: "radial-gradient(circle, rgba(16,185,129,0.35) 0%, rgba(5,150,105,0.15) 55%, transparent 75%)",
  sky: "radial-gradient(circle, rgba(14,165,233,0.35) 0%, rgba(2,132,199,0.15) 55%, transparent 75%)",
  indigo: "radial-gradient(circle, rgba(99,102,241,0.38) 0%, rgba(79,70,229,0.15) 55%, transparent 75%)",
  purple: "radial-gradient(circle, rgba(168,85,247,0.38) 0%, rgba(147,51,234,0.15) 55%, transparent 75%)",
  neutral: "radial-gradient(circle, rgba(15,23,42,0.2) 0%, rgba(15,23,42,0.06) 55%, transparent 75%)",
};

export const ProCutout: React.FC<ProCutoutProps> = ({
  assetId,
  src,
  currentMs,
  startMs = 0,
  durationMs,
  animation = "pop_spring",
  pedestal = false,
  pedestalLabel,
  pedestalBadge,
  glowColor,
  ghostText,
  annotation,
  annotationPosition = "top-right",
  scale = 1.0,
  tiltDeg = 0,
  className = "",
  style = {},
  width = 380,
  height = 380,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const activeMs = currentMs !== undefined ? currentMs : (frame / fps) * 1000;
  const elapsedMs = Math.max(0, activeMs - startMs);

  // Check duration exit
  if (durationMs && elapsedMs > durationMs) {
    return null;
  }

  // Resolve image source
  const imageSrc = src
    ? src.startsWith("http") || src.startsWith("/")
      ? src
      : staticFile(src)
    : assetId
    ? staticFile(getCutoutPath(assetId))
    : "";

  const meta = assetId ? getCutoutMeta(assetId) : undefined;

  // Spring physics conforming to the permanent rock-solid lock standard
  const calcFrame = Math.max(0, Math.floor(((activeMs - startMs) / 1000) * fps));

  const sp = animation === "none" ? 1.0 : spring({
    frame: calcFrame,
    fps,
    config: { damping: 18, mass: 0.8, stiffness: 100 },
  });

  // Calculate transform & opacity based on animation preset
  let animTranslateY = 0;
  let animScale = 1.0;
  let animOpacity = 1.0;
  let animRotate = tiltDeg;

  switch (animation) {
    case "none": {
      animScale = 1.0;
      animOpacity = 1.0;
      animTranslateY = 0;
      break;
    }
    case "punch_in": {
      animScale = 0.82 + sp * 0.18;
      animOpacity = Math.min(1, sp * 1.6);
      animTranslateY = (1 - sp) * 20;
      break;
    }
    case "stamp_impact": {
      animScale = 1.28 - sp * 0.28;
      animOpacity = Math.min(1, sp * 2.0);
      animRotate = tiltDeg + (1 - sp) * -6;
      break;
    }
    case "slide_and_lock": {
      animTranslateY = (1 - sp) * 60;
      animScale = 0.9 + sp * 0.1;
      animOpacity = Math.min(1, sp * 1.5);
      break;
    }
    case "float_ambient": {
      animTranslateY = (1 - sp) * 30;
      animOpacity = Math.min(1, sp * 1.4);
      break;
    }
    case "pop_spring":
    default: {
      animTranslateY = (1 - sp) * 40;
      animScale = 0.88 + sp * 0.12;
      animOpacity = Math.min(1, sp * 1.8);
      break;
    }
  }

  const annotPosClasses: Record<string, string> = {
    "top-right": "-top-4 -right-6",
    "top-left": "-top-4 -left-6",
    "bottom-right": "-bottom-4 -right-6",
    "bottom-left": "-bottom-4 -left-6",
  };

  return (
    <div
      className={`relative flex flex-col items-center justify-center select-none ${className}`}
      style={{
        width,
        height,
        opacity: animOpacity,
        transform: `translateY(${animTranslateY}px) scale(${scale * animScale}) rotate(${animRotate}deg)`,
        ...style,
      }}
    >
      {/* Ghost Typography Background */}
      {ghostText && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <span className="text-[120px] font-black text-slate-900/[0.04] leading-none tracking-tighter uppercase whitespace-nowrap select-none">
            {ghostText}
          </span>
        </div>
      )}

      {/* Radial Soft Glow */}
      {glowColor && (
        <div
          className="absolute w-[120%] h-[120%] rounded-full blur-[80px] pointer-events-none z-0"
          style={{ background: GLOW_MAP[glowColor] }}
        />
      )}

      {/* Optional Frosted Glass Pedestal */}
      {pedestal && (
        <div className="absolute inset-0 rounded-[44px] bg-white/75 backdrop-blur-2xl border-[3px] border-white/90 shadow-[0_25px_60px_rgba(0,0,0,0.08),0_1px_3px_rgba(0,0,0,0.05)] z-0 flex flex-col justify-between p-6">
          {pedestalBadge && (
            <div className="self-start px-5 py-2 rounded-full bg-slate-950 text-white font-mono text-[24px] font-black uppercase tracking-wider shadow-md">
              {pedestalBadge}
            </div>
          )}
          {pedestalLabel && (
            <div className="self-center text-center font-black text-slate-900 text-2xl tracking-tight mt-auto">
              {pedestalLabel}
            </div>
          )}
        </div>
      )}

      {/* Hero Cutout Image */}
      {imageSrc && (
        <div className="relative z-10 w-full h-full flex items-center justify-center p-3">
          <Img
            src={imageSrc}
            className="w-full h-full object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.22)]"
            alt={meta?.title || "Pro Cutout"}
          />
        </div>
      )}

      {/* Hand-Annotated Callout Badge */}
      {annotation && (
        <div
          className={`absolute ${annotPosClasses[annotationPosition]} z-30 px-5 py-2.5 rounded-2xl bg-white/95 backdrop-blur-xl border-[2.5px] border-[#0071e3] shadow-2xl flex items-center gap-2`}
          style={{
            transform: `scale(${0.9 + sp * 0.1}) rotate(${-2 + tiltDeg}deg)`,
          }}
        >
          <span className="font-serif italic font-black text-[#0071e3] text-2xl tracking-tight">
            {annotation}
          </span>
        </div>
      )}
    </div>
  );
};
