import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export interface DioramaPlinthProps {
  width?: number;
  height?: number;
  depth?: number;
  color?: "slate" | "amber" | "cyber-navy" | "alabaster";
  label?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * 🏛️ DioramaPlinth
 * An architectural ground plane for environmental dioramas.
 * Provides spatial grounding, a definitive edge, and contact shadows.
 */
export const DioramaPlinth: React.FC<DioramaPlinthProps> = ({
  width = 800,
  height = 40,
  depth = 120, // Used for 3D faux extrusion effect if we want it, but let's stick to 2.5D sharp UI
  color = "slate",
  label,
  children,
  className = "",
  style = {},
}) => {
  const getColors = () => {
    switch (color) {
      case "amber":
        return {
          top: "bg-amber-400",
          front: "bg-amber-600",
          border: "border-amber-950",
          text: "text-amber-900",
        };
      case "cyber-navy":
        return {
          top: "bg-slate-800",
          front: "bg-slate-900",
          border: "border-black",
          text: "text-cyan-400",
        };
      case "alabaster":
        return {
          top: "bg-slate-50",
          front: "bg-slate-200",
          border: "border-slate-950",
          text: "text-slate-400",
        };
      case "slate":
      default:
        return {
          top: "bg-slate-800",
          front: "bg-slate-900",
          border: "border-slate-950",
          text: "text-slate-400",
        };
    }
  };

  const theme = getColors();

  return (
    <div
      className={`relative ${className}`}
      style={{
        width: `${width}px`,
        ...style,
      }}
    >
      {/* 1. Main Content Area above the plinth */}
      <div className="relative z-10">{children}</div>

      {/* 2. The Plinth Base (Ground plane) */}
      <div className="relative w-full z-0">
        {/* Top Surface (Deck) */}
        <div
          className={`absolute bottom-0 w-full rounded-t-sm border-[2.5px] border-b-0 ${theme.border} ${theme.top}`}
          style={{ height: `${height}px` }}
        >
          {label && (
            <div
              className={`absolute top-2 left-4 font-mono text-[10px] font-bold uppercase tracking-[0.2em] ${theme.text} opacity-80`}
            >
              {label}
            </div>
          )}
        </div>

        {/* Front Bevel Edge (Thickness) */}
        <div
          className={`absolute top-0 w-full rounded-b-md border-[2.5px] ${theme.border} ${theme.front} shadow-[0_24px_48px_-12px_rgba(0,0,0,0.5)]`}
          style={{ height: `${height * 0.4}px`, transform: `translateY(${height}px)` }}
        />

        {/* Deep Contact Shadow */}
        <div
          className="absolute w-[96%] left-[2%] bg-black opacity-30 blur-xl"
          style={{ height: `${height * 1.5}px`, top: `${height * 0.8}px`, zIndex: -1 }}
        />
      </div>
    </div>
  );
};
