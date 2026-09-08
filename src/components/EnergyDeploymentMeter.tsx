import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Zap, BatteryCharging, BatteryWarning, Sun, Sparkles } from "lucide-react";

export interface EnergyDeploymentMeterProps {
  entranceFrame?: number;
  width?: number;
  className?: string;
}

/**
 * ⚡ EnergyDeploymentMeter
 * Animated biological meter illustrating cortisol's primary evolutionary function:
 * Deploying cellular glucose, physical drive, and autonomic alertness.
 */
export const EnergyDeploymentMeter: React.FC<EnergyDeploymentMeterProps> = ({
  entranceFrame = 0,
  width = 920,
  className = "",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < entranceFrame) return null;

  const relFrame = frame - entranceFrame;

  const spCard = spring({
    frame: relFrame,
    fps,
    config: { damping: 14, stiffness: 140, mass: 0.8 },
  });

  const spBars = spring({
    frame: Math.max(0, relFrame - 10),
    fps,
    config: { damping: 15, stiffness: 120 },
  });

  const glucoseWithSun = Math.round(interpolate(spBars, [0, 1], [0, 94]));
  const glucoseWithoutSun = Math.round(interpolate(spBars, [0, 1], [0, 14]));

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
        )}px)`,
      }}
    >
      <div
        className="w-full rounded-[44px] p-8 flex flex-col gap-6 relative overflow-hidden"
        style={{
          background: "linear-gradient(145deg, #ffffff 0%, #fbf9f6 100%)",
          border: "2px solid rgba(15, 23, 42, 0.09)",
          boxShadow:
            "0 32px 70px -15px rgba(15, 23, 42, 0.16), 0 10px 24px -5px rgba(15, 23, 42, 0.08), inset 0 2px 0 rgba(255, 255, 255, 0.9)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 shadow-sm">
              <Zap className="w-6 h-6 fill-amber-500 text-amber-500" />
            </div>
            <div>
              <div className="text-amber-600 font-mono text-xs font-black tracking-widest uppercase">
                CELLULAR BIO-TELEMETRY
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                Cortisol: Energy Deployment Engine
              </h3>
            </div>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white font-mono font-bold text-xs flex items-center gap-1.5 shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>GLUCOSE UNLOCK</span>
          </div>
        </div>

        {/* Meters Comparison */}
        <div className="flex flex-col gap-5">
          {/* Optimal Morning Deployment (With Sunlight) */}
          <div className="p-5 rounded-3xl bg-emerald-50/80 border border-emerald-300/80 flex flex-col gap-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                  <Sun className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-mono text-xs font-black text-emerald-800 uppercase tracking-wide">
                    WITH MORNING SUNLIGHT (60 MIN)
                  </span>
                  <div className="text-base font-black text-slate-900">
                    Active Glucose Deployment & Physical Drive
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono font-black text-3xl text-emerald-700">
                  {glucoseWithSun}%
                </span>
                <span className="text-[11px] font-mono text-emerald-600 block -mt-1 font-bold">
                  OPTIMAL
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-4 rounded-full bg-emerald-200/70 overflow-hidden p-0.5 shadow-inner">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 shadow-md transition-all"
                style={{ width: `${glucoseWithSun}%` }}
              />
            </div>
          </div>

          {/* Suppressed / Inverted Deployment (Without Sunlight) */}
          <div className="p-5 rounded-3xl bg-rose-50/80 border border-rose-300/80 flex flex-col gap-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-sm">
                  <BatteryWarning className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-mono text-xs font-black text-rose-800 uppercase tracking-wide">
                    WITHOUT SUNLIGHT (PHONE IN BED)
                  </span>
                  <div className="text-base font-black text-slate-900">
                    Morning Glucose Flatline • Severe Lethargy
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono font-black text-3xl text-rose-700">
                  {glucoseWithoutSun}%
                </span>
                <span className="text-[11px] font-mono text-rose-600 block -mt-1 font-bold">
                  FLATLINE
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-4 rounded-full bg-rose-200/70 overflow-hidden p-0.5 shadow-inner">
              <div
                className="h-full rounded-full bg-gradient-to-r from-rose-500 to-red-400 shadow-md transition-all"
                style={{ width: `${glucoseWithoutSun}%` }}
              />
            </div>
          </div>
        </div>

        {/* Footer Insight Tag */}
        <div className="p-3.5 rounded-2xl bg-slate-100 border border-slate-200/90 text-center font-mono text-xs font-bold text-slate-700 flex items-center justify-center gap-2">
          <span>⚠️ Cortisol is NOT just stress — it is your physical engine.</span>
        </div>
      </div>
    </div>
  );
};
