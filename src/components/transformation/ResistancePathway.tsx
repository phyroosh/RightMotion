import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export interface ResistancePathwayProps {
  /** Start frame for Pass 1 (high friction resistance) */
  pass1StartFrame: number;
  /** Duration of Pass 1 in frames (default: 45) */
  pass1Duration?: number;
  /** Start frame for Pass 2 (eroded low friction glide) */
  pass2StartFrame: number;
  /** Duration of Pass 2 in frames (default: 25) */
  pass2Duration?: number;
  /** Width of the component (default: 820px) */
  width?: number;
  /** Optional custom CSS class */
  className?: string;
}

/**
 * 🎬 RightMotion — ResistancePathway
 * ============================================================
 * Embodies the "Resistance Pathway Erosion & Friction Decay" mechanism.
 * 
 * Demonstrates: "The second compromise requires half the friction."
 * - Pass 1: Heavy friction, dragging progress, high resistance sparks, furrow carved.
 * - Pass 2: The carved groove allows effortless high-speed glide with half the friction.
 * - Action over display: The viewer WATCHES the pathway erode and friction collapse live.
 */
export const ResistancePathway: React.FC<ResistancePathwayProps> = ({
  pass1StartFrame,
  pass1Duration = 50,
  pass2StartFrame,
  pass2Duration = 30,
  width = 820,
  className = "",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Pass 1 Progress (0 -> 100%)
  const isPass1Active = frame >= pass1StartFrame;
  const pass1Progress = interpolate(
    frame,
    [pass1StartFrame, pass1StartFrame + pass1Duration],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Pass 2 Progress (0 -> 100%) - Much faster traversal
  const isPass2Active = frame >= pass2StartFrame;
  const pass2Progress = interpolate(
    frame,
    [pass2StartFrame, pass2StartFrame + pass2Duration],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Worn groove depth (0 -> 1)
  const grooveDepth = interpolate(
    frame,
    [pass1StartFrame + pass1Duration * 0.4, pass1StartFrame + pass1Duration],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Live friction readout
  const currentFriction = isPass2Active
    ? Math.round(interpolate(pass2Progress, [0, 1], [100, 48]))
    : 100;

  // Spring for Pass 2 arrival
  const pass2Spring = spring({
    frame: frame - pass2StartFrame,
    fps,
    config: { damping: 14, stiffness: 150, mass: 0.5 },
  });

  return (
    <div
      className={`relative flex flex-col gap-6 p-8 rounded-3xl bg-white border-[3px] border-slate-900 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.16)] select-none ${className}`}
      style={{ width }}
    >
      {/* Header Metric Bar */}
      <div className="w-full flex items-center justify-between border-b-[2px] border-slate-100 pb-4">
        <div className="flex flex-col">
          <span className="text-[36px] font-mono font-bold text-slate-500 uppercase">
            PATHWAY FRICTION PROFILE
          </span>
          <span className="text-[44px] font-black uppercase text-[#090d16] tracking-tight">
            {isPass2Active ? "2ND COMPROMISE" : "1ST COMPROMISE"}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span
            className={`text-[56px] font-mono font-black ${
              isPass2Active ? "text-rose-600" : "text-slate-900"
            }`}
          >
            {currentFriction}%
          </span>
          <span className="text-[36px] font-mono font-bold text-slate-500 uppercase">
            {isPass2Active ? "−52% DRAG" : "MAX RESISTANCE"}
          </span>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* THE PHYSICAL KINETIC TRACK (820px wide)                       */}
      {/* ------------------------------------------------------------- */}
      <div className="relative w-full h-[140px] rounded-2xl bg-slate-100 border-[2.5px] border-slate-300 overflow-hidden flex items-center px-4">
        {/* The Eroded Furrow / Worn Groove in the Channel Floor */}
        <div
          className="absolute inset-x-4 h-[44px] rounded-xl bg-slate-200 border border-slate-300 transition-all pointer-events-none"
          style={{
            opacity: grooveDepth,
            boxShadow: grooveDepth > 0 ? "inset 0 3px 8px rgba(0,0,0,0.12)" : "none",
          }}
        >
          {grooveDepth > 0.5 && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[32px] font-mono font-bold text-slate-400 uppercase tracking-widest">
              WORN GROOVE
            </span>
          )}
        </div>

        {/* PASS 1: Heavy dragging mass (Frames pass1StartFrame -> pass1StartFrame + pass1Duration) */}
        {isPass1Active && !isPass2Active && (
          <div
            className="absolute z-10 flex items-center gap-2 transition-all"
            style={{
              left: `${16 + pass1Progress * 380}px`,
            }}
          >
            <div className="px-4 py-2 rounded-xl bg-slate-900 text-white border-[2px] border-slate-950 shadow-xl flex items-center gap-2">
              <span className="text-[36px] font-black uppercase tracking-tight">
                🛑 1ST PASS
              </span>
            </div>
            {/* Drag Resistance Ripple */}
            <span className="text-[36px] font-mono font-black text-rose-600">
              ◀◀ DRAG
            </span>
          </div>
        )}

        {/* PASS 2: Effortless gliding mass (Frames pass2StartFrame -> pass2StartFrame + pass2Duration) */}
        {isPass2Active && (
          <div
            className="absolute z-20 flex items-center gap-2 transition-all"
            style={{
              left: `${16 + pass2Progress * 380}px`,
              transform: `scale(${interpolate(pass2Spring, [0, 1], [0.92, 1])})`,
            }}
          >
            <div className="px-5 py-2 rounded-xl bg-rose-600 text-white border-[2px] border-slate-950 shadow-2xl flex items-center gap-2">
              <span className="text-[36px] font-black uppercase tracking-tight">
                ⚡ 2ND PASS
              </span>
            </div>
            {/* Speed Streamlines */}
            <span className="text-[36px] font-mono font-black text-amber-500">
              ▶▶ GLIDE
            </span>
          </div>
        )}
      </div>

      {/* Footer Realization Bar */}
      <div className="w-full flex items-center justify-between pt-1">
        <span className="text-[36px] font-mono font-bold text-slate-600 uppercase">
          {isPass2Active ? "BRAIN TRACKS PRECEDENT" : "CONSCIOUS FRICTION"}
        </span>
        <span
          className={`text-[36px] font-mono font-black uppercase ${
            isPass2Active ? "text-rose-600" : "text-slate-500"
          }`}
        >
          {isPass2Active ? "AUTOMATIC DOWNHILL SLIDE" : "HIGH WILLPOWER COST"}
        </span>
      </div>
    </div>
  );
};
