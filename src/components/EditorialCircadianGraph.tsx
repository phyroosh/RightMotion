import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Sun, Moon, Zap, AlertTriangle, Activity } from "lucide-react";

export interface EditorialCircadianGraphProps {
  /** Frame at which the graph card enters */
  entranceFrame?: number;
  /** Phase to highlight: 'morning' (sunlight trigger), 'midnight' (delayed spike), or 'both' */
  highlightPhase?: "morning" | "midnight" | "both";
  width?: number;
  height?: number;
  className?: string;
}

/**
 * 📈 EditorialCircadianGraph
 * High-craft editorial visual chart comparing:
 * 1. Healthy Circadian Cortisol (Sharp 8 AM awakening peak unlocking glucose & energy, smooth decline to midnight)
 * 2. Inverted Cortisol (Flat morning curve causing lethargy, abnormal midnight surge causing wired insomnia)
 */
export const EditorialCircadianGraph: React.FC<EditorialCircadianGraphProps> = ({
  entranceFrame = 0,
  highlightPhase = "both",
  width = 920,
  height = 540,
  className = "",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < entranceFrame) return null;

  const relFrame = frame - entranceFrame;

  // Spring entrance for entire card
  const spCard = spring({
    frame: relFrame,
    fps,
    config: { damping: 14, stiffness: 140, mass: 0.8 },
  });

  // Curve drawing springs
  const spHealthy = spring({
    frame: Math.max(0, relFrame - 8),
    fps,
    config: { damping: 16, stiffness: 110 },
  });

  const spInverted = spring({
    frame: Math.max(0, relFrame - 22),
    fps,
    config: { damping: 16, stiffness: 110 },
  });

  // SVG stroke offsets (path lengths ~ 600px)
  const healthyDash = interpolate(spHealthy, [0, 1], [650, 0]);
  const invertedDash = interpolate(spInverted, [0, 1], [650, 0]);

  // Midnight spike pulse
  const midnightPulse = Math.sin((frame / 30) * Math.PI * 2) * 0.15 + 0.85;

  return (
    <div
      className={`relative select-none pointer-events-none flex flex-col items-center ${className}`}
      style={{
        width: `${width}px`,
        opacity: spCard,
        transform: `scale(${interpolate(spCard, [0, 1], [0.88, 1])}) translateY(${interpolate(
          spCard,
          [0, 1],
          [40, 0]
        )}px) rotate(${interpolate(spCard, [0, 1], [-2, 0])}deg)`,
      }}
    >
      {/* Tactile 300gsm Archival Paper Card Frame */}
      <div
        className="w-full rounded-[44px] p-8 flex flex-col gap-5 relative overflow-hidden"
        style={{
          background: "linear-gradient(145deg, #ffffff 0%, #f9f7f4 100%)",
          border: "2px solid rgba(15, 23, 42, 0.09)",
          boxShadow:
            "0 32px 70px -15px rgba(15, 23, 42, 0.16), 0 10px 24px -5px rgba(15, 23, 42, 0.08), inset 0 2px 0 rgba(255, 255, 255, 0.9), inset 0 -2px 3px rgba(0, 0, 0, 0.04)",
        }}
      >
        {/* Card Header */}
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-600 shadow-sm">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sky-600 font-mono text-xs font-black tracking-widest uppercase">
                  CIRCADIAN TELEMETRY
                </span>
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                24-Hour Cortisol Deployment Curve
              </h3>
            </div>
          </div>

          {/* Key Legend Badges */}
          <div className="flex items-center gap-3">
            <div className="px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-300/80 text-emerald-800 font-mono font-bold text-xs flex items-center gap-1.5 shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>HEALTHY PEAK</span>
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-rose-50 border border-rose-300/80 text-rose-800 font-mono font-bold text-xs flex items-center gap-1.5 shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>INVERTED SPIKE</span>
            </div>
          </div>
        </div>

        {/* SVG Curve Plot */}
        <div className="relative w-full h-[250px]">
          <svg viewBox="0 0 800 230" fill="none" className="w-full h-full overflow-visible">
            {/* Background Grid Lines */}
            <line x1="60" y1="30" x2="760" y2="30" stroke="rgba(15, 23, 42, 0.06)" strokeDasharray="5 5" />
            <line x1="60" y1="90" x2="760" y2="90" stroke="rgba(15, 23, 42, 0.06)" strokeDasharray="5 5" />
            <line x1="60" y1="150" x2="760" y2="150" stroke="rgba(15, 23, 42, 0.06)" strokeDasharray="5 5" />
            <line x1="60" y1="200" x2="760" y2="200" stroke="rgba(15, 23, 42, 0.14)" strokeWidth="2" />

            {/* Time Axis Vertical Dashes */}
            <line x1="120" y1="25" x2="120" y2="200" stroke="rgba(15, 23, 42, 0.08)" strokeDasharray="4 4" />
            <line x1="320" y1="25" x2="320" y2="200" stroke="rgba(15, 23, 42, 0.08)" strokeDasharray="4 4" />
            <line x1="520" y1="25" x2="520" y2="200" stroke="rgba(15, 23, 42, 0.08)" strokeDasharray="4 4" />
            <line x1="720" y1="25" x2="720" y2="200" stroke="rgba(15, 23, 42, 0.08)" strokeDasharray="4 4" />

            {/* CURVE 1: HEALTHY CIRCADIAN (Emerald/Sky Blue) */}
            {/* Starts low at 6 AM (y=170), surges to peak at 8 AM (x=160, y=40), drops across noon and night */}
            <path
              d="M 60 180 C 100 170, 120 40, 170 38 C 240 38, 300 110, 420 135 C 550 160, 640 185, 760 190"
              stroke="#059669"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray="650"
              strokeDashoffset={healthyDash}
              style={{
                filter: "drop-shadow(0 4px 10px rgba(5, 150, 105, 0.25))",
              }}
            />

            {/* CURVE 2: INVERTED CORTISOL (Crimson/Rose) */}
            {/* Flat in morning (y=185), stays flat through noon, surges at midnight (x=720, y=32) */}
            <path
              d="M 60 185 C 140 185, 240 180, 360 175 C 480 165, 580 140, 680 70 C 710 45, 735 32, 760 30"
              stroke="#e11d48"
              strokeWidth="6.5"
              strokeLinecap="round"
              strokeDasharray="650"
              strokeDashoffset={invertedDash}
              style={{
                filter: "drop-shadow(0 4px 14px rgba(225, 29, 72, 0.35))",
              }}
            />

            {/* Healthy Peak Node (8 AM) */}
            {spHealthy > 0.85 && (
              <g>
                <circle cx="170" cy="38" r="14" fill="rgba(5, 150, 105, 0.2)" />
                <circle cx="170" cy="38" r="8" fill="#059669" />
                <circle cx="170" cy="38" r="4" fill="#ffffff" />
              </g>
            )}

            {/* Inverted Midnight Peak Node (12 AM) */}
            {spInverted > 0.85 && (
              <g>
                <circle
                  cx="740"
                  cy="32"
                  r={18 * midnightPulse}
                  fill="rgba(225, 29, 72, 0.25)"
                />
                <circle cx="740" cy="32" r="9" fill="#e11d48" />
                <circle cx="740" cy="32" r="4" fill="#ffffff" />
              </g>
            )}
          </svg>

          {/* Time Labels */}
          <div className="absolute inset-x-0 bottom-1 flex justify-between px-6 text-xs font-mono font-bold text-slate-500">
            <div className="flex flex-col items-center">
              <span className="text-slate-900 font-black">6:00 AM</span>
              <span className="text-[10px] text-amber-600 flex items-center gap-0.5">
                <Sun className="w-3 h-3" /> WAKE
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-slate-900 font-black">12:00 PM</span>
              <span className="text-[10px]">NOON</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-slate-900 font-black">6:00 PM</span>
              <span className="text-[10px]">DUSK</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-rose-600 font-black">12:00 AM</span>
              <span className="text-[10px] text-rose-600 flex items-center gap-0.5">
                <Moon className="w-3 h-3" /> MIDNIGHT
              </span>
            </div>
          </div>

          {/* Morning Sunlight Callout Badge */}
          {spHealthy > 0.9 && (
            <div
              className="absolute left-[13%] top-2 px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-mono font-black text-xs shadow-lg flex items-center gap-1.5 animate-in fade-in zoom-in duration-300"
              style={{
                boxShadow: "0 10px 25px -4px rgba(5, 150, 105, 0.4)",
              }}
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>8 AM DRIVE & GLUCOSE</span>
            </div>
          )}

          {/* Midnight Spike Alert Callout Badge */}
          {spInverted > 0.9 && (
            <div
              className="absolute right-[5%] top-2 px-3 py-1.5 rounded-xl bg-rose-600 text-white font-mono font-black text-xs shadow-lg flex items-center gap-1.5 animate-in fade-in zoom-in duration-300"
              style={{
                boxShadow: "0 10px 25px -4px rgba(225, 29, 72, 0.4)",
                transform: `scale(${midnightPulse})`,
              }}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-300" />
              <span>12 AM WIRED INSOMNIA</span>
            </div>
          )}
        </div>

        {/* Bottom Comparative Diagnostic Bar */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
          <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between text-left">
            <div>
              <div className="text-[11px] font-mono font-black text-emerald-700 uppercase">
                SUNLIGHT WITHIN 60 MIN
              </div>
              <div className="text-sm font-black text-slate-800">
                Natural Morning Energy Surge
              </div>
            </div>
            <span className="px-2 py-1 rounded-lg bg-emerald-600 text-white font-mono font-black text-xs">
              +94% DRIVE
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-rose-50/70 border border-rose-200 flex items-center justify-between text-left">
            <div>
              <div className="text-[11px] font-mono font-black text-rose-700 uppercase">
                NO SUNLIGHT / PHONE IN BED
              </div>
              <div className="text-sm font-black text-slate-800">
                Cortisol Inverts to Midnight
              </div>
            </div>
            <span className="px-2 py-1 rounded-lg bg-rose-600 text-white font-mono font-black text-xs">
              FLATLINE
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
