import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export interface CantileverLoad {
  id: string;
  mass: number;
  landFrame: number;
  distanceX: number; // distance from wall in px (e.g. 360, 680)
  title: string;
  metric: string;
}

export interface MonolithicCantileverProps {
  wallX?: number; // X position of reaction wall edge (default: 160)
  anchorY?: number; // Y position of girder centerline (default: 680)
  girderWidth?: number; // Total intact width (default: 840)
  girderHeight?: number; // Cross-section thickness (default: 260)
  shearFrame?: number; // Exact frame of catastrophic snap (default: 1171)
  crashFrame?: number; // Exact frame of ground impact (default: 1245)
  floorY?: number; // Bedrock ground floor level (default: 1760)
  loads?: CantileverLoad[];
  className?: string;
  style?: React.CSSProperties;
}

export const MonolithicCantilever: React.FC<MonolithicCantileverProps> = ({
  wallX = 160,
  anchorY = 680,
  girderWidth = 840,
  girderHeight = 260,
  shearFrame = 1171,
  crashFrame = 1245,
  floorY = 1760,
  loads = [
    {
      id: "load-1",
      mass: 450,
      landFrame: 280,
      distanceX: 380,
      title: "RESPONSIBILITY",
      metric: "450 kN",
    },
    {
      id: "load-2",
      mass: 850,
      landFrame: 600,
      distanceX: 720,
      title: "EXPECTATIONS",
      metric: "850 kN",
    },
  ],
  className = "",
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // -------------------------------------------------------------
  // 1. Deflection Dynamics (Pre-Shear)
  // -------------------------------------------------------------
  const isSheared = frame >= shearFrame;

  // Load 1 spring response
  const load1 = loads[0];
  const load1Spring =
    frame >= load1.landFrame
      ? spring({
          frame: frame - load1.landFrame,
          fps,
          config: { damping: 13, stiffness: 120, mass: 2.2 },
        })
      : 0;

  // Load 2 spring response
  const load2 = loads[1];
  const load2Spring =
    frame >= load2.landFrame
      ? spring({
          frame: frame - load2.landFrame,
          fps,
          config: { damping: 11, stiffness: 100, mass: 2.8 },
        })
      : 0;

  // Severe progressive sag: 0° -> 8.5° -> 22.5°
  const activeSag = isSheared
    ? 22.5
    : load1Spring * 8.5 + load2Spring * 14.0;

  // -------------------------------------------------------------
  // 2. Fissure / Fracture Vein Intensity (Frames 770 -> 1170)
  // -------------------------------------------------------------
  const fractureProgress = interpolate(frame, [770, 1150], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Dramatic breath hold pulsing
  const fracturePulse =
    frame >= 1100 && frame < shearFrame
      ? 0.9 + 0.1 * Math.sin(frame * 0.45)
      : fractureProgress;

  // -------------------------------------------------------------
  // 3. Post-Shear Dynamics: Recoil vs Free-Fall
  // -------------------------------------------------------------
  const stumpWidth = 160;
  const severedWidth = girderWidth - stumpWidth; // 680px

  // Recoil of the anchored stump after violent release
  const stumpRecoil = isSheared
    ? spring({
        frame: frame - shearFrame,
        fps,
        config: { damping: 8, stiffness: 220, mass: 1.0 },
      })
    : 0;
  const stumpAngle = isSheared
    ? interpolate(stumpRecoil, [0, 1], [22.5, 0])
    : activeSag;

  // Free-fall trajectory of the severed span
  const fallFrames = Math.max(0, frame - shearFrame);
  const totalFallDuration = crashFrame - shearFrame; // ~74 frames
  const fallProgress = Math.min(1, fallFrames / totalFallDuration);

  // Accelerated quadratic gravity drop
  const dropDistance = floorY - anchorY - 60; // Distance to bedrock
  const freeFallY = isSheared
    ? fallProgress < 1
      ? Math.pow(fallProgress, 2.1) * dropDistance
      : dropDistance +
        // Dead rebound thud upon impact
        spring({
          frame: frame - crashFrame,
          fps,
          config: { damping: 14, stiffness: 180, mass: 3.5 },
        }) * -18
    : 0;

  // Pitch rotation during plunge and resting angle on bedrock
  const severedAngle = isSheared
    ? fallProgress < 1
      ? interpolate(fallProgress, [0, 1], [22.5, 34])
      : interpolate(
          spring({
            frame: frame - crashFrame,
            fps,
            config: { damping: 12, stiffness: 140, mass: 3.0 },
          }),
          [0, 1],
          [34, 14] // Settles at 14° embedded in bedrock
        )
    : activeSag;

  return (
    <div
      className={`relative select-none ${className}`}
      style={{
        width: "1080px",
        height: "2400px",
        ...style,
      }}
    >
      {/* ======================================================== */}
      {/* 1. MASSIVE VERTICAL REACTION WALL (LEFT)                */}
      {/* ======================================================== */}
      <div
        className="absolute left-0 top-[280px] w-[180px] h-[1550px] bg-[#0c121e] border-r-4 border-slate-950 shadow-[20px_0_50px_rgba(0,0,0,0.85)] z-20 flex flex-col justify-between py-12"
        style={{
          backgroundImage:
            "linear-gradient(90deg, #090e17 0%, #111a2c 95%, #05080e 100%)",
        }}
      >
        {/* Massive Steel Mounting Flange Plate */}
        <div
          className="absolute right-0 top-[350px] w-[36px] h-[380px] bg-[#1a2436] border-y-4 border-l-4 border-slate-950 shadow-2xl flex flex-col justify-around items-center py-4"
        >
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="w-5 h-5 rounded-full bg-[#334155] border-2 border-black shadow-[inset_0_2px_4px_rgba(255,255,255,0.2)]"
            />
          ))}
        </div>

        {/* Vertical Structural Ribbing */}
        <div className="w-full h-full opacity-10 flex justify-around px-4">
          <div className="w-1 h-full bg-cyan-400" />
          <div className="w-1 h-full bg-cyan-400" />
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. THE ANCHOR STUMP (Attached to Wall)                   */}
      {/* ======================================================== */}
      <div
        className="absolute z-30"
        style={{
          left: `${wallX}px`,
          top: `${anchorY}px`,
          width: `${stumpWidth}px`,
          height: `${girderHeight}px`,
          transformOrigin: "0% 50%",
          transform: `rotate(${stumpAngle.toFixed(2)}deg)`,
        }}
      >
        {/* Girder Flanges & Body */}
        <div className="relative w-full h-full bg-[#121926] border-y-[6px] border-l-[6px] border-slate-950 shadow-[0_25px_40px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col justify-between">
          {/* Top Flange Specular Rim */}
          <div className="w-full h-7 bg-[#202c40] border-b-2 border-black flex items-center px-4">
            <div className="w-full h-[2px] bg-slate-400/40" />
          </div>

          {/* Internal Web Bracing */}
          <div className="w-full flex-1 flex items-center justify-center relative px-2">
            <div className="w-16 h-16 rounded-full border-4 border-black/80 bg-[#0a0f18] shadow-inner" />
          </div>

          {/* Bottom Flange */}
          <div className="w-full h-7 bg-[#172030] border-t-2 border-black" />

          {/* Hot Thermal Shear Face (When Snapped) */}
          {isSheared && (
            <div
              className="absolute right-0 top-0 w-8 h-full z-40"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(239, 68, 68, 0.4) 40%, #ef4444 85%, #f97316 100%)",
                clipPath:
                  "polygon(0% 0%, 100% 8%, 70% 30%, 100% 55%, 60% 75%, 100% 100%, 0% 100%)",
                boxShadow: "0 0 35px #ef4444",
              }}
            />
          )}

          {/* Incandescent Fracture Cracks (Pre-Shear Tension) */}
          {!isSheared && fracturePulse > 0.05 && (
            <div
              className="absolute right-0 top-0 w-24 h-full pointer-events-none"
              style={{
                opacity: fracturePulse,
                background:
                  "radial-gradient(ellipse at right, rgba(239,68,68,0.85) 0%, rgba(249,115,22,0.4) 50%, transparent 85%)",
                filter: "drop-shadow(0 0 12px #ef4444)",
              }}
            >
              {/* Jagged SVG Fissures */}
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <polyline
                  points="20,0 45,25 30,50 60,75 40,100"
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="3.5"
                />
                <polyline
                  points="50,0 70,30 55,60 85,85 70,100"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="4.5"
                />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. THE SEVERED / ACTIVE SPAN (Carries the Slabs)        */}
      {/* ======================================================== */}
      <div
        className="absolute z-30"
        style={{
          left: `${wallX + stumpWidth}px`,
          top: isSheared ? `${anchorY + freeFallY}px` : `${anchorY}px`,
          width: `${severedWidth}px`,
          height: `${girderHeight}px`,
          transformOrigin: isSheared ? "50% 50%" : "-160px 50%", // pivots from wall when intact
          transform: `rotate(${severedAngle.toFixed(2)}deg)`,
        }}
      >
        {/* Girder Structure */}
        <div className="relative w-full h-full bg-[#121926] border-y-[6px] border-r-[6px] border-slate-950 shadow-[0_30px_60px_rgba(0,0,0,0.9)] overflow-visible flex flex-col justify-between">
          {/* Top Flange Specular Rim */}
          <div className="w-full h-7 bg-[#202c40] border-b-2 border-black flex items-center px-4 relative">
            <div className="w-full h-[2px] bg-slate-400/50" />
            {/* Structural Rivet Line */}
            <div className="absolute top-1/2 -translate-y-1/2 left-8 flex space-x-12">
              {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="w-2.5 h-2.5 rounded-full bg-black/80" />
              ))}
            </div>
          </div>

          {/* Internal Web with Massive Weight-Reduction Cutouts */}
          <div className="w-full flex-1 flex items-center justify-around px-6 relative bg-[#0f1520]">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-24 h-24 rounded-full border-[5px] border-black bg-[#080c14] shadow-[inset_0_4px_10px_rgba(0,0,0,0.9)] flex items-center justify-center"
              >
                <div className="w-12 h-1 bg-cyan-500/20" />
              </div>
            ))}
            {/* Diagonal Truss Bracing Lines */}
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(45deg, transparent, transparent 35px, #000 35px, #000 45px)",
              }}
            />
          </div>

          {/* Bottom Flange */}
          <div className="w-full h-7 bg-[#172030] border-t-2 border-black" />

          {/* Left Sheared Edge (Jagged face when separated) */}
          {isSheared && (
            <div
              className="absolute left-0 top-0 w-8 h-full z-40"
              style={{
                background:
                  "linear-gradient(270deg, transparent 0%, rgba(239, 68, 68, 0.4) 40%, #ef4444 85%, #f97316 100%)",
                clipPath:
                  "polygon(100% 0%, 0% 12%, 35% 35%, 0% 55%, 45% 75%, 0% 100%, 100% 100%)",
                boxShadow: "0 0 35px #ef4444",
              }}
            />
          )}

          {/* ==================================================== */}
          {/* MAMMOTH LOAD MONOLITHS (DROPPED ONTO TOP FLANGE)     */}
          {/* ==================================================== */}
          {loads.map((ld) => {
            const hasLanded = frame >= ld.landFrame;
            if (!hasLanded) return null;

            // Individual drop spring animation
            const dropSpring = spring({
              frame: frame - ld.landFrame,
              fps,
              config: { damping: 13, stiffness: 130, mass: 2.0 },
            });
            const dropOffset = interpolate(dropSpring, [0, 1], [-360, 0]);

            // X placement relative to severed span
            const relativeLeft = ld.distanceX - stumpWidth;

            return (
              <div
                key={ld.id}
                className="absolute bottom-full mb-0 -translate-x-1/2 z-50 flex flex-col items-center"
                style={{
                  left: `${relativeLeft}px`,
                  transform: `translateY(${dropOffset}px)`,
                }}
              >
                {/* Heavy Cast-Steel Ballast Monolith (320px x 125px) */}
                <div className="w-[320px] h-[125px] bg-[#1e293b] border-[4px] border-[#020617] rounded-lg shadow-[0_25px_45px_rgba(0,0,0,0.9)] p-3 flex flex-col justify-between relative overflow-hidden">
                  {/* Top Specular Rim */}
                  <div className="absolute top-0 left-0 right-0 h-2 bg-slate-400/30" />

                  {/* Header Tag */}
                  <div className="flex justify-between items-center z-10">
                    <span className="font-mono text-[10px] font-black tracking-widest text-cyan-400 uppercase bg-cyan-950/70 px-2 py-0.5 rounded border border-cyan-700/50">
                      BALLAST UNIT
                    </span>
                    <span className="font-mono text-lg font-black text-rose-400 tracking-tight">
                      {ld.metric}
                    </span>
                  </div>

                  {/* Main Stamped Title */}
                  <div className="font-black text-2xl text-white tracking-tight leading-none z-10">
                    {ld.title}
                  </div>

                  {/* Structural Grip Base */}
                  <div className="w-full h-2.5 bg-[#0a0f18] rounded flex justify-between px-2 items-center">
                    {[0, 1, 2, 3, 4, 5, 6].map((b) => (
                      <div key={b} className="w-2.5 h-1 bg-slate-600 rounded-sm" />
                    ))}
                  </div>

                  {/* Metal Grate Overlay Texture */}
                  <div
                    className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(90deg, transparent, transparent 8px, #fff 8px, #fff 10px)",
                    }}
                  />
                </div>

                {/* Heavy Mounting Clamp (Coupling to Girder) */}
                <div className="w-16 h-4 bg-[#0a0f18] border-x-4 border-b-4 border-black" />
              </div>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. PERMANENT BEDROCK CRASH WRECKAGE (FRAME >= CRASH)    */}
      {/* ======================================================== */}
      {frame >= crashFrame && (
        <div
          className="absolute z-20 pointer-events-none"
          style={{
            left: `${wallX + 140}px`,
            top: `${floorY - 140}px`,
            width: "740px",
            height: "180px",
          }}
        >
          {/* Shattered Debris Blocks */}
          {[
            { x: 30, y: 30, w: 140, h: 80, rot: -18, col: "bg-slate-800" },
            { x: 180, y: 60, w: 200, h: 90, rot: 12, col: "bg-slate-900" },
            { x: 370, y: 20, w: 160, h: 85, rot: -8, col: "bg-zinc-800" },
            { x: 520, y: 50, w: 120, h: 70, rot: 25, col: "bg-slate-800" },
          ].map((d, idx) => (
            <div
              key={idx}
              className={`absolute ${d.col} border-4 border-black shadow-2xl rounded-sm`}
              style={{
                left: `${d.x}px`,
                top: `${d.y}px`,
                width: `${d.w}px`,
                height: `${d.h}px`,
                transform: `rotate(${d.rot}deg)`,
              }}
            >
              <div className="w-full h-full opacity-30 bg-gradient-to-br from-white/20 to-black/80" />
            </div>
          ))}

          {/* Impact Blast Radial Scorch Mark on Floor */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[120px] rounded-full bg-black/70 blur-xl -z-10"
          />
        </div>
      )}
    </div>
  );
};
