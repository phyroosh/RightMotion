import React from "react";
import {
  spring,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
  Img,
} from "remotion";
import { PhysicalCard } from "./physics/PhysicalCard";
import { TapeStrip } from "./collage/TapeStrip";
import { FileText, Sparkles, CheckCircle2 } from "lucide-react";

export interface ProductPageShowcaseProps {
  /** Relative image path inside public/ (e.g. "products/Photon/page_14.png") */
  imageSrc: string;
  /** Page number for the telemetry badge */
  pageNum?: number;
  /** Product display name (e.g. "PHOTON BLUEPRINT") */
  productName?: string;
  /** Accent color: "cyan" | "emerald" | "amber" | "blue" */
  accentColor?: "cyan" | "emerald" | "amber" | "blue";
  /** Optional custom badge label (default: "WORKSHEET PROTOCOL") */
  badgeLabel?: string;
  /** Frame when the showcase enters */
  entranceFrame?: number;
  /** Width in pixels (default: 840) */
  width?: number;
  /** Max height in pixels (default: 1040) */
  height?: number;
  /** Whether to show top masking tape strip */
  showTape?: boolean;
}

export const ProductPageShowcase: React.FC<ProductPageShowcaseProps> = ({
  imageSrc,
  pageNum = 14,
  productName = "PHOTON PROTOCOL",
  accentColor = "cyan",
  badgeLabel = "WORKSHEET PROTOCOL",
  entranceFrame = 0,
  width = 840,
  height = 1040,
  showTape = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relFrame = Math.max(0, frame - entranceFrame);

  // Punchy physical entrance spring
  const spEnter = spring({
    frame: relFrame,
    fps,
    config: { damping: 14, stiffness: 130, mass: 0.9 },
  });

  // Specular holographic glass glare sweep (slides across sheet on landing)
  const glareProgress = interpolate(relFrame, [4, 28], [-120, 220], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Subtle cinematic zoom drift into the worksheet
  const zoomDrift = interpolate(relFrame, [0, 150], [1.0, 1.04], {
    extrapolateRight: "clamp",
  });

  // Color mapping
  const colorStyles = {
    cyan: {
      border: "border-cyan-500/40",
      glow: "rgba(6, 182, 212, 0.25)",
      badgeBg: "bg-cyan-500/20",
      badgeText: "text-cyan-300",
      badgeBorder: "border-cyan-500/40",
      iconColor: "text-cyan-400",
    },
    emerald: {
      border: "border-emerald-500/40",
      glow: "rgba(16, 185, 129, 0.25)",
      badgeBg: "bg-emerald-500/20",
      badgeText: "text-emerald-300",
      badgeBorder: "border-emerald-500/40",
      iconColor: "text-emerald-400",
    },
    amber: {
      border: "border-amber-500/40",
      glow: "rgba(245, 158, 11, 0.25)",
      badgeBg: "bg-amber-500/20",
      badgeText: "text-amber-300",
      badgeBorder: "border-amber-500/40",
      iconColor: "text-amber-400",
    },
    blue: {
      border: "border-sky-500/40",
      glow: "rgba(14, 165, 233, 0.25)",
      badgeBg: "bg-sky-500/20",
      badgeText: "text-sky-300",
      badgeBorder: "border-sky-500/40",
      iconColor: "text-[#0071e3]",
    },
  }[accentColor];

  if (frame < entranceFrame) return null;

  return (
    <div
      className="relative flex flex-col items-center justify-center select-none"
      style={{
        opacity: Math.min(1, spEnter * 1.2),
        transform: `scale(${interpolate(spEnter, [0, 1], [0.85, 1]) * zoomDrift}) translateY(${interpolate(spEnter, [0, 1], [40, 0])}px)`,
        pointerEvents: "none",
      }}
    >
      <div className="relative" style={{ width, maxWidth: "90vw" }}>
        {/* Anchored Tape Strip safe on top corner */}
        {showTape && (
          <div className="absolute -top-7 right-10 z-30 pointer-events-none">
            <TapeStrip position="top-right" width={180} height={46} enableWobble />
          </div>
        )}

        <PhysicalCard
          tiltX={4}
          tiltY={-3}
          elevation={48}
          impactMs={entranceFrame ? Math.round((entranceFrame / fps) * 1000) : 0}
          className={`w-full p-4 rounded-[32px] bg-[#070b16]/95 border-2 ${colorStyles.border} shadow-[0_30px_70px_-15px_rgba(0,0,0,0.85)] backdrop-blur-xl flex flex-col items-center gap-3 overflow-hidden`}
        >
          {/* Top Telemetry Header Bar */}
          <div className="w-full flex items-center justify-between px-2 pt-1 pb-2 border-b border-white/10">
            <div className="flex items-center gap-3">
              <span className={`p-2 rounded-xl ${colorStyles.badgeBg} ${colorStyles.badgeBorder} border`}>
                <FileText className={`w-6 h-6 ${colorStyles.iconColor}`} />
              </span>
              <div className="text-left">
                <span className="text-xl font-mono text-slate-400 font-bold uppercase tracking-wider block leading-none">
                  {productName}
                </span>
                <span className="text-2xl font-black text-white tracking-tight uppercase mt-1 block">
                  {badgeLabel}
                </span>
              </div>
            </div>

            <div
              className={`px-4 py-2 rounded-xl ${colorStyles.badgeBg} ${colorStyles.badgeText} ${colorStyles.badgeBorder} border text-2xl font-mono font-black tracking-wider uppercase shadow-md flex items-center gap-2`}
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>PAGE {pageNum}</span>
            </div>
          </div>

          {/* High-Resolution Document Page Frame */}
          <div
            className="relative w-full rounded-2xl overflow-hidden bg-white border border-white/30 shadow-2xl flex items-center justify-center p-2"
            style={{ maxHeight: height, height: "auto" }}
          >
            {/* The Extracted High-Resolution PDF Page */}
            <Img
              src={staticFile(imageSrc)}
              className="w-full h-auto object-contain block select-none rounded-xl"
              alt={`${productName} Page ${pageNum}`}
            />

            {/* Specular Animated Glass Glare Shimmer Sweep */}
            <div
              className="absolute inset-0 pointer-events-none z-20 mix-blend-screen opacity-40"
              style={{
                transform: `translateX(${glareProgress}%)`,
                background:
                  "linear-gradient(115deg, transparent 25%, rgba(255,255,255,0.7) 50%, transparent 75%)",
              }}
            />

            {/* Subtle Inner Paper Vignette */}
            <div className="absolute inset-0 pointer-events-none rounded-2xl ring-1 ring-inset ring-white/20" />
          </div>
        </PhysicalCard>
      </div>
    </div>
  );
};
