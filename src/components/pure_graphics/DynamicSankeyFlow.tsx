import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export interface SankeyBranch {
  id: string;
  label: string;
  sublabel?: string;
  percentage: number; // e.g. 65 for 65%
  color: "rose" | "amber" | "emerald" | "sky" | "slate";
  startFrame: number; // Spoken frame when this branch reveals
}

export interface DynamicSankeyFlowProps {
  sourceTitle: string;
  sourceCategory?: string;
  sourceValue?: string;
  branches: SankeyBranch[];
  entranceFrame?: number;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
}

const COLOR_MAP = {
  rose: { stroke: "#e11d48", fill: "rgba(225, 29, 72, 0.12)", badge: "bg-rose-100 text-rose-700 border-rose-300" },
  amber: { stroke: "#f59e0b", fill: "rgba(245, 158, 11, 0.12)", badge: "bg-amber-100 text-amber-800 border-amber-300" },
  emerald: { stroke: "#059669", fill: "rgba(5, 150, 105, 0.12)", badge: "bg-emerald-100 text-emerald-800 border-emerald-300" },
  sky: { stroke: "#0284c7", fill: "rgba(2, 132, 199, 0.12)", badge: "bg-sky-100 text-sky-800 border-sky-300" },
  slate: { stroke: "#475569", fill: "rgba(71, 85, 105, 0.12)", badge: "bg-slate-100 text-slate-800 border-slate-300" },
};

/**
 * 🌊 DynamicSankeyFlow
 * Kinetic editorial flow diagram showing energy, focus, money, or habits
 * branching from a source node into multiple proportional streams.
 */
export const DynamicSankeyFlow: React.FC<DynamicSankeyFlowProps> = ({
  sourceTitle,
  sourceCategory = "TOTAL CAPACITY",
  sourceValue = "100%",
  branches,
  entranceFrame = 0,
  width = 920,
  height = 540,
  className = "",
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring for the source node
  const spSource = spring({
    frame: frame - entranceFrame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  const sourceX = 180;
  const sourceY = height / 2;
  const targetX = width - 260;

  const totalBranches = branches.length;
  const branchSpacing = height / (totalBranches + 1);

  return (
    <div
      className={`relative rounded-3xl bg-white border-[2.5px] border-slate-900 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.16)] p-6 overflow-hidden ${className}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        opacity: frame >= entranceFrame ? Math.min(1, spSource * 1.5) : 0,
        transform: `scale(${frame >= entranceFrame ? interpolate(spSource, [0, 1], [0.92, 1]) : 0.92})`,
        ...style,
      }}
    >
      {/* SVG Canvas for Flowing Bezier Ribbons */}
      <svg
        className="absolute inset-0 pointer-events-none w-full h-full"
        viewBox={`0 0 ${width} ${height}`}
      >
        <defs>
          <linearGradient id="flowPulseGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>

        {branches.map((b, idx) => {
          const isBranchActive = frame >= b.startFrame;
          const spBranch = spring({
            frame: frame - b.startFrame,
            fps,
            config: { damping: 13, stiffness: 130 },
          });

          const branchY = branchSpacing * (idx + 1);
          const cp1X = sourceX + (targetX - sourceX) * 0.45;
          const cp2X = sourceX + (targetX - sourceX) * 0.55;

          const pathD = `M ${sourceX} ${sourceY} C ${cp1X} ${sourceY}, ${cp2X} ${branchY}, ${targetX} ${branchY}`;
          const colorConfig = COLOR_MAP[b.color] || COLOR_MAP.slate;
          const ribbonWidth = Math.max(4, Math.round((b.percentage / 100) * 32));

          const drawLength = isBranchActive ? Math.min(1, spBranch) : 0;

          // Pulse animation along the ribbon
          const pulseOffset = (frame * 3) % 200;

          return (
            <g key={b.id}>
              {/* Background Ribbon Flow */}
              <path
                d={pathD}
                fill="none"
                stroke={colorConfig.stroke}
                strokeWidth={ribbonWidth}
                strokeOpacity={isBranchActive ? 0.28 : 0}
                strokeDasharray="600"
                strokeDashoffset={interpolate(drawLength, [0, 1], [600, 0])}
                strokeLinecap="round"
              />
              {/* Core Active Flow Line */}
              <path
                d={pathD}
                fill="none"
                stroke={colorConfig.stroke}
                strokeWidth={Math.max(2.5, ribbonWidth * 0.45)}
                strokeOpacity={isBranchActive ? 0.9 : 0}
                strokeDasharray="600"
                strokeDashoffset={interpolate(drawLength, [0, 1], [600, 0])}
                strokeLinecap="round"
              />
              {/* Fluid Traveling Light Pulse */}
              {isBranchActive && (
                <path
                  d={pathD}
                  fill="none"
                  stroke={colorConfig.stroke}
                  strokeWidth={ribbonWidth * 0.8}
                  strokeDasharray="24 120"
                  strokeDashoffset={-pulseOffset}
                  strokeOpacity={0.8}
                  strokeLinecap="round"
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* Left Source Node */}
      <div
        className="absolute z-20 w-[170px] -translate-y-1/2 p-4 rounded-2xl bg-slate-950 text-white border-2 border-slate-900 shadow-xl flex flex-col items-center text-center gap-1"
        style={{
          left: "24px",
          top: `${sourceY}px`,
        }}
      >
        <span className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase">
          {sourceCategory}
        </span>
        <span className="text-2xl font-black uppercase leading-tight">
          {sourceTitle}
        </span>
        <span className="mt-1 px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-black text-sm">
          {sourceValue}
        </span>
      </div>

      {/* Right Target Branch Nodes */}
      {branches.map((b, idx) => {
        const isBranchActive = frame >= b.startFrame;
        const spBranch = spring({
          frame: frame - b.startFrame,
          fps,
          config: { damping: 14, stiffness: 130 },
        });

        const branchY = branchSpacing * (idx + 1);
        const colorConfig = COLOR_MAP[b.color] || COLOR_MAP.slate;

        return (
          <div
            key={`node-${b.id}`}
            className="absolute z-20 w-[240px] -translate-y-1/2 flex items-center justify-between p-3.5 rounded-2xl bg-white border-[2.5px] border-slate-900 shadow-md transition-transform"
            style={{
              left: `${targetX}px`,
              top: `${branchY}px`,
              opacity: isBranchActive ? Math.min(1, spBranch * 1.5) : 0,
              transform: `translateY(-50%) scale(${isBranchActive ? interpolate(spBranch, [0, 1], [0.85, 1]) : 0.85})`,
            }}
          >
            <div className="flex flex-col text-left">
              <span className="text-lg font-black text-slate-950 uppercase leading-none">
                {b.label}
              </span>
              {b.sublabel && (
                <span className="text-xs font-mono text-slate-500 font-semibold mt-1">
                  {b.sublabel}
                </span>
              )}
            </div>
            <div
              className={`px-2.5 py-1 rounded-xl border text-sm font-mono font-black shrink-0 ${colorConfig.badge}`}
            >
              {b.percentage}%
            </div>
          </div>
        );
      })}
    </div>
  );
};
